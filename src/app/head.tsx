export default function Head() {
  const site = 'https://mohamed-alfateh-school.netlify.app'
  const title = 'مدرسة محمد الفاتح للبنين'
  const desc = 'نظام عرض الجداول الدراسية – اختر الوجبة والصف والشعبة بسهولة'
  const og = `${site}/opengraph-image.jpg?v=3`
  const tw = `${site}/twitter-image.jpg?v=3`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:site_name" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ar_IQ" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={og} />
      <meta property="og:url" content={site} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={tw} />
      <link rel="icon" href="/school-logo.jpg?v=3" />
      <link rel="apple-touch-icon" href="/apple-icon.jpg?v=3" />
      <link rel="manifest" href="/site.webmanifest" />
    </>
  )
}

