/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { PageId, Car, SiteSettings } from './types';
import { DEFAULT_CARS, DEFAULT_SETTINGS } from './defaultData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { FleetView } from './components/FleetView';
import { ServicesView } from './components/ServicesView';
import { CarDetailsModal } from './components/CarDetailsModal';
import { CmsDashboardView } from './components/CmsDashboardView';
import { WhatsAppIcon } from './components/WhatsAppIcon';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync hash routing for #admin
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else if (currentPage === 'admin') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const handleSetPage = (page: PageId) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial data from server
  useEffect(() => {
    async function loadData() {
      try {
        const [carsRes, settingsRes] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/settings')
        ]);
        if (carsRes.ok) {
          const carsData = await carsRes.json();
          if (Array.isArray(carsData) && carsData.length > 0) {
            setCars(carsData);
          }
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData && settingsData.phone) {
            setSettings(settingsData);
          }
        }
      } catch (err) {
        console.warn('Menggunakan data awal default:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // CRUD Handlers connected to server API
  const handleSaveCar = async (carToSave: Car, isNew: boolean) => {
    if (isNew) {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carToSave),
      });
      if (!res.ok) throw new Error('Failed to create car');
      const savedCar = await res.json();
      setCars((prev) => [savedCar, ...prev]);
    } else {
      const res = await fetch(`/api/cars/${carToSave.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carToSave),
      });
      if (!res.ok) throw new Error('Failed to update car');
      const updatedCar = await res.json();
      setCars((prev) => prev.map((c) => (c.id === updatedCar.id ? updatedCar : c)));
    }
  };

  const handleDeleteCar = async (id: string) => {
    const res = await fetch(`/api/cars/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete car');
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    const updated = await res.json();
    setSettings(updated);
  };

  const handleResetAll = async () => {
    const res = await fetch('/api/reset', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset');
    setCars(DEFAULT_CARS);
    setSettings(DEFAULT_SETTINGS);
  };

  // Dedicated Full-Page CMS Admin View
  if (currentPage === 'admin') {
    return (
      <CmsDashboardView
        cars={cars}
        settings={settings}
        onSaveCar={handleSaveCar}
        onDeleteCar={handleDeleteCar}
        onSaveSettings={handleSaveSettings}
        onResetAll={handleResetAll}
        setCurrentPage={handleSetPage}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] text-slate-800 antialiased selection:bg-[#E11D2A] selection:text-white">
      
      {/* Header & Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleSetPage}
        settings={settings}
      />

      {/* Main Content Pages with ~10% whitespace margins & centered orientation */}
      <main key={currentPage} className="flex-1 w-full flex flex-col items-center animate-view-fade">
        {currentPage === 'home' && (
          <HomeView
            cars={cars}
            settings={settings}
            setCurrentPage={handleSetPage}
            onViewDetails={(car) => setSelectedCarForDetails(car)}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            settings={settings}
          />
        )}

        {currentPage === 'fleet' && (
          <FleetView
            cars={cars}
            settings={settings}
            onViewDetails={(car) => setSelectedCarForDetails(car)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesView
            cars={cars}
            settings={settings}
            onViewDetails={(car) => setSelectedCarForDetails(car)}
          />
        )}
      </main>

      {/* Footer with CMS Trigger */}
      <Footer
        setCurrentPage={handleSetPage}
        settings={settings}
        onOpenCms={() => handleSetPage('admin')}
      />

      {/* Car Details Modal Popup */}
      <CarDetailsModal
        car={selectedCarForDetails}
        onClose={() => setSelectedCarForDetails(null)}
        settings={settings}
      />

      {/* Floating WhatsApp Quick Action Button (Rental-ku Red Palette with subtle pulse) */}
      <aside aria-label="WhatsApp Hotline Chat" className="fixed bottom-6 right-6 z-40">
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Halo Rental-ku Indonesia, saya ingin berkonsultasi sewa rental mobil.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#E11D2A] hover:bg-[#c41521] text-white px-4 py-3 rounded-full animate-pulse-subtle hover:scale-105 active:scale-95 transition-transform duration-200 group border border-white/20"
          title="Chat WhatsApp 24 Jam"
        >
          <WhatsAppIcon className="w-5 h-5 fill-white text-white" />
          <span className="text-xs font-bold tracking-tight hidden sm:inline-block">
            Chat CS 24 Jam
          </span>
        </a>
      </aside>

    </div>
  );
}
