import { useState, useEffect } from 'react';
import { Wand2, Lightbulb, RotateCcw, Languages } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { FillInBlanksAIActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  text: string;
  userAnswer?: string;
  aiFeedback?: {
    status: 'good' | 'needs-improvement';
    score: number;
    message: string;
  };
  suggestedAnswer?: string;
  reviewCount?: number;
}

// Helper function to render text with infinitive verbs in parentheses styled as blue italic
const renderQuestionText = (text: string) => {
  const parts = [];
  let currentIndex = 0;
  let partKey = 0;

  // Match text in parentheses
  const regex = /\([^)]+\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(
        <span key={`text-${partKey++}`}>{text.substring(currentIndex, match.index)}</span>
      );
    }

    // Add the matched text (in parentheses) with blue italic styling
    parts.push(
      <span key={`verb-${partKey++}`} className="text-blue-600 italic font-medium">
        {match[0]}
      </span>
    );

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (currentIndex < text.length) {
    parts.push(
      <span key={`text-${partKey++}`}>{text.substring(currentIndex)}</span>
    );
  }

  return parts.length > 0 ? parts : text;
};

interface FillInBlanksAIWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: FillInBlanksAIActivity;
}

const translations = {
  en: {
    title: 'Guided Fill-in',
    instructions: 'Answer the following questions with complete sentences.',
    review: 'Review',
    showSuggested: 'Show Suggested Answer',
    hideSuggested: 'Hide Suggested Answer',
    resetAll: 'Reset All',
    progress: 'Progress',
    inProgress: 'In Progress',
    of: 'of',
    answered: 'answered',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
  },
  es: {
    title: 'Ejercicios',
    instructions: 'Responde las siguientes preguntas con oraciones completas.',
    review: 'Revisar',
    showSuggested: 'Mostrar respuesta sugerida',
    hideSuggested: 'Ocultar respuesta sugerida',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    inProgress: 'En progreso',
    of: 'de',
    answered: 'respondidas',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
  },
};

export function FillInBlanksAIWidget({ language, onLanguageToggle, activity }: FillInBlanksAIWidgetProps) {
  const t = translations[language];
  const { theme } = useTheme();
  const [autoSaving, setAutoSaving] = useState(false);
  
  // Initialize questions from activity data
  const [questions, setQuestions] = useState<Question[]>(() =>
    activity.questions.map((q) => ({
      id: q.id,
      text: getLocalizedText(q.prompt, language),
      userAnswer: '',
      suggestedAnswer: getLocalizedText(q.suggested_answer, language),
    }))
  );

  // Update questions when language changes
  useEffect(() => {
    setQuestions(prevQuestions =>
      activity.questions.map((q, idx) => ({
        ...prevQuestions[idx],
        id: q.id,
        text: getLocalizedText(q.prompt, language),
        suggestedAnswer: getLocalizedText(q.suggested_answer, language),
      }))
    );
  }, [language, activity]);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasContent = questions.some((q) => q.userAnswer && q.userAnswer.trim() !== '');
      if (hasContent) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questions]);

  const updateAnswer = (id: number, answer: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, userAnswer: answer, aiFeedback: undefined, reviewCount: 0 } : q)));
  };

  const getAIFeedback = (id: number) => {
    const question = questions.find((q) => q.id === id);
    if (!question || !question.userAnswer || question.userAnswer.trim() === '') return;

    const currentReviewCount = question.reviewCount || 0;

    // Demo: First review gives yellow feedback, second review gives green
    let feedback;
    if (currentReviewCount === 0) {
      // First review - yellow feedback with suggestions
      feedback = {
        status: 'needs-improvement' as const,
        score: 70,
        message:
          language === 'en'
            ? 'Good start! Consider adding more detail about when you slept. Try including the word "anoche" (last night) and make sure all accents are correct.'
            : 'Buen comienzo! Considera agregar más detalle sobre cuándo dormiste. Intenta incluir la palabra "anoche" y asegúrate de que todos los acentos sean correctos.',
      };
    } else {
      // Second review - green feedback with congratulations
      feedback = {
        status: 'good' as const,
        score: 95,
        message:
          language === 'en'
            ? '¡Excelente! Your answer is now complete and accurate. Great job incorporating the feedback!'
            : '¡Excelente! Tu respuesta ahora está completa y precisa. ¡Buen trabajo incorporando la retroalimentación!',
      };
    }

    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, aiFeedback: feedback, reviewCount: currentReviewCount + 1 } : q
      )
    );
  };

  const toggleSuggestedAnswer = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, showSuggested: !q.showSuggested } : q))
    );
  };

  const answeredCount = questions.filter((q) => q.userAnswer && q.userAnswer.trim() !== '').length;

  const handleReset = () => {
    setQuestions(
      questions.map((q) => ({
        ...q,
        userAnswer: '',
        aiFeedback: undefined,
        showSuggested: false,
      }))
    );
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel - Theme colored background */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm"
        style={{
          borderColor: theme.primaryBorder,
          backgroundColor: theme.primaryPale
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L2-1"
          breadcrumb={['Lección 2', 'Complete Sentences', '1']}
          title={t.title}
          icon={Wand2}
          iconColor="text-white"
          iconBg=""
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: t.inProgress,
            color: 'text-orange-800',
            bgColor: 'bg-orange-100',
            icon: `${Math.round((answeredCount / questions.length) * 100)}%`,
          }}
        />

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-gray-900">
              {language === 'en' ? 'Instructions:' : 'Instrucciones:'}
            </p>
            <button
              onClick={onLanguageToggle}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-white border-2 rounded-md hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme.primaryBorder
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
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <div 
              className="w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="font-semibold">{language === 'en' ? 'Smart assistance' : 'Asistencia inteligente'}</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 bg-white rounded-lg p-3 shadow-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'Get instant feedback' : 'Obtén retroalimentación instantánea'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'View suggested answers' : 'Ver respuestas sugeridas'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'Auto-saves as you type' : 'Guardado automático'}</span>
            </li>
          </ul>
        </div>

        <div 
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 font-semibold">{t.progress}</span>
            <span className="text-gray-900">
              {answeredCount} {t.of} {questions.length} {t.answered}
            </span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{ 
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>

        <button 
          onClick={handleReset}
          className="mt-6 w-full bg-white hover:bg-gray-50 border-2 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          style={{
            borderColor: theme.primaryBorder
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetAll}</span>
        </button>
      </div>

      {/* Questions Panel */}
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: {answeredCount} {t.of} {questions.length} {t.answered}
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
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Compact Questions Container */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Question Number */}
                  <div 
                    className="flex-shrink-0 w-9 h-9 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {question.id}
                  </div>

                  {/* Question Text */}
                  <h3 className="flex-1 text-gray-900">{renderQuestionText(question.text)}</h3>
                </div>

                {/* Answer Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={question.userAnswer || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Write your response here...' : 'Escribe tu respuesta aquí...'}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => getAIFeedback(question.id)}
                    disabled={!question.userAnswer || question.userAnswer.trim() === ''}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{t.review}</span>
                  </button>
                </div>

                {/* AI Feedback */}
                <AnimatePresence>
                  {question.aiFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div
                        className={`border-l-4 rounded-lg p-4 ${
                          question.aiFeedback.status === 'good'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                            : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Wand2
                            className={`w-4 h-4 ${question.aiFeedback.status === 'good' ? 'text-green-700' : 'text-amber-700'}`}
                          />
                          <p
                            className={`text-sm font-medium ${question.aiFeedback.status === 'good' ? 'text-green-900' : 'text-amber-900'}`}
                          >
                            {language === 'en' ? 'AI Feedback' : 'Retroalimentación IA'}
                          </p>
                        </div>
                        <p
                          className={`text-sm italic ${question.aiFeedback.status === 'good' ? 'text-green-800' : 'text-amber-800'}`}
                        >
                          {question.aiFeedback.message}
                        </p>
                        
                        {/* Show suggested answer in feedback */}
                        {question.suggestedAnswer && (
                          <div className="mt-3 pt-3 border-t border-current/20">
                            <p className="text-sm">
                              <strong>{language === 'en' ? 'Suggested Answer:' : 'Respuesta sugerida:'}</strong>{' '}
                              {question.suggestedAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider (except for last item) */}
              {index < questions.length - 1 && (
                <div className="border-t border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}