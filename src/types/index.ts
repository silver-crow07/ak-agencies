export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  fabrics?: string[];
  rating: number;
  reviewCount: number;
  badge?: 'NEW' | 'BESTSELLER' | 'SALE';
  inStock: boolean;
  features?: string[];
  careInstructions?: string[];
  material?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedFabric?: string;
}

export interface WishlistItem {
  product: Product;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  verified: boolean;
}

export interface CustomOrderFormData {
  productType: string;
  fabric: string;
  color: string;
  measurements: string;
  design: string;
  referenceImage: string | null;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
}
