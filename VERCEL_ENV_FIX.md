# 🔧 حل مشكلة متغيرات البيئة في Vercel

## المشكلة
عند اختيار الوجبة يظهر خطأ: `supabaseUrl is required`

## السبب
متغيرات البيئة غير مضافة في Vercel

## ✅ الحل السريع

### 1. اذهب إلى Vercel Dashboard
- افتح [vercel.com](https://vercel.com)
- اختر مشروع `mohamed-alfateh-school`

### 2. أضف متغيرات البيئة
- اذهب إلى **Settings** → **Environment Variables**
- أضف هذه المتغيرات:

```
NEXT_PUBLIC_SUPABASE_URL
https://rwprhhjcjqhihkmhdpzu.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cHJoaGpjanFoaWhrbWhkcHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzYwOTQsImV4cCI6MjA3MzgxMjA5NH0.L_3j6IAUeciIUh3nietf1iNm1siulu_BSAC3ZD2AlXo

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cHJoaGpjanFoaWhrbWhkcHp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIzNjA5NCwiZXhwIjoyMDczODEyMDk0fQ.qV9adCsIbZw3ZbJioRhe81PynwV1Q0mGiD6_51ZAjG0
```

### 3. إعادة النشر
- اذهب إلى **Deployments**
- انقر على آخر deployment
- انقر **Redeploy**

## 📱 خطوات مفصلة بالصور

### الخطوة 1: Settings
![Vercel Settings](https://i.imgur.com/example1.png)

### الخطوة 2: Environment Variables
![Environment Variables](https://i.imgur.com/example2.png)

### الخطوة 3: إضافة المتغيرات
- انقر **Add New**
- اكتب اسم المتغير
- اكتب القيمة
- اختر **Production, Preview, Development**
- انقر **Save**

### الخطوة 4: إعادة النشر
![Redeploy](https://i.imgur.com/example3.png)

## ⚡ بعد الإصلاح

الموقع سيعمل بشكل طبيعي وستختفي رسالة الخطأ.

## 🆘 إذا استمرت المشكلة

1. تأكد من أن جميع المتغيرات مضافة بشكل صحيح
2. تأكد من عدم وجود مسافات إضافية في القيم
3. انتظر 2-3 دقائق بعد إعادة النشر
4. امسح cache المتصفح (Ctrl+F5)

## 📞 الدعم

إذا استمرت المشكلة، تحقق من:
- Console في المتصفح (F12)
- Function Logs في Vercel
- Supabase Dashboard للتأكد من أن المشروع نشط
