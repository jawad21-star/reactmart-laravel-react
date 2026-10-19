<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Support\Present;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('account/index', [
            'profile' => $user->only(['name', 'email', 'phone', 'address', 'city']),
            'orders' => $user->orders()->withCount('items')->latest()->paginate(10)->through(fn (Order $order) => Present::order($order)),
        ]);
    }

    public function order(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        return Inertia::render('account/order', ['order' => Present::order($order->load('items.product'), withItems: true)]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $request->user()->update($data);

        return back()->with('success', 'Profile updated.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update(['password' => $data['password']]);

        return back()->with('success', 'Password changed.');
    }

    public function wishlist(Request $request): Response
    {
        return Inertia::render('account/wishlist', [
            'products' => $request->user()->wishlist()->active()->with('category')
                ->latest('wishlists.created_at')->get()
                ->map(fn (Product $product) => Present::card($product)),
        ]);
    }

    public function toggleWishlist(Request $request, Product $product): RedirectResponse
    {
        $added = ! empty($request->user()->wishlist()->toggle($product->id)['attached']);

        return back()->with('success', $added ? 'Added to your wishlist.' : 'Removed from your wishlist.');
    }

    public function storeReview(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $product->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [...$data, 'is_approved' => false],
        );

        return back()->with('success', 'Thanks! Your review will appear once approved.');
    }
}
