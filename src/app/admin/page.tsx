'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import SchoolLogoCircle from '@/components/SchoolLogoCircle'

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  ssr: false
})

// Dynamic import for supabase to avoid SSR issues
const getSupabase = async () => {
  if (typeof window !== 'undefined') {
    const { supabase } = await import('@/lib/supabase')
    return supabase
  }
  return null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const supabase = await getSupabase()
    if (!supabase) return

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // Check if user is admin
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single()

      if (user?.role === 'admin') {
        setIsAuthenticated(true)
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = await getSupabase()
    if (!supabase) {
      setError('خطأ في الاتصال')
      setLoading(false)
      return
    }

    try {
      // تسجيل الدخول أولاً
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('Auth data:', authData)
      console.log('Auth error:', authError)

      if (authError) throw authError

      // التحقق من أن المستخدم هو الإداري
      if (email === 'admin@mohamedalfateh.edu') {
        console.log('المستخدم إداري - تم السماح بالدخول')
        setIsAuthenticated(true)
      } else {
        console.log('المستخدم ليس إداري:', email)
        setError('غير مصرح لك بالوصول إلى لوحة التحكم')
        await supabase.auth.signOut()
      }
    } catch (error: unknown) {
      console.error('خطأ في تسجيل الدخول:', error)
      setError((error as Error).message || 'خطأ في تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = await getSupabase()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-effect p-8 py-16 rounded-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <SchoolLogoCircle sizeClass="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">لوحة التحكم</h1>
            <p className="text-white/70">مدرسة محمد الفتح للبنين</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="admin@mohamedalfateh.edu"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-xs">
              لوحة التحكم محمية ومخصصة للإدارة فقط
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
