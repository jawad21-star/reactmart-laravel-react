import ShopLayout from '@/layouts/shop-layout';
import { cn } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false as boolean });

    return (
        <ShopLayout title="Sign in">
            <div className="container-shop flex justify-center py-16">
                <div className="w-full max-w-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="mt-2 text-slate-500">Sign in to track orders and checkout faster.</p>
                    </div>

                    {status && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">{status}</p>}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(route('login'), { onFinish: () => reset('password') });
                        }}
                        className="panel mt-8 space-y-5 p-8 shadow-xl shadow-slate-200/50"
                    >
                        <div>
                            <label className="field-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                autoComplete="email"
                                className={cn('field', errors.email && '!border-rose-400')}
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="field-label" htmlFor="password">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="mb-1.5 text-xs font-medium text-brand-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required autoComplete="current-password" className="field" />
                            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="size-4 accent-brand-600" /> Remember me
                        </label>
                        <button disabled={processing} className="btn-primary w-full !py-3">
                            {processing && <Loader2 className="size-4 animate-spin" />} Sign in
                        </button>
                        <p className="text-center text-sm text-slate-500">
                            New here?{' '}
                            <Link href={route('register')} className="font-semibold text-brand-600 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </ShopLayout>
    );
}
