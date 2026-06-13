/**
 * calculate.ts — backward-compat wrapper around the new 5-step engine (calculate_v2).
 *
 * All internal logic now lives in calculate_v2.ts.
 * This file re-exports the types and delegates the main function so the rest of
 * the app (actions.ts, ResultView, etc.) needs minimal changes.
 */

export {
  calculateV2 as calculateArabicPower,
  type CalculationResultV2 as CalculationResult,
  type LetterEntry,
  type CumulativeEntry,
  type CrossProduct,
} from './calculate_v2';