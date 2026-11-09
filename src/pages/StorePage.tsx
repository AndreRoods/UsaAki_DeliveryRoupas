import { ChevronLeft, MapPin, Phone, Clock, Truck, Store as StoreIcon } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import ProductCard from '../components/ProductCard';
import { RatingBadge } from '../components/Badges';
import { EmptyState } from '../components/UI';

export default function StorePage({ storeId }: { storeId: string }) {
  const { stores, products, navigate } = useStore();
  const store = stores.find((s) => s.id === storeId);
  if (!store) return null;
  const storeProducts = products.filter((p) => p.storeId === storeId);

  return (
    <div className="animate-fade-in pb-4">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden bg-wood-200">
        <img src={store.coverImage} alt={store.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-900/60 to-transparent" />
        <button onClick={() => navigate({ name: 'home' })} className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-wood-700 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="container-app -mt-10 relative">
        <div className="flex items-end gap-3">
          <div className="h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-cream-50 shadow-card bg-white shrink-0">
            <img src={store.logoImage} alt={store.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="font-display text-lg font-extrabold text-ink-900">{store.name}</h1>
            <RatingBadge rating={store.rating} count={store.reviewCount} />
          </div>
        </div>

        <p className="text-sm text-ink-600 leading-relaxed mt-4">{store.description}</p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <InfoTile icon={<MapPin className="h-4 w-4" />} label="Endereço" value={store.address} />
          <InfoTile icon={<Phone className="h-4 w-4" />} label="Telefone" value={store.phone} />
          <InfoTile icon={<Clock className="h-4 w-4" />} label="Entrega" value={store.deliveryTime} />
          <InfoTile icon={<Truck className="h-4 w-4" />} label="Taxa" value={formatCurrency(store.deliveryFee)} />
        </div>

        <div className="flex items-center gap-2 mt-6 mb-3">
          <StoreIcon className="h-5 w-5 text-wood-600" />
          <h2 className="font-display text-lg font-bold text-ink-900">Produtos</h2>
          <span className="text-sm text-ink-400">({storeProducts.length})</span>
        </div>

        {storeProducts.length === 0 ? (
          <EmptyState title="Nenhum produto" description="Esta loja ainda não cadastrou produtos." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {storeProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-400 font-medium">
        <span className="text-wood-500">{icon}</span>{label}
      </div>
      <p className="text-sm font-semibold text-ink-800 mt-1 leading-tight">{value}</p>
    </div>
  );
}
