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
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ReductionPair {
  int: number;        // Integer-segment sum for this round
  frac: number | null; // Fractional-segment sum (null if no decimal part)
}

export interface ReductionResult {
  finalResult: number;
  fracFinalResult: number | null;
  displayResult: string;
  decimalPart: string;
  reductionSteps: ReductionPair[];
  steps: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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
 * until each reaches a single digit (0–9).
 *
 * @param val - Exact division result string from Decimal.js
 */
export function digitalRoot(val: string): ReductionResult {
  const dotIdx = val.indexOf('.');
  const rawInt  = dotIdx === -1 ? val           : val.slice(0, dotIdx);
  const rawFrac = dotIdx === -1 ? null          : val.slice(dotIdx + 1);

  // Strip anything that is not a decimal digit (sign, spaces, etc.)
  let curInt  = rawInt.replace(/[^0-9]/g, '');
  let curFrac = rawFrac !== null ? rawFrac.replace(/[^0-9]/g, '') : null;

  // Guard: empty strings become '0'
  if (curInt  === '') curInt  = '0';
  if (curFrac === '') curFrac = null;

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

  const finalInt  = sumDigitChars(curInt);
  const finalFrac = curFrac !== null ? sumDigitChars(curFrac) : null;

  const displayResult =
    finalFrac !== null ? `${finalInt}.${finalFrac}` : `${finalInt}`;

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
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

export function reduceToDigit(num: number): number {
  while (num > 9) {
    let next = 0;
    for (const ch of String(num)) next += ch.charCodeAt(0) - 48;
    num = next;
  }
  return num;
}

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
