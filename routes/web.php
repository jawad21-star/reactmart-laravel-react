<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/category/{category}', [ShopController::class, 'category'])->name('category.show');
Route::get('/product/{product}', [ShopController::class, 'show'])->name('products.show');

Route::prefix('cart')->name('cart.')->controller(CartController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/add/{product}', 'add')->name('add');
    Route::patch('/{productId}', 'update')->name('update');
    Route::delete('/{productId}', 'remove')->name('remove');
    Route::post('/coupon', 'applyCoupon')->name('coupon.apply');
    Route::delete('/coupon/remove', 'removeCoupon')->name('coupon.remove');
});

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store')->middleware('throttle:10,1');
Route::get('/order/{order}/thank-you', [CheckoutController::class, 'success'])->name('checkout.success');

Route::middleware('auth')->controller(AccountController::class)->group(function () {
    Route::get('/account', 'index')->name('account');
    Route::get('/account/orders/{order}', 'order')->name('account.order');
    Route::put('/account/profile', 'updateProfile')->name('account.profile');
    Route::put('/account/password', 'updatePassword')->name('account.password');
    Route::get('/account/wishlist', 'wishlist')->name('wishlist');
    Route::post('/wishlist/{product}', 'toggleWishlist')->name('wishlist.toggle');
    Route::post('/product/{product}/reviews', 'storeReview')->name('reviews.store');
});

require __DIR__.'/auth.php';
