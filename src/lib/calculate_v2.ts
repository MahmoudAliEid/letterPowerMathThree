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

  // Step 5
  sumOfRoots: number;           // Σ of sqrt(product)
  divisionResult: string;       // sumOfRoots / N — exact Decimal string
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
  const letters: LetterEntry[] = [];
  for (let i = 0; i < N; i++) {
    const index = i + 1;              // 1-based
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

  // ── Step 4: Cross multiplication ──
  const crossProducts: CrossProduct[] = [];
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
  }

  // ── Step 5: Sum of roots, Division & Reduction ──
  let sumOfRoots = new Decimal(0);
  for (const cp of crossProducts) {
    const decProduct = new Decimal(cp.product);
    sumOfRoots = sumOfRoots.plus(decProduct.sqrt());
  }

  const sumOfRootsNum = sumOfRoots.toNumber();
  const decN = new Decimal(N);
  const divisionDecimal = sumOfRoots.div(decN);
  
  // Format the division result to exactly 8 decimal places as shown in the paper's math,
  // then strip any trailing zeroes and trailing decimal point.
  let divisionResult = divisionDecimal.toFixed(8);
  if (divisionResult.indexOf('.') !== -1) {
    divisionResult = divisionResult.replace(/0+$/, '').replace(/\.$/, '');
  }

  // ── Step 5b: Digit root reduction of the division result ──
  const reductionResult = digitalRoot(divisionResult);

  return {
    original: text,
    normalized,
    letterCount: N,
    letters,
    cumulativeWeights,
    crossProducts,
    sumOfRoots: sumOfRootsNum,
    divisionResult,
    reductionResult,
    finalDigit: reductionResult.finalResult,
  };
}
