'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import dynamic from 'next/dynamic'

const ShiftSelector = dynamic(() => import('@/components/ShiftSelector'), { ssr: false })
const GradeSelector = dynamic(() => import('@/components/GradeSelector'), { ssr: false })
const ScheduleViewer = dynamic(() => import('@/components/ScheduleViewer'), { ssr: false })

export default function Home() {
  const [selectedShift, setSelectedShift] = useState<'A' | 'B' | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [gradeName, setGradeName] = useState<string | null>(null)
  const [sectionName, setSectionName] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)

  // Preload next screens' chunks to make transitions instant
  useEffect(() => {
    import('@/components/GradeSelector')
    import('@/components/ScheduleViewer')
  }, [])

  const handleShiftSelect = (shift: 'A' | 'B') => {
    setSelectedShift(shift)
    setSelectedGrade(null)
    setSelectedSection(null)
    setShowSchedule(false)
  }

  const handleGradeSelect = (gradeId: string, sectionId: string, gName: string, sName: string) => {
    setSelectedGrade(gradeId)
    setSelectedSection(sectionId)
    setGradeName(gName)
    setSectionName(sName)
    setShowSchedule(true)
  }

  const resetSelection = () => {
    setSelectedShift(null)
    setSelectedGrade(null)
    setSelectedSection(null)
    setGradeName(null)
    setSectionName(null)
    setShowSchedule(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto my-auto">
        {/* شعار المدرسة المذهل في الوسط */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* اسم المدرسة الخرافي */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-16"
        >
          <div className="glass-effect p-8 mb-6 relative overflow-hidden">
            {/* تأثير الإضاءة العلوية */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

            <motion.h1
              className="text-4xl md:text-5xl font-black school-title mb-4 leading-tight"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              مدرسة محمد الفاتح
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center"
            >
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <p className="text-white/90 text-lg font-semibold px-4">
                الجداول الدراسية
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-emerald-400"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="glass-effect p-8 rounded-xl">
          {!selectedShift && (
            <ShiftSelector onShiftSelect={handleShiftSelect} />
          )}

          {selectedShift && !showSchedule && (
            <GradeSelector
              shift={selectedShift}
              onGradeSelect={handleGradeSelect}
              onBack={resetSelection}
            />
          )}

          {showSchedule && selectedGrade && selectedSection && (
            <ScheduleViewer
              gradeId={selectedGrade}
              sectionId={selectedSection}
              gradeName={gradeName || ''}
              sectionName={sectionName || ''}
              shift={selectedShift!}
              onBack={() => setShowSchedule(false)}
            />
          )}
        </div>


      </div>
    </div>
  )
}
