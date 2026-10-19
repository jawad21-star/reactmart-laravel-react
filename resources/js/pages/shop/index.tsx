import { Pagination } from '@/components/shop/pagination';
import { ProductGrid } from '@/components/shop/product-card';
import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import type { Brand, Category, Paginated, ProductCard } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type Filters = { q: string; min: string; max: string; in_stock: boolean; sale: boolean; sort: string; brands: string[] };

type Props = {
    products: Paginated<ProductCard>;
    category: Category | null;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
};

const SORTS = [
    ['newest', 'Newest'],
    ['popular', 'Best selling'],
    ['rating', 'Top rated'],
    ['price_asc', 'Price: low to high'],
    ['price_desc', 'Price: high to low'],
    ['name', 'Name A–Z'],
] as const;

/** Only non-empty filters go in the URL. */
function toQuery(f: Filters) {
    const query: Record<string, string | string[] | number> = {};
    if (f.q) query.q = f.q;
    if (f.min) query.min = f.min;
    if (f.max) query.max = f.max;
    if (f.in_stock) query.in_stock = 1;
    if (f.sale) query.sale = 1;
    if (f.sort && f.sort !== 'newest') query.sort = f.sort;
    if (f.brands.length) query.brands = f.brands;
    return query;
}

export default function ShopIndex({ products, category, categories, brands, filters }: Props) {
    const { shop } = useShop();
    const [form, setForm] = useState<Filters>(filters);
    const [drawer, setDrawer] = useState(false);
    const [showAllBrands, setShowAllBrands] = useState(false);

    const baseUrl = category ? route('category.show', category.slug) : route('shop');
    const heading = category?.name ?? (filters.q ? `Results for “${filters.q}”` : filters.sale ? 'On sale' : 'All products');

    const apply = (next: Filters) => {
        setDrawer(false);
        router.get(baseUrl, toQuery(next), { preserveState: true, preserveScroll: false });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        apply(form);
    };

    const toggleBrand = (slug: string) =>
        setForm((f) => ({ ...f, brands: f.brands.includes(slug) ? f.brands.filter((b) => b !== slug) : [...f.brands, slug] }));

    const visibleBrands = showAllBrands ? brands : brands.filter((b, i) => i < 8 || form.brands.includes(b.slug));

    return (
        <ShopLayout title={heading}>
            <div className="border-b border-slate-100 bg-slate-50">
                <div className="container-shop py-10">
                    <nav className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Link href={route('home')} className="hover:text-slate-900">
                            Home
                        </Link>
                        <ChevronRight className="size-3.5" />
                        <Link href={route('shop')} className="hover:text-slate-900">
                            Shop
                        </Link>
                        {category && (
                            <>
                                <ChevronRight className="size-3.5" />
                                <span className="text-slate-900">{category.name}</span>
                            </>
                        )}
                    </nav>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{heading}</h1>
                    {category?.description && <p className="mt-2 max-w-2xl text-slate-500">{category.description}</p>}
                </div>
            </div>

            <div className="container-shop py-10">
                <div className="flex gap-10">
                    {/* Filters: sidebar on desktop, drawer on mobile */}
                    <aside className={`fixed inset-0 z-50 lg:static lg:z-auto lg:block lg:w-64 lg:shrink-0 ${drawer ? 'block' : 'hidden'}`}>
                        <div className="absolute inset-0 bg-slate-900/50 lg:hidden" onClick={() => setDrawer(false)} />
                        <form onSubmit={submit} className="absolute inset-y-0 right-0 w-80 max-w-[85%] space-y-8 overflow-y-auto bg-white p-6 lg:static lg:w-auto lg:p-0">
                            <div className="flex items-center justify-between lg:hidden">
                                <h2 className="text-lg font-bold">Filters</h2>
                                <button type="button" className="btn-ghost !p-2" onClick={() => setDrawer(false)} aria-label="Close filters">
                                    <X className="size-5" />
                                </button>
                            </div>

                            {!category && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Categories</h3>
                                    <ul className="mt-3 space-y-1">
                                        {categories.map((c) => (
                                            <li key={c.id}>
                                                <Link
                                                    href={route('category.show', c.slug)}
                                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                                >
                                                    {c.name} <span className="text-xs text-slate-400">{c.products_count}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Price ({shop.currency})</h3>
                                <div className="mt-3 flex items-center gap-2">
                                    <input type="number" min={0} value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} placeholder="Min" aria-label="Minimum price" className="field !px-3 !py-2" />
                                    <span className="text-slate-400">–</span>
                                    <input type="number" min={0} value={form.max} onChange={(e) => setForm({ ...form, max: e.target.value })} placeholder="Max" aria-label="Maximum price" className="field !px-3 !py-2" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-900">Availability</h3>
                                <label className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="size-4 accent-brand-600" /> In stock only
                                </label>
                                <label className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <input type="checkbox" checked={form.sale} onChange={(e) => setForm({ ...form, sale: e.target.checked })} className="size-4 accent-brand-600" /> On sale
                                </label>
                            </div>

                            {brands.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Brands</h3>
                                    <div className="mt-3 space-y-2.5">
                                        {visibleBrands.map((b) => (
                                            <label key={b.id} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <input type="checkbox" checked={form.brands.includes(b.slug)} onChange={() => toggleBrand(b.slug)} className="size-4 accent-brand-600" /> {b.name}
                                            </label>
                                        ))}
                                    </div>
                                    {brands.length > 8 && (
                                        <button type="button" onClick={() => setShowAllBrands((v) => !v)} className="mt-3 cursor-pointer text-sm font-semibold text-brand-600">
                                            {showAllBrands ? 'Show less' : `Show all ${brands.length} brands`}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button className="btn-primary flex-1">Apply filters</button>
                                <Link href={baseUrl} className="btn-outline">
                                    Reset
                                </Link>
                            </div>
                        </form>
                    </aside>

                    {/* Results */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-slate-500">
                                Showing{' '}
                                <span className="font-semibold text-slate-900">
                                    {products.from ?? 0}–{products.to ?? 0}
                                </span>{' '}
                                of {products.total} products
                            </p>
                            <div className="flex items-center gap-2">
                                <button type="button" className="btn-outline !px-4 !py-2 lg:hidden" onClick={() => setDrawer(true)}>
                                    <SlidersHorizontal className="size-4" /> Filters
                                </button>
                                <select
                                    value={filters.sort}
                                    aria-label="Sort products"
                                    onChange={(e) => apply({ ...filters, sort: e.target.value })}
                                    className="rounded-full border border-slate-300 bg-white py-2 pr-9 pl-4 text-sm font-medium focus:border-brand-500 focus:outline-none"
                                >
                                    {SORTS.map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {products.data.length === 0 ? (
                            <div className="panel flex flex-col items-center px-6 py-20 text-center">
                                <span className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Search className="size-7" />
                                </span>
                                <h2 className="mt-5 text-lg font-semibold text-slate-900">No products found</h2>
                                <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                                <Link href={route('shop')} className="btn-primary mt-6">
                                    Browse all products
                                </Link>
                            </div>
                        ) : (
                            <>
                                <ProductGrid products={products.data} columns="xl:grid-cols-3" />
                                <Pagination paginator={products} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
