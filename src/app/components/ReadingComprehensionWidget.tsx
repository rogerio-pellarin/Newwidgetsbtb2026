import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, RotateCcw, Volume2, Wand2, SkipForward, Languages, Lightbulb } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { OralPracticeActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  context?: string;
  userAnswer?: string;
  isPlaying?: boolean;
  playState?: 'stopped' | 'playing' | 'finished';
  aiFeedback?: {
    status: 'good' | 'needs-improvement';
    score: number;
    message: string;
  };
  suggestedAnswer?: string;
  showSuggested?: boolean;
}

interface ReadingComprehensionWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: OralPracticeActivity;
}

const translations = {
  en: {
    title: 'Reading Comprehension',
    instructions:
      'Listen to the audio and answer the questions with complete sentences. Practice your oral skills by speaking your answers aloud before writing them.',
    playAudio: 'Play Questions',
    pauseAudio: 'Pause Audio',
    playQuestion: 'Play',
    pauseQuestion: 'Pause',
    aiHelp: 'Ask Coach',
    showSuggested: 'Show Suggested Answer',
    hideSuggested: 'Hide Suggested Answer',
    resetAll: 'Reset All',
    progress: 'Progress',
    inProgress: 'In Progress',
    of: 'of',
    answered: 'answered',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    audioFeatures: 'Audio Features',
    listenMultiple: 'Listen multiple times',
    pauseAnytime: 'Pause anytime',
    practiceOral: 'Practice speaking aloud',
    tips: 'Tips',
  },
  es: {
    title: 'Comprensión de Lectura',
    instructions:
      'Escucha el audio y responde las preguntas con oraciones completas. Practica tus habilidades orales hablando tus respuestas en voz alta antes de escribirlas.',
    playAudio: 'Reproducir preguntas',
    pauseAudio: 'Pausar audio',
    playQuestion: 'Reproducir',
    pauseQuestion: 'Pausar',
    aiHelp: 'Preguntar Coach',
    showSuggested: 'Mostrar respuesta sugerida',
    hideSuggested: 'Ocultar respuesta sugerida',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    inProgress: 'En progreso',
    of: 'de',
    answered: 'respondidas',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    audioFeatures: 'Funciones de audio',
    listenMultiple: 'Escuchar múltiples veces',
    pauseAnytime: 'Pausar en cualquier momento',
    practiceOral: 'Practicar hablando en voz alta',
    tips: 'Consejos',
  },
};

export function ReadingComprehensionWidget({ language, onLanguageToggle, activity }: ReadingComprehensionWidgetProps) {
  const t = translations[language];
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  
  // Initialize questions from activity data
  const [questions, setQuestions] = useState<Question[]>(() =>
    activity.questions.map((q) => ({
      id: q.id,
      question: getLocalizedText(q.prompt, language),
      userAnswer: '',
      isPlaying: false,
      playState: 'stopped' as const,
      suggestedAnswer: getLocalizedText(q.suggested_answer, language),
    }))
  );

  // Update questions when language changes
  useEffect(() => {
    setQuestions(prevQuestions =>
      activity.questions.map((q, idx) => ({
        ...prevQuestions[idx],
        id: q.id,
        question: getLocalizedText(q.prompt, language),
        suggestedAnswer: getLocalizedText(q.suggested_answer, language),
      }))
    );
  }, [language, activity]);

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

  const toggleQuestionAudio = (id: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          // If stopped or finished, start playing
          if (q.playState === 'stopped' || q.playState === 'finished') {
            // Simulate audio playback
            setTimeout(() => {
              setQuestions((prev) =>
                prev.map((question) =>
                  question.id === id ? { ...question, playState: 'finished' as const } : question
                )
              );
            }, 3000); // 3 second audio simulation
            
            return { ...q, playState: 'playing' as const, isPlaying: true };
          }
          // If playing, pause
          else if (q.playState === 'playing') {
            return { ...q, playState: 'stopped' as const, isPlaying: false };
          }
        }
        return { ...q, playState: 'stopped' as const, isPlaying: false };
      })
    );
  };

  const playAllQuestions = () => {
    setIsPlayingAll(!isPlayingAll);
    // In a real implementation, this would trigger sequential playback of all questions
  };

  const getAIFeedback = (id: number) => {
    const question = questions.find((q) => q.id === id);
    if (!question || !question.userAnswer || question.userAnswer.trim() === '') return;

    // Simulate AI feedback
    const hasGoodStructure = question.userAnswer.length > 10;
    const feedback = hasGoodStructure
      ? {
          status: 'good' as const,
          score: 85,
          message: 'Excellent! Your answer is clear and grammatically correct. Good use of complete sentences.',
        }
      : {
          status: 'needs-improvement' as const,
          score: 65,
          message:
            'Try to provide more detail in your answer. Include the subject and verb, and make sure to answer the question completely.',
        };

    setQuestions(questions.map((q) => (q.id === id ? { ...q, aiFeedback: feedback } : q)));
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
        isPlaying: false,
        playState: 'stopped',
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
          identifier="BtSB1-L3-2"
          breadcrumb={['Lección 3', 'Reading Comprehension', '2']}
          title={t.title}
          icon={Mic}
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
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-semibold">{t.audioFeatures}</span>
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
                <span>{t.listenMultiple}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.pauseAnytime}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
                <span>{t.practiceOral}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Progress Section with Playback Controls */}
        <div 
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">{t.progress}</span>
            <span className="font-semibold" style={{ color: theme.primaryDark }}>
              {answeredCount} {t.of} {questions.length} {t.answered}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Playback Controls - Stacked Vertically */}
          <div className="space-y-2">
            <button
              onClick={playAllQuestions}
              className="w-full text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
              style={{
                backgroundColor: theme.primary
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t.pauseAudio}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t.playAudio}</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="w-full bg-white hover:bg-gray-50 border-2 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
              style={{
                borderColor: theme.primaryBorder
              }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetAll}</span>
            </button>
          </div>

          {/* Audio Timeline when playing */}
          {isPlayingAll && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: theme.primaryPale }}
            >
              <Volume2 className="w-4 h-4 animate-pulse" style={{ color: theme.primary }} />
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.primaryLight }}>
                <div className="h-full rounded-full w-1/3 animate-pulse" style={{ backgroundColor: theme.primary }} />
              </div>
              <span className="text-xs font-medium" style={{ color: theme.primaryDark }}>2:14</span>
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Questions Panel */}
      <div className="space-y-6">
        {/* Progress and Reset Bar with Play All */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: {answeredCount} {t.of} {questions.length} {t.answered}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={playAllQuestions}
                className="flex items-center gap-2 text-sm px-3 py-1.5 text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.primary
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
              >
                {isPlayingAll ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>{t.pauseAudio}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Play All' : 'Reproducir todo'}</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t.resetAll}
              </button>
            </div>
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
          {questions.map((question, index) => (
            <div key={question.id}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Question Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-medium text-sm">
                    {question.id}
                  </div>

                  {/* Question Text */}
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{question.question}</h3>
                    {question.context && <p className="text-sm text-gray-500 italic">{question.context}</p>}
                  </div>

                  {/* Audio Control Button */}
                  <button
                    onClick={() => toggleQuestionAudio(question.id)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      question.playState === 'playing'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title={
                      question.playState === 'playing'
                        ? t.pauseQuestion
                        : question.playState === 'finished'
                        ? (language === 'en' ? 'Replay' : 'Reproducir de nuevo')
                        : t.playQuestion
                    }
                  >
                    {question.playState === 'playing' ? (
                      <Pause className="w-4 h-4" />
                    ) : question.playState === 'finished' ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Audio Playback Indicator */}
                {question.playState === 'playing' && (
                  <div className="mb-4 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
                    <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <div className="flex-1 h-1 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-2/3 animate-pulse" />
                    </div>
                    <span className="text-xs text-emerald-700">0:05</span>
                  </div>
                )}

                {/* Answer Textarea */}
                <div className="mb-4">
                  <textarea
                    value={question.userAnswer || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Write your response here...' : 'Escribe tu respuesta aquí...'}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-emerald-400 focus:bg-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => getAIFeedback(question.id)}
                    disabled={!question.userAnswer || question.userAnswer.trim() === ''}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{t.aiHelp}</span>
                  </button>

                  <button 
                    onClick={() => toggleSuggestedAnswer(question.id)} 
                    className="text-sm text-emerald-600 hover:text-emerald-700 underline"
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
                      className="mt-4"
                    >
                      <div
                        className={`border-l-4 rounded-lg p-4 ${
                          question.aiFeedback.status === 'good'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                            : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Wand2 className={`w-4 h-4 ${question.aiFeedback.status === 'good' ? 'text-green-600' : 'text-yellow-600'}`} />
                          <span className={`text-sm font-medium ${question.aiFeedback.status === 'good' ? 'text-green-900' : 'text-yellow-900'}`}>
                            {language === 'en' ? 'AI Feedback' : 'Retroalimentación IA'} • {question.aiFeedback.score}%
                          </span>
                        </div>
                        <p className={`text-sm ${question.aiFeedback.status === 'good' ? 'text-green-800' : 'text-yellow-800'}`}>
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
                      className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{language === 'en' ? 'Suggested Answer' : 'Respuesta sugerida'}</span>
                      </div>
                      <p className="text-sm text-blue-800 italic">{question.suggestedAnswer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider (except for last item) */}
              {index < questions.length - 1 && (
                <div className="border-t border-gray-200" />
              )}
            </div>
          ))}</div>
      </div>
    </div>
  );
}
