import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import AuthProvider from "@/providers/auth-provider";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SH Medical Labs",
    template: "%s | SH Medical Labs",
  },

  description:
    "منصة متكاملة لإدارة طلبات التحاليل الطبية والنتائج، مصممة لتسهيل تجربة المرضى والمختصين.",

  keywords: [
    "SH Medical Labs",
    "Medical Lab",
    "تحاليل طبية",
    "Laboratory Management System",
    "Medical Results",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-[#F4F7F6] font-sans antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>

          <ToastContainer
            position="top-center"
            theme="colored"
            rtl
          />
        </AuthProvider>
      </body>
    </html>
  );
}