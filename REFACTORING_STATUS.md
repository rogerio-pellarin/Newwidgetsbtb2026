# Widget Data Integration Status

## ✅ Completed Refactoring

### 1. VerbConjugationWidget
- **Status**: ✅ Complete
- **Data Source**: `VerbConjugationActivity` from `/src/types/activities.ts`
- **Sample Data**: `/src/data/sample-verb-conjugation.json`
- **Key Changes**:
  - Accepts `activity` prop
  - Initializes verbs from `activity.questions`
  - Maps backend conjugations (arrays) to UI state
  - Supports multiple correct answers per pronoun

### 2. FillInBlanksAIWidget
- **Status**: ✅ Complete
- **Data Source**: `FillInBlanksAIActivity`
- **Sample Data**: `/src/data/sample-fill-blanks-ai.json`
- **Key Changes**:
  - Uses `getLocalizedText()` for bilingual content
  - Updates questions when language changes
  - Suggested answers from backend data

### 3. ExtendedResponseWidget
- **Status**: ✅ Complete
- **Data Source**: `ExtendedResponseActivity`
- **Sample Data**: `/src/data/sample-extended-response.json`
- **Key Changes**:
  - Parses HTML prompts from backend
  - Dynamic language switching

## 🚧 Remaining Widgets

### 4. OralPracticeWidget
- **Data Source**: `OralPracticeActivity`
- **Sample Data**: `/src/data/sample-oral-practice.json`
- **Key Requirements**:
  - Parse audio file path from `settings.media.audio`
  - Use time segments (`start`, `end`, `suggested_answer` timestamps)
  - Display localized prompts and suggested answers

### 5. CorrectParagraphWidget (Find the Errors)
- **Data Source**: `ParagraphCorrectionActivity`
- **Sample Data**: `/src/data/sample-paragraph-correction.json`
- **Key Requirements**:
  - Parse HTML with `<span class="orangebold">` tags
  - Use `parseErrorHighlights()` from `/src/utils/localization.ts`
  - Display errors visually with highlighting

### 6. AICompositionWidget
- **Data Source**: `AICompositionActivity`
- **Sample Data**: `/src/data/sample-ai-composition.json`
- **Key Requirements**:
  - Display media (images) from `question.media`
  - Use titles and prompts in both languages
  - AI rubric from `settings.rubric`

### 7. AIChatWidgetResponsive
- **Data Source**: `AIChatActivity`
- **Sample Data**: `/src/data/sample-ai-chat.json`
- **Key Requirements**:
  - Display context, npc_role, scenario_goal
  - Show vocabulary_highlights list
  - Use grammar_targets and curriculum_info
  - Video/image from `settings.media`

### 8. FillInBlanksWidget (Standard, non-AI)
- **Status**: ❌ No backend data available yet
- **Action**: Keep current mock data until backend provides structure

## 📋 Refactoring Checklist for Remaining Widgets

For each widget:

```typescript
// 1. Add imports
import type { [ActivityType] } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';

// 2. Update props interface
interface [WidgetName]Props {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: [ActivityType]; // Add this
}

// 3. Initialize state from activity data
const [state, setState] = useState(() => 
  activity.questions.map((q) => ({
    ...q,
    text: getLocalizedText(q.prompt, language),
    // ... other transformations
  }))
);

// 4. Update when language changes
useEffect(() => {
  // Update localized content
}, [language, activity]);

// 5. Update App.tsx
{activeWidget === 'widget-name' && activityData && (
  <WidgetComponent
    language={language}
    onLanguageToggle={toggleLanguage}
    activity={activityData}
  />
)}
```

## 🎯 Testing Strategy

1. **Load Sample Data**: Verify all widgets display content from JSON files
2. **Language Toggle**: Test that content updates when switching languages
3. **Type Safety**: Check that TypeScript catches any data structure mismatches
4. **Backend Integration**: When ready, update API service and test with real endpoints

## 🔄 Migration to Real Backend

When connecting to the real backend:

1. Open `/src/services/api.ts`
2. Uncomment the `fetch()` calls in `fetchActivity` method:
   ```typescript
   const response = await fetch(`${this.baseUrl}/activities/${activityType}/${activityId}`);
   if (!response.ok) throw new Error('Failed to fetch activity');
   return response.json();
   ```
3. Remove the `getMockActivity` method
4. Update `baseUrl` to point to production API
5. Add error handling and loading states to App.tsx

## 📝 Notes

- All localized content uses `{ "en": "...", "es": "..." }` objects
- Use `getLocalizedText(object, language, fallback)` helper everywhere
- Verb conjugations support multiple correct answers as arrays
- Paragraph corrections include HTML that needs parsing
- AI widgets have rubrics and behavior settings in `settings`
