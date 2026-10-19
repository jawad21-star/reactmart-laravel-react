import { ProductGrid } from '@/components/shop/product-card';
import { ProductImage } from '@/components/shop/product-image';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import type { Brand, Category, ProductCard } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, Headphones, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';

type Props = {
    categories: Category[];
    featured: ProductCard[];
    newArrivals: ProductCard[];
    brands: Brand[];
    stats: { products: number; brands: number };
};

function SectionHeading({ title, subtitle, href, linkText = 'View all' }: { title: string; subtitle: string; href?: string; linkText?: string }) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
                <p className="mt-1 text-slate-500">{subtitle}</p>
            </div>
            {href && (
                <Link href={href} className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
                    {linkText} <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
    );
}

export default function Home({ categories, featured, newArrivals, brands, stats }: Props) {
    const { money, shop } = useShop();

    const perks = [
        { Icon: Truck, title: 'Free delivery', text: `On orders over ${money(shop.free_shipping_over)}` },
        { Icon: ShieldCheck, title: 'Secure payments', text: 'COD & bank transfer' },
        { Icon: RotateCcw, title: 'Easy returns', text: '7-day return policy' },
        { Icon: Headphones, title: '24/7 support', text: 'We are here to help' },
    ];

    return (
        <ShopLayout>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-brand-900 to-violet-900 text-white">
                <div className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-brand-500/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 -left-20 size-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />

                <div className="container-shop relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
                    <div className="animate-fade-up">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
                            <Sparkles className="size-4 text-amber-300" /> New season collection is live
                        </span>
                        <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Everything you love,
                            <br />
                            <span className="bg-gradient-to-r from-amber-200 via-pink-200 to-brand-200 bg-clip-text text-transparent">delivered to your door.</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-lg text-slate-300">
                            Discover top brands in electronics, fashion, beauty and home — with cash on delivery and easy 7-day returns.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href={route('shop')} className="btn bg-white !px-7 !py-3 text-slate-900 hover:bg-brand-50">
                                Shop now <ArrowRight className="size-4" />
                            </Link>
                            <Link href={route('shop', { sale: 1 })} className="btn border border-white/25 !px-7 !py-3 text-white hover:bg-white/10">
                                View deals
                            </Link>
                        </div>
                        <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div>
                                <dt className="text-xs text-slate-400">Products</dt>
                                <dd className="mt-1 text-2xl font-bold">{stats.products}+</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-400">Brands</dt>
                                <dd className="mt-1 text-2xl font-bold">{stats.brands}+</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-400">Delivery</dt>
                                <dd className="mt-1 text-2xl font-bold whitespace-nowrap">2-4 days</dd>
                            </div>
                        </dl>
                    </div>

                    {featured.length > 0 && (
                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                {featured.slice(0, 4).map((item, i) => (
                                    <Link
                                        key={item.id}
                                        href={route('products.show', item.slug)}
                                        style={{ animationDelay: `${150 + i * 100}ms` }}
                                        className={`group animate-fade-up rounded-3xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur transition hover:bg-white/[0.12] ${i % 2 ? 'mt-8 -mb-8' : ''}`}
                                    >
                                        <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                                            <ProductImage src={item.image_url} alt={item.name} className="size-full p-5 transition duration-500 group-hover:scale-105" />
                                        </div>
                                        <p className="mt-3 truncate text-sm font-medium">{item.name}</p>
                                        <p className="text-sm font-bold text-amber-200">{money(item.price)}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Perks */}
            <section className="border-b border-slate-100">
                <div className="container-shop grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
                    {perks.map(({ Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-3.5">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                                <Icon className="size-5" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{title}</p>
                                <p className="text-xs text-slate-500">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {categories.length > 0 && (
                <section className="container-shop pt-16">
                    <SectionHeading title="Shop by category" subtitle="Find exactly what you're looking for." href={route('shop')} linkText="All products" />
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={route('category.show', c.slug)}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50"
                            >
                                <div className="mx-auto aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                                    <ProductImage src={c.image_url} alt={c.name} className="size-full p-4 transition duration-500 group-hover:scale-110" />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-slate-900">{c.name}</p>
                                <p className="text-xs text-slate-400">{c.products_count} items</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {featured.length > 0 && (
                <section className="container-shop pt-20">
                    <SectionHeading title="Featured products" subtitle="Hand-picked favourites from our collection." href={route('shop', { sort: 'popular' })} />
                    <div className="mt-8">
                        <ProductGrid products={featured} />
                    </div>
                </section>
            )}

            {/* Promo */}
            <section className="container-shop pt-20">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 px-8 py-12 sm:px-12 lg:py-16">
                    <div className="pointer-events-none absolute -right-10 -bottom-24 size-72 rounded-full bg-white/20 blur-2xl" />
                    <div className="relative max-w-xl">
                        <p className="text-sm font-bold tracking-widest text-white/80 uppercase">Limited time offer</p>
                        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Get 25% off orders over {money(10000)}</h2>
                        <p className="mt-3 text-white/90">
                            Use code <span className="rounded-lg bg-white/25 px-2 py-0.5 font-mono font-bold">MEGA25</span> at checkout. Valid while stocks last.
                        </p>
                        <Link href={route('shop', { sale: 1 })} className="btn mt-7 bg-slate-900 !px-7 !py-3 text-white hover:bg-slate-800">
                            Shop the sale <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {newArrivals.length > 0 && (
                <section className="container-shop pt-20">
                    <SectionHeading title="New arrivals" subtitle="Fresh drops you don't want to miss." href={route('shop')} />
                    <div className="mt-8">
                        <ProductGrid products={newArrivals} />
                    </div>
                </section>
            )}

            {brands.length > 0 && (
                <section className="container-shop pt-20">
                    <h2 className="text-center text-sm font-semibold tracking-widest text-slate-400 uppercase">Top brands we carry</h2>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {brands.slice(0, 24).map((b) => (
                            <Link
                                key={b.id}
                                href={route('shop', { brands: [b.slug] })}
                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                            >
                                {b.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </ShopLayout>
    );
}
