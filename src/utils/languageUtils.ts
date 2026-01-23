import type { LanguageSettings } from '../types/activities';

/**
 * Language Management Utilities
 * 
 * Handles source and target language management for language learning widgets.
 * The source language is what the user speaks (interface language).
 * The target language is what the user is learning (content language).
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'zh' | 'ja';

/**
 * Get the appropriate interface language based on settings
 * @param settings - Language settings from activity data
 * @param currentLanguage - Current UI language state
 * @returns The language to use for the interface
 */
export function getInterfaceLanguage(
  settings: LanguageSettings,
  currentLanguage: 'en' | 'es'
): 'en' | 'es' {
  // The interface should match the source language (what the user speaks)
  return currentLanguage;
}

/**
 * Get the target language (what the user is learning)
 */
export function getTargetLanguage(settings: LanguageSettings): 'en' | 'es' {
  return settings.target_language;
}

/**
 * Get the source language (what the user speaks)
 */
export function getSourceLanguage(settings: LanguageSettings): 'en' | 'es' {
  return settings.source_language;
}

/**
 * Check if the interface should be in the source language
 */
export function shouldUseSourceLanguage(
  settings: LanguageSettings,
  currentLanguage: 'en' | 'es'
): boolean {
  return currentLanguage === settings.source_language;
}

/**
 * Get language name in the target language
 */
export function getLanguageName(
  languageCode: 'en' | 'es',
  displayInLanguage: 'en' | 'es'
): string {
  const names: Record<'en' | 'es', Record<'en' | 'es', string>> = {
    en: {
      en: 'English',
      es: 'Inglés',
    },
    es: {
      en: 'Spanish',
      es: 'Español',
    },
  };
  
  return names[languageCode][displayInLanguage] || languageCode;
}

/**
 * Get keyboard layout hints for a language
 */
export function getKeyboardHints(language: 'en' | 'es'): {
  specialChars: string[];
  description: Record<'en' | 'es', string>;
} {
  const hints: Record<'en' | 'es', { specialChars: string[]; description: Record<'en' | 'es', string> }> = {
    en: {
      specialChars: ["'", '"'],
      description: {
        en: 'Use standard apostrophes and quotes',
        es: 'Usa apóstrofes y comillas estándar',
      },
    },
    es: {
      specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡', 'ü'],
      description: {
        en: 'Special characters: á é í ó ú ñ ¿ ¡ ü',
        es: 'Caracteres especiales: á é í ó ú ñ ¿ ¡ ü',
      },
    },
  };
  
  return hints[language];
}

/**
 * Get translation for common UI elements based on language settings
 */
export function getUITranslations(language: 'en' | 'es') {
  const translations: Record<'en' | 'es', {
    sourceLanguage: string;
    targetLanguage: string;
    switchLanguage: string;
    interfaceLanguage: string;
    contentLanguage: string;
  }> = {
    en: {
      sourceLanguage: 'Interface Language',
      targetLanguage: 'Learning Language',
      switchLanguage: 'Switch Language',
      interfaceLanguage: 'Interface',
      contentLanguage: 'Content',
    },
    es: {
      sourceLanguage: 'Idioma de la interfaz',
      targetLanguage: 'Idioma de aprendizaje',
      switchLanguage: 'Cambiar idioma',
      interfaceLanguage: 'Interfaz',
      contentLanguage: 'Contenido',
    },
  };
  
  return translations[language];
}

/**
 * Initialize UI language based on activity settings
 * Defaults to source language if not specified
 */
export function initializeLanguage(settings: LanguageSettings): 'en' | 'es' {
  return settings.source_language;
}

/**
 * Check if we should show bilingual content
 * Some widgets (like vocabulary lists) should show both languages
 */
export function shouldShowBilingual(widgetType: string): boolean {
  const bilingualWidgets = [
    'vocabulary-list',
    'ai-chat-vocabulary',
    'ai-composition-vocabulary',
  ];
  
  return bilingualWidgets.includes(widgetType);
}

/**
 * Format language toggle button text
 */
export function getLanguageToggleText(
  currentLanguage: 'en' | 'es',
  settings: LanguageSettings
): { current: string; switchTo: string } {
  return {
    current: currentLanguage === 'en' ? 'EN' : 'ES',
    switchTo: currentLanguage === 'en' ? 'ES' : 'EN',
  };
}
