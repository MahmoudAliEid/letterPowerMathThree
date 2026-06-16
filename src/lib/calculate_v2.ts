import Decimal from 'decimal.js';
import { normalizeArabicText, removeDiacritics } from './rules';
import { digitalRoot, ReductionResult } from './reduce';

// ─────────────────────────────────────────────────────────────
// Configure Decimal.js for maximum precision
// ─────────────────────────────────────────────────────────────
Decimal.set({ precision: 100, rounding: Decimal.ROUND_HALF_UP });

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface LetterEntry {
  char: string;
  index: number;         // Step 1: 1-based position from right (1, 2, 3...)
  step3Value: number;    // Step 2 & 3: index × 4
}

export interface Step4Entry {
  char: string;
  index: number;
  step3Value: number;
  step4Value: number;    // Step 4: step3Value × step3Value
}

export interface CalculationResultV2 {
  // Input
  original: string;
  normalized: string;
  letterCount: number;          // N

  // Step 1, 2, 3
  letters: LetterEntry[];

  // Step 4
  step4Values: Step4Entry[];

  // Step 5
  sumOfRoots: number;           // Σ of sqrt(step4Value)
  divisionDecimal: string;      // sumOfRoots / N — exact Decimal string
  divisionResult: string;       // Same as above
  reductionResult: ReductionResult; // Iterative digit-sum steps
  finalDigit: number;           // Single digit 0-9
}

// ─────────────────────────────────────────────────────────────
// Main calculation function
// ─────────────────────────────────────────────────────────────

export function calculateV2(text: string): CalculationResultV2 {
  // ── Validation ──
  const basicCleaned = removeDiacritics(text).replace(/\s+/g, '');
  if (basicCleaned.length === 0) {
    throw new Error('يجب أن يحتوي المدخل على حروف عربية');
  }

  // ── Step 0: Normalize & remove spaces ──
  const normalized = normalizeArabicText(text); // already strips spaces
  const N = normalized.length;

  // ── Step 1 + 2 + 3: Assign positional indices and multiply by 4 ──
  const letters: LetterEntry[] = [];
  for (let i = 0; i < N; i++) {
    const index = i + 1;              // 1-based
    const step3Value = index * 4;
    letters.push({
      char: normalized[i],
      index,
      step3Value,
    });
  }

  // ── Step 4: Square each value ──
  const step4Values: Step4Entry[] = [];
  for (const entry of letters) {
    step4Values.push({
      ...entry,
      step4Value: entry.step3Value * entry.step3Value,
    });
  }

  // ── Step 5: Sum of roots, Division & Reduction ──
  let sumOfRoots = new Decimal(0);
  for (const entry of step4Values) {
    const val = new Decimal(entry.step4Value);
    sumOfRoots = sumOfRoots.plus(val.sqrt());
  }

  const sumOfRootsNum = sumOfRoots.toNumber();
  const decN = new Decimal(N);
  const divisionDecimal = sumOfRoots.div(decN);
  const divisionResult = divisionDecimal.toFixed();

  // ── Step 5b: Digit root reduction of the division result ──
  const reductionResult = digitalRoot(divisionResult);

  return {
    original: text,
    normalized,
    letterCount: N,
    letters,
    step4Values,
    sumOfRoots: sumOfRootsNum,
    divisionDecimal: divisionResult,
    divisionResult,
    reductionResult,
    finalDigit: reductionResult.finalResult,
  };
}
