import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "A.K FITNESS | Premium Supplements",
  description: "100% Authentic Supplements for Serious Athletes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} min-h-full flex flex-col font-sans`}
      >
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #39FF14',
            }
          }} 
        />
      </body>
    </html>
  );
}
