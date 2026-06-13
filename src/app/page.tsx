'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ArabicInput from '@/components/calculator/ArabicInput';
import ResultView from '@/components/calculator/ResultView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculate';
import { calculatePowerAction } from './actions';
import { useRouter } from 'next/navigation';
import { Sparkles, LogOut, Calculator } from 'lucide-react';
import { useTransition } from 'react';

function HomePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!text.trim()) {
      setError('الرجاء إدخال نص عربي');
      return;
    }

    startTransition(async () => {
      const response = await calculatePowerAction(text);
      
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'حدث خطأ في الحساب');
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-cairo selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Navigation Bar */}
        <header className="flex justify-between items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tight">
                القوة العربية
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Ancient Wisdom • Modern Code</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-xl px-6"
          >
            تسجيل الخروج
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Input */}
          <section className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">كبّر كلماتك وقِس <span className="text-sky-400">قوتها الرقمية</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                استخدم خوارزميتنا المتقدمة لتحليل النصوص العربية وتفكيكها إلى عناصرها الأولية، وحساب قيمتها الرقمية المختزلة.
              </p>
            </div>

            <Card className="glass border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-sky-400" />
                  <CardTitle className="text-lg">لوحة الإدخال</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ArabicInput value={text} onChange={setText} />

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in shake-x duration-500">
                    <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleCalculate}
                  className="w-full h-14 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-sky-900/40 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 group"
                  disabled={!text.trim() || isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري معالجة البيانات...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>بدء الحساب الرقمي</span>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-white mb-1">١٠٠٪</div>
                <div className="text-xs text-slate-500 font-semibold uppercase">دقة الحساب</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-white mb-1">لحظي</div>
                <div className="text-xs text-slate-500 font-semibold uppercase">سرعة المعالجة</div>
              </div>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="lg:col-span-7 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            {result ? (
              <ResultView result={result} />
            ) : (
              <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-6 group">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                  <Calculator className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-center text-lg max-w-xs font-medium">أدخل نصاً في جهة اليمين لرؤية التحليل التفصيلي هنا</p>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} مشروع القوة العربية • تم التصميم بأحدث التقنيات</p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
