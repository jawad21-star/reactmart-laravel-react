import { OrderItems, OrderTotals } from '@/components/shop/order-details';
import { OrderStatusBadge } from '@/components/shop/order-status-badge';
import AccountLayout from '@/layouts/account-layout';
import type { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';

const STEPS = [
    ['pending', 'Pending'],
    ['processing', 'Processing'],
    ['shipped', 'Shipped'],
    ['delivered', 'Delivered'],
] as const;

export default function AccountOrder({ order }: { order: Order }) {
    const current = STEPS.findIndex(([status]) => status === order.status);

    return (
        <AccountLayout title="My account">
            <Link href={route('account')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                ← Back to orders
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="font-mono text-2xl font-extrabold text-slate-900">{order.order_number}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Placed on {new Date(order.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <OrderStatusBadge order={order} />
            </div>

            {current >= 0 && (
                <ol className="panel mt-8 grid grid-cols-4 p-6">
                    {STEPS.map(([status, label], i) => (
                        <li key={status} className="relative flex flex-col items-center text-center">
                            {i > 0 && <span className={`absolute top-4 right-1/2 h-0.5 w-full ${i <= current ? 'bg-brand-600' : 'bg-slate-200'}`} />}
                            <span className={`relative flex size-8 items-center justify-center rounded-full text-xs font-bold ${i <= current ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {i < current ? <Check className="size-4" /> : i + 1}
                            </span>
                            <span className={`mt-2 text-xs font-medium sm:text-sm ${i <= current ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
                        </li>
                    ))}
                </ol>
            )}

            <div className="mt-8 grid gap-8 xl:grid-cols-3">
                <div className="panel p-6 xl:col-span-2">
                    <h3 className="font-bold text-slate-900">Items</h3>
                    <OrderItems order={order} />
                </div>
                <div className="space-y-6">
                    <div className="panel p-6">
                        <h3 className="mb-4 font-bold text-slate-900">Summary</h3>
                        <OrderTotals order={order} />
                    </div>
                    <div className="panel p-6 text-sm">
                        <h3 className="font-bold text-slate-900">Delivery</h3>
                        <p className="mt-3 text-slate-600">
                            {order.customer_name}
                            <br />
                            {order.address}
                            <br />
                            {order.city} {order.postal_code}
                            <br />
                            {order.customer_phone}
                        </p>
                        <h3 className="mt-5 font-bold text-slate-900">Payment</h3>
                        <p className="mt-2 text-slate-600 capitalize">
                            {order.payment_method_label} · {order.payment_status}
                        </p>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
