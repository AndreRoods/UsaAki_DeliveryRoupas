import type { Availability, OrderStatus } from '../types';
import { AVAILABILITY_LABELS, AVAILABILITY_STYLES, AVAILABILITY_DOT, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '../utils';

export function AvailabilityBadge({ type, size = 'sm' }: { type: Availability; size?: 'sm' | 'xs' }) {
  const pad = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`chip ${AVAILABILITY_STYLES[type]} ${pad}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${AVAILABILITY_DOT[type]}`} />
      {AVAILABILITY_LABELS[type]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`chip ${ORDER_STATUS_STYLES[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function RatingBadge({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500">
      <svg className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.572-.955L10 0l2.938 5.955 6.572.955-4.755 4.635 1.123 6.545z" />
      </svg>
      <span className="text-ink-700 font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-ink-300">({count})</span>}
    </span>
  );
}
