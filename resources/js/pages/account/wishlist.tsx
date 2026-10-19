import { ProductGrid } from '@/components/shop/product-card';
import AccountLayout from '@/layouts/account-layout';
import type { ProductCard } from '@/types';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function Wishlist({ products }: { products: ProductCard[] }) {
    return (
        <AccountLayout title="My wishlist">
            {products.length === 0 ? (
                <div className="panel flex flex-col items-center px-6 py-16 text-center">
                    <span className="flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                        <Heart className="size-7" />
                    </span>
                    <p className="mt-5 font-semibold text-slate-900">Your wishlist is empty</p>
                    <p className="mt-1 text-sm text-slate-500">Tap the heart on any product to save it here.</p>
                    <Link href={route('shop')} className="btn-primary mt-6">
                        Discover products
                    </Link>
                </div>
            ) : (
                <ProductGrid products={products} columns="xl:grid-cols-3" />
            )}
        </AccountLayout>
    );
}
