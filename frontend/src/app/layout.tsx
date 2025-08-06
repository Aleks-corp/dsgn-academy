import { Inter, Sora } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

import Header from "@/components/Header";
import Aside from "@/components/Aside";
// import Footer from "@/components/Footer";

import { metadata } from "@/lib/metadata";
import { ReduxProvider } from "@/redux/provider";

const sora = Sora({
  weight: ["400", "500", "600", "800"],
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  weight: ["100", "400", "500", "600", "700"],
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap",
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${sora.variable} ${inter.variable} antialiased`}>
        <LenisProvider />
        <ReduxProvider>
          <div className="flex gap-[32px] w-full min-h-screen p-4 sm:p-5 pb-12 max-w-[1440px] mx-auto">
            <Aside />
            <div className="w-full">
              <Header />
              <main className="flex items-center justify-center sm:items-start">
                {children}
              </main>
            </div>
            {/* <Footer /> */}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
