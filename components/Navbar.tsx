"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { Globe, User, LogOut, Menu, X, ChevronDown, Sliders, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/schemes", label: t("nav.explore") },
    { href: "/find-scheme", label: t("nav.find") },
    { href: "/simulator", label: t("nav.simulator") },
    { href: "/calculator", label: t("nav.calculator") },
    { href: "/partners", label: t("nav.partners") },
  ];

  return (
    <nav className="bg-surface/95 backdrop-blur-md sticky top-0 border-b border-outline-variant/30 shadow-sm z-50 transition-colors">
      <div className="flex justify-between items-center px-6 md:px-12 h-24 sm:h-28 w-full max-w-7xl mx-auto">
        {/* Large Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group py-2">
          <img
            src="/logo.png"
            alt="Sahayak AI Logo - Find the Funding that Fits You"
            className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-semibold transition-colors duration-200 py-1 ${
                  isActive
                    ? "text-primary border-b-2 border-primary font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => { setLanguageDropdownOpen(!languageDropdownOpen); setProfileDropdownOpen(false); }}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-border-subtle hover:border-outline-variant transition-all"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-surface-card border border-outline-variant rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिंदी" },
                  { code: "ml", label: "മലയാളം" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code as any); setLanguageDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? "text-primary font-bold bg-primary/5" : "text-on-surface hover:bg-surface-container-low"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-on-surface px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {user?.name?.[0] || "U"}
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-on-surface-variant" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-outline-variant rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-border-subtle">
                    <p className="text-xs text-on-surface-variant font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-on-surface truncate">{user?.email}</p>
                    <p className="text-[11px] text-secondary font-semibold mt-0.5">{user?.businessType}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>{t("nav.dashboard")}</span>
                  </Link>
                  <Link
                    href="/find-scheme"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-tertiary" />
                    <span>{t("nav.updateProfile")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors border-t border-border-subtle mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-sans text-xs font-bold tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(159,60,0,0.2)] hover:shadow-[0_0_20px_rgba(159,60,0,0.35)]"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-card border-b border-outline-variant px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 px-3 rounded-lg ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container py-2.5 rounded-lg font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>{t("nav.logout")} ({user?.name})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-primary text-on-primary py-3 rounded-lg font-bold text-sm tracking-wide uppercase"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
