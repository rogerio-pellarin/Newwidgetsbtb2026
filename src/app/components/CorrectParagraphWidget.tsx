import { useState, useRef, useEffect } from 'react';
import { FileEdit, Lightbulb, RotateCcw, ChevronDown, ChevronUp, Eye, EyeOff, Languages } from 'lucide-react';
import { WidgetHeader } from './WidgetHeader';
import { CompactWidgetHeader } from './CompactWidgetHeader';
import type { ParagraphCorrectionActivity } from '../../types/activities';
import { getLocalizedText, extractErrorCorrections } from '../../utils/localization';
import { useTheme } from '../../contexts/ThemeContext';

interface CorrectParagraphWidgetProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: ParagraphCorrectionActivity;
}

export function CorrectParagraphWidget({ language, onLanguageToggle, activity }: CorrectParagraphWidgetProps) {
  // Get localized text from activity data
  const question = activity.questions[0]; // Paragraph correction typically has one question
  const originalText = getLocalizedText(question.prompt, language);
  const correctAnswerHTML = getLocalizedText(question.suggested_answer, language);
  const errorCorrections = extractErrorCorrections(originalText, correctAnswerHTML);

  const [userText, setUserText] = useState(originalText);
  const editableRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

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
      if (userText.trim() !== '') {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userText]);

  // Function to find differences and create highlighted HTML
  const getHighlightedHTML = (original: string, edited: string) => {
    // Simple character-level diff highlighting
    // We'll highlight words that contain changed characters
    const originalWords = original.split(/(\s+)/);
    const editedWords = edited.split(/(\s+)/);
    
    // Build a map of original words and their frequencies
    const originalWordMap = new Map<string, number>();
    originalWords.forEach(word => {
      if (word.trim()) {
        originalWordMap.set(word, (originalWordMap.get(word) || 0) + 1);
      }
    });
    
    // Create a copy to track what's been used
    const remainingOriginals = new Map(originalWordMap);
    
    // Process edited words
    return editedWords.map(word => {
      // Skip whitespace
      if (!word.trim()) {
        return word;
      }
      
      // Check if this word exists in the original
      const count = remainingOriginals.get(word) || 0;
      if (count > 0) {
        // Word exists in original, not a change
        remainingOriginals.set(word, count - 1);
        return word;
      } else {
        // This is a new or changed word - highlight it
        return `<strong class="text-orange-600 font-bold">${word}</strong>`;
      }
    }).join('');
  };

  // Handle content changes in contentEditable
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setUserText(newText);
    setIsTyping(true);
  };

  // Apply highlighting after user stops typing
  useEffect(() => {
    if (!isTyping) return;
    
    const timer = setTimeout(() => {
      setIsTyping(false);
      
      if (editableRef.current) {
        const currentText = editableRef.current.textContent || '';
        const highlighted = getHighlightedHTML(originalText, currentText);
        
        // Save cursor position
        const selection = window.getSelection();
        let cursorOffset = 0;
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          cursorOffset = range.startOffset;
          
          // Calculate text offset from start
          let textOffset = 0;
          const walker = document.createTreeWalker(
            editableRef.current,
            NodeFilter.SHOW_TEXT,
            null
          );
          
          let currentNode = walker.nextNode();
          while (currentNode && currentNode !== range.startContainer) {
            textOffset += currentNode.textContent?.length || 0;
            currentNode = walker.nextNode();
          }
          if (currentNode === range.startContainer) {
            textOffset += cursorOffset;
          }
          
          // Update HTML
          editableRef.current.innerHTML = highlighted;
          
          // Restore cursor position
          try {
            let restoredOffset = 0;
            walker.currentNode = editableRef.current;
            currentNode = walker.nextNode();
            
            while (currentNode && restoredOffset + (currentNode.textContent?.length || 0) < textOffset) {
              restoredOffset += currentNode.textContent?.length || 0;
              currentNode = walker.nextNode();
            }
            
            if (currentNode) {
              const newRange = document.createRange();
              const finalOffset = Math.min(textOffset - restoredOffset, currentNode.textContent?.length || 0);
              newRange.setStart(currentNode, finalOffset);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          } catch (err) {
            // Cursor positioning failed, ignore
          }
        } else {
          editableRef.current.innerHTML = highlighted;
        }
      }
    }, 300); // Wait 300ms after last keystroke
    
    return () => clearTimeout(timer);
  }, [userText, isTyping, originalText]);

  // Initialize contentEditable with original text
  useEffect(() => {
    if (editableRef.current && !editableRef.current.textContent) {
      editableRef.current.textContent = originalText;
    }
  }, []);

  const highlightErrors = (text: string) => {
    let highlighted = text;
    const errorWords = errorCorrections.map(error => error.word);
    
    errorWords.forEach((word) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b${word}\\b`, 'g'),
        `<mark class="bg-orange-200 px-1 rounded">${word}</mark>`
      );
    });
    
    return highlighted;
  };

  const highlightCorrections = (text: string) => {
    let corrected = originalText;
    
    // Apply all error corrections
    errorCorrections.forEach(error => {
      const regex = new RegExp(`\\b${error.incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      corrected = corrected.replace(
        regex,
        `<strong class="text-orange-600 font-bold">${error.correct}</strong>`
      );
    });
    
    return corrected;
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsEvaluating(false);
      setShowFeedback(true);
    }, 1500);
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
          identifier="BtSB1-L5-2"
          breadcrumb={['Lección 5', 'Infinitive Usage', '2']}
          title={language === 'en' ? 'Spot the Mistake' : 'Encontrar los errores'}
          icon={FileEdit}
          iconColor="text-white"
          iconBg=""
          iconBgStyle={{ backgroundColor: theme.primary }}
          statusBadge={{
            text: language === 'en' ? 'Completed' : 'Completado',
            color: 'text-green-800',
            bgColor: 'bg-green-100',
            icon: '✓',
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
            {language === 'en' ? 'Correct the seven errors related to infinitive usage in the following narrative.' : 'Corrige los siete errores relacionados con el uso del infinitivo en la siguiente narrativa.'}
          </p>
        </div>

        <div 
          className="mt-6 pt-6 border-t-2"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <div 
              className="w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="font-semibold">{language === 'en' ? 'Tips' : 'Consejos'}</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 bg-white rounded-lg p-3 shadow-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'Your edits are shown in bold orange' : 'Tus ediciones se muestran en naranja negrita'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'Click to get AI feedback' : 'Haz clic para obtener comentarios de IA'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-base" style={{ color: theme.primary }}>•</span>
              <span>{language === 'en' ? 'Toggle to see corrections' : 'Alternar para ver correcciones'}</span>
            </li>
          </ul>
        </div>

        <div 
          className="mt-6 pt-6 border-t-2 space-y-3"
          style={{ borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{language === 'en' ? 'Your correction:' : 'Tu corrección:'}</span>
            <span className="font-semibold" style={{ color: theme.primaryDark }}>1</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          {autoSaving ? (language === 'en' ? 'Auto-saving...' : 'Guardando automáticamente...') : (language === 'en' ? 'Saved' : 'Guardado')}
        </div>

        <button 
          className="mt-6 w-full bg-white hover:bg-gray-50 border-2 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          style={{
            borderColor: theme.primaryBorder
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'en' ? 'Reset' : 'Reiniciar'}</span>
        </button>
      </div>

      {/* Activity Panel */}
      <div className="space-y-6">
        {/* Single Compact Container */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {/* Header with Show Corrections Toggle */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">{language === 'en' ? 'Your correction: 1' : 'Tu corrección: 1'}</h3>
              <button
                onClick={() => setShowCorrection(!showCorrection)}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                  showCorrection
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showCorrection ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCorrection ? (language === 'en' ? 'Hide' : 'Ocultar') : (language === 'en' ? 'Show' : 'Mostrar')} {language === 'en' ? 'Corrections' : 'Correcciones'}</span>
              </button>
            </div>
          </div>

          {/* Editable Text Area */}
          <div className="p-6">
            <div
              ref={editableRef}
              contentEditable
              onInput={handleInput}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none min-h-[160px] leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            />
            
            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Evaluating...' : 'Evaluando...'}</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5" />
                  <span>{language === 'en' ? 'Ask Coach' : 'Preguntar Coach'}</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback */}
          {showFeedback && (
            <>
              <div className="border-t border-gray-200" />
              <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-700" />
                    <h3 className="text-amber-900">{language === 'en' ? 'Feedback' : 'Comentarios'}</h3>
                  </div>
                  <ChevronUp className="w-5 h-5 text-amber-700" />
                </button>
                <p className="text-sm text-amber-900 italic leading-relaxed">
                  {language === 'en' 
                    ? 'Nice work! Just a few things: "lleganda" should be the infinitive, "viajando" needs the infinitive form, "viendo es creyendo" needs a different verb, "esperando" needs the infinitive, "saliéramos" needs the infinitive and "fumando" also needs the infinitive form. You\'re almost there!'
                    : '¡Buen trabajo! Solo algunas cosas: "lleganda" debe ser el infinitivo, "viajando" necesita la forma infinitiva, "viendo es creyendo" necesita un verbo diferente, "esperando" necesita el infinitivo, "saliéramos" necesita el infinitivo y "fumando" también necesita la forma infinitiva. ¡Casi lo logras!'}
                </p>
              </div>
            </>
          )}

          {/* Corrected Text */}
          {showCorrection && (
            <>
              <div className="border-t border-gray-200" />
              <div className="p-6 bg-orange-50">
                <h3 className="text-sm font-medium text-gray-700 mb-4">{language === 'en' ? 'Corrected text:' : 'Texto corregido:'}</h3>
                <div
                  className="text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightCorrections(userText) }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}