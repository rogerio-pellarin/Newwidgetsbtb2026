/**
 * Text Matching Utilities
 * 
 * Smart matching algorithms for language learning exercises that handle:
 * - Accents and diacritics
 * - Apostrophes and punctuation variations
 * - Different keyboard layouts
 * - Case sensitivity
 */

/**
 * Normalize text for comparison (trim and lowercase)
 */
export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

/**
 * Remove all accents and diacritics from a string
 * Works for Spanish, French, Portuguese, German, etc.
 */
export function removeAccents(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
}

/**
 * Normalize apostrophes and quotes to a standard form
 * Handles: ' ' ` " " " « »
 */
export function normalizeApostrophes(text: string): string {
  return text
    .replace(/[\u2018\u2019\u0060]/g, "'") // Replace various apostrophes/backticks with standard '
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"'); // Replace various quotes with standard "
}

/**
 * Normalize punctuation marks
 * Handles differences in spacing, question marks, exclamation marks
 */
export function normalizePunctuation(text: string): string {
  return text
    .replace(/\s+([.,;:!?])/g, '$1') // Remove space before punctuation
    .replace(/([¿¡])\s+/g, '$1') // Remove space after inverted punctuation
    .replace(/\s+/g, ' '); // Normalize multiple spaces to single space
}

/**
 * Full normalization for loose matching
 * Removes accents, normalizes apostrophes and punctuation
 */
export function fullyNormalize(text: string): string {
  let normalized = normalizeText(text);
  normalized = removeAccents(normalized);
  normalized = normalizeApostrophes(normalized);
  normalized = normalizePunctuation(normalized);
  return normalized;
}

/**
 * Compare two strings and return match status
 * @returns 'perfect' | 'accent' | 'punctuation' | 'wrong'
 */
export function compareAnswers(
  userAnswer: string,
  correctAnswer: string
): 'perfect' | 'accent' | 'punctuation' | 'wrong' {
  // Normalize both for basic comparison
  const normalizedUser = normalizeText(userAnswer);
  const normalizedCorrect = normalizeText(correctAnswer);

  // Perfect match (case-insensitive)
  if (normalizedUser === normalizedCorrect) {
    return 'perfect';
  }

  // Check if only difference is accents
  const userNoAccents = removeAccents(normalizedUser);
  const correctNoAccents = removeAccents(normalizedCorrect);
  
  if (userNoAccents === correctNoAccents) {
    return 'accent';
  }

  // Check if only difference is apostrophes/punctuation
  const userNormalizedApos = normalizeApostrophes(normalizedUser);
  const correctNormalizedApos = normalizeApostrophes(normalizedCorrect);
  
  if (userNormalizedApos === correctNormalizedApos) {
    return 'punctuation';
  }

  // Check both accents and punctuation
  const userFully = fullyNormalize(userAnswer);
  const correctFully = fullyNormalize(correctAnswer);
  
  if (userFully === correctFully) {
    return 'accent'; // Still count as accent issue since it's close
  }

  // No match
  return 'wrong';
}

/**
 * Check if user answer is correct (ignoring accents and punctuation)
 * Useful for more lenient checking
 */
export function isAnswerCorrectLoose(userAnswer: string, correctAnswer: string): boolean {
  return fullyNormalize(userAnswer) === fullyNormalize(correctAnswer);
}

/**
 * Check if user answer is perfectly correct
 */
export function isAnswerCorrectStrict(userAnswer: string, correctAnswer: string): boolean {
  return normalizeText(userAnswer) === normalizeText(correctAnswer);
}

/**
 * Get all acceptable variations of an answer
 * Useful for conjugation exercises where multiple forms might be acceptable
 */
export function checkAgainstMultipleAnswers(
  userAnswer: string,
  correctAnswers: string[]
): 'perfect' | 'accent' | 'punctuation' | 'wrong' {
  if (correctAnswers.length === 0) return 'wrong';

  let bestMatch: 'perfect' | 'accent' | 'punctuation' | 'wrong' = 'wrong';

  for (const correctAnswer of correctAnswers) {
    const result = compareAnswers(userAnswer, correctAnswer);
    
    // Return immediately if perfect match
    if (result === 'perfect') {
      return 'perfect';
    }
    
    // Track the best match so far
    if (result === 'accent' && bestMatch === 'wrong') {
      bestMatch = 'accent';
    } else if (result === 'punctuation' && bestMatch === 'wrong') {
      bestMatch = 'punctuation';
    }
  }

  return bestMatch;
}

/**
 * Calculate similarity percentage between two strings
 * Uses Levenshtein distance for fuzzy matching
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = fullyNormalize(str1);
  const s2 = fullyNormalize(str2);
  
  if (s1 === s2) return 100;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  const distance = levenshteinDistance(longer, shorter);
  return Math.round(((longer.length - distance) / longer.length) * 100);
}

/**
 * Levenshtein distance algorithm
 * Calculates the minimum number of edits needed to transform one string into another
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
