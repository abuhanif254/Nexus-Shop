import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import CartDrawer from "@/components/layout/CartDrawer";
import ToastProvider from "@/components/ui/ToastProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://besa-ecommerce.com'),
  title: {
    default: "Besa Shop | Premium Consumer Electronics & Lifestyle",
    template: "%s | Besa Shop"
  },
  description: "Discover the best premium consumer electronics, smart home devices, and lifestyle accessories. Enjoy fast shipping and secure checkout.",
  openGraph: {
    title: "Besa Shop | Premium Consumer Electronics",
    description: "Discover the best premium consumer electronics, smart home devices, and lifestyle accessories. Enjoy fast shipping and secure checkout.",
    url: "https://besa-ecommerce.com",
    siteName: "Besa Shop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Besa Shop | Premium Consumer Electronics",
    description: "Discover the best premium consumer electronics, smart home devices, and lifestyle accessories.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased pb-24 md:pb-0 ${outfit.variable} ${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <Header />
            {children}
            <Footer />
            <BottomNav />
            <CartDrawer />
            <ScrollToTop />
            <ToastProvider />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
