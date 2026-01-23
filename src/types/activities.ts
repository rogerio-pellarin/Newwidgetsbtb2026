// Common types used across activities
export interface LanguageSettings {
  source_language: 'en' | 'es';
  target_language: 'en' | 'es';
}

export interface LocalizedText {
  en?: string;
  es?: string;
}

export interface AIBehavior {
  tone: 'helpful_professional' | 'friendly' | 'encouraging';
  max_turns: number;
  language_model: 'responds_in_target_language' | 'responds_in_source_language';
  nudge_after_turn: number;
  completion_criteria: string;
}

export interface Rubric {
  fluency: boolean;
  structure: boolean;
  completion: boolean;
  vocabulary: boolean;
  subjunctive_usage?: boolean;
}

// Verb Conjugation Activity
export interface VerbConjugationQuestion {
  id: number;
  verb: string;
  verb_source: string; // English infinitive (e.g., "to be")
  conjugations: {
    yo: string[];
    tu: string[];
    el: string[];
    nosotros: string[];
    vosotros: string[];
    ellos: string[];
  };
}

export interface VerbConjugationActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: VerbConjugationQuestion[];
}

// Fill in the Blanks (AI)
export interface FillInBlanksAIQuestion {
  id: number;
  prompt: LocalizedText;
  suggested_answer: LocalizedText;
}

export interface FillInBlanksAIActivity {
  settings: {
    rubric: Rubric;
    languages: LanguageSettings;
    ai_behavior: AIBehavior;
  };
  questions: FillInBlanksAIQuestion[];
}

// AI Composition
export interface AICompositionQuestion {
  id: number;
  media?: string;
  titles: LocalizedText;
  prompts: LocalizedText;
}

export interface AICompositionActivity {
  settings: {
    rubric: Rubric;
    languages: LanguageSettings;
    ai_behavior: AIBehavior;
  };
  questions: AICompositionQuestion[];
}

// Oral Practice / Audio Comprehension
export interface OralPracticeQuestion {
  id: number;
  media: {
    start: number;
    end: number;
    suggested_answer: number;
  };
  prompt: LocalizedText;
  suggested_answer: LocalizedText;
}

export interface OralPracticeActivity {
  settings: {
    media: {
      audio: string;
    };
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: OralPracticeQuestion[];
}

// AI Chat
export interface VocabularyItem {
  en: string;
  es: string;
}

export interface AIChatActivity {
  settings: {
    media: {
      image?: string;
      video_link?: string;
    };
    rubric: Rubric;
    context: LocalizedText;
    npc_role: LocalizedText;
    npc_avatar?: string; // Optional avatar image URL for the NPC
    languages: LanguageSettings;
    ai_behavior: AIBehavior;
    scenario_goal: LocalizedText;
    student_prompt: LocalizedText;
    curriculum_info: {
      unit_title: string;
      lesson_title: string;
      country_focus: string;
    };
    grammar_targets: string[];
    scenario_description: string;
    vocabulary_highlights: VocabularyItem[];
  };
  questions: Record<string, never>; // Empty object
}

// Paragraph Correction (Find the Errors)
export interface ParagraphCorrectionQuestion {
  id: number;
  prompt: LocalizedText;
  suggested_answer: LocalizedText; // Contains HTML with <span class="orangebold">
}

export interface ParagraphCorrectionActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: ParagraphCorrectionQuestion[];
}

// Extended Response
export interface ExtendedResponseQuestion {
  id: number;
  prompts: LocalizedText;
}

export interface ExtendedResponseActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: ExtendedResponseQuestion[];
}

// Dropdown Selection
export interface DropdownOption {
  options: string[];
  position: number;
}

export interface DropdownQuestion {
  id: number;
  prompt: LocalizedText;
  suggested_answer: DropdownOption[];
}

export interface DropdownActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: DropdownQuestion[];
}

// Table Fill in the Blanks
export interface TableCellResponse {
  value: string;
  prefilled?: boolean; // If true, cell is pre-filled and non-editable
}

export interface TableAnswer {
  row: string; // Verb name (column header in original, now row name)
  responses: Record<string, TableCellResponse>; // Maps column name (pronoun) to answer
}

export interface TableQuestions {
  rows: string[]; // Verb names
  columns: string[]; // Pronouns
  answers: TableAnswer[];
}

export interface TableActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
  };
  questions: TableQuestions;
}

// Verb Identification
export interface VerbOption {
  text: string;
  isVerb: boolean; // If true, this word is clickable
  isCorrect?: boolean; // If true and isVerb, this is a correct answer
}

export interface VerbIdentificationSentence {
  id: number;
  words: VerbOption[]; // Array of words/phrases that make up the sentence
  hasCorrectVerb: boolean; // If false, the correct answer is "none"
}

export interface VerbIdentificationActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
    target_form: LocalizedText; // e.g., "passé simple" or "pretérito"
  };
  instructions: LocalizedText;
  sentences: VerbIdentificationSentence[];
}

// Drawing Vocabulary
export interface VocabularyWord {
  id: number;
  word: LocalizedText;
  article?: LocalizedText; // e.g., "una", "un"
  hint?: LocalizedText; // Optional hint text
  referenceImage?: string; // Optional reference icon/image URL
}

export interface DrawingSubmission {
  wordId: number;
  imageData: string; // Base64 encoded image
  timestamp: number;
}

export interface AIDrawingFeedback {
  score: number; // 0-100
  feedback: LocalizedText;
  recognizedElements?: string[]; // What the AI recognized
}

export interface DrawingVocabularyActivity {
  settings: {
    languages: LanguageSettings;
    legacy_id: number;
    ai_enabled: boolean;
  };
  instructions: LocalizedText;
  vocabulary: VocabularyWord[];
}

// Union type for all activities
export type Activity =
  | VerbConjugationActivity
  | FillInBlanksAIActivity
  | AICompositionActivity
  | OralPracticeActivity
  | AIChatActivity
  | ParagraphCorrectionActivity
  | ExtendedResponseActivity
  | DropdownActivity
  | TableActivity
  | VerbIdentificationActivity
  | DrawingVocabularyActivity;

// Activity type discriminator
export type ActivityType =
  | 'verb_conjugation'
  | 'fill_in_blanks_ai'
  | 'ai_composition'
  | 'oral_practice'
  | 'ai_chat'
  | 'paragraph_correction'
  | 'extended_response'
  | 'dropdown_selection'
  | 'table_fill_blanks'
  | 'verb_identification'
  | 'drawing_vocabulary';