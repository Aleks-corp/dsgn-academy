import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://dsgn.academy"),
  title: "Dsgn Academy — Освітня платформа для дизайнерів українською",
  description:
    "Dsgn Academy — сучасна освітня платформа для дизайнерів. Курси, відео, інтерв’ю та лекції з UI/UX, Webflow, Figma, Framer, Spline — українською мовою.",
  keywords:
    "дизайн, онлайн-курси, освіта, дизайн українською, Dsgn Academy, UI/UX, графічний дизайн, Webflow, Figma, Framer, Spline, відео, інтерв’ю, курси дизайну, навчання, академія дизайну, українські курси",
  authors: [{ name: "Design Academy" }],
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
    title: "Dsgn Academy — Освітня платформа для дизайнерерів українською",
    description:
      "Сучасна платформа для дизайнерів. Найкращі відео, курси, лекції, інтерв’ю — українською. Доступно. Без бар'єрів. Професійний розвиток з Dsgn Academy.",
    url: "https://dsgn.academy",
    siteName: "Dsgn Academy",
    images: [
      {
        url: "https://dsgn.academy/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dsgn Academy — Освітня платформа для дизайнерів",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dsgn Academy — Освітня платформа для дизайнерерів українською",
    description:
      "Найкращі відео, курси, інтерв’ю для дизайнерів — українською. Dsgn Academy — твій розвиток у світі дизайну.",
    images: ["https://dsgn.academy/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
