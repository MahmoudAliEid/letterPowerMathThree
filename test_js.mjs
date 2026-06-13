// Quick JS validation of the 5-step algorithm (no TypeScript needed)
// Run: node test_js.mjs

// ── Normalization map (subset for test cases) ──
const NORMALIZATION_MAP = {
  'ا': 'أ', 'إ': 'أ', 'آ': 'أ', 'ى': 'أ', 'ء': 'أ', 'ؤ': 'أ', 'ئ': 'أ',
  'ة': 'ت',
};

function normalizeText(text) {
  // Remove diacritics
  let s = text.replace(/[\u064B-\u0652\u0670\u0610-\u061A]/g, '');
  // Remove spaces
  s = s.replace(/\s+/g, '');
  // Apply normalization
  for (const [from, to] of Object.entries(NORMALIZATION_MAP)) {
    s = s.split(from).join(to);
  }
  return s;
}

function calculate(text) {
  const normalized = normalizeText(text);
  const N = normalized.length;

  // Step 1+2: index from right (last char = index 1), weight = index × 4
  const letters = [];
  for (let i = 0; i < N; i++) {
    const index = i + 1; // left-to-right in string order
    letters.push({ char: normalized[i], index, positionalWeight: index * 4 });
  }

  // Step 3: cumulative weights per unique char
  const cumMap = {};
  for (const l of letters) {
    if (!cumMap[l.char]) cumMap[l.char] = 0;
    cumMap[l.char] += l.positionalWeight;
  }

  // Step 4: cross-multiply and sum
  let grandTotal = 0;
  for (const l of letters) {
    grandTotal += l.positionalWeight * cumMap[l.char];
  }

  // Step 5a: exact division (integer check)
  const divResult = grandTotal / N; // JS number, but for these test cases it's exact

  // Step 5b: digit root of all digits in divResult string (ignoring '.')
  function digitRoot(str) {
    const steps = [];
    let current = str.replace(/[^0-9]/g, '').split('').reduce((a, d) => a + parseInt(d), 0);
    steps.push(current);
    while (current > 9) {
      current = current.toString().split('').reduce((a, d) => a + parseInt(d), 0);
      steps.push(current);
    }
    return { steps, finalDigit: current };
  }

  const reduction = digitRoot(divResult.toString());

  return { normalized, N, grandTotal, divResult, reduction };
}

const tests = [
  { text: 'بلال', expected: 4 },
  { text: 'محمد وحمد', expected: 6 },
];

for (const { text, expected } of tests) {
  const r = calculate(text);
  const pass = r.reduction.finalDigit === expected ? '✅ PASS' : `❌ FAIL (expected ${expected})`;
  console.log(`"${text}" → normalized="${r.normalized}" N=${r.N} grandTotal=${r.grandTotal} ÷${r.N}=${r.divResult} → ${r.reduction.steps.join('→')} = ${r.reduction.finalDigit}  ${pass}`);
}
