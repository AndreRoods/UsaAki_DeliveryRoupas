import type { ReactNode } from 'react';
import { AvailabilityBadge, OrderStatusBadge } from './Badges';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  if (!open) return null;

  const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-wood-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxW} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-wood-100 px-5 py-4 sticky top-0 bg-white rounded-t-2xl z-10">
            <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-wood-50 hover:text-wood-700 transition-colors"
              aria-label="Fechar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export { AvailabilityBadge, OrderStatusBadge };
