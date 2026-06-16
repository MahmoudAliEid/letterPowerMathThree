import Decimal from 'decimal.js';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ReductionPair {
  int: number;
  frac: string | null; // Changed to string | null to preserve leading zeroes
}

export interface ReductionResult {
  finalResult: number;
  fracFinalResult: number | null;
  displayResult: string;
  decimalPart: string;
  reductionSteps: ReductionPair[];
  steps: number[];
}

// ─────────────────────────────────────────────────────────────
// Main digitalRoot function
// ─────────────────────────────────────────────────────────────

/**
 * Paired digital-root reduction of a division result string.
 *
 * 1. Formats the division result to 2 decimal places (or 0 decimal places if it is a whole integer).
 * 2. Sums all the digits of the formatted number.
 * 3. Iteratively sums the digits of the resulting number until it becomes a single digit (0-9).
 *
 * @param val - Exact division result string from Decimal.js
 */
export function digitalRoot(val: string): ReductionResult {
  const dec = new Decimal(val);

  let fixedNumStr: string;
  let initialInt: number;
  let initialFrac: string | null = null;

  if (dec.isInteger()) {
    fixedNumStr = dec.toFixed(0);
    initialInt = parseInt(fixedNumStr, 10);
  } else {
    fixedNumStr = dec.toFixed(2);
    const p = fixedNumStr.split('.');
    initialInt = parseInt(p[0], 10);
    initialFrac = p[1] || null; // Preserved as string
  }

  const reductionSteps: ReductionPair[] = [];

  // The first step shows the initial formatted number
  reductionSteps.push({ int: initialInt, frac: initialFrac });

  // Convert formatted string to individual digits (excluding the decimal point)
  const currentDigits = fixedNumStr.replace('.', '').split('').map(Number);
  let currentSum = currentDigits.reduce((a, b) => a + b, 0);

  // If the sum is different from the initial representation, add it as a step
  if (fixedNumStr !== String(currentSum)) {
    reductionSteps.push({ int: currentSum, frac: null });
  }

  // Iteratively reduce the sum until it's a single digit (<= 9)
  while (currentSum > 9) {
    const nextSum = String(currentSum).split('').map(Number).reduce((a, b) => a + b, 0);
    reductionSteps.push({ int: nextSum, frac: null });
    currentSum = nextSum;
  }

  const finalDigit = currentSum;

  return {
    finalResult: finalDigit,
    fracFinalResult: null,
    displayResult: String(finalDigit),
    decimalPart: '',
    reductionSteps,
    steps: reductionSteps.map(s => s.int),
  };
}

// ─────────────────────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────────────────────

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
