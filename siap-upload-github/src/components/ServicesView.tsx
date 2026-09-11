import React, { useState, useRef } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Car, SiteSettings } from '../types';
import { CarCard } from './CarCard';
import { BannerCta } from './BannerCta';

interface ServicesViewProps {
  cars: Car[];
  settings: SiteSettings;
  onViewDetails: (car: Car) => void;
}

interface ServiceTab {
  id: string;
  name: string;
  title: string;
  image: string;
  desc1: string;
  desc2: string;
}

const SERVICE_TABS: ServiceTab[] = [
  {
    id: 'family',
    name: 'Family Car',
    title: 'Family Car',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    desc1: 'Salah satu hal terbaik tentang melakukan perjalanan bersama keluarga adalah memiliki rental mobil keluarga yang dapat diandalkan. Hal ini tidak hanya memastikan bahwa setiap orang dapat melakukan perjalanan bersama, tetapi juga membuat perjalanan menjadi lebih menyenangkan. Ada banyak alasan mengapa mobil keluarga lebih baik untuk bepergian dari pada transportasi lainnya.',
    desc2: 'Rental-ku adalah pilihan sempurna untuk perjalanan keluarga! Kami memiliki berbagai mobil keluarga untuk dipilih, sehingga Anda dapat menemukan yang sempurna untuk kebutuhan Anda. Mobil kami dapat diandalkan dan nyaman, dan kami menawarkan penawaran hebat untuk persewaan mobil keluarga.'
  },
  {
    id: 'city',
    name: 'City Car',
    title: 'City Car',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80',
    desc1: 'Kami menyediakan layanan City Car untuk Anda membutuhkan kendaraan yang bisa digunakan untuk melewati jalan perkotaan yang padat atau macet, maka mobil city car bisa dipilih karena memiliki dimensi yang kecil, selain lebih nyaman dan efisien, untuk anda yg memiliki rencana kebeberapa titik tujuan dalam satu hari, Sewa Rental mobil memudahkan anda untuk berpergian dengan satu mobil yang sama.',
    desc2: 'Rental-ku Indonesia adalah pilihan sempurna untuk persewaan mobil City Car! Kami memiliki berbagai mobil untuk dipilih, sehingga Anda dapat menemukan yang sempurna untuk kebutuhan Anda. Mobil kami dapat diandalkan dan nyaman, kami menawarkan Harga Sewa Rental Mobil yang sangat kompetitive dan hemat.'
  },
  {
    id: 'wedding',
    name: 'Wedding Car',
    title: 'Wedding Car',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    desc1: 'Pernikahan adalah sesuatu yang harus dihargai dan dicintai, karena itu adalah simbol cinta sejati dan pengabdian. Ini adalah hari yang dipenuhi dengan kebahagiaan, air mata kegembiraan, dan cinta yang akan bertahan seumur hidup. Jika Anda sedang mencari cara unik untuk membuat hari pernikahan Anda tak terlupakan, pertimbangkan untuk menyewa salah satu mobil kami yang luar biasa!',
    desc2: 'Armada kami terdapat beragam pilihan mobil untuk Wedding Car. Kami akan menyediakan mobil yang sempurna untuk kebutuhan pernikahan Anda, dan kami akan mengurus semua detailnya sehingga Anda dapat bersantai dan menikmati hari istimewa Anda.'
  },
  {
    id: 'premium',
    name: 'Premium Car',
    title: 'Premium Car',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    desc1: 'Mobil-mobil Premium sering dianggap sebagai yang terbaik yang ditawarkan oleh Dealer2 mobil, dan dilengkapi dengan fitur-fitur yang tidak tersedia pada model lain. Seringkali, mobil-mobil ini ditujukan untuk keperluan mewah yang menginginkan yang terbaik dari yang terbaik.',
    desc2: 'Rental-ku Indonesia adalah layanan sewa mobil premium terbaik. Anda dapat memilih dari berbagai mobil kelas atas yang sempurna untuk segala kesempatan. Baik Anda sedang mencari mobil premium mewah untuk dibawa dalam perjalanan akhir pekan, atau membutuhkan kendaraan yang lebih besar untuk liburan keluarga Anda. Pengemudi kami yang berpengalaman akan mengurus semuanya sehingga Anda dapat bersantai dan menikmati perjalanan Anda dengan mobil premium pilihan Anda.'
  },
  {
    id: 'pariwisata',
    name: 'Pariwisata',
    title: 'Pariwisata',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    desc1: 'Tidak diragukan lagi bahwa wisata memang menyenangkan, tetapi akan lebih menyenangkan lagi jika Anda melakukannya bersama keluarga. Anda tidak hanya dapat menghabiskan waktu berkualitas bersama, tetapi Anda juga dapat mengalami hal-hal baru dan menjelajahi tempat-tempat baru.',
    desc2: 'Kami menyediakan mobil pariwisata yang tepat untuk rencana liburan keluarga Anda. Rental-ku Indonesia adalah layanan sewa mobil terbaik bagi wisatawan yang ingin menjelajahi kota baru tanpa khawatir mengemudi di area asing. Kami menawarkan pengemudi berpengalaman yang mengetahui daerah dengan baik, sehingga Anda dapat bersantai dan menikmati liburan Anda. Mobil kami juga tersedia dengan harga terjangkau, sehingga Anda dapat menghemat uang saat bepergian.'
  },
  {
    id: 'perusahaan',
    name: 'Perusahaan',
    title: 'Perusahaan',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop&q=80',
    desc1: 'Ketika Anda memulai bisnis, salah satu hal yang perlu Anda pertimbangkan adalah transportasi. Rental-ku Indonesia menawarkan berbagai pilihan mobil yang tersedia untuk disewakan. Kami menyediakan berbagai pilihan type kontrak untuk perusahaan, seperti Lepas kunci atau dengan Driver.',
    desc2: 'Dengan memilih Sewa Rental Mobil untuk Perusahaan, anda terhindar dari biaya2 maintenance, karena biaya2 maintenance akan di tanggung oleh kami. Rental-ku Indonesia sendiri sudah berbasis PT, (PT. RENTALKU MOBIL INDONESIA). Kontrak Perusahaan yang harus berbasis PT bisa dengan tenang bekerja sama bersama kami.'
  },
  {
    id: 'event',
    name: 'Event Car',
    title: 'Event Car',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80',
    desc1: 'Dalam menyelenggarakan acara, salah satu elemen terpenting adalah memastikan bahwa para tamu dapat pergi ke dan dari tempat tersebut tanpa masalah. Di sinilah layanan transportasi masuk, karena kami dapat membantu mempermudah proses bagi semua orang yang terlibat. Dengan menyediakan layanan antar-jemput atau mengatur transportasi, penyelenggara dapat memastikan bahwa para tamu tidak perlu khawatir untuk bepergian.',
    desc2: 'Jika Anda sedang mencari layanan sewa mobil tanpa repot untuk event Anda berikutnya, tidak perlu mencari yang lain selain Rental-ku Indonesia! Kami menyediakan rental mobil yang dilengkapi dengan Driver yang Profesional, Plus harga kompetitif kami memudahkan anggaran untuk transportasi acara Anda.'
  }
];

export const ServicesView: React.FC<ServicesViewProps> = ({ cars, settings, onViewDetails }) => {
  const [activeTabId, setActiveTabId] = useState<string>('family');
  const [sliderIndex, setSliderIndex] = useState(0);
  const [mobileCarIndex, setMobileCarIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const prevMobileCar = () => {
    setMobileCarIndex((prev) => (prev > 0 ? prev - 1 : cars.length - 1));
  };

  const nextMobileCar = () => {
    setMobileCarIndex((prev) => (prev < cars.length - 1 ? prev + 1 : 0));
  };

  const activeTab = SERVICE_TABS.find((t) => t.id === activeTabId) || SERVICE_TABS[0];

  const visibleCount = 4;
  const maxSliderIndex = Math.max(0, cars.length - visibleCount);

  const prevSlider = () => {
    setSliderIndex((prev) => (prev > 0 ? prev - 1 : maxSliderIndex));
  };

  const nextSlider = () => {
    setSliderIndex((prev) => (prev < maxSliderIndex ? prev + 1 : 0));
  };

  const visibleCars = cars.slice(sliderIndex, sliderIndex + visibleCount);

  const waBookingUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Halo Rental-ku Indonesia, saya ingin menanyakan layanan ${activeTab.title}.`)}`;

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HEADER SECTION (Screenshot 3 Layanan) */}
      <section className="w-full py-10 lg:py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Layanan Terbaik dari Kami Bersama Rentalku Indonesia
            </h1>
            <div className="w-16 h-1 bg-[#E11D2A] mx-auto rounded-full" />
          </div>

          {/* 7 Horizontal Pill Tabs with Left and Right Arrows */}
          <div className="relative max-w-4xl mx-auto px-2">
            {/* Left Nav Arrow */}
            <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-4 pointer-events-none sm:hidden">
              <button
                id="tabs-scroll-left-btn"
                onClick={() => scrollTabs('left')}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-slate-700 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Geser tab ke kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Tab Container with generous padding to prevent cutting off */}
            <div 
              ref={tabsRef}
              className="flex items-center justify-start sm:justify-center overflow-x-auto py-2.5 px-10 sm:px-2 gap-2.5 no-scrollbar scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SERVICE_TABS.map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`service-tab-${tab.id}`}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#E11D2A] text-white shadow-md'
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Right Nav Arrow */}
            <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-4 pointer-events-none sm:hidden">
              <button
                id="tabs-scroll-right-btn"
                onClick={() => scrollTabs('right')}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 text-slate-700 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Geser tab ke kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Tab Content (Split Layout Kiri-Kanan) */}
          <div className="mt-8 bg-gray-50/70 rounded-2xl p-6 sm:p-10 border border-gray-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                  <img
                    src={activeTab.image}
                    alt={activeTab.title}
                    className="w-full h-72 sm:h-96 object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#E11D2A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {activeTab.name}
                  </div>
                </div>
              </div>

              {/* Right Content & WA CTA */}
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab.title}
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>{activeTab.desc1}</p>
                  <p>{activeTab.desc2}</p>
                </div>

                <div className="pt-2">
                  <a
                    id="services-tab-pesan-wa-btn"
                    href={waBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 hover:border-[#25D366] bg-white text-slate-900 hover:text-[#25D366] font-bold text-xs shadow-xs hover:shadow-md transition-all"
                  >
                    <span>Pesan sekarang</span>
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION: HARGA SEWA RENTAL MOBIL (Rekomendasi Armada di Layanan - Screenshot 4) */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
            <button
              id="services-mobile-car-prev-btn"
              onClick={prevMobileCar}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {cars.length > 0 && (
              <div className="w-full">
                <CarCard
                  car={cars[mobileCarIndex]}
                  settings={settings}
                  onViewDetails={onViewDetails}
                />
              </div>
            )}

            <button
              id="services-mobile-car-next-btn"
              onClick={nextMobileCar}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 text-slate-800 hover:text-[#E11D2A] active:scale-90 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Armada Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop/Tablet View: Carousel Slider */}
          <div className="hidden sm:block relative">
            <button
              onClick={prevSlider}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

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

            <button
              onClick={nextSlider}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-slate-700 hover:text-[#E11D2A] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex sm:hidden items-center justify-center space-x-1.5 mt-6">
            {cars.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileCarIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  mobileCarIndex === idx ? 'w-5 bg-[#E11D2A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Armada ${idx + 1}`}
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
