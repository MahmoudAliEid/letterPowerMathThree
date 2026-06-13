'use server';

import { calculateArabicPower, CalculationResult } from '@/lib/calculate';

/**
 * Server action to perform the heavy calculation on the server.
 * Delegates to the new 5-step engine (calculate_v2) via calculate.ts.
 */
export async function calculatePowerAction(
  text: string
): Promise<{ success: boolean; data?: CalculationResult; error?: string }> {
  try {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Input is required' };
    }

    const result = calculateArabicPower(text);
    return { success: true, data: result };
  } catch (err) {
    console.error('Calculation Action Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'حدث خطأ أثناء المعالجة',
    };
  }
}
