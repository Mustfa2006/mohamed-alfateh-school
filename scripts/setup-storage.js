import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// تحميل متغيرات البيئة
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متغيرات البيئة مفقودة')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  try {
    console.log('🚀 إعداد Storage...')

    // إنشاء bucket إذا لم يكن موجوداً
    console.log('📁 التحقق من bucket الجداول...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('خطأ في قراءة buckets:', listError)
      throw listError
    }

    console.log('Buckets الموجودة:', buckets.map(b => b.name))

    const schedulesBucket = buckets.find(bucket => bucket.name === 'schedules')
    
    if (!schedulesBucket) {
      console.log('إنشاء bucket جديد...')
      const { error: createError } = await supabase.storage.createBucket('schedules', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (createError) {
        console.error('خطأ في إنشاء bucket:', createError)
        throw createError
      }
      console.log('✅ تم إنشاء bucket الجداول')
    } else {
      console.log('✅ bucket الجداول موجود')
    }

    // تحديث bucket ليكون public
    console.log('🔒 تحديث إعدادات bucket...')
    try {
      const { error: updateError } = await supabase.storage.updateBucket('schedules', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (updateError) {
        console.log('خطأ في تحديث bucket:', updateError)
      } else {
        console.log('✅ تم تحديث إعدادات bucket')
      }
    } catch (error) {
      console.log('تم تحديث bucket أو هو محدث بالفعل')
    }

    console.log('📝 ملاحظة: يجب إعداد Storage Policies يدوياً في Supabase Dashboard:')
    console.log('1. اذهب إلى Storage > Policies في Supabase Dashboard')
    console.log('2. أضف policy جديد للـ schedules bucket:')
    console.log('   - Policy name: Allow all operations on schedules')
    console.log('   - Allowed operation: All')
    console.log('   - Target roles: authenticated, anon')
    console.log('   - USING expression: true')
    console.log('   - WITH CHECK expression: true')

    console.log('✅ تم إعداد Storage بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في إعداد Storage:', error)
  }
}

setupStorage()
