export interface Car {
  id: string;
  name: string;
  image: string;
  category: string;
  price12h: string;
  priceDaily: string;
  priceMonthly: string;
  seats: number;
  transmission: string;
  luggage: string;
  status: 'available' | 'booked';
  featured?: boolean;
  notes?: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  waMessageTemplate: string;
  companyName: string;
  brandName: string;
  address: string;
  hours: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  googleMapsEmbed: string;
  bannerCtaTitle: string;
  bannerCtaButton: string;
  heroImage?: string;
  fleetHeroImage?: string;
  bannerPenutupImage?: string;
  adminUsername?: string;
  adminPassword?: string;
}

export type PageId = 'home' | 'about' | 'fleet' | 'services' | 'admin';
