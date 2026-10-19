import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

/** Shared page props plus a money formatter using the shop's currency. */
export function useShop() {
    const props = usePage<SharedData>().props;

    const money = (amount: number | null | undefined) => `${props.shop.currency} ${Math.round(amount ?? 0).toLocaleString('en-US')}`;

    return { ...props, money };
}
