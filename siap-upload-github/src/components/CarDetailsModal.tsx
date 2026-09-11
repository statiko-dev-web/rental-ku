import React from 'react';
import { X, Users, Cog, Luggage, CheckCircle2, MessageCircle, Shield, Info } from 'lucide-react';
import { Car, SiteSettings } from '../types';

interface CarDetailsModalProps {
  car: Car | null;
  onClose: () => void;
  settings: SiteSettings;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose, settings }) => {
  if (!car) return null;

  const waMessage = settings.waMessageTemplate.replace('{mobil}', car.name);
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Car Name and Close Button */}
        <div className="bg-[#121316] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D2A]" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              Spesifikasi Lengkap: {car.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Image and Status */}
          <div className="relative bg-gray-50 rounded-xl p-4 flex items-center justify-center h-48 sm:h-56">
            <img
              src={car.image}
              alt={car.name}
              className="max-h-full max-w-full object-contain drop-shadow-md rounded-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                car.status === 'available'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {car.status === 'available' ? 'Unit Tersedia' : 'Sedang Disewa'}
              </span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl text-center border border-gray-100">
              <Users className="w-5 h-5 text-[#E11D2A] mx-auto mb-1" />
              <div className="text-[11px] text-slate-500 font-medium">Kapasitas</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">{car.seats} Penumpang</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-center border border-gray-100">
              <Cog className="w-5 h-5 text-[#E11D2A] mx-auto mb-1" />
              <div className="text-[11px] text-slate-500 font-medium">Transmisi</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">{car.transmission}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-center border border-gray-100">
              <Luggage className="w-5 h-5 text-[#E11D2A] mx-auto mb-1" />
              <div className="text-[11px] text-slate-500 font-medium">Bagasi</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">{car.luggage}</div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-red-50/60 rounded-xl p-4 border border-red-100">
            <h4 className="text-xs font-bold text-[#E11D2A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Rincian Tarif Sewa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-red-100/70">
                <div className="text-slate-500 text-[11px]">12 Jam / Dalam Kota</div>
                <div className="font-bold text-slate-900 mt-0.5">{car.price12h}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-red-100/70">
                <div className="text-slate-500 text-[11px]">Harian + Supir</div>
                <div className="font-bold text-slate-900 mt-0.5">{car.priceDaily}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-red-100/70">
                <div className="text-slate-500 text-[11px]">Paket Bulanan</div>
                <div className="font-bold text-slate-900 mt-0.5">{car.priceMonthly}</div>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Fasilitas Termasuk:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unit Bersih & Wangi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>AC Dingin & Terawat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Asuransi Kendaraan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bantuan Darurat 24 Jam</span>
              </div>
            </div>
            {car.notes && (
              <p className="pt-2 text-slate-500 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "{car.notes}"
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-slate-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Pesan Sekarang via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
