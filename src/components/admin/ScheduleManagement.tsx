'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Eye, Trash2, Calendar } from 'lucide-react'
import { supabase, Grade, Section, Schedule } from '@/lib/supabase'
import Image from 'next/image'

interface ScheduleManagementProps {
  onStatsUpdate: () => void
}

export default function ScheduleManagement({ onStatsUpdate }: ScheduleManagementProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [sections, setSections] = useState<{ [key: string]: Section[] }>({})
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [gradesRes, schedulesRes] = await Promise.all([
        supabase.from('grades').select('*').order('shift').order('name'),
        supabase.from('schedules').select('*')
      ])

      if (gradesRes.data) {
        setGrades(gradesRes.data)
        
        // Fetch sections for each grade
        for (const grade of gradesRes.data) {
          const sectionsRes = await supabase
            .from('sections')
            .select('*')
            .eq('grade_id', grade.id)
            .order('name')
          
          if (sectionsRes.data) {
            setSections(prev => ({ ...prev, [grade.id]: sectionsRes.data }))
          }
        }
      }

      if (schedulesRes.data) {
        setSchedules(schedulesRes.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadSchedule = async () => {
    if (!selectedFile || !selectedGrade || !selectedSection) {
      alert('يرجى اختيار الصف والشعبة والملف')
      return
    }

    setUploading(true)

    try {
      // إنشاء FormData لرفع الملف
      const formData = new FormData()
      formData.append('file', selectedFile)

      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${selectedGrade}-${selectedSection}-${Date.now()}.${fileExt}`

      console.log('Uploading via API:', fileName)
      console.log('File size:', selectedFile.size)
      console.log('File type:', selectedFile.type)

      // رفع الملف عبر API endpoint
      const response = await fetch('/api/upload-schedule', {
        method: 'POST',
        headers: {
          'X-File-Name': fileName,
          'X-Grade': selectedGrade,
          'X-Section': selectedSection,
        },
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'فشل في رفع الملف')
      }

      console.log('Upload successful:', result)

      // Reset form
      setSelectedFile(null)
      setPreviewUrl(null)
      setSelectedGrade('')
      setSelectedSection('')

      alert('تم رفع الجدول بنجاح!')

      // Refresh data
      await fetchData()
      onStatsUpdate()
    } catch (error) {
      console.error('Error uploading schedule:', error)
      alert('حدث خطأ أثناء رفع الجدول')
    } finally {
      setUploading(false)
    }
  }

  const deleteSchedule = async (scheduleId: string, imageUrl: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
      return
    }

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId)

      if (dbError) throw dbError

      // Delete from storage
      const fileName = imageUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('schedules')
          .remove([fileName])
      }

      // Refresh data
      await fetchData()
      onStatsUpdate()
      
      alert('تم حذف الجدول بنجاح!')
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('حدث خطأ أثناء حذف الجدول')
    }
  }

  const getGradeName = (gradeId: string) => {
    return grades.find(g => g.id === gradeId)?.name || ''
  }

  const getSectionName = (sectionId: string) => {
    for (const gradeSections of Object.values(sections)) {
      const section = gradeSections.find(s => s.id === sectionId)
      if (section) return section.name
    }
    return ''
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
    <div className="space-y-8 py-8 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">إدارة الجداول الدراسية</h2>
        <p className="text-white/70 mt-2">رفع وتعديل جداول الصفوف والشعب</p>
      </div>

      {/* Upload Form */}
      <div className="glass-effect p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">رفع جدول جديد</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">الصف</label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value)
                setSelectedSection('')
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            >
              <option value="">اختر الصف</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name} - الوجبة {grade.shift}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">الشعبة</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedGrade}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 disabled:opacity-50"
            >
              <option value="">اختر الشعبة</option>
              {selectedGrade && sections[selectedGrade]?.map((section) => (
                <option key={section.id} value={section.id}>
                  شعبة {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white/80 text-sm font-medium mb-2">صورة الجدول</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <p className="text-white/80 text-sm font-medium mb-2">معاينة:</p>
            <div className="relative w-full max-w-md">
              <Image
                src={previewUrl}
                alt="معاينة الجدول"
                width={400}
                height={300}
                className="w-full h-auto rounded-lg border border-white/20"
              />
            </div>
          </div>
        )}

        <button
          onClick={uploadSchedule}
          disabled={uploading || !selectedFile || !selectedGrade || !selectedSection}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? 'جاري الرفع...' : 'رفع الجدول'}</span>
        </button>
      </div>

      {/* Existing Schedules */}
      <div className="glass-effect p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">الجداول المرفوعة</h3>
        
        {schedules.length === 0 ? (
          <p className="text-white/70 text-center py-8">لا توجد جداول مرفوعة بعد</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-white">
                      {getGradeName(schedule.grade_id)}
                    </h4>
                    <p className="text-white/70 text-sm">
                      شعبة {getSectionName(schedule.section_id)}
                    </p>
                  </div>
                </div>

                {schedule.image_url && (
                  <div className="mb-3">
                    <Image
                      src={schedule.image_url}
                      alt="جدول دراسي"
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded border border-white/20"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">
                    {new Date(schedule.updated_at).toLocaleDateString('ar-SA')}
                  </span>
                  <div className="flex gap-2">
                    {schedule.image_url && (
                      <a
                        href={schedule.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => deleteSchedule(schedule.id, schedule.image_url || '')}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* مسافة إضافية من الأسفل */}
      <div className="mb-32"></div>
    </div>
  )
}
