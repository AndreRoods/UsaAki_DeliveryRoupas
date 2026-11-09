import type { Availability, OrderStatus } from './types';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  pronta_entrega: 'Pronta entrega',
  sob_consulta: 'Sob consulta',
  sob_encomenda: 'Sob encomenda',
};

export const AVAILABILITY_SHORT: Record<Availability, string> = {
  pronta_entrega: 'Pronta entrega',
  sob_consulta: 'Sob consulta',
  sob_encomenda: 'Sob encomenda',
};

export const AVAILABILITY_STYLES: Record<Availability, string> = {
  pronta_entrega: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  sob_consulta: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  sob_encomenda: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

export const AVAILABILITY_DOT: Record<Availability, string> = {
  pronta_entrega: 'bg-green-500',
  sob_consulta: 'bg-amber-500',
  sob_encomenda: 'bg-blue-500',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  aguardando_confirmacao: 'Aguardando confirmação',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  a_caminho: 'A caminho',
  entregue: 'Entregue',
  recusado: 'Recusado',
  cancelado: 'Cancelado',
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  aguardando_confirmacao: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmado: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  preparando: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  a_caminho: 'bg-wood-100 text-wood-700 ring-1 ring-wood-300',
  entregue: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  recusado: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  cancelado: 'bg-ink-100 text-ink-500 ring-1 ring-ink-200',
};

export const ORDER_FLOW: OrderStatus[] = ['aguardando_confirmacao', 'confirmado', 'preparando', 'a_caminho', 'entregue'];
