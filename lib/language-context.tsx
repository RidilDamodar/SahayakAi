"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, LanguageCode } from "./translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem("sahayak_lang") as LanguageCode;
    if (storedLang && ["en", "hi", "ml"].includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("sahayak_lang", lang);
    
    if (lang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
    }
    
    window.location.reload();
  };

  const t = (key: string): string => {
    // Always return English strings. Google Translate will mutate the DOM.
    // This prevents React Hydration mismatch errors.
    return translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
