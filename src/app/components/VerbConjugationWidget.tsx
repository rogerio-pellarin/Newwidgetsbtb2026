import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, X, RotateCcw, Lightbulb, Languages } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { VerbConjugationActivity } from '../../types/activities';
import { getLocalizedText } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface ConjugationAnswer {
  value: string;
  showHint: boolean;
  status?: 'perfect' | 'accent' | 'wrong';
}

interface VerbConjugation {
  verb: string;
  translation: string;
  forms: {
    yo: ConjugationAnswer;
    tu: ConjugationAnswer;
    el: ConjugationAnswer;
    nosotros: ConjugationAnswer;
    vosotros: ConjugationAnswer;
    ellos: ConjugationAnswer;
  };
  correctAnswers: {
    yo: string;
    tu: string;
    el: string;
    nosotros: string;
    vosotros: string;
    ellos: string;
  };
  completed: boolean;
}

interface VerbConjugationWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: VerbConjugationActivity;
}

const translations = {
  en: {
    title: 'Verb Practice',
    instructions: 'Estudia atentamente la lista de verbos irregulares. Ahora conjuga completamente los siguientes seis verbos sin mirar las listas. Luego revisa tu trabajo haciendo clic en la bombilla a la derecha de cada respuesta.',
    hintsAvailable: 'Hints Available',
    clickLightbulb: 'Click lightbulb for hints',
    greenCorrect: 'Green = perfect answer',
    yellowAccent: 'Yellow = accent/punctuation',
    redWrong: 'Red = incorrect answer',
    progress: 'Progress',
    resetAll: 'Reset All',
    showAnswers: 'Mostrar Respuestas',
    saveProgress: 'Save Progress',
    checkAll: 'Check All Answers',
    inProgress: 'In Progress',
    completed: 'Completed',
    verbCompleted: 'Verb completed!',
  },
  es: {
    title: 'Verb Conjugation',
    instructions: 'Estudia atentamente la lista de verbos irregulares. Ahora conjuga completamente los siguientes seis verbos sin mirar las listas. Luego revisa tu trabajo haciendo clic en la bombilla a la derecha de cada respuesta.',
    hintsAvailable: 'Sugerencias disponibles',
    clickLightbulb: 'Haz clic en la bombilla para obtener sugerencias',
    greenCorrect: 'Verde = respuesta perfecta',
    yellowAccent: 'Amarillo = acento/puntuación',
    redWrong: 'Rojo = respuesta incorrecta',
    progress: 'Progreso',
    resetAll: 'Reiniciar todo',
    showAnswers: 'Mostrar respuestas',
    saveProgress: 'Guardar progreso',
    checkAll: 'Verificar todas las respuestas',
    inProgress: 'En progreso',
    completed: 'Completado',
    verbCompleted: '¡Verbo completado!',
  },
};

export function VerbConjugationWidget({ language, onLanguageToggle, activity }: VerbConjugationWidgetProps) {
  const t = translations[language];
  const [showAnswers, setShowAnswers] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  
  // Initialize verbs from activity data
  const [verbs, setVerbs] = useState<VerbConjugation[]>(() => 
    activity.questions.map((question) => ({
      verb: question.verb,
      translation: question.verb_source,
      forms: {
        yo: { value: '', showHint: false },
        tu: { value: '', showHint: false },
        el: { value: '', showHint: false },
        nosotros: { value: '', showHint: false },
        vosotros: { value: '', showHint: false },
        ellos: { value: '', showHint: false },
      },
      correctAnswers: {
        yo: question.conjugations.yo[0] || '',
        tu: question.conjugations.tu[0] || '',
        el: question.conjugations.el[0] || '',
        nosotros: question.conjugations.nosotros[0] || '',
        vosotros: question.conjugations.vosotros[0] || '',
        ellos: question.conjugations.ellos[0] || '',
      },
      completed: false,
    }))
  );
  const [autoSaving, setAutoSaving] = useState(false);

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
    const saveProgress = () => {
      setAutoSaving(true);
      setTimeout(() => {
        setAutoSaving(false);
      }, 1000);
    };

    const currentVerbs = JSON.stringify(verbs);
    const savedVerbs = localStorage.getItem('verbConjugationWidget');

    if (savedVerbs && savedVerbs !== currentVerbs) {
      saveProgress();
      localStorage.setItem('verbConjugationWidget', currentVerbs);
    }
  }, [verbs]);

  const updateAnswer = (verbIndex: number, form: keyof VerbConjugation['forms'], value: string) => {
    const newVerbs = [...verbs];
    newVerbs[verbIndex].forms[form].value = value;
    newVerbs[verbIndex].forms[form].status = undefined;
    setVerbs(newVerbs);
  };

  const toggleHint = (verbIndex: number, form: keyof VerbConjugation['forms']) => {
    const newVerbs = [...verbs];
    newVerbs[verbIndex].forms[form].showHint = !newVerbs[verbIndex].forms[form].showHint;
    setVerbs(newVerbs);
  };

  const normalizeString = (str: string) => {
    return str.trim().toLowerCase().normalize('NFD');
  };

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const checkAnswer = (verbIndex: number, form: keyof VerbConjugation['forms']) => {
    const newVerbs = [...verbs];
    const userAnswer = newVerbs[verbIndex].forms[form].value.trim().toLowerCase();
    const correctAnswer = newVerbs[verbIndex].correctAnswers[form].toLowerCase();

    if (userAnswer === correctAnswer) {
      newVerbs[verbIndex].forms[form].status = 'perfect';
    } else if (removeAccents(userAnswer) === removeAccents(correctAnswer)) {
      newVerbs[verbIndex].forms[form].status = 'accent';
    } else if (userAnswer !== '') {
      newVerbs[verbIndex].forms[form].status = 'wrong';
    }

    // Check if all forms are completed and perfect
    const allFormsCorrect = (Object.keys(newVerbs[verbIndex].forms) as Array<keyof VerbConjugation['forms']>).every(
      (key) => newVerbs[verbIndex].forms[key].status === 'perfect'
    );

    if (allFormsCorrect && !newVerbs[verbIndex].completed) {
      newVerbs[verbIndex].completed = true;
    }

    setVerbs(newVerbs);
  };

  const getInputClassName = (answer: ConjugationAnswer) => {
    if (answer.status === 'perfect') {
      return 'border-green-400 bg-green-50 text-green-900';
    }
    if (answer.status === 'accent') {
      return 'border-yellow-400 bg-yellow-50 text-yellow-900';
    }
    if (answer.status === 'wrong') {
      return 'border-red-400 bg-red-50 text-red-900';
    }
    if (answer.value) {
      return 'border-indigo-300 bg-indigo-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const pronounLabels = {
    yo: 'yo',
    tu: 'tú',
    el: 'él / ella / Ud.',
    nosotros: 'nosotros / nosotras',
    vosotros: 'vosotros / vosotras',
    ellos: 'ellos / ellas / Uds.',
  };

  const completedCount = verbs.reduce((acc, verb) => {
    const completed = Object.values(verb.forms).filter((f) => f.value.trim() !== '').length;
    return acc + completed;
  }, 0);

  const totalCount = verbs.length * 6;

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
          identifier="BtSB1-L6-1"
          breadcrumb={['Lección 6', 'Verb Conjugation', '1']}
          title={t.title}
          icon={BookOpen}
          iconColor="text-white"
          iconBg=""
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: t.inProgress,
            color: 'text-orange-800',
            bgColor: 'bg-orange-100',
            icon: `${Math.round((completedCount / totalCount) * 100)}%`,
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
              <span className="font-semibold">{t.hintsAvailable}</span>
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
                <span className="text-green-600 mt-0.5 font-bold text-base">●</span>
                <span>{t.greenCorrect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5 font-bold text-base">●</span>
                <span>{t.yellowAccent}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5 font-bold text-base">●</span>
                <span>{t.redWrong}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div 
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">{t.progress}</span>
            <span className="text-gray-900">
              {completedCount} / {totalCount}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <button 
          className="mt-6 w-full bg-white hover:bg-gray-50 border-2 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          style={{
            borderColor: theme.primaryBorder
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetAll}</span>
        </button>
      </div>

      {/* Conjugation Panel */}
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {verbs.map((verb, verbIndex) => (
              <motion.div
                key={verbIndex}
                layout
                className="bg-white border-2 border-gray-200 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Completion animation */}
                <AnimatePresence>
                  {verb.completed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">{t.verbCompleted}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-5 pb-4 border-b border-gray-200">
                  <h3 className="text-gray-900 mb-1">{verb.verb}</h3>
                  <p className="text-sm text-gray-500">({verb.translation})</p>
                </div>

                <div className="space-y-4">
                  {(Object.keys(verb.forms) as Array<keyof VerbConjugation['forms']>).map((form) => (
                    <div key={form}>
                      <label className="block text-sm text-gray-700 mb-2">{pronounLabels[form]}</label>
                      <div className="flex gap-2">
                        <motion.input
                          type="text"
                          value={verb.forms[form].value}
                          onChange={(e) => updateAnswer(verbIndex, form, e.target.value)}
                          onBlur={() => verb.forms[form].value && checkAnswer(verbIndex, form)}
                          className={`flex-1 px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all ${getInputClassName(
                            verb.forms[form]
                          )}`}
                          placeholder="..."
                          whileFocus={{ scale: 1.02 }}
                          animate={
                            verb.forms[form].status === 'perfect'
                              ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
                              : {}
                          }
                        />
                        <button
                          onClick={() => toggleHint(verbIndex, form)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                            verb.forms[form].showHint
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                          title="Show hint"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      </div>

                      {verb.forms[form].showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded"
                        >
                          <p className="text-sm text-indigo-900 font-medium">
                            {language === 'en' ? 'Answer: ' : 'Respuesta: '}
                            <span className="text-indigo-700">{verb.correctAnswers[form]}</span>
                          </p>
                        </motion.div>
                      )}

                      {showAnswers && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-gray-600"
                        >
                          <span className="text-green-700">✓ {verb.correctAnswers[form]}</span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Removed Save Progress and Submit buttons */}
      </div>
    </div>
  );
}