import { useState, useEffect } from 'react';
import { MessageSquare, Wand2, Lightbulb, RotateCcw, Languages } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { ExtendedResponseActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  userAnswer?: string;
  aiFeedback?: {
    status: 'good' | 'needs-improvement';
    score: number;
    message: string;
    suggestions?: string[];
  };
  suggestedAnswer?: string;
  showSuggested?: boolean;
}

interface ExtendedResponseWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: ExtendedResponseActivity;
}

const translations = {
  en: {
    title: 'Open Response',
    instructions:
      'Write extended responses to the following prompts. Take your time to develop your ideas fully with multiple sentences and detailed explanations.',
    tips: 'Tips',
    useMultiple: 'Use multiple sentences',
    developIdeas: 'Develop your ideas fully',
    checkGrammar: 'Check your grammar',
    provideDetails: 'Provide specific details',
    resetAll: 'Reset All',
    progress: 'Progress',
    inProgress: 'In Progress',
    completed: 'Completed',
    of: 'of',
    answered: 'answered',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    wordsMin: 'words minimum',
    words: 'words',
    aiHelp: 'AI Help',
    showSuggested: 'Show Suggested Answer',
    hideSuggested: 'Hide Suggested Answer',
    feedback: 'Feedback',
    goodWork: 'Great work!',
    keepPracticing: 'Keep practicing!',
    tryImproving: 'Try to improve:',
  },
  es: {
    title: 'Respuesta Extendida',
    instructions:
      'Escribe respuestas extensas a las siguientes indicaciones. Tómate tu tiempo para desarrollar tus ideas completamente con múltiples oraciones y explicaciones detalladas.',
    tips: 'Consejos',
    useMultiple: 'Usa múltiples oraciones',
    developIdeas: 'Desarrolla tus ideas completamente',
    checkGrammar: 'Revisa tu gramática',
    provideDetails: 'Proporciona detalles específicos',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    inProgress: 'En progreso',
    completed: 'Completado',
    of: 'de',
    answered: 'respondidas',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    wordsMin: 'palabras mínimo',
    words: 'palabras',
    aiHelp: 'Ayuda IA',
    showSuggested: 'Mostrar respuesta sugerida',
    hideSuggested: 'Ocultar respuesta sugerida',
    feedback: 'Comentarios',
    goodWork: '¡Excelente trabajo!',
    keepPracticing: '¡Sigue practicando!',
    tryImproving: 'Intenta mejorar:',
  },
};

export function ExtendedResponseWidget({ language, onLanguageToggle, activity }: ExtendedResponseWidgetProps) {
  const t = translations[language];
  const [autoSaving, setAutoSaving] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState<number | null>(null);
  
  // Initialize questions from activity data
  const [questions, setQuestions] = useState<Question[]>(() =>
    activity.questions.map((q) => ({
      id: q.id,
      question: getLocalizedText(q.prompts, language, '').replace(/<[^>]*>/g, ''), // Strip HTML tags
    }))
  );

  // Update questions when language changes
  useEffect(() => {
    setQuestions(prevQuestions =>
      activity.questions.map((q, idx) => ({
        ...prevQuestions[idx],
        id: q.id,
        question: getLocalizedText(q.prompts, language, '').replace(/<[^>]*>/g, ''), // Strip HTML tags
      }))
    );
  }, [language, activity]);

  const suggestedAnswers: Record<number, string> = {
    1: 'Mi rutina diaria comienza a las siete de la mañana cuando suena el despertador. Primero me levanto y me ducho con agua tibia. Después de vestirme, desayuno café con tostadas mientras leo las noticias. Salgo de casa a las ocho para ir al trabajo. Durante el día, trabajo en la oficina hasta las cinco de la tarde. Por la noche, preparo la cena, veo un poco de televisión y leo antes de acostarme a las once.',
    2: 'El fin de semana pasado fue muy interesante y productivo. El sábado por la mañana fui al mercado a comprar verduras frescas y frutas. Por la tarde, me reuní con mis amigos en un café del centro donde charlamos durante horas. El domingo dediqué la mañana a hacer ejercicio en el parque. Después del almuerzo, visité a mis padres y cenamos juntos. Fue un fin de semana relajante pero lleno de actividades.',
    3: 'Comparando mi vida actual con hace cinco años, hay cambios significativos. Hace cinco años vivía en un apartamento pequeño y trabajaba en una empresa diferente. Ahora tengo una casa más grande y un trabajo mejor remunerado. También he desarrollado nuevos hobbies como la fotografía y he viajado más. Mis relaciones personales han evolucionado y tengo nuevos amigos. En general, me siento más satisfecho y equilibrado que antes.',
  };

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
      const hasContent = questions.some((q) => q.userAnswer && q.userAnswer.trim() !== '');
      if (hasContent) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questions]);

  const updateAnswer = (id: number, answer: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, userAnswer: answer, aiFeedback: undefined } : q)));
  };

  const getAIFeedback = (id: number) => {
    const question = questions.find((q) => q.id === id);
    if (!question || !question.userAnswer || question.userAnswer.trim() === '') return;

    const wordCount = question.userAnswer.trim().split(/\s+/).length;
    const hasGoodLength = wordCount >= 50;
    const hasGoodStructure = wordCount >= 30;

    const feedback = hasGoodLength
      ? {
          status: 'good' as const,
          score: 90,
          message: 'Excellent! Your response is detailed, well-structured, and demonstrates strong language skills. You\'ve provided multiple sentences with good variety and depth.',
          suggestions: [],
        }
      : {
          status: 'needs-improvement' as const,
          score: wordCount >= 30 ? 70 : 50,
          message: hasGoodStructure 
            ? 'Good start! Your response covers the topic, but could be more detailed. Try adding more specific examples and descriptions.'
            : 'Your response is too brief for an extended response. Try to write at least 50 words with multiple sentences and detailed explanations.',
          suggestions: hasGoodStructure 
            ? ['Add more specific examples', 'Use more descriptive adjectives', 'Include transitions between ideas']
            : ['Write at least 50 words', 'Use multiple sentences', 'Add more details and examples', 'Organize your thoughts into paragraphs'],
        };

    setQuestions(questions.map((q) => (q.id === id ? { ...q, aiFeedback: feedback } : q)));
  };

  const toggleSuggestedAnswer = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, showSuggested: !q.showSuggested, suggestedAnswer: suggestedAnswers[id] } : q))
    );
  };

  const countWords = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
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

  const { theme } = useTheme();

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm"
        style={{
          borderColor: theme.primaryBorder,
          backgroundColor: theme.primaryPale
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L4-1"
          breadcrumb={['Lección 4', 'Extended Response', '1']}
          title={t.title}
          icon={MessageSquare}
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
                <MessageSquare className="w-4 h-4" />
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
                <span>{t.useMultiple}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.developIdeas}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.checkGrammar}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.provideDetails}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Questions Panel */}
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: {answeredCount} {t.of} {questions.length} {t.answered}
            </span>
            <span className="text-sm font-medium text-gray-900">{Math.round((answeredCount / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  <h3 className="flex-1 text-gray-900">{question.question}</h3>
                </div>

                {/* Answer Textarea */}
                <div className="mb-4">
                  <textarea
                    value={question.userAnswer || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Write your response here...' : 'Escribe tu respuesta aquí...'}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:bg-white focus:outline-none transition-colors resize-none"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{countWords(question.userAnswer || '')} {language === 'en' ? 'words' : 'palabras'}</span>
                    <span className={countWords(question.userAnswer || '') >= 50 ? 'text-green-600 font-medium' : ''}>
                      {language === 'en' ? '(minimum 50 words)' : '(mínimo 50 palabras)'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => getAIFeedback(question.id)}
                    disabled={!question.userAnswer || countWords(question.userAnswer) < 10}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{t.aiHelp}</span>
                  </button>

                  <button
                    onClick={() => toggleSuggestedAnswer(question.id)}
                    className="text-sm text-purple-600 hover:text-purple-700 underline"
                  >
                    {question.showSuggested ? t.hideSuggested : t.showSuggested}
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
                          <span
                            className={`text-sm font-medium ${question.aiFeedback.status === 'good' ? 'text-green-900' : 'text-amber-900'}`}
                          >
                            {language === 'en' ? 'AI Feedback' : 'Retroalimentación IA'} • {question.aiFeedback.score}%
                          </span>
                        </div>
                        <p
                          className={`text-sm italic ${question.aiFeedback.status === 'good' ? 'text-green-800' : 'text-amber-800'}`}
                        >
                          {question.aiFeedback.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggested Answer */}
                <AnimatePresence>
                  {question.showSuggested && question.suggestedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">{language === 'en' ? 'Suggested Answer' : 'Respuesta sugerida'}</span>
                      </div>
                      <p className="text-sm text-purple-800 italic">{question.suggestedAnswer}</p>
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