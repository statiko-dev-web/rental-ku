import React, { useState } from 'react';
import { Phone, Menu, X, Car as CarIcon } from 'lucide-react';
import { PageId, SiteSettings } from '../types';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'fleet', label: 'Daftar Mobil & Harga Sewa' },
    { id: 'services', label: 'Layanan' },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Logo Section */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center group text-left cursor-pointer focus:outline-none py-1"
          >
            <img
              src="/logo/logo-header.svg"
              alt="Kerabat Rentcar Logo"
              className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive ? 'text-[#E11D2A]' : 'text-slate-700 hover:text-[#E11D2A]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#E11D2A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Hotline CTA in Header */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              id="header-hotline-btn"
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Halo Kerabat Rentcar Jambi, saya ingin tanya info rental mobil.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E11D2A] text-[#E11D2A] hover:bg-[#E11D2A] hover:text-white transition-all text-xs font-bold shadow-xs hover:shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#E11D2A] rounded-full hover:bg-red-50"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-50 text-[#E11D2A]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Hotline 24 Jam:</span>
              <a
                href={`tel:${settings.phone}`}
                className="text-xs font-bold text-[#E11D2A] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
