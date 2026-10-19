import { OrderSummary } from '@/components/shop/order-summary';
import { ProductImage } from '@/components/shop/product-image';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import type { CartLine, CartSummary } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2 } from 'lucide-react';

function LineItem({ line }: { line: CartLine }) {
    const { money } = useShop();
    const setQty = (quantity: number) => router.patch(route('cart.update', line.id), { quantity }, { preserveScroll: true });

    return (
        <li className="flex gap-4 py-6 sm:gap-6">
            <Link href={route('products.show', line.slug)} className="size-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:size-28">
                <ProductImage src={line.image_url} alt={line.name} className="size-full p-2" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                        <Link href={route('products.show', line.slug)} className="line-clamp-2 font-semibold text-slate-900 hover:text-brand-600">
                            {line.name}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">{money(line.price)} each</p>
                    </div>
                    <p className="font-bold whitespace-nowrap text-slate-900">{money(line.total)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-slate-300">
                        <button type="button" onClick={() => setQty(line.quantity - 1)} className="flex size-9 cursor-pointer items-center justify-center text-slate-600 hover:text-slate-900" aria-label="Decrease quantity">
                            <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
                        <button
                            type="button"
                            disabled={line.quantity >= line.stock}
                            onClick={() => setQty(line.quantity + 1)}
                            className="flex size-9 cursor-pointer items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30"
                            aria-label="Increase quantity"
                        >
                            <Plus className="size-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.delete(route('cart.remove', line.id), { preserveScroll: true })}
                        className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600"
                    >
                        <Trash2 className="size-4" /> Remove
                    </button>
                </div>
            </div>
        </li>
    );
}

function CouponBox({ cart }: { cart: CartSummary }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    if (cart.coupon) {
        return (
            <div>
                <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <Tag className="size-4" /> {cart.coupon}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.delete(route('cart.coupon.remove'), { preserveScroll: true })}
                        className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-rose-600"
                    >
                        Remove
                    </button>
                </div>
                {cart.couponError && <p className="mt-2 text-xs text-amber-600">{cart.couponError}</p>}
            </div>
        );
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post(route('cart.coupon.apply'), { preserveScroll: true });
            }}
        >
            <div className="flex gap-2">
                <input value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="field !rounded-full uppercase" />
                <button disabled={processing} className="btn-outline shrink-0">
                    Apply
                </button>
            </div>
            {errors.code && <p className="mt-2 text-xs text-rose-600">{errors.code}</p>}
        </form>
    );
}

export default function Cart({ cart }: { cart: CartSummary }) {
    return (
        <ShopLayout title="Shopping cart">
            <div className="container-shop py-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Shopping cart</h1>

                {cart.lines.length === 0 ? (
                    <div className="panel mt-8 flex flex-col items-center px-6 py-20 text-center">
                        <span className="flex size-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <ShoppingBag className="size-9" />
                        </span>
                        <h2 className="mt-6 text-xl font-semibold text-slate-900">Your cart is empty</h2>
                        <p className="mt-2 text-slate-500">Looks like you haven&apos;t added anything yet.</p>
                        <Link href={route('shop')} className="btn-primary mt-8 !px-8 !py-3">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-10 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ul className="divide-y divide-slate-200 border-y border-slate-200">
                                {cart.lines.map((line) => (
                                    <LineItem key={line.id} line={line} />
                                ))}
                            </ul>
                            <Link href={route('shop')} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
                                ← Continue shopping
                            </Link>
                        </div>

                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <div className="panel bg-slate-50 p-6">
                                <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
                                <div className="mt-5">
                                    <CouponBox cart={cart} />
                                </div>
                                <div className="mt-6">
                                    <OrderSummary cart={cart} />
                                </div>
                                <Link href={route('checkout')} className="btn-primary mt-6 w-full !py-3.5">
                                    Proceed to checkout <ArrowRight className="size-4" />
                                </Link>
                                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                                    <ShieldCheck className="size-4" /> Secure checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
