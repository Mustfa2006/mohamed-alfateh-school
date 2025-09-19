# دليل نشر مشروع مدرسة محمد الفاتح

## 📋 المتطلبات
- حساب GitHub
- حساب Vercel (مجاني)
- مشروع Supabase جاهز

## 🚀 خطوات النشر

### 1. إنشاء Repository على GitHub

1. اذهب إلى [GitHub](https://github.com)
2. انقر على "New repository"
3. اسم المشروع: `mohamed-alfateh-school`
4. الوصف: `نظام الجداول الدراسية لمدرسة محمد الفاتح - School Schedule Management System`
5. اجعل المشروع **Public**
6. **لا تختر** "Add a README file" (لأن لدينا ملفات بالفعل)
7. انقر "Create repository"

### 2. ربط المشروع المحلي بـ GitHub

افتح Terminal في مجلد المشروع وشغل هذه الأوامر:

```bash
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك على GitHub
git remote add origin https://github.com/YOUR_USERNAME/mohamed-alfateh-school.git
git branch -M main
git push -u origin main
```

### 3. النشر على Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. سجل دخول باستخدام حساب GitHub
3. انقر "New Project"
4. اختر repository `mohamed-alfateh-school`
5. انقر "Import"

### 4. إعداد متغيرات البيئة في Vercel

في صفحة إعدادات المشروع في Vercel، أضف هذه المتغيرات:

```
NEXT_PUBLIC_SUPABASE_URL=https://rwprhhjcjqhihkmhdpzu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cHJoaGpjanFoaWhrbWhkcHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzYwOTQsImV4cCI6MjA3MzgxMjA5NH0.L_3j6IAUeciIUh3nietf1iNm1siulu_BSAC3ZD2AlXo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cHJoaGpjanFoaWhrbWhkcHp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIzNjA5NCwiZXhwIjoyMDczODEyMDk0fQ.qV9adCsIbZw3ZbJioRhe81PynwV1Q0mGiD6_51ZAjG0
```

### 5. إعداد Domain في Supabase (اختياري)

1. اذهب إلى Supabase Dashboard
2. اختر مشروع "محمد الفاتح"
3. Settings → API
4. أضف domain الجديد في "Site URL"

## 🔧 إعدادات إضافية

### تحديث الكود للإنتاج

تأكد من أن جميع URLs في الكود تستخدم متغيرات البيئة وليس localhost.

### أمان إضافي

1. في Supabase، اذهب إلى Authentication → Settings
2. أضف domain الجديد في "Site URL"
3. تأكد من إعدادات RLS

## 📱 الوصول للموقع

بعد النشر، ستحصل على رابط مثل:
- `https://mohamed-alfateh-school.vercel.app`

## 🔐 بيانات الدخول للإدارة

- البريد الإلكتروني: `admin@mohamedalfateh.edu`
- كلمة المرور: `Admin123!@#`

## 🆘 حل المشاكل الشائعة

### خطأ في البناء (Build Error)
- تأكد من أن جميع dependencies مثبتة
- تحقق من أن متغيرات البيئة صحيحة

### خطأ في قاعدة البيانات
- تأكد من أن Supabase project نشط
- تحقق من أن RLS معطل للجداول الأساسية

### خطأ في رفع الصور
- تأكد من أن Storage bucket موجود
- تحقق من صلاحيات Storage

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
1. Console في المتصفح (F12)
2. Logs في Vercel Dashboard
3. Logs في Supabase Dashboard
