# دليل الإعداد والتشغيل - موقع مدرسة محمد الفاتح للبنين

## 🚀 خطوات الإعداد السريع

### 1. إعداد قاعدة البيانات Supabase

#### إنشاء مشروع جديد
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد أو سجل الدخول
3. انقر على "New Project"
4. اختر اسم المشروع: `mohamed-alfateh-school`
5. اختر كلمة مرور قوية لقاعدة البيانات
6. اختر المنطقة الأقرب لك

#### إعداد قاعدة البيانات
1. في لوحة تحكم Supabase، اذهب إلى "SQL Editor"
2. انسخ محتوى ملف `supabase-setup.sql` والصقه
3. انقر على "Run" لتنفيذ الأوامر

#### الحصول على مفاتيح API
1. اذهب إلى "Settings" > "API"
2. انسخ:
   - Project URL
   - anon public key
   - service_role key (احتفظ بها آمنة)

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Configuration
ADMIN_EMAIL=admin@mohamedalfateh.edu
ADMIN_PASSWORD=your_secure_admin_password_here
```

### 3. إنشاء حساب المدير

#### في Supabase Dashboard:
1. اذهب إلى "Authentication" > "Users"
2. انقر على "Add user"
3. أدخل:
   - Email: `admin@mohamedalfateh.edu`
   - Password: كلمة مرور قوية
   - Confirm password
4. انقر على "Create user"

#### تعيين صلاحيات المدير:
1. اذهب إلى "SQL Editor"
2. نفذ هذا الأمر:

```sql
INSERT INTO users (email, role) 
VALUES ('admin@mohamedalfateh.edu', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```

### 4. تشغيل المشروع

```bash
# تثبيت المكتبات
npm install

# تشغيل الخادم
npm run dev
```

الموقع سيكون متاحاً على: http://localhost:3000

## 🔐 الوصول للوحة التحكم

- الرابط: http://localhost:3000/admin
- البريد الإلكتروني: admin@mohamedalfateh.edu
- كلمة المرور: التي أنشأتها في Supabase

## 📚 استخدام لوحة التحكم

### إدارة الصفوف والشعب

#### إضافة صف جديد:
1. اذهب إلى "إدارة الصفوف"
2. انقر على "إضافة صف جديد"
3. أدخل اسم الصف (مثل: الصف الأول)
4. اختر الوجبة (A أو B)
5. انقر على "إضافة"

#### إضافة شعبة:
1. في قائمة الصفوف، انقر على "+" بجانب الشعب
2. أدخل اسم الشعبة (مثل: أ، ب، ج)
3. انقر على "إضافة"

### إدارة الجداول الدراسية

#### رفع جدول جديد:
1. اذهب إلى "إدارة الجداول"
2. اختر الصف والشعبة
3. اختر صورة الجدول (PNG, JPG, JPEG)
4. انقر على "رفع الجدول"

#### تحديث جدول موجود:
- ارفع جدول جديد لنفس الصف والشعبة
- سيتم استبدال الجدول القديم تلقائياً

## 🎨 تخصيص الموقع

### تغيير اسم المدرسة:
في ملف `src/app/page.tsx`:
```tsx
<h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
  اسم مدرستك هنا
</h1>
```

### تغيير الألوان:
في ملف `src/app/globals.css`:
```css
:root {
  --primary-blue: #1e40af;    /* اللون الأزرق الأساسي */
  --primary-green: #059669;   /* اللون الأخضر الأساسي */
  --primary-gold: #d97706;    /* اللون الذهبي */
}
```

## 🚀 النشر على الإنترنت

### النشر على Vercel (مجاني):

1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. انقر على "Import Project"
4. اختر مستودع GitHub
5. أضف متغيرات البيئة:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. انقر على "Deploy"

### النشر على Netlify:

1. بناء المشروع: `npm run build`
2. ارفع مجلد `.next` إلى Netlify
3. أضف متغيرات البيئة في إعدادات Netlify

## 🔧 استكشاف الأخطاء

### مشكلة الاتصال بـ Supabase:
- تأكد من صحة URL و API Keys
- تأكد من تفعيل RLS في Supabase
- تحقق من إعدادات CORS

### مشكلة رفع الصور:
- تأكد من إنشاء bucket "schedules" في Supabase Storage
- تحقق من صلاحيات Storage policies

### مشكلة تسجيل الدخول:
- تأكد من إنشاء المستخدم في Authentication
- تأكد من إضافة المستخدم في جدول users مع role = 'admin'

## 📞 الدعم الفني

للحصول على المساعدة:
- راجع ملف README.md للتفاصيل الكاملة
- تحقق من console المتصفح للأخطاء
- راجع logs Supabase في Dashboard

## 🎯 نصائح مهمة

1. **النسخ الاحتياطي**: اعمل نسخة احتياطية من قاعدة البيانات بانتظام
2. **الأمان**: لا تشارك service_role key مع أحد
3. **التحديثات**: حدث المكتبات بانتظام
4. **الأداء**: استخدم صور مضغوطة للجداول
5. **المراقبة**: راقب استخدام Supabase لتجنب تجاوز الحدود المجانية

---

🎉 **تهانينا! موقع مدرسة محمد الفاتح للبنين جاهز للاستخدام**
