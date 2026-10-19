import { useShop } from '@/hooks/use-shop';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, LayoutDashboard, LogOut, Package } from 'lucide-react';
import type { ReactNode } from 'react';
import ShopLayout from './shop-layout';

export default function AccountLayout({ title, children }: { title: string; children: ReactNode }) {
    const { auth } = useShop();
    const { url } = usePage();
    const user = auth.user!;

    const item = (active: boolean) =>
        cn('flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium transition', active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50');

    return (
        <ShopLayout title={title}>
            <div className="container-shop py-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                <div className="mt-8 flex flex-col gap-8 lg:flex-row">
                    <aside className="lg:w-60 lg:shrink-0">
                        <div className="panel p-5">
                            <div className="flex items-center gap-3">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <nav className="mt-5 space-y-1 text-sm">
                                <Link href={route('account')} className={item(url === '/account' || url.startsWith('/account/orders') || url.startsWith('/account?'))}>
                                    <Package className="size-4" /> Orders & profile
                                </Link>
                                <Link href={route('wishlist')} className={item(url.startsWith('/account/wishlist'))}>
                                    <Heart className="size-4" /> Wishlist
                                </Link>
                                {user.is_admin && (
                                    // Filament is a separate (non-Inertia) app, so use a normal link.
                                    <a href="/admin" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium text-brand-600 hover:bg-brand-50">
                                        <LayoutDashboard className="size-4" /> Admin panel
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => router.post(route('logout'))}
                                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <LogOut className="size-4" /> Sign out
                                </button>
                            </nav>
                        </div>
                    </aside>
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </ShopLayout>
    );
}
