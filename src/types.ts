export type Availability = 'pronta_entrega' | 'sob_consulta' | 'sob_encomenda';

export type CategoryId =
  | 'moda_feminina'
  | 'moda_masculina'
  | 'moda_infantil'
  | 'calcados'
  | 'acessorios';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  categoryIds: CategoryId[];
  coverImage: string;
  logoImage: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  phone: string;
  deliveryTime: string;
  deliveryFee: number;
  featured: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: CategoryId;
  sizes: string[];
  colors: { name: string; hex: string }[];
  availability: Availability;
  rating: number;
  reviewCount: number;
  createdAt: number;
}

export interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  availability: Availability;
}

export type OrderStatus =
  | 'aguardando_confirmacao'
  | 'confirmado'
  | 'preparando'
  | 'a_caminho'
  | 'entregue'
  | 'recusado'
  | 'cancelado';

export type FulfillmentType = 'entrega' | 'retirada';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  availability: Availability;
}

export interface Order {
  id: string;
  code: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: FulfillmentType;
  address?: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}

export interface DeliveryInfo {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  address: string;
  status: 'pendente' | 'em_rota' | 'entregue';
  driver?: string;
  createdAt: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: number;
}

export type Route =
  | { name: 'home' }
  | { name: 'search' }
  | { name: 'cart' }
  | { name: 'orders' }
  | { name: 'category'; categoryId: CategoryId }
  | { name: 'product'; productId: string }
  | { name: 'store'; storeId: string };
