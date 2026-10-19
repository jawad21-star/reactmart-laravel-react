# ReactMart — Laravel + React E-commerce

Laravel 13 backend with a **React 19 + TypeScript** storefront (connected through **Inertia.js**) and a **Filament 5** admin panel. Same features as the ShopNest (Laravel + Blade) and NodeMart (Next.js) projects.

## Run it

Double-click `start-shop.bat`, or:

```bash
C:\wamp64\bin\php\php8.3.28\php.exe artisan serve --port=8001
```

- Store: http://localhost:8001
- Admin: http://localhost:8001/admin

Demo logins (from `database/seeders/DatabaseSeeder.php`):

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Admin    | admin@shop.test     | password   |
| Customer | customer@shop.test  | password   |

Demo coupons: `WELCOME10` (10%), `FLAT500` (Rs. 500 off over Rs. 3,000), `MEGA25` (25% off over Rs. 10,000).

## How PHP and React talk (Inertia)

```
Browser → routes/web.php → Controller → Model ↔ Database → Inertia::render('shop/product', [...]) → React page (.tsx)
```

The controller passes data as **props**; the React page receives them as function arguments. Forms use Inertia's `useForm()` and post straight to Laravel routes — no separate API.

| Part | Where |
|------|-------|
| URLs | `routes/web.php`, `routes/auth.php` |
| Controllers | `app/Http/Controllers/` |
| Models (Eloquent) | `app/Models/` |
| Data passed to React | `app/Support/Present.php` |
| Data on every page (user, cart count, flash) | `app/Http/Middleware/HandleInertiaRequests.php` |
| Cart logic | `app/Services/Cart.php` |
| React pages | `resources/js/pages/` (`shop/`, `account/`, `auth/`) |
| React components | `resources/js/components/shop/` |
| Layouts (header/footer) | `resources/js/layouts/` |
| Admin panel | `app/Filament/` |
| Tables / demo data | `database/migrations/`, `database/seeders/` |

## Development

```bash
npm run dev          # Vite with hot reload (run alongside artisan serve)
npm run build        # production assets (start-shop.bat does this if missing)
php artisan test     # 24 feature tests
php artisan migrate:fresh --seed   # reset demo data
```

Shop settings (name, currency, shipping fee, free-shipping threshold, phone, email) are in `.env` under `SHOP_*`. The project uses SQLite (`database/database.sqlite`); to use WAMP MySQL, set `DB_CONNECTION=mysql` and the `DB_*` values in `.env`, then run `php artisan migrate:fresh --seed`.
