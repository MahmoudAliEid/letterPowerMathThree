/**
 * Quick validation of the restored 5-step engine.
 * Run with: npx tsx test_logic.ts
 */
import { calculateArabicPower } from './src/lib/calculate';

const tests: { text: string; expected: string }[] = [
  { text: 'سكر', expected: '8' },
  { text: 'قهوة', expected: '1' },
  { text: 'ثلثين', expected: '4.4' },
  { text: 'ثلاثين', expected: '6.3' },
];

for (const { text, expected } of tests) {
  try {
    const r = calculateArabicPower(text);

    console.log(`\nInput: ${text}`);
    console.log(`Normalized: ${r.normalized}  (N=${r.letterCount})`);

    console.log('Step 1+2 (index, positional weight):');
    [...r.letters]
      .sort((a, b) => a.index - b.index)
      .forEach(l => console.log(`  ${l.char}  idx=${l.index}  w=${l.positionalWeight}`));

    console.log('Step 3 (cumulative weights):');
    r.cumulativeWeights.forEach(c =>
      console.log(`  ${c.char}: [${c.positionalWeights.join('+')}] = ${c.cumulativeWeight}`)
    );

    console.log('Step 4 (cross products):');
    r.crossProducts.forEach(c =>
      console.log(`  ${c.char} (idx ${c.index}): ${c.positionalWeight} × ${c.cumulativeWeight} = ${c.product}`)
    );

    console.log('Step 5:');
    console.log(`  Sum of Roots = ${r.sumOfRoots}`);
    console.log(`  ${r.sumOfRoots} ÷ ${r.letterCount} = ${r.divisionResult}`);
    console.log(`  Reduction steps: ${r.reductionResult.reductionSteps.map(s => s.frac !== null ? `${s.int}.${s.frac}` : `${s.int}`).join(' → ')}`);
    console.log(`  Display Result = ${r.reductionResult.displayResult}`);
    const pass = r.reductionResult.displayResult === expected ? '✅ PASS' : `❌ FAIL (expected ${expected})`;
    console.log(`  Final Digit = ${r.reductionResult.displayResult}  ${pass}`);
  } catch (e) {
    console.error(`Error for "${text}":`, e);
  }
}
