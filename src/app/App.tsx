import { useState, useEffect } from 'react';
import { FillInBlanksWidget } from './components/FillInBlanksWidget';
import { ExtendedResponseWidget } from './components/ExtendedResponseWidget';
import { OralPracticeWidget } from './components/OralPracticeWidget';
import { CorrectParagraphWidget } from './components/CorrectParagraphWidget';
import { VerbConjugationWidget } from './components/VerbConjugationWidget';
import { FillInBlanksAIWidget } from './components/FillInBlanksAIWidget';
import { AICompositionWidget } from './components/AICompositionWidget';
import { AIChatWidget } from './components/AIChatWidget';
import { AIChatWidgetMobile } from './components/AIChatWidgetMobile';
import { AIChatWidgetResponsive } from './components/AIChatWidgetResponsive';
import { DropdownWidget } from './components/DropdownWidget';
import { TableWidget } from './components/TableWidget';
import { VerbIdentificationWidget } from './components/VerbIdentificationWidget';
import { DrawingVocabularyWidget } from './components/DrawingVocabularyWidget';
import { LanguageToggle } from './components/LanguageToggle';
import { BookSelector } from './components/BookSelector';
import { ThemeProvider } from '../contexts/ThemeContext';
import { activityAPI } from '../services/api';
import type {
  VerbConjugationActivity,
  FillInBlanksAIActivity,
  AICompositionActivity,
  OralPracticeActivity,
  AIChatActivity,
  ParagraphCorrectionActivity,
  ExtendedResponseActivity,
  DropdownActivity,
  TableActivity,
  VerbIdentificationActivity,
  DrawingVocabularyActivity,
} from '../types/activities';

export default function App() {
  const [activeWidget, setActiveWidget] = useState<
    | 'fill-blanks'
    | 'fill-blanks-ai'
    | 'extended-response'
    | 'oral-practice'
    | 'correct-paragraph'
    | 'conjugation'
    | 'ai-composition'
    | 'ai-chat'
    | 'dropdown'
    | 'table'
    | 'verb-id'
    | 'drawing'
  >('fill-blanks');
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Activity data state
  const [verbConjugationData, setVerbConjugationData] = useState<VerbConjugationActivity | null>(null);
  const [fillBlanksAIData, setFillBlanksAIData] = useState<FillInBlanksAIActivity | null>(null);
  const [aiCompositionData, setAICompositionData] = useState<AICompositionActivity | null>(null);
  const [oralPracticeData, setOralPracticeData] = useState<OralPracticeActivity | null>(null);
  const [aiChatData, setAIChatData] = useState<AIChatActivity | null>(null);
  const [paragraphCorrectionData, setParagraphCorrectionData] = useState<ParagraphCorrectionActivity | null>(null);
  const [extendedResponseData, setExtendedResponseData] = useState<ExtendedResponseActivity | null>(null);
  const [dropdownData, setDropdownData] = useState<DropdownActivity | null>(null);
  const [tableData, setTableData] = useState<TableActivity | null>(null);
  const [verbIdData, setVerbIdData] = useState<VerbIdentificationActivity | null>(null);
  const [drawingData, setDrawingData] = useState<DrawingVocabularyActivity | null>(null);
  const [showEmbedInfo, setShowEmbedInfo] = useState(true);

  // Load activity data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [verb, fillAI, aiComp, oral, aiChat, paragraph, extended, dropdown, table, verbId, drawing] = await Promise.all([
          activityAPI.fetchVerbConjugation(3062),
          activityAPI.fetchFillInBlanksAI(1),
          activityAPI.fetchAIComposition(1),
          activityAPI.fetchOralPractice(3057),
          activityAPI.fetchAIChat(1),
          activityAPI.fetchParagraphCorrection(3074),
          activityAPI.fetchExtendedResponse(2528),
          activityAPI.fetchDropdownActivity(2520),
          activityAPI.fetchTableActivity(1287),
          activityAPI.fetchVerbIdentification(2100),
          activityAPI.fetchDrawingVocabulary(1500),
        ]);

        setVerbConjugationData(verb);
        setFillBlanksAIData(fillAI);
        setAICompositionData(aiComp);
        setOralPracticeData(oral);
        setAIChatData(aiChat);
        setParagraphCorrectionData(paragraph);
        setExtendedResponseData(extended);
        setDropdownData(dropdown);
        setTableData(table);
        setVerbIdData(verbId);
        setDrawingData(drawing);
      } catch (error) {
        console.error('Failed to load activity data:', error);
      }
    };

    loadData();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Embeddable Widget Info Banner */}
        {showEmbedInfo && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-blue-900">
                    <strong>🎉 New:</strong> These widgets can now be embedded in WordPress/Elementor! 
                    See <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">WORDPRESS_INTEGRATION.md</code> for details.
                  </p>
                </div>
                <button
                  onClick={() => setShowEmbedInfo(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  aria-label="Dismiss"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Navigation with Book Selector */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Breaking the Barrier - Assessment Widgets</h1>
              <BookSelector />
            </div>
            
            {/* Widget Selector */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveWidget('fill-blanks')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'fill-blanks'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fill-in Practice
              </button>
              <button
                onClick={() => setActiveWidget('fill-blanks-ai')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'fill-blanks-ai'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Guided Fill-in
              </button>
              <button
                onClick={() => setActiveWidget('extended-response')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'extended-response'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Open Response
              </button>
              <button
                onClick={() => setActiveWidget('oral-practice')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'oral-practice'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Oral Practice
              </button>
              <button
                onClick={() => setActiveWidget('correct-paragraph')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'correct-paragraph'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Spot the Mistake
              </button>
              <button
                onClick={() => setActiveWidget('conjugation')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'conjugation'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verb Practice
              </button>
              <button
                onClick={() => setActiveWidget('ai-composition')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'ai-composition'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Writing Practice
              </button>
              <button
                onClick={() => setActiveWidget('ai-chat')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'ai-chat'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Conversation Practice
              </button>
              <button
                onClick={() => setActiveWidget('dropdown')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'dropdown'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dropdown Match
              </button>
              <button
                onClick={() => setActiveWidget('table')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'table'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Info Grid
              </button>
              <button
                onClick={() => setActiveWidget('verb-id')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'verb-id'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verb Finder
              </button>
              <button
                onClick={() => setActiveWidget('drawing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeWidget === 'drawing'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sketch & Label
              </button>
            </div>
          </div>
        </div>

        {/* Active Widget */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeWidget === 'fill-blanks' && <FillInBlanksWidget language={language} onLanguageToggle={toggleLanguage} />}
          {activeWidget === 'fill-blanks-ai' && fillBlanksAIData && (
            <FillInBlanksAIWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={fillBlanksAIData}
            />
          )}
          {activeWidget === 'extended-response' && extendedResponseData && (
            <ExtendedResponseWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={extendedResponseData}
            />
          )}
          {activeWidget === 'oral-practice' && oralPracticeData && (
            <OralPracticeWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={oralPracticeData}
            />
          )}
          {activeWidget === 'correct-paragraph' && paragraphCorrectionData && (
            <CorrectParagraphWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={paragraphCorrectionData}
            />
          )}
          {activeWidget === 'conjugation' && verbConjugationData && (
            <VerbConjugationWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={verbConjugationData}
            />
          )}
          {activeWidget === 'ai-composition' && aiCompositionData && (
            <AICompositionWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={aiCompositionData}
            />
          )}
          {activeWidget === 'ai-chat' && aiChatData && (
            <AIChatWidgetResponsive 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={aiChatData}
            />
          )}
          {activeWidget === 'dropdown' && dropdownData && (
            <DropdownWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={dropdownData}
            />
          )}
          {activeWidget === 'table' && tableData && (
            <TableWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={tableData}
            />
          )}
          {activeWidget === 'verb-id' && verbIdData && (
            <VerbIdentificationWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={verbIdData}
            />
          )}
          {activeWidget === 'drawing' && drawingData && (
            <DrawingVocabularyWidget 
              language={language} 
              onLanguageToggle={toggleLanguage}
              activity={drawingData}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}