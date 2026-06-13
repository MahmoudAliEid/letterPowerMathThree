'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateArabicInput } from '@/lib/rules';
import { AlertCircle, Keyboard } from 'lucide-react';

interface ArabicInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ArabicInput({ value, onChange }: ArabicInputProps) {
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // Validate on every change
        if (newValue && !validateArabicInput(newValue)) {
            setError('يرجى إدخال أحرف عربية حصراً لنظام الحساب الرقمي');
            return;
        }

    setError('');
    onChange(newValue);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.replace(/\s+/g, '').length;

    return (
        <div className="space-y-4 font-cairo">
      <div className="flex justify-between items-end px-1">
        <label htmlFor="arabic-text" className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Keyboard className="w-3 h-3" />
          النص المستهدف
        </label>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[0.6rem] font-bold text-slate-600 uppercase tracking-widest">عدد الكلمات</span>
            <span className="text-sm font-black text-sky-400">{wordCount}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[0.6rem] font-bold text-slate-600 uppercase tracking-widest">عدد الحروف</span>
            <span className="text-sm font-black text-blue-400">{charCount}</span>
          </div>
          <span className="text-[0.6rem] h-fit self-center font-bold text-sky-500/50 uppercase border border-sky-500/10 px-2 py-0.5 rounded-full">Arabic Only</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <Textarea
          id="arabic-text"
          value={value}
          onChange={handleChange}
          placeholder="اكتب النص العربي هنا للتفكيك..."
          className="relative min-h-[160px] text-2xl font-bold bg-white/[0.02] border-white/5 focus:border-sky-500/50 text-white placeholder:text-slate-600 rounded-2xl p-6 transition-all duration-300 focus:bg-white/[0.04] resize-none leading-relaxed"
          dir="rtl"
        />
      </div>

            {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
            )}
        </div>
    );
}
