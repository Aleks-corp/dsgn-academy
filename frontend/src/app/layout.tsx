import { Inter, Sora } from "next/font/google";
import "./globals.css";

import { metadata } from "@/lib/metadata";
import { ReduxProvider } from "@/redux/provider";

import RootPage from "@/guards&providers/RootPage";

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
        <ReduxProvider>
          <RootPage>{children}</RootPage>
        </ReduxProvider>
      </body>
    </html>
  );
}
