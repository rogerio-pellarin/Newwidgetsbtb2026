import { useState, useEffect } from 'react';
import { FillInBlanksWidget } from './components/FillInBlanksWidget';
import { ExtendedResponseWidget } from './components/ExtendedResponseWidget';
import { OralPracticeWidget } from './components/OralPracticeWidget';
import { CorrectParagraphWidget } from './components/CorrectParagraphWidget';
import { VerbConjugationWidget } from './components/VerbConjugationWidget';
import { FillInBlanksAIWidget } from './components/FillInBlanksAIWidget';
import { AICompositionWidget } from './components/AICompositionWidget';
import { AIChatWidgetResponsive } from './components/AIChatWidgetResponsive';
import { DropdownWidget } from './components/DropdownWidget';
import { TableWidget } from './components/TableWidget';
import { VerbIdentificationWidget } from './components/VerbIdentificationWidget';
import { DrawingVocabularyWidget } from './components/DrawingVocabularyWidget';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { activityAPI } from '../services/api';
import type {
  Activity,
  ActivityType,
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

export interface EmbeddableWidgetConfig {
  widgetId: string; // Unique identifier for the widget instance
  activityType: ActivityType; // Type of activity to render
  activityId: number; // Database ID of the activity data
  bookSeries?: 'BtSB1' | 'BtSB2' | 'BtSB3' | 'BtSB4' | 'BtSB5' | 'BtFB1' | 'BtFB2' | 'BtFB3'; // Optional book series override
  language?: 'en' | 'es'; // Initial language (defaults to 'en')
  apiBaseUrl?: string; // Optional custom API endpoint
}

interface EmbeddableWidgetInnerProps {
  config: EmbeddableWidgetConfig;
}

/**
 * Inner component that renders the actual widget content
 * This component is wrapped by ThemeProvider
 */
function EmbeddableWidgetInner({ config }: EmbeddableWidgetInnerProps) {
  const [language, setLanguage] = useState<'en' | 'es'>(config.language || 'en');
  const [activityData, setActivityData] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentBook } = useTheme();

  // Set the book series if provided
  useEffect(() => {
    if (config.bookSeries) {
      setCurrentBook(config.bookSeries);
    }
  }, [config.bookSeries, setCurrentBook]);

  // Fetch activity data
  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If a custom API URL is provided, you would use it here
        // For now, we use the default activityAPI service
        const data = await activityAPI.fetchActivity(config.activityType, config.activityId);
        setActivityData(data);
      } catch (err) {
        console.error('Failed to load activity:', err);
        setError('Failed to load activity. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [config.activityType, config.activityId, config.apiBaseUrl]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !activityData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-600 mt-2">{error || 'Activity not found'}</p>
        </div>
      </div>
    );
  }

  // Render the appropriate widget based on activity type
  const renderWidget = () => {
    switch (config.activityType) {
      case 'verb_conjugation':
        return (
          <VerbConjugationWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as VerbConjugationActivity}
          />
        );

      case 'fill_in_blanks_ai':
        return (
          <FillInBlanksAIWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as FillInBlanksAIActivity}
          />
        );

      case 'ai_composition':
        return (
          <AICompositionWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as AICompositionActivity}
          />
        );

      case 'oral_practice':
        return (
          <OralPracticeWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as OralPracticeActivity}
          />
        );

      case 'ai_chat':
        return (
          <AIChatWidgetResponsive
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as AIChatActivity}
          />
        );

      case 'paragraph_correction':
        return (
          <CorrectParagraphWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as ParagraphCorrectionActivity}
          />
        );

      case 'extended_response':
        return (
          <ExtendedResponseWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as ExtendedResponseActivity}
          />
        );

      case 'dropdown_selection':
        return (
          <DropdownWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as DropdownActivity}
          />
        );

      case 'table_fill_blanks':
        return (
          <TableWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as TableActivity}
          />
        );

      case 'verb_identification':
        return (
          <VerbIdentificationWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as VerbIdentificationActivity}
          />
        );

      case 'drawing_vocabulary':
        return (
          <DrawingVocabularyWidget
            language={language}
            onLanguageToggle={toggleLanguage}
            activity={activityData as DrawingVocabularyActivity}
          />
        );

      default:
        return (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Unknown activity type: {config.activityType}</p>
          </div>
        );
    }
  };

  return <div className="btb-widget-container">{renderWidget()}</div>;
}

/**
 * Main embeddable widget component
 * This is the component that will be mounted in WordPress
 */
export function EmbeddableWidget({ config }: EmbeddableWidgetInnerProps) {
  return (
    <ThemeProvider>
      <EmbeddableWidgetInner config={config} />
    </ThemeProvider>
  );
}

/**
 * Helper function to initialize a widget in a DOM element
 * This is the main function WordPress will call to embed widgets
 * 
 * @example
 * ```html
 * <div id="btb-widget-1"></div>
 * <script>
 *   window.BTBWidgets.initWidget('btb-widget-1', {
 *     widgetId: 'widget-1',
 *     activityType: 'verb_conjugation',
 *     activityId: 3062,
 *     bookSeries: 'BtSB1',
 *     language: 'en'
 *   });
 * </script>
 * ```
 */
export function initWidget(elementId: string, config: EmbeddableWidgetConfig): void {
  // This will be implemented in the widget-embed.tsx entry point
  // It's exported here for type safety
  console.log('Widget initialization:', elementId, config);
}
