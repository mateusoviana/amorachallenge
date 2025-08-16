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
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
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
