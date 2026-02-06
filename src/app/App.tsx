import { useState, useEffect } from 'react';
import { FillInBlanksWidget } from './components/FillInBlanksWidget';
import { ExtendedResponseWidget } from './components/ExtendedResponseWidget';
import { OralPracticeWidget } from './components/OralPracticeWidget';
import { ListeningComprehensionWidget } from './components/ListeningComprehensionWidget';
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
import { ChevronDown } from 'lucide-react';
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
    | 'listening-comprehension'
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

  // Widget options for dropdown
  const widgetOptions = [
    { id: 'fill-blanks' as const, label: 'Fill-in Practice' },
    { id: 'fill-blanks-ai' as const, label: 'Guided Fill-in' },
    { id: 'extended-response' as const, label: 'Open Response' },
    { id: 'oral-practice' as const, label: 'Oral Practice' },
    { id: 'listening-comprehension' as const, label: 'Listening Comprehension' },
    { id: 'correct-paragraph' as const, label: 'Spot the Mistake' },
    { id: 'conjugation' as const, label: 'Verb Practice' },
    { id: 'ai-composition' as const, label: 'Writing Practice' },
    { id: 'ai-chat' as const, label: 'Conversation Practice' },
    { id: 'dropdown' as const, label: 'Dropdown Match' },
    { id: 'table' as const, label: 'Info Grid' },
    { id: 'verb-id' as const, label: 'Verb Finder' },
    { id: 'drawing' as const, label: 'Sketch & Label' },
  ];

  const currentWidgetLabel = widgetOptions.find(w => w.id === activeWidget)?.label || 'Select Widget';

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
            {/* Dropdown for all screen sizes */}
            <div className="relative">
              <select
                value={activeWidget}
                onChange={(e) => setActiveWidget(e.target.value as any)}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-gray-500 text-gray-900 font-medium"
              >
                {widgetOptions.map((widget) => (
                  <option key={widget.id} value={widget.id}>
                    {widget.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
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
          {activeWidget === 'listening-comprehension' && oralPracticeData && (
            <ListeningComprehensionWidget 
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