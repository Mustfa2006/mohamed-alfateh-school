'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, BookOpen, Users } from 'lucide-react'
import { supabase, Grade, Section } from '@/lib/supabase'

interface GradeManagementProps {
  onStatsUpdate: () => void
}

export default function GradeManagement({ onStatsUpdate }: GradeManagementProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [sections, setSections] = useState<{ [key: string]: Section[] }>({})
  const [loading, setLoading] = useState(true)
  const [showAddGrade, setShowAddGrade] = useState(false)
  const [showAddSection, setShowAddSection] = useState<string | null>(null)
  const [newGradeName, setNewGradeName] = useState('')
  const [newGradeShift, setNewGradeShift] = useState<'A' | 'B'>('A')
  const [newSectionName, setNewSectionName] = useState('')

  const fetchGrades = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('shift')
        .order('name')

      if (error) throw error
      setGrades(data || [])

      // Fetch sections for each grade
      for (const grade of data || []) {
        await fetchSections(grade.id)
      }
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  const fetchSections = async (gradeId: string) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('grade_id', gradeId)
        .order('name')

      if (error) throw error
      setSections(prev => ({ ...prev, [gradeId]: data || [] }))
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const addGrade = async () => {
    if (!newGradeName.trim()) return

    try {
      const { data, error } = await supabase
        .from('grades')
        .insert([{ name: newGradeName, shift: newGradeShift }])
        .select()

      if (error) throw error
      
      setGrades(prev => [...prev, data[0]])
      setNewGradeName('')
      setShowAddGrade(false)
      onStatsUpdate()
    } catch (error) {
      console.error('Error adding grade:', error)
    }
  }

  const deleteGrade = async (gradeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصف؟ سيتم حذف جميع الشعب والجداول المرتبطة به.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', gradeId)

      if (error) throw error
      
      setGrades(prev => prev.filter(g => g.id !== gradeId))
      setSections(prev => {
        const newSections = { ...prev }
        delete newSections[gradeId]
        return newSections
      })
      onStatsUpdate()
    } catch (error) {
      console.error('Error deleting grade:', error)
    }
  }

  const addSection = async (gradeId: string) => {
    if (!newSectionName.trim()) return

    try {
      const { data, error } = await supabase
        .from('sections')
        .insert([{ grade_id: gradeId, name: newSectionName }])
        .select()

      if (error) throw error
      
      setSections(prev => ({
        ...prev,
        [gradeId]: [...(prev[gradeId] || []), data[0]]
      }))
      setNewSectionName('')
      setShowAddSection(null)
      onStatsUpdate()
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const deleteSection = async (sectionId: string, gradeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشعبة؟ سيتم حذف الجدول المرتبط بها.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId)

      if (error) throw error
      
      setSections(prev => ({
        ...prev,
        [gradeId]: prev[gradeId]?.filter(s => s.id !== sectionId) || []
      }))
      onStatsUpdate()
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">إدارة الصفوف والشعب</h2>
        <button
          onClick={() => setShowAddGrade(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صف جديد</span>
        </button>
      </div>

      {/* Add Grade Modal */}
      {showAddGrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect p-6 rounded-xl border border-white/20 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">إضافة صف جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">اسم الصف</label>
                <input
                  type="text"
                  value={newGradeName}
                  onChange={(e) => setNewGradeName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="مثال: الصف الأول"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">الوجبة</label>
                <select
                  value={newGradeShift}
                  onChange={(e) => setNewGradeShift(e.target.value as 'A' | 'B')}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                >
                  <option value="A">الوجبة الأولى (A)</option>
                  <option value="B">الوجبة الثانية (B)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addGrade}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  إضافة
                </button>
                <button
                  onClick={() => {
                    setShowAddGrade(false)
                    setNewGradeName('')
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grades List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['A', 'B'].map((shift) => (
          <div key={shift} className="glass-effect p-6 rounded-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              الوجبة {shift === 'A' ? 'الأولى' : 'الثانية'} ({shift})
            </h3>
            
            <div className="space-y-4">
              {grades.filter(g => g.shift === shift).map((grade) => (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <h4 className="font-semibold text-white">{grade.name}</h4>
                    </div>
                    <button
                      onClick={() => deleteGrade(grade.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">الشعب:</span>
                      <button
                        onClick={() => setShowAddSection(grade.id)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {sections[grade.id]?.map((section) => (
                      <div key={section.id} className="flex items-center justify-between bg-white/5 rounded p-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="text-white text-sm">شعبة {section.name}</span>
                        </div>
                        <button
                          onClick={() => deleteSection(section.id, grade.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {showAddSection === grade.id && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/40"
                          placeholder="اسم الشعبة"
                        />
                        <button
                          onClick={() => addSection(grade.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          إضافة
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSection(null)
                            setNewSectionName('')
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* مسافة إضافية من الأسفل */}
      <div className="mb-32"></div>
    </div>
  )
}
