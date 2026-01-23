# Sample Activity Data

This directory contains sample JSON files that match the data structures returned by the Breaking the Barrier backend API.

## Purpose

These files serve multiple purposes:
1. **Development & Testing** - Allow widget development without requiring backend connectivity
2. **Type Validation** - Verify TypeScript interfaces match real backend data structures
3. **Documentation** - Show developers exactly what data format each activity expects
4. **Easy Migration** - When backend is ready, simply update the API service to fetch real data

## Files

- **`sample-verb-conjugation.json`** - Verb conjugation exercise with multiple correct answers
- **`sample-fill-blanks-ai.json`** - AI-powered fill in the blanks with suggested answers
- **`sample-ai-composition.json`** - AI composition writing prompts with media
- **`sample-oral-practice.json`** - Audio comprehension with time-segmented questions
- **`sample-ai-chat.json`** - Conversational AI chat scenario with vocabulary and goals
- **`sample-paragraph-correction.json`** - Find the errors activity with HTML-highlighted corrections
- **`sample-extended-response.json`** - Open-ended writing prompts

## Usage

The API service (`/src/services/api.ts`) automatically uses these files:

```typescript
import { activityAPI } from '../services/api';

// Fetch a verb conjugation activity
const activity = await activityAPI.fetchVerbConjugation(3062);

// Fetch AI chat scenario
const chatActivity = await activityAPI.fetchAIChat(1);
```

## Migration to Real Backend

When ready to connect to the real backend:

1. Open `/src/services/api.ts`
2. Uncomment the actual `fetch()` calls in the `fetchActivity` method
3. Remove the `getMockActivity` method
4. Update the `baseUrl` to point to your backend API

That's it! The TypeScript types ensure everything stays consistent.

## Data Structure Notes

### Localized Content
Most content uses language-keyed objects:
```json
{
  "en": "English text",
  "es": "Spanish text"
}
```

Use the `getLocalizedText()` helper from `/src/utils/localization.ts` to extract the correct language.

### HTML in Answers
Paragraph correction activities use HTML with `<span class="orangebold">` to highlight errors:
```json
{
  "suggested_answer": {
    "es": "Buenos días. <span class=\"orangebold\">Son</span> las seis..."
  }
}
```

Use the `parseErrorHighlights()` helper to extract and display these properly.

### Media References
- **Audio**: `settings.media.audio` contains filename (e.g., `"EL_GLACIAR_PERITO_MORENO.mp3"`)
- **Images**: `media` or `settings.media.image` contains filename
- **Video**: `settings.media.video_link` contains Vimeo video ID
- **Timestamps**: Oral practice includes `start`, `end`, and `suggested_answer` times in seconds

### Multiple Correct Answers
Verb conjugations support multiple correct answers as arrays:
```json
{
  "conjugations": {
    "yo": ["estoy"]
  }
}
```

Always check if the user's answer is in the array.
