"use client"

import Image from "next/image"

// مكون الشعار داخل دائرة مع حافة متدرجة
// sizeClass للتحكم بالحجم (مثال: "w-24 h-24" أو "w-16 h-16")
export default function SchoolLogoCircle({ sizeClass = "w-24 h-24", priority = false }: { sizeClass?: string; priority?: boolean }) {
  // استيراد الصورة الثابتة من جذر المشروع
  // ملاحظة: اسم الملف يحتوي أرقام عربية ويعمل مع Next كاستيراد ثابت
  // في حال رغبت بنقل الصورة لاحقاً إلى مجلد public، يمكن استبدال الاستيراد بمسار نصي
  // مثل: <Image src="/school-logo.jpg" ... />
  // المسار التالي صحيح من src/components إلى جذر المشروع
  // eslint-disable-next-line @next/next/no-img-element
  const schoolLogo = require("../../photo_٢٠٢٥-٠٩-١٩_١٧-٣٨-٣٠.jpg") as unknown as string

  return (
    <div className={`relative ${sizeClass}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full animate-pulse"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full overflow-hidden">
        <Image
          src={schoolLogo}
          alt="شعار مدرسة محمد الفاتح"
          fill
          className="object-cover rounded-full"
          sizes="96px"
          priority={priority}
        />
      </div>
    </div>
  )
}

