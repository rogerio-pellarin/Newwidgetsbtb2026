import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, RotateCcw, Languages, Volume2, Sparkles, Eye, EyeOff, BookOpen, Lightbulb } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import chatIllustration from 'figma:asset/1dcb22fadf3a78d0e7c50ee76ef88823e5cfab16.png';
import feedbackIllustration from 'figma:asset/c2f458ac1a81841f73b8795aed0e97b98b1318dc.png';
import type { AIChatActivity, VocabularyItem } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIChatWidgetMobileProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: AIChatActivity;
}

export function AIChatWidgetMobile({ language, onLanguageToggle, activity }: AIChatWidgetMobileProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola! Buenos días. ¿Puedo ayudarte en algo?',
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState<'vocabulary' | 'feedback' | null>(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: 'AI Chat Practice',
      scenario: 'Lost and found: City explorer!',
      description: 'You find yourself a bit lost among the charming and winding streets of a new city. Upon seeing a friendly local, Mr. Gómez, you decide to ask for help. Your goal: Politely ask how to get to a specific place and clearly understand their instructions.',
      startChat: 'Start Chat',
      reset: 'Reset',
      reiniciar: 'Reset',
      typePlaceholder: 'Type here...',
      helpfulVocab: 'Helpful Vocabulary',
      completeConversation: 'Complete & Get Feedback',
      feedback: 'Conversation Feedback',
      feedbackText: 'Great job with your conversation practice! You successfully asked for directions and used polite language. A few suggestions:\n\n• Try using "estar perdido/a" (to be lost) correctly - remember to conjugate based on gender.\n• Use "a la playa" instead of "en la playa" when saying "go to the beach."\n• "Cuál es la más linda" is more correct than "cual ser lindísima."\n\nOverall, you communicated effectively and Mr. Gómez understood you! Keep practicing your prepositions and verb conjugations.',
      chat: 'Chat',
      vocab: 'Vocab',
      viewInstructions: 'View Instructions',
    },
    es: {
      title: 'Práctica de Chat con IA',
      scenario: '¡Perdido y encontrado: Explorador de la ciudad!',
      description: 'Te encuentras un poco perdido/a entre las encantadoras y sinuosas calles de una nueva ciudad. Al ver a un amable local, el Señor Gómez, decides pedir ayuda. Tu objetivo: Pregunta educadamente cómo llegar a un lugar específico y comprende claramente sus instrucciones.',
      startChat: 'Iniciar chat',
      reset: 'Reiniciar',
      reiniciar: 'Reiniciar',
      typePlaceholder: 'Escribe aquí...',
      helpfulVocab: 'Vocabulario útil',
      completeConversation: 'Completar y obtener retroalimentación',
      feedback: 'Retroalimentación de la conversación',
      feedbackText: '¡Buen trabajo con tu práctica de conversación! Lograste pedir direcciones exitosamente y usaste un lenguaje cortés. Algunas sugerencias:\n\n• Intenta usar "estar perdido/a" correctamente - recuerda conjugar según el género.\n• Usa "a la playa" en lugar de "en la playa" al decir "ir a la playa."\n• "Cuál es la más linda" es más correcto que "cual ser lindísima."\n\nEn general, te comunicaste efectivamente y el Señor Gómez te entendió! Sigue practicando tus preposiciones y conjugaciones verbales.',
      chat: 'Chat',
      vocab: 'Vocabulario',
      viewInstructions: 'Ver instrucciones',
    },
  };

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save simulation
  useEffect(() => {
    if (messages.length > 0 && hasStarted) {
      setAutoSaving(true);
      const timer = setTimeout(() => setAutoSaving(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, hasStarted]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: language === 'en' 
          ? 'That\'s great! Keep practicing your Spanish conversation skills.'
          : '¡Excelente! Sigue practicando tus habilidades de conversación en español.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const handleReset = () => {
    setHasStarted(false);
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: '¡Hola! Buenos días. ¿Puedo ayudarte en algo?',
        timestamp: new Date(),
      },
    ]);
    setInputText('');
    setShowFeedback(false);
    setConversationEnded(false);
    setShowBottomSheet(null);
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 1000);
  };

  const { theme } = useTheme();

  if (!hasStarted) {
    // GET STARTED SCREEN
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div 
            className="px-6 py-4"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})` 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white text-xl font-semibold">{language === 'en' ? 'Change model' : 'Cambiar modelo'}</h2>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <span className="text-gray-700">{language === 'en' ? 'Language' : 'Idioma'}</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${language === 'es' ? 'text-gray-900' : 'text-gray-500'}`}>ES</span>
              <button
                onClick={onLanguageToggle}
                className="relative w-14 h-8 rounded-full transition-colors bg-gray-300"
                style={language === 'en' ? { backgroundColor: theme.primary } : undefined}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: language === 'en' ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${language === 'en' ? 'text-gray-900' : 'text-gray-500'}`}>EN</span>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://player.vimeo.com/video/1096620859?autoplay=1&muted=1&playsinline=1&loop=1&background=1"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Conversation scenario"
            />
          </div>

          {/* Scenario */}
          <div className="px-6 pb-6">
            <h3 className="text-gray-900 text-xl font-semibold mb-2">¡Mi mejor amigo/a!</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {t.description}
            </p>
          </div>

          {/* Reset Button */}
          <div className="px-6 pb-4">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 py-3 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-medium">{t.reiniciar}</span>
            </button>
          </div>

          {/* Start Chat Button */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setHasStarted(true)}
              className="w-full text-white px-6 py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg font-medium"
              style={{
                background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryDark})`
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.startChat}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // CHAT SCREEN
  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-[80vh]"
        >
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <span className="text-white text-sm font-medium">LG</span>
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">Lucía / amiga</h3>
              </div>
            </div>
            <button
              onClick={() => setHasStarted(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
            >
              {t.viewInstructions}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : ''}`}
                >
                  <div className={`max-w-[80%]`}>
                    {message.sender === 'ai' && (
                      <div className="text-xs text-gray-600 mb-1">Lucía / amiga</div>
                    )}
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={
                        message.sender === 'user'
                          ? { backgroundColor: theme.primary, color: 'white' }
                          : { backgroundColor: 'white', color: 'rgb(17, 24, 39)', border: '1px solid rgb(229, 231, 235)' }
                      }
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="text-xs text-gray-500 mt-1 text-right">{language === 'en' ? 'You' : 'Tú'}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.typePlaceholder}
                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none"
                onFocus={(e) => e.currentTarget.style.borderColor = theme.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'}
              />
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-around bg-gray-50 rounded-2xl p-2">
              <button
                onClick={() => setShowBottomSheet(showBottomSheet === 'chat' ? null : 'chat')}
                className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors text-gray-600 hover:bg-gray-100"
                style={
                  showBottomSheet === 'chat'
                    ? { backgroundColor: theme.primary, color: 'white' }
                    : undefined
                }
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs font-medium">{t.chat}</span>
              </button>
              <button
                onClick={() => setShowBottomSheet(showBottomSheet === 'feedback' ? null : 'feedback')}
                className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors text-gray-400 hover:bg-gray-100"
                style={
                  showBottomSheet === 'feedback'
                    ? { backgroundColor: theme.primary, color: 'white' }
                    : undefined
                }
                disabled={messages.length < 4}
              >
                <Lightbulb className="w-6 h-6" />
                <span className="text-xs font-medium">{t.feedback}</span>
              </button>
              <button
                onClick={() => setShowBottomSheet(showBottomSheet === 'vocabulary' ? null : 'vocabulary')}
                className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors text-gray-600 hover:bg-gray-100"
                style={
                  showBottomSheet === 'vocabulary'
                    ? { backgroundColor: theme.primary, color: 'white' }
                    : undefined
                }
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-xs font-medium">{t.vocab}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBottomSheet(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="p-6">
                {showBottomSheet === 'vocabulary' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5" style={{ color: theme.primaryDark }} />
                      <h3 className="font-medium text-lg" style={{ color: theme.primaryDark }}>{t.helpfulVocab}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">la calle</div>
                        <div className="text-sm text-gray-600">street</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">a la derecha</div>
                        <div className="text-sm text-gray-600">right</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">a la izquierda</div>
                        <div className="text-sm text-gray-600">left</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">todo recto</div>
                        <div className="text-sm text-gray-600">straight ahead</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">aquí</div>
                        <div className="text-sm text-gray-600">here</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">allí</div>
                        <div className="text-sm text-gray-600">there</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">cerca</div>
                        <div className="text-sm text-gray-600">near</div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">lejos</div>
                        <div className="text-sm text-gray-600">far</div>
                      </div>
                    </div>
                  </div>
                )}

                {showBottomSheet === 'feedback' && (
                  <div>
                    {/* Illustration */}
                    <div className="flex justify-center mb-4">
                      <img
                        src={feedbackIllustration}
                        alt="AI Feedback"
                        className="w-48 h-auto"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-green-700" />
                      <h3 className="text-green-900 font-medium text-lg">{t.feedback}</h3>
                    </div>
                    <p className="text-sm text-green-900 leading-relaxed whitespace-pre-line">
                      {t.feedbackText}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}