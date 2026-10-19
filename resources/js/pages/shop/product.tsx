import { ProductGrid, WishlistHeart } from '@/components/shop/product-card';
import { ProductImage } from '@/components/shop/product-image';
import { Stars } from '@/components/shop/stars';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import { cn } from '@/lib/utils';
import type { ProductCard } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { ChevronRight, Loader2, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { useState } from 'react';

type Review = { id: number; rating: number; comment: string | null; user: string; date: string };

type Product = Omit<ProductCard, 'category' | 'rating'> & {
    sku: string | null;
    short_description: string | null;
    description: string | null;
    images: string[];
    brand: { name: string; slug: string } | null;
    category: { name: string; slug: string } | null;
    rating: number;
    reviews: Review[];
};

type Props = { product: Product; related: ProductCard[]; canReview: boolean };

function Gallery({ images, alt, badge }: { images: string[]; alt: string; badge: number | null }) {
    const [active, setActive] = useState(0);

    return (
        <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                {images.length ? (
                    <img key={images[active]} src={images[active]} alt={alt} className="absolute inset-0 size-full animate-fade-up object-contain p-10" />
                ) : (
                    <ProductImage src={null} alt={alt} className="size-full" />
                )}
                {badge && <span className="absolute top-5 left-5 rounded-full bg-rose-500 px-3 py-1.5 text-sm font-bold text-white">-{badge}%</span>}
            </div>
            {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={`Show image ${i + 1}`}
                            className={cn(
                                'aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-slate-50 transition',
                                active === i ? 'border-brand-600' : 'border-transparent hover:border-slate-300',
                            )}
                        >
                            <img src={src} alt="" loading="lazy" className="size-full object-contain p-2" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Purchase({ product }: { product: Product }) {
    const [qty, setQty] = useState(1);
    const [busy, setBusy] = useState<'cart' | 'buy' | null>(null);

    const add = (buyNow: boolean) =>
        router.post(
            route('cart.add', product.slug),
            { quantity: qty, buy_now: buyNow ? 1 : 0 },
            { preserveScroll: true, onStart: () => setBusy(buyNow ? 'buy' : 'cart'), onFinish: () => setBusy(null) },
        );

    return (
        <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-slate-300">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex size-12 cursor-pointer items-center justify-center text-slate-600 hover:text-slate-900" aria-label="Decrease quantity">
                        <Minus className="size-4" />
                    </button>
                    <input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={qty}
                        aria-label="Quantity"
                        onChange={(e) => setQty(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))}
                        className="w-12 [appearance:textfield] border-0 bg-transparent text-center font-semibold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex size-12 cursor-pointer items-center justify-center text-slate-600 hover:text-slate-900" aria-label="Increase quantity">
                        <Plus className="size-4" />
                    </button>
                </div>
                <button type="button" disabled={busy !== null} onClick={() => add(false)} className="btn-primary min-w-48 flex-1 !py-3.5">
                    {busy === 'cart' ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag className="size-5" />}
                    {busy === 'cart' ? 'Adding…' : 'Add to cart'}
                </button>
                <WishlistHeart productId={product.id} slug={product.slug} className="!size-12 border border-slate-300" />
            </div>
            <button type="button" disabled={busy !== null} onClick={() => add(true)} className="btn-brand mt-3 w-full !py-3.5">
                {busy === 'buy' && <Loader2 className="size-4 animate-spin" />} Buy it now
            </button>
        </div>
    );
}

function ReviewForm({ slug }: { slug: string }) {
    const [hover, setHover] = useState(0);
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({ rating: 5, comment: '' });

    if (wasSuccessful) {
        return <p className="panel mt-8 bg-emerald-50 p-5 text-sm font-medium text-emerald-700">Thanks! Your review will appear once approved.</p>;
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post(route('reviews.store', slug), { preserveScroll: true });
            }}
            className="panel mt-8 space-y-4 p-5"
        >
            <p className="font-semibold text-slate-900">Write a review</p>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" onClick={() => setData('rating', i)} onMouseEnter={() => setHover(i)} aria-label={`${i} stars`} className="cursor-pointer">
                        <Star className={cn('size-7 transition', (hover || data.rating) >= i ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
                    </button>
                ))}
            </div>
            {errors.rating && <p className="text-xs text-rose-600">{errors.rating}</p>}
            <textarea value={data.comment} onChange={(e) => setData('comment', e.target.value)} rows={3} className="field" placeholder="Share your experience…" aria-label="Review" />
            {errors.comment && <p className="text-xs text-rose-600">{errors.comment}</p>}
            <button disabled={processing} className="btn-primary w-full">
                {processing && <Loader2 className="size-4 animate-spin" />} Submit review
            </button>
        </form>
    );
}

export default function ProductPage({ product, related, canReview }: Props) {
    const { money, shop, auth } = useShop();
    const [tab, setTab] = useState<'description' | 'shipping'>('description');

    return (
        <ShopLayout title={product.name}>
            <div className="container-shop py-8">
                <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
                    <Link href={route('home')} className="hover:text-slate-900">
                        Home
                    </Link>
                    <ChevronRight className="size-3.5" />
                    {product.category && (
                        <>
                            <Link href={route('category.show', product.category.slug)} className="hover:text-slate-900">
                                {product.category.name}
                            </Link>
                            <ChevronRight className="size-3.5" />
                        </>
                    )}
                    <span className="truncate text-slate-900">{product.name}</span>
                </nav>

                <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <Gallery images={product.images} alt={product.name} badge={product.discount_percent} />

                    <div>
                        {product.brand && (
                            <Link href={route('shop', { brands: [product.brand.slug] })} className="text-sm font-semibold tracking-wide text-brand-600 uppercase hover:text-brand-700">
                                {product.brand.name}
                            </Link>
                        )}
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            {product.reviews.length ? (
                                <>
                                    <Stars rating={product.rating} />
                                    <a href="#reviews" className="text-slate-500 hover:text-slate-900">
                                        {product.rating.toFixed(1)} · {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
                                    </a>
                                </>
                            ) : (
                                <span className="text-slate-400">No reviews yet</span>
                            )}
                            {product.sku && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-slate-500">SKU: {product.sku}</span>
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-baseline gap-3">
                            <p className="text-3xl font-extrabold text-slate-900">{money(product.price)}</p>
                            {product.discount_percent && product.compare_price && (
                                <>
                                    <p className="text-lg text-slate-400 line-through">{money(product.compare_price)}</p>
                                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-600">Save {money(product.compare_price - product.price)}</span>
                                </>
                            )}
                        </div>

                        {product.short_description && <p className="mt-5 leading-relaxed text-slate-600">{product.short_description}</p>}

                        <div className="mt-6">
                            {product.stock > 5 ? (
                                <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                                    <span className="size-2 rounded-full bg-emerald-500" /> In stock
                                </p>
                            ) : product.stock > 0 ? (
                                <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-600">
                                    <span className="size-2 animate-pulse rounded-full bg-amber-500" /> Only {product.stock} left — order soon
                                </p>
                            ) : (
                                <p className="inline-flex items-center gap-2 text-sm font-medium text-rose-600">
                                    <span className="size-2 rounded-full bg-rose-500" /> Out of stock
                                </p>
                            )}
                        </div>

                        {product.stock > 0 && <Purchase product={product} />}

                        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-3">
                            <p className="flex items-center gap-2 text-slate-600">
                                <Truck className="size-5 text-brand-600" /> 2-4 day delivery
                            </p>
                            <p className="flex items-center gap-2 text-slate-600">
                                <RotateCcw className="size-5 text-brand-600" /> 7-day returns
                            </p>
                            <p className="flex items-center gap-2 text-slate-600">
                                <ShieldCheck className="size-5 text-brand-600" /> 100% genuine
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="flex gap-6 border-b border-slate-200" role="tablist">
                                {(
                                    [
                                        ['description', 'Description'],
                                        ['shipping', 'Shipping & returns'],
                                    ] as const
                                ).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        role="tab"
                                        aria-selected={tab === key}
                                        onClick={() => setTab(key)}
                                        className={cn(
                                            '-mb-px cursor-pointer border-b-2 pb-3 text-sm font-semibold transition',
                                            tab === key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900',
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {tab === 'description' ? (
                                // Descriptions are written by store admins in the admin panel.
                                <div className="prose-shop pt-5 text-sm" dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />
                            ) : (
                                <div className="prose-shop pt-5 text-sm">
                                    <p>Orders are dispatched within 24 hours and delivered in 2-4 working days across Pakistan.</p>
                                    <ul>
                                        <li>
                                            Free delivery on orders over {money(shop.free_shipping_over)}, otherwise {money(shop.shipping_fee)}.
                                        </li>
                                        <li>Cash on delivery available nationwide.</li>
                                        <li>Easy 7-day returns on unused items in original packaging.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section id="reviews" className="mt-20 scroll-mt-28 border-t border-slate-200 pt-12">
                    <div className="grid gap-10 lg:grid-cols-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Customer reviews</h2>
                            <div className="mt-4 flex items-center gap-3">
                                <p className="text-5xl font-extrabold text-slate-900">{product.rating.toFixed(1)}</p>
                                <div>
                                    <Stars rating={product.rating} size="size-5" />
                                    <p className="mt-1 text-sm text-slate-500">Based on {product.reviews.length} reviews</p>
                                </div>
                            </div>
                            {!auth.user ? (
                                <p className="mt-8 text-sm text-slate-500">
                                    <Link href={route('login')} className="font-semibold text-brand-600 hover:underline">
                                        Sign in
                                    </Link>{' '}
                                    to write a review.
                                </p>
                            ) : canReview ? (
                                <ReviewForm slug={product.slug} />
                            ) : (
                                <p className="mt-8 text-sm text-slate-500">Thanks — you&apos;ve already reviewed this product.</p>
                            )}
                        </div>

                        <div className="space-y-4 lg:col-span-2">
                            {product.reviews.length === 0 && <div className="panel px-6 py-12 text-center text-sm text-slate-500">No reviews yet. Be the first to review this product!</div>}
                            {product.reviews.map((review) => (
                                <div key={review.id} className="panel p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">{review.user.charAt(0).toUpperCase()}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{review.user}</p>
                                                <p className="text-xs text-slate-400">{review.date}</p>
                                            </div>
                                        </div>
                                        <Stars rating={review.rating} />
                                    </div>
                                    {review.comment && <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold text-slate-900">You may also like</h2>
                        <div className="mt-8">
                            <ProductGrid products={related} />
                        </div>
                    </section>
                )}
            </div>
        </ShopLayout>
    );
}
