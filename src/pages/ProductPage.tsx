import { useState } from 'react';
import { ChevronLeft, ShoppingBag, Minus, Plus, Store as StoreIcon, Truck, Check, MessageCircle, Share2, Heart, Box } from 'lucide-react';
import { useStore, uid } from '../store';
import { formatCurrency } from '../utils';
import { AvailabilityBadge, RatingBadge } from '../components/Badges';
import ProductViewer3D from '../components/ProductViewer3D';
import type { CartItem } from '../types';

export default function ProductPage({ productId }: { productId: string }) {
  const { products, stores, navigate, addToCart, cartCount } = useStore();
  const product = products.find((p) => p.id === productId);
  const [viewMode, setViewMode] = useState<'3d' | 'photos'>('3d');
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] ?? '');
  const [color, setColor] = useState(product?.colors[0]?.name ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!product) {
    return (
      <div className="container-app py-16 text-center">
        <p className="text-ink-500">Produto não encontrado.</p>
        <button onClick={() => navigate({ name: 'home' })} className="btn-primary mt-4">Voltar ao início</button>
      </div>
    );
  }

  const store = stores.find((s) => s.id === product.storeId);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);
  const isConsult = product.availability !== 'pronta_entrega';

  const handleAdd = () => {
    const item: CartItem = {
      id: uid('cart'), productId: product.id, storeId: product.storeId,
      name: product.name, image: product.image, price: product.price,
      size, color, quantity: qty, availability: product.availability,
    };
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => { handleAdd(); setTimeout(() => navigate({ name: 'cart' }), 300); };

  return (
    <div className="animate-fade-in pb-4">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-cream-50/90 backdrop-blur-lg border-b border-wood-100">
        <div className="container-app flex items-center justify-between h-14">
          <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked((v) => !v)} className={`flex h-9 w-9 items-center justify-center rounded-xl border ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-wood-100 text-ink-400'}`}>
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-ink-400">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-app">
        {/* Visual area */}
        <div className="py-6">
          {/* View toggle */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setViewMode('3d')}
              className={`tab-pill flex items-center gap-1.5 ${viewMode === '3d' ? 'bg-wood-600 text-cream-50' : 'bg-white text-ink-500 border border-wood-100'}`}
            >
              <Box className="h-4 w-4" /> Visualizar 3D
            </button>
            <button
              onClick={() => setViewMode('photos')}
              className={`tab-pill flex items-center gap-1.5 ${viewMode === 'photos' ? 'bg-wood-600 text-cream-50' : 'bg-white text-ink-500 border border-wood-100'}`}
            >
              <ShoppingBag className="h-4 w-4" /> Fotos
            </button>
          </div>

          {viewMode === '3d' ? (
            <div className="rounded-3xl bg-gradient-to-b from-wood-50 to-cream-100 py-8 px-4 border border-wood-100">
              <ProductViewer3D images={product.images} name={product.name} />
            </div>
          ) : (
            <div>
              <div className="card overflow-hidden mb-3">
                <div className="aspect-[4/5] bg-wood-50">
                  <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-wood-500' : 'border-wood-100'}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Store link */}
        {store && (
          <button
            onClick={() => navigate({ name: 'store', storeId: store.id })}
            className="card w-full p-3 flex items-center gap-3 mb-4 hover:shadow-cardHover transition-all active:scale-[0.98]"
          >
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-wood-50 shrink-0">
              <img src={store.logoImage} alt={store.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-ink-800">{store.name}</p>
              <p className="text-xs text-ink-400">{store.address}</p>
            </div>
            <StoreIcon className="h-4 w-4 text-wood-500" />
          </button>
        )}

        {/* Product info */}
        <h1 className="font-display text-xl font-extrabold text-ink-900 leading-tight">{product.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <RatingBadge rating={product.rating} count={product.reviewCount} />
          <AvailabilityBadge type={product.availability} />
        </div>

        <div className="flex items-baseline gap-3 mt-4">
          <span className="font-display text-2xl font-extrabold text-wood-700">{formatCurrency(product.price)}</span>
          {product.oldPrice && <span className="text-base text-ink-300 line-through">{formatCurrency(product.oldPrice)}</span>}
        </div>

        <p className="text-sm text-ink-600 leading-relaxed mt-4">{product.description}</p>

        {/* Availability note */}
        <div className={`mt-4 rounded-2xl p-3.5 text-sm ${
          product.availability === 'pronta_entrega' ? 'bg-green-50 text-green-700' :
          product.availability === 'sob_consulta' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
        }`}>
          {product.availability === 'pronta_entrega' && <><Truck className="h-4 w-4 inline mr-1.5" /> Disponível para compra imediata.</>}
          {product.availability === 'sob_consulta' && <><MessageCircle className="h-4 w-4 inline mr-1.5" /> Necessita confirmação da loja.</>}
          {product.availability === 'sob_encomenda' && <><Clock className="h-4 w-4 inline mr-1.5" /> Produto sob encomenda.</>}
        </div>

        {/* Sizes */}
        <div className="mt-5">
          <p className="label">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`min-w-[44px] rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  size === s ? 'border-wood-500 bg-wood-50 text-wood-700' : 'border-wood-200 text-ink-600 hover:border-wood-300'
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mt-4">
          <p className="label">Cor: <span className="text-ink-800 font-semibold">{color}</span></p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button key={c.name} onClick={() => setColor(c.name)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  color === c.name ? 'border-wood-500 bg-wood-50 text-wood-700' : 'border-wood-200 text-ink-600 hover:border-wood-300'
                }`}>
                <span className="h-4 w-4 rounded-full ring-1 ring-wood-200" style={{ backgroundColor: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-4">
          <p className="label">Quantidade</p>
          <div className="inline-flex items-center rounded-xl border border-wood-200 bg-white">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-wood-600"><Minus className="h-4 w-4" /></button>
            <span className="w-12 text-center font-semibold text-ink-900">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="p-3 text-wood-600"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-ink-800 mb-3">Você também pode gostar</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
              {related.map((p) => (
                <button key={p.id} onClick={() => navigate({ name: 'product', productId: p.id })}
                  className="card shrink-0 w-32 overflow-hidden text-left active:scale-[0.98] transition-transform">
                  <div className="aspect-square overflow-hidden bg-wood-50">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-ink-800 line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-bold text-wood-700 mt-0.5">{formatCurrency(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-wood-100 pb-safe">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
          <button onClick={handleAdd}
            className={`btn flex-1 px-4 py-3 rounded-2xl text-sm font-semibold border ${
              added ? 'bg-green-500 text-white border-green-500' : 'bg-white text-wood-700 border-wood-200'
            }`}>
            {added ? <><Check className="h-5 w-5" /> Adicionado!</> : <><ShoppingBag className="h-5 w-5" /> Adicionar</>}
          </button>
          <button onClick={handleBuyNow} className="btn-primary flex-1 px-4 py-3 rounded-2xl">
            {isConsult ? 'Solicitar' : 'Comprar'}
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind sticky bar */}
      <div className="h-20" />
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
