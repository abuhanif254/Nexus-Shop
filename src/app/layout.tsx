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

const SITE_URL = 'https://www.shop.nexuscalculator.net';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nexus Shop | Premium E-Commerce by Sahera Group",
    template: "%s | Nexus Shop"
  },
  description: "Discover the best products at Nexus Shop. A proud company of Sahera Group offering premium quality, fast shipping, and secure checkout.",
  keywords: ["affiliate marketing", "online shop", "nexus shop", "deals", "technology", "lifestyle"],
  openGraph: {
    title: "Nexus Shop | Premium E-Commerce by Sahera Group",
    description: "Discover the best products at Nexus Shop. A proud company of Sahera Group.",
    url: SITE_URL,
    siteName: "Nexus Shop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Shop | Premium E-Commerce by Sahera Group",
    description: "Discover the best products at Nexus Shop. A proud company of Sahera Group.",
  },
  alternates: {
    // RSS autodiscovery — browsers and Google Publisher Center detect this
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
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

        {/* ── WebSite schema — enables Google Sitelinks Searchbox ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "Nexus Shop",
                  "description": "Premium affiliate deals, insights and expert picks.",
                  "inLanguage": "en-US",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/search?q={search_term_string}` },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "Nexus Shop",
                  "url": SITE_URL,
                  "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` },
                  "parentOrganization": {
                    "@type": "Organization",
                    "name": "Sahera Group",
                    "url": SITE_URL
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dhaka",
                    "addressCountry": "BD"
                  }
                }
              ]
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
