# JSON Schema Reference - Quick Guide

This document provides quick reference schemas for all activity types.

## Table of Contents
1. [Common Structures](#common-structures)
2. [Fill in the Blanks](#fill-in-the-blanks)
3. [Verb Conjugation](#verb-conjugation)
4. [Extended Response](#extended-response)
5. [Oral Practice](#oral-practice)
6. [Paragraph Correction](#paragraph-correction)
7. [AI Composition](#ai-composition)
8. [AI Chat](#ai-chat)
9. [Dropdown Selection](#dropdown-selection)
10. [Table Fill-in-the-Blanks](#table-fill-in-the-blanks)
11. [Verb Identification](#verb-identification)
12. [Drawing Vocabulary](#drawing-vocabulary)

---

## Common Structures

All activities share these base structures:

```typescript
// Language Settings
{
  "source_language": "en",
  "target_language": "es"
}

// Localized Text
{
  "en": "English text",
  "es": "Spanish text"
}

// Base Settings
{
  "languages": { /* LanguageSettings */ },
  "legacy_id": 1234
}
```

---

## Fill in the Blanks

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 1,
    "ai_enabled": false
  },
  "instructions": {
    "en": "Fill in the blanks with the correct words.",
    "es": "Completa los espacios en blanco con las palabras correctas."
  },
  "questions": [
    {
      "id": 1,
      "text": {
        "en": "The cat ___ on the mat.",
        "es": "El gato ___ en la alfombra."
      },
      "blanks": [
        {
          "position": 8,
          "correct_answer": "sits",
          "placeholder": "verb",
          "hint": "present tense"
        }
      ]
    }
  ]
}
```

**Key Fields:**
- `ai_enabled`: Boolean - Enable AI feedback sidebar
- `blanks.position`: Number - Character position of blank in text
- `blanks.correct_answer`: String - Expected answer
- `blanks.placeholder`: String - Placeholder text in input
- `blanks.hint`: String (optional) - Hint for students

---

## Verb Conjugation

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 3062
  },
  "instructions": {
    "en": "Conjugate the following verbs.",
    "es": "Conjuga los siguientes verbos."
  },
  "questions": [
    {
      "id": 1,
      "infinitive": {
        "en": "to speak",
        "es": "hablar"
      },
      "tense": {
        "en": "present",
        "es": "presente"
      },
      "pronouns": [
        {
          "pronoun": {
            "en": "I",
            "es": "yo"
          },
          "correct_answer": "hablo"
        },
        {
          "pronoun": {
            "en": "you (informal)",
            "es": "tú"
          },
          "correct_answer": "hablas"
        }
      ]
    }
  ]
}
```

**Key Fields:**
- `infinitive`: LocalizedText - Verb in infinitive form
- `tense`: LocalizedText - Tense name
- `pronouns`: Array - List of pronouns with answers
- `pronouns[].correct_answer`: String - Expected conjugation

---

## Extended Response

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 2528,
    "min_words": 50
  },
  "instructions": {
    "en": "Write a short essay about your favorite hobby.",
    "es": "Escribe un ensayo breve sobre tu pasatiempo favorito."
  },
  "prompts": [
    {
      "id": 1,
      "prompt": {
        "en": "Describe your hobby in detail.",
        "es": "Describe tu pasatiempo en detalle."
      },
      "required_elements": [
        "introduction",
        "main_points",
        "conclusion"
      ]
    }
  ]
}
```

**Key Fields:**
- `min_words`: Number - Minimum word count requirement
- `required_elements`: Array<string> (optional) - Required essay sections

---

## Oral Practice

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 3057,
    "max_recording_seconds": 60
  },
  "instructions": {
    "en": "Record yourself reading the following sentences.",
    "es": "Grábate leyendo las siguientes oraciones."
  },
  "prompts": [
    {
      "id": 1,
      "text": {
        "en": "The quick brown fox jumps over the lazy dog.",
        "es": "El veloz zorro marrón salta sobre el perro perezoso."
      },
      "reference_audio_url": "https://example.com/audio/prompt1.mp3"
    }
  ]
}
```

**Key Fields:**
- `max_recording_seconds`: Number - Maximum recording duration
- `reference_audio_url`: String (optional) - URL to example audio

---

## Paragraph Correction

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 3074
  },
  "instructions": {
    "en": "Find and correct all errors in the paragraph.",
    "es": "Encuentra y corrige todos los errores en el párrafo."
  },
  "paragraphs": [
    {
      "id": 1,
      "words": [
        {
          "text": "El",
          "isError": false
        },
        {
          "text": "gato",
          "isError": true,
          "correctForm": "gatos",
          "errorType": "agreement"
        },
        {
          "text": " ",
          "isError": false
        },
        {
          "text": "son",
          "isError": false
        },
        {
          "text": " ",
          "isError": false
        },
        {
          "text": "bonito",
          "isError": true,
          "correctForm": "bonitos",
          "errorType": "agreement"
        },
        {
          "text": ".",
          "isError": false
        }
      ]
    }
  ]
}
```

**Key Fields:**
- `words[].isError`: Boolean - Whether word contains error
- `words[].correctForm`: String (required if isError=true) - Correct version
- `words[].errorType`: String (optional) - Error category

**Error Types:**
- `agreement` - Gender/number agreement
- `conjugation` - Verb conjugation
- `spelling` - Spelling mistake
- `accent` - Accent marks
- `vocabulary` - Wrong word choice

---

## AI Composition

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 1,
    "ai_enabled": true,
    "min_words": 100
  },
  "instructions": {
    "en": "Write a creative story. The AI will provide feedback.",
    "es": "Escribe una historia creativa. La IA proporcionará retroalimentación."
  },
  "prompt": {
    "en": "Write about a memorable experience from your childhood.",
    "es": "Escribe sobre una experiencia memorable de tu infancia."
  },
  "rubric_criteria": [
    {
      "name": {
        "en": "Grammar",
        "es": "Gramática"
      },
      "weight": 0.3
    },
    {
      "name": {
        "en": "Vocabulary",
        "es": "Vocabulario"
      },
      "weight": 0.3
    },
    {
      "name": {
        "en": "Creativity",
        "es": "Creatividad"
      },
      "weight": 0.2
    },
    {
      "name": {
        "en": "Organization",
        "es": "Organización"
      },
      "weight": 0.2
    }
  ]
}
```

**Key Fields:**
- `ai_enabled`: Boolean - Enable AI feedback
- `min_words`: Number - Minimum word count
- `rubric_criteria`: Array - Scoring criteria
- `rubric_criteria[].weight`: Number - Weight in final score (sum should = 1.0)

---

## AI Chat

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 1,
    "ai_enabled": true,
    "conversation_starter": {
      "en": "Hello! I'm here to help you practice Spanish. What would you like to talk about?",
      "es": "¡Hola! Estoy aquí para ayudarte a practicar español. ¿De qué te gustaría hablar?"
    }
  },
  "instructions": {
    "en": "Have a conversation with the AI tutor in Spanish.",
    "es": "Ten una conversación con el tutor de IA en español."
  },
  "scenario": {
    "en": "You are ordering food at a restaurant in Madrid.",
    "es": "Estás pidiendo comida en un restaurante en Madrid."
  },
  "conversation_goals": [
    {
      "en": "Order a main dish",
      "es": "Pedir un plato principal"
    },
    {
      "en": "Ask about ingredients",
      "es": "Preguntar sobre los ingredientes"
    },
    {
      "en": "Request the check",
      "es": "Pedir la cuenta"
    }
  ]
}
```

**Key Fields:**
- `conversation_starter`: LocalizedText - AI's first message
- `scenario`: LocalizedText - Conversation context
- `conversation_goals`: Array<LocalizedText> - Learning objectives

---

## Dropdown Selection

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 2520
  },
  "instructions": {
    "en": "Select the correct option from each dropdown.",
    "es": "Selecciona la opción correcta de cada menú desplegable."
  },
  "sentences": [
    {
      "id": 1,
      "parts": [
        {
          "text": "Yo ",
          "type": "text"
        },
        {
          "type": "dropdown",
          "options": ["como", "comes", "come", "comemos"],
          "correctAnswer": "como"
        },
        {
          "text": " manzanas todos los días.",
          "type": "text"
        }
      ]
    }
  ]
}
```

**Key Fields:**
- `parts`: Array - Sentence components (text or dropdown)
- `parts[].type`: "text" | "dropdown"
- `parts[].options`: Array<string> - Dropdown choices
- `parts[].correctAnswer`: String - Correct option

---

## Table Fill-in-the-Blanks

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 1287
  },
  "questions": {
    "rows": ["hablar", "comer", "vivir"],
    "columns": ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos/ellas"],
    "answers": [
      {
        "row": "hablar",
        "responses": {
          "yo": {
            "value": "hablo",
            "prefilled": true
          },
          "tú": {
            "value": "hablas",
            "prefilled": false
          },
          "él/ella": {
            "value": "habla",
            "prefilled": false
          },
          "nosotros": {
            "value": "hablamos",
            "prefilled": false
          },
          "vosotros": {
            "value": "habláis",
            "prefilled": false
          },
          "ellos/ellas": {
            "value": "hablan",
            "prefilled": false
          }
        }
      }
    ]
  }
}
```

**Key Fields:**
- `rows`: Array<string> - Row headers (verbs)
- `columns`: Array<string> - Column headers (pronouns)
- `answers[].row`: String - Which row (must match rows array)
- `answers[].responses`: Object - Maps column name to cell data
- `responses[column].value`: String - Correct answer
- `responses[column].prefilled`: Boolean - If true, cell is read-only example

---

## Verb Identification

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 2100,
    "target_form": {
      "en": "preterite",
      "es": "pretérito"
    }
  },
  "instructions": {
    "en": "Tap on the verb(s) that are in the preterite tense (some sentences have none!).",
    "es": "Toca el/los verbo(s) que están en el pretérito (¡algunas oraciones no tienen ninguno!)."
  },
  "sentences": [
    {
      "id": 1,
      "words": [
        {
          "text": "Napoleón ",
          "isVerb": false
        },
        {
          "text": "ganó",
          "isVerb": true,
          "isCorrect": true
        },
        {
          "text": " la batalla, pero ",
          "isVerb": false
        },
        {
          "text": "perdió",
          "isVerb": true,
          "isCorrect": true
        },
        {
          "text": " la guerra.",
          "isVerb": false
        }
      ],
      "hasCorrectVerb": true
    },
    {
      "id": 2,
      "words": [
        {
          "text": "Si ",
          "isVerb": false
        },
        {
          "text": "tuviera",
          "isVerb": true,
          "isCorrect": false
        },
        {
          "text": " tiempo, ",
          "isVerb": false
        },
        {
          "text": "iría",
          "isVerb": true,
          "isCorrect": false
        },
        {
          "text": " al cine.",
          "isVerb": false
        }
      ],
      "hasCorrectVerb": false
    }
  ]
}
```

**Key Fields:**
- `target_form`: LocalizedText - The grammatical form to identify
- `words[].isVerb`: Boolean - Is this word clickable as a verb?
- `words[].isCorrect`: Boolean (required if isVerb=true) - Is this the target form?
- `hasCorrectVerb`: Boolean - If false, correct answer is "none"

**Important:** 
- Students can select multiple verbs per sentence
- Some sentences may have NO verbs in the target form
- Distractor verbs (`isVerb: true, isCorrect: false`) test understanding

---

## Drawing Vocabulary

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 1500,
    "ai_enabled": true
  },
  "instructions": {
    "en": "Draw a picture of each vocabulary word without looking at the list.",
    "es": "Dibuja una imagen de cada palabra de vocabulario sin mirar la lista."
  },
  "vocabulary": [
    {
      "id": 1,
      "article": {
        "en": "a",
        "es": "una"
      },
      "word": {
        "en": "window",
        "es": "ventana"
      },
      "hint": {
        "en": "Draw the frame and panes",
        "es": "Dibuja el marco y los paneles"
      }
    },
    {
      "id": 2,
      "article": {
        "en": "a",
        "es": "un"
      },
      "word": {
        "en": "teacher",
        "es": "profesor"
      },
      "hint": {
        "en": "Draw a person teaching",
        "es": "Dibuja una persona enseñando"
      }
    }
  ]
}
```

**Key Fields:**
- `ai_enabled`: Boolean - Enable AI drawing evaluation
- `vocabulary[].article`: LocalizedText (optional) - Article (a, an, the, etc.)
- `vocabulary[].word`: LocalizedText - Word to draw
- `vocabulary[].hint`: LocalizedText (optional) - Drawing hint

**Drawing Submission Format:**
```json
{
  "wordId": 1,
  "imageData": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "timestamp": 1703872800000
}
```

**AI Evaluation Response Format:**
```json
{
  "score": 85,
  "feedback": {
    "en": "Great job! I can recognize the key features of a window.",
    "es": "¡Buen trabajo! Puedo reconocer las características clave de una ventana."
  },
  "recognizedElements": ["frame", "panes", "basic shape"]
}
```

---

## Validation Rules

### Three-Tier Feedback System

All text-based answers use this validation:

```typescript
// 1. Normalize for comparison
const normalize = (str: string) => {
  return str.trim().toLowerCase().replace(/[¡!¿?]/g, '');
};

// 2. Remove accents
const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// 3. Compare
const userAnswer = normalize(input);
const correctAnswer = normalize(expected);

if (userAnswer === correctAnswer) {
  status = 'correct'; // Green
} else if (removeAccents(userAnswer) === removeAccents(correctAnswer)) {
  status = 'accent'; // Yellow - correct but missing accents
} else {
  status = 'incorrect'; // Red
}
```

### Accent Marks in Spanish

Common accent marks that trigger yellow feedback:
- á, é, í, ó, ú (vowels with acute accent)
- ñ (n with tilde)
- ü (u with diaeresis)

### Punctuation Marks

Punctuation that should be normalized:
- ¡ and ! (inverted/regular exclamation)
- ¿ and ? (inverted/regular question)

---

## Response Submission Format

When submitting user answers to backend:

```json
{
  "activityId": 3062,
  "activityType": "verb_conjugation",
  "userId": "user123",
  "timestamp": 1703872800000,
  "responses": [
    {
      "questionId": 1,
      "answer": "hablo",
      "isCorrect": true,
      "timeTaken": 3500
    }
  ],
  "metadata": {
    "language": "es",
    "completionPercentage": 75,
    "score": 85
  }
}
```

---

## Progress Tracking Format

```json
{
  "activityId": 3062,
  "userId": "user123",
  "lastUpdated": 1703872800000,
  "state": {
    "currentQuestionIndex": 3,
    "answers": {
      "1": "hablo",
      "2": "hablas",
      "3": "habla"
    },
    "completedQuestions": [1, 2, 3],
    "score": 100
  }
}
```

---

## Special Fields Reference

### Common Optional Fields

```typescript
// Most activities support these optional fields:
{
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedMinutes": 15,
  "tags": ["grammar", "verbs", "present-tense"],
  "prerequisites": [3061], // IDs of prerequisite activities
  "relatedActivities": [3063, 3064],
  "metadata": {
    "author": "Dr. Smith",
    "lastModified": "2025-01-15",
    "version": "2.0"
  }
}
```

### Language Codes

Supported language codes:
- `en` - English
- `es` - Spanish (Spain)
- `es-MX` - Spanish (Mexico)
- `es-AR` - Spanish (Argentina)
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese

---

## Example: Complete Activity JSON

Here's a complete example with all fields:

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 3062,
    "difficulty": "intermediate",
    "estimatedMinutes": 10,
    "tags": ["grammar", "verbs", "present-tense"]
  },
  "instructions": {
    "en": "Conjugate the following verbs in the present tense.",
    "es": "Conjuga los siguientes verbos en tiempo presente."
  },
  "questions": [
    {
      "id": 1,
      "infinitive": {
        "en": "to speak",
        "es": "hablar"
      },
      "tense": {
        "en": "present",
        "es": "presente"
      },
      "pronouns": [
        {
          "pronoun": {
            "en": "I",
            "es": "yo"
          },
          "correct_answer": "hablo"
        }
      ]
    }
  ],
  "metadata": {
    "author": "Breaking the Barrier",
    "lastModified": "2025-12-29",
    "version": "1.0"
  }
}
```

---

**Last Updated:** December 29, 2025  
**Version:** 1.0.0
