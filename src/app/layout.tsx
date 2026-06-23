export const dynamic = "force-dynamic";

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
  metadataBase: new URL('https://www.shop.nexuscalculator.net'),
  title: {
    default: "Nexus Shop | Premium E-Commerce by Sahera Group",
    template: "%s | Nexus Shop"
  },
  description: "Discover the best products at Nexus Shop. A proud company of Sahera Group offering premium quality, fast shipping, and secure checkout.",
  openGraph: {
    title: "Nexus Shop | Premium E-Commerce by Sahera Group",
    description: "Discover the best products at Nexus Shop. A proud company of Sahera Group.",
    url: "https://www.shop.nexuscalculator.net",
    siteName: "Nexus Shop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Shop | Premium E-Commerce by Sahera Group",
    description: "Discover the best products at Nexus Shop. A proud company of Sahera Group.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Nexus Shop",
              "image": "https://www.shop.nexuscalculator.net/logo.png",
              "@id": "https://www.shop.nexuscalculator.net",
              "url": "https://www.shop.nexuscalculator.net",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2300 Kishoreganj Sadar",
                "addressLocality": "Dhaka",
                "addressCountry": "BD"
              },
              "parentOrganization": {
                "@type": "Organization",
                "name": "Sahera Group",
                "url": "https://www.shop.nexuscalculator.net"
              }
            })
          }}
        />
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
