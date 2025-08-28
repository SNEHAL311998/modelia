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
  title: "AI Studio - Modelia",
  description: "Create stunning AI-generated images with our advanced AI studio. Upload, customize, and generate professional-quality images with multiple style options.",
  keywords: ["AI", "image generation", "artificial intelligence", "creative tools", "design"],
  authors: [{ name: "Modelia" }],
  robots: "index, follow",
  openGraph: {
    title: "AI Studio - Modelia",
    description: "Create stunning AI-generated images with our advanced AI studio",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
