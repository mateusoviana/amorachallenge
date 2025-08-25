export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: 'buyer' | 'realtor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  condominiumFee: number;
  iptu: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  isPublic: boolean;
  ownerId: string;
  owner: User;
  groups: Group[];
  images: string[];
  sourceType: 'manual' | 'link';
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
  apartments: Apartment[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  user: User;
  group: Group;
  createdAt: Date;
}

export interface FilterOptions {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  parkingSpaces: number[];
  areaRange: [number, number];
  city: string[];
  neighborhood: string[];
  groups: string[];
  visibility: string[]; // 'public' | 'private'
  sortBy?: 'price' | 'condominiumFee' | 'area' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Novos tipos para dashboard
export interface DashboardStats {
  totalApartments: number;
  apartmentsByNeighborhood: NeighborhoodStats[];
  averagePriceByNeighborhood: NeighborhoodPriceStats[];
  apartmentsByPriceRange: PriceRangeStats[];
  monthlyGrowth: MonthlyGrowthStats[];
}

export interface NeighborhoodStats {
  neighborhood: string;
  count: number;
  percentage: number;
}

export interface NeighborhoodPriceStats {
  neighborhood: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface PriceRangeStats {
  range: string;
  count: number;
  percentage: number;
}

export interface MonthlyGrowthStats {
  month: string;
  newApartments: number;
  totalApartments: number;
}

// Sistema de reações
export type ReactionType = 'love' | 'like' | 'unsure' | 'dislike' | 'hate';

export interface ApartmentReaction {
  id: string;
  apartmentId: string;
  groupId: string;
  userId: string;
  reaction: ReactionType;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReactionSummary {
  love: number;
  like: number;
  unsure: number;
  dislike: number;
  hate: number;
  total: number;
}

// Sistema de comentários
export interface ApartmentComment {
  id: string;
  apartmentId: string;
  groupId: string;
  userId: string;
  comment: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// Sistema de alertas aMORA Avisa
export interface AlertCriteria {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  parkingSpaces?: number[];
  cities?: string[];
  neighborhoods?: string[];
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertMatch {
  id: string;
  alertId: string;
  apartmentId: string;
  matchScore: number;
  notificationSent: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
  createdAt: Date;
}

export type NotificationChannel = 'email' | 'whatsapp';

export interface NotificationTemplate {
  subject: string;
  body: string;
  channel: NotificationChannel;
}

// Sistema de pontuação por reações
export interface ApartmentScore {
  apartmentId: string;
  totalScore: number;
  negativeCount: number;
  reactionCount: number;
}
