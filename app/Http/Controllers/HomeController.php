<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\Present;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $cards = fn ($query) => $query->with('category')->withAvg('approvedReviews as rating', 'rating')->take(8)->get()->map(Present::card(...));

        return Inertia::render('shop/home', [
            'categories' => Category::active()
                ->whereNull('parent_id')
                ->withCount(['products' => fn ($q) => $q->active()])
                ->orderBy('sort_order')
                ->take(8)
                ->get()
                ->map(Present::category(...)),
            'featured' => $cards(Product::active()->where('is_featured', true)->latest()),
            'newArrivals' => $cards(Product::active()->latest()),
            'brands' => Brand::active()->orderBy('name')->get(['id', 'name', 'slug']),
            'stats' => [
                'products' => Product::active()->count(),
                'brands' => Brand::active()->count(),
            ],
        ]);
    }
}
