import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, RotateCcw, Languages, Volume2, Sparkles, Eye, EyeOff, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import chatIllustration from 'figma:asset/1dcb22fadf3a78d0e7c50ee76ef88823e5cfab16.png';
import feedbackIllustration from 'figma:asset/c2f458ac1a81841f73b8795aed0e97b98b1318dc.png';
import avatarImage from 'figma:asset/ac0c8f33d5cfb3c3f3d8789886ed092a78d223fe.png';
import type { AIChatActivity, VocabularyItem } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIChatWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: AIChatActivity;
}

export function AIChatWidget({ language, onLanguageToggle, activity }: AIChatWidgetProps) {
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
  const [conversationEnded, setConversationEnded] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'feedback'>('vocabulary');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedHelpId, setExpandedHelpId] = useState<number | null>(null);

  // Mock help content for AI messages - context/rephrasing, not translation
  const getHelpContent = (messageText: string) => {
    const helpData: Record<string, { en: string; es: string }> = {
      '¡Hola! Buenos días. ¿Puedo ayudarte en algo?': {
        en: 'This is a friendly, formal greeting. "Buenos días" is used until around noon. The phrase "¿Puedo ayudarte en algo?" is a polite way to offer assistance, literally meaning "Can I help you with something?" This shows respect and willingness to help.',
        es: 'Este es un saludo amigable y formal. "Buenos días" se usa hasta aproximadamente el mediodía. La frase "¿Puedo ayudarte en algo?" es una manera cortés de ofrecer ayuda, literalmente significa "Can I help you with something?" Esto demuestra respeto y disposición para ayudar.',
      },
      'That\'s great! Keep practicing your Spanish conversation skills.': {
        en: 'This is an encouraging response that acknowledges your effort. The speaker is motivating you to continue developing your conversational abilities in Spanish.',
        es: 'Esta es una respuesta alentadora que reconoce tu esfuerzo. El hablante te está motivando a seguir desarrollando tus habilidades conversacionales en español.',
      },
      '¡Excelente! Sigue practicando tus habilidades de conversación en español.': {
        en: '"¡Excelente!" expresses strong approval. "Sigue practicando" uses the imperative form of "seguir" (to continue), encouraging you to keep working on your conversation skills. Notice how "habilidades" (abilities/skills) is used with "de conversación" to specify the type of skills.',
        es: '"¡Excelente!" expresa una fuerte aprobación. "Sigue practicando" usa la forma imperativa de "seguir" (to continue), animándote a seguir trabajando en tus habilidades de conversación. Observa cómo "habilidades" (abilities/skills) se usa con "de conversación" para especificar el tipo de habilidades.',
      },
    };

    return helpData[messageText] || {
      en: 'This message provides context for the conversation. Pay attention to the verb conjugations, sentence structure, and polite expressions used in Spanish.',
      es: 'Este mensaje proporciona contexto para la conversación. Presta atención a las conjugaciones verbales, la estructura de las oraciones y las expresiones corteses usadas en español.',
    };
  };

  const translations = {
    en: {
      title: 'Conversation Practice',
      scenario: 'Lost and found: City explorer!',
      description: 'You find yourself a bit lost among the charming and winding streets of a new city. Upon seeing a friendly local, Mr. Gómez, you decide to ask for help. Your goal: Politely ask how to get to a specific place and clearly understand their instructions.',
      reset: 'Reset',
      typePlaceholder: 'Type here...',
      helpfulVocab: 'Helpful Vocabulary',
      completeConversation: 'Complete & Get Feedback',
      feedback: 'Conversation Feedback',
      feedbackText: 'Great job with your conversation practice! You successfully asked for directions and used polite language. A few suggestions:\n\n• Try using "estar perdido/a" (to be lost) correctly - remember to conjugate based on gender.\n• Use "a la playa" instead of "en la playa" when saying "go to the beach."\n• "Cuál es la más linda" is more correct than "cual ser lindísima."\n\nOverall, you communicated effectively and Mr. Gómez understood you! Keep practicing your prepositions and verb conjugations.',
      vocab: {
        street: 'street',
        right: 'right',
        left: 'left',
        straightAhead: 'straight ahead',
        here: 'here',
        there: 'there',
        near: 'near',
        far: 'far',
        city: 'city',
        town: 'town',
        square: 'square',
      },
    },
    es: {
      title: 'Práctica de Chat con IA',
      scenario: '¡Perdido y encontrado: Explorador de la ciudad!',
      description: 'Te encuentras un poco perdido/a entre las encantadoras y sinuosas calles de una nueva ciudad. Al ver a un amable local, el Señor Gómez, decides pedir ayuda. Tu objetivo: Pregunta educadamente cómo llegar a un lugar específico y comprende claramente sus instrucciones.',
      reset: 'Reiniciar',
      typePlaceholder: 'Escribe aquí...',
      helpfulVocab: 'Vocabulario útil',
      completeConversation: 'Completar y obtener retroalimentación',
      feedback: 'Retroalimentación de la conversación',
      feedbackText: '¡Buen trabajo con tu práctica de conversación! Lograste pedir direcciones exitosamente y usaste un lenguaje cortés. Algunas sugerencias:\n\n• Intenta usar "estar perdido/a" correctamente - recuerda conjugar según el género.\n• Usa "a la playa" en lugar de "en la playa" al decir "ir a la playa."\n• "Cuál es la más linda" es más correcto que "cual ser lindísima."\n\nEn general, te comunicaste efectivamente y el Señor Gómez te entendió! Sigue practicando tus preposiciones y conjugaciones verbales.',
      vocab: {
        street: 'calle',
        right: 'derecha',
        left: 'izquierda',
        straightAhead: 'todo recto',
        here: 'aquí',
        there: 'allí',
        near: 'cerca',
        far: 'lejos',
        city: 'ciudad',
        town: 'pueblo',
        square: 'plaza',
      },
    },
  };

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    // Only scroll when new messages are added after initial load
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // Auto-save simulation
  useEffect(() => {
    if (messages.length > 0) {
      setAutoSaving(true);
      const timer = setTimeout(() => setAutoSaving(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

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
    setActiveTab('vocabulary');
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 1000);
  };

  const { theme } = useTheme();

  return (
    <div className="grid lg:grid-cols-[280px_1fr_280px] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24"
        style={{ 
          backgroundColor: theme.primaryPale,
          borderColor: theme.primaryBorder 
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L4-5"
          breadcrumb={['Lección 4', 'Directions', '5']}
          title={t.title}
          icon={MessageCircle}
          iconColor="text-white"
          iconBg="bg-gradient-to-br"
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: 'AI-Powered',
            color: 'text-orange-800',
            bgColor: 'bg-orange-100',
          }}
        />

        {/* Video/Image Section */}
        <div 
          className="bg-white rounded-lg overflow-hidden border-2 mb-4"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://player.vimeo.com/video/1096620859?autoplay=1&muted=1&playsinline=1&loop=1&background=1"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Conversation scenario"
            />
          </div>
        </div>

        <div 
          className="bg-white/60 rounded-lg p-4 border"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold" style={{ color: theme.primaryDark }}>
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
            {t.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500 mb-4">
          {autoSaving ? (language === 'en' ? 'Auto-saving...' : 'Guardando automáticamente...') : (language === 'en' ? 'Saved' : 'Guardado')}
        </div>

        <button 
          onClick={handleReset}
          className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Chat Panel */}
      <div className="bg-white border-2 border-gray-200 rounded-xl flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="border-b-2 border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <img 
              src={activity.settings.npc_avatar || avatarImage}
              alt={getLocalizedText(activity.settings.npc_role, language)}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-gray-900 font-medium">{getLocalizedText(activity.settings.npc_role, language)}</h3>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'ai' && (
                    <div className="text-xs text-gray-600 mb-1">Señor Gómez / residente local</div>
                  )}
                  <div className="relative group">
                    <div
                      className="rounded-lg px-4 py-3 text-gray-900"
                      style={{
                        backgroundColor: message.sender === 'user' ? theme.primaryPale : 'rgb(243, 244, 246)' // gray-100
                      }}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    
                    {/* Help button for AI messages */}
                    {message.sender === 'ai' && (
                      <button
                        onClick={() => setExpandedHelpId(expandedHelpId === message.id ? null : message.id)}
                        className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100"
                        style={{
                          color: expandedHelpId === message.id ? theme.primary : '#6b7280' // gray-500
                        }}
                        title={language === 'en' ? 'Get help understanding this' : 'Obtener ayuda para entender esto'}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Expandable Help Content */}
                  <AnimatePresence>
                    {message.sender === 'ai' && expandedHelpId === message.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="mt-2 rounded-lg p-3 border-l-4"
                          style={{
                            backgroundColor: theme.primaryPale,
                            borderColor: theme.primary
                          }}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.primaryDark }} />
                            <p className="text-xs font-semibold" style={{ color: theme.primaryDark }}>
                              {language === 'en' ? 'Understanding this message:' : 'Entendiendo este mensaje:'}
                            </p>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-700 pl-6">
                            {getHelpContent(message.text)[language]}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {message.sender === 'user' && (
                    <div className="text-xs text-gray-500 mt-1 text-right">You</div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-gray-200 p-4 space-y-2">
          {messages.length > 3 && (
            <button
              onClick={() => {
                setConversationEnded(true);
                setShowFeedback(true);
                setActiveTab('feedback');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.completeConversation}</span>
            </button>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typePlaceholder}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
              onFocus={(e) => e.currentTarget.style.borderColor = theme.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              className="disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
              style={{
                backgroundColor: inputText.trim() === '' ? undefined : theme.primary
              }}
              onMouseEnter={(e) => {
                if (inputText.trim() !== '') {
                  e.currentTarget.style.backgroundColor = theme.primaryDark;
                }
              }}
              onMouseLeave={(e) => {
                if (inputText.trim() !== '') {
                  e.currentTarget.style.backgroundColor = theme.primary;
                }
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Panel: Vocabulary / Feedback */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('vocabulary')}
              className="flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100"
              style={
                activeTab === 'vocabulary'
                  ? {
                      backgroundColor: theme.primaryPale,
                      borderBottom: `2px solid ${theme.primary}`,
                      color: theme.primaryDark,
                    }
                  : undefined
              }
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'Vocabulary' : 'Vocabulario'}</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className="flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors bg-gray-50 text-gray-600 hover:bg-gray-100"
              style={
                activeTab === 'feedback'
                  ? {
                      backgroundColor: theme.primaryPale,
                      borderBottom: `2px solid ${theme.primary}`,
                      color: theme.primaryDark,
                    }
                  : undefined
              }
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'Feedback' : 'Retroalimentación'}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'vocabulary' ? (
                <motion.div
                  key="vocabulary"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" style={{ color: theme.primaryDark }} />
                    <h3 className="font-medium" style={{ color: theme.primaryDark }}>{t.helpfulVocab}</h3>
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
                    <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                      <div className="text-gray-900 font-medium">la ciudad</div>
                      <div className="text-sm text-gray-600">city</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                      <div className="text-gray-900 font-medium">el pueblo</div>
                      <div className="text-sm text-gray-600">town</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                      <div className="text-gray-900 font-medium">la plaza</div>
                      <div className="text-sm text-gray-600">square</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Illustration */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={feedbackIllustration}
                      alt="AI Feedback"
                      className="w-48 h-auto rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-green-700" />
                    <h3 className="text-green-900 font-medium">{t.feedback}</h3>
                  </div>
                  <p className="text-sm text-green-900 leading-relaxed whitespace-pre-line">
                    {t.feedbackText}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}