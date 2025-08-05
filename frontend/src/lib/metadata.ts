import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://news-dsgn-academy.onrender.com"),
  title: "UX.News — Український портал новин для дизайнерів",
  description:
    "UX.News — новини, аналітика, статті та тренди для дизайнерів і UX-фахівців. Читай актуальне, знаходь ідеї для своїх проектів.",
  authors: [{ name: "Design Academy" }],
  keywords: [
    "дизайн",
    "ux",
    "новини",
    "інтерфейси",
    "ui",
    "дезайн аналітика",
    "новини дизайну",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.manifest",
  openGraph: {
    title: "UX.News — Український портал новин для дизайнерів",
    description:
      "Читай найсвіжіші новини зі світу UX, UI, технологій та дизайну. Огляди інструментів, експертні думки, корисні статті.",
    url: "hhttps://news-dsgn-academy.onrender.com",
    type: "website",
    images: [
      {
        url: "https://news-dsgn-academy.onrender.com/og-preview.png",
        width: 1200,
        height: 630,
        alt: "UX.News – Український портал новин для дизайнерів",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UX.News — Український портал новин для дизайнерів",
    description:
      "Останні новини для для дизайнерів і UX-фахівців. Читай, навчайся, знаходь натхнення на UX.News.",
    images: ["https://news-dsgn-academy.onrender.com/og-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
