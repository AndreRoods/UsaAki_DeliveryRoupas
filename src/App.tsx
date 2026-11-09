import { StoreProvider, useStore } from './store';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import StorePage from './pages/StorePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';

function Router() {
  const { route } = useStore();

  let page: React.ReactNode;
  switch (route.name) {
    case 'home': page = <HomePage />; break;
    case 'search': page = <SearchPage />; break;
    case 'cart': page = <CartPage />; break;
    case 'orders': page = <OrdersPage />; break;
    case 'category': page = <CategoryPage categoryId={route.categoryId} />; break;
    case 'product': page = <ProductPage productId={route.productId} />; break;
    case 'store': page = <StorePage storeId={route.storeId} />; break;
    default: page = <HomePage />;
  }

  // Product page has its own sticky bottom bar; others use the shared BottomNav
  const hideBottomNav = route.name === 'product';

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <main className="flex-1">{page}</main>
      {!hideBottomNav && <div className="h-16" />}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}
