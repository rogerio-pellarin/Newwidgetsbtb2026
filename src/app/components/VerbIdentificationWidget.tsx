import { useState, useEffect } from 'react';
import { Search, RotateCcw, Lightbulb, Check, X, Languages } from 'lucide-react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { VerbIdentificationActivity } from '../../types/activities';
import { useTheme } from '../../contexts/ThemeContext';

interface SentenceState {
  id: number;
  selectedVerbs: number[]; // Indices of selected verb words
  checked: boolean;
  isCorrect?: boolean;
}

interface VerbIdentificationWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: VerbIdentificationActivity;
}

const translations = {
  en: {
    title: 'Verb Finder',
    instructionsLabel: 'Instructions:',
    tips: 'Tips',
    clickVerbs: 'Click on verbs to select them',
    clickCheck: 'Click the check button to verify',
    someHaveNone: 'Some sentences have no verbs in this form',
    greenCorrect: 'Green = correct answer',
    redIncorrect: 'Red = incorrect answer',
    resetAll: 'Reset All',
    progress: 'Progress',
    completed: 'Completed',
    of: 'of',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    check: 'Check',
    none: 'None',
  },
  es: {
    title: 'Identificación de verbos',
    instructionsLabel: 'Instrucciones:',
    tips: 'Consejos',
    clickVerbs: 'Haz clic en los verbos para seleccionarlos',
    clickCheck: 'Haz clic en el botón de verificación para verificar',
    someHaveNone: 'Algunas oraciones no tienen verbos en esta forma',
    greenCorrect: 'Verde = respuesta correcta',
    redIncorrect: 'Rojo = respuesta incorrecta',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    completed: 'Completado',
    of: 'de',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    check: 'Verificar',
    none: 'Ninguno',
  },
};

export function VerbIdentificationWidget({ language, onLanguageToggle, activity }: VerbIdentificationWidgetProps) {
  const t = translations[language];
  const [autoSaving, setAutoSaving] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);

  // Initialize sentence states
  const [sentenceStates, setSentenceStates] = useState<SentenceState[]>(
    activity.sentences.map((sentence) => ({
      id: sentence.id,
      selectedVerbs: [],
      checked: false,
      isCorrect: undefined,
    }))
  );

  // Auto-collapse tips on mobile
  useEffect(() => {
    const handleResize = () => {
      setTipsExpanded(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChecked = sentenceStates.some((state) => state.checked);
      if (hasChecked) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [sentenceStates]);

  const toggleVerbSelection = (sentenceId: number, verbIndex: number) => {
    setSentenceStates((prev) =>
      prev.map((state) => {
        if (state.id === sentenceId && !state.checked) {
          const isSelected = state.selectedVerbs.includes(verbIndex);
          return {
            ...state,
            selectedVerbs: isSelected
              ? state.selectedVerbs.filter((idx) => idx !== verbIndex)
              : [...state.selectedVerbs, verbIndex],
          };
        }
        return state;
      })
    );
  };

  const selectNone = (sentenceId: number) => {
    setSentenceStates((prev) =>
      prev.map((state) => {
        if (state.id === sentenceId && !state.checked) {
          return {
            ...state,
            selectedVerbs: [],
          };
        }
        return state;
      })
    );
  };

  const checkAnswer = (sentenceId: number) => {
    const sentence = activity.sentences.find((s) => s.id === sentenceId);
    const state = sentenceStates.find((s) => s.id === sentenceId);

    if (!sentence || !state) return;

    // Get indices of correct verbs
    const correctVerbIndices: number[] = [];
    sentence.words.forEach((word, index) => {
      if (word.isVerb && word.isCorrect) {
        correctVerbIndices.push(index);
      }
    });

    // Check if user selection matches correct answer
    let isCorrect = false;

    if (!sentence.hasCorrectVerb) {
      // Correct answer is "none" - user should have selected no verbs
      isCorrect = state.selectedVerbs.length === 0;
    } else {
      // Check if selected verbs match correct verbs exactly
      const selectedSet = new Set(state.selectedVerbs);
      const correctSet = new Set(correctVerbIndices);

      isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((idx) => correctSet.has(idx));
    }

    setSentenceStates((prev) =>
      prev.map((s) => {
        if (s.id === sentenceId) {
          return {
            ...s,
            checked: true,
            isCorrect,
          };
        }
        return s;
      })
    );
  };

  const handleReset = () => {
    setSentenceStates(
      activity.sentences.map((sentence) => ({
        id: sentence.id,
        selectedVerbs: [],
        checked: false,
        isCorrect: undefined,
      }))
    );
  };

  const totalSentences = activity.sentences.length;
  const checkedSentences = sentenceStates.filter((state) => state.checked).length;
  const correctSentences = sentenceStates.filter((state) => state.isCorrect === true).length;

  const getSentenceState = (sentenceId: number) => {
    return sentenceStates.find((s) => s.id === sentenceId);
  };

  const instructions = activity.instructions[language] || activity.instructions.en || '';
  const targetForm = activity.settings.target_form[language] || activity.settings.target_form.en || '';

  const { theme } = useTheme();

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24"
        style={{ 
          backgroundColor: theme.primaryPale,
          borderColor: theme.primaryBorder 
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L2-3"
          breadcrumb={['Lección 2', targetForm, '3']}
          title={t.title}
          icon={Search}
          iconColor="text-white"
          iconBg=""
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: t.completed,
            color: 'text-green-800',
            bgColor: 'bg-green-100',
            icon: '✓',
          }}
        />

        <div 
          className="bg-white/60 rounded-lg p-4 border"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-gray-900">
              {t.instructionsLabel}
            </p>
            <button
              onClick={onLanguageToggle}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme.primaryBorder
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                e.currentTarget.style.backgroundColor = theme.primaryPale;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.primaryBorder;
                e.currentTarget.style.backgroundColor = 'white';
              }}
              title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              <Languages className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{language === 'en' ? 'EN' : 'ES'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {instructions}
          </p>
        </div>

        {/* Collapsible Tips Section */}
        <div 
          className="mt-6 pt-6 border-t"
          style={{ borderColor: theme.primaryBorder }}
        >
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: theme.primaryPale, color: theme.primaryDark }}
              >
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{t.tips}</span>
            </div>
            <motion.div
              animate={{ rotate: tipsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: theme.primary }}
            >
              ▼
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: tipsExpanded ? 'auto' : 0, opacity: tipsExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 text-sm text-gray-700 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.clickVerbs}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.clickCheck}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.someHaveNone}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">●</span>
                <span>{t.greenCorrect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">●</span>
                <span>{t.redIncorrect}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {/* Progress bar */}
        <div 
          className="border rounded-lg p-4"
          style={{ 
            backgroundColor: theme.primaryPale,
            borderColor: theme.primaryBorder 
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: {checkedSentences} {t.of} {totalSentences}
              {checkedSentences === totalSentences && (
                <span className="ml-2 font-medium" style={{ color: theme.primaryDark }}>
                  ({correctSentences}/{totalSentences} correct)
                </span>
              )}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.resetAll}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(checkedSentences / totalSentences) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Sentences Container */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {activity.sentences.map((sentence, index) => {
            const state = getSentenceState(sentence.id);
            if (!state) return null;

            const isChecked = state.checked;
            const isCorrect = state.isCorrect;

            return (
              <div key={sentence.id}>
                <div
                  className={`p-6 transition-colors ${
                    isChecked
                      ? isCorrect
                        ? 'bg-green-50'
                        : 'bg-red-50'
                      : state.selectedVerbs.length > 0
                      ? ''
                      : 'bg-white'
                  }`}
                  style={
                    !isChecked && state.selectedVerbs.length > 0
                      ? { backgroundColor: theme.primaryPale }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* Letter Label */}
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {String.fromCharCode(97 + index)}
                    </div>

                    {/* Sentence Content */}
                    <div className="flex-1">
                      <div className="text-gray-900 leading-relaxed mb-3">
                        {sentence.words.map((word, wordIndex) => {
                          const isSelected = state.selectedVerbs.includes(wordIndex);
                          const isVerbWord = word.isVerb;

                          if (isVerbWord) {
                            return (
                              <button
                                key={wordIndex}
                                onClick={() => !isChecked && toggleVerbSelection(sentence.id, wordIndex)}
                                disabled={isChecked}
                                className={`inline transition-colors ${
                                  isSelected
                                    ? 'text-red-600 font-medium'
                                    : 'text-gray-900'
                                } ${!isChecked && 'cursor-pointer underline decoration-dotted'} ${
                                  isChecked && 'cursor-default'
                                }`}
                                style={
                                  !isChecked && !isSelected
                                    ? { color: 'rgb(17, 24, 39)' }
                                    : undefined
                                }
                                onMouseEnter={(e) => {
                                  if (!isChecked && !isSelected) {
                                    e.currentTarget.style.color = theme.primary;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isChecked && !isSelected) {
                                    e.currentTarget.style.color = 'rgb(17, 24, 39)';
                                  }
                                }}
                              >
                                {word.text}
                              </button>
                            );
                          }

                          return <span key={wordIndex}>{word.text}</span>;
                        })}
                      </div>

                      {/* None Button */}
                      {!isChecked && (
                        <button
                          onClick={() => selectNone(sentence.id)}
                          className="px-3 py-1.5 text-sm rounded-lg border-2 transition-colors"
                          style={
                            state.selectedVerbs.length === 0
                              ? {
                                  borderColor: theme.primary,
                                  backgroundColor: theme.primaryPale,
                                  color: theme.primaryDark,
                                  fontWeight: 500,
                                }
                              : {
                                  borderColor: 'rgb(209, 213, 219)',
                                  backgroundColor: 'white',
                                  color: 'rgb(75, 85, 99)',
                                }
                          }
                          onMouseEnter={(e) => {
                            if (state.selectedVerbs.length !== 0) {
                              e.currentTarget.style.borderColor = theme.primaryBorder;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (state.selectedVerbs.length !== 0) {
                              e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                            }
                          }}
                        >
                          {t.none}
                        </button>
                      )}
                    </div>

                    {/* Check Button / Result Icon */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isChecked ? (
                          <motion.div
                            key="result"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          >
                            {isCorrect ? (
                              <Check className="w-10 h-10 text-green-600 stroke-[3]" />
                            ) : (
                              <X className="w-10 h-10 text-red-600 stroke-[3]" />
                            )}
                          </motion.div>
                        ) : (
                          <motion.button
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => checkAnswer(sentence.id)}
                            className="w-10 h-10 text-white rounded-lg flex items-center justify-center transition-colors"
                            style={{ backgroundColor: theme.primary }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryDark}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check className="w-6 h-6" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < activity.sentences.length - 1 && <div className="border-t border-gray-200" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}