import { useState } from 'react';
import { Search, MapPin, Sparkles, Shirt, Baby, Footprints, Watch, Flame, Clock, TrendingUp, Store as StoreIcon, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import type { CategoryId, Product } from '../types';
import { formatCurrency } from '../utils';
import { AvailabilityBadge } from '../components/Badges';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Shirt, Baby, Footprints, Watch,
};

type Tab = 'novidades' | 'pronta_entrega' | 'populares';

export default function HomePage() {
  const { products, stores, navigate, deliveryAddress, setDeliveryAddress } = useStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('novidades');

  const featuredStores = stores.filter((s) => s.featured).slice(0, 4);
  const popular = [...products].sort((a, b) => b.rating - a.rating);
  const novidades = [...products].sort((a, b) => b.createdAt - a.createdAt);
  const prontaEntrega = products.filter((p) => p.availability === 'pronta_entrega');

  const tabProducts = tab === 'novidades' ? novidades : tab === 'pronta_entrega' ? prontaEntrega : popular;

  return (
    <div className="animate-fade-in pb-4">
      {/* Header bar */}
      <div className="bg-wood-700 text-cream-50">
        <div className="container-app pt-4 pb-5">
          {/* Logo + city */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-50/15 text-cream-50">
                <Shirt className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                Usa<span className="text-cream-200">Aki</span>
              </span>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-cream-200 font-medium">
              <MapPin className="h-4 w-4" /> Socorro · SP
            </button>
          </div>

          {/* Search */}
          <button
            onClick={() => navigate({ name: 'search' })}
            className="w-full flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 text-left shadow-sm"
          >
            <Search className="h-5 w-5 text-wood-500" />
            <span className="text-sm text-ink-400">Buscar por vestido, camisa, tênis...</span>
          </button>

          {/* Address */}
          <div className="mt-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cream-300 shrink-0" />
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Informe seu endereço de entrega"
              className="flex-1 bg-transparent text-sm text-cream-100 placeholder:text-cream-300/70 border-b border-cream-50/20 focus:border-cream-200 focus:outline-none py-1.5"
            />
          </div>
        </div>
      </div>

      <div className="container-app -mt-3 space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Shirt;
            return (
              <button
                key={cat.id}
                onClick={() => navigate({ name: 'category', categoryId: cat.id as CategoryId })}
                className="flex flex-col items-center gap-1.5 group"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-wood-100 shadow-card text-wood-600 group-hover:bg-wood-600 group-hover:text-cream-50 group-hover:scale-105 transition-all">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[10px] font-semibold text-ink-500 text-center leading-tight">{cat.name.replace('Moda ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Tabs: Novidades / Pronta entrega / Populares */}
        <div>
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4">
            <TabPill active={tab === 'novidades'} onClick={() => setTab('novidades')} icon={<TrendingUp className="h-4 w-4" />}>Novidades</TabPill>
            <TabPill active={tab === 'pronta_entrega'} onClick={() => setTab('pronta_entrega')} icon={<Clock className="h-4 w-4" />}>Pronta entrega</TabPill>
            <TabPill active={tab === 'populares'} onClick={() => setTab('populares')} icon={<Flame className="h-4 w-4" />}>Populares</TabPill>
          </div>
          <ProductScrollRow products={tabProducts} />
        </div>

        {/* Encontre sua roupa */}
        <button
          onClick={() => navigate({ name: 'search' })}
          className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-wood-800 to-wood-600 p-5 text-left active:scale-[0.98] transition-transform"
        >
          <div className="absolute right-0 top-0 h-24 w-24 bg-cream-200/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-50/15 text-cream-100 shrink-0">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="font-display font-bold text-cream-50">Encontre sua roupa</h3>
              <p className="text-xs text-cream-200/80 mt-0.5">Busca por texto ou foto de referência</p>
            </div>
            <ChevronRight className="h-5 w-5 text-cream-200" />
          </div>
        </button>

        {/* Featured stores */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-extrabold text-ink-800 flex items-center gap-2">
              <StoreIcon className="h-5 w-5 text-wood-600" /> Lojas em destaque
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {featuredStores.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate({ name: 'store', storeId: s.id })}
                className="card shrink-0 w-56 overflow-hidden text-left hover:shadow-cardHover transition-all active:scale-[0.98]"
              >
                <div className="h-24 overflow-hidden bg-wood-50">
                  <img src={s.coverImage} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3 -mt-6 relative">
                  <div className="h-10 w-10 rounded-xl overflow-hidden ring-2 ring-white shadow-card bg-white">
                    <img src={s.logoImage} alt={s.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-sm text-ink-800 mt-2 truncate">{s.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.572-.955L10 0l2.938 5.955 6.572.955-4.755 4.635 1.123 6.545z" /></svg>
                    <span className="text-xs text-ink-500 font-medium">{s.rating.toFixed(1)}</span>
                    <span className="text-xs text-ink-300">· {s.deliveryTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPill({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`tab-pill flex items-center gap-1.5 ${
        active ? 'bg-wood-600 text-cream-50 shadow-pop' : 'bg-white text-ink-500 border border-wood-100'
      }`}
    >
      {icon} {children}
    </button>
  );
}

function ProductScrollRow({ products }: { products: Product[] }) {
  const { navigate, stores } = useStore();
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
      {products.map((p) => {
        const store = stores.find((s) => s.id === p.storeId);
        return (
          <button
            key={p.id}
            onClick={() => navigate({ name: 'product', productId: p.id })}
            className="card shrink-0 w-36 overflow-hidden text-left hover:shadow-cardHover transition-all active:scale-[0.98] group"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-wood-50">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-1.5 left-1.5">
                <AvailabilityBadge type={p.availability} size="xs" />
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] text-ink-400 truncate">{store?.name}</p>
              <h3 className="text-xs font-semibold text-ink-800 leading-snug line-clamp-2 mt-0.5">{p.name}</h3>
              <p className="font-display font-bold text-sm text-wood-700 mt-1">{formatCurrency(p.price)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
