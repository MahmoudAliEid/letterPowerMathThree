/**
 * Reduction utilities — Step 5 String-based Paired Reduction.
 *
 * Algorithm (NO floating-point operations, pure string digit manipulation):
 *
 * 1. Split the division string at '.' → Integer_Segment, Fractional_Segment
 * 2. Each round: sum digit characters of each segment independently.
 * 3. If either resulting sum ≥ 10, convert it to a string and repeat from step 2.
 * 4. Stop when BOTH sums are single digits (0–9).
 * 5. Join with '.' → "X.Y" (or just "X" if no fractional segment).
 *
 * Validation test-case (from spec):
 *   input "74.66666667"
 *   round 1 → int: 7+4=11,  frac: 6+6+6+6+6+6+6+7=49  → "11.49"
 *   round 2 → int: 1+1=2,   frac: 4+9=13               → "2.13"
 *   round 3 → int: 2 (done), frac: 1+3=4 (done)         → "2.4" ✓
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** One reduction round: the summed value for each segment after that round. */
export interface ReductionPair {
  int: number;        // Integer-segment sum for this round
  frac: number | null; // Fractional-segment sum (null if no decimal part)
}

export interface ReductionResult {
  /** Final single integer digit (0–9). */
  finalResult: number;

  /** Final single fractional digit (0–9), or null if the division was a whole number. */
  fracFinalResult: number | null;

  /** Human-readable final value: "X.Y" or "X". */
  displayResult: string;

  /** Backward-compat: the string ".Y" or "" appended to displayResult. */
  decimalPart: string;

  /** Every paired reduction round until both parts reach a single digit. */
  reductionSteps: ReductionPair[];

  /** Backward-compat: integer-part values at each step. */
  steps: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pure string-digit sum — no parseInt on the whole number, no parseFloat.
 * Iterates over each character, converts to digit, accumulates.
 */
function sumDigitChars(s: string): number {
  let total = 0;
  for (const ch of s) {
    const code = ch.charCodeAt(0) - 48; // '0'.charCodeAt(0) === 48
    if (code >= 0 && code <= 9) total += code;
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Paired digital-root reduction of a division result string.
 *
 * Both integer and fractional segments are reduced simultaneously each round
 * until each reaches a single digit (0–9).  No floating-point arithmetic is
 * performed anywhere in this function.
 *
 * @param val - Exact division result string from Decimal.js (e.g. "195.2" or
 *              "74.6666…667").  May or may not contain a decimal point.
 */
export function digitalRoot(val: string): ReductionResult {
  // ── 1. Split at decimal point (pure string operation) ──────────────────────
  const dotIdx = val.indexOf('.');
  const rawInt  = dotIdx === -1 ? val           : val.slice(0, dotIdx);
  const rawFrac = dotIdx === -1 ? null          : val.slice(dotIdx + 1);

  // Strip anything that is not a decimal digit (sign, spaces, etc.)
  let curInt  = rawInt.replace(/[^0-9]/g, '');
  let curFrac = rawFrac !== null ? rawFrac.replace(/[^0-9]/g, '') : null;

  // Guard: empty strings become '0'
  if (curInt  === '') curInt  = '0';
  if (curFrac === '') curFrac = null; // treat all-stripped frac as absent

  // ── 2. Paired reduction rounds ─────────────────────────────────────────────
  const reductionSteps: ReductionPair[] = [];

  while (
    sumDigitChars(curInt) > 9 ||
    (curFrac !== null && sumDigitChars(curFrac) > 9)
  ) {
    const intSum  = sumDigitChars(curInt);
    const fracSum = curFrac !== null ? sumDigitChars(curFrac) : null;

    reductionSteps.push({ int: intSum, frac: fracSum });

    curInt  = String(intSum);
    curFrac = fracSum !== null ? String(fracSum) : null;
  }

  // After the loop both curInt and curFrac are single-digit strings (or were
  // already single digits from the start).
  const finalInt  = sumDigitChars(curInt);   // guaranteed 0–9
  const finalFrac = curFrac !== null ? sumDigitChars(curFrac) : null; // 0–9 or null

  const displayResult =
    finalFrac !== null ? `${finalInt}.${finalFrac}` : `${finalInt}`;

  // Backward-compat: steps = integer values through each round
  const steps: number[] = reductionSteps.map(s => s.int);
  if (steps.length === 0 || steps[steps.length - 1] > 9) {
    steps.push(finalInt);
  }

  return {
    finalResult:     finalInt,
    fracFinalResult: finalFrac,
    displayResult,
    decimalPart:     finalFrac !== null ? `.${finalFrac}` : '',
    reductionSteps,
    steps,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers (used elsewhere in the app)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reduce a positive integer to a single digit (0–9) by repeatedly summing
 * its decimal digits.
 */
export function reduceToDigit(num: number): number {
  while (num > 9) {
    let next = 0;
    for (const ch of String(num)) next += ch.charCodeAt(0) - 48;
    num = next;
  }
  return num;
}

/**
 * Same as reduceToDigit but also returns every intermediate sum.
 */
export function reduceToDigitWithSteps(num: number): { result: number; steps: number[] } {
  const steps: number[] = [num];
  let current = num;
  while (current > 9) {
    let next = 0;
    for (const ch of String(current)) next += ch.charCodeAt(0) - 48;
    current = next;
    steps.push(current);
  }
  return { result: current, steps };
}
