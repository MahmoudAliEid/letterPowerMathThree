/**
 * Quick validation of the new 5-step engine.
 * Run with: npx ts-node --project tsconfig.json test_logic.ts
 */
import { calculateArabicPower } from './src/lib/calculate';

const tests: { text: string; expected: number | null }[] = [
  { text: 'سكر', expected: 8 },
  { text: 'قهوة', expected: 1 },
  { text: 'ثلاين', expected: 3 }, // 5 letters, correct math: 60/5 = 12 -> 3
  { text: 'ثلاثين', expected: 5 }, // 6 letters, correct math: 84/6 = 14 -> 5
];

for (const { text, expected } of tests) {
  try {
    const r = calculateArabicPower(text);

    console.log(`\nInput: ${text}`);
    console.log(`Normalized: ${r.normalized}  (N=${r.letterCount})`);

    console.log('Step 1+2 (index, ×4 weight):');
    [...r.letters]
      .sort((a, b) => a.index - b.index)
      .forEach(l => console.log(`  ${l.char}  idx=${l.index}  w=${l.step3Value}`));

    console.log('Step 4 (squared values):');
    r.step4Values.forEach(c =>
      console.log(`  ${c.char}: ${c.step3Value} × ${c.step3Value} = ${c.step4Value}`)
    );

    console.log('Step 5:');
    console.log(`  Sum of Roots = ${r.sumOfRoots}`);
    console.log(`  ${r.sumOfRoots} ÷ ${r.letterCount} = ${r.divisionResult}`);
    console.log(`  Reduction steps: ${r.reductionResult.reductionSteps.map(s => s.frac !== null ? `${s.int}.${s.frac}` : `${s.int}`).join(' → ')}`);
    const pass = expected !== null ? (r.finalDigit === expected ? '✅ PASS' : `❌ FAIL (expected ${expected})`) : '';
    console.log(`  Final Digit = ${r.finalDigit}  ${pass}`);
  } catch (e) {
    console.error(`Error for "${text}":`, e);
  }
}
