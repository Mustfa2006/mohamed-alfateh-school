'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, BookOpen } from 'lucide-react'
import { supabase, Grade, Section } from '@/lib/supabase'

interface GradeSelectorProps {
  shift: 'A' | 'B'
  onGradeSelect: (gradeId: string, sectionId: string) => void
  onBack: () => void
}

export default function GradeSelector({ shift, onGradeSelect, onBack }: GradeSelectorProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [sections, setSections] = useState<{ [key: string]: Section[] }>({})

  const [loading, setLoading] = useState(true)

  // ترتيب الصفوف المطلوب
  const gradeOrder = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']

  const sortGrades = (grades: Grade[]) => {
    return grades.sort((a, b) => {
      const indexA = gradeOrder.indexOf(a.name)
      const indexB = gradeOrder.indexOf(b.name)
      return indexA - indexB
    })
  }

  const fetchGrades = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('shift', shift)

      if (error) throw error

      // ترتيب الصفوف حسب الترتيب المطلوب
      const sortedGrades = sortGrades(data || [])
      setGrades(sortedGrades)

      // اجلب الشعب لكل الصفوف في طلب واحد لتقليل عدد الاتصالات
      const gradeIds = (sortedGrades || []).map(g => g.id)
      if (gradeIds.length > 0) {
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .in('grade_id', gradeIds)
          .order('name')

        if (sectionsError) throw sectionsError

        const map: { [key: string]: Section[] } = {}
        for (const s of sectionsData || []) {
          if (!map[s.grade_id]) map[s.grade_id] = []
          map[s.grade_id].push(s)
        }
        setSections(map)
      } else {
        setSections({})
      }
    } catch (error) {
      console.error('Error fetching grades:', error)
      // استخدام البيانات المطلوبة حسب الوجبة (fallback)
      if (shift === 'A') {
        setGrades([
          { id: '1', name: 'الأول', shift, created_at: new Date().toISOString() },
          { id: '2', name: 'الثاني', shift, created_at: new Date().toISOString() },
          { id: '3', name: 'الثالث', shift, created_at: new Date().toISOString() },
          { id: '4', name: 'الرابع', shift, created_at: new Date().toISOString() },
          { id: '5', name: 'الخامس', shift, created_at: new Date().toISOString() },
          { id: '6', name: 'السادس', shift, created_at: new Date().toISOString() },
        ])

        setSections({
          '1': [{ id: '1-1', grade_id: '1', name: 'أ', created_at: new Date().toISOString() }],
          '2': [
            { id: '2-1', grade_id: '2', name: 'أ', created_at: new Date().toISOString() },
            { id: '2-2', grade_id: '2', name: 'ب', created_at: new Date().toISOString() }
          ],
          '3': [
            { id: '3-1', grade_id: '3', name: 'أ', created_at: new Date().toISOString() },
            { id: '3-2', grade_id: '3', name: 'ب', created_at: new Date().toISOString() }
          ],
          '4': [{ id: '4-1', grade_id: '4', name: 'أ', created_at: new Date().toISOString() }],
          '5': [
            { id: '5-1', grade_id: '5', name: 'أ', created_at: new Date().toISOString() },
            { id: '5-2', grade_id: '5', name: 'ب', created_at: new Date().toISOString() },
            { id: '5-3', grade_id: '5', name: 'ج', created_at: new Date().toISOString() }
          ],
          '6': [
            { id: '6-1', grade_id: '6', name: 'أ', created_at: new Date().toISOString() },
            { id: '6-2', grade_id: '6', name: 'ب', created_at: new Date().toISOString() }
          ],
        })
      } else {
        setGrades([
          { id: '1', name: 'الأول', shift, created_at: new Date().toISOString() },
          { id: '2', name: 'الثاني', shift, created_at: new Date().toISOString() },
          { id: '3', name: 'الثالث', shift, created_at: new Date().toISOString() },
          { id: '4', name: 'الرابع', shift, created_at: new Date().toISOString() },
          { id: '5', name: 'الخامس', shift, created_at: new Date().toISOString() },
          { id: '6', name: 'السادس', shift, created_at: new Date().toISOString() },
        ])

        setSections({
          '1': [{ id: '1-1', grade_id: '1', name: 'أ', created_at: new Date().toISOString() }],
          '2': [{ id: '2-2', grade_id: '2', name: 'ب', created_at: new Date().toISOString() }],
          '3': [{ id: '3-1', grade_id: '3', name: 'أ', created_at: new Date().toISOString() }],
          '4': [
            { id: '4-1', grade_id: '4', name: 'أ', created_at: new Date().toISOString() },
            { id: '4-2', grade_id: '4', name: 'ب', created_at: new Date().toISOString() }
          ],
          '5': [
            { id: '5-1', grade_id: '5', name: 'أ', created_at: new Date().toISOString() },
            { id: '5-2', grade_id: '5', name: 'ب', created_at: new Date().toISOString() }
          ],
          '6': [
            { id: '6-1', grade_id: '6', name: 'أ', created_at: new Date().toISOString() },
            { id: '6-2', grade_id: '6', name: 'ب', created_at: new Date().toISOString() }
          ],
        })
      }
    } finally {
      setLoading(false)
    }
  }, [shift])

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

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-8">
      {/* زر العودة */}
      <div className="mb-4">
        <motion.button
          onClick={onBack}
          className="epic-button px-6 py-3 rounded-xl flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-lg">العودة</span>
        </motion.button>
      </div>

      {/* العنوان في الوسط */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">اختر الصف والشعبة</h2>
      </div>

      <div className="space-y-8 my-auto">
        {grades.map((grade, index) => (
          <motion.div
            key={grade.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl border-2 border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
              <h3 className="text-xl font-bold text-white text-center">{grade.name}</h3>
            </div>

            <div className="p-10 space-y-10">
              {sections[grade.id]?.map((section, sectionIndex) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (sectionIndex * 0.05) }}
                  onClick={() => onGradeSelect(grade.id, section.id)}
                  className="w-full epic-button p-5 rounded-xl flex items-center justify-between group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{section.name}</span>
                    </div>
                    <span className="text-white font-bold">شعبة {section.name}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white rotate-180 transition-colors" />
                </motion.button>
              )) || (
                <p className="text-white/60 text-center p-4">لا توجد شعب متاحة</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
