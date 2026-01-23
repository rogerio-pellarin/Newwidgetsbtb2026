# Breaking the Barrier - Assessment Widgets Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Type System](#type-system)
4. [Widget Components](#widget-components)
5. [API Integration](#api-integration)
6. [Adding New Widgets](#adding-new-widgets)
7. [Styling & Theming](#styling--theming)
8. [Best Practices](#best-practices)

---

## Overview

This front-end system provides a comprehensive suite of interactive assessment widgets for language learning. All widgets follow a consistent two-column layout design pattern with instructions on the left and interactive content on the right.

### Key Features

- ✅ **Bilingual Support**: All content displays in English and Spanish with language toggle
- ✅ **Responsive Design**: Mobile-first approach with desktop optimization
- ✅ **Three-Tier Feedback**: Green (correct), Yellow (accent/punctuation issues), Red (incorrect)
- ✅ **AI Integration Ready**: Mock AI services ready for backend integration
- ✅ **Auto-save Simulation**: Visual feedback for save states
- ✅ **Accessibility**: Keyboard navigation and screen reader support

### Widget Types

1. Fill in the Blanks (Traditional)
2. Fill in the Blanks (AI-Enhanced)
3. Verb Conjugation
4. Extended Response
5. Oral Practice (Audio)
6. Paragraph Correction
7. AI Composition
8. AI Chat
9. Dropdown Selection
10. Table Fill-in-the-Blanks
11. Verb Identification
12. Drawing Vocabulary

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── CompactWidgetHeader.tsx      # Shared header component
│   │   ├── LanguageToggle.tsx           # Language switcher
│   │   ├── FillInBlanksWidget.tsx       # Traditional fill-in-blanks
│   │   ├── FillInBlanksAIWidget.tsx     # AI-enhanced fill-in-blanks
│   │   ├── VerbConjugationWidget.tsx    # Verb conjugation tables
│   │   ├── ExtendedResponseWidget.tsx   # Long-form text responses
│   │   ├── OralPracticeWidget.tsx       # Audio recording
│   │   ├── CorrectParagraphWidget.tsx   # Error correction
│   │   ├── AICompositionWidget.tsx      # AI writing assistant
│   │   ├── AIChatWidget.tsx             # AI conversation practice
│   │   ├── DropdownWidget.tsx           # Dropdown selections
│   │   ├── TableWidget.tsx              # Table-based exercises
│   │   ├── VerbIdentificationWidget.tsx # Verb form identification
│   │   └── DrawingVocabularyWidget.tsx  # Drawing exercises
│   └── App.tsx                          # Main application
├── types/
│   └── activities.ts                    # TypeScript type definitions
├── services/
│   └── api.ts                           # API service layer
├── data/                                # Sample JSON data files
│   ├── sample-verb-conjugation.json
│   ├── sample-fill-blanks-ai.json
│   ├── dropdown-selection-sample.json
│   ├── table-fill-blanks-sample.json
│   ├── verb-identification-sample.json
│   ├── drawing-vocabulary-sample.json
│   └── ... (other sample files)
└── styles/
    ├── theme.css                        # Global theme tokens
    └── fonts.css                        # Font imports
```

---

## Type System

### Core Types (`/src/types/activities.ts`)

All activity types share common structures and extend from base interfaces:

#### Common Structures

```typescript
// Language settings for all activities
interface LanguageSettings {
  source_language: string; // e.g., "en"
  target_language: string; // e.g., "es"
}

// Localized text appears throughout
interface LocalizedText {
  en: string;
  es: string;
  [key: string]: string; // Support for additional languages
}

// Base settings for all activities
interface BaseSettings {
  languages: LanguageSettings;
  legacy_id: number; // Your existing activity ID
}
```

#### Activity Type Discriminator

```typescript
type ActivityType =
  | "verb_conjugation"
  | "fill_in_blanks_ai"
  | "ai_composition"
  | "oral_practice"
  | "ai_chat"
  | "paragraph_correction"
  | "extended_response"
  | "dropdown_selection"
  | "table_fill_blanks"
  | "verb_identification"
  | "drawing_vocabulary";
```

---

## Widget Components

### 1. Fill in the Blanks Widget

**Component:** `FillInBlanksWidget.tsx`

**Use Case:** Traditional cloze exercises where students fill in missing words in sentences.

**Props:**

```typescript
interface FillInBlanksWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: FillInBlanksAIActivity; // Uses same structure
}
```

**JSON Structure:**

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
        "en": "The cat _ on the mat.",
        "es": "El gato _ en la alfombra."
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

**Features:**

- ✅ Three-tier color feedback (green/yellow/red)
- ✅ Inline blank inputs
- ✅ Real-time validation
- ✅ Accent-sensitive checking

---

### 2. Fill in the Blanks AI Widget

**Component:** `FillInBlanksAIWidget.tsx`

**Use Case:** AI-enhanced version with detailed feedback and hints.

**Props:** Same as Fill in the Blanks Widget

**JSON Structure:** Same as above, but with `ai_enabled: true`

**Features:**

- ✅ All features from traditional version
- ✅ AI feedback sidebar
- ✅ Submit button for AI review
- ✅ Detailed explanations

**AI Integration Point:**

```typescript
// Mock AI feedback - replace with actual API call
const getAIFeedback = async (
  questionId: number,
  userAnswer: string,
) => {
  const response = await fetch("/api/ai/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, userAnswer }),
  });
  return await response.json();
};
```

---

### 3. Verb Conjugation Widget

**Component:** `VerbConjugationWidget.tsx`

**Use Case:** Verb conjugation practice with pronoun-based tables.

**Props:**

```typescript
interface VerbConjugationWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: VerbConjugationActivity;
}
```

**JSON Structure:**

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
  ]
}
```

**Features:**

- ✅ Expandable pronoun groups
- ✅ Show/hide answer buttons
- ✅ Row-based layout
- ✅ Three-tier feedback

---

### 4. Extended Response Widget

**Component:** `ExtendedResponseWidget.tsx`

**Use Case:** Long-form writing exercises with word count tracking.

**Props:**

```typescript
interface ExtendedResponseWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: ExtendedResponseActivity;
}
```

**JSON Structure:**

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

**Features:**

- ✅ Auto-expanding textarea
- ✅ Word/character count
- ✅ Minimum word requirement
- ✅ Auto-save simulation

---

### 5. Oral Practice Widget

**Component:** `OralPracticeWidget.tsx`

**Use Case:** Audio recording for pronunciation practice.

**Props:**

```typescript
interface OralPracticeWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: OralPracticeActivity;
}
```

**JSON Structure:**

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

**Features:**

- ✅ Browser audio recording (MediaRecorder API)
- ✅ Playback controls
- ✅ Reference audio playback
- ✅ Waveform visualization
- ✅ Re-record functionality

**Audio API Integration:**

```typescript
// Upload recorded audio to backend
const uploadAudio = async (
  audioBlob: Blob,
  promptId: number,
) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("promptId", promptId.toString());

  const response = await fetch("/api/audio/upload", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};
```

---

### 6. Paragraph Correction Widget

**Component:** `CorrectParagraphWidget.tsx`

**Use Case:** Error identification and correction in text passages.

**Props:**

```typescript
interface CorrectParagraphWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: ParagraphCorrectionActivity;
}
```

**JSON Structure:**

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
        }
      ]
    }
  ]
}
```

**Features:**

- ✅ Click-to-select error words
- ✅ Inline correction input
- ✅ Error type categorization
- ✅ Batch checking

---

### 7. AI Composition Widget

**Component:** `AICompositionWidget.tsx`

**Use Case:** AI-assisted creative writing with real-time feedback.

**Props:**

```typescript
interface AICompositionWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: AICompositionActivity;
}
```

**JSON Structure:**

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
    "en": "Write about a memorable experience.",
    "es": "Escribe sobre una experiencia memorable."
  },
  "rubric_criteria": [
    {
      "name": { "en": "Grammar", "es": "Gramática" },
      "weight": 0.3
    },
    {
      "name": { "en": "Vocabulary", "es": "Vocabulario" },
      "weight": 0.3
    }
  ]
}
```

**Features:**

- ✅ Rich text editor
- ✅ AI feedback sidebar
- ✅ Submit for review
- ✅ Criteria-based scoring

**AI Integration:**

```typescript
const submitComposition = async (
  text: string,
  activityId: number,
) => {
  const response = await fetch("/api/ai/composition/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, activityId }),
  });

  return await response.json();
  // Expected response: { score, feedback, suggestions }
};
```

---

### 8. AI Chat Widget

**Component:** `AIChatWidget.tsx`

**Use Case:** Conversational practice with AI language tutor.

**Props:**

```typescript
interface AIChatWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: AIChatActivity;
}
```

**JSON Structure:**

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
      "en": "Hello! Let's practice conversation.",
      "es": "¡Hola! Practiquemos la conversación."
    }
  },
  "instructions": {
    "en": "Have a conversation with the AI tutor.",
    "es": "Ten una conversación con el tutor de IA."
  },
  "scenario": {
    "en": "You are ordering food at a restaurant.",
    "es": "Estás pidiendo comida en un restaurante."
  }
}
```

**Features:**

- ✅ Real-time chat interface
- ✅ Typing indicators
- ✅ Message history
- ✅ Grammar correction toggle
- ✅ Feedback sidebar

**Chat API Integration:**

```typescript
const sendMessage = async (
  message: string,
  conversationId: string,
) => {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      conversationId,
      language: "es",
    }),
  });

  return await response.json();
  // Expected: { reply, corrections, suggestions }
};
```

---

### 9. Dropdown Selection Widget

**Component:** `DropdownWidget.tsx`

**Use Case:** Multiple choice selections within sentence contexts.

**Props:**

```typescript
interface DropdownWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: DropdownActivity;
}
```

**JSON Structure:**

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
        { "text": "Yo ", "type": "text" },
        {
          "type": "dropdown",
          "options": ["como", "comes", "come"],
          "correctAnswer": "como"
        },
        { "text": " manzanas.", "type": "text" }
      ]
    }
  ]
}
```

**Features:**

- ✅ Inline dropdowns
- ✅ Custom styled selects
- ✅ Immediate validation
- ✅ Three-tier feedback

---

### 10. Table Fill-in-the-Blanks Widget

**Component:** `TableWidget.tsx`

**Use Case:** Grid-based exercises (e.g., verb conjugation tables).

**Props:**

```typescript
interface TableWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: TableActivity;
}
```

**JSON Structure:**

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
    "columns": ["yo", "tú", "él/ella"],
    "answers": [
      {
        "row": "hablar",
        "responses": {
          "yo": { "value": "hablo", "prefilled": true },
          "tú": { "value": "hablas" },
          "él/ella": { "value": "habla" }
        }
      }
    ]
  }
}
```

**Features:**

- ✅ Pre-filled example cells
- ✅ Editable cells only
- ✅ Real-time validation
- ✅ Row/column headers
- ✅ Three-tier feedback

---

### 11. Verb Identification Widget

**Component:** `VerbIdentificationWidget.tsx`

**Use Case:** Identify verbs in specific grammatical forms within sentences.

**Props:**

```typescript
interface VerbIdentificationWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: VerbIdentificationActivity;
}
```

**JSON Structure:**

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
    "en": "Tap on the verb(s) that are in the preterite tense.",
    "es": "Toca el/los verbo(s) que están en el pretérito."
  },
  "sentences": [
    {
      "id": 1,
      "words": [
        { "text": "El gato ", "isVerb": false },
        { "text": "corrió", "isVerb": true, "isCorrect": true },
        { "text": " rápido.", "isVerb": false }
      ],
      "hasCorrectVerb": true
    }
  ]
}
```

**Features:**

- ✅ Clickable words
- ✅ Multiple selections
- ✅ "None" option
- ✅ Check button per sentence
- ✅ Visual feedback (green checkmark / red X)

---

### 12. Drawing Vocabulary Widget

**Component:** `DrawingVocabularyWidget.tsx`

**Use Case:** Draw pictures representing vocabulary words.

**Props:**

```typescript
interface DrawingVocabularyWidgetProps {
  language: "en" | "es";
  onLanguageToggle: () => void;
  activity: DrawingVocabularyActivity;
}
```

**JSON Structure:**

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
    "en": "Draw a picture of each vocabulary word.",
    "es": "Dibuja una imagen de cada palabra de vocabulario."
  },
  "vocabulary": [
    {
      "id": 1,
      "article": { "en": "a", "es": "una" },
      "word": { "en": "window", "es": "ventana" },
      "hint": {
        "en": "Draw the frame and panes",
        "es": "Dibuja el marco y los paneles"
      }
    }
  ]
}
```

**Features:**

- ✅ HTML5 Canvas drawing
- ✅ Mouse and touch support
- ✅ Pencil/eraser tools
- ✅ 16-color palette
- ✅ 8 brush sizes
- ✅ Undo/redo
- ✅ Clear canvas
- ✅ Drawing persistence
- ✅ Thumbnail gallery
- ✅ AI evaluation (ready for integration)

**Drawing API Integration:**

```typescript
const submitDrawing = async (
  imageData: string,
  wordId: number,
) => {
  const response = await fetch("/api/ai/drawing/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageData, // Base64 PNG
      wordId,
      language: "es",
    }),
  });

  return await response.json();
  // Expected: { score: number, feedback: string, recognizedElements: string[] }
};
```

---

## API Integration

### Service Layer (`/src/services/api.ts`)

The API service layer provides a clean interface for fetching activities:

```typescript
import { activityAPI } from "../services/api";

// Fetch specific activity types
const activity = await activityAPI.fetchVerbConjugation(3062);
const fillBlanks = await activityAPI.fetchFillInBlanksAI(1);
const drawing = await activityAPI.fetchDrawingVocabulary(1500);
```

### Backend Integration Steps

#### 1. Replace Mock API with Real Endpoints

Update `/src/services/api.ts`:

```typescript
const BASE_URL =
  process.env.VITE_API_BASE_URL ||
  "https://api.breakingthebarrier.com";

export const activityAPI = {
  async fetchVerbConjugation(
    id: number,
  ): Promise<VerbConjugationActivity> {
    const response = await fetch(
      `${BASE_URL}/activities/verb-conjugation/${id}`,
    );
    if (!response.ok)
      throw new Error("Failed to fetch activity");
    return await response.json();
  },

  // Add other methods...
};
```

#### 2. Authentication

Add authentication headers:

```typescript
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

async fetchActivity(id: number) {
  const response = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getHeaders()
  });
  return await response.json();
}
```

#### 3. Submit User Responses

```typescript
export const responseAPI = {
  async submitAnswer(
    activityId: number,
    questionId: number,
    answer: string,
  ) {
    const response = await fetch(
      `${BASE_URL}/activities/${activityId}/responses`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ questionId, answer }),
      },
    );
    return await response.json();
  },

  async saveProgress(activityId: number, progress: any) {
    const response = await fetch(
      `${BASE_URL}/activities/${activityId}/progress`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(progress),
      },
    );
    return await response.json();
  },
};
```

#### 4. AI Service Integration

```typescript
export const aiAPI = {
  async getFeedback(text: string, activityType: string) {
    const response = await fetch(`${BASE_URL}/ai/feedback`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ text, activityType }),
    });
    return await response.json();
  },

  async evaluateDrawing(imageData: string, wordId: number) {
    const response = await fetch(
      `${BASE_URL}/ai/drawing/evaluate`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ imageData, wordId }),
      },
    );
    return await response.json();
  },

  async chatMessage(message: string, conversationId: string) {
    const response = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, conversationId }),
    });
    return await response.json();
  },
};
```

---

## Adding New Widgets

### Step-by-Step Guide

#### 1. Define TypeScript Types

Add to `/src/types/activities.ts`:

```typescript
export interface NewWidgetActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
    // Add custom settings
  };
  instructions: LocalizedText;
  // Add activity-specific fields
}
```

#### 2. Create Component

Create `/src/app/components/NewWidget.tsx`:

```typescript
import { useState } from 'react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { Icon } from 'lucide-react'; // Choose appropriate icon

interface NewWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: NewWidgetActivity;
}

export function NewWidget({ language, onLanguageToggle, activity }: NewWidgetProps) {
  const [state, setState] = useState(/* initial state */);

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Left Panel - Instructions */}
      <div className="bg-gradient-to-br from-[color]-50 to-[color]-50 border-2 border-[color]-200 rounded-xl p-6 h-fit lg:sticky lg:top-24">
        <CompactWidgetHeader
          identifier="BtSB1-L1-1"
          breadcrumb={['Lección 1', 'Topic', '1']}
          title="Widget Title"
          icon={Icon}
          iconColor="text-white"
          iconBg="bg-[color]-600"
          language={language}
          onLanguageToggle={onLanguageToggle}
        />

        {/* Instructions content */}
      </div>

      {/* Right Panel - Activity Content */}
      <div className="space-y-6">
        {/* Activity implementation */}
      </div>
    </div>
  );
}
```

#### 3. Add Sample Data

Create `/src/data/new-widget-sample.json`:

```json
{
  "settings": {
    "languages": {
      "source_language": "en",
      "target_language": "es"
    },
    "legacy_id": 9999
  },
  "instructions": {
    "en": "English instructions",
    "es": "Spanish instructions"
  }
}
```

#### 4. Update API Service

Add to `/src/services/api.ts`:

```typescript
import newWidgetData from "../data/new-widget-sample.json";

export const activityAPI = {
  // ... existing methods

  async fetchNewWidget(id: number): Promise<NewWidgetActivity> {
    await simulateDelay();
    return newWidgetData as NewWidgetActivity;
  },
};
```

#### 5. Update App Component

Add to `/src/app/App.tsx`:

```typescript
import { NewWidget } from './components/NewWidget';

// Add state
const [newWidgetData, setNewWidgetData] = useState<NewWidgetActivity | null>(null);

// Load data
const newWidget = await activityAPI.fetchNewWidget(9999);
setNewWidgetData(newWidget);

// Render
{activeWidget === 'new-widget' && newWidgetData && (
  <NewWidget
    language={language}
    onLanguageToggle={() => setLanguage(language === 'en' ? 'es' : 'en')}
    activity={newWidgetData}
  />
)}
```

---

## Styling & Theming

### Color System

Each widget uses a distinct color scheme:

| Widget               | Primary Color | Accent Color | Use Case              |
| -------------------- | ------------- | ------------ | --------------------- |
| Fill-in-Blanks       | Blue          | Indigo       | Traditional exercises |
| Verb Conjugation     | Purple        | Violet       | Grammar focus         |
| Extended Response    | Amber         | Orange       | Writing activities    |
| Oral Practice        | Rose          | Pink         | Audio/speaking        |
| Paragraph Correction | Emerald       | Green        | Error correction      |
| AI Composition       | Sky           | Blue         | AI-assisted writing   |
| AI Chat              | Indigo        | Blue         | Conversational        |
| Dropdown             | Violet        | Purple       | Multiple choice       |
| Table                | Indigo        | Blue         | Grid-based            |
| Verb ID              | Indigo        | Blue         | Identification        |
| Drawing              | Cyan          | Teal         | Creative activities   |

### Feedback Colors (Consistent Across All Widgets)

```css
/* Three-Tier Feedback System */

/* Correct - Perfect answer */
.correct {
  @apply bg-green-50 border-green-500 text-green-700;
}

/* Accent - Correct but missing accents/punctuation */
.accent {
  @apply bg-yellow-50 border-yellow-500 text-yellow-700;
}

/* Incorrect - Wrong answer */
.incorrect {
  @apply bg-red-50 border-red-500 text-red-700;
}
```

### Theme Tokens

Located in `/src/styles/theme.css`:

```css
@theme {
  /* Custom color palette */
  --color-primary-*: /* primary colors */;
  --color-accent-*: /* accent colors */;

  /* Typography scale */
  --font-size-*: /* font sizes */;
  --line-height-*: /* line heights */;

  /* Spacing scale */
  --spacing-*: /* spacing values */;
}
```

### Component Header Pattern

All widgets use `CompactWidgetHeader`:

```typescript
<CompactWidgetHeader
  identifier="BtSB1-L2-3"           // Unique activity ID
  breadcrumb={['Lección 2', 'Tema', '3']} // Navigation path
  title="Activity Title"            // Widget title
  icon={IconComponent}              // Lucide React icon
  iconColor="text-white"            // Icon color
  iconBg="bg-blue-600"             // Icon background
  statusBadge={{                    // Optional status
    text: 'Completed',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: '✓'
  }}
  language={language}               // Current language
  onLanguageToggle={onLanguageToggle} // Language toggle handler
/>
```

---

## Best Practices

### 1. State Management

✅ **DO:**

- Use local component state for UI-only state
- Lift state up when sharing between components
- Use `useEffect` for side effects (API calls, subscriptions)

❌ **DON'T:**

- Store derived data in state (calculate it)
- Mutate state directly (use setState)

```typescript
// Good
const [answers, setAnswers] = useState<Record<number, string>>(
  {},
);
const updateAnswer = (id: number, value: string) => {
  setAnswers((prev) => ({ ...prev, [id]: value }));
};

// Bad
const [answers, setAnswers] = useState({});
answers[id] = value; // Direct mutation
```

### 2. Accessibility

✅ **DO:**

- Use semantic HTML (`<button>`, `<input>`, etc.)
- Provide `aria-label` for icon buttons
- Ensure keyboard navigation works
- Test with screen readers

```typescript
// Good
<button
  onClick={handleSubmit}
  aria-label="Submit answers"
  className="..."
>
  <CheckIcon />
</button>

// Bad
<div onClick={handleSubmit}> // Not keyboard accessible
  Submit
</div>
```

### 3. Performance

✅ **DO:**

- Memoize expensive calculations with `useMemo`
- Debounce API calls
- Use `React.memo` for expensive components
- Lazy load images

```typescript
// Good
const sortedAnswers = useMemo(() => {
  return answers.sort((a, b) => a.id - b.id);
}, [answers]);

// Debounce auto-save
useEffect(() => {
  const timer = setTimeout(() => {
    saveProgress(answers);
  }, 1000);
  return () => clearTimeout(timer);
}, [answers]);
```

### 4. Error Handling

✅ **DO:**

- Handle network errors gracefully
- Show user-friendly error messages
- Provide retry mechanisms
- Log errors for debugging

```typescript
try {
  const data = await activityAPI.fetchActivity(id);
  setActivity(data);
} catch (error) {
  console.error("Failed to load activity:", error);
  setError("Unable to load activity. Please try again.");
}
```

### 5. Localization

✅ **DO:**

- Always provide both English and Spanish
- Keep translations object-based
- Use consistent terminology
- Test in both languages

```typescript
const translations = {
  en: {
    submit: "Submit",
    cancel: "Cancel",
  },
  es: {
    submit: "Enviar",
    cancel: "Cancelar",
  },
};

const t = translations[language];
```

### 6. Responsive Design

✅ **DO:**

- Mobile-first approach
- Test on multiple screen sizes
- Use Tailwind responsive prefixes
- Collapse/expand sections on mobile

```typescript
// Auto-collapse tips on mobile
useEffect(() => {
  const handleResize = () => {
    setTipsExpanded(window.innerWidth >= 1024);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () =>
    window.removeEventListener("resize", handleResize);
}, []);
```

### 7. Type Safety

✅ **DO:**

- Define all TypeScript interfaces
- Use strict type checking
- Avoid `any` type
- Export types for reuse

```typescript
// Good
interface Answer {
  questionId: number;
  value: string;
  isCorrect?: boolean;
}

const submitAnswer = (answer: Answer) => {
  // Type-safe
};

// Bad
const submitAnswer = (answer: any) => {
  // No type checking
};
```

### 8. Testing Considerations

When writing tests for widgets:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FillInBlanksWidget } from './FillInBlanksWidget';

test('validates answer with three-tier feedback', () => {
  const activity = { /* mock data */ };
  render(<FillInBlanksWidget activity={activity} />);

  const input = screen.getByPlaceholderText('verb');
  fireEvent.change(input, { target: { value: 'como' } });

  expect(input).toHaveClass('bg-green-50'); // Correct
});
```

---

## Backend API Endpoints Reference

### Required Endpoints

```
GET    /api/activities/:id                    // Fetch activity by ID
GET    /api/activities/type/:type/:id         // Fetch by type and ID
POST   /api/activities/:id/responses          // Submit answer
PUT    /api/activities/:id/progress           // Save progress
GET    /api/activities/:id/progress           // Get saved progress

// AI Endpoints
POST   /api/ai/feedback                       // Get AI feedback
POST   /api/ai/composition/review             // Review composition
POST   /api/ai/chat                           // Chat message
POST   /api/ai/drawing/evaluate               // Evaluate drawing

// Audio Endpoints
POST   /api/audio/upload                      // Upload recording
GET    /api/audio/:id                         // Get audio file
```

### Expected Response Formats

#### Activity Response

```json
{
  "id": 1,
  "type": "verb_conjugation",
  "settings": { ... },
  "questions": [ ... ]
}
```

#### Answer Submission Response

```json
{
  "success": true,
  "isCorrect": true,
  "feedback": "Correct!",
  "score": 100
}
```

#### AI Feedback Response

```json
{
  "score": 85,
  "feedback": {
    "en": "Good work! Consider...",
    "es": "¡Buen trabajo! Considera..."
  },
  "suggestions": [
    "Use more varied vocabulary",
    "Check verb conjugations"
  ]
}
```

---

## Environment Variables

Create `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.breakingthebarrier.com
VITE_API_KEY=your_api_key_here

# AI Services
VITE_AI_ENABLED=true
VITE_OPENAI_API_KEY=sk-...

# Feature Flags
VITE_ENABLE_AUDIO_RECORDING=true
VITE_ENABLE_DRAWING=true
```

---

## Migration Checklist

- [ ] Review all TypeScript type definitions in `/src/types/activities.ts`
- [ ] Update `/src/services/api.ts` with real API endpoints
- [ ] Configure environment variables
- [ ] Set up authentication flow
- [ ] Implement progress saving
- [ ] Connect AI services (OpenAI, etc.)
- [ ] Set up audio file storage
- [ ] Set up image storage for drawings
- [ ] Test all widgets with real data
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Set up analytics tracking
- [ ] Test responsive design
- [ ] Test accessibility
- [ ] Deploy to staging environment
- [ ] Perform user acceptance testing

---

## Support & Questions

For questions or issues, please contact:

- Technical Lead: [your-email@example.com]
- Documentation: [Link to internal docs]
- GitHub Issues: [Repository URL]

---

**Last Updated:** December 29, 2025  
**Version:** 1.0.0  
**Maintained By:** Breaking the Barrier Development Team