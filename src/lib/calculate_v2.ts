/**
 * الخوارزمية الجديدة — المحرك الخماسي
 * New 5-Step Arabic Text Metrics Engine
 *
 * الخطوة 1: الترقيم من اليمين إلى اليسار (1، 2، 3…)
 * الخطوة 2: الوزن الموقعي = الموقع × 4
 * الخطوة 3: الوزن التراكمي لكل حرف = مجموع أوزانه الموقعية
 * الخطوة 4: الضرب التقاطعي = Σ(وزن موقعي × وزن تراكمي) لكل موقع
 * الخطوة 5: القسمة على N ثم الاختزال الرقمي المتكرر للرقم النهائي
 *
 * تُستخدم مكتبة Decimal.js لضمان الدقة العلمية الكاملة بدون أي تقريب.
 */

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

/** Step 1+2: Each letter with its positional index and weight */
export interface LetterEntry {
  char: string;          // The normalized character
  index: number;         // 1-based position from right
  positionalWeight: number; // index × 4
}

/** Step 3: Cumulative weight for each unique character */
export interface CumulativeEntry {
  char: string;
  positions: number[];         // All positional indices where this char appears
  positionalWeights: number[]; // The ×4 weights at each position
  cumulativeWeight: number;    // Sum of all positionalWeights
}

/** Step 4: Cross-product for one position */
export interface CrossProduct {
  char: string;
  index: number;
  positionalWeight: number;  // Step 2 value
  cumulativeWeight: number;  // Step 3 value for this char
  product: number;           // positionalWeight × cumulativeWeight
}

/** Full result across all 5 steps */
export interface CalculationResultV2 {
  // Input
  original: string;
  normalized: string;
  letterCount: number;          // N

  // Step 1+2
  letters: LetterEntry[];

  // Step 3
  cumulativeWeights: CumulativeEntry[];

  // Step 4
  crossProducts: CrossProduct[];
  grandTotal: number;           // Σ of all cross-products (exact integer)

  // Step 5
  divisionResult: string;       // grandTotal / N — exact Decimal string (no rounding)
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

  // ── Step 1 + 2: Assign positional indices ──
  // Index 1 = first character in the normalized string (string position 0).
  // This matches the handwritten examples: for "بلال", ب gets index 1, then ل=2, ا=3, ل=4.
  // (The Arabic text is stored LTR in memory; index 1 corresponds to the rightmost Arabic glyph
  //  when rendered RTL, i.e. the start of the word as read in Arabic.)
  const letters: LetterEntry[] = [];
  for (let i = 0; i < N; i++) {
    const index = i + 1;              // 1-based, left-to-right in string array
    const positionalWeight = index * 4;
    letters.push({
      char: normalized[i],
      index,
      positionalWeight,
    });
  }

  // ── Step 3: Cumulative character weights ──
  // Group by unique char, sum their positional weights
  const cumMap = new Map<string, CumulativeEntry>();
  for (const entry of letters) {
    if (!cumMap.has(entry.char)) {
      cumMap.set(entry.char, {
        char: entry.char,
        positions: [],
        positionalWeights: [],
        cumulativeWeight: 0,
      });
    }
    const cum = cumMap.get(entry.char)!;
    cum.positions.push(entry.index);
    cum.positionalWeights.push(entry.positionalWeight);
    cum.cumulativeWeight += entry.positionalWeight;
  }
  const cumulativeWeights = Array.from(cumMap.values());

  // ── Step 4: Cross multiplication & grand total ──
  const crossProducts: CrossProduct[] = [];
  let grandTotal = 0;

  for (const entry of letters) {
    const cumWeight = cumMap.get(entry.char)!.cumulativeWeight;
    const product = entry.positionalWeight * cumWeight;
    crossProducts.push({
      char: entry.char,
      index: entry.index,
      positionalWeight: entry.positionalWeight,
      cumulativeWeight: cumWeight,
      product,
    });
    grandTotal += product;
  }

  // ── Step 5a: Scientific division — no rounding, full precision ──
  const decGrandTotal = new Decimal(grandTotal);
  const decN = new Decimal(N);
  const divisionDecimal = decGrandTotal.div(decN);
  const divisionResult = divisionDecimal.toFixed(); // Full decimal string, no scientific notation

  // ── Step 5b: Digit root reduction of the division result ──
  const reductionResult = digitalRoot(divisionResult);

  return {
    original: text,
    normalized,
    letterCount: N,
    letters,
    cumulativeWeights,
    crossProducts,
    grandTotal,
    divisionResult,
    reductionResult,
    finalDigit: reductionResult.finalResult,
  };
}
