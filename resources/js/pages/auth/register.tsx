import { useShop } from '@/hooks/use-shop';
import ShopLayout from '@/layouts/shop-layout';
import { cn } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export default function Register() {
    const { shop } = useShop();
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const input = (name: keyof typeof data, label: string, type = 'text', autoComplete?: string) => (
        <div>
            <label className="field-label" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                required
                autoComplete={autoComplete}
                className={cn('field', errors[name] && '!border-rose-400')}
            />
            {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
        </div>
    );

    return (
        <ShopLayout title="Create account">
            <div className="container-shop flex justify-center py-16">
                <div className="w-full max-w-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
                        <p className="mt-2 text-slate-500">Join {shop.name} for exclusive deals.</p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
                        }}
                        className="panel mt-8 space-y-5 p-8 shadow-xl shadow-slate-200/50"
                    >
                        {input('name', 'Full name', 'text', 'name')}
                        {input('email', 'Email', 'email', 'email')}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {input('password', 'Password', 'password', 'new-password')}
                            {input('password_confirmation', 'Confirm', 'password', 'new-password')}
                        </div>
                        <button disabled={processing} className="btn-primary w-full !py-3">
                            {processing && <Loader2 className="size-4 animate-spin" />} Create account
                        </button>
                        <p className="text-center text-sm text-slate-500">
                            Already registered?{' '}
                            <Link href={route('login')} className="font-semibold text-brand-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </ShopLayout>
    );
}
