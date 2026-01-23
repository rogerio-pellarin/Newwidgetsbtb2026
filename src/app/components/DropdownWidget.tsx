import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { DropdownActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { Languages } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  textParts: Array<{ type: 'text' | 'dropdown'; content: string; dropdownIndex?: number }>;
  dropdowns: Array<{
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
  }>;
  isSubmitted?: boolean;
}

interface DropdownWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: DropdownActivity;
}

const translations = {
  en: {
    title: 'Dropdown Match',
    instructions: 'Select the correct word or phrase from the dropdown menu to complete each sentence.',
    resetAll: 'Reset All',
    progress: 'Progress',
    inProgress: 'In Progress',
    of: 'of',
    answered: 'answered',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    selectOption: 'Select...',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    completed: 'Completed',
  },
  es: {
    title: 'Completar los espacios',
    instructions: 'Selecciona la palabra o frase correcta del menú desplegable para completar cada oración.',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    inProgress: 'En progreso',
    of: 'de',
    answered: 'respondidas',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    selectOption: 'Selecciona...',
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    completed: 'Completado',
  },
};

// Helper function to parse text with bracketed dropdowns
const parsePromptWithDropdowns = (promptText: string, dropdownOptions: Array<{ options: string[]; position: number }>) => {
  const parts: Array<{ type: 'text' | 'dropdown'; content: string; dropdownIndex?: number }> = [];
  let currentIndex = 0;
  let dropdownIndex = 0;

  // Match text in brackets
  const regex = /\[([^\]]+)\]/g;
  let match;

  while ((match = regex.exec(promptText)) !== null) {
    // Add text before the bracket
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: promptText.substring(currentIndex, match.index),
      });
    }

    // Add dropdown placeholder
    parts.push({
      type: 'dropdown',
      content: match[1], // The text inside brackets (correct answer)
      dropdownIndex: dropdownIndex,
    });

    currentIndex = match.index + match[0].length;
    dropdownIndex++;
  }

  // Add remaining text after last bracket
  if (currentIndex < promptText.length) {
    parts.push({
      type: 'text',
      content: promptText.substring(currentIndex),
    });
  }

  return parts;
};

export function DropdownWidget({ language, onLanguageToggle, activity }: DropdownWidgetProps) {
  const t = translations[language];
  const [autoSaving, setAutoSaving] = useState(false);

  // Initialize questions from activity data
  const [questions, setQuestions] = useState<Question[]>(() =>
    activity.questions.map((q) => {
      const promptText = getLocalizedText(q.prompt, language);
      const textParts = parsePromptWithDropdowns(promptText, q.suggested_answer);
      
      return {
        id: q.id,
        textParts,
        dropdowns: q.suggested_answer.map(dropdown => ({
          options: dropdown.options,
          correctAnswer: dropdown.options[0], // First option is always correct
          userAnswer: undefined,
        })),
        isSubmitted: false,
      };
    })
  );

  // Update questions when language changes
  useEffect(() => {
    setQuestions(prevQuestions =>
      activity.questions.map((q, idx) => {
        const promptText = getLocalizedText(q.prompt, language);
        const textParts = parsePromptWithDropdowns(promptText, q.suggested_answer);
        
        return {
          ...prevQuestions[idx],
          id: q.id,
          textParts,
          dropdowns: q.suggested_answer.map((dropdown, dIdx) => ({
            options: dropdown.options,
            correctAnswer: dropdown.options[0],
            userAnswer: prevQuestions[idx]?.dropdowns[dIdx]?.userAnswer,
          })),
        };
      })
    );
  }, [language, activity]);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasContent = questions.some((q) => 
        q.dropdowns.some(d => d.userAnswer !== undefined)
      );
      if (hasContent) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questions]);

  const updateDropdownAnswer = (questionId: number, dropdownIndex: number, answer: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newDropdowns = [...q.dropdowns];
          newDropdowns[dropdownIndex] = {
            ...newDropdowns[dropdownIndex],
            userAnswer: answer,
          };
          
          // Check if all dropdowns are answered
          const allAnswered = newDropdowns.every(d => d.userAnswer !== undefined);
          
          return {
            ...q,
            dropdowns: newDropdowns,
            isSubmitted: allAnswered,
          };
        }
        return q;
      })
    );
  };

  const answeredCount = questions.filter((q) => q.isSubmitted).length;
  const correctCount = questions.filter((q) => 
    q.isSubmitted && q.dropdowns.every(d => d.userAnswer === d.correctAnswer)
  ).length;

  const handleReset = () => {
    setQuestions(
      questions.map((q) => ({
        ...q,
        dropdowns: q.dropdowns.map(d => ({
          ...d,
          userAnswer: undefined,
        })),
        isSubmitted: false,
      }))
    );
  };

  const { theme } = useTheme();

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit sticky top-24"
        style={{ 
          backgroundColor: theme.primaryPale,
          borderColor: theme.primaryBorder 
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L3-2"
          breadcrumb={['Lección 3', 'Prepositions', '2']}
          title={t.title}
          icon={ChevronDown}
          iconColor="text-white"
          iconBg="bg-gradient-to-br"
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: answeredCount === questions.length && correctCount === questions.length ? t.completed : t.inProgress,
            color: answeredCount === questions.length && correctCount === questions.length ? 'text-green-800' : 'text-orange-800',
            bgColor: answeredCount === questions.length && correctCount === questions.length ? 'bg-green-100' : 'bg-orange-100',
            icon: `${Math.round((answeredCount / questions.length) * 100)}%`,
          }}
        />

        <div 
          className="bg-white/60 rounded-lg p-4 border"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-gray-900">
              {language === 'en' ? 'Instructions:' : 'Instrucciones:'}
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
            {t.instructions}
          </p>
        </div>

        <div 
          className="mt-6 pt-6 border-t"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">{t.progress}</span>
            <span style={{ color: theme.primaryDark }}>
              {answeredCount} {t.of} {questions.length} {t.answered}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          
          {answeredCount === questions.length && (
            <div className="mt-3 text-sm text-gray-700">
              <strong style={{ color: theme.primaryDark }}>Score:</strong> {correctCount} / {questions.length}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>

        <button
          onClick={handleReset}
          className="mt-6 w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetAll}</span>
        </button>
      </div>

      {/* Questions Panel */}
      <div className="space-y-6">
        {/* Progress Bar */}
        <div 
          className="border rounded-lg p-4"
          style={{ 
            backgroundColor: theme.primaryPale,
            borderColor: theme.primaryBorder 
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: <span style={{ color: theme.primaryDark }}>{answeredCount}</span> {t.of} {questions.length} {t.answered}
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
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Compact Questions Container */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {questions.map((question, index) => {
            const isAllCorrect = question.isSubmitted && question.dropdowns.every(d => d.userAnswer === d.correctAnswer);
            const hasErrors = question.isSubmitted && question.dropdowns.some(d => d.userAnswer !== d.correctAnswer);

            return (
              <div key={question.id}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Question Number */}
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {question.id}
                    </div>

                    {/* Question with inline dropdowns */}
                    <div className="flex-1 flex flex-wrap items-center gap-2 text-gray-900">
                      {question.textParts.map((part, partIndex) => {
                        if (part.type === 'text') {
                          return <span key={partIndex}>{part.content}</span>;
                        } else {
                          // Dropdown
                          const dropdownData = question.dropdowns[part.dropdownIndex!];
                          const isCorrect = dropdownData.userAnswer === dropdownData.correctAnswer;
                          const isIncorrect = dropdownData.userAnswer && !isCorrect;

                          return (
                            <div key={partIndex} className="inline-flex items-center gap-1">
                              <div className="relative inline-block">
                                <select
                                  value={dropdownData.userAnswer || ''}
                                  onChange={(e) => updateDropdownAnswer(question.id, part.dropdownIndex!, e.target.value)}
                                  className="px-3 py-1.5 border-2 rounded-lg focus:outline-none transition-colors appearance-none pr-8 text-sm font-medium border-gray-300 bg-gray-50 text-gray-700"
                                  style={
                                    question.isSubmitted
                                      ? isCorrect
                                        ? { borderColor: 'rgb(74, 222, 128)', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(22, 101, 52)' }
                                        : { borderColor: 'rgb(248, 113, 113)', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(153, 27, 27)' }
                                      : dropdownData.userAnswer
                                        ? { borderColor: theme.primary, backgroundColor: theme.primaryPale, color: theme.primaryDark }
                                        : undefined
                                  }
                                  onFocus={(e) => {
                                    if (!question.isSubmitted) {
                                      e.currentTarget.style.borderColor = theme.primary;
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (!question.isSubmitted && !dropdownData.userAnswer) {
                                      e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                                    }
                                  }}
                                >
                                  <option value="">{t.selectOption}</option>
                                  {dropdownData.options.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                              {question.isSubmitted && (
                                <span className="inline-flex">
                                  {isCorrect ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                </span>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>

                    {/* Overall Status Icon */}
                    {question.isSubmitted && (
                      <div className="flex-shrink-0">
                        {isAllCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {question.isSubmitted && hasErrors && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-400 rounded-lg p-4 ml-12">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-red-700" />
                            <p className="text-sm font-medium text-red-900">
                              {t.incorrect}
                            </p>
                          </div>
                          <div className="text-sm text-red-800 space-y-1">
                            {question.dropdowns.map((dropdown, dIdx) => {
                              if (dropdown.userAnswer !== dropdown.correctAnswer) {
                                return (
                                  <div key={dIdx}>
                                    <strong>{language === 'en' ? 'Correct answer:' : 'Respuesta correcta:'}</strong>{' '}
                                    <span className="font-medium">{dropdown.correctAnswer}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {question.isSubmitted && isAllCorrect && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-4 ml-12">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-700" />
                            <p className="text-sm font-medium text-green-900">
                              {t.correct}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider (except for last item) */}
                {index < questions.length - 1 && <div className="border-t border-gray-200" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}