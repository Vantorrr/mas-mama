import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "masterskaya_mama",
  description: "Ювелирные украшения — браслеты, ожерелья, кулоны",
  metadataBase: new URL("https://localhost:3000"),
  openGraph: {
    title: "masterskaya_mama",
    description: "Каталог украшений",
    images: ["/logo.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-[#fffaf5] text-[#6b4e3d]`}
      >
        <LoadingScreen />
        <Header />
        {children}
      </body>
    </html>
  );
}
