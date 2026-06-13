/**
 * Quick validation of the new 5-step engine.
 * Run with: npx ts-node --project tsconfig.json test_logic.ts
 *
 * Expected:
 *   "بلال"       → finalDigit = 4
 *   "محمد وحمد"  → finalDigit = 6
 */
import { calculateArabicPower } from './src/lib/calculate';

const tests: { text: string; expected: number | null }[] = [
  { text: 'بلال', expected: 4 },
  { text: 'محمد وحمد', expected: 6 },
  { text: 'جيل جميل و كبير و منير', expected: null },
  { text: 'نور ونوره', expected: null },
];

for (const { text, expected } of tests) {
  try {
    const r = calculateArabicPower(text);

    console.log(`\nInput: ${text}`);
    console.log(`Normalized: ${r.normalized}  (N=${r.letterCount})`);

    console.log('Step 1+2 (index, ×4 weight):');
    [...r.letters]
      .sort((a, b) => a.index - b.index)
      .forEach(l => console.log(`  ${l.char}  idx=${l.index}  w=${l.positionalWeight}`));

    console.log('Step 3 (cumulative weights):');
    r.cumulativeWeights.forEach(c =>
      console.log(`  ${c.char}: [${c.positionalWeights.join('+')}] = ${c.cumulativeWeight}`)
    );

    console.log('Step 4 (cross products):');
    const expr = r.crossProducts.map(cp => `${cp.positionalWeight}×${cp.cumulativeWeight}(=${cp.product})`).join(' + ');
    console.log(`  ${expr}`);
    console.log(`  Grand Total = ${r.grandTotal}`);

    console.log('Step 5:');
    console.log(`  ${r.grandTotal} ÷ ${r.letterCount} = ${r.divisionResult}`);
    console.log(`  Reduction: ${r.reductionResult.steps.join(' → ')}`);
    const pass = expected !== null ? (r.finalDigit === expected ? '✅ PASS' : `❌ FAIL (expected ${expected})`) : '';
    console.log(`  Final Digit = ${r.finalDigit}  ${pass}`);
  } catch (e) {
    console.error(`Error for "${text}":`, e);
  }
}
