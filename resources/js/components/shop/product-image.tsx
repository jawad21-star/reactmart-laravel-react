import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

export function ProductImage({ src, alt, className }: { src: string | null | undefined; alt: string; className?: string }) {
    if (!src) {
        return (
            <div className={cn('flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400', className)}>
                <ShoppingBag className="size-10" />
            </div>
        );
    }

    return <img src={src} alt={alt} loading="lazy" className={cn('object-contain', className)} />;
}
