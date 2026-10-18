import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandTrace (ল্যান্ডট্রেস) | Land Record Fraud & Double-Selling Detection",
  description:
    "Automated ownership-chain analysis and fraud detection prototype for LandTech 2026. Decision-support system for Bangladesh land administration, Assistant Commissioners (Land), Sub-Registrars, and citizens.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500/20 selection:text-teal-900">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
