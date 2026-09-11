import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface BannerCtaProps {
  settings: SiteSettings;
}

export const BannerCta: React.FC<BannerCtaProps> = ({ settings }) => {
  const carImage = settings.bannerPenutupImage || '/banner-penutup.webp';
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Halo Rental-ku Indonesia, saya ingin tanya info sewa mobil terbaik.')}`;

  return (
    <section className="w-full bg-white border-t border-gray-100 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
          
          {/* Left: Car Visual (Menyatu tanpa kotak) */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <img
              src={carImage}
              alt="Armada Mobil Rental-ku Indonesia"
              className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Copy & WhatsApp Button */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <span className="inline-block text-xs uppercase font-extrabold tracking-widest text-[#E11D2A]">
              Rental-ku Indonesia
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-semibold text-slate-900 tracking-tight leading-snug lg:leading-tight">
              {settings.bannerCtaTitle}
            </h2>
            
            <div className="pt-2">
              <a
                id="banner-cta-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1E2024] hover:bg-[#E11D2A] text-white font-bold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>{settings.bannerCtaButton}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


