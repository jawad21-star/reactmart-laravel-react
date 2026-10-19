<?php

namespace Tests\Feature;

use App\Filament\Widgets\LatestOrders;
use App\Filament\Widgets\SalesChart;
use App\Filament\Widgets\StoreStats;
use App\Filament\Widgets\TopProducts;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;
use Tests\TestCase;

class ShopTest extends TestCase
{
    use RefreshDatabase;

    private function product(array $attributes = []): Product
    {
        $category = Category::create(['name' => 'Electronics', 'slug' => 'electronics']);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Test Phone',
            'slug' => 'test-phone',
            'price' => 2000,
            'stock' => 5,
            ...$attributes,
        ]);
    }

    public function test_store_pages_render_react_components(): void
    {
        $product = $this->product(['is_featured' => true]);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('shop/home')
            ->has('featured', 1)
            ->where('featured.0.name', 'Test Phone'));

        $this->get('/shop?q=phone')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('shop/index')
            ->where('products.total', 1));

        $this->get('/category/electronics')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('shop/index')
            ->where('category.slug', 'electronics'));

        $this->get(route('products.show', $product))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('shop/product')
            ->where('product.name', 'Test Phone')
            ->where('cartCount', 0));
    }

    public function test_guest_can_checkout_with_coupon(): void
    {
        $product = $this->product();
        Coupon::create(['code' => 'SAVE10', 'type' => 'percent', 'value' => 10]);

        $this->post(route('cart.add', $product), ['quantity' => 2])->assertRedirect();
        $this->post(route('cart.coupon.apply'), ['code' => 'save10'])->assertSessionHasNoErrors();

        $this->get(route('cart.index'))->assertInertia(fn (Assert $page) => $page
            ->component('shop/cart')
            ->where('cart.subtotal', 4000)
            ->where('cart.discount', 400)
            ->where('cartCount', 2));

        $this->post(route('checkout.store'), [
            'customer_name' => 'Ali Khan',
            'customer_email' => 'ali@example.com',
            'customer_phone' => '03001234567',
            'address' => '1 Mall Road',
            'city' => 'Lahore',
            'payment_method' => 'cod',
        ])->assertRedirect();

        $order = Order::with('items')->sole();
        $this->assertEquals(3850, (float) $order->total); // 4000 - 400 + 250 shipping
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertSame(1, Coupon::first()->used_count);

        $this->get(route('checkout.success', $order))->assertInertia(fn (Assert $page) => $page
            ->component('shop/success')
            ->where('order.order_number', $order->order_number)
            ->has('order.items', 1));
    }

    public function test_checkout_validation_errors_reach_the_page(): void
    {
        $this->post(route('cart.add', $this->product()));

        $this->post(route('checkout.store'), ['payment_method' => 'cod'])
            ->assertSessionHasErrors(['customer_name', 'customer_email', 'customer_phone', 'address', 'city']);
    }

    public function test_account_pages_need_login_and_show_own_orders(): void
    {
        $this->get('/account')->assertRedirect('/login');

        $user = User::factory()->create();
        $this->actingAs($user)->get('/account')->assertInertia(fn (Assert $page) => $page
            ->component('account/index')
            ->where('auth.user.email', $user->email));
    }

    public function test_cancelling_an_order_restores_stock(): void
    {
        $product = $this->product();
        $order = Order::create([
            'subtotal' => 4000, 'total' => 4000, 'customer_name' => 'A', 'customer_email' => 'a@example.com',
            'customer_phone' => '1', 'address' => 'x', 'city' => 'y',
        ]);
        $order->items()->create(['product_id' => $product->id, 'product_name' => 'Test Phone', 'price' => 2000, 'quantity' => 2, 'total' => 4000]);

        $order->update(['status' => 'cancelled']);

        $this->assertSame(7, $product->fresh()->stock);
    }

    public function test_admin_dashboard_widgets_render(): void
    {
        $product = $this->product();
        $order = Order::create([
            'subtotal' => 2000, 'total' => 2000, 'customer_name' => 'Sara', 'customer_email' => 's@example.com',
            'customer_phone' => '1', 'address' => 'x', 'city' => 'y',
        ]);
        $order->items()->create(['product_id' => $product->id, 'product_name' => 'Test Phone', 'price' => 2000, 'quantity' => 1, 'total' => 2000]);

        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();
        $this->actingAs($admin);

        Livewire::test(StoreStats::class)->assertOk()->assertSee('Revenue (this month)');
        Livewire::test(SalesChart::class)->assertOk();
        Livewire::test(LatestOrders::class)->assertOk()->assertSee($order->order_number);
        Livewire::test(TopProducts::class)->assertOk()->assertSee('Test Phone');
    }

    public function test_only_admins_can_open_the_admin_panel(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();
        $this->actingAs($admin)->get('/admin')->assertOk();
    }
}
