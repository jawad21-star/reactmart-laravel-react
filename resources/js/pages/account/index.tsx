import { OrderStatusBadge } from '@/components/shop/order-status-badge';
import { Pagination } from '@/components/shop/pagination';
import { useShop } from '@/hooks/use-shop';
import AccountLayout from '@/layouts/account-layout';
import { cn } from '@/lib/utils';
import type { Order, Paginated } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

type Profile = { name: string; email: string; phone: string | null; address: string | null; city: string | null };

function Input({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="field-label" htmlFor={props.id}>
                {label}
            </label>
            <input className={cn('field', error && '!border-rose-400')} {...props} />
            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
    );
}

function ProfileForm({ profile }: { profile: Profile }) {
    const { data, setData, put, processing, errors } = useForm({
        name: profile.name,
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                put(route('account.profile'), { preserveScroll: true });
            }}
            className="mt-5 grid gap-4 sm:grid-cols-2"
        >
            <Input id="name" label="Full name" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
            <Input id="phone" label="Phone" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
            <Input id="address" label="Address" value={data.address} onChange={(e) => setData('address', e.target.value)} error={errors.address} />
            <Input id="city" label="City" value={data.city} onChange={(e) => setData('city', e.target.value)} error={errors.city} />
            <div className="sm:col-span-2">
                <button disabled={processing} className="btn-primary">
                    {processing && <Loader2 className="size-4 animate-spin" />} Save changes
                </button>
            </div>
        </form>
    );
}

function PasswordForm() {
    const { data, setData, put, processing, errors, reset } = useForm({ current_password: '', password: '', password_confirmation: '' });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                put(route('account.password'), { preserveScroll: true, onSuccess: () => reset(), onError: () => reset('password', 'password_confirmation') });
            }}
            className="mt-5 grid gap-4 sm:grid-cols-3"
        >
            <Input id="current_password" label="Current password" type="password" autoComplete="current-password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} error={errors.current_password} required />
            <Input id="password" label="New password" type="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} required />
            <Input id="password_confirmation" label="Confirm new password" type="password" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
            <div className="sm:col-span-3">
                <button disabled={processing} className="btn-outline">
                    {processing && <Loader2 className="size-4 animate-spin" />} Change password
                </button>
            </div>
        </form>
    );
}

export default function AccountIndex({ profile, orders }: { profile: Profile; orders: Paginated<Order> }) {
    const { money } = useShop();

    return (
        <AccountLayout title="My account">
            <div className="space-y-8">
                <section className="panel overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="font-bold text-slate-900">Order history</h2>
                    </div>
                    {orders.data.length === 0 ? (
                        <div className="px-6 py-14 text-center">
                            <p className="text-slate-500">You haven&apos;t placed any orders yet.</p>
                            <Link href={route('shop')} className="btn-primary mt-5">
                                Start shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Order</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Items</th>
                                        <th className="px-6 py-3">Total</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.data.map((o) => (
                                        <tr key={o.id} className="hover:bg-slate-50/60">
                                            <td className="px-6 py-4 font-mono font-semibold whitespace-nowrap text-slate-900">{o.order_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-slate-500">{o.items_count}</td>
                                            <td className="px-6 py-4 font-semibold whitespace-nowrap text-slate-900">{money(o.total)}</td>
                                            <td className="px-6 py-4">
                                                <OrderStatusBadge order={o} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('account.order', o.order_number)} className="font-semibold whitespace-nowrap text-brand-600 hover:text-brand-700">
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="px-6 pb-6">
                        <Pagination paginator={orders} />
                    </div>
                </section>

                <section className="panel p-6">
                    <h2 className="font-bold text-slate-900">Profile & default address</h2>
                    <ProfileForm profile={profile} />
                </section>

                <section className="panel p-6">
                    <h2 className="font-bold text-slate-900">Password</h2>
                    <PasswordForm />
                </section>
            </div>
        </AccountLayout>
    );
}
