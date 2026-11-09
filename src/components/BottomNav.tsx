import { Home, Search, ShoppingBag, ClipboardList } from 'lucide-react';
import { useStore } from '../store';
import type { Route } from '../types';

const TABS: { route: Route; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { route: { name: 'home' }, label: 'Início', icon: Home },
  { route: { name: 'search' }, label: 'Buscar', icon: Search },
  { route: { name: 'cart' }, label: 'Carrinho', icon: ShoppingBag },
  { route: { name: 'orders' }, label: 'Pedidos', icon: ClipboardList },
];

export default function BottomNav() {
  const { route, navigate, cartCount } = useStore();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-wood-100 shadow-tab pb-safe">
      <div className="mx-auto max-w-md flex items-center justify-around px-2 h-16">
        {TABS.map((tab) => {
          const active = route.name === tab.route.name ||
            (tab.route.name === 'home' && (route.name === 'category' || route.name === 'product' || route.name === 'store'));
          const Icon = tab.icon;
          const showBadge = tab.route.name === 'cart' && cartCount > 0;

          return (
            <button
              key={tab.route.name}
              onClick={() => navigate(tab.route)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
              aria-label={tab.label}
            >
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                active ? 'bg-wood-600 text-cream-50 scale-105' : 'text-ink-400'
              }`}>
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-wood-700' : 'text-ink-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
