import React from 'react';
import { MessageCircle, ArrowRight, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { Car, SiteSettings } from '../types';

interface CarCardProps {
  car: Car;
  settings: SiteSettings;
  onViewDetails: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, settings, onViewDetails }) => {
  const isAvailable = car.status === 'available';

  const waMessage = settings.waMessageTemplate.replace('{mobil}', car.name);
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 hover:border-red-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col p-5 sm:p-6 text-center group relative">
      
      {/* Availability Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full z-10">
        {isAvailable ? (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Tersedia
          </span>
        ) : (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Booked
          </span>
        )}
      </div>

      {/* Car Image Container */}
      <div className="h-44 sm:h-48 w-full flex items-center justify-center overflow-hidden mb-3 pt-2">
        <img
          src={car.image}
          alt={car.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md rounded-lg"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      {/* Red Pill Vehicle Name Badge */}
      <div className="mb-4">
        <div className="inline-block w-full py-2 px-4 rounded-full bg-[#E11D2A] text-white font-bold text-sm tracking-wide shadow-xs">
          {car.name}
        </div>
      </div>

      {/* Rates Breakdown */}
      <div className="space-y-3 mb-4 text-xs sm:text-[13px] text-slate-700">
        <div>
          <div className="font-bold text-slate-900">{car.price12h}</div>
          <div className="text-[11px] text-slate-500 font-medium">(12 jam / dalam kota)</div>
        </div>

        <div>
          <div className="font-bold text-slate-900">{car.priceDaily}</div>
          <div className="text-[11px] text-slate-500 font-medium">(Harian + Supir)</div>
        </div>

        <div>
          <div className="font-bold text-slate-900">{car.priceMonthly}</div>
          <div className="text-[11px] text-slate-500 font-medium">(Monthly)</div>
        </div>
      </div>

      {/* Red Divider Accent Line */}
      <div className="w-16 h-0.5 bg-[#E11D2A] mx-auto mb-4" />

      {/* Bottom Action Area */}
      <div className="mt-auto space-y-2">
        {/* WhatsApp Button */}
        <a
          id={`pesan-wa-btn-${car.id}`}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full border border-gray-300 hover:border-[#25D366] bg-white text-slate-800 hover:text-[#25D366] font-bold text-xs tracking-tight shadow-xs hover:shadow-sm active:scale-[0.97] transition-all group/btn"
        >
          <span>Pesan sekarang</span>
          <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20 group-hover/btn:scale-110 transition-transform" />
        </a>

        {/* Car Details Link */}
        <button
          id={`car-details-btn-${car.id}`}
          onClick={() => onViewDetails(car)}
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#E11D2A] transition-colors py-1 cursor-pointer"
        >
          <span>Car Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
