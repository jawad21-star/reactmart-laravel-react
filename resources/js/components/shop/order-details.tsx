import { useShop } from '@/hooks/use-shop';
import type { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { ProductImage } from './product-image';

/** Items list, totals and delivery info — shared by the thank-you and account order pages. */
export function OrderItems({ order }: { order: Order }) {
    const { money } = useShop();

    return (
        <ul className="divide-y divide-slate-100">
            {order.items?.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                    <div className="size-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50">
                        <ProductImage src={item.image_url} alt={item.product_name} className="size-full p-1.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        {item.slug ? (
                            <Link href={route('products.show', item.slug)} className="font-medium text-slate-900 hover:text-brand-600">
                                {item.product_name}
                            </Link>
                        ) : (
                            <p className="font-medium text-slate-900">{item.product_name}</p>
                        )}
                        <p className="text-sm text-slate-500">
                            {money(item.price)} × {item.quantity}
                        </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap text-slate-900">{money(item.total)}</p>
                </li>
            ))}
        </ul>
    );
}

export function OrderTotals({ order }: { order: Order }) {
    const { money } = useShop();

    return (
        <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd>{money(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                    <dt>Discount ({order.coupon_code})</dt>
                    <dd>- {money(order.discount)}</dd>
                </div>
            )}
            <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd>{order.shipping > 0 ? money(order.shipping) : 'Free'}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd>{money(order.total)}</dd>
            </div>
        </dl>
    );
}
