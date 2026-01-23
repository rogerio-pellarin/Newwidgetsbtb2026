import type { LocalizedText } from '../types/activities';

/**
 * Get the text for the current language from a LocalizedText object
 * @param localizedText - Object with language keys
 * @param language - Current language ('en' or 'es')
 * @param fallback - Fallback text if not found
 */
export function getLocalizedText(
  localizedText: LocalizedText | undefined,
  language: 'en' | 'es',
  fallback: string = ''
): string {
  if (!localizedText) return fallback;
  return localizedText[language] || localizedText['en'] || localizedText['es'] || fallback;
}

/**
 * Strip HTML tags from a string (useful for paragraph correction answers)
 * @param html - HTML string
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Parse HTML string and extract error highlights
 * Used for paragraph correction activities
 * @param html - HTML string with <span class="orangebold"> tags
 */
export function parseErrorHighlights(html: string): {
  text: string;
  highlights: Array<{ text: string; isError: boolean }>;
} {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  
  const highlights: Array<{ text: string; isError: boolean }> = [];
  const nodes = tmp.childNodes;
  
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) {
        highlights.push({ text: node.textContent, isError: false });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('orangebold') && element.textContent) {
        highlights.push({ text: element.textContent, isError: true });
      }
    }
  });
  
  return {
    text: stripHtml(html),
    highlights,
  };
}

/**
 * Extract error corrections by comparing original and corrected text
 * @param originalText - Original text with errors
 * @param correctedHTML - Corrected text with <span class="orangebold"> marking corrections
 */
export function extractErrorCorrections(
  originalText: string,
  correctedHTML: string
): Array<{ incorrect: string; correct: string }> {
  const corrections: Array<{ incorrect: string; correct: string }> = [];
  
  // Parse the corrected HTML to get the clean text and corrections
  const tmp = document.createElement('DIV');
  tmp.innerHTML = correctedHTML;
  
  const correctedText = stripHtml(correctedHTML);
  
  // Split both texts into words
  const originalWords = originalText.split(/(\s+)/);
  const correctedWords = correctedText.split(/(\s+)/);
  
  // Find words that are wrapped in orangebold spans
  const nodes = Array.from(tmp.childNodes);
  let wordIndex = 0;
  
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Count words in text node
      const words = (node.textContent || '').split(/(\s+)/).filter(w => w.trim());
      wordIndex += words.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('orangebold')) {
        const correctWord = element.textContent || '';
        // Find the corresponding position in the original text
        // by comparing word by word
        const incorrectWord = originalWords.filter(w => w.trim())[wordIndex] || '';
        if (incorrectWord && correctWord && incorrectWord !== correctWord) {
          corrections.push({ incorrect: incorrectWord, correct: correctWord });
        }
        wordIndex++;
      }
    }
  });
  
  return corrections;
}