import React, { useState } from 'react';
import { 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Car as CarIcon, 
  Clock, 
  ShieldCheck, 
  Users, 
  Banknote, 
  ArrowRight,
  Instagram,
  Facebook,
  Search,
  Rocket,
  FileText
} from 'lucide-react';
import { Car, SiteSettings, PageId } from '../types';
import { CarCard } from './CarCard';
import { BannerCta } from './BannerCta';
import { TikTokIcon } from './TikTokIcon';

interface HomeViewProps {
  cars: Car[];
  settings: SiteSettings;
  setCurrentPage: (page: PageId) => void;
  onViewDetails: (car: Car) => void;
}

interface ServiceCategoryItem {
  id: string;
  name: string;
  desc: string;
  image: string;
}

const ALL_SERVICES: ServiceCategoryItem[] = [
  {
    id: 'family',
    name: 'Family Car',
    desc: 'Nikmati kebersamaan liburan keluarga besar dengan mobil keluarga yang lega dan nyaman.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'city',
    name: 'City Car',
    desc: 'Kendaraan lincah, gesit, dan hemat bahan bakar untuk kemudahan mobilitas di perkotaan.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'wedding',
    name: 'Wedding Car',
    desc: 'Mobil pengantin mewah berdekorasi bunga anggun dengan driver rapi untuk hari bahagia Anda.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'premium',
    name: 'Premium Car',
    desc: 'Pengalaman berkendara eksekutif mewah dengan unit prestisius dan standar pelayanan VVIP.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pariwisata',
    name: 'Pariwisata & Tour',
    desc: 'Armada pariwisata fasilitas lengkap AC double blower & audio untuk liburan rombongan.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'perusahaan',
    name: 'Kontrak Perusahaan',
    desc: 'Skema rental operasional jangka panjang untuk korporasi dengan servis rutin dan unit pengganti.',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'event',
    name: 'Event & Shuttle Car',
    desc: 'Dukungan armada massal untuk konser, konferensi, dan event akbar dengan jadwal ketat dan teratur.',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ cars, settings, setCurrentPage, onViewDetails }) => {
  // Carousel index for fleet
  const [fleetIndex, setFleetIndex] = useState(0);
  const visibleCount = 4;
  const maxFleetIndex = Math.max(0, cars.length - visibleCount);

  const prevFleet = () => {
    setFleetIndex((prev) => (prev > 0 ? prev - 1 : maxFleetIndex));
  };

  const nextFleet = () => {
    setFleetIndex((prev) => (prev < maxFleetIndex ? prev + 1 : 0));
  };

  const visibleCars = cars.slice(fleetIndex, fleetIndex + visibleCount);

  // Mobile single-card carousel for fleet
  const [mobileFleetIndex, setMobileFleetIndex] = useState(0);
  const prevMobileFleet = () => {
    setMobileFleetIndex((prev) => (prev > 0 ? prev - 1 : cars.length - 1));
  };
  const nextMobileFleet = () => {
    setMobileFleetIndex((prev) => (prev < cars.length - 1 ? prev + 1 : 0));
  };

  // Carousel index for service categories
  const [servicesIndex, setServicesIndex] = useState(0);
  const maxServicesIndex = Math.max(0, ALL_SERVICES.length - visibleCount);

  const prevServices = () => {
    setServicesIndex((prev) => (prev > 0 ? prev - 1 : maxServicesIndex));
  };

  const nextServices = () => {
    setServicesIndex((prev) => (prev < maxServicesIndex ? prev + 1 : 0));
  };

  const visibleServices = ALL_SERVICES.slice(servicesIndex, servicesIndex + visibleCount);

  // Mobile single-card carousel for services
  const [mobileServicesIndex, setMobileServicesIndex] = useState(0);
  const prevMobileServices = () => {
    setMobileServicesIndex((prev) => (prev > 0 ? prev - 1 : ALL_SERVICES.length - 1));
  };
  const nextMobileServices = () => {
    setMobileServicesIndex((prev) => (prev < ALL_SERVICES.length - 1 ? prev + 1 : 0));
  };

  // 6 Pillars (Visi, Misi, Terjangkau, Responsif, Legalitas, Profesional)
  const pillars = [
    {
      id: 'visi',
      title: 'Visi',
      desc: 'Menjadi perusahaan penyedia Transportasi terdepan yang menjadi andalan dan dipercaya di Indonesia.',
      iconUrl: '/icons/visi.png',
    },
    {
      id: 'misi',
      title: 'Misi',
      desc: 'Menjadikan kepuasan & kenyamanan setiap customer sebagai prioritas utama, dengan menyediakan solusi terbaik untuk dalam bertranportasi.',
      iconUrl: '/icons/misi.png',
    },
    {
      id: 'terjangkau',
      title: 'Terjangkau',
      desc: 'Harga yang kami tawarkan sangat terjangkau untuk setiap pemesanannya tanpa biaya tersembunyi.',
      iconUrl: '/icons/terjangkau.png',
    },
    {
      id: 'responsif',
      title: 'Responsif',
      desc: 'Kami siap memberikan layanan terbaik setiap hari selama 24 jam penuh untuk kenyamanan Anda.',
      iconUrl: '/icons/responsif.png',
    },
    {
      id: 'legalitas',
      title: 'Legalitas',
      desc: `Kami adalah perusahaan berbadan hukum resmi, yaitu ${settings.companyName}.`,
      iconUrl: '/icons/legalitas.png',
    },
    {
      id: 'profesional',
      title: 'Profesional',
      desc: 'Dengan tim yang ramah dan profesional, sehingga memberi kenyamanan penuh untuk customer.',
      iconUrl: '/icons/professional.png',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO SECTION (Full Background Image with Center Gradient) */}
      <section className="w-full bg-[#121316] relative overflow-hidden font-inter min-h-[480px] lg:min-h-[540px] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={settings.heroImage || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&auto=format&fit=crop&q=85"}
            alt="Hero Background Rentalku Indonesia"
            className="w-full h-full object-cover object-[75%_center] lg:object-[80%_center]"
            referrerPolicy="no-referrer"
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
                Sewa Rental Mobil? <br />
                <span className="text-white">Ya Di Rentalku Aja!</span>
              </h1>
              <p className="text-base sm:text-lg text-white/90 font-light max-w-lg leading-relaxed drop-shadow-xs">
                Nikmati Perjalananmu Bersama Rentalku Indonesia
              </p>
            </div>

            {/* Call Button with Red Stroke */}
            <div>
              <a
                id="hero-call-btn"
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#E11D2A] text-slate-900 font-medium text-sm tracking-tight shadow-xl hover:bg-[#E11D2A] hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer btn-shimmer"
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

      {/* 2. SECTION: HARGA SEWA RENTAL MOBIL (Max 4 Cards, Carousel Slider) */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-semibold text-slate-900 tracking-tight">
              Harga Sewa Rental Mobil
            </h2>
            <p className="text-sm font-semibold text-[#E11D2A]">
              Dalam & Luar Kota
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Kami menyediakan beberapa pilihan mobil untuk kebutuhan para customer Rentalku.
            </p>
          </div>

          {/* Mobile View: 1 Card with Left and Right Arrows on Sides */}
          <div className="block sm:hidden relative px-8">
            {/* Left Nav Arrow */}
            <button
              id="mobile-fleet-prev-btn"
              onClick={prevMobileFleet}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* 1 Card */}
            {cars.length > 0 && (
              <div className="w-full">
                <CarCard
                  car={cars[mobileFleetIndex]}
                  settings={settings}
                  onViewDetails={onViewDetails}
                />
              </div>
            )}

            {/* Right Nav Arrow */}
            <button
              id="mobile-fleet-next-btn"
              onClick={nextMobileFleet}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop/Tablet View: Grid Carousel Slider */}
          <div className="hidden sm:block relative">
            {/* Left Nav Arrow */}
            <button
              id="fleet-prev-btn"
              onClick={prevFleet}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {visibleCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  settings={settings}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>

            {/* Right Nav Arrow */}
            <button
              id="fleet-next-btn"
              onClick={nextFleet}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex sm:hidden items-center justify-center space-x-1.5 mt-6">
            {cars.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileFleetIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  mobileFleetIndex === idx ? 'w-5 bg-[#E11D2A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Armada ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Dots Indicator */}
          <div className="hidden sm:flex items-center justify-center space-x-2 mt-8">
            {Array.from({ length: maxFleetIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFleetIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  fleetIndex === idx ? 'w-6 bg-[#E11D2A]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => { setCurrentPage('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E11D2A] hover:underline cursor-pointer"
            >
              <span>Lihat Seluruh Katalog Armada ({cars.length} Unit)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. SECTION: MENGAPA RENTAL-KU? + VISI MISI MARQUEE EFFECT */}
      <section className="w-full py-12 lg:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-semibold text-slate-900 tracking-tight leading-[1.15]">
                  Mengapa <br />
                  <span className="text-slate-950 border-b-4 border-[#E11D2A] pb-1">Rental-ku?</span>
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                <p>
                  <strong className="text-slate-900 font-bold">Rentalku Indonesia</strong> menawarkan transportasi rental mobil yang aman dan nyaman dengan pilihan kendaraan yang lengkap. Harga terjangkau namun tetap mengedepankan pelayanan serta kualitas.
                </p>
                <p>
                  Kami memiliki tahapan dalam menjaga layanan yang ramah dan jujur pada Customer, tentunya dengan driver profesional dan berpengalaman, karena setiap perjalanan memiliki makna berbeda bagi untuk setiap orang.
                </p>
                <p className="font-semibold text-slate-800">
                  Nikmati perjalanan darat kamu lebih nyaman bersama Rental-ku.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#E11D2A] text-slate-900 hover:bg-[#E11D2A] hover:text-white transition-all text-xs font-bold shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E11D2A]" />
                  <span>Hubungi Kami: {settings.phone}</span>
                </a>
              </div>
            </div>

            {/* Right Photo: Kantor / Armada Rental-ku */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-slate-900 max-w-md w-full aspect-[4/3] group">
                <img
                  src="/about-us.webp"
                  alt="Kantor dan Armada Rental-ku Indonesia"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Overlay Elegan di Bawah Foto */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                      <CarIcon className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs tracking-tight text-white leading-none">
                        Rental-<span className="text-[#E11D2A]">ku</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">
                        Armada & Kantor Resmi
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold bg-emerald-600/90 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resmi & Terpercaya</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 6 Pillars Marquee (Visi, Misi, Terjangkau, Responsif, Legalitas, Profesional) */}
          <div className="pt-10 mt-8 border-t border-gray-100 overflow-hidden relative">
            {/* Soft Edge Gradient Masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            <div className="animate-marquee gap-8 sm:gap-12 items-start py-2">
              {pillars.concat(pillars).map((pillar, idx) => (
                <div
                  key={`${pillar.id}-${idx}`}
                  className="text-center space-y-3 p-3 w-64 sm:w-72 shrink-0 group"
                >
                  <div className="flex items-center justify-center h-16 sm:h-20">
                    <img
                      src={pillar.iconUrl}
                      alt={pillar.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECTION: KATEGORI LAYANAN LAINNYA (Carousel Slider with Controls) */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-semibold text-slate-900 tracking-tight">
              Kategori Layanan Lainnya
            </h2>
            <div className="w-14 h-1 bg-[#E11D2A] mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-500 pt-1">
              Kami menyediakan berbagai kategori layanan transportasi untuk ragam kebutuhan perjalanan Anda.
            </p>
          </div>

          {/* Mobile View: 1 Service Card with Left and Right Arrows on Sides */}
          <div className="block sm:hidden relative px-8">
            {/* Left Nav Arrow */}
            <button
              id="mobile-services-prev-btn"
              onClick={prevMobileServices}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Layanan Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* 1 Service Card */}
            {ALL_SERVICES[mobileServicesIndex] && (
              <div className="bg-white rounded-2xl border-2 border-red-400 p-6 flex flex-col justify-between text-center shadow-xs">
                <div className="space-y-4">
                  <div className="h-44 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={ALL_SERVICES[mobileServicesIndex].image}
                      alt={ALL_SERVICES[mobileServicesIndex].name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{ALL_SERVICES[mobileServicesIndex].name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ALL_SERVICES[mobileServicesIndex].desc}
                  </p>
                </div>
                <div className="pt-4 mt-auto">
                  <button
                    onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-xs font-bold text-[#E11D2A] hover:underline inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Pelajari Layanan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Right Nav Arrow */}
            <button
              id="mobile-services-next-btn"
              onClick={nextMobileServices}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Layanan Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop/Tablet View: Grid Carousel Slider */}
          <div className="hidden sm:block relative">
            {/* Left Nav Arrow */}
            <button
              id="services-prev-btn"
              onClick={prevServices}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Layanan Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 4 Services Visible Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {visibleServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border-2 border-red-400 p-6 flex flex-col justify-between text-center h-full shadow-xs card-hover-elevate group overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="h-32 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover img-zoom-hover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-xs font-bold text-[#E11D2A] hover:underline inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Pelajari Layanan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Nav Arrow */}
            <button
              id="services-next-btn"
              onClick={nextServices}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Layanan Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex sm:hidden items-center justify-center space-x-1.5 mt-6">
            {ALL_SERVICES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileServicesIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  mobileServicesIndex === idx ? 'w-5 bg-[#E11D2A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Layanan ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Dots Indicator */}
          <div className="hidden sm:flex items-center justify-center space-x-2 mt-8">
            {Array.from({ length: maxServicesIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setServicesIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  servicesIndex === idx ? 'w-6 bg-[#E11D2A]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Slide Layanan ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. SECTION: KATA PENGGUNA RENTALKU (Screenshot 4 Bottom) */}
      <section className="w-full py-12 lg:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-semibold text-slate-900 tracking-tight">
              Kata Pengguna Rentalku
            </h2>
            <div className="w-14 h-1 bg-[#E11D2A] mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-500 pt-1">
              Kami selalu memberikan pelayanan terbaik, sehingga Customer selalu nyaman menggunakan jasa Kami. Beberapa contoh feedback yang sangat positif dari Customer kita :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Terima Kasih Rentalku Indonesia sudah mengantarkan kami ibu-ibu pengajian ke luar kota dengan selamat. Mobilnya Toyota Hiace bersih wangi, supirnya mas Doni sopan dan sabar sekali."
              </p>
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">Ibu Hj. Rosdiana</div>
                  <div className="text-[11px] text-slate-500">Sewa Toyota Hiace (Wisata)</div>
                </div>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Suka banget dengan Rentalku Indonesia, Next kalau ke Jakarta lagi pasti sewa di sini lagi. Proses lepas kuncinya simpel, unit Grand Innova-nya tarikannya mantap dan bensin irit."
              </p>
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">Dimas Pratama</div>
                  <div className="text-[11px] text-slate-500">Sewa Grand Innova (Lepas Kunci)</div>
                </div>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Terima Kasih mbak Event PMWS Toyota berjalan lancar, armada Fortuner dan Elf datang tepat waktu 30 menit sebelum jadwal penjemputan delegasi di bandara. Very recommended!"
              </p>
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">Sarah Anggraini</div>
                  <div className="text-[11px] text-slate-500">Event Organizer / Airport Transfer</div>
                </div>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. BANNER PENUTUP */}
      <BannerCta settings={settings} />

    </div>
  );
};
