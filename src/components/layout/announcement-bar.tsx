'use client';

import { Truck, Shield, Phone, Camera, Globe, MessageCircle } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#3D0C0C] text-white relative overflow-hidden">
      {/* Top gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C69A45]/50 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop — 4-part balanced layout */}
        <div className="hidden xl:flex items-center justify-between h-[42px] text-[11px] tracking-[0.04em]">
          <div className="flex items-center gap-2.5">
            <Truck size={14} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white/95">FAST DELIVERY</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">Pan India Shipping</span>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-white/10 mx-5" />

          <div className="flex items-center gap-2.5">
            <Shield size={14} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white/95">PREMIUM QUALITY</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">Trusted Products</span>
            </div>
          </div>

          <div className="w-[1px] h-5 bg-white/10 mx-5" />

          <a
            href="tel:+919473831097"
            className="flex items-center gap-2.5 hover:text-[#C69A45] transition-colors duration-300 group"
          >
            <Phone size={14} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white/95">CALL / WHATSAPP</span>
              <span className="text-white/30">·</span>
              <span className="text-white/70 group-hover:text-[#C69A45] transition-colors">+91 9473831097</span>
            </div>
          </a>

          <div className="w-[1px] h-5 bg-white/10 mx-5" />

          <div className="flex items-center gap-3">
            <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium">FOLLOW US</span>
            <div className="flex items-center gap-1.5">
              <a href="#" className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-[#C69A45]/15 hover:border-[#C69A45]/30 hover:text-[#C69A45] transition-all duration-300" aria-label="Instagram">
                <Camera size={12} strokeWidth={1.5} />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-[#C69A45]/15 hover:border-[#C69A45]/30 hover:text-[#C69A45] transition-all duration-300" aria-label="Facebook">
                <Globe size={12} strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/919473831097"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-[#C69A45]/15 hover:border-[#C69A45]/30 hover:text-[#C69A45] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={12} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Tablet (lg — xl) — 3 items, balanced */}
        <div className="hidden lg:flex xl:hidden items-center justify-between h-[38px] text-[10px] tracking-wide">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-white/90">
              <Truck size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
              <span className="font-medium whitespace-nowrap">FAST DELIVERY</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Shield size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
              <span className="font-medium whitespace-nowrap">PREMIUM QUALITY</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+919473831097" className="flex items-center gap-1.5 text-white/85 hover:text-[#C69A45] transition-colors whitespace-nowrap">
              <Phone size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
              <span className="font-medium">+91 9473831097</span>
            </a>
            <div className="flex items-center gap-1.5">
              <a href="#" className="text-white/50 hover:text-[#C69A45] transition-colors" aria-label="Instagram"><Camera size={12} strokeWidth={1.5} /></a>
              <a href="#" className="text-white/50 hover:text-[#C69A45] transition-colors" aria-label="Facebook"><Globe size={12} strokeWidth={1.5} /></a>
              <a href="https://wa.me/919473831097" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#C69A45] transition-colors" aria-label="WhatsApp"><MessageCircle size={12} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>

        {/* Tablet small (md — lg) — condensed 2-item */}
        <div className="hidden md:flex lg:hidden items-center justify-center gap-6 h-[36px] text-[10px] tracking-wide">
          <div className="flex items-center gap-1.5 text-white/90">
            <Truck size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <span className="font-medium whitespace-nowrap">FAST DELIVERY</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90">
            <Shield size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <span className="font-medium whitespace-nowrap">PREMIUM QUALITY</span>
          </div>
          <a href="tel:+919473831097" className="flex items-center gap-1.5 text-white/85 hover:text-[#C69A45] transition-colors whitespace-nowrap">
            <Phone size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <span className="font-medium">+91 9473831097</span>
          </a>
        </div>

        {/* Mobile — simple, centered, readable */}
        <div className="flex md:hidden items-center justify-center h-[36px] text-[11px]">
          <div className="flex items-center gap-2 text-white/90">
            <Truck size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <span className="font-medium">Fast Delivery</span>
            <span className="text-white/25 mx-0.5">|</span>
            <Shield size={12} strokeWidth={1.5} className="text-[#C69A45] shrink-0" />
            <span className="font-medium">Pan India</span>
            <span className="text-white/25 mx-0.5">|</span>
            <a href="tel:+919473831097" className="flex items-center gap-1 text-[#C69A45] font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
              <Phone size={11} strokeWidth={1.5} />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C69A45]/20 to-transparent" />
    </div>
  );
}
