import { useStore } from '../store';
import type { Product } from '../types';
import { formatCurrency } from '../utils';
import { AvailabilityBadge } from './Badges';

export default function ProductCard({ product }: { product: Product }) {
  const { navigate, stores } = useStore();
  const store = stores.find((s) => s.id === product.storeId);

  return (
    <button
      onClick={() => navigate({ name: 'product', productId: product.id })}
      className="card group text-left overflow-hidden hover:shadow-cardHover transition-all duration-300 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-wood-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <AvailabilityBadge type={product.availability} />
        </div>
        {product.oldPrice && (
          <div className="absolute top-2 right-2 chip bg-red-500 text-white text-[10px] font-bold px-2 py-0.5">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-ink-400 mb-0.5 truncate">{store?.name}</p>
        <h3 className="font-semibold text-sm text-ink-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-wood-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-base text-wood-700">{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-ink-300 line-through">{formatCurrency(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </button>
  );
}
