import { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, Lightbulb, Undo2, Redo2, Trash2, Send, Pencil, Eraser, Languages } from 'lucide-react';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import { motion, AnimatePresence } from 'motion/react';
import type { DrawingVocabularyActivity, AIDrawingFeedback } from '../../types/activities';
import { useTheme } from '../../contexts/ThemeContext';

interface DrawingState {
  wordId: number;
  imageData: string | null;
  feedback?: AIDrawingFeedback;
  submitted: boolean;
}

interface DrawingVocabularyWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: DrawingVocabularyActivity;
}

type Tool = 'pencil' | 'eraser';

const translations = {
  en: {
    title: 'Sketch & Label',
    instructionsLabel: 'Instructions:',
    tips: 'Tips',
    useSimpleShapes: 'Use simple shapes and lines',
    dontWorryPerfect: "Don't worry about being perfect!",
    aiWillRecognize: 'AI will recognize key features',
    clickWordToDraw: 'Click a word card to start drawing',
    pencilTool: 'Pencil',
    eraserTool: 'Eraser',
    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear',
    submitForReview: 'Submit for AI Review',
    submitting: 'Analyzing...',
    drawWord: 'Draw',
    yourDrawings: 'Your Drawings',
    notStarted: 'Not started',
    inProgress: 'In progress',
    completed: 'Completed',
    selectWord: 'Select a word to draw',
    progress: 'Progress',
    of: 'of',
    autoSaving: 'Auto-saving...',
    saved: 'Saved',
    aiFeedback: 'AI Feedback',
    score: 'Score',
    tryAgain: 'Draw Again',
    nextWord: 'Next Word',
  },
  es: {
    title: 'Dibujo de vocabulario',
    instructionsLabel: 'Instrucciones:',
    tips: 'Consejos',
    useSimpleShapes: 'Usa formas y líneas simples',
    dontWorryPerfect: '¡No te preocupes por ser perfecto!',
    aiWillRecognize: 'La IA reconocerá las características clave',
    clickWordToDraw: 'Haz clic en una tarjeta de palabra para comenzar a dibujar',
    pencilTool: 'Lápiz',
    eraserTool: 'Borrador',
    undo: 'Deshacer',
    redo: 'Rehacer',
    clear: 'Limpiar',
    submitForReview: 'Enviar para revisión de IA',
    submitting: 'Analizando...',
    drawWord: 'Dibujar',
    yourDrawings: 'Tus dibujos',
    notStarted: 'No iniciado',
    inProgress: 'En progreso',
    completed: 'Completado',
    selectWord: 'Selecciona una palabra para dibujar',
    progress: 'Progreso',
    of: 'de',
    autoSaving: 'Guardando automáticamente...',
    saved: 'Guardado',
    aiFeedback: 'Retroalimentación de IA',
    score: 'Puntuación',
    tryAgain: 'Dibujar de nuevo',
    nextWord: 'Siguiente palabra',
  },
};

const COLORS = [
  '#000000', '#4B5563', '#6B7280', '#D1D5DB',
  '#EF4444', '#F59E0B', '#FBBF24', '#84CC16',
  '#10B981', '#14B8A6', '#06B6D4', '#3B82F6',
  '#6366F1', '#8B5CF6', '#A855F7', '#EC4899',
];

const BRUSH_SIZES = [2, 4, 6, 8, 12, 16, 20, 24];

export function DrawingVocabularyWidget({ language, onLanguageToggle, activity }: DrawingVocabularyWidgetProps) {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [drawingStates, setDrawingStates] = useState<DrawingState[]>(
    activity.vocabulary.map((word) => ({
      wordId: word.id,
      imageData: null,
      submitted: false,
    }))
  );
  const [history, setHistory] = useState<string[]>([]); // Store as data URLs instead
  const [historyStep, setHistoryStep] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Auto-collapse tips on mobile
  useEffect(() => {
    const handleResize = () => {
      setTipsExpanded(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to resize canvas
    const resizeCanvas = () => {
      // Get the actual rendered size using getBoundingClientRect
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);
      
      // Only resize if dimensions have changed
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        // Save current canvas content
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (canvas.width > 0 && canvas.height > 0) {
          tempCtx.drawImage(canvas, 0, 0);
        }
        
        // Set canvas internal bitmap size to match display size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Set white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, displayWidth, displayHeight);
        
        // Restore content if it existed, scaling to new size
        if (tempCanvas.width > 0 && tempCanvas.height > 0) {
          ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, displayWidth, displayHeight);
        }
      }
    };

    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      resizeCanvas();
      // Only save to history after initial setup
      setTimeout(() => {
        if (history.length === 0) {
          saveToHistory();
        }
      }, 100);
    });

    // Add resize listener
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(resizeCanvas);
    });
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Load saved drawing when word is selected
  useEffect(() => {
    if (selectedWordId !== null) {
      const state = drawingStates.find((s) => s.wordId === selectedWordId);
      if (state?.imageData) {
        loadImageData(state.imageData);
      } else {
        clearCanvas();
      }
    }
  }, [selectedWordId]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = canvas.toDataURL('image/png');
    setHistory((prev) => [...prev.slice(0, historyStep + 1), imageData]);
    setHistoryStep((prev) => prev + 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep((prev) => prev - 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[historyStep - 1]) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyStep - 1];
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep((prev) => prev + 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[historyStep + 1]) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyStep + 1];
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const loadImageData = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToHistory();
    };
    img.src = dataUrl;
  };

  const saveCurrentDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || selectedWordId === null) return;

    const imageData = canvas.toDataURL('image/png');
    setDrawingStates((prev) =>
      prev.map((state) =>
        state.wordId === selectedWordId
          ? { ...state, imageData }
          : state
      )
    );
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;

    lastPointRef.current = { x, y };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPointRef.current = { x, y };
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPointRef.current = null;
      saveToHistory();
      saveCurrentDrawing();
    }
  };

  // Touch event handlers for mobile support
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;

    lastPointRef.current = { x, y };
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPointRef.current = { x, y };
    }
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const submitDrawing = async () => {
    if (selectedWordId === null) return;

    setIsSubmitting(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock AI feedback
    const selectedWord = activity.vocabulary.find((w) => w.id === selectedWordId);
    const mockFeedback: AIDrawingFeedback = {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      feedback: {
        en: `That certainly looks like ${selectedWord?.article?.en ? selectedWord.article.en + ' ' : ''}${selectedWord?.word.en}! You've clearly understood the concept.`,
        es: `¡Eso ciertamente parece ${selectedWord?.article?.es} ${selectedWord?.word.es}! Has entendido claramente el concepto.`,
      },
      recognizedElements: ['basic shape', 'proportions', 'key details'],
    };

    setDrawingStates((prev) =>
      prev.map((state) =>
        state.wordId === selectedWordId
          ? { ...state, feedback: mockFeedback, submitted: true }
          : state
      )
    );

    setIsSubmitting(false);
    setAutoSaving(true);
    setTimeout(() => setAutoSaving(false), 1000);
  };

  const drawAgain = () => {
    if (selectedWordId === null) return;

    setDrawingStates((prev) =>
      prev.map((state) =>
        state.wordId === selectedWordId
          ? { ...state, feedback: undefined, submitted: false }
          : state
      )
    );
    clearCanvas();
  };

  const selectWord = (wordId: number) => {
    if (selectedWordId !== null) {
      saveCurrentDrawing();
    }
    setSelectedWordId(wordId);
    setShowHint(false); // Reset hint when changing words
  };

  const completedCount = drawingStates.filter((s) => s.submitted).length;
  const selectedWord = activity.vocabulary.find((w) => w.id === selectedWordId);
  const currentState = selectedWordId ? drawingStates.find((s) => s.wordId === selectedWordId) : null;

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
          identifier="BtSB1-L3-5"
          breadcrumb={['Lección 3', 'Vocabulario', '5']}
          title={t.title}
          icon={Palette}
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

        <div 
          className="bg-white/60 rounded-lg p-4 border mb-4"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-gray-900">
              {t.instructionsLabel}
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
            {activity.instructions[language] || activity.instructions.en}
          </p>
        </div>

        {/* Progress */}
        <div 
          className="bg-white/60 rounded-lg p-4 border mb-4"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t.progress}: <span style={{ color: theme.primaryDark }}>{completedCount}</span> {t.of} {activity.vocabulary.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / activity.vocabulary.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Vocabulary Words */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">{t.yourDrawings}</h3>
          <div className="space-y-2">
            {activity.vocabulary.map((word) => {
              const state = drawingStates.find((s) => s.wordId === word.id);
              const isSelected = selectedWordId === word.id;
              const hasDrawing = state?.imageData;
              const isCompleted = state?.submitted;

              return (
                <button
                  key={word.id}
                  onClick={() => selectWord(word.id)}
                  className="w-full text-left p-3 rounded-lg border-2 transition-all"
                  style={
                    isSelected
                      ? {
                          borderColor: theme.primary,
                          backgroundColor: theme.primaryPale,
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        }
                      : hasDrawing
                      ? {
                          borderColor: theme.primaryBorder,
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        }
                      : {
                          borderColor: 'rgb(229, 231, 235)',
                          backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = theme.primaryBorder;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      if (hasDrawing) {
                        e.currentTarget.style.borderColor = theme.primaryBorder;
                      } else {
                        e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                      {hasDrawing ? (
                        <img src={state.imageData!} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {word.id}
                        </div>
                      )}
                    </div>

                    {/* Word Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {word.article?.es} {word.word.es}
                      </div>
                    </div>

                    {/* Status */}
                    {isCompleted && (
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Tips Section */}
        <div 
          className="pt-4 border-t"
          style={{ borderColor: theme.primaryBorder }}
        >
          <button
            onClick={() => setTipsExpanded(!tipsExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center"
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
                <span>{t.useSimpleShapes}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.dontWorryPerfect}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.aiWillRecognize}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: theme.primary }}>•</span>
                <span>{t.clickWordToDraw}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? t.autoSaving : t.saved}
        </div>
      </div>

      {/* Drawing Canvas Section */}
      <div className="space-y-4">
        {selectedWord ? (
          <>
            {/* Current Word Header */}
            <div className="bg-white border-2 border-cyan-200 rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-0.5">
                    {t.drawWord}: <span className="font-semibold text-gray-900">{selectedWord.article?.es} {selectedWord.word.es}</span>
                  </div>
                  {selectedWord.hint && (
                    <div className="mt-2">
                      {!showHint ? (
                        <button
                          onClick={() => setShowHint(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors text-xs"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-700 font-medium">
                            {language === 'en' ? 'Show Hint' : 'Mostrar pista'}
                          </span>
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md"
                        >
                          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-amber-900 italic">{selectedWord.hint[language]}</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 relative">
              {/* Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawingTouch}
                  onTouchMove={drawTouch}
                  onTouchEnd={stopDrawingTouch}
                  onTouchCancel={stopDrawingTouch}
                  className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
                  style={{ height: '500px' }}
                />

                {/* Floating Toolbar */}
                <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 space-y-3">
                  {/* Tool Selection */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTool('pencil')}
                      className={`p-2 rounded-lg transition-colors ${
                        tool === 'pencil'
                          ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-500'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                      title={t.pencilTool}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className={`p-2 rounded-lg transition-colors ${
                        tool === 'eraser'
                          ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-500'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                      title={t.eraserTool}
                    >
                      <Eraser className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Color Palette */}
                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-600 mb-2 font-medium">Color</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded border-2 transition-transform hover:scale-110 ${
                            color === c ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Brush Size */}
                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-600 mb-2 font-medium">Size</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {BRUSH_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
                            brushSize === size
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-gray-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div
                            className="rounded-full bg-gray-800"
                            style={{ width: `${size}px`, height: `${size}px` }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-3 space-y-2">
                    <button
                      onClick={undo}
                      disabled={historyStep <= 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
                    >
                      <Undo2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{t.undo}</span>
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyStep >= history.length - 1}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
                    >
                      <Redo2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{t.redo}</span>
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs font-medium">{t.clear}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button / Feedback */}
              <div className="mt-6">
                {currentState?.submitted && currentState.feedback ? (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t.aiFeedback}</div>
                          <div className="text-sm text-gray-600">
                            {t.score}: {currentState.feedback.score}/100
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {currentState.feedback.feedback[language]}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={drawAgain}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {t.tryAgain}
                      </button>
                      <button
                        onClick={() => {
                          const nextWord = activity.vocabulary.find((w, i) => {
                            const currentIndex = activity.vocabulary.findIndex((v) => v.id === selectedWordId);
                            return i > currentIndex;
                          });
                          if (nextWord) selectWord(nextWord.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-colors"
                      >
                        {t.nextWord}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={submitDrawing}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium text-lg shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? t.submitting : t.submitForReview}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t.selectWord}</p>
          </div>
        )}
      </div>
    </div>
  );
}