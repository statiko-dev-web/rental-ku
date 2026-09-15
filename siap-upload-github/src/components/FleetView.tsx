import React from 'react';
import { Phone, Instagram, Facebook } from 'lucide-react';
import { Car, SiteSettings } from '../types';
import { CarCard } from './CarCard';
import { BannerCta } from './BannerCta';
import { TikTokIcon } from './TikTokIcon';

interface FleetViewProps {
  cars: Car[];
  settings: SiteSettings;
  onViewDetails: (car: Car) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({ cars, settings, onViewDetails }) => {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO SECTION (Full Background Image with Center Gradient) */}
      <section className="w-full bg-[#121316] relative overflow-hidden font-inter min-h-[480px] lg:min-h-[540px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={settings.fleetHeroImage || "/hero-fleet.webp"}
            alt="Armada Mobil Kerabat Rentcar Jambi"
            className="w-full h-full object-cover object-[75%_center] lg:object-[80%_center]"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
          />

          {/* GRADASI DESKTOP:
              - Sisi Kiri (0% - 45%): Overlay gelap 85% (#121316), sehingga gambar tampil tipis 15% opacity dan teks sangat jelas terbaca
              - Bagian Tengah (45% - 62%): Transisi gradasi lembut
              - Sisi Kanan (75% - 100%): Transparan 0%, gambar tampil 100% opacity penuh dan tajam
          */}
          <div 
            className="hidden lg:block absolute inset-0" 
            style={{
              background: 'linear-gradient(to right, #121316 0%, rgba(18, 19, 22, 0.85) 45%, rgba(18, 19, 22, 0.35) 62%, transparent 75%, transparent 100%)'
            }}
          />

          {/* GRADASI MOBILE & TABLET (< lg):
              Gradasi vertikal agar teks tetap kontras di atas gambar latar pada layar kecil
          */}
          <div className="block lg:hidden absolute inset-0 bg-gradient-to-t from-[#121316] via-[#121316]/85 to-[#121316]/60" />

          {/* Border halus pembaur di bagian bawah */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#121316]/70 to-transparent" />
        </div>

        {/* Content Overlay Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24 w-full">
          <div className="max-w-xl lg:max-w-2xl space-y-6 text-left">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.08] drop-shadow-sm">
                Sewa Rental Mobil di Jambi? <br />
                <span className="text-white">Ya Di Kerabat Rentcar Aja!</span>
              </h1>
              <p className="text-base sm:text-lg text-white/90 font-light max-w-lg leading-relaxed drop-shadow-xs">
                Berbagai Pilihan Armada Mobil Prima Untuk Kebutuhan Perjalananmu di Jambi
              </p>
            </div>

            {/* Call Pill Button */}
            <div>
              <a
                id="fleet-hero-call-btn"
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#E11D2A] text-slate-900 font-medium text-sm tracking-tight shadow-xl hover:bg-[#E11D2A] hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#E11D2A]" />
                <span>Hubungi Kami: {settings.phone}</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors border border-white/10 backdrop-blur-xs shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors border border-white/10 backdrop-blur-xs shadow-xs"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E11D2A] text-white flex items-center justify-center transition-colors border border-white/10 backdrop-blur-xs shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: DAFTAR MOBIL & HARGA SEWA (Tanpa Search Bar & Tanpa Filter sesuai instruksi) */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Harga Sewa Rental Mobil
            </h2>
            <p className="text-sm font-semibold text-[#E11D2A]">
              Dalam & Luar Kota
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Kami menyediakan beberapa pilihan mobil prima untuk kebutuhan para pelanggan Kerabat Rentcar di Kota Jambi dan sekitarnya.
            </p>
          </div>

          {/* Full Clean Fleet Grid (Centered, 4 cards per row on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                settings={settings}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. BANNER PENUTUP */}
      <BannerCta settings={settings} />

    </div>
  );
};
