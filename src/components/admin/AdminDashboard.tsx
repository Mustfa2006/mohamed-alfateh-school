'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Upload, 
  Settings, 
  LogOut,
  Calendar,
  Image as ImageIcon
} from 'lucide-react'
import GradeManagement from './GradeManagement'
import ScheduleManagement from './ScheduleManagement'
import { supabase } from '@/lib/supabase'

interface AdminDashboardProps {
  onLogout: () => void
}

type TabType = 'overview' | 'grades' | 'schedules' | 'settings'

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState({
    totalGrades: 0,
    totalSections: 0,
    totalSchedules: 0,
    lastUpdate: ''
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [gradesRes, sectionsRes, schedulesRes] = await Promise.all([
        supabase.from('grades').select('id', { count: 'exact' }),
        supabase.from('sections').select('id', { count: 'exact' }),
        supabase.from('schedules').select('updated_at').order('updated_at', { ascending: false }).limit(1)
      ])

      setStats({
        totalGrades: gradesRes.count || 0,
        totalSections: sectionsRes.count || 0,
        totalSchedules: schedulesRes.count || 0,
        lastUpdate: schedulesRes.data?.[0]?.updated_at ?
          new Date(schedulesRes.data[0].updated_at).toLocaleDateString('en-GB', {
            timeZone: 'Asia/Baghdad',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }) + ' - ' + new Date(schedulesRes.data[0].updated_at).toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Baghdad',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : 'لا يوجد'
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'grades', label: 'إدارة الصفوف', icon: BookOpen },
    { id: 'schedules', label: 'إدارة الجداول', icon: Calendar },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">نظرة عامة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-effect p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">إجمالي الصفوف</p>
                    <p className="text-2xl font-bold text-white">{stats.totalGrades}</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">إجمالي الشعب</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSections}</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">الجداول المرفوعة</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSchedules}</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">آخر تحديث</p>
                    <p className="text-sm font-medium text-white">
                      {stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleDateString('ar-SA') : 'لا يوجد'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">الإجراءات السريعة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('schedules')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Upload className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">رفع جدول جديد</span>
                </button>
                <button
                  onClick={() => setActiveTab('grades')}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">إدارة الصفوف</span>
                </button>
              </div>
            </div>
            {/* مسافة إضافية من الأسفل */}
            <div className="mb-32"></div>
          </div>
        )
      case 'grades':
        return <GradeManagement onStatsUpdate={fetchStats} />
      case 'schedules':
        return <ScheduleManagement onStatsUpdate={fetchStats} />
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">الإعدادات</h2>
            <div className="glass-effect p-6 rounded-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">إعدادات النظام</h3>
              <p className="text-white/70">ستتم إضافة المزيد من الإعدادات قريباً...</p>
            </div>
            {/* مسافة إضافية من الأسفل */}
            <div className="mb-32"></div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex px-6 py-8 pb-32">
      {/* Sidebar */}
      <div className="w-64 glass-effect border-r border-white/20 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-white/70 text-sm">مدرسة محمد الفاتح</p>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 py-8 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
}
