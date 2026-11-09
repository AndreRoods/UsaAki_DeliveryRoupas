import { useState } from 'react';
import { Search, Camera, Filter, X, ChevronLeft } from 'lucide-react';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import type { CategoryId, Availability } from '../types';
import ProductCard from '../components/ProductCard';
import { EmptyState } from '../components/UI';
import { AVAILABILITY_LABELS } from '../utils';
import Modal from '../components/Modal';

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'Único', '2-3', '4-5', '6-7', '8-9', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
const ALL_COLORS = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Vinho', 'Cinza', 'Rosa', 'Amarelo', 'Marrom', 'Camel', 'Jeans Claro', 'Jeans Escuro', 'Floral', 'Prata', 'Dourado', 'Colorido', 'Azul/Roxo', 'Azul Marinho', 'Jeans'];

export default function SearchPage() {
  const { products, navigate } = useStore();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<CategoryId | 'all'>('all');
  const [sizeFilter, setSizeFilter] = useState<string | 'all'>('all');
  const [colorFilter, setColorFilter] = useState<string | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(500);
  const [availability, setAvailability] = useState<Availability | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoName, setPhotoName] = useState('');

  const results = products.filter((p) => {
    if (query) {
      const q = query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (sizeFilter !== 'all' && !p.sizes.includes(sizeFilter)) return false;
    if (colorFilter !== 'all' && !p.colors.some((c) => c.name === colorFilter)) return false;
    if (p.price > maxPrice) return false;
    if (availability !== 'all' && p.availability !== availability) return false;
    return true;
  });

  const activeFilters = (catFilter !== 'all' ? 1 : 0) + (sizeFilter !== 'all' ? 1 : 0) + (colorFilter !== 'all' ? 1 : 0) + (availability !== 'all' ? 1 : 0) + (maxPrice < 500 ? 1 : 0);
  const clearAll = () => { setCatFilter('all'); setSizeFilter('all'); setColorFilter('all'); setMaxPrice(500); setAvailability('all'); };

  return (
    <div className="container-app py-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-extrabold text-ink-900">Encontre sua roupa</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-wood-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome ou descrição..." className="input pl-11" />
        </div>
        <button onClick={() => setShowPhotoModal(true)} className="btn-secondary px-3">
          <Camera className="h-5 w-5" />
        </button>
        <button onClick={() => setShowFilters((v) => !v)} className="btn-secondary px-3 relative">
          <Filter className="h-5 w-5" />
          {activeFilters > 0 && <span className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-wood-600 text-cream-50 text-[9px] font-bold px-1">{activeFilters}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 animate-scale-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink-800">Filtros</h3>
            <div className="flex items-center gap-2">
              {activeFilters > 0 && <button onClick={clearAll} className="text-xs text-wood-600 font-medium">Limpar</button>}
              <button onClick={() => setShowFilters(false)} className="text-ink-400"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <FilterGroup label="Categoria">
            <ChipRow><Chip active={catFilter === 'all'} onClick={() => setCatFilter('all')}>Todas</Chip>
            {CATEGORIES.map((c) => <Chip key={c.id} active={catFilter === c.id} onClick={() => setCatFilter(c.id)}>{c.name}</Chip>)}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label="Disponibilidade">
            <ChipRow><Chip active={availability === 'all'} onClick={() => setAvailability('all')}>Todas</Chip>
            {(['pronta_entrega', 'sob_consulta', 'sob_encomenda'] as Availability[]).map((a) => <Chip key={a} active={availability === a} onClick={() => setAvailability(a)}>{AVAILABILITY_LABELS[a]}</Chip>)}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label="Tamanho">
            <ChipRow><Chip active={sizeFilter === 'all'} onClick={() => setSizeFilter('all')}>Todos</Chip>
            {ALL_SIZES.map((s) => <Chip key={s} active={sizeFilter === s} onClick={() => setSizeFilter(s)}>{s}</Chip>)}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label="Cor">
            <ChipRow><Chip active={colorFilter === 'all'} onClick={() => setColorFilter('all')}>Todas</Chip>
            {ALL_COLORS.map((c) => <Chip key={c} active={colorFilter === c} onClick={() => setColorFilter(c)}>{c}</Chip>)}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label={`Preço máximo: ${maxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}>
            <input type="range" min={50} max={500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-wood-600" />
          </FilterGroup>
        </div>
      )}

      <p className="text-sm text-ink-500 mb-3">{results.length} resultado(s)</p>

      {results.length === 0 ? (
        <EmptyState icon={<Search className="h-7 w-7" />} title="Nenhum produto" description="Ajuste os filtros ou o termo de busca." action={<button onClick={clearAll} className="btn-secondary">Limpar filtros</button>} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <Modal open={showPhotoModal} onClose={() => setShowPhotoModal(false)} title="Busca por imagem (demonstração)">
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-wood-200 p-8 text-center hover:border-wood-400 transition-colors">
            <Camera className="h-10 w-10 mx-auto text-wood-400 mb-2" />
            <p className="text-sm text-ink-600 font-medium">Arraste uma foto ou clique para enviar</p>
            <p className="text-xs text-ink-400 mt-1">JPG, PNG até 5MB</p>
            <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhotoName(f.name); }} />
            <label htmlFor="photo-upload" className="btn-secondary mt-4 inline-flex cursor-pointer">Escolher arquivo</label>
            {photoName && <p className="text-xs text-green-600 mt-2 font-medium">Selecionado: {photoName}</p>}
          </div>
          <div className="rounded-xl bg-amber-50 text-amber-700 text-sm p-3">Demonstração visual. A busca por imagem com IA estará disponível em uma versão futura.</div>
          <button onClick={() => setShowPhotoModal(false)} className="btn-primary w-full">Usar foto como referência</button>
        </div>
      </Modal>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="label">{label}</p>{children}</div>;
}
function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`chip transition-colors ${active ? 'bg-wood-600 text-cream-50' : 'bg-wood-50 text-ink-500 hover:bg-wood-100'}`}>{children}</button>;
}
