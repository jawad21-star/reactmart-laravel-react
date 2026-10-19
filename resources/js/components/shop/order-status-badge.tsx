import { cn } from '@/lib/utils';
import type { Order } from '@/types';

const COLORS: Record<Order['status'], string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    processing: 'bg-sky-50 text-sky-700 ring-sky-200',
    shipped: 'bg-brand-50 text-brand-700 ring-brand-200',
    delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export function OrderStatusBadge({ order }: { order: Pick<Order, 'status' | 'status_label'> }) {
    return (
        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset', COLORS[order.status])}>
            {order.status_label}
        </span>
    );
}
