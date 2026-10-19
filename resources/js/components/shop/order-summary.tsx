import { useShop } from '@/hooks/use-shop';
import type { CartSummary } from '@/types';

export function OrderSummary({ cart }: { cart: CartSummary }) {
    const { money, shop } = useShop();
    const remaining = shop.free_shipping_over - cart.subtotal;

    return (
        <>
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-slate-500">Subtotal</dt>
                    <dd className="font-medium text-slate-900">{money(cart.subtotal)}</dd>
                </div>
                {cart.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <dt>Discount ({cart.coupon})</dt>
                        <dd className="font-medium">- {money(cart.discount)}</dd>
                    </div>
                )}
                <div className="flex justify-between">
                    <dt className="text-slate-500">Shipping</dt>
                    <dd className="font-medium text-slate-900">{cart.shipping > 0 ? money(cart.shipping) : 'Free'}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
                    <dt className="font-semibold text-slate-900">Total</dt>
                    <dd className="text-xl font-extrabold text-slate-900">{money(cart.total)}</dd>
                </div>
            </dl>

            {remaining > 0 && (
                <div className="mt-5 rounded-xl bg-brand-50 p-3.5">
                    <p className="text-xs font-medium text-brand-700">
                        Add <strong>{money(remaining)}</strong> more for free delivery
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, (cart.subtotal / shop.free_shipping_over) * 100)}%` }} />
                    </div>
                </div>
            )}
        </>
    );
}
