import { useShop } from '@/hooks/use-shop';
import { cn } from '@/lib/utils';
import type { ProductCard as Product } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Heart, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { ProductImage } from './product-image';
import { Stars } from './stars';

export function WishlistHeart({ productId, slug, className }: { productId: number; slug: string; className?: string }) {
    const { auth } = useShop();
    const active = auth.wishlist.includes(productId);

    if (!auth.user) return null;

    return (
        <button
            type="button"
            onClick={() => router.post(route('wishlist.toggle', slug), {}, { preserveScroll: true })}
            aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={active}
            className={cn(
                'flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:text-rose-500',
                active ? 'text-rose-500' : 'text-slate-500',
                className,
            )}
        >
            <Heart className={cn('size-5', active && 'fill-current')} />
        </button>
    );
}

export function AddToCartIcon({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false);

    return (
        <button
            type="button"
            disabled={loading}
            aria-label={`Add ${product.name} to cart`}
            onClick={() =>
                router.post(
                    route('cart.add', product.slug),
                    { quantity: 1 },
                    { preserveScroll: true, onStart: () => setLoading(true), onFinish: () => setLoading(false) },
                )
            }
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
        </button>
    );
}

export function ProductCard({ product }: { product: Product }) {
    const { money } = useShop();
    const href = route('products.show', product.slug);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
            <Link href={href} className="relative block aspect-square overflow-hidden bg-slate-50">
                <ProductImage src={product.image_url} alt={product.name} className="size-full p-6 transition duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.discount_percent && <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">-{product.discount_percent}%</span>}
                    {product.stock < 1 && <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white">Sold out</span>}
                </div>
            </Link>

            <WishlistHeart productId={product.id} slug={product.slug} className="absolute top-3 right-3" />

            <div className="flex flex-1 flex-col p-4">
                {product.category && <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">{product.category}</p>}
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                    <Link href={href} className="hover:text-brand-600">
                        {product.name}
                    </Link>
                </h3>

                {product.rating ? (
                    <div className="mt-1.5 flex items-center gap-1.5">
                        <Stars rating={product.rating} size="size-3.5" />
                        <span className="text-xs text-slate-400">{product.rating.toFixed(1)}</span>
                    </div>
                ) : null}

                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <div>
                        <p className="text-base font-bold text-slate-900">{money(product.price)}</p>
                        {product.discount_percent && <p className="text-xs text-slate-400 line-through">{money(product.compare_price)}</p>}
                    </div>
                    {product.stock > 0 && <AddToCartIcon product={product} />}
                </div>
            </div>
        </article>
    );
}

export function ProductGrid({ products, columns = 'lg:grid-cols-4' }: { products: Product[]; columns?: string }) {
    return (
        <div className={cn('grid grid-cols-2 gap-4 sm:gap-6', columns)}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
