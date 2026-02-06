import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, Eye, Lightbulb, Languages, Check, Sparkles, ArrowLeftRight, Star, Trophy, Award } from 'lucide-react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { OralPracticeActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  suggestedAnswer: string;
  status: 'pending' | 'listening' | 'recording' | 'completed';
  showQuestion?: boolean;
  showAnswer?: boolean;
  userRecorded?: boolean;
}

interface ListeningComprehensionWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: OralPracticeActivity;
}

const translations = {
  en: {
    title: 'Listening Comprehension',
    instructions: 'Listen carefully to each question and respond in Spanish. Click Start on the first question to begin.',
    howItWorks: 'How it works',
    step1: '1. Click Start on question #1',
    step2: '2. Listen to the question',
    step3: '3. Answer using the microphone',
    step4: '4. Continue to next question',
    tips: 'Tips',
    tipListen: 'Listen carefully before answering',
    tipReveal: 'Reveal question text if needed',
    tipSuggested: 'Show suggested answer for help',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart All',
    progress: 'Progress',
    completed: 'Completed',
    of: 'of',
    listening: 'Listening...',
    yourTurn: 'Your turn to answer',
    recording: 'Recording...',
    showQuestion: 'Show Question Text',
    hideQuestion: 'Hide Question Text',
    showAnswer: 'Show Suggested Answer',
    hideAnswer: 'Hide Suggested Answer',
    allComplete: 'Great job! All questions completed!',
    reviewAnswers: 'Review your answers below',
    clickToPlay: 'Click to play question',
    switchToAskQuestions: 'Ask Questions',
    switchToGiveAnswers: 'Give Answers',
    modeGiveAnswers: 'Mode: Give Answers',
    modeAskQuestions: 'Mode: Ask Questions',
    instructionsGiveAnswers: 'Listen carefully to each question and respond in Spanish. Click Start on the first question to begin.',
    instructionsAskQuestions: 'Read each question aloud, then listen to a suggested answer. Click Start on the first question to begin.',
    step1GiveAnswers: '1. Click Start on question #1',
    step2GiveAnswers: '2. Listen to the question',
    step3GiveAnswers: '3. Answer using the microphone',
    step4GiveAnswers: '4. Continue to next question',
    step1AskQuestions: '1. Click Start on question #1',
    step2AskQuestions: '2. Read and ask the question',
    step3AskQuestions: '3. Listen to the suggested answer',
    step4AskQuestions: '4. Continue to next question',
    listeningQuestion: 'Listening to question...',
    speakingAnswer: 'Speak your answer now...',
    askingQuestion: 'Ask the question now...',
    listeningAnswer: 'Listening to answer...',
  },
  es: {
    title: 'Comprensión Auditiva',
    instructions: 'Escucha atentamente cada pregunta y responde en español. Haz clic en Comenzar en la primera pregunta para empezar.',
    howItWorks: 'Cómo funciona',
    step1: '1. Haz clic en Comenzar en pregunta #1',
    step2: '2. Escucha la pregunta',
    step3: '3. Responde usando el micrófono',
    step4: '4. Continúa a la siguiente pregunta',
    tips: 'Consejos',
    tipListen: 'Escucha con atención antes de responder',
    tipReveal: 'Revela el texto si es necesario',
    tipSuggested: 'Muestra la respuesta sugerida para ayuda',
    start: 'Comenzar',
    pause: 'Pausar',
    resume: 'Reanudar',
    restart: 'Reiniciar todo',
    progress: 'Progreso',
    completed: 'Completado',
    of: 'de',
    listening: 'Escuchando...',
    yourTurn: 'Tu turno de responder',
    recording: 'Grabando...',
    showQuestion: 'Mostrar texto de pregunta',
    hideQuestion: 'Ocultar texto de pregunta',
    showAnswer: 'Mostrar respuesta sugerida',
    hideAnswer: 'Ocultar respuesta sugerida',
    allComplete: '¡Excelente trabajo! ¡Todas las preguntas completadas!',
    reviewAnswers: 'Revisa tus respuestas a continuación',
    clickToPlay: 'Haz clic para reproducir pregunta',
    switchToAskQuestions: 'Hacer preguntas',
    switchToGiveAnswers: 'Dar respuestas',
    modeGiveAnswers: 'Modo: Dar respuestas',
    modeAskQuestions: 'Modo: Hacer preguntas',
    instructionsGiveAnswers: 'Escucha atentamente cada pregunta y responde en español. Haz clic en Comenzar en la primera pregunta para empezar.',
    instructionsAskQuestions: 'Lee cada pregunta en voz alta, luego escucha una respuesta sugerida. Haz clic en Comenzar en la primera pregunta para empezar.',
    step1GiveAnswers: '1. Haz clic en Comenzar en pregunta #1',
    step2GiveAnswers: '2. Escucha la pregunta',
    step3GiveAnswers: '3. Responde usando el micrófono',
    step4GiveAnswers: '4. Continúa a la siguiente pregunta',
    step1AskQuestions: '1. Haz clic en Comenzar en pregunta #1',
    step2AskQuestions: '2. Lee y haz la pregunta',
    step3AskQuestions: '3. Escucha la respuesta sugerida',
    step4AskQuestions: '4. Continúa a la siguiente pregunta',
    listeningQuestion: 'Escuchando la pregunta...',
    speakingAnswer: 'Di tu respuesta ahora...',
    askingQuestion: 'Haz la pregunta ahora...',
    listeningAnswer: 'Escuchando la respuesta...',
  },
};

export function ListeningComprehensionWidget({ language, onLanguageToggle, activity }: ListeningComprehensionWidgetProps) {
  const t = translations[language];
  const { theme } = useTheme();
  const [isPaused, setIsPaused] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [allCompleted, setAllCompleted] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [roleMode, setRoleMode] = useState<'giveAnswers' | 'askQuestions'>('giveAnswers');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const questionAudioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [questions, setQuestions] = useState<Question[]>(() =>
    activity.questions.map((q) => ({
      id: q.id,
      question: getLocalizedText(q.prompt, language),
      suggestedAnswer: getLocalizedText(q.suggested_answer, language),
      status: 'pending' as const,
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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (questionAudioTimeoutRef.current) clearTimeout(questionAudioTimeoutRef.current);
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    };
  }, []);

  // Auto-scroll to active question (especially important for mobile)
  useEffect(() => {
    if (currentQuestionIndex !== null && questionRefs.current[currentQuestionIndex]) {
      const element = questionRefs.current[currentQuestionIndex];
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only scroll if the element is below the bottom of the viewport
      if (rect.bottom > windowHeight) {
        const yOffset = -100; // Offset from top for sticky header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [currentQuestionIndex]);

  // Scroll to top when all questions are completed
  useEffect(() => {
    if (allCompleted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allCompleted]);

  const completedCount = questions.filter((q) => q.status === 'completed').length;

  const handleStart = () => {
    setIsPaused(false);
    setAllCompleted(false);
    
    // Use setTimeout to ensure state updates complete before starting
    setTimeout(() => {
      if (currentQuestionIndex === null) {
        // Start with the appropriate phase based on role mode
        if (roleMode === 'giveAnswers') {
          playQuestion(0); // Give Answers: Listen first, then record
        } else {
          startRecording(0); // Ask Questions: Record first, then listen
        }
      }
    }, 50);
  };

  const handleRestart = () => {
    // Stop any ongoing activity
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (questionAudioTimeoutRef.current) clearTimeout(questionAudioTimeoutRef.current);
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    
    // Reset all state
    setQuestions(questions.map(q => ({
      ...q,
      status: 'pending' as const,
      showQuestion: false,
      showAnswer: false,
      userRecorded: false,
    })));
    setCurrentQuestionIndex(null);
    setIsPaused(true);
    setAllCompleted(false);
  };

  const playQuestion = (index: number) => {
    if (isPaused) return;
    
    setCurrentQuestionIndex(index);
    setQuestions(prev => prev.map((q, i) => ({
      ...q,
      status: i === index ? 'listening' as const : q.status,
    })));

    // Simulate audio playback - get timing from activity data
    const questionData = activity.questions[index];
    const duration = ((questionData.media.end - questionData.media.start) / 1000) * 1000; // Convert to ms

    console.log('Playing question', index, 'for', duration, 'ms');

    // Play actual audio if available
    if (audioRef.current && activity.settings.media.audio) {
      audioRef.current.currentTime = questionData.media.start / 1000;
      audioRef.current.play().catch(err => {
        console.log('Audio playback not available, using simulation only:', err.message);
      });
    }

    // After question finishes, move to recording phase - DOUBLED duration
    questionAudioTimeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        startRecording(index);
      }
    }, Math.max(duration * 2, 4000)); // Doubled - Minimum 4 seconds
  };

  const startRecording = (index: number) => {
    if (isPaused) return;

    setCurrentQuestionIndex(index);
    setQuestions(prev => prev.map((q, i) => ({
      ...q,
      status: i === index ? 'recording' as const : q.status,
    })));

    // Simulate recording - DOUBLED to 7 seconds
    recordingTimeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        // In "Ask Questions" mode, after recording, play the answer
        if (roleMode === 'askQuestions') {
          playAnswer(index);
        } else {
          // In "Give Answers" mode, complete after recording
          completeQuestion(index);
        }
      }
    }, 7000);
  };

  const playAnswer = (index: number) => {
    if (isPaused) return;
    
    setCurrentQuestionIndex(index);
    setQuestions(prev => prev.map((q, i) => ({
      ...q,
      status: i === index ? 'listening' as const : q.status,
    })));

    // Simulate answer playback - calculate duration based on answer length
    // Approximate: 150 words per minute = 2.5 words per second
    const answerText = questions[index].suggestedAnswer;
    const wordCount = answerText.split(' ').length;
    const estimatedDuration = (wordCount / 2.5) * 1000; // Convert to milliseconds
    const duration = Math.max(estimatedDuration * 2, 4000); // Doubled, minimum 4 seconds
    
    console.log('Playing answer for question', index, 'for', duration, 'ms');

    // After answer finishes, complete the question
    questionAudioTimeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        completeQuestion(index);
      }
    }, duration);
  };

  const completeQuestion = (index: number) => {
    setQuestions(prev => prev.map((q, i) => ({
      ...q,
      status: i === index ? 'completed' as const : q.status,
      userRecorded: i === index ? true : q.userRecorded,
    })));

    // Check if this was the last question
    if (index === questions.length - 1) {
      setAllCompleted(true);
      setCurrentQuestionIndex(null);
    } else {
      // Move to next question after a brief delay
      setTimeout(() => {
        if (!isPaused) {
          // Start the next question based on the mode
          if (roleMode === 'giveAnswers') {
            playQuestion(index + 1); // Give Answers: start with listening
          } else {
            startRecording(index + 1); // Ask Questions: start with recording
          }
        }
      }, 800);
    }
  };

  const toggleShowQuestion = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  const toggleShowAnswer = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleRoleMode = () => {
    // Stop any ongoing activity
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (questionAudioTimeoutRef.current) clearTimeout(questionAudioTimeoutRef.current);
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    
    // Reset all state first
    setCurrentQuestionIndex(null);
    setAllCompleted(false);
    setIsPaused(true);
    
    // Switch mode
    const newMode = roleMode === 'giveAnswers' ? 'askQuestions' : 'giveAnswers';
    setRoleMode(newMode);
    
    // Reset questions
    setQuestions(questions.map(q => ({
      ...q,
      status: 'pending' as const,
      showQuestion: false,
      showAnswer: false,
      userRecorded: false,
    })));
    
    // Wait for all state to settle before auto-starting
    setTimeout(() => {
      setIsPaused(false);
      setTimeout(() => {
        if (newMode === 'giveAnswers') {
          playQuestion(0); // Give Answers: Listen first, then record
        } else {
          startRecording(0); // Ask Questions: Record first, then listen
        }
      }, 100);
    }, 150);
  };

  // Determine which phase should play audio vs record based on mode
  const firstPhaseIsListening = roleMode === 'giveAnswers'; // Give Answers mode: listen first
  const firstPhaseIsRecording = roleMode === 'askQuestions'; // Ask Questions mode: record first

  // Get dynamic translations based on mode
  const getCurrentInstructions = () => {
    return roleMode === 'giveAnswers' ? t.instructionsGiveAnswers : t.instructionsAskQuestions;
  };

  const getCurrentSteps = () => {
    if (roleMode === 'giveAnswers') {
      return [t.step1GiveAnswers, t.step2GiveAnswers, t.step3GiveAnswers, t.step4GiveAnswers];
    } else {
      return [t.step1AskQuestions, t.step2AskQuestions, t.step3AskQuestions, t.step4AskQuestions];
    }
  };

  const getCurrentStatusText = (status: 'listening' | 'recording') => {
    if (roleMode === 'giveAnswers') {
      return status === 'listening' ? t.listeningQuestion : t.speakingAnswer;
    } else {
      return status === 'recording' ? t.askingQuestion : t.listeningAnswer;
    }
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel */}
      <div
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm"
        style={{
          borderColor: theme.primaryBorder,
          backgroundColor: theme.primaryPale,
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L4-LC"
          breadcrumb={['Lección 4', 'Listening', '1']}
          title={t.title}
          icon={Volume2}
          iconColor="text-white"
          iconBg=""
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: allCompleted ? t.completed : `${completedCount}/${questions.length}`,
            color: allCompleted ? 'text-green-800' : 'text-blue-800',
            bgColor: allCompleted ? 'bg-green-100' : 'bg-blue-100',
            icon: allCompleted ? '✓' : undefined,
          }}
        />

        {/* Instructions Box */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-gray-900">
              {language === 'en' ? 'Instructions:' : 'Instrucciones:'}
            </p>
            <button
              onClick={onLanguageToggle}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-white border-2 rounded-md hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme.primaryBorder,
              }}
              title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              <Languages className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{language === 'en' ? 'EN' : 'ES'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{getCurrentInstructions()}</p>
        </div>

        {/* How it Works */}
        <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.primaryBorder }}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <Volume2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-700">{t.howItWorks}</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 bg-white rounded-lg p-3 shadow-sm">
            {getCurrentSteps().map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>
                  •
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsible Tips */}
        <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.primaryBorder }}>
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
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>
                  •
                </span>
                <span>{t.tipListen}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>
                  •
                </span>
                <span>{t.tipReveal}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>
                  •
                </span>
                <span>{t.tipSuggested}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Control Buttons */}
        <div className="mt-6 space-y-3">
          {/* Role Mode Switch Button */}
          <motion.button
            onClick={toggleRoleMode}
            className="w-full text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-semibold"
            style={{ backgroundColor: theme.primary }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{roleMode === 'giveAnswers' ? t.switchToAskQuestions : t.switchToGiveAnswers}</span>
          </motion.button>

          <button
            onClick={handleRestart}
            className="w-full bg-white hover:bg-gray-50 border-2 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            style={{ borderColor: theme.primaryBorder }}
          >
            <Pause className="w-4 h-4" />
            <span>{t.restart}</span>
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.primaryBorder }}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 font-semibold">{t.progress}</span>
            <span className="text-gray-900">
              {completedCount} {t.of} {questions.length}
            </span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Questions Panel */}
      <div className="space-y-6">
        {/* Completion Message */}
        <AnimatePresence>
          {allCompleted && (
            <>
              {/* Celebration Confetti Animation */}
              <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                {/* Golden stars bursting from center */}
                {[...Array(20)].map((_, i) => {
                  const angle = (i / 20) * Math.PI * 2;
                  const distance = 300;
                  const xEnd = Math.cos(angle) * distance;
                  const yEnd = Math.sin(angle) * distance;
                  
                  return (
                    <motion.div
                      key={`star-${i}`}
                      className="absolute left-1/2 top-1/3"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                      animate={{
                        x: xEnd,
                        y: yEnd,
                        opacity: [1, 1, 0],
                        scale: [0, 1.5, 0.5],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  );
                })}
                
                {/* Colored confetti pieces falling */}
                {[...Array(30)].map((_, i) => {
                  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
                  const color = colors[i % colors.length];
                  const startX = Math.random() * window.innerWidth;
                  const rotation = Math.random() * 720 - 360;
                  
                  return (
                    <motion.div
                      key={`confetti-${i}`}
                      className="absolute w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: color,
                        left: startX,
                        top: -20,
                      }}
                      initial={{ y: -20, opacity: 1, rotate: 0 }}
                      animate={{
                        y: window.innerHeight + 100,
                        opacity: [1, 1, 0],
                        rotate: rotation,
                        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        delay: i * 0.03,
                        ease: "linear",
                      }}
                    />
                  );
                })}
              </div>

              {/* Completion Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center relative overflow-hidden"
              >
                {/* Shimmering background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Trophy icon inside the card */}
                <motion.div
                  className="relative z-10"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    rotate: [-180, 0, 0],
                    opacity: [0, 1, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    times: [0, 0.6, 1],
                    ease: "easeOut"
                  }}
                >
                  <Trophy className="w-20 h-20 text-yellow-500 drop-shadow-2xl mx-auto mb-4" />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4 relative z-10"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: theme.primary }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(16, 185, 129, 0.5)',
                        '0 0 40px rgba(16, 185, 129, 0.8)',
                        '0 0 20px rgba(16, 185, 129, 0.5)',
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl font-bold text-green-900 mb-2 relative z-10"
                >
                  {t.allComplete}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-green-800 relative z-10"
                >
                  {t.reviewAnswers}
                </motion.p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              ref={(el) => (questionRefs.current[index] = el)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Question Number */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                      question.status === 'completed' ? 'bg-green-500' : ''
                    }`}
                    style={{
                      backgroundColor: question.status === 'completed' ? '#10b981' : theme.primary,
                      color: 'white',
                    }}
                  >
                    {question.status === 'completed' ? <Check className="w-5 h-5" /> : question.id}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1">
                    {/* Start Button (Only for first pending question) */}
                    {question.status === 'pending' && currentQuestionIndex === null && index === 0 && (
                      <motion.button
                        onClick={handleStart}
                        className="w-full text-white px-6 py-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl font-bold text-lg relative overflow-hidden"
                        style={{ backgroundColor: theme.primary }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          boxShadow: [
                            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            '0 20px 40px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)',
                            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          ]
                        }}
                        transition={{
                          opacity: { duration: 0.3 },
                          y: { duration: 0.3 },
                          boxShadow: { 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Animated background glow */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Play className="w-8 h-8" />
                        </motion.div>
                        <span className="relative z-10">{t.start}</span>
                      </motion.button>
                    )}

                    {/* Combined Listening and Recording Animation - Smooth Transition */}
                    <AnimatePresence mode="wait">
                      {(question.status === 'listening' || question.status === 'recording') && currentQuestionIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full"
                        >
                          <div 
                            className="px-8 py-8 rounded-xl border-2 shadow-lg overflow-hidden transition-colors duration-700"
                            style={{
                              background: question.status === 'listening' 
                                ? 'linear-gradient(to bottom right, rgb(239, 246, 255), rgb(219, 234, 254))' 
                                : 'linear-gradient(to bottom right, rgb(254, 242, 242), rgb(254, 226, 226))',
                              borderColor: question.status === 'listening' ? 'rgb(96, 165, 250)' : 'rgb(248, 113, 113)',
                            }}
                          >
                            {/* Main Animation Row - Icon and Visualization Side by Side */}
                            <div className="flex items-center justify-center gap-8 mb-6">
                              {/* Animated Icon with Subtle Pulse */}
                              <motion.div
                                key={question.status}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                  scale: [1, question.status === 'listening' ? 1.05 : 1.08, 1],
                                  opacity: 1,
                                }}
                                transition={{
                                  scale: {
                                    duration: question.status === 'listening' ? 1.5 : 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  },
                                  opacity: { duration: 0.4 }
                                }}
                                className="flex-shrink-0"
                              >
                                <motion.div 
                                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-colors duration-700"
                                  style={{
                                    backgroundColor: question.status === 'listening' ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'
                                  }}
                                >
                                  {question.status === 'listening' ? (
                                    <Volume2 className="w-10 h-10 text-white" />
                                  ) : (
                                    <Mic className="w-10 h-10 text-white" />
                                  )}
                                </motion.div>
                              </motion.div>

                              {/* Visualization - Smooth transition between waveform and level bars */}
                              <div className="flex items-center gap-2 h-20">
                                {question.status === 'listening' ? (
                                  // Waveform for listening
                                  <>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                      <motion.div
                                        key={`listen-${i}`}
                                        className="w-2 bg-blue-600 rounded-full shadow-md"
                                        initial={{ height: '20px' }}
                                        animate={{
                                          height: [
                                            `${20 + Math.sin(i) * 20}px`,
                                            `${60 + Math.sin(i * 0.5) * 40}px`,
                                            `${20 + Math.sin(i) * 20}px`,
                                          ],
                                        }}
                                        transition={{
                                          duration: 0.8,
                                          repeat: Infinity,
                                          delay: i * 0.08,
                                          ease: "easeInOut"
                                        }}
                                      />
                                    ))}
                                  </>
                                ) : (
                                  // Level bars for recording - Slowed down for a calmer feel
                                  <>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                      <motion.div
                                        key={`record-${i}`}
                                        className="w-3 bg-red-600 rounded-full shadow-md"
                                        initial={{ height: '20px' }}
                                        animate={{
                                          height: ['20px', '80px', '30px', '70px', '25px'],
                                          opacity: [0.6, 1, 0.7, 1, 0.8],
                                        }}
                                        transition={{
                                          duration: 1.4,
                                          repeat: Infinity,
                                          delay: i * 0.15,
                                          ease: "easeInOut"
                                        }}
                                      />
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Status Text */}
                            <motion.div
                              key={question.status}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: [1, 0.7, 1], y: 0 }}
                              transition={{ 
                                opacity: { duration: question.status === 'listening' ? 1.5 : 1.2, repeat: Infinity },
                                y: { duration: 0.3 }
                              }}
                              className="text-center mb-4"
                            >
                              <p 
                                className="text-xl font-bold transition-colors duration-700"
                                style={{ color: question.status === 'listening' ? 'rgb(30, 64, 175)' : 'rgb(153, 27, 27)' }}
                              >
                                {getCurrentStatusText(question.status)}
                              </p>
                              <p 
                                className="text-xs mt-1 transition-colors duration-700"
                                style={{ color: question.status === 'listening' ? 'rgb(37, 99, 235)' : 'rgb(220, 38, 38)' }}
                              >
                                {question.status === 'listening' 
                                  ? (language === 'en' ? 'Listen carefully...' : 'Escucha con atención...')
                                  : (language === 'en' ? 'Speak your answer now...' : 'Di tu respuesta ahora...')
                                }
                              </p>
                            </motion.div>

                            {/* Helper Buttons */}
                            <div className="flex flex-wrap justify-center gap-2">
                              {/* Only show "Show Question Text" button in Give Answers mode */}
                              {roleMode === 'giveAnswers' && (
                                <button
                                  onClick={toggleShowQuestion}
                                  className="text-xs px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 rounded-md transition-colors flex items-center gap-1.5 border border-blue-200 shadow-sm"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{showAllQuestions ? t.hideQuestion : t.showQuestion}</span>
                                </button>
                              )}
                              <button
                                onClick={toggleShowAnswer}
                                className="text-xs px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 rounded-md transition-colors flex items-center gap-1.5 border border-purple-200 shadow-sm"
                              >
                                <Lightbulb className="w-3.5 h-3.5" />
                                <span>{showAllAnswers ? t.hideAnswer : t.showAnswer}</span>
                              </button>
                            </div>
                          </div>

                          {/* Question Text - Always shown in Ask Questions mode, toggleable in Give Answers mode */}
                          <AnimatePresence>
                            {(roleMode === 'askQuestions' || showAllQuestions) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 mt-3"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Eye className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-900">
                                    {language === 'en' ? 'Question:' : 'Pregunta:'}
                                  </span>
                                </div>
                                <p className="text-sm text-blue-800">{question.question}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Suggested Answer (Hidden until revealed) */}
                          <AnimatePresence>
                            {showAllAnswers && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-3 mt-3"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Lightbulb className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-semibold text-purple-900">
                                    {language === 'en' ? 'Suggested Answer:' : 'Respuesta sugerida:'}
                                  </span>
                                </div>
                                <p className="text-sm text-purple-800 italic">{question.suggestedAnswer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Completed State */}
                    {question.status === 'completed' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full"
                      >
                        {/* Show all dialog when exercise is complete */}
                        {allCompleted && (
                          <div className="space-y-3">
                            {/* Question Text - Always shown when complete */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-900">
                                  {language === 'en' ? 'Question:' : 'Pregunta:'}
                                </span>
                              </div>
                              <p className="text-sm text-blue-800">{question.question}</p>
                            </div>

                            {/* Suggested Answer - Always shown when complete */}
                            <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-semibold text-purple-900">
                                  {language === 'en' ? 'Suggested Answer:' : 'Respuesta sugerida:'}
                                </span>
                              </div>
                              <p className="text-sm text-purple-800 italic">{question.suggestedAnswer}</p>
                            </div>
                          </div>
                        )}

                        {/* Just completed but exercise not fully done yet */}
                        {!allCompleted && (
                          <div className="flex items-center gap-3 py-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            >
                              <Check className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <div>
                              <p className="font-semibold text-green-800">
                                {language === 'en' ? 'Completed!' : '¡Completado!'}
                              </p>
                              <p className="text-sm text-green-600">
                                {language === 'en' ? 'Moving to next question...' : 'Pasando a la siguiente pregunta...'}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Pending State (not first question) */}
                    {question.status === 'pending' && (index > 0 || currentQuestionIndex !== null) && (
                      <div className="py-6 text-center text-gray-400">
                        <p className="text-sm">
                          {language === 'en' ? 'Complete previous questions first' : 'Completa las preguntas anteriores primero'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < questions.length - 1 && <div className="border-t border-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={activity.settings.media.audio}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }}
      />
    </div>
  );
}