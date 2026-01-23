import { useState, useEffect } from 'react';
import { Table, Lightbulb, RotateCcw, Languages } from 'lucide-react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion } from 'motion/react';
import type { TableActivity } from '../../types/activities';
import { useTheme } from '../../contexts/ThemeContext';

interface CellData {
  row: string; // Verb
  column: string; // Pronoun
  correctAnswer: string;
  prefilled: boolean;
  userAnswer?: string;
  status?: 'correct' | 'accent' | 'incorrect';
}

interface TableWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: TableActivity;
}

const translations = {
  en: {
    title: 'Info Grid',
    instructions: 'Fill in the table with the correct verb forms. Some cells are already filled in as examples. Each cell requires the appropriate conjugation for the given subject and verb.',
    tips: 'Tips',
    checkAnswers: 'Check your answers as you type',
    greenCorrect: 'Green = perfect answer',
    yellowAccent: 'Yellow = accent/punctuation',
    redIncorrect: 'Red = incorrect answer',
    prefilledExample: 'Gray cells show examples',
    clickForAnswer: 'Click cell for answer',
    resetAll: 'Reset All',
    progress: 'Progress',
    completed: 'Completed',
    of: 'of',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    showAnswer: 'Show answer',
    hideAnswer: 'Hide answer',
  },
  es: {
    title: 'Ejercicio de tabla',
    instructions: 'Completa la tabla con las formas verbales correctas. Algunas celdas ya están llenas como ejemplos. Cada celda requiere la conjugación apropiada para el sujeto y el verbo dados.',
    tips: 'Consejos',
    checkAnswers: 'Verifica tus respuestas mientras escribes',
    greenCorrect: 'Verde = respuesta perfecta',
    yellowAccent: 'Amarillo = acento/puntuación',
    redIncorrect: 'Rojo = respuesta incorrecta',
    prefilledExample: 'Las celdas grises muestran ejemplos',
    clickForAnswer: 'Haz clic en la celda para ver la respuesta',
    resetAll: 'Reiniciar todo',
    progress: 'Progreso',
    completed: 'Completado',
    of: 'de',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    showAnswer: 'Mostrar respuesta',
    hideAnswer: 'Ocultar respuesta',
  },
};

export function TableWidget({ language, onLanguageToggle, activity }: TableWidgetProps) {
  const t = translations[language];
  const [autoSaving, setAutoSaving] = useState(false);
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [tipsExpanded, setTipsExpanded] = useState(true);

  // Initialize cells from activity data
  const [cells, setCells] = useState<CellData[]>(() => {
    const cellData: CellData[] = [];
    
    activity.questions.answers.forEach((answer) => {
      activity.questions.columns.forEach((column) => {
        const cellResponse = answer.responses[column];
        cellData.push({
          row: answer.row,
          column,
          correctAnswer: cellResponse.value,
          prefilled: cellResponse.prefilled || false,
          userAnswer: cellResponse.prefilled ? cellResponse.value : undefined,
          status: undefined,
        });
      });
    });
    
    return cellData;
  });

  // Auto-collapse tips on mobile
  useEffect(() => {
    const handleResize = () => {
      setTipsExpanded(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasContent = cells.some((cell) => !cell.prefilled && cell.userAnswer && cell.userAnswer.trim() !== '');
      if (hasContent) {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [cells]);

  const normalizeString = (str: string) => {
    return str.trim().toLowerCase().replace(/[¡!¿?]/g, '');
  };

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const getCellKey = (row: string, column: string) => `${row}-${column}`;

  const updateCell = (row: string, column: string, value: string) => {
    setCells((prev) =>
      prev.map((cell) => {
        if (cell.row === row && cell.column === column && !cell.prefilled) {
          // Check answer with three-tier system
          const userAnswer = normalizeString(value);
          const correctAnswer = normalizeString(cell.correctAnswer);

          let status: 'correct' | 'accent' | 'incorrect' | undefined = undefined;

          if (userAnswer) {
            if (userAnswer === correctAnswer) {
              status = 'correct'; // Perfect match
            } else if (removeAccents(userAnswer) === removeAccents(correctAnswer)) {
              status = 'accent'; // Correct but missing accents/apostrophes
            } else {
              status = 'incorrect'; // Wrong answer
            }
          }
          
          return {
            ...cell,
            userAnswer: value,
            status,
          };
        }
        return cell;
      })
    );
  };

  const toggleAnswer = (row: string, column: string) => {
    const key = getCellKey(row, column);
    setShowAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCell = (row: string, column: string): CellData | undefined => {
    return cells.find((cell) => cell.row === row && cell.column === column);
  };

  const handleReset = () => {
    setCells((prev) =>
      prev.map((cell) => ({
        ...cell,
        userAnswer: cell.prefilled ? cell.correctAnswer : undefined,
        status: undefined,
      }))
    );
    setShowAnswers({});
  };

  const totalEditableCells = cells.filter(cell => !cell.prefilled).length;
  const answeredCells = cells.filter((cell) => !cell.prefilled && cell.userAnswer && cell.userAnswer.trim() !== '').length;
  const correctCells = cells.filter((cell) => !cell.prefilled && cell.status === 'correct').length;

  const { theme } = useTheme();

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Instructions Panel */}
      <div 
        className="border-2 rounded-xl p-6 h-fit lg:sticky lg:top-24"
        style={{ 
          backgroundColor: theme.primaryPale,
          borderColor: theme.primaryBorder 
        }}
      >
        <CompactWidgetHeader
          identifier="BtSB1-L1-5"
          breadcrumb={['Lección 1', 'Command Forms', '5']}
          title={t.title}
          icon={Table}
          iconColor="text-white"
          iconBg="bg-gradient-to-br"
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: t.completed,
            color: 'text-green-800',
            bgColor: 'bg-green-100',
            icon: '✓',
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

        {/* Collapsible Tips Section */}
        <div 
          className="mt-6 pt-6 border-t"
          style={{ borderColor: theme.primaryBorder }}
        >
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryPale, color: theme.primaryDark }}
              >
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{t.tips}</span>
            </div>
            <motion.div
              animate={{ rotate: tipsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: theme.primary }}
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
            <ul className="space-y-2 text-sm text-gray-700 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.checkAnswers}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">●</span>
                <span>{t.prefilledExample}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">●</span>
                <span>{t.greenCorrect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">●</span>
                <span>{t.yellowAccent}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">●</span>
                <span>{t.redIncorrect}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {/* Progress bar */}
        <div 
          className="border rounded-lg p-4"
          style={{ 
            backgroundColor: theme.primaryPale,
            borderColor: theme.primaryBorder 
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              {t.progress}: <span style={{ color: theme.primaryDark }}>{answeredCells}</span> {t.of} {totalEditableCells}
              {answeredCells === totalEditableCells && (
                <span className="ml-2 font-medium" style={{ color: theme.primaryDark }}>
                  ({correctCells}/{totalEditableCells} correct)
                </span>
              )}
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
              animate={{
                width: `${(answeredCells / totalEditableCells) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th 
                    className="p-3 text-left font-semibold border-r min-w-[160px] sticky left-0 z-10 text-white"
                    style={{ 
                      backgroundColor: theme.primaryPale,
                      borderColor: theme.primaryBorder 
                    }}
                  >
                    {/* Empty header cell */}
                  </th>
                  {activity.questions.columns.map((column) => (
                    <th
                      key={column}
                      className="p-3 text-center font-semibold border-r min-w-[140px] text-white"
                      style={{ 
                        backgroundColor: theme.primaryPale,
                        borderColor: theme.primaryBorder,
                        color: theme.primaryDark
                      }}
                    >
                      {column}
                    </th>
                  ))}
                  <th className="bg-gray-100 text-gray-700 p-3 text-center font-medium text-sm min-w-[140px]">
                    {t.clickForAnswer}
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity.questions.rows.map((row, rowIndex) => (
                  <tr key={row} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {/* Row Header (Verb) */}
                    <td 
                      className="p-4 font-bold border-r-2 border-gray-200 sticky left-0 z-10"
                      style={{ 
                        color: theme.primaryDark,
                        backgroundColor: theme.primaryPale 
                      }}
                    >
                      <span className="text-blue-600 italic">{row}</span>
                    </td>

                    {/* Input Cells */}
                    {activity.questions.columns.map((column) => {
                      const cell = getCell(row, column);
                      if (!cell) return <td key={column} className="p-3 border-r border-gray-200"></td>;

                      return (
                        <td key={column} className="p-3 border-r border-gray-200">
                          {cell.prefilled ? (
                            // Pre-filled cell - non-editable
                            <div className="w-full px-3 py-2 border-2 border-gray-300 bg-gray-100 text-gray-700 rounded-lg text-center font-medium">
                              {cell.correctAnswer}
                            </div>
                          ) : (
                            // Editable cell
                            <input
                              type="text"
                              value={cell.userAnswer || ''}
                              onChange={(e) => updateCell(row, column, e.target.value)}
                              className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors text-center border-gray-300 bg-white"
                              style={
                                cell.status === 'correct'
                                  ? { borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(22, 101, 52)' }
                                  : cell.status === 'accent'
                                  ? { borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgb(254, 252, 232)', color: 'rgb(113, 63, 18)' }
                                  : cell.status === 'incorrect'
                                  ? { borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(153, 27, 27)' }
                                  : undefined
                              }
                              onFocus={(e) => {
                                if (!cell.status) {
                                  e.currentTarget.style.borderColor = theme.primary;
                                }
                              }}
                              onBlur={(e) => {
                                if (!cell.status) {
                                  e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                                }
                              }}
                              placeholder="..."
                            />
                          )}
                        </td>
                      );
                    })}

                    {/* Answer Column */}
                    <td className="p-3 bg-gray-100">
                      <div className="space-y-1">
                        {activity.questions.columns.map((column) => {
                          const cell = getCell(row, column);
                          const key = getCellKey(row, column);
                          if (!cell || cell.prefilled) return null;

                          return (
                            <div key={column}>
                              {showAnswers[key] ? (
                                <button
                                  onClick={() => toggleAnswer(row, column)}
                                  className="w-full text-xs px-2 py-1 rounded transition-colors text-center font-medium text-white"
                                  style={{
                                    backgroundColor: theme.primary
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryDark}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
                                >
                                  {cell.correctAnswer}
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleAnswer(row, column)}
                                  className="w-full text-xs px-2 py-1 text-gray-600 hover:bg-gray-200 rounded transition-colors text-center"
                                >
                                  {column}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}