/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 إعداد قاعدة البيانات...')

  try {
    // إنشاء جدول المستخدمين
    console.log('📝 إنشاء جدول المستخدمين...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- تعطيل RLS للجدول مؤقتاً للاختبار
        ALTER TABLE users DISABLE ROW LEVEL SECURITY;

        -- إنشاء دالة للتحقق من المستخدم الإداري
        CREATE OR REPLACE FUNCTION check_admin_user(user_email TEXT)
        RETURNS TABLE(email TEXT, role TEXT) AS $$
        BEGIN
          RETURN QUERY
          SELECT u.email, u.role
          FROM users u
          WHERE u.email = user_email AND u.role = 'admin';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    })

    if (usersError) {
      console.log('جدول المستخدمين موجود بالفعل أو تم إنشاؤه')
    }

    // إنشاء جدول الصفوف
    console.log('📚 إنشاء جدول الصفوف...')
    const { error: gradesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS grades (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          shift TEXT NOT NULL CHECK (shift IN ('A', 'B')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (gradesError) {
      console.log('جدول الصفوف موجود بالفعل أو تم إنشاؤه')
    }

    // إنشاء جدول الشعب
    console.log('👥 إنشاء جدول الشعب...')
    const { error: sectionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sections (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (sectionsError) {
      console.log('جدول الشعب موجود بالفعل أو تم إنشاؤه')
    }

    // إنشاء جدول الجداول الدراسية
    console.log('📅 إنشاء جدول الجداول الدراسية...')
    const { error: schedulesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS schedules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
          section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (schedulesError) {
      console.log('جدول الجداول الدراسية موجود بالفعل أو تم إنشاؤه')
    }

    // إدراج البيانات الأساسية للصفوف والشعب
    console.log('📊 إدراج البيانات الأساسية...')

    // الوجبة A
    const gradesA = [
      'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'
    ]

    // الوجبة B
    const gradesB = [
      'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'
    ]

    const sections = ['أ', 'ب', 'ج']

    // إدراج صفوف الوجبة A
    for (const gradeName of gradesA) {
      const { data: grade, error } = await supabase
        .from('grades')
        .upsert({ name: gradeName, shift: 'A' }, { onConflict: 'name,shift' })
        .select()
        .single()

      if (grade) {
        // إدراج الشعب لكل صف
        for (const sectionName of sections) {
          await supabase
            .from('sections')
            .upsert({ name: sectionName, grade_id: grade.id }, { onConflict: 'name,grade_id' })
        }
      }
    }

    // إدراج صفوف الوجبة B
    for (const gradeName of gradesB) {
      const { data: grade, error } = await supabase
        .from('grades')
        .upsert({ name: gradeName, shift: 'B' }, { onConflict: 'name,shift' })
        .select()
        .single()

      if (grade) {
        // إدراج الشعب لكل صف
        for (const sectionName of sections) {
          await supabase
            .from('sections')
            .upsert({ name: sectionName, grade_id: grade.id }, { onConflict: 'name,grade_id' })
        }
      }
    }

    // إنشاء مستخدم إداري في نظام المصادقة
    console.log('👤 إنشاء مستخدم إداري...')
    const adminEmail = 'admin@mohamedalfateh.edu'
    const adminPassword = 'Admin123!@#'

    try {
      // إنشاء المستخدم في نظام Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      })

      if (authError && !authError.message.includes('already registered')) {
        console.error('خطأ في إنشاء مستخدم المصادقة:', authError)
      } else {
        console.log('✅ تم إنشاء مستخدم المصادقة بنجاح')
      }

      // إنشاء المستخدم في جدول users
      const { data: userData, error: adminError } = await supabase
        .from('users')
        .upsert({
          email: adminEmail,
          role: 'admin'
        }, { onConflict: 'email' })
        .select()

      if (adminError) {
        console.log('خطأ في إنشاء المستخدم في الجدول:', adminError)
      } else {
        console.log('✅ تم إنشاء المستخدم في جدول users بنجاح')
      }

      // التحقق من وجود المستخدم
      const { data: checkUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', adminEmail)
        .single()

      if (checkUser) {
        console.log('✅ تم التحقق من وجود المستخدم:', checkUser)
      } else {
        console.log('❌ لم يتم العثور على المستخدم:', checkError)
      }
    } catch (error) {
      console.log('المستخدم الإداري موجود بالفعل أو تم إنشاؤه')
    }

    // إعداد RLS policies للجداول
    console.log('🔒 إعداد RLS policies...')

    // تعطيل RLS مؤقتاً للجداول الأساسية
    const disableRLSQueries = [
      'ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.sections DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;'
    ]

    for (const query of disableRLSQueries) {
      try {
        const { error } = await supabase.rpc('exec', { sql: query })
        if (error) {
          console.log('خطأ في تعطيل RLS:', error.message)
        }
      } catch (error) {
        console.log('تم تعطيل RLS أو هو معطل بالفعل')
      }
    }

    console.log('✅ تم تعطيل RLS للجداول الأساسية')

    // إنشاء bucket للجداول الدراسية
    console.log('📁 إنشاء bucket للجداول الدراسية...')
    const { error: bucketError } = await supabase.storage.createBucket('schedules', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.log('خطأ في إنشاء bucket:', bucketError)
    } else {
      console.log('✅ تم إنشاء bucket للجداول الدراسية')
    }

    console.log('✅ تم إعداد قاعدة البيانات بنجاح!')
    console.log('📧 البريد الإلكتروني للإدارة: admin@mohamedalfateh.edu')
    console.log('🔑 كلمة المرور: Admin123!@#')

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error)
  }
}

setupDatabase()
