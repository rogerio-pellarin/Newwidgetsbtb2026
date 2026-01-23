import { useState, useEffect } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, Languages } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion } from 'motion/react';
import { compareAnswers } from '../../utils/textMatching';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  text: string;
  blanks: { position: number; answer: string; userAnswer?: string; status?: 'perfect' | 'accent' | 'punctuation' | 'wrong' }[];
}

interface FillInBlanksWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
}

const translations = {
  en: {
    title: 'Fill-in Practice',
    instructions: 'Selecciona la forma verbal que creas que encaja mejor en las siguientes oraciones.',
    tips: 'Tips',
    clickLightbulb: 'Click the lightbulb for hints',
    usePreterite: 'Use preterite or imperfect tense',
    greenCorrect: 'Green = perfect answer',
    yellowAccent: 'Yellow = accent/punctuation',
    redWrong: 'Red = incorrect answer',
    resetAll: 'Reset All',
    progress: 'Progress',
    completed: 'Completed',
    of: 'of',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
  },
  es: {
    title: 'Ejercicios',
    instructions: 'Selecciona la forma verbal que creas que encaja mejor en las siguientes oraciones.',
    tips: 'Consejos',
    clickLightbulb: 'Haz clic en la bombilla para obtener sugerencias',
    usePreterite: 'Usa el pretérito o el imperfecto',
    greenCorrect: 'Verde = respuesta perfecta',
    yellowAccent: 'Amarillo = acento/puntuación',
    redWrong: 'Rojo = respuesta incorrecta',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    completed: 'Completado',
    of: 'de',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
  },
};

export function FillInBlanksWidget({ language, onLanguageToggle }: FillInBlanksWidgetProps) {
  const t = translations[language];
  const { theme } = useTheme(); // Get current book theme
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [autoSaving, setAutoSaving] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'Cuando yo _____ (ser) joven, siempre _____ (ir) a la playa.',
      blanks: [
        { position: 0, answer: 'era', userAnswer: '' },
        { position: 1, answer: 'iba', userAnswer: '' },
      ],
    },
    {
      id: 2,
      text: 'Ayer _____ (estudiar) toda la tarde.',
      blanks: [{ position: 0, answer: 'estudié', userAnswer: '' }],
    },
    {
      id: 3,
      text: 'Mientras _____ (caminar), _____ (ver) un accidente.',
      blanks: [
        { position: 0, answer: 'caminaba', userAnswer: '' },
        { position: 1, answer: 'vi', userAnswer: '' },
      ],
    },
  ]);

  // Auto-collapse tips on mobile
  useEffect(() => {
    const handleResize = () => {
      setTipsExpanded(window.innerWidth >= 1024);
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasContent = questions.some((q) => q.blanks.some((b) => b.userAnswer && b.userAnswer.trim() !== ''));
      if (hasContent) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questions]);

  const updateAnswer = (questionId: number, blankIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedBlanks = [...q.blanks];
          updatedBlanks[blankIndex] = { ...updatedBlanks[blankIndex], userAnswer: value, status: undefined };
          return { ...q, blanks: updatedBlanks };
        }
        return q;
      })
    );
  };

  const checkAnswer = (questionId: number, blankIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedBlanks = [...q.blanks];
          const blank = updatedBlanks[blankIndex];
          
          // Use smart matching utility
          if (blank.userAnswer && blank.userAnswer.trim() !== '') {
            blank.status = compareAnswers(blank.userAnswer, blank.answer);
          }

          return { ...q, blanks: updatedBlanks };
        }
        return q;
      })
    );
  };

  const getInputClassName = (blank: Question['blanks'][0]) => {
    if (blank.status === 'perfect') {
      return 'border-green-400 bg-green-50 text-green-900';
    }
    if (blank.status === 'accent') {
      return 'border-yellow-400 bg-yellow-50 text-yellow-900';
    }
    if (blank.status === 'punctuation') {
      return 'border-yellow-400 bg-yellow-50 text-yellow-900';
    }
    if (blank.status === 'wrong') {
      return 'border-red-400 bg-red-50 text-red-900';
    }
    if (blank.userAnswer) {
      return 'border-blue-300 bg-blue-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const toggleAnswer = (id: number) => {
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTextPart = (text: string) => {
    // Regex to match text in parentheses (infinitive verbs like "(ser)", "(ir)", etc.)
    const regex = /(\([^)]+\))/g;
    const parts = [];
    let lastIndex = 0;
    let partKey = 0;

    text.split(regex).forEach((segment, index) => {
      if (regex.test(segment)) {
        // This is text in parentheses - style it as coral/red italic to match BtB design
        parts.push(
          <span key={`verb-${partKey++}`} className="text-[#ff6b6b] italic font-medium">
            {segment}
          </span>
        );
      } else if (segment) {
        // Regular text
        parts.push(<span key={`text-${partKey++}`}>{segment}</span>);
      }
    });

    return parts;
  };

  const renderTextWithBlanks = (text: string, questionId: number, blanks: Question['blanks']) => {
    const parts = text.split('_____');
    return (
      <div className="flex flex-wrap items-center gap-2">
        {parts.map((part, index) => (
          <span key={index} className="inline-flex items-center gap-2">
            <span className="text-gray-900">{renderTextPart(part)}</span>
            {index < blanks.length && (
              <motion.input
                type="text"
                value={blanks[index].userAnswer || ''}
                onChange={(e) => updateAnswer(questionId, index, e.target.value)}
                onBlur={() => blanks[index].userAnswer && checkAnswer(questionId, index)}
                className={`w-32 px-3 py-1.5 border-2 rounded-lg focus:outline-none transition-all ${getInputClassName(
                  blanks[index]
                )}`}
                placeholder="..."
                whileFocus={{ scale: 1.02 }}
                animate={
                  blanks[index].status === 'perfect' ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } } : {}
                }
              />
            )}
          </span>
        ))}
      </div>
    );
  };

  const renderAnswerPhrase = (text: string, blanks: Question['blanks']) => {
    const parts = text.split('_____');
    return (
      <div className="flex flex-wrap items-baseline gap-1">
        {parts.map((part, index) => (
          <span key={index} className="inline-flex items-baseline gap-1">
            <span className="text-gray-900">{renderTextPart(part)}</span>
            {index < blanks.length && (
              <span className="font-bold text-[#ff6b6b]">
                {blanks[index].answer}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const handleReset = () => {
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        blanks: q.blanks.map((b) => ({ ...b, userAnswer: '', status: undefined })),
      }))
    );
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel - Theme colored background with soft border */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm"
        style={{ 
          borderColor: theme.primaryBorder,
          backgroundColor: theme.primaryPale
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L1-1"
          breadcrumb={['Lección 1', 'Preterite vs Imperfect', '1']}
          title={t.title}
          icon={CheckCircle2}
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

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-[#1a1f36]">
              {language === 'en' ? 'Instructions:' : 'Instrucciones:'}
            </p>
            <button
              onClick={onLanguageToggle}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme.primaryBorder,
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

        {/* Collapsible Tips Section */}
        <div 
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: theme.primary }}
              >
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="font-semibold">{t.tips}</span>
            </div>
            <motion.div
              animate={{ rotate: tipsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: theme.primary }}
              className="font-bold"
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
            <ul className="space-y-2 text-sm text-gray-700 mt-3 bg-white rounded-lg p-3 shadow-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.clickLightbulb}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.usePreterite}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 font-bold">●</span>
                <span>{t.greenCorrect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5 font-bold">●</span>
                <span>{t.yellowAccent}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5 font-bold">●</span>
                <span>{t.redWrong}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Questions Section - Clean and neutral */}
      <div className="space-y-6">
        {/* Progress bar - clean white background */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {t.progress}: {questions.reduce((sum, q) => sum + q.blanks.filter((b) => b.status === 'perfect').length, 0)} {t.of}{' '}{questions.reduce((sum, q) => sum + q.blanks.length, 0)}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              {t.resetAll}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{ 
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (questions.reduce((sum, q) => sum + q.blanks.filter((b) => b.status === 'perfect').length, 0) /
                    questions.reduce((sum, q) => sum + q.blanks.length, 0)) *
                  100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Compact Questions Container */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Question Number - Bold theme color */}
                  <div 
                    className="flex-shrink-0 w-9 h-9 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {index + 1}
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 space-y-4">
                    {renderTextWithBlanks(question.text, question.id, question.blanks)}

                    {/* Answer Button */}
                    <button
                      onClick={() => toggleAnswer(question.id)}
                      className="inline-flex items-center gap-2 text-sm font-medium transition-all"
                      style={{
                        color: showAnswers[question.id] ? theme.primaryDark : '#6B7280'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.primary;
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = showAnswers[question.id] ? theme.primaryDark : '#6B7280';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showAnswers[question.id] ? (language === 'en' ? 'Hide answer' : 'Ocultar respuesta') : (language === 'en' ? 'Show answer' : 'Mostrar respuesta')}
                    </button>

                    {/* Answer */}
                    {showAnswers[question.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-l-4 rounded-r-lg p-4 bg-gray-50"
                        style={{ 
                          borderColor: theme.primary
                        }}
                      >
                        <div className="text-base leading-relaxed">
                          {renderAnswerPhrase(question.text, question.blanks)}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
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