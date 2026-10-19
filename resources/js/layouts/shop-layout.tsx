import { useShop } from '@/hooks/use-shop';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Heart, Mail, Menu, Phone, Search, ShoppingBag, Truck, User, X } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

export function Logo({ dark = false }: { dark?: boolean }) {
    const { shop } = useShop();
    return (
        <Link href={route('home')} className={`flex items-center gap-2 text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/30">
                <ShoppingBag className="size-5" />
            </span>
            {shop.name}
        </Link>
    );
}

function SearchBox({ className, onDone }: { className?: string; onDone?: () => void }) {
    const initial = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') ?? '') : '';
    const [q, setQ] = useState(initial);

    function submit(e: FormEvent) {
        e.preventDefault();
        router.get(route('shop'), q.trim() ? { q: q.trim() } : {});
        onDone?.();
    }

    return (
        <form onSubmit={submit} className={className}>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
        </form>
    );
}

function Header() {
    const { navCategories, cartCount, auth } = useShop();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const close = () => setMenuOpen(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
            <div className="container-shop flex h-16 items-center gap-4 lg:h-[72px]">
                <button className="btn-ghost -ml-2 !p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                    <Menu className="size-6" />
                </button>
                <Logo />

                <nav className="ml-4 hidden items-center gap-0.5 whitespace-nowrap lg:flex">
                    <Link href={route('shop')} className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Shop all
                    </Link>
                    {navCategories.slice(0, 4).map((c, i) => (
                        <Link
                            key={c.id}
                            href={route('category.show', c.slug)}
                            className={`rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 ${i >= 2 ? 'hidden xl:inline-flex' : ''}`}
                        >
                            {c.name}
                        </Link>
                    ))}
                </nav>

                <SearchBox className="relative ml-auto hidden w-full max-w-xs md:block" />

                <div className="ml-auto flex items-center gap-1 md:ml-2">
                    <button className="btn-ghost !p-2.5 md:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
                        <Search className="size-5" />
                    </button>
                    {auth.user && (
                        <Link href={route('wishlist')} className="btn-ghost hidden !p-2.5 sm:inline-flex" aria-label="Wishlist">
                            <Heart className="size-5" />
                        </Link>
                    )}
                    <Link href={auth.user ? route('account') : route('login')} className="btn-ghost !p-2.5" aria-label="Account">
                        <User className="size-5" />
                    </Link>
                    <Link href={route('cart.index')} className="btn-ghost relative !p-2.5" aria-label="Cart">
                        <ShoppingBag className="size-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] leading-5 font-bold text-white ring-2 ring-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {searchOpen && (
                <div className="border-t border-slate-100 md:hidden">
                    <div className="container-shop py-3">
                        <SearchBox className="relative" onDone={() => setSearchOpen(false)} />
                    </div>
                </div>
            )}

            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50" onClick={close} />
                    <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] animate-slide-in flex-col bg-white shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                            <Logo />
                            <button className="btn-ghost -mr-2 !p-2" onClick={close} aria-label="Close menu">
                                <X className="size-6" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-3" onClick={(e) => (e.target as HTMLElement).closest('a') && close()}>
                            <Link href={route('shop')} className="flex items-center justify-between rounded-xl px-3 py-3 font-semibold hover:bg-slate-50">
                                Shop all <ChevronRight className="size-4 text-slate-400" />
                            </Link>
                            {navCategories.map((c) => (
                                <Link key={c.id} href={route('category.show', c.slug)} className="flex items-center justify-between rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
                                    {c.name} <ChevronRight className="size-4 text-slate-400" />
                                </Link>
                            ))}
                            <div className="my-3 border-t border-slate-100" />
                            {auth.user ? (
                                <>
                                    <Link href={route('account')} className="block rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
                                        My account
                                    </Link>
                                    <Link href={route('wishlist')} className="block rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
                                        Wishlist
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="block rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
                                        Sign in
                                    </Link>
                                    <Link href={route('register')} className="block rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
                                        Create account
                                    </Link>
                                </>
                            )}
                        </nav>
                    </aside>
                </div>
            )}
        </header>
    );
}

function Footer() {
    const { navCategories, shop } = useShop();

    return (
        <footer className="mt-24 bg-slate-950 text-slate-400">
            <div className="container-shop grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <Logo dark />
                    <p className="mt-4 max-w-sm text-sm leading-relaxed">
                        Your one-stop shop for electronics, fashion, beauty and home essentials. Genuine products, fast delivery and easy returns.
                    </p>
                    <div className="mt-5 space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                            <Phone className="size-4" /> {shop.phone}
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="size-4" /> {shop.email}
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">Shop</h4>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {navCategories.slice(0, 5).map((c) => (
                            <li key={c.id}>
                                <Link href={route('category.show', c.slug)} className="transition hover:text-white">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">Account</h4>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        <li>
                            <Link href={route('account')} className="transition hover:text-white">
                                My account
                            </Link>
                        </li>
                        <li>
                            <Link href={route('account')} className="transition hover:text-white">
                                Order history
                            </Link>
                        </li>
                        <li>
                            <Link href={route('wishlist')} className="transition hover:text-white">
                                Wishlist
                            </Link>
                        </li>
                        <li>
                            <Link href={route('cart.index')} className="transition hover:text-white">
                                Cart
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">Newsletter</h4>
                    <p className="mt-4 text-sm">Get exclusive deals and new arrivals in your inbox.</p>
                    <form
                        className="mt-4 flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.currentTarget.reset();
                            toast.success('Thanks for subscribing!');
                        }}
                    >
                        <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            aria-label="Email address"
                            className="w-full min-w-0 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                        />
                        <button className="btn-brand shrink-0 !px-4">Join</button>
                    </form>
                </div>
            </div>
            <div className="border-t border-slate-800">
                <div className="container-shop flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
                    </p>
                    <p>Cash on Delivery · Bank Transfer</p>
                </div>
            </div>
        </footer>
    );
}

/** Shows session flash messages (from `back()->with('success', ...)`) as toasts. */
function FlashToasts() {
    const { flash } = useShop();

    useEffect(() => {
        if (!flash) return;
        if (flash.type === 'error') toast.error(flash.message);
        else
            toast.success(flash.message, {
                action: flash.message.includes('added to cart') ? { label: 'View cart', onClick: () => router.visit(route('cart.index')) } : undefined,
            });
        // The key changes for every new message, even when the text repeats.
    }, [flash?.key]); // eslint-disable-line react-hooks/exhaustive-deps

    return <Toaster position="bottom-right" richColors closeButton />;
}

export default function ShopLayout({ title, children }: { title?: string; children: ReactNode }) {
    const { shop } = useShop();

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-800">
            <Head title={title} />
            <div className="bg-slate-900 text-white">
                <div className="container-shop flex h-9 items-center justify-center gap-2 text-xs font-medium sm:justify-between">
                    <p className="flex items-center gap-2">
                        <Truck className="size-4" /> Free delivery on orders over {shop.currency} {shop.free_shipping_over.toLocaleString('en-US')}
                    </p>
                    <p className="hidden items-center gap-4 text-slate-300 sm:flex">
                        <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5" /> {shop.phone}
                        </span>
                        <span>
                            Use code <strong className="text-white">WELCOME10</strong> for 10% off
                        </span>
                    </p>
                </div>
            </div>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FlashToasts />
        </div>
    );
}
