"use client";

import React from "react";
import Link from "next/link";
import { Shield, Building2, MapPin, Mail, Phone, Database } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40 pt-16 pb-12 text-on-surface-variant text-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Sahayak AI Official Logo"
              className="h-20 sm:h-24 md:h-28 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-text-secondary leading-relaxed">
            Institutional financial intelligence platform empowering MSMEs, traditional artisans, and entrepreneurs across India with AI-powered government scheme discovery.
          </p>
          <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
            <Shield className="w-4 h-4 text-tertiary" />
            <span>Government Portal Compliant</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Scheme Discovery</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/find-scheme" className="hover:text-primary transition-colors">
                Find My Scheme Profile Builder
              </Link>
            </li>
            <li>
              <Link href="/schemes" className="hover:text-primary transition-colors">
                Best Matched Schemes
              </Link>
            </li>
            <li>
              <Link href="/simulator" className="hover:text-primary transition-colors">
                What-If Financial Simulator
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="hover:text-primary transition-colors">
                EMI Calculator &amp; Repayment Planner
              </Link>
            </li>
            <li>
              <Link href="/admin/database" className="text-primary font-bold hover:underline flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> Database Explorer
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Top Categories</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="hover:text-primary cursor-pointer">Micro & Small Business Credit</span>
            </li>
            <li>
              <span className="hover:text-primary cursor-pointer">Women Entrepreneurship Subsidies</span>
            </li>
            <li>
              <span className="hover:text-primary cursor-pointer">PM Vishwakarma Artisan Grants</span>
            </li>
            <li>
              <span className="hover:text-primary cursor-pointer">CGTMSE Collateral Guarantee</span>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="space-y-3">
          <h4 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">Facilitation Support</h4>
          <div className="space-y-2 text-xs">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>National Facilitation Hub, BKC, Mumbai</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>1800-180-1551 (Toll-Free Helpline)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>support@sahayakai.gov.in</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-border-subtle pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-text-secondary gap-4">
        <p>© 2026 Sahayak AI Financial Intelligence. Built based on Stitch Design System.</p>
        <div className="flex gap-6">
          <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer">Terms of Service</span>
          <span className="hover:text-primary cursor-pointer">Accessibility</span>
        </div>
      </div>
    </footer>
  );
};
