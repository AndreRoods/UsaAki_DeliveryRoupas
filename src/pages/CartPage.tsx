import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag, Truck, Store as StoreIcon, Check, Info } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { AvailabilityBadge } from '../components/Badges';
import { EmptyState } from '../components/UI';
import Modal from '../components/Modal';
import type { FulfillmentType, OrderItem } from '../types';

export default function CartPage() {
  const { cart, stores, navigate, updateCartQty, removeFromCart, cartSubtotal, deliveryAddress, setDeliveryAddress, placeOrder, clearCart } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('entrega');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{ code: string; consult: boolean } | null>(null);

  const byStore = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    (acc[item.storeId] = acc[item.storeId] || []).push(item);
    return acc;
  }, {});

  const hasConsult = cart.some((c) => c.availability !== 'pronta_entrega');
  const deliveryFee = fulfillment === 'entrega' ? stores.find((s) => s.id === cart[0]?.storeId)?.deliveryFee ?? 0 : 0;
  const total = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    if (!name || !phone) return;
    if (fulfillment === 'entrega' && !deliveryAddress) return;
    const storeId = cart[0]?.storeId ?? '';
    const store = stores.find((s) => s.id === storeId);
    const items: OrderItem[] = cart.map((c) => ({
      productId: c.productId, name: c.name, image: c.image, price: c.price,
      size: c.size, color: c.color, quantity: c.quantity, availability: c.availability,
    }));
    const order = placeOrder({
      storeId, storeName: store?.name ?? '', items, subtotal: cartSubtotal,
      deliveryFee, total, fulfillment,
      address: fulfillment === 'entrega' ? deliveryAddress : undefined,
      customerName: name, customerPhone: phone,
      status: hasConsult ? 'aguardando_confirmacao' : 'confirmado',
      notes,
    });
    clearCart();
    setShowCheckout(false);
    setConfirmedOrder({ code: order.code, consult: hasConsult });
  };

  if (confirmedOrder) {
    return (
      <div className="container-app py-10 animate-fade-in">
        <div className="card max-w-sm mx-auto p-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-display text-xl font-extrabold text-ink-900">{confirmedOrder.consult ? 'Solicitação enviada!' : 'Pedido confirmado!'}</h1>
          <p className="text-sm text-ink-500 mt-2">{confirmedOrder.consult ? 'Aguarde a confirmação da loja.' : `Pedido ${confirmedOrder.code} confirmado.`}</p>
          <div className="mt-4 rounded-2xl bg-wood-50 p-3">
            <p className="text-xs text-ink-400">Código</p>
            <p className="font-display text-lg font-bold text-wood-700">{confirmedOrder.code}</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button onClick={() => navigate({ name: 'orders' })} className="btn-primary w-full">Ver meus pedidos</button>
            <button onClick={() => navigate({ name: 'home' })} className="btn-ghost w-full">Continuar comprando</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-app py-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="font-display text-xl font-extrabold text-ink-900">Carrinho</h1>
        </div>
        <EmptyState icon={<ShoppingBag className="h-7 w-7" />} title="Carrinho vazio" description="Adicione produtos para começar." action={<button onClick={() => navigate({ name: 'home' })} className="btn-primary">Explorar produtos</button>} />
      </div>
    );
  }

  return (
    <div className="container-app py-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700"><ChevronLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl font-extrabold text-ink-900">Carrinho</h1>
      </div>

      {hasConsult && (
        <div className="rounded-2xl bg-amber-50 text-amber-700 p-3 text-xs flex items-start gap-2 mb-3">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Itens sob consulta/encomenda precisam de confirmação da loja.</span>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {Object.entries(byStore).map(([storeId, items]) => {
          const store = stores.find((s) => s.id === storeId);
          return (
            <div key={storeId} className="card overflow-hidden">
              <button onClick={() => navigate({ name: 'store', storeId })} className="flex items-center gap-2 px-4 py-3 border-b border-wood-50 hover:bg-wood-50/50 w-full text-left">
                <StoreIcon className="h-4 w-4 text-wood-500" />
                <span className="font-semibold text-sm text-ink-900">{store?.name}</span>
                <span className="text-xs text-ink-400">· {store?.deliveryTime}</span>
              </button>
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border-b border-wood-50 last:border-0">
                  <button onClick={() => navigate({ name: 'product', productId: item.productId })} className="h-16 w-16 rounded-xl overflow-hidden bg-wood-50 shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-ink-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-ink-400 mt-0.5">Tam: {item.size} · Cor: {item.color}</p>
                    <div className="mt-1"><AvailabilityBadge type={item.availability} size="xs" /></div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-lg border border-wood-200">
                        <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="p-1.5 text-wood-600"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="p-1.5 text-wood-600"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-sm text-wood-700">{formatCurrency(item.price * item.quantity)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-ink-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="card p-4 mb-4">
        <h2 className="font-display font-bold text-ink-900 mb-3">Resumo</h2>
        <div className="space-y-2 text-sm">
          <Row label="Subtotal" value={formatCurrency(cartSubtotal)} />
          <Row label="Entrega" value={fulfillment === 'entrega' ? formatCurrency(deliveryFee) : 'Grátis'} />
          <div className="border-t border-wood-100 pt-2"><Row label="Total" value={formatCurrency(total)} bold /></div>
        </div>
      </div>

      <button onClick={() => setShowCheckout(true)} className="btn-primary w-full py-3.5 text-base">Finalizar pedido</button>

      <Modal open={showCheckout} onClose={() => setShowCheckout(false)} title="Finalizar pedido" size="lg">
        <div className="space-y-4">
          <div>
            <p className="label">Modalidade</p>
            <div className="grid grid-cols-2 gap-2">
              <FulfillmentOption active={fulfillment === 'entrega'} onClick={() => setFulfillment('entrega')} icon={<Truck className="h-5 w-5" />} label="Entrega" desc="Receba em casa" />
              <FulfillmentOption active={fulfillment === 'retirada'} onClick={() => setFulfillment('retirada')} icon={<StoreIcon className="h-5 w-5" />} label="Retirada" desc="Sem taxa" />
            </div>
          </div>
          {fulfillment === 'entrega' && (
            <div><p className="label">Endereço</p><input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Rua, número, bairro..." className="input" /></div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div><p className="label">Nome</p><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="input" /></div>
            <div><p className="label">Telefone</p><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="input" /></div>
          </div>
          <div><p className="label">Observações</p><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instruções para a loja" rows={2} className="input" /></div>
          <div className="rounded-2xl bg-wood-50 p-3 space-y-1.5 text-sm">
            <Row label="Subtotal" value={formatCurrency(cartSubtotal)} />
            <Row label="Entrega" value={fulfillment === 'entrega' ? formatCurrency(deliveryFee) : 'Grátis'} />
            <div className="border-t border-wood-200 pt-1.5"><Row label="Total" value={formatCurrency(total)} bold /></div>
          </div>
          <button onClick={handleCheckout} disabled={!name || !phone || (fulfillment === 'entrega' && !deliveryAddress)} className="btn-primary w-full py-3">{hasConsult ? 'Solicitar pedido' : 'Confirmar pedido'}</button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold text-ink-900' : 'text-ink-500'}>{label}</span>
      <span className={bold ? 'font-display font-extrabold text-wood-700' : 'font-medium text-ink-700'}>{value}</span>
    </div>
  );
}

function FulfillmentOption({ active, onClick, icon, label, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${active ? 'border-wood-500 bg-wood-50' : 'border-wood-200'}`}>
      <span className={active ? 'text-wood-600' : 'text-ink-400'}>{icon}</span>
      <span className={`text-sm font-semibold ${active ? 'text-wood-700' : 'text-ink-600'}`}>{label}</span>
      <span className="text-xs text-ink-400">{desc}</span>
    </button>
  );
}
