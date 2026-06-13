'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculate';
import {
  Trophy,
  FileText,
  Calculator,
  ChevronRight,
  Sparkles,
  Hash,
  Sigma,
  Divide,
} from 'lucide-react';

interface ResultViewProps {
  result: CalculationResult | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const STEP_COLORS = [
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

const STEP_GLOWS = [
  'shadow-emerald-500/20',
  'shadow-violet-500/20',
  'shadow-sky-500/20',
  'shadow-amber-500/20',
  'shadow-rose-500/20',
];

const STEP_BADGE_LABELS = ['١', '٢', '٣', '٤', '٥'];

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 px-1">
      <div
        className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${STEP_COLORS[step - 1]} flex items-center justify-center text-white font-black text-sm shadow-lg ${STEP_GLOWS[step - 1]}`}
      >
        {STEP_BADGE_LABELS[step - 1]}
      </div>
      <div>
        <h3 className="text-base font-bold tracking-tight leading-snug">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ResultView({ result }: ResultViewProps) {
  if (!result) return null;

  // letters[0] has index=1 (first letter in reading order = rightmost in RTL display).
  // Using natural array order inside dir="rtl" container gives correct visual display.
  const lettersDisplay = result.letters;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ══════════════════════════════════════════════════════════
          HERO: Final Single Digit
          ══════════════════════════════════════════════════════════ */}
      <Card className="glass overflow-hidden border-rose-500/20 shadow-[0_0_60px_rgba(244,63,94,0.12)] relative group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-500/20 to-transparent blur-2xl pointer-events-none" />
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-slate-500">
              الرقم النهائي المختزل
            </span>
          </div>
          <CardTitle className="text-xl font-bold text-white">الخطوة الخامسة — النتيجة</CardTitle>
        </CardHeader>
        <CardContent className="pb-10 pt-2">
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-rose-500/15 blur-[120px] rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000 pointer-events-none" />
            <span className="text-[11rem] font-black leading-none bg-gradient-to-b from-white via-rose-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-in zoom-in duration-700">
              {result.reductionResult.displayResult}
            </span>
          </div>
          {/* Paired reduction chain: divisionResult → step1 → step2 → ... → finalResult */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap" dir="ltr">
            {/* Raw division result (truncated if very long) */}
            <span className="text-sm font-mono text-slate-400">
              {result.divisionResult.length > 18
                ? result.divisionResult.slice(0, 8) + '…' + result.divisionResult.slice(-4)
                : result.divisionResult}
            </span>
            {result.reductionResult.reductionSteps.map((step, i) => {
              const isLast = i === result.reductionResult.reductionSteps.length - 1;
              const label  = step.frac !== null ? `${step.int}.${step.frac}` : `${step.int}`;
              return (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span
                    className={`font-black font-mono ${
                      isLast ? 'text-rose-400 text-xl' : 'text-slate-300 text-sm'
                    }`}
                  >
                    {label}
                  </span>
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════
          STEP 1+2: Positional Indices (×4)
          ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <StepHeader
          step={1}
          title="الترقيم من اليمين إلى اليسار"
          subtitle="كل حرف يأخذ رتبته (1، 2، 3…) بدءاً من اليمين"
        />
        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center gap-3" dir="rtl">
              {lettersDisplay.map((entry, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 group">
                  {/* Character */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-all duration-300">
                    {entry.char}
                  </div>
                  {/* Index */}
                  <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors" dir="ltr">
                    {entry.index}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-[0.65rem] text-slate-600 mt-5 font-medium">
              إجمالي الحروف (N) ={' '}
              <span className="text-emerald-400 font-black">{result.letterCount}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STEP 2: Positional Weight = Index × 4
          ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <StepHeader
          step={2}
          title="الوزن الموقعي = الرتبة × 4"
          subtitle="كل رتبة تُضرب في الثابت 4"
        />
        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center gap-3" dir="rtl">
              {lettersDisplay.map((entry, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 group">
                  {/* Character */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white group-hover:bg-violet-500/10 group-hover:border-violet-500/30 group-hover:text-violet-300 transition-all duration-300">
                    {entry.char}
                  </div>
                  {/* Calculation */}
                  <span className="text-[0.6rem] font-bold text-slate-500" dir="ltr">
                    {entry.index} × 4
                  </span>
                  {/* Weight */}
                  <span className="text-sm font-black text-violet-400" dir="ltr">
                    {entry.positionalWeight}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STEP 3: Cumulative Character Weights
          ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <StepHeader
          step={3}
          title="الوزن التراكمي لكل حرف"
          subtitle="مجموع الأوزان الموقعية (خطوة ٢) لكل مرة ظهر فيها الحرف"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {result.cumulativeWeights.map((cum, idx) => (
            <Card
              key={idx}
              className="glass border-white/5 hover:border-sky-500/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/5 transition-colors duration-500" />
              <CardContent className="p-4 space-y-3 relative">
                {/* Character */}
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black text-white group-hover:text-sky-300 transition-colors duration-300">
                    {cum.char}
                  </span>
                  <span className="text-2xl font-black text-sky-400">{cum.cumulativeWeight}</span>
                </div>
                {/* Breakdown */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wider">
                    الأوزان الموقعية
                  </p>
                  <p className="text-xs font-mono text-slate-400" dir="ltr">
                    {cum.positionalWeights.join(' + ')} = {cum.cumulativeWeight}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STEP 4: Cross Multiplication & Grand Total
          ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <StepHeader
          step={4}
          title="الضرب التقاطعي والمجموع الكلي"
          subtitle="لكل موقع: الوزن الموقعي × الوزن التراكمي للحرف"
        />
        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6">
            {/* Cross products as equation */}
            <div
              className="flex flex-wrap justify-center items-center gap-x-3 gap-y-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5"
              dir="rtl"
            >
              {result.crossProducts.map((cp, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1 group">
                    <span className="text-[0.6rem] font-bold text-slate-500">
                      {cp.char}
                    </span>
                    <div className="text-[0.6rem] text-slate-500 font-mono" dir="ltr">
                      {cp.positionalWeight}×{cp.cumulativeWeight}
                    </div>
                    <div className="px-2.5 h-9 min-w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm shadow-inner group-hover:scale-110 group-hover:border-amber-500/50 transition-all duration-300">
                      {cp.product}
                    </div>
                  </div>
                  {i < result.crossProducts.length - 1 && (
                    <span className="text-slate-700 font-black text-base self-end pb-2">+</span>
                  )}
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Sigma className="w-4 h-4 text-amber-400" />
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">
                  المجموع الكلي
                </span>
              </div>
              <div className="text-5xl font-black text-white bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-8 py-3 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
                {result.grandTotal}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STEP 5: Division & Digit Root
          ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <StepHeader
          step={5}
          title="القسمة والاختزال الرقمي"
          subtitle={`${result.grandTotal} ÷ ${result.letterCount} → اختزال متكرر حتى رقم واحد`}
        />
        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Division */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Divide className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  القسمة الدقيقة (بدون تقريب)
                </span>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
                <span className="font-mono font-bold text-slate-300 text-lg" dir="ltr">
                  {result.grandTotal} ÷ {result.letterCount} ={' '}
                  <span className="text-rose-300">{result.divisionResult}</span>
                </span>
              </div>
            </div>

            {/* Paired digit-root reduction */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  الاختزال الرقمي المزدوج
                </span>
              </div>

              {/* Digit-sum breakdown for each segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Integer segment */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-[0.6rem] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    جمع أرقام الجزء الصحيح
                  </p>
                  <span className="font-mono text-slate-300 text-xs" dir="ltr">
                    {(() => {
                      const intPart = result.divisionResult.split('.')[0].replace(/[^0-9]/g, '');
                      const digits  = intPart.split('');
                      const sum     = digits.reduce((a, d) => a + parseInt(d, 10), 0);
                      return digits.length <= 12
                        ? `${digits.join(' + ')} = ${sum}`
                        : `${digits.slice(0, 6).join(' + ')} + … = ${sum}`;
                    })()}
                  </span>
                </div>

                {/* Fractional segment */}
                {result.reductionResult.fracFinalResult !== null && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[0.6rem] font-bold text-slate-600 uppercase tracking-wider mb-2">
                      جمع أرقام الجزء العشري
                    </p>
                    <span className="font-mono text-slate-300 text-xs" dir="ltr">
                      {(() => {
                        const fracPart = (result.divisionResult.split('.')[1] ?? '').replace(/[^0-9]/g, '');
                        const digits   = fracPart.split('');
                        const sum      = digits.reduce((a, d) => a + parseInt(d, 10), 0);
                        return digits.length <= 12
                          ? `${digits.join(' + ')} = ${sum}`
                          : `${digits.slice(0, 6).join(' + ')} + … (${digits.length} أرقام) = ${sum}`;
                      })()}
                    </span>
                  </div>
                )}
              </div>

              {/* Step-by-step paired reduction chain */}
              <div className="flex flex-col items-center gap-2 pt-2">
                {result.reductionResult.reductionSteps.map((step, i, arr) => {
                  const isLast = i === arr.length - 1;
                  const label  = step.frac !== null ? `${step.int}.${step.frac}` : `${step.int}`;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span
                        className={`font-black font-mono transition-all ${
                          isLast
                            ? 'text-5xl text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                            : 'text-2xl text-slate-300'
                        }`}
                      >
                        {label}
                      </span>
                      {!isLast && (
                        <div className="flex flex-col items-center gap-0.5 text-slate-600">
                          <ChevronRight className="w-3 h-3 rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Edge case: no reduction needed (already single digits) */}
                {result.reductionResult.reductionSteps.length === 0 && (
                  <span className="font-black font-mono text-5xl text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                    {result.reductionResult.displayResult}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Summary Cards
          ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normalized text */}
        <Card className="glass border-white/5 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              النص الموحد
            </CardTitle>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
              <p className="text-2xl font-bold text-center text-sky-200 tracking-[0.3em] break-all" dir="rtl">
                {result.normalized.split('').join(' ')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Numeric summary */}
        <Card className="glass border-white/5 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              ملخص الحساب
            </CardTitle>
            <div className="w-2 h-2 rounded-full bg-purple-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'النص الأصلي', value: result.original, rtl: true, color: 'text-slate-300' },
              { label: 'عدد الحروف (N)', value: result.letterCount, color: 'text-emerald-400' },
              { label: 'المجموع الكلي (خطوة ٤)', value: result.grandTotal, color: 'text-amber-400' },
              { label: 'ناتج القسمة', value: result.divisionResult, color: 'text-rose-300 font-mono text-xs' },
              { label: 'الرقم النهائي', value: result.reductionResult.displayResult, color: 'text-white font-black text-xl' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span className="text-xs font-bold text-slate-500">{item.label}</span>
                <span
                  className={`${item.color} break-all text-right ml-4`}
                  dir={'rtl' in item && item.rtl ? 'rtl' : 'ltr'}
                >
                  {String(item.value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sparkle footer note */}
      <div className="flex items-center justify-center gap-2 text-slate-600 text-xs pb-4">
        <Sparkles className="w-3 h-3" />
        <span>تم الحساب باستخدام دقة علمية كاملة — بدون تقريب (Arbitrary-Precision)</span>
        <Sparkles className="w-3 h-3" />
      </div>
    </div>
  );
}
