export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  modifiers?: ModifierGroup[];
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string; // e.g. "30-45 min"
  deliveryFee: number;
  cuisine: string[];
  tags: string[]; // New: For dietary filters like "Halal", "Veg"
  location: string; // e.g., "Westlands"
  image: string;
  menu: MenuItem[];
  isOpen: boolean;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  selectedModifiers: { [groupId: string]: ModifierOption };
  specialInstructions?: string;
  totalPrice: number;
  image?: string;
}

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home"
  street: string; // e.g. "Muthithi Road"
  landmark: string; // e.g. "Near Sarit Centre"
  details: string; // e.g. "Gate 4, Apt 2B"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: UserAddress[];
  joinedDate: string;
}

export type PaymentMethod = 'mpesa' | 'cash' | 'card';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'delivered';
  eta: string;
  courier?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface PastOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  itemSummary: string; // e.g. "2x Pilau, 1x Soda"
  total: number;
  status: 'Delivered' | 'Cancelled';
  rating?: number;
}