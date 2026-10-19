import { OrderSummary } from '@/components/shop/order-summary';
import { ProductImage } from '@/components/shop/product-image';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import { cn } from '@/lib/utils';
import type { CartSummary } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type Defaults = { customer_name: string; customer_email: string; customer_phone: string; address: string; city: string };

type Props = { cart: CartSummary; defaults: Defaults; paymentMethods: Record<string, string> };

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Hyderabad'];

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
    return (
        <section className="panel p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-xs text-white">{n}</span> {title}
            </h2>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function Checkout({ cart, defaults, paymentMethods }: Props) {
    const { money, auth } = useShop();
    const { data, setData, post, processing, errors } = useForm({
        ...defaults,
        postal_code: '',
        notes: '',
        payment_method: 'cod',
    });

    // A small helper so every text field is wired the same way.
    const field = (name: keyof typeof data, label: string, props: Record<string, unknown> = {}, className = '') => (
        <div className={className}>
            <label className="field-label" htmlFor={name}>
                {label}
            </label>
            <input id={name} value={data[name]} onChange={(e) => setData(name, e.target.value)} className={cn('field', errors[name] && '!border-rose-400')} {...props} />
            {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
        </div>
    );

    const cartError = (errors as Record<string, string>).cart;

    return (
        <ShopLayout title="Checkout">
            <div className="container-shop py-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
                {!auth.user && (
                    <p className="mt-2 text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href={route('login')} className="font-semibold text-brand-600 hover:underline">
                            Sign in
                        </Link>{' '}
                        for faster checkout.
                    </p>
                )}

                {cartError && (
                    <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {cartError}{' '}
                        <Link href={route('cart.index')} className="font-semibold underline">
                            Go to cart
                        </Link>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('checkout.store'));
                    }}
                    className="mt-8 grid gap-10 lg:grid-cols-5"
                >
                    <div className="space-y-8 lg:col-span-3">
                        <Step n={1} title="Contact information">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {field('customer_name', 'Full name', { required: true, autoComplete: 'name' }, 'sm:col-span-2')}
                                {field('customer_email', 'Email', { type: 'email', required: true, autoComplete: 'email' })}
                                {field('customer_phone', 'Phone', { type: 'tel', required: true, placeholder: '03xx xxxxxxx', autoComplete: 'tel' })}
                            </div>
                        </Step>

                        <Step n={2} title="Shipping address">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {field('address', 'Street address', { required: true, placeholder: 'House #, street, area', autoComplete: 'street-address' }, 'sm:col-span-2')}
                                {field('city', 'City', { required: true, list: 'cities', autoComplete: 'address-level2' })}
                                <datalist id="cities">
                                    {CITIES.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                                {field('postal_code', 'Postal code (optional)', { autoComplete: 'postal-code' })}
                                <div className="sm:col-span-2">
                                    <label className="field-label" htmlFor="notes">
                                        Order notes (optional)
                                    </label>
                                    <textarea id="notes" rows={2} value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="field" placeholder="Delivery instructions, landmark…" />
                                </div>
                            </div>
                        </Step>

                        <Step n={3} title="Payment method">
                            <div className="space-y-3">
                                {Object.entries(paymentMethods).map(([value, label]) => (
                                    <label
                                        key={value}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition',
                                            data.payment_method === value ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300',
                                        )}
                                    >
                                        <input type="radio" name="payment_method" value={value} checked={data.payment_method === value} onChange={() => setData('payment_method', value)} className="mt-0.5 size-4 accent-brand-600" />
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-900">{label}</span>
                                            <span className="mt-0.5 block text-xs text-slate-500">
                                                {value === 'cod' ? 'Pay in cash when your order arrives.' : 'Transfer to our bank account. Details are shown after you place the order.'}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </Step>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="panel bg-slate-50 p-6 lg:sticky lg:top-28">
                            <h2 className="text-lg font-bold text-slate-900">Your order</h2>
                            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pt-2 pr-1">
                                {cart.lines.map((line) => (
                                    <li key={line.id} className="flex items-center gap-3">
                                        <div className="relative size-16 shrink-0 rounded-xl border border-slate-200 bg-white">
                                            <ProductImage src={line.image_url} alt={line.name} className="size-full p-1.5" />
                                            <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-slate-700 text-[11px] font-bold text-white">{line.quantity}</span>
                                        </div>
                                        <p className="line-clamp-2 flex-1 text-sm font-medium text-slate-700">{line.name}</p>
                                        <p className="text-sm font-semibold whitespace-nowrap text-slate-900">{money(line.total)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <OrderSummary cart={cart} />
                            </div>
                            <button disabled={processing} className="btn-primary mt-6 w-full !py-3.5">
                                {processing && <Loader2 className="size-4 animate-spin" />}
                                {processing ? 'Placing order…' : `Place order · ${money(cart.total)}`}
                            </button>
                            <p className="mt-4 text-center text-xs text-slate-500">By placing your order you agree to our terms and return policy.</p>
                        </div>
                    </div>
                </form>
            </div>
        </ShopLayout>
    );
}
