import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export function Stars({ rating, size = 'size-4', className }: { rating: number; size?: string; className?: string }) {
    return (
        <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn(size, i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
            ))}
        </div>
    );
}
