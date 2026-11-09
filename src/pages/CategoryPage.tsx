import { useState } from 'react';
import { ChevronLeft, Filter, X } from 'lucide-react';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import type { CategoryId, Availability } from '../types';
import ProductCard from '../components/ProductCard';
import { EmptyState } from '../components/UI';
import { AVAILABILITY_LABELS } from '../utils';

export default function CategoryPage({ categoryId }: { categoryId: CategoryId }) {
  const { products, navigate } = useStore();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | 'all'>('all');
  const [sort, setSort] = useState<'recent' | 'price_low' | 'price_high' | 'rating'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  if (!category) return null;

  let list = products.filter((p) => p.category === categoryId);
  if (selectedAvailability !== 'all') list = list.filter((p) => p.availability === selectedAvailability);
  if (sort === 'price_low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'price_high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  if (sort === 'recent') list = [...list].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="container-app py-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-extrabold text-ink-900">{category.name}</h1>
          <p className="text-xs text-ink-400">{list.length} produtos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input h-10 py-2 text-sm flex-1">
          <option value="recent">Mais recentes</option>
          <option value="price_low">Menor preço</option>
          <option value="price_high">Maior preço</option>
          <option value="rating">Melhor avaliados</option>
        </select>
        <button onClick={() => setShowFilters((v) => !v)} className="btn-secondary h-10 px-3">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-ink-800">Disponibilidade</span>
            <button onClick={() => setShowFilters(false)} className="text-ink-400"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={selectedAvailability === 'all'} onClick={() => setSelectedAvailability('all')}>Todas</FilterChip>
            {(['pronta_entrega', 'sob_consulta', 'sob_encomenda'] as Availability[]).map((a) => (
              <FilterChip key={a} active={selectedAvailability === a} onClick={() => setSelectedAvailability(a)}>
                <span className={`h-1.5 w-1.5 rounded-full ${a === 'pronta_entrega' ? 'bg-green-500' : a === 'sob_consulta' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                {AVAILABILITY_LABELS[a]}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState title="Nenhum produto" description="Tente mudar os filtros." />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`chip transition-colors ${active ? 'bg-wood-600 text-cream-50' : 'bg-wood-50 text-ink-500 hover:bg-wood-100'}`}>
      {children}
    </button>
  );
}
