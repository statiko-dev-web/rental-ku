import React, { useState, useRef } from 'react';
import { Phone, MapPin, Clock, Instagram, Facebook, Car as CarIcon, ShieldCheck, Lock } from 'lucide-react';
import { PageId, SiteSettings } from '../types';
import { TikTokIcon } from './TikTokIcon';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
  settings: SiteSettings;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, settings, onOpenCms }) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenCms();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 800);
    }
  };

  return (
    <footer className="bg-[#141518] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-white">
                  <span>Rental-</span>
                  <span className="text-[#E11D2A]">ku</span>
                </div>
                <span className="block text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400">
                  INDONESIA
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Penyedia layanan transportasi dan rental mobil terpercaya di Indonesia. Solusi perjalanan nyaman, armada prima, driver profesional, dan harga terjangkau.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{settings.companyName}</span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Navigasi
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#E11D2A] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#E11D2A] transition-colors cursor-pointer"
                >
                  Tentang Kami & Profil
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#E11D2A] transition-colors cursor-pointer"
                >
                  Daftar Mobil & Harga Sewa
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#E11D2A] transition-colors cursor-pointer"
                >
                  Kategori Layanan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Kami */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Pilihan Layanan
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentPage('services')}>
                • Sewa Lepas Kunci (Self Drive)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentPage('services')}>
                • Sewa Harian + Supir Profesional
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentPage('services')}>
                • Antar Jemput Bandara & Stasiun
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentPage('services')}>
                • Paket Wisata Keluarga (Family Tour)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentPage('services')}>
                • Kontrak Operasional Korporat / Bulanan
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Alamat */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Kontak Kami
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E11D2A] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E11D2A] shrink-0" />
                <span>{settings.hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E11D2A] shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-slate-400 hover:text-[#E11D2A] transition-colors">
                  {settings.phone}
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Secret CMS Trigger */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-1.5">
            {/* Secret 3-Click Trigger on Copyright Text */}
            <span
              onClick={handleSecretClick}
              className="select-none cursor-default transition-colors hover:text-slate-400"
              title="© 2026 PT. Rentalku Mobil Indonesia"
            >
              © 2026 {settings.companyName}. Seluruh hak cipta dilindungi undang-undang.
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            <span>|</span>
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            
            {/* Ultra-subtle stealth lock dot at the very end */}
            <button
              onClick={onOpenCms}
              className="opacity-15 hover:opacity-100 transition-opacity p-1 text-slate-600 hover:text-[#E11D2A] cursor-pointer"
              title="Portal"
              aria-label="Portal"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
