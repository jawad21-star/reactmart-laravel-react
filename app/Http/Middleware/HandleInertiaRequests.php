<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Services\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'shop' => [
                'name' => config('shop.name'),
                'currency' => config('shop.currency'),
                'shipping_fee' => config('shop.shipping_fee'),
                'free_shipping_over' => config('shop.free_shipping_over'),
                'phone' => config('shop.phone'),
                'email' => config('shop.email'),
            ],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => (bool) $user->is_admin,
                ] : null,
                'wishlist' => fn () => $user ? $user->wishlistIds()->all() : [],
            ],
            'cartCount' => fn () => app(Cart::class)->count(),
            'navCategories' => fn () => Category::active()
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->take(6)
                ->get(['id', 'name', 'slug']),
            // A fresh key per message lets the page show the same text twice in a row.
            'flash' => fn () => match (true) {
                $request->session()->has('success') => ['type' => 'success', 'message' => $request->session()->get('success'), 'key' => (string) Str::uuid()],
                $request->session()->has('error') => ['type' => 'error', 'message' => $request->session()->get('error'), 'key' => (string) Str::uuid()],
                default => null,
            },
        ];
    }
}
