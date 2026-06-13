'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Lock, User, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

// Hardcoded credentials
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = '1234';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                localStorage.setItem('isAuthenticated', 'true');
                router.push('/');
            } else {
                setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden font-cairo">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-emerald-600/10 rounded-full blur-[160px]" />
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-1000">

                {/* Left Side: Brand/Hero */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-r border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-900/40 mb-8">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-white leading-tight mb-4">
                            اكتشف القوة <br /> <span className="text-emerald-400">الرقمية</span> للحروف
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            نظام متطور لتحليل النصوص العربية واستخراج طاقاتها الرقمية باستخدام خوارزميات التفكيك الحديثة.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-5 h-5" />
                        <span>نظام آمن • معالجة فورية</span>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 lg:p-16 flex flex-col justify-center space-y-10">
                    <div className="space-y-2 lg:hidden text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white">القوة العربية</h2>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white hidden lg:block">تسجيل الدخول</h2>
                        <p className="text-slate-500 font-medium">أدخل بياناتك للوصول إلى الحاسبة الرقمية</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in shake-x duration-500">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-400 text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">اسم المستخدم</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    className="h-14 bg-white/[0.03] border-white/5 focus:border-emerald-500/50 text-white pr-12 rounded-2xl transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••"
                                    className="h-14 bg-white/[0.03] border-white/5 focus:border-emerald-500/50 text-white pr-12 rounded-2xl transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-900/30 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>جاري التحقق...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span>دخول للنظام</span>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-slate-600 text-xs font-bold uppercase tracking-widest mt-8">
                        Arabic Power Algorithm v2.0
                    </p>
                </div>
            </div>
        </div>
    );
}
