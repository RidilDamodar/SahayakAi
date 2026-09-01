import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import Script from "next/script";

export const metadata: Metadata = {
  title: "Sahayak AI - Institutional Financial Intelligence & Government Scheme Discovery",
  description: "Sahayak AI matches your business with optimal government schemes, subsidies, and credit facilities using institutional AI guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sunset-radial text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
        {/* Google Translate Init */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement(
                { pageLanguage: 'en', includedLanguages: 'en,hi,ml', autoDisplay: false },
                'google_translate_element'
              );
            }
          `}
        </Script>
        
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
