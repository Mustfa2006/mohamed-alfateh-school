'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Download, Eye } from 'lucide-react'
import { supabase, Schedule } from '@/lib/supabase'
import Image from 'next/image'

interface ScheduleViewerProps {
  gradeId: string
  sectionId: string
  gradeName: string
  sectionName: string
  shift: 'A' | 'B'
  onBack: () => void
}

export default function ScheduleViewer({ gradeId, sectionId, gradeName, sectionName, shift, onBack }: ScheduleViewerProps) {
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)

  const fetchSchedule = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('grade_id', gradeId)
        .eq('section_id', sectionId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // لا يوجد جدول - هذا طبيعي
          setSchedule(null)
        } else {
          throw error
        }
      } else {
        setSchedule(data)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
      // لا نعرض جدول وهمي، نترك schedule كـ null
      setSchedule(null)
    } finally {
      setLoading(false)
    }
  }, [gradeId, sectionId])



  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  const downloadSchedule = async () => {
    if (schedule?.image_url) {
      try {
        // تحميل الصورة كـ blob لضمان التحميل وليس الفتح
        const response = await fetch(schedule.image_url)
        const blob = await response.blob()

        // إنشاء URL مؤقت للـ blob
        const url = window.URL.createObjectURL(blob)

        // إنشاء رابط التحميل
        const link = document.createElement('a')
        link.href = url
        link.download = `جدول-${gradeName}-شعبة-${sectionName}.jpg`

        // إضافة الرابط للصفحة وتفعيله ثم حذفه
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // تنظيف URL المؤقت
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading schedule:', error)
        alert('حدث خطأ أثناء تحميل الجدول')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4">جاري تحميل الجدول...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-8">
      {/* زر العودة */}
      <div className="mb-6">
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

      {/* العناوين في الوسط بالضبط */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">الجدول الدراسي</h2>
        <p className="text-white/80 text-lg">
          {gradeName} - شعبة {sectionName} - الوجبة {shift}
        </p>
      </div>

      {schedule && schedule.image_url ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 my-auto"
        >
          {/* Schedule Info */}
          <div className="glass-effect p-6 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-white font-semibold text-lg">معلومات الجدول</h3>
                  <p className="text-white/70 text-sm">
                    آخر تحديث: {new Date(schedule.updated_at).toLocaleDateString('en-GB', {
                      timeZone: 'Asia/Baghdad',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })} - {new Date(schedule.updated_at).toLocaleTimeString('en-GB', {
                      timeZone: 'Asia/Baghdad',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={downloadSchedule}
                className="epic-button-green px-6 py-3 rounded-xl flex items-center gap-3 mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 text-white" />
                <span className="text-white font-bold">تحميل</span>
              </motion.button>
            </div>
          </div>

          {/* Schedule Image */}
          <div className="glass-effect p-4 rounded-xl border border-white/20">
            <div className="relative bg-white rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              )}

              <Image
                src={schedule.image_url}
                alt={`جدول ${gradeName} شعبة ${sectionName}`}
                width={800}
                height={600}
                className="w-full h-auto"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  console.error('Failed to load schedule image')
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-12 rounded-xl border border-white/20 text-center my-auto"
        >
          <Eye className="w-20 h-20 text-white/50 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-4">لا يوجد جدول متاح</h3>
          <p className="text-white/70 text-lg leading-relaxed">
            لم يتم رفع جدول دراسي لهذا الصف والشعبة بعد.<br />
            يرجى المحاولة لاحقاً أو التواصل مع إدارة المدرسة.
          </p>
        </motion.div>
      )}
    </div>
  )
}
