import { useState, useRef, useEffect } from 'react';
import { PenTool, Wand2, Lightbulb, RotateCcw, Languages, Sparkles, BookOpen } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { AICompositionActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface AICompositionWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: AICompositionActivity;
}

export function AICompositionWidget({ language, onLanguageToggle, activity }: AICompositionWidgetProps) {
  // Get localized title and prompt from activity data
  const question = activity.questions[0]; // Composition typically has one question
  const title = getLocalizedText(question.titles, language);
  const description = getLocalizedText(question.prompts, language, '').replace(/<[^>]*>/g, ''); // Strip HTML
  
  const { theme } = useTheme();
  
  const exampleImage = 'https://images.unsplash.com/photo-1728281144091-b743062a9bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY3ODE2MTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  const feedbackIllustration = 'https://images.unsplash.com/photo-1762438135827-428acc0e8941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2VzcyUyMGFjaGlldmVtZW50fGVufDF8fHx8MTc2NzcxODc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

  const [userAnswer, setUserAnswer] = useState('Me encantaría ser astronauta porque así podrías viajar espacio y conocer marcianos. Me parece que el planeta tierra es aburrido y quiero Conocer distintas cosa.');
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'feedback'>('vocabulary');

  // Mock vocabulary data for jobs theme
  const vocabularyData = [
    { es: 'el astronauta', en: 'astronaut' },
    { es: 'el médico / la médica', en: 'doctor' },
    { es: 'el profesor / la profesora', en: 'teacher' },
    { es: 'el ingeniero / la ingeniera', en: 'engineer' },
    { es: 'el artista', en: 'artist' },
    { es: 'el científico / la científica', en: 'scientist' },
    { es: 'el abogado / la abogada', en: 'lawyer' },
    { es: 'el programador / la programadora', en: 'programmer' },
    { es: 'el arquitecto / la arquitecta', en: 'architect' },
    { es: 'el escritor / la escritora', en: 'writer' },
  ];

  const translations = {
    en: {
      title: 'Writing Practice',
      instructions: 'In the future, I would like to work as...',
      description: 'Write a short paragraph using the vocabulary you have learned about "jobs". Describe three ideal jobs you would like to have when you grow up. What would each job look like? What special skills would you bring to your job?',
      yourResponse: 'Your response',
      reviewResponse: 'Review my response',
      reset: 'Reset',
      autoSaving: 'Auto-saving...',
      saved: 'Saved',
      feedback: 'Feedback',
      feedbackText: 'There are a couple of minor errors. Here is a corrected version: "Me encantaría ser astronauta porque así podría viajar al espacio y conocer marcianos. Me parece que el planeta tierra es aburrido y quiero conocer distintas cosas." Remember that "el espacio" is masculine, and you need the article "el" before "planeta tierra." Also, the verb "conocer" needs to be conjugated to "podría". Otherwise, this is great!',
    },
    es: {
      title: 'Composición con IA',
      instructions: 'En el futuro, me gustaría trabajar como...',
      description: 'Escribe un párrafo corto usando el vocabulario que has aprendido sobre los "empleos". Describe tres trabajos ideales que te gustaría tener cuando seas mayor. ¿Qué parte de cada trabajo te parece más estimulante? ¿Qué tipo de trabajador serías? ¿Qué habilidades especiales aportarías a tu trabajo?',
      yourResponse: 'Tu respuesta',
      reviewResponse: 'Revisar mi respuesta',
      reset: 'Reiniciar',
      autoSaving: 'Guardando automáticamente...',
      saved: 'Guardado',
      feedback: 'Retroalimentación',
      feedbackText: 'Hay un par de errores menores. Aquí hay una versión corregida: "Me encantaría ser astronauta porque así podría viajar al espacio y conocer marcianos. Me parece que el planeta tierra es aburrido y quiero conocer distintas cosas." Recuerda que "el espacio" es masculino y necesitas el artículo "el" antes de "planeta tierra". Además, el verbo "conocer" debe conjugarse a "podría". ¡Por lo demás, está genial!',
    },
  };

  const t = translations[language];

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userAnswer.trim() !== '') {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userAnswer]);

  const wordCount = userAnswer.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="grid lg:grid-cols-[320px_1fr_320px] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24"
        style={{ 
          backgroundColor: theme.primaryPale,
          borderColor: theme.primaryBorder 
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L8-3"
          breadcrumb={['Lección 8', 'Career Goals', '3']}
          title={t.title}
          icon={PenTool}
          iconColor="text-white"
          iconBg="bg-gradient-to-br"
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: 'AI-Powered',
            color: 'text-orange-800',
            bgColor: 'bg-orange-100',
          }}
        />

        <div 
          className="bg-white/60 rounded-lg p-4 border mb-4"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-medium" style={{ color: theme.primaryDark }}>{language === 'en' ? 'Instructions:' : 'Instrucciones:'}</h3>
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
          <h4 className="text-gray-900 mb-2 font-medium">{title}</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>

        <button 
          onClick={() => {
            setUserAnswer('');
            setHasSubmitted(false);
            setShowFeedback(false);
            setIsResetting(true);
            setTimeout(() => setIsResetting(false), 1000);
          }}
          className="mt-4 w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Activity Panel */}
      <div className="space-y-4">
        {/* Featured Image */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <img src={exampleImage} alt="Composition prompt" className="w-full h-auto" />
        </div>

        {/* Prompt */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-gray-900 mb-2">{t.instructions}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {t.description}
          </p>

          <div className="mb-2">
            <h4 className="text-sm text-gray-700 font-medium mb-2">{t.yourResponse}</h4>
          </div>

          <textarea
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setHasSubmitted(false);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none resize-none min-h-[200px]"
            style={{
              borderColor: 'rgb(229, 231, 235)', // gray-200
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = theme.primary}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'}
            placeholder={language === 'en' ? 'Write your composition here...' : 'Escribe tu composición aquí...'}
          />

          <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
            <span>{wordCount} {language === 'en' ? 'words' : 'palabras'}</span>
          </div>

          <button
            onClick={() => {
              setHasSubmitted(true);
              setShowFeedback(true);
            }}
            disabled={userAnswer.trim().length === 0}
            className="mt-4 w-full disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{
              backgroundColor: userAnswer.trim().length === 0 ? undefined : theme.primary
            }}
            onMouseEnter={(e) => {
              if (userAnswer.trim().length > 0) {
                e.currentTarget.style.backgroundColor = theme.primaryDark;
              }
            }}
            onMouseLeave={(e) => {
              if (userAnswer.trim().length > 0) {
                e.currentTarget.style.backgroundColor = theme.primary;
              }
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.reviewResponse}</span>
          </button>
        </div>
      </div>

      {/* Tabbed Panel: Vocabulary / Feedback */}
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
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
                    <h3 className="font-medium" style={{ color: theme.primaryDark }}>{language === 'en' ? 'Helpful Vocabulary' : 'Vocabulario útil'}</h3>
                  </div>
                  <div className="space-y-3">
                    {vocabularyData.map((item, index) => (
                      <div key={index} className="rounded-lg p-3" style={{ backgroundColor: theme.primaryPale }}>
                        <div className="text-gray-900 font-medium">{item.es}</div>
                        <div className="text-sm text-gray-600">{item.en}</div>
                      </div>
                    ))}
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
                  {hasSubmitted && showFeedback ? (
                    <div>
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
                      <p className="text-sm text-green-900 leading-relaxed">
                        {t.feedbackText}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
                        <h4 className="text-sm font-medium" style={{ color: theme.primaryDark }}>{language === 'en' ? 'AI Assistance' : 'Asistencia de IA'}</h4>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: theme.primaryDark }}>
                        {language === 'en' 
                          ? 'Get instant AI feedback on your writing to improve grammar and vocabulary usage.'
                          : 'Obtén retroalimentación instantánea de IA sobre tu escritura para mejorar la gramática y el uso del vocabulario.'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}