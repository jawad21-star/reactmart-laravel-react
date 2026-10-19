<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;

/**
 * Shapes models into the plain arrays the React pages receive as props.
 * Keeping this explicit means pages only get the fields they need.
 */
class Present
{
    public static function card(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'compare_price' => $product->compare_price ? (float) $product->compare_price : null,
            'discount_percent' => $product->discount_percent,
            'stock' => $product->stock,
            'image_url' => $product->image_url,
            'category' => $product->category?->name,
            'rating' => $product->rating ? round((float) $product->rating, 1) : null,
        ];
    }

    public static function category(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'image_url' => $category->image_url,
            'products_count' => $category->products_count ?? null,
        ];
    }

    public static function order(Order $order, bool $withItems = false): array
    {
        $data = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'status_label' => $order->status_label,
            'payment_method' => $order->payment_method,
            'payment_method_label' => $order->payment_method_label,
            'payment_status' => $order->payment_status,
            'subtotal' => (float) $order->subtotal,
            'discount' => (float) $order->discount,
            'shipping' => (float) $order->shipping,
            'total' => (float) $order->total,
            'coupon_code' => $order->coupon_code,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'address' => $order->address,
            'city' => $order->city,
            'postal_code' => $order->postal_code,
            'created_at' => $order->created_at->toIso8601String(),
            'items_count' => $order->items_count ?? null,
        ];

        if ($withItems) {
            $data['items'] = $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'total' => (float) $item->total,
                'slug' => $item->product?->slug,
                'image_url' => $item->product?->image_url,
            ])->all();
        }

        return $data;
    }
}
