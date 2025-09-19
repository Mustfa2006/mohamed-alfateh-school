import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

// تعطيل body parser لـ Next.js
export const config = {
  api: {
    bodyParser: false,
  },
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // تحليل الملف المرفوع
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)
    
    const file = files.file?.[0]
    const fileName = req.headers['x-file-name']
    const gradeId = req.headers['x-grade']
    const sectionId = req.headers['x-section']

    if (!file) {
      return res.status(400).json({ error: 'لم يتم العثور على ملف' })
    }

    if (!fileName || !gradeId || !sectionId) {
      return res.status(400).json({ error: 'معلومات مفقودة' })
    }

    console.log('API Upload - File:', fileName)
    console.log('API Upload - Grade:', gradeId)
    console.log('API Upload - Section:', sectionId)
    console.log('API Upload - File size:', file.size)
    console.log('API Upload - File type:', file.mimetype)

    // قراءة الملف
    const fileBuffer = fs.readFileSync(file.filepath)

    // رفع الملف إلى Supabase Storage باستخدام service role
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('schedules')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.mimetype
      })

    if (uploadError) {
      console.error('API Upload Error:', uploadError)
      return res.status(400).json({ 
        error: 'فشل في رفع الملف', 
        details: uploadError.message 
      })
    }

    // الحصول على الرابط العام
    const { data: { publicUrl } } = supabase.storage
      .from('schedules')
      .getPublicUrl(fileName)

    // التحقق من وجود جدول للصف والشعبة
    const { data: existingSchedule } = await supabase
      .from('schedules')
      .select('id')
      .eq('grade_id', gradeId)
      .eq('section_id', sectionId)
      .single()

    if (existingSchedule) {
      // تحديث الجدول الموجود
      const { error: updateError } = await supabase
        .from('schedules')
        .update({ 
          image_url: publicUrl, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingSchedule.id)

      if (updateError) {
        console.error('API Update Error:', updateError)
        return res.status(400).json({ 
          error: 'فشل في تحديث الجدول', 
          details: updateError.message 
        })
      }
    } else {
      // إنشاء جدول جديد
      const { error: insertError } = await supabase
        .from('schedules')
        .insert([{
          grade_id: gradeId,
          section_id: sectionId,
          image_url: publicUrl
        }])

      if (insertError) {
        console.error('API Insert Error:', insertError)
        return res.status(400).json({ 
          error: 'فشل في إنشاء الجدول', 
          details: insertError.message 
        })
      }
    }

    // تنظيف الملف المؤقت
    fs.unlinkSync(file.filepath)

    return res.status(200).json({ 
      success: true, 
      path: uploadData.path,
      publicUrl: publicUrl
    })

  } catch (error) {
    console.error('API Handler Error:', error)
    return res.status(500).json({ 
      error: 'خطأ في الخادم', 
      details: error.message 
    })
  }
}
