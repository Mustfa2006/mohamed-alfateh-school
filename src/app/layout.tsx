import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mohamed-alfateh-school.netlify.app'),
  title: {
    default: 'مدرسة محمد الفاتح للبنين',
    template: '%s · مدرسة محمد الفاتح للبنين',
  },
  description: 'نظام عرض الجداول الدراسية لمدرسة محمد الفاتح للبنين – بغداد',
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    url: 'https://mohamed-alfateh-school.netlify.app',
    siteName: 'مدرسة محمد الفاتح للبنين',
    title: 'مدرسة محمد الفاتح للبنين',
    description: 'نظام عرض الجداول الدراسية – اختر الوجبة والصف والشعبة بسهولة',
    images: ['/opengraph-image.jpg?v=3'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مدرسة محمد الفاتح للبنين',
    description: 'نظام عرض الجداول الدراسية – اختر الوجبة والصف والشعبة بسهولة',
    images: ['/twitter-image.jpg?v=3'],
  },
  icons: {
    icon: ['/school-logo.jpg'],
    shortcut: ['/school-logo.jpg'],
    apple: ['/apple-icon.jpg'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
