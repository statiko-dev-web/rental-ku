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
import { supabase } from './supabase';

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

  // Fetch initial data from Supabase Cloud with fallback
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('site_data')
          .select('id, content');

        if (!error && data && data.length > 0) {
          const carsRow = data.find((row: any) => row.id === 'cars');
          const settingsRow = data.find((row: any) => row.id === 'settings');

          if (carsRow && Array.isArray(carsRow.content) && carsRow.content.length > 0) {
            setCars(carsRow.content);
          }
          if (settingsRow && settingsRow.content && settingsRow.content.phone) {
            setSettings(settingsRow.content);
          }
        } else {
          // If first time, try fallback
          const [carsRes, settingsRes] = await Promise.all([
            fetch('/api/cars').catch(() => null),
            fetch('/api/settings').catch(() => null)
          ]);
          if (carsRes && carsRes.ok) {
            const carsData = await carsRes.json();
            if (Array.isArray(carsData) && carsData.length > 0) setCars(carsData);
          }
          if (settingsRes && settingsRes.ok) {
            const settingsData = await settingsRes.json();
            if (settingsData && settingsData.phone) setSettings(settingsData);
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

  // Helper to persist to Supabase
  const syncToSupabase = async (newCars: Car[], newSettings?: SiteSettings) => {
    try {
      if (newCars) {
        await supabase.from('site_data').upsert({ id: 'cars', content: newCars });
      }
      if (newSettings) {
        await supabase.from('site_data').upsert({ id: 'settings', content: newSettings });
      }
    } catch (e) {
      console.error('Supabase sync error:', e);
    }
  };

  // CRUD Handlers connected to Supabase
  const handleSaveCar = async (carToSave: Car, isNew: boolean) => {
    let nextCars: Car[];
    if (isNew) {
      nextCars = [carToSave, ...cars];
    } else {
      nextCars = cars.map((c) => (c.id === carToSave.id ? carToSave : c));
    }
    setCars(nextCars);
    await syncToSupabase(nextCars);

    fetch('/api/cars', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carToSave),
    }).catch(() => {});
  };

  const handleDeleteCar = async (id: string) => {
    const nextCars = cars.filter((c) => c.id !== id);
    setCars(nextCars);
    await syncToSupabase(nextCars);

    fetch(`/api/cars/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await syncToSupabase(cars, newSettings);

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    }).catch(() => {});
  };

  const handleResetAll = async () => {
    setCars(DEFAULT_CARS);
    setSettings(DEFAULT_SETTINGS);
    await syncToSupabase(DEFAULT_CARS, DEFAULT_SETTINGS);

    fetch('/api/reset', { method: 'POST' }).catch(() => {});
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
