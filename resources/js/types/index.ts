import { LucideIcon } from 'lucide-react';

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    avatar?: string;
    [key: string]: unknown;
}

export interface Auth {
    user: User | null;
    wishlist: number[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface Shop {
    name: string;
    currency: string;
    shipping_fee: number;
    free_shipping_over: number;
    phone: string;
    email: string;
}

export interface Flash {
    type: 'success' | 'error';
    message: string;
    key: string;
}

export interface NavCategory {
    id: number;
    name: string;
    slug: string;
}

/** Props every page receives from HandleInertiaRequests. */
export interface SharedData {
    shop: Shop;
    auth: Auth;
    cartCount: number;
    navCategories: NavCategory[];
    flash: Flash | null;
    errors: Record<string, string>;
    [key: string]: unknown;
}

export interface ProductCard {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price: number | null;
    discount_percent: number | null;
    stock: number;
    image_url: string | null;
    category: string | null;
    rating: number | null;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    products_count: number | null;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
}

export interface OrderItem {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
    slug: string | null;
    image_url: string | null;
}

export interface Order {
    id: number;
    order_number: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    status_label: string;
    payment_method: string;
    payment_method_label: string;
    payment_status: string;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    coupon_code: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    address: string;
    city: string;
    postal_code: string | null;
    created_at: string;
    items_count: number | null;
    items?: OrderItem[];
}

export interface CartLine {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    price: number;
    stock: number;
    quantity: number;
    total: number;
}

export interface CartSummary {
    lines: CartLine[];
    count: number;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    coupon: string | null;
    couponError: string | null;
}

/** Laravel's LengthAwarePaginator as JSON. */
export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
