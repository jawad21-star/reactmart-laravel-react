import ShopLayout from '@/layouts/shop-layout';

/** Used by the password reset / email verification pages from the starter kit. */
export default function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <ShopLayout>
            <div className="container-shop flex justify-center py-16">
                <div className="w-full max-w-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                        <p className="mt-2 text-slate-500">{description}</p>
                    </div>
                    <div className="panel mt-8 p-8 shadow-xl shadow-slate-200/50">{children}</div>
                </div>
            </div>
        </ShopLayout>
    );
}
