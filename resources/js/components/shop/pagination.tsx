import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';
import { Link } from '@inertiajs/react';

/** Renders Laravel paginator links (« Previous, 1, 2, …, Next »). */
export function Pagination({ paginator }: { paginator: Paginated<unknown> }) {
    if (paginator.last_page <= 1) return null;

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
            {paginator.links.map((link, i) => {
                const label = link.label.replace('&laquo; Previous', '‹').replace('Next &raquo;', '›').replace('&laquo;', '‹').replace('&raquo;', '›');
                const className = cn(
                    'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition',
                    link.active ? 'bg-slate-900 text-white' : link.url ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300',
                );

                return link.url ? (
                    <Link key={i} href={link.url} preserveScroll={false} className={className} aria-current={link.active ? 'page' : undefined}>
                        {label}
                    </Link>
                ) : (
                    <span key={i} className={className}>
                        {label}
                    </span>
                );
            })}
        </nav>
    );
}
