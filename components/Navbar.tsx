"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { Globe, User, LogOut, Menu, X, ChevronDown, Sliders, ShieldCheck, Bell } from "lucide-react";
import { getNewMatchingSchemes, MOCK_SCHEMES } from "@/lib/api";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const newSchemes = isAuthenticated && user ? getNewMatchingSchemes(MOCK_SCHEMES, user) : [];

  const navLinks = [
    { href: "/schemes", label: t("nav.explore") || "Schemes" },
    { href: "/find-scheme", label: t("nav.find") || "Find For Business" },
    { href: "/find-education-loan", label: "For Students" },
    { href: "/simulator", label: t("nav.simulator") || "Simulator" },
    { href: "/calculator", label: t("nav.calculator") || "Calculator" },
    { href: "/partners", label: t("nav.partners") || "Partners" },
  ];

  return (
    <nav className="bg-surface/95 backdrop-blur-md sticky top-0 border-b border-outline-variant/30 shadow-sm z-50 transition-colors">
      <div className="flex justify-between items-center px-6 md:px-12 h-24 sm:h-28 w-full max-w-7xl mx-auto gap-4">
        {/* Large Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group py-2 shrink-0">
          <img
            src="/logo.png"
            alt="Sahayak AI Logo - Find the Funding that Fits You"
            className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links (Floating Glass Pill) */}
        <div className="hidden xl:flex items-center p-1.5 space-x-1 bg-surface-container-low/60 backdrop-blur-2xl border border-outline-variant/40 rounded-full shadow-sm mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-xs lg:text-[13px] font-bold transition-all duration-300 px-4 py-2.5 rounded-full whitespace-nowrap ${isActive
                    ? "bg-primary text-on-primary shadow-md scale-105"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container/50"
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
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotificationDropdownOpen(!notificationDropdownOpen); setProfileDropdownOpen(false); setLanguageDropdownOpen(false); }}
                  className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  {newSchemes.length > 0 && (
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-error rounded-full animate-pulse border border-surface-card"></span>
                  )}
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-surface-card/90 backdrop-blur-xl border border-outline-variant rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-border-subtle flex justify-between items-center">
                      <p className="font-bold text-sm text-on-surface">New Matches</p>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{newSchemes.length} New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {newSchemes.length > 0 ? (
                        newSchemes.map((scheme) => (
                          <Link
                            key={scheme.id}
                            href={`/schemes/${scheme.id}`}
                            onClick={() => setNotificationDropdownOpen(false)}
                            className="block px-4 py-3 border-b border-border-subtle/50 hover:bg-surface-container-low transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-on-surface line-clamp-1">{scheme.name}</p>
                                <p className="text-[10px] text-text-secondary mt-0.5">Matched {scheme.matchScore}% with your profile</p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs text-text-secondary">No new schemes matching your profile right now.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
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
            </div>
          ) : (
            <div className="flex items-center space-x-3 shrink-0">
              <Link
                href="/login"
                className="text-on-surface hover:text-primary font-sans text-[13px] font-bold transition-colors px-3 py-2 whitespace-nowrap uppercase tracking-wide"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-full font-sans text-xs font-bold tracking-wide uppercase transition-all shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
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
                className={`text-base font-semibold py-2 px-3 rounded-lg ${pathname === link.href
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
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border-2 border-primary text-primary py-3 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-primary/5 transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-primary text-on-primary py-3 rounded-xl font-bold text-sm tracking-wide uppercase shadow-md hover:bg-primary-container transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
