import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Route, Store, Product, Order, CartItem, Customer, DeliveryInfo } from './types';
import { SEED_STORES, SEED_PRODUCTS, SEED_ORDERS, SEED_CUSTOMERS, SEED_DELIVERIES } from './data';

const VERSION = 'usaaki-v1';

interface PersistedState {
  stores: Store[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  deliveries: DeliveryInfo[];
  cart: CartItem[];
  deliveryAddress: string;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(VERSION);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      return {
        stores: parsed.stores ?? SEED_STORES,
        products: parsed.products ?? SEED_PRODUCTS,
        orders: parsed.orders ?? SEED_ORDERS,
        customers: parsed.customers ?? SEED_CUSTOMERS,
        deliveries: parsed.deliveries ?? SEED_DELIVERIES,
        cart: parsed.cart ?? [],
        deliveryAddress: parsed.deliveryAddress ?? '',
      };
    }
  } catch {
    // fall through to defaults
  }
  return {
    stores: SEED_STORES,
    products: SEED_PRODUCTS,
    orders: SEED_ORDERS,
    customers: SEED_CUSTOMERS,
    deliveries: SEED_DELIVERIES,
    cart: [],
    deliveryAddress: '',
  };
}

interface StoreContextValue {
  route: Route;
  navigate: (route: Route) => void;
  stores: Store[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  deliveries: DeliveryInfo[];
  cart: CartItem[];
  deliveryAddress: string;
  setDeliveryAddress: (v: string) => void;
  addToCart: (item: CartItem) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  placeOrder: (order: Omit<Order, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function genCode() {
  return `UA-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [route, setRoute] = useState<Route>({ name: 'home' });

  useEffect(() => {
    const { stores, products, orders, customers, deliveries, cart, deliveryAddress } = state;
    localStorage.setItem(VERSION, JSON.stringify({ stores, products, orders, customers, deliveries, cart, deliveryAddress }));
  }, [state]);

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
    const cartSubtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return {
      route,
      navigate,
      stores: state.stores,
      products: state.products,
      orders: state.orders,
      customers: state.customers,
      deliveries: state.deliveries,
      cart: state.cart,
      deliveryAddress: state.deliveryAddress,
      setDeliveryAddress: (v) => setState((s) => ({ ...s, deliveryAddress: v })),
      addToCart: (item) =>
        setState((s) => {
          const existing = s.cart.find(
            (c) => c.productId === item.productId && c.size === item.size && c.color === item.color,
          );
          if (existing) {
            return {
              ...s,
              cart: s.cart.map((c) =>
                c.id === existing.id ? { ...c, quantity: c.quantity + item.quantity } : c,
              ),
            };
          }
          return { ...s, cart: [...s.cart, item] };
        }),
      updateCartQty: (id, qty) =>
        setState((s) => ({
          ...s,
          cart: s.cart.map((c) => (c.id === id ? { ...c, quantity: Math.max(1, qty) } : c)),
        })),
      removeFromCart: (id) =>
        setState((s) => ({ ...s, cart: s.cart.filter((c) => c.id !== id) })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      cartCount,
      cartSubtotal,
      placeOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: uid('order'),
          code: genCode(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setState((s) => ({
          ...s,
          orders: [newOrder, ...s.orders],
          deliveries:
            newOrder.fulfillment === 'entrega'
              ? [
                  {
                    id: uid('d'),
                    orderId: newOrder.id,
                    orderCode: newOrder.code,
                    customerName: newOrder.customerName,
                    address: newOrder.address ?? '',
                    status: 'pendente',
                    createdAt: Date.now(),
                  },
                  ...s.deliveries,
                ]
              : s.deliveries,
        }));
        return newOrder;
      },
      updateOrderStatus: (orderId, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o,
          ),
          deliveries: s.deliveries.map((d) => {
            const o = s.orders.find((x) => x.id === orderId);
            if (o && d.orderId === orderId) {
              if (status === 'a_caminho') return { ...d, status: 'em_rota' as const };
              if (status === 'entregue') return { ...d, status: 'entregue' as const };
            }
            return d;
          }),
        })),
      addProduct: (product) =>
        setState((s) => ({ ...s, products: [product, ...s.products] })),
      updateProduct: (product) =>
        setState((s) => ({
          ...s,
          products: s.products.map((p) => (p.id === product.id ? product : p)),
        })),
      deleteProduct: (id) =>
        setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) })),
      resetDemo: () => {
        localStorage.removeItem(VERSION);
        setState({
          stores: SEED_STORES,
          products: SEED_PRODUCTS,
          orders: SEED_ORDERS,
          customers: SEED_CUSTOMERS,
          deliveries: SEED_DELIVERIES,
          cart: [],
          deliveryAddress: '',
        });
      },
    };
  }, [state, route]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export { uid };
