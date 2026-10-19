import { OrderItems, OrderTotals } from '@/components/shop/order-details';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import type { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';

export default function Success({ order }: { order: Order }) {
    const { shop, auth } = useShop();

    return (
        <ShopLayout title="Order confirmed">
            <div className="container-shop max-w-3xl py-16">
                <div className="text-center">
                    <span className="mx-auto flex size-20 animate-fade-up items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="size-10" />
                    </span>
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Thank you for your order!</h1>
                    <p className="mt-2 text-slate-500">
                        We&apos;ve received your order and will contact you at <strong className="text-slate-700">{order.customer_phone}</strong> to confirm.
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
                        Order number: <strong className="font-mono text-slate-900">{order.order_number}</strong>
                    </p>
                </div>

                {order.payment_method === 'bank' && (
                    <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                        <h2 className="font-semibold text-amber-900">Bank transfer details</h2>
                        <dl className="mt-3 grid gap-2 text-sm text-amber-900 sm:grid-cols-2">
                            <div>
                                <dt className="text-amber-700">Bank</dt>
                                <dd className="font-medium">Meezan Bank</dd>
                            </div>
                            <div>
                                <dt className="text-amber-700">Account title</dt>
                                <dd className="font-medium">{shop.name}</dd>
                            </div>
                            <div>
                                <dt className="text-amber-700">IBAN</dt>
                                <dd className="font-mono font-medium">PK00 MEZN 0000 0000 0000 0000</dd>
                            </div>
                            <div>
                                <dt className="text-amber-700">Reference</dt>
                                <dd className="font-mono font-medium">{order.order_number}</dd>
                            </div>
                        </dl>
                        <p className="mt-3 text-xs text-amber-700">Please use your order number as the payment reference.</p>
                    </div>
                )}

                <div className="panel mt-10 p-6">
                    <h2 className="font-bold text-slate-900">Order details</h2>
                    <OrderItems order={order} />
                    <div className="mt-2 border-t border-slate-200 pt-4">
                        <OrderTotals order={order} />
                    </div>
                    <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
                        <div>
                            <p className="font-semibold text-slate-900">Shipping to</p>
                            <p className="mt-1 text-slate-600">
                                {order.customer_name}
                                <br />
                                {order.address}
                                <br />
                                {order.city} {order.postal_code}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Payment</p>
                            <p className="mt-1 text-slate-600">{order.payment_method_label}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href={route('shop')} className="btn-primary">
                        Continue shopping
                    </Link>
                    {auth.user && (
                        <Link href={route('account')} className="btn-outline">
                            View my orders
                        </Link>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}
