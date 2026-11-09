import { useState } from 'react';
import { ChevronLeft, Package, XCircle, MapPin, Store as StoreIcon, Truck } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { OrderStatusBadge } from '../components/Badges';
import { EmptyState } from '../components/UI';
import Modal from '../components/Modal';
import type { Order } from '../types';

export default function OrdersPage() {
  const { orders, navigate } = useStore();
  const [selected, setSelected] = useState<Order | null>(null);
  const recent = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  if (recent.length === 0) {
    return (
      <div className="container-app py-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl font-extrabold text-ink-900">Meus pedidos</h1>
        </div>
        <EmptyState
          icon={<Package className="h-7 w-7" />}
          title="Nenhum pedido ainda"
          description="Quando você fizer um pedido, ele aparecerá aqui."
          action={<button onClick={() => navigate({ name: 'home' })} className="btn-primary">Explorar produtos</button>}
        />
      </div>
    );
  }

  return (
    <div className="container-app py-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate({ name: 'home' })} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-wood-100 text-wood-700">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-extrabold text-ink-900">Meus pedidos</h1>
      </div>

      <div className="space-y-3">
        {recent.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelected(order)}
            className="card w-full text-left p-4 hover:shadow-cardHover transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-wood-50 text-wood-600 shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm text-ink-900">{order.code}</p>
                  <p className="text-xs text-ink-400 truncate">{order.storeName} · {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-wood-50">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="h-9 w-9 rounded-lg overflow-hidden ring-2 ring-white bg-wood-50">
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg ring-2 ring-white bg-wood-100 text-xs font-semibold text-ink-600">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-400">{order.items.length} item(ns)</p>
                <p className="font-display font-bold text-sm text-wood-700">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Pedido ${selected.code}` : ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <OrderStatusBadge status={selected.status} />
              <span className="text-xs text-ink-400">{formatDate(selected.createdAt)}</span>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-1">
              {(['aguardando_confirmacao', 'confirmado', 'preparando', 'a_caminho', 'entregue'] as const).map((step, i) => {
                const isRejected = selected.status === 'recusado' || selected.status === 'cancelado';
                const isPast = !isRejected && ['aguardando_confirmacao', 'confirmado', 'preparando', 'a_caminho', 'entregue'].indexOf(selected.status) >= i;
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`flex-1 h-1.5 rounded-full ${i === 0 ? '' : 'mr-1'} ${isRejected ? 'bg-red-200' : isPast ? 'bg-wood-500' : 'bg-wood-100'}`} />
                  </div>
                );
              })}
            </div>

            {selected.status === 'recusado' && (
              <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4" /> A loja recusou este pedido.
              </div>
            )}
            {selected.status === 'cancelado' && (
              <div className="rounded-xl bg-wood-50 text-ink-500 p-3 text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4" /> Pedido cancelado.
              </div>
            )}

            <div className="card p-3 flex items-center gap-3">
              <StoreIcon className="h-5 w-5 text-wood-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{selected.storeName}</p>
                <p className="text-xs text-ink-400">{selected.fulfillment === 'entrega' ? 'Entrega' : 'Retirada na loja'}</p>
              </div>
              {selected.fulfillment === 'entrega' && <Truck className="h-4 w-4 text-ink-400" />}
            </div>

            {selected.fulfillment === 'entrega' && selected.address && (
              <div className="flex items-start gap-2 text-sm text-ink-600">
                <MapPin className="h-4 w-4 text-wood-500 shrink-0 mt-0.5" />
                <span>{selected.address}</span>
              </div>
            )}

            <div className="space-y-2">
              {selected.items.map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl bg-wood-50/50">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-wood-50 shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-ink-400">Tam: {item.size} · Cor: {item.color} · Qtd: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-wood-700">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-wood-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Subtotal</span><span className="font-medium text-ink-700">{formatCurrency(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Entrega</span><span className="font-medium text-ink-700">{selected.deliveryFee === 0 ? 'Grátis' : formatCurrency(selected.deliveryFee)}</span></div>
              <div className="flex justify-between font-bold text-base pt-1"><span className="text-ink-900">Total</span><span className="text-wood-700">{formatCurrency(selected.total)}</span></div>
            </div>

            <div className="text-xs text-ink-400 pt-2 border-t border-wood-100">
              <p>Cliente: {selected.customerName} · {selected.customerPhone}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
