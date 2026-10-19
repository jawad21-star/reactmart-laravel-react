<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Product;
use App\Services\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private Cart $cart) {}

    public function index(): Response
    {
        return Inertia::render('shop/cart', ['cart' => self::summary($this->cart)]);
    }

    public function add(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        if (! $product->in_stock) {
            return back()->with('error', 'Sorry, this product is out of stock.');
        }

        $this->cart->add($product, (int) $request->input('quantity', 1));

        if ($request->boolean('buy_now')) {
            return redirect()->route('checkout');
        }

        return back()->with('success', "{$product->name} added to cart.");
    }

    public function update(Request $request, int $productId): RedirectResponse
    {
        $this->cart->update($productId, (int) $request->input('quantity'));

        return back();
    }

    public function remove(int $productId): RedirectResponse
    {
        $this->cart->remove($productId);

        return back()->with('success', 'Item removed from cart.');
    }

    public function applyCoupon(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string', 'max:50']]);

        $coupon = Coupon::where('code', strtoupper(trim($request->input('code'))))->first();

        if (! $coupon) {
            return back()->withErrors(['code' => 'Invalid coupon code.']);
        }

        if ($error = $coupon->validationError($this->cart->subtotal())) {
            return back()->withErrors(['code' => $error]);
        }

        $this->cart->applyCoupon($coupon);

        return back()->with('success', "Coupon {$coupon->code} applied.");
    }

    public function removeCoupon(): RedirectResponse
    {
        $this->cart->removeCoupon();

        return back();
    }

    /** Cart contents and totals as page props (shared by the cart and checkout pages). */
    public static function summary(Cart $cart): array
    {
        $coupon = $cart->coupon();

        return [
            'lines' => $cart->lines()->map(fn ($line) => [
                'id' => $line->product->id,
                'name' => $line->product->name,
                'slug' => $line->product->slug,
                'image_url' => $line->product->image_url,
                'price' => (float) $line->product->price,
                'stock' => $line->product->stock,
                'quantity' => $line->quantity,
                'total' => $line->total,
            ])->values(),
            'count' => $cart->count(),
            'subtotal' => $cart->subtotal(),
            'discount' => $cart->discount(),
            'shipping' => $cart->shipping(),
            'total' => $cart->total(),
            'coupon' => $coupon?->code,
            'couponError' => $coupon?->validationError($cart->subtotal()),
        ];
    }
}
