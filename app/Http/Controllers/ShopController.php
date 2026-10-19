<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\Present;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request, ?Category $category = null): Response
    {
        $query = Product::active()->with('category')->withAvg('approvedReviews as rating', 'rating');

        if ($category) {
            $query->whereIn('category_id', $category->children()->pluck('id')->push($category->id));
        }

        if ($request->filled('brands')) {
            $query->whereHas('brand', fn ($q) => $q->whereIn('slug', (array) $request->input('brands')));
        }

        if ($search = trim((string) $request->input('q'))) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('short_description', 'like', "%{$search}%")
                ->orWhere('sku', $search));
        }

        $query->when($request->filled('min'), fn ($q) => $q->where('price', '>=', (float) $request->input('min')))
            ->when($request->filled('max'), fn ($q) => $q->where('price', '<=', (float) $request->input('max')))
            ->when($request->boolean('in_stock'), fn ($q) => $q->where('stock', '>', 0))
            ->when($request->boolean('sale'), fn ($q) => $q->whereColumn('compare_price', '>', 'price'));

        match ($request->input('sort')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name' => $query->orderBy('name'),
            'popular' => $query->withSum('orderItems as sold', 'quantity')->orderByDesc('sold'),
            'rating' => $query->orderByDesc('rating'),
            default => $query->latest()->orderByDesc('id'),
        };

        return Inertia::render('shop/index', [
            'products' => $query->paginate(12)->withQueryString()->through(Present::card(...)),
            'category' => $category ? Present::category($category) : null,
            'categories' => Category::active()
                ->whereNull('parent_id')
                ->withCount(['products' => fn ($q) => $q->active()])
                ->orderBy('sort_order')
                ->get()
                ->map(Present::category(...)),
            'brands' => Brand::active()->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'q' => $request->input('q', ''),
                'min' => $request->input('min', ''),
                'max' => $request->input('max', ''),
                'in_stock' => $request->boolean('in_stock'),
                'sale' => $request->boolean('sale'),
                'sort' => $request->input('sort', 'newest'),
                'brands' => array_values((array) $request->input('brands', [])),
            ],
        ]);
    }

    public function category(Request $request, Category $category): Response
    {
        abort_unless($category->is_active, 404);

        return $this->index($request, $category);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['category', 'brand', 'approvedReviews' => fn ($q) => $q->with('user:id,name')->latest()]);

        $related = Product::active()
            ->with('category')
            ->withAvg('approvedReviews as rating', 'rating')
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(Present::card(...));

        $user = auth()->user();

        return Inertia::render('shop/product', [
            'product' => [
                ...Present::card($product),
                'sku' => $product->sku,
                'short_description' => $product->short_description,
                // Written by store admins in the admin panel.
                'description' => $product->description,
                'images' => $product->gallery_urls,
                'brand' => $product->brand?->only(['name', 'slug']),
                'category' => $product->category?->only(['name', 'slug']),
                'rating' => round((float) $product->approvedReviews->avg('rating'), 1),
                'reviews' => $product->approvedReviews->map(fn ($review) => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'user' => $review->user->name,
                    'date' => $review->created_at->diffForHumans(),
                ]),
            ],
            'related' => $related,
            'canReview' => $user && ! $product->reviews()->where('user_id', $user->id)->exists(),
        ]);
    }
}
