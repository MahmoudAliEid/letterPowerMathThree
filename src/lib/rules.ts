/**
 * Arabic character normalization rules
 */

// Normalization map for Arabic characters based on requested groups
export const NORMALIZATION_MAP: Record<string, string> = {
  // Alif/Hamza Group normalize all to 'أ'
  'ا': 'أ',
  'إ': 'أ',
  'آ': 'أ',
  'ى': 'أ',
  'ء': 'أ',
  'ؤ': 'أ',
  'ئ': 'أ',
  'ٱ': 'أ',
  // Presentation forms for Alif group
  'ﺁ': 'أ', 'ﺂ': 'أ', 'ﺃ': 'أ', 'ﺄ': 'أ', 'ﺅ': 'أ', 'ﺆ': 'أ', 'ﺇ': 'أ', 'ﺈ': 'أ', 'ﺉ': 'أ', 'ﺌ': 'أ', 'ﺋ': 'أ', 'ﺊ': 'أ', 'ﺍ': 'أ', 'ﺎ': 'أ', 'ﻰ': 'أ', 'ﻯ': 'أ',
  
  // Ta Group normalize all to 'ت'
  'ة': 'ت',
  'ـة': 'ت',
  // Presentation forms for Ta group
  'ﺓ': 'ت', 'ﺔ': 'ت', 'ﺕ': 'ت', 'ﺖ': 'ت', 'ﺘ': 'ت', 'ﺗ': 'ت',

  // Ha Group normalize all to 'ه'
  'ـه': 'ه',
  // Presentation forms for Ha group
  'ﻩ': 'ه', 'ﻪ': 'ه', 'ﻬ': 'ه', 'ﻫ': 'ه',
};


// Arabic character range regex (includes common Arabic letters and spaces)
export const ARABIC_REGEX = /^[\u0600-\u06FF\s]*$/;

/**
 * Normalize Arabic text according to the rules
 * @param text - Input Arabic text
 * @returns Normalized text
 */
export function normalizeArabicText(text: string): string {
  // 1. Remove diacritics (tashkeel) and spaces
  let normalized = removeDiacritics(text).replace(/\s+/g, '');
  
  // 2. Apply normalization rules for character grouping
  for (const [original, replacement] of Object.entries(NORMALIZATION_MAP)) {
    normalized = normalized.split(original).join(replacement);
  }
  
  return normalized;
}

/**
 * Validate that input contains only Arabic characters and spaces
 * @param text - Input text to validate
 * @returns true if valid, false otherwise
 */
export function validateArabicInput(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

/**
 * Clean text by removing diacritics (tashkeel)
 * @param text - Input text
 * @returns Cleaned text
 */
export function removeDiacritics(text: string): string {
  // Remove Arabic diacritics:
  // \u064B-\u0652: standard tashkeel
  // \u0670: Superscript Alif (dagger alif)
  // \u0610-\u061A: more specific quranic marks
  return text.replace(/[\u064B-\u0652\u0670\u0610-\u061A]/g, '');
}

