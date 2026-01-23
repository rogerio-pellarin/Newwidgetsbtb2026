# Language & Text Matching System

## Overview

This document describes how the Breaking the Barrier assessment widgets handle:
1. **Multi-language support** (source/target languages)
2. **Smart text matching** (accents, apostrophes, punctuation)

---

## Language Management

### Source vs Target Language

Each activity has language settings that define:

- **`source_language`**: The user's native language (interface language)
- **`target_language`**: The language being learned (content language)

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    }
  }
}
```

### Language Toggle Behavior

The language toggle button switches the **interface language** (instructions, tips, buttons, etc.). It does NOT change:
- The target language content (questions, exercises)
- Vocabulary words being tested
- Answer validation logic

### Vocabulary Display Rules

| Widget Type | Display Rule |
|------------|--------------|
| Vocabulary Lists | Always show BOTH languages |
| AI Chat Vocabulary | Always show BOTH languages |
| AI Composition Vocabulary | Always show BOTH languages |
| Drawing Vocabulary | Only show TARGET language (to test comprehension) |
| Fill-in-the-Blanks | Show questions in TARGET language |
| Verb Conjugation | Show verbs in TARGET language |

### Implementation

```typescript
// Import utilities
import { getInterfaceLanguage, getTargetLanguage, initializeLanguage } from '../../utils/languageUtils';

// In your component
const interfaceLanguage = getInterfaceLanguage(activity.settings.languages, currentLanguage);
const targetLanguage = getTargetLanguage(activity.settings.languages);

// Use for UI elements
const t = translations[interfaceLanguage];

// Use for content
const questionText = getLocalizedText(question.prompt, targetLanguage);
```

---

## Smart Text Matching

### Overview

The text matching system handles common student input variations:
- Missing accents (é vs e)
- Different apostrophes (' vs ' vs `)
- Punctuation differences (spacing, quotes)
- Case sensitivity

### Match Types

| Status | Meaning | Color |
|--------|---------|-------|
| `perfect` | Exact match (case-insensitive) | Green |
| `accent` | Match except for accents/diacritics | Yellow |
| `punctuation` | Match except for apostrophes/quotes | Yellow |
| `wrong` | No match | Red |

### Usage Examples

#### Basic Answer Checking

```typescript
import { compareAnswers } from '../../utils/textMatching';

// Check a single answer
const status = compareAnswers(userAnswer, correctAnswer);
// Returns: 'perfect' | 'accent' | 'punctuation' | 'wrong'

// Update UI based on status
blank.status = status;
```

#### Multiple Correct Answers

For verb conjugation where multiple forms are acceptable:

```typescript
import { checkAgainstMultipleAnswers } from '../../utils/textMatching';

const acceptableAnswers = ['hablé', 'he hablado', 'había hablado'];
const status = checkAgainstMultipleAnswers(userAnswer, acceptableAnswers);
```

#### Similarity Scoring

For partial credit or hints:

```typescript
import { calculateSimilarity } from '../../utils/textMatching';

const similarity = calculateSimilarity(userAnswer, correctAnswer);
// Returns: 0-100 (percentage)

if (similarity >= 80) {
  showHint('You\'re very close! Check your accents.');
}
```

### Character Normalization

The system handles these character variations:

**Accents & Diacritics:**
- Spanish: á, é, í, ó, ú, ñ, ü
- French: à, â, ç, è, é, ê, ë, î, ï, ô, ù, û, ü, ÿ
- German: ä, ö, ü, ß
- Portuguese: ã, õ, â, ê, î, ô, û, ç

**Apostrophes:**
- Standard apostrophe: `'`
- Curly apostrophes: `'` `'`
- Backtick: `` ` ``

**Quotes:**
- Standard quotes: `"`
- Curly quotes: `"` `"`
- Guillemets: `«` `»`

### Implementation in Widgets

#### Fill-in-the-Blanks Example

```typescript
const checkAnswer = (questionId: number, blankIndex: number) => {
  setQuestions((prev) =>
    prev.map((q) => {
      if (q.id === questionId) {
        const updatedBlanks = [...q.blanks];
        const blank = updatedBlanks[blankIndex];
        
        if (blank.userAnswer && blank.userAnswer.trim() !== '') {
          // Smart matching with accent/punctuation handling
          blank.status = compareAnswers(blank.userAnswer, blank.answer);
        }

        return { ...q, blanks: updatedBlanks };
      }
      return q;
    })
  );
};
```

#### Verb Conjugation Example

```typescript
const checkAnswer = (pronoun: string) => {
  const correctAnswers = question.conjugations[pronoun]; // Array of acceptable forms
  const status = checkAgainstMultipleAnswers(userAnswer, correctAnswers);
  
  updateQuestionStatus(question.id, pronoun, status);
};
```

---

## API Structure

### Text Matching Functions

```typescript
// Compare two strings
compareAnswers(userAnswer: string, correctAnswer: string): 
  'perfect' | 'accent' | 'punctuation' | 'wrong'

// Check against multiple acceptable answers
checkAgainstMultipleAnswers(userAnswer: string, correctAnswers: string[]): 
  'perfect' | 'accent' | 'punctuation' | 'wrong'

// Calculate similarity percentage
calculateSimilarity(str1: string, str2: string): number

// Normalize text for comparison
normalizeText(text: string): string

// Remove accents
removeAccents(text: string): string

// Normalize apostrophes
normalizeApostrophes(text: string): string

// Normalize punctuation
normalizePunctuation(text: string): string

// Full normalization (all of the above)
fullyNormalize(text: string): string

// Strict checking (exact match)
isAnswerCorrectStrict(userAnswer: string, correctAnswer: string): boolean

// Loose checking (ignore accents/punctuation)
isAnswerCorrectLoose(userAnswer: string, correctAnswer: string): boolean
```

### Language Functions

```typescript
// Get interface language
getInterfaceLanguage(settings: LanguageSettings, currentLanguage: 'en' | 'es'): 'en' | 'es'

// Get target language
getTargetLanguage(settings: LanguageSettings): 'en' | 'es'

// Get source language
getSourceLanguage(settings: LanguageSettings): 'en' | 'es'

// Get language name in another language
getLanguageName(languageCode: 'en' | 'es', displayInLanguage: 'en' | 'es'): string

// Get keyboard hints for a language
getKeyboardHints(language: 'en' | 'es'): {
  specialChars: string[];
  description: Record<'en' | 'es', string>;
}

// Initialize language from settings
initializeLanguage(settings: LanguageSettings): 'en' | 'es'

// Check if widget should show bilingual content
shouldShowBilingual(widgetType: string): boolean
```

---

## Best Practices

### 1. Always Use Smart Matching

❌ **Don't:**
```typescript
if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
  // Too strict - doesn't handle accents
}
```

✅ **Do:**
```typescript
import { compareAnswers } from '../../utils/textMatching';

const status = compareAnswers(userAnswer, correctAnswer);
if (status === 'perfect' || status === 'accent') {
  // Handle correct answer
}
```

### 2. Initialize Language from Activity Settings

❌ **Don't:**
```typescript
const [language, setLanguage] = useState<'en' | 'es'>('en'); // Hardcoded default
```

✅ **Do:**
```typescript
import { initializeLanguage } from '../../utils/languageUtils';

const [language, setLanguage] = useState<'en' | 'es'>(
  initializeLanguage(activity.settings.languages)
);
```

### 3. Use Localization Utilities

❌ **Don't:**
```typescript
const text = activity.prompt.en || activity.prompt.es; // Manual fallback
```

✅ **Do:**
```typescript
import { getLocalizedText } from '../../utils/localization';

const text = getLocalizedText(activity.prompt, language);
```

### 4. Handle Multiple Acceptable Answers

For exercises where multiple forms are correct:

```typescript
import { checkAgainstMultipleAnswers } from '../../utils/textMatching';

// Verb conjugation might accept multiple tenses
const acceptableAnswers = verb.conjugations[pronoun]; // Array
const status = checkAgainstMultipleAnswers(userAnswer, acceptableAnswers);
```

---

## Testing Different Input Variations

The system automatically handles:

| User Input | Correct Answer | Result | Reason |
|------------|---------------|--------|---------|
| `estudi` | `estudié` | Yellow (accent) | Missing accent |
| `ESTUDIÉ` | `estudié` | Green (perfect) | Case insensitive |
| `estudie` | `estudié` | Yellow (accent) | Wrong 'e' |
| `l'arbre` | `l'arbre` | Green (perfect) | Exact match |
| `l'arbre` | `l'arbre` | Yellow (punctuation) | Different apostrophe |
| `l\`arbre` | `l'arbre` | Yellow (punctuation) | Backtick vs apostrophe |
| `¿Cómo estás?` | `¿Cómo estás?` | Green (perfect) | Exact match |
| `Como estas` | `¿Cómo estás?` | Red (wrong) | Missing accents AND punctuation |

---

## Future Extensions

The system is designed to easily support additional languages:

```typescript
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'zh' | 'ja';
```

To add a new language:
1. Update `SupportedLanguage` type
2. Add translations in `translations` objects
3. Add keyboard hints in `getKeyboardHints()`
4. Add character normalization rules if needed

---

## References

- **Text Matching**: `/src/utils/textMatching.ts`
- **Language Utils**: `/src/utils/languageUtils.ts`
- **Localization**: `/src/utils/localization.ts`
- **Activity Types**: `/src/types/activities.ts`
