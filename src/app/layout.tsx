import type { Metadata, Viewport } from "next";
import { fontSans, fontDisplay } from "./fonts";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { ComparisonProvider } from "@/context/comparison-context";
import { ComparisonTray } from "@/components/comparison/comparison-tray";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AssistantWidget } from "@/components/ai";
import { getMetadataBase, isIndexingEnabled, getCanonicalUrl, seoConfig } from "@/config/seo";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09152B",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.siteDescription,
  keywords: [
    "NEXORA",
    "electronics",
    "spatial computing",
    "3D electronics",
    "premium audio",
    "next-gen technology",
    "high-performance hardware",
  ],
  authors: [{ name: seoConfig.author }],
  creator: seoConfig.siteName,
  publisher: seoConfig.publisher,
  robots: isIndexingEnabled()
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
      },
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    url: getCanonicalUrl("/"),
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.siteDescription,
    images: [
      {
        url: seoConfig.defaultSocialImage,
        width: 1200,
        height: 630,
        alt: `${seoConfig.siteName} Next-Gen Electronics`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.siteDescription,
    creator: seoConfig.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-600 selection:text-white">
        {/* WCAG 2.1 AA Skip to Content Link */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Global ambient lighting glow */}
        <div className="ambient-glow-top" aria-hidden="true" />

        <CartProvider>
          <ComparisonProvider>
            {/* Header Navigation Shell */}
            <SiteHeader />

            {/* Main Content Area */}
            <main id="main-content" className="flex-1 relative z-10 focus:outline-none">
              {children}
            </main>

            {/* Comparison Selection Floating Tray */}
            <ComparisonTray />

            {/* Interactive Cart Drawer */}
            <CartDrawer />

            {/* AI Shopping Assistant Concierge */}
            <AssistantWidget />

            {/* Footer Navigation Shell */}
            <SiteFooter />
          </ComparisonProvider>
        </CartProvider>
      </body>
    </html>
  );
}
