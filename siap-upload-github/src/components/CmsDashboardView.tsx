import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  Car as CarIcon, 
  Phone, 
  MapPin, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Upload,
  ArrowLeft,
  Search,
  Check,
  Power,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Info,
  X,
  Key,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Car, SiteSettings, PageId } from '../types';

interface CmsDashboardViewProps {
  cars: Car[];
  settings: SiteSettings;
  onSaveCar: (car: Car, isNew: boolean) => Promise<void>;
  onDeleteCar: (id: string) => Promise<void>;
  onSaveSettings: (settings: SiteSettings) => Promise<void>;
  onResetAll: () => Promise<void>;
  setCurrentPage: (page: PageId) => void;
}

export const CmsDashboardView: React.FC<CmsDashboardViewProps> = ({
  cars,
  settings,
  onSaveCar,
  onDeleteCar,
  onSaveSettings,
  onResetAll,
  setCurrentPage,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rentalku_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs: 'cars' | 'hero-banner' | 'contact' | 'maps' | 'security'
  const [activeTab, setActiveTab] = useState<'cars' | 'hero-banner' | 'contact' | 'maps' | 'security'>('cars');

  // Change Credentials State
  const [newAdminUser, setNewAdminUser] = useState(settings.adminUsername || 'admin123');
  const [newAdminPass, setNewAdminPass] = useState(settings.adminPassword || 'admin123');
  const [confirmAdminPass, setConfirmAdminPass] = useState(settings.adminPassword || 'admin123');
  
  // Fleet search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'booked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Car Form (Modal / Inline Form)
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isNewCar, setIsNewCar] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);

  // Settings State Form
  const [formSettings, setFormSettings] = useState<SiteSettings>({ ...settings });

  // Loading & Notifications
  const [isSaving, setIsSaving] = useState(false);
  const [togglingCarId, setTogglingCarId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync settings prop when changed
  React.useEffect(() => {
    setFormSettings({ ...settings });
  }, [settings]);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = settings.adminUsername || 'admin123';
    const validPassword = settings.adminPassword || 'admin123';

    if (username.trim() === validUsername && password.trim() === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rentalku_admin_auth', 'true');
      setLoginError('');
      showNotify('Selamat datang! Login Administrator berhasil.');
    } else {
      setLoginError('Username atau password tidak sesuai!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rentalku_admin_auth');
    setUsername('');
    setPassword('');
    showNotify('Anda telah keluar dari dashboard CMS.');
  };

  // ONE-CLICK AVAILABILITY TOGGLE
  const handleToggleAvailability = async (car: Car) => {
    const newStatus: 'available' | 'booked' = car.status === 'available' ? 'booked' : 'available';
    const updatedCar: Car = {
      ...car,
      status: newStatus,
    };

    setTogglingCarId(car.id);
    try {
      await onSaveCar(updatedCar, false);
      showNotify(
        `Status ${car.name} berhasil diubah menjadi: ${newStatus === 'available' ? 'Tersedia (Siap Sewa)' : 'Sedang Disewa (Booked)'}`,
        'success'
      );
    } catch (err) {
      showNotify(`Gagal mengubah status unit ${car.name}.`, 'error');
    } finally {
      setTogglingCarId(null);
    }
  };

  const handleOpenAddCar = () => {
    setEditingCar({
      id: '',
      name: '',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      category: 'MPV',
      price12h: 'Rp 350.000 - Rp 500.000',
      priceDaily: 'Rp 500.000 - Rp 750.000',
      priceMonthly: 'Rp 8.000.000',
      seats: 7,
      transmission: 'Matic & Manual',
      luggage: '',
      status: 'available',
      featured: true,
      notes: 'Unit terawat, wangi dan bersih siap jalan.',
    });
    setIsNewCar(true);
    setShowCarForm(true);
  };

  const handleOpenEditCar = (car: Car) => {
    setEditingCar({ ...car });
    setIsNewCar(false);
    setShowCarForm(true);
  };

  const handleSaveCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !editingCar.name.trim()) {
      showNotify('Nama mobil wajib diisi!', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await onSaveCar(editingCar, isNewCar);
      setShowCarForm(false);
      setEditingCar(null);
      showNotify('Data mobil berhasil disimpan secara permanen!');
    } catch (err) {
      showNotify('Gagal menyimpan data mobil ke server.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCarClick = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus unit "${name}" dari daftar armada?`)) {
      setIsSaving(true);
      try {
        await onDeleteCar(id);
        showNotify(`Unit "${name}" berhasil dihapus.`);
      } catch (err) {
        showNotify('Gagal menghapus mobil.', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formSettings);
      showNotify('Semua pengaturan berhasil disimpan secara permanen!');
    } catch (err) {
      showNotify('Gagal menyimpan pengaturan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetClick = async () => {
    const confirmText = prompt('Ketik "RESET" untuk mengembalikan semua armada dan pengaturan ke data awal bawaan:');
    if (confirmText === 'RESET') {
      setIsSaving(true);
      try {
        await onResetAll();
        showNotify('Semua data berhasil dikembalikan ke setelan awal pabrik.');
      } catch (err) {
        showNotify('Gagal melakukan reset data.', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || car.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || car.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchStatus && matchCategory;
    });
  }, [cars, searchQuery, statusFilter, categoryFilter]);

  // Metrics
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.status === 'available').length;
  const bookedCars = cars.filter((c) => c.status === 'booked').length;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(cars.map((c) => c.category));
    return ['all', ...Array.from(set)];
  }, [cars]);

  // LOGIN SCREEN (FULL PAGE)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between text-slate-100 font-inter p-4 sm:p-6 lg:p-10">
        
        {/* Top bar */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src="/logo/logo-footer.svg"
              alt="Kerabat Rentcar Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 pl-2 border-l border-slate-700">
              Dashboard Administrator
            </span>
          </div>

          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#E11D2A] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Login Portal Admin</h2>
            <p className="text-xs text-slate-400">
              Kelola ketersediaan armada mobil, banner, dan pengaturan kontak Kerabat Rentcar Jambi.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username Administrator
              </label>
              <input
                type="text"
                name="admin_user_portal"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E11D2A] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="admin_pass_portal"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E11D2A] focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Masuk ke Dashboard
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 text-center">
            {settings.adminUsername && settings.adminUsername !== 'admin123' ? (
              <span>Sistem dilindungi Kredensial Kustom Administrator</span>
            ) : (
              <span>Kredensial Bawaan: Username <strong className="text-slate-200">admin123</strong> | Password <strong className="text-slate-200">admin123</strong></span>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-xs text-slate-600 py-4">
          © 2026 {settings.companyName}. Hak Cipta Terlindungi.
        </div>
      </div>
    );
  }

  // AUTHENTICATED: FULL DASHBOARD PAGE
  return (
    <div className="min-h-screen w-full bg-[#0E1015] text-slate-100 font-inter flex flex-col">
      
      {/* 1. TOPBAR HEADER */}
      <header className="sticky top-0 z-30 bg-[#141720]/95 backdrop-blur-md border-b border-slate-800/90 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
              title="Klik untuk ke Beranda"
            >
              <img
                src="/logo/logo-footer.svg"
                alt="Kerabat Rentcar Logo"
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 pl-2 border-l border-slate-700">
                CMS Administrator
              </span>
            </button>

            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Sistem Aktif (Port 3000)
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="cms-view-website-btn"
              onClick={() => setCurrentPage('home')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E11D2A]" />
              <span className="hidden sm:inline">Lihat Website</span>
              <span className="sm:hidden">Web</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              title="Keluar dari sesi CMS"
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce-short">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
            notification.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/95 border-red-500/40 text-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#151923] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Total Armada</span>
              <CarIcon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {totalCars} <span className="text-xs font-normal text-slate-400">Unit</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Terdaftar di katalog publik
            </div>
          </div>

          <div className="bg-[#151923] border border-emerald-900/30 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-xs font-medium text-emerald-400 flex items-center justify-between">
              <span>Unit Tersedia</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {availableCars} <span className="text-xs font-normal text-emerald-600">Unit</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600">
              Siap disewa langsung
            </div>
          </div>

          <div className="bg-[#151923] border border-amber-900/30 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-xs font-medium text-amber-400 flex items-center justify-between">
              <span>Sedang Disewa</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400">
              {bookedCars} <span className="text-xs font-normal text-amber-600">Unit</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-600">
              Booked / dalam perjalanan
            </div>
          </div>

          <div className="bg-[#151923] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Hotline WhatsApp</span>
              <Phone className="w-4 h-4 text-[#E11D2A]" />
            </div>
            <div className="mt-2 text-lg sm:text-xl font-bold text-white truncate">
              {settings.phone}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Target klik tombol sewa
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab('cars'); setShowCarForm(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'cars'
                  ? 'bg-[#E11D2A] text-white shadow-lg shadow-red-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CarIcon className="w-4 h-4" />
              <span>Kelola Armada & Ketersediaan</span>
            </button>

            <button
              onClick={() => { setActiveTab('hero-banner'); setShowCarForm(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'hero-banner'
                  ? 'bg-[#E11D2A] text-white shadow-lg shadow-red-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Foto Hero & Banner</span>
            </button>

            <button
              onClick={() => { setActiveTab('contact'); setShowCarForm(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#E11D2A] text-white shadow-lg shadow-red-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Kontak & WhatsApp</span>
            </button>

            <button
              onClick={() => { setActiveTab('maps'); setShowCarForm(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'maps'
                  ? 'bg-[#E11D2A] text-white shadow-lg shadow-red-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps & Alamat</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setShowCarForm(false); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#E11D2A] text-white shadow-lg shadow-red-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ganti Akun & Password</span>
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetClick}
            disabled={isSaving}
            className="text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-800/50 px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ml-auto"
            title="Kembalikan semua data ke bawaan awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Awal</span>
          </button>

        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 w-full flex-1">
        
        {/* ========================================================================= */}
        {/* TAB 1: KELOLA ARMADA & KETERSEDIAAN UNIT (WITH INSTANT ONE-CLICK TOGGLE) */}
        {/* ========================================================================= */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            
            {/* Header info + Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Daftar Unit Mobil & Ketersediaan Harian</span>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    Toggle Cepat 1-Klik
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ubah status <strong>Tersedia</strong> atau <strong>Sedang Disewa</strong> langsung dengan menekan tombol switch switch di setiap baris mobil tanpa perlu membuka formulir edit.
                </p>
              </div>

              <button
                onClick={handleOpenAddCar}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Mobil Baru</span>
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semua ({totalCars})
                </button>
                <button
                  onClick={() => setStatusFilter('available')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'available'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <span>Tersedia ({availableCars})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('booked')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'booked'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <span>Sedang Disewa ({bookedCars})</span>
                </button>
              </div>

              {/* Search Bar & Category Dropdown */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama mobil (Avanza, Hiace, Fortuner)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter kategori mobil"
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:ring-2 focus:ring-[#E11D2A] focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* FORM MODAL / OVERLAY FOR EDITING / ADDING CAR */}
            {showCarForm && editingCar && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#151923] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <CarIcon className="w-5 h-5 text-[#E11D2A]" />
                      <span>{isNewCar ? 'Tambah Unit Mobil Baru' : `Edit Data Unit: ${editingCar.name}`}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowCarForm(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCarSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nama Unit Mobil *
                        </label>
                        <input
                          type="text"
                          value={editingCar.name}
                          onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })}
                          placeholder="contoh: Toyota Innova Reborn 2024"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Kategori Armada *
                        </label>
                        <select
                          value={editingCar.category}
                          onChange={(e) => setEditingCar({ ...editingCar, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none cursor-pointer"
                        >
                          <option value="MPV">MPV (Keluarga Nyaman)</option>
                          <option value="SUV">SUV (Tangguh & Gagah)</option>
                          <option value="City Car">City Car (Lincah)</option>
                          <option value="Minibus">Minibus (Pariwisata/Rombongan)</option>
                          <option value="Premium">Premium VIP</option>
                        </select>
                      </div>
                    </div>

                    {/* 3 Price Tiers */}
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-[#E11D2A] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>3 Tingkatan Tarif Sewa (Muncul di Kartu & Modal Detail):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            12 Jam / Dalam Kota
                          </label>
                          <input
                            type="text"
                            value={editingCar.price12h}
                            onChange={(e) => setEditingCar({ ...editingCar, price12h: e.target.value })}
                            placeholder="Rp 350.000 - Rp 500.000"
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harian + Supir
                          </label>
                          <input
                            type="text"
                            value={editingCar.priceDaily}
                            onChange={(e) => setEditingCar({ ...editingCar, priceDaily: e.target.value })}
                            placeholder="Rp 500.000 - Rp 750.000"
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Bulanan (Monthly)
                          </label>
                          <input
                            type="text"
                            value={editingCar.priceMonthly}
                            onChange={(e) => setEditingCar({ ...editingCar, priceMonthly: e.target.value })}
                            placeholder="Rp 8.000.000"
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specs & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Kursi Penumpang
                        </label>
                        <input
                          type="number"
                          value={editingCar.seats}
                          onChange={(e) => setEditingCar({ ...editingCar, seats: parseInt(e.target.value) || 7 })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                          min={2}
                          max={60}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Transmisi
                        </label>
                        <input
                          type="text"
                          value={editingCar.transmission}
                          onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
                          placeholder="Matic & Manual"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Status Ketersediaan
                        </label>
                        <select
                          value={editingCar.status}
                          onChange={(e) => setEditingCar({ ...editingCar, status: e.target.value as 'available' | 'booked' })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none cursor-pointer"
                        >
                          <option value="available">Tersedia (Siap Sewa)</option>
                          <option value="booked">Sedang Disewa (Booked)</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL with file upload option */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL Foto Mobil atau Upload File
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editingCar.image}
                          onChange={(e) => setEditingCar({ ...editingCar, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                          required
                        />
                        <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditingCar({ ...editingCar, image: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Catatan & Keunggulan Khusus
                      </label>
                      <textarea
                        value={editingCar.notes || ''}
                        onChange={(e) => setEditingCar({ ...editingCar, notes: e.target.value })}
                        rows={2}
                        placeholder="Mobil baru, kabin luas, ac double blower, terawat siap luar kota..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowCarForm(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white text-xs font-bold shadow-md cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Data Mobil</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* FLEET LIST CARDS / ROWS WITH INTERACTIVE INSTANT TOGGLE */}
            <div className="grid grid-cols-1 gap-3.5">
              {filteredCars.length === 0 ? (
                <div className="bg-[#141822] border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                  <CarIcon className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-300">Tidak ada mobil yang cocok dengan filter</div>
                  <p className="text-xs text-slate-500">
                    Coba ganti kata kunci pencarian atau pilih filter status 'Semua'.
                  </p>
                </div>
              ) : (
                filteredCars.map((car) => {
                  const isAvailable = car.status === 'available';
                  const isToggling = togglingCarId === car.id;

                  return (
                    <div
                      key={car.id}
                      className="bg-[#141822] rounded-2xl p-4 sm:p-5 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm"
                    >
                      {/* Left: Car Info & Thumbnail */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-24 h-16 sm:w-28 sm:h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shrink-0 relative flex items-center justify-center p-1">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                          {/* Small status dot badge */}
                          <div className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full border border-black/50 ${
                            isAvailable ? 'bg-emerald-500 shadow-xs shadow-emerald-500' : 'bg-amber-500 shadow-xs shadow-amber-500'
                          }`} />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-white truncate">
                              {car.name}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {car.category}
                            </span>
                            {car.featured && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-800">
                                Populer
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>12 Jam: <strong className="text-slate-200">{car.price12h}</strong></span>
                            <span>•</span>
                            <span>Harian: <strong className="text-slate-200">{car.priceDaily}</strong></span>
                            <span>•</span>
                            <span>{car.seats} Kursi</span>
                          </div>

                          {car.notes && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                              "{car.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: INSTANT AVAILABILITY TOGGLE & ACTION BUTTONS */}
                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0">
                        
                        {/* ========================================================================= */}
                        {/* THE FAST AVAILABILITY SWITCH / TOGGLE (1-KLIK GANTI STATUS) */}
                        {/* ========================================================================= */}
                        <div className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all ${
                          isAvailable 
                            ? 'bg-emerald-950/40 border-emerald-800/50' 
                            : 'bg-amber-950/40 border-amber-800/50'
                        }`}>
                          <div className="text-right">
                            <div className={`text-xs font-bold leading-tight ${
                              isAvailable ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {isAvailable ? 'Tersedia' : 'Sedang Disewa'}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight">
                              {isAvailable ? 'Siap jalan' : 'Unit booked'}
                            </div>
                          </div>

                          {/* Switch Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(car)}
                            disabled={isToggling}
                            title={`Klik untuk ubah status menjadi ${isAvailable ? 'Sedang Disewa' : 'Tersedia'}`}
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E11D2A] ${
                              isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
                            } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isAvailable ? 'translate-x-7' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCar(car)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                            title="Edit data lengkap mobil"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCarClick(car.id, car.name)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors cursor-pointer"
                            title="Hapus unit mobil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FOTO BACKGROUND HERO & BANNER PENUTUP */}
        {/* ========================================================================= */}
        {activeTab === 'hero-banner' && (
          <form onSubmit={handleSaveSettingsSubmit} className="space-y-8 bg-[#141822] p-6 sm:p-8 rounded-3xl border border-slate-800">
            
            {/* HERO BACKGROUND SECTION */}
            <div className="space-y-4 border-b border-slate-800 pb-8">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Foto Background Hero Section (Halaman Beranda)</span>
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-semibold">
                    Gradasi Otomatis (15% Kiri ➔ 100% Kanan)
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Foto ini akan tampil sebagai latar belakang penuh di bagian paling atas Beranda dengan efek gradasi transparan di sisi kanan dan lapisan gelap di sisi kiri agar teks terbaca sangat tajam.
                </p>
              </div>

              {/* Guidelines Box */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E11D2A]" />
                  <span>Panduan Dimensi, Komposisi & Format Foto yang Harus Dikirim/Diunggah:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-300 pt-1">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-0.5">1. Rasio & Dimensi</strong>
                    Landscape <strong>16:9</strong> atau <strong>21:9</strong>.<br />
                    Rekomendasi resolusi: <strong>1920 × 1080 px</strong> (Full HD) atau <strong>2560 × 1440 px</strong>.
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-0.5">2. Komposisi Objek</strong>
                    Objek utama (mobil/orang) wajib berada di <strong>sisi KANAN atau KANAN-TENGAH</strong>, karena sisi kiri diisi teks & tombol.
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-0.5">3. Format & Ukuran File</strong>
                    Format <strong>.webp</strong> (sangat disarankan) atau <strong>.jpg / .jpeg</strong> kualitas 85%. Ukuran file ideal &lt; 1–2 MB.
                  </div>
                </div>
              </div>

              {/* URL Input & Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Gambar Foto Hero atau Upload File dari Komputer/HP
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formSettings.heroImage || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau gunakan tombol Upload Foto"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-[#E11D2A]" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormSettings({ ...formSettings, heroImage: reader.result as string });
                            showNotify('Foto berhasil dimuat ke pratinjau! Klik Simpan untuk memperbarui website.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* LIVE PREVIEW OF GRADIENT */}
                {formSettings.heroImage && (
                  <div className="space-y-1.5 pt-2">
                    <span className="block text-xs font-bold text-slate-400">
                      Live Preview Tampilan Hero dengan Gradasi (Kiri 15% Opacity ➔ Kanan 100% Opacity):
                    </span>
                    <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden bg-[#121316] border border-slate-700">
                      <img
                        src={formSettings.heroImage}
                        alt="Preview Hero Background"
                        className="w-full h-full object-cover object-[80%_center]"
                      />
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0" 
                        style={{
                          background: 'linear-gradient(to right, #121316 0%, rgba(18, 19, 22, 0.85) 45%, rgba(18, 19, 22, 0.35) 62%, transparent 75%, transparent 100%)'
                        }}
                      />
                      <div className="absolute inset-y-0 left-6 flex flex-col justify-center max-w-sm pointer-events-none space-y-1">
                        <span className="text-white text-lg sm:text-xl font-bold leading-tight">
                          Sewa Rental Mobil di Jambi? <br />
                          <span className="text-white">Ya Di Kerabat Rentcar Aja!</span>
                        </span>
                        <span className="text-white/80 text-xs">
                          Nikmati Perjalananmu di Kota Jambi Bersama Kerabat Rentcar
                        </span>
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-white text-slate-900 border-2 border-[#E11D2A] text-[10px] font-bold">
                            Hubungi Kami: {formSettings.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FLEET HERO BACKGROUND SECTION (Halaman Daftar Mobil & Harga Sewa) */}
            <div className="space-y-4 border-b border-slate-800 pb-8">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Foto Background Hero (Halaman Daftar Mobil & Harga Sewa)</span>
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-semibold">
                    Halaman Fleet
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Foto ini akan tampil sebagai latar belakang penuh di bagian paling atas halaman <strong>Daftar Mobil & Harga Sewa</strong> dengan gradasi gelap elegan di sisi teks.
                </p>
              </div>

              {/* URL Input & Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Gambar Foto Hero Armada atau Upload File dari Komputer/HP
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formSettings.fleetHeroImage || ''}
                    onChange={(e) => setFormSettings({ ...formSettings, fleetHeroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau gunakan tombol Upload Foto"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-[#E11D2A]" />
                    <span>Upload Foto Armada</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormSettings({ ...formSettings, fleetHeroImage: reader.result as string });
                            showNotify('Foto Hero Armada berhasil dimuat ke pratinjau! Klik Simpan untuk menerapkan.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Pratinjau Fleet Hero */}
                {formSettings.fleetHeroImage && (
                  <div className="mt-3">
                    <span className="block text-xs font-bold text-slate-400 mb-1.5">
                      Pratinjau Live Hero Halaman Daftar Mobil & Harga Sewa:
                    </span>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 h-44 sm:h-52 bg-slate-950 shadow-inner">
                      <img
                        src={formSettings.fleetHeroImage}
                        alt="Preview Fleet Hero"
                        className="w-full h-full object-cover object-[75%_center]"
                      />
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0" 
                        style={{
                          background: 'linear-gradient(to right, #121316 0%, rgba(18, 19, 22, 0.85) 45%, rgba(18, 19, 22, 0.35) 62%, transparent 75%, transparent 100%)'
                        }}
                      />
                      <div className="absolute inset-y-0 left-6 flex flex-col justify-center max-w-sm pointer-events-none space-y-1">
                        <span className="text-white text-lg sm:text-xl font-bold leading-tight">
                          Sewa Rental Mobil di Jambi? <br />
                          <span className="text-white">Ya Di Kerabat Rentcar Aja!</span>
                        </span>
                        <span className="text-white/80 text-xs">
                          Berbagai Pilihan Armada Mobil Prima Untuk Kebutuhan Perjalananmu di Jambi
                        </span>
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-white text-slate-900 border-2 border-[#E11D2A] text-[10px] font-bold">
                            Hubungi Kami: {formSettings.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BANNER PENUTUP CTA */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Pengaturan Banner Penutup Halaman (CTA)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Banner ini tampil di bagian bawah setiap halaman (Beranda, Layanan, Armada, Tentang Kami) tepat sebelum footer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Judul Ajakan Banner CTA
                  </label>
                  <input
                    type="text"
                    value={formSettings.bannerCtaTitle}
                    onChange={(e) => setFormSettings({ ...formSettings, bannerCtaTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teks Tombol Kontak Banner
                  </label>
                  <input
                    type="text"
                    value={formSettings.bannerCtaButton}
                    onChange={(e) => setFormSettings({ ...formSettings, bannerCtaButton: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gambar Mobil / Visual Banner Penutup (Default: /banner-penutup.webp)
                  </label>
                  <input
                    type="text"
                    value={formSettings.bannerPenutupImage || '/banner-penutup.webp'}
                    onChange={(e) => setFormSettings({ ...formSettings, bannerPenutupImage: e.target.value })}
                    placeholder="/banner-penutup.webp"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-white p-3 max-w-sm">
                    <img
                      src={formSettings.bannerPenutupImage || '/banner-penutup.webp'}
                      alt="Preview Visual Mobil Banner Penutup"
                      className="w-full h-auto object-contain max-h-36"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Hero & Banner</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KONTAK & WHATSAPP */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 bg-[#141822] p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                Pengaturan Nomor Kontak & WhatsApp Otomatis
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Atur nomor WhatsApp pemesanan dan teks template pesan otomatis ketika customer menekan tombol sewa pada unit mobil.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Pemesanan (Wajib Awalan 62) *
                </label>
                <input
                  type="text"
                  value={formSettings.whatsapp}
                  onChange={(e) => setFormSettings({ ...formSettings, whatsapp: e.target.value })}
                  placeholder="contoh: 62818883053"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Format angka saja tanpa tanda plus atau strip (misal: 62818883053).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor Hotline Tampilan *
                </label>
                <input
                  type="text"
                  value={formSettings.phone}
                  onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                  placeholder="contoh: 0818883053"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tampil di tombol navigasi dan hero: 'Hubungi Kami: {formSettings.phone}'.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Template Pesan WhatsApp Otomatis
              </label>
              <textarea
                rows={3}
                value={formSettings.waMessageTemplate}
                onChange={(e) => setFormSettings({ ...formSettings, waMessageTemplate: e.target.value })}
                placeholder="Halo Kerabat Rentcar Jambi, saya ingin menyewa mobil {mobil}. Mohon info ketersediaannya..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gunakan tag <strong className="text-white">{'{mobil}'}</strong> agar otomatis diganti dengan nama mobil yang dipilih customer.
              </span>
            </div>

            {/* Social Media */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">Tautan Media Sosial:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formSettings.instagram}
                    onChange={(e) => setFormSettings({ ...formSettings, instagram: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={formSettings.tiktok}
                    onChange={(e) => setFormSettings({ ...formSettings, tiktok: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formSettings.facebook}
                    onChange={(e) => setFormSettings({ ...formSettings, facebook: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Kontak</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GOOGLE MAPS & PROFIL KANTOR */}
        {/* ========================================================================= */}
        {activeTab === 'maps' && (
          <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 bg-[#141822] p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                Pengaturan Google Maps & Profil Kantor
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Peta interaktif ini dirender langsung pada halaman 'Tentang Kami' dan footer website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Embed Iframe Google Maps (src="...") *
              </label>
              <textarea
                rows={3}
                value={formSettings.googleMapsEmbed}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = val.match(/src=["']([^"']+)["']/i);
                  setFormSettings({ ...formSettings, googleMapsEmbed: match ? match[1] : val });
                }}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Bisa langsung paste seluruh kode <strong>&lt;iframe src="..."&gt;&lt;/iframe&gt;</strong> atau hanya URL-nya (sistem otomatis membersihkan formatnya).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alamat Fisik Kantor / Pool Unit
                </label>
                <input
                  type="text"
                  value={formSettings.address}
                  onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Jam Operasional
                </label>
                <input
                  type="text"
                  value={formSettings.hours}
                  onChange={(e) => setFormSettings({ ...formSettings, hours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Legalitas Perusahaan (PT)
              </label>
              <input
                type="text"
                value={formSettings.companyName}
                onChange={(e) => setFormSettings({ ...formSettings, companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-[#E11D2A] focus:outline-none"
                required
              />
            </div>

            {/* Live preview map */}
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-2">
                Live Preview Peta Google Maps:
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-700 h-56 bg-slate-900">
                <iframe
                  title="Preview Maps Admin"
                  src={(() => {
                    const match = formSettings.googleMapsEmbed.match(/src=["']([^"']+)["']/i);
                    return match ? match[1] : formSettings.googleMapsEmbed;
                  })()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E11D2A] hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Peta & Alamat</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: GANTI AKUN & PASSWORD ADMIN */}
        {activeTab === 'security' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newAdminUser.trim() || !newAdminPass.trim()) {
                showNotify('Username dan Password tidak boleh kosong!', 'error');
                return;
              }
              if (newAdminPass !== confirmAdminPass) {
                showNotify('Konfirmasi password baru tidak cocok!', 'error');
                return;
              }
              setIsSaving(true);
              try {
                const updatedSettings: SiteSettings = {
                  ...settings,
                  adminUsername: newAdminUser.trim(),
                  adminPassword: newAdminPass.trim(),
                };
                await onSaveSettings(updatedSettings);
                showNotify('Kredensial Admin berhasil diperbarui! Simpan baik-baik data login baru Anda.');
              } catch (err: any) {
                showNotify('Gagal menyimpan kredensial: ' + err.message, 'error');
              } finally {
                setIsSaving(false);
              }
            }}
            className="bg-[#151923] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Keamanan & Kredensial Administrator</h3>
                <p className="text-xs text-slate-400">Ubah Username dan Password untuk login ke panel CMS ini agar aman dari orang lain.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Status */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  Status Kredensial Saat Ini
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Username:</span>
                    <span className="font-mono font-bold text-slate-200">{settings.adminUsername || 'admin123'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-mono text-slate-400">•••••••• (Tersimpan aman di Supabase)</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                  Perubahan tersimpan langsung ke Cloud Supabase dan aktif di semua browser/device.
                </div>
              </div>

              {/* Form Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Username Admin Baru
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      placeholder="Contoh: bosrental / admin_rentalku"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E11D2A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Password Admin Baru
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E11D2A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ulangi Password Baru
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={confirmAdminPass}
                      onChange={(e) => setConfirmAdminPass(e.target.value)}
                      placeholder="Ulangi password baru persis sama"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E11D2A]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Username & Password Baru</span>
              </button>
            </div>
          </form>
        )}

      </main>

      {/* FOOTER BAR OF CMS */}
      <footer className="border-t border-slate-800/80 bg-[#12151D] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Kerabat Rentcar Dashboard • Pengelolaan Armada & Sistem Rental Mobil Jambi</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Lihat Tampilan Web
            </button>
            <span>•</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              Kunci & Logout
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
