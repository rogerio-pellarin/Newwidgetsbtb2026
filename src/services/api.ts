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

// Import sample data - using static imports for better bundling
import verbConjugationData from '../data/sample-verb-conjugation.json';
import fillBlanksAIData from '../data/sample-fill-blanks-ai.json';
import aiCompositionData from '../data/sample-ai-composition.json';
import oralPracticeData from '../data/sample-oral-practice.json';
import aiChatData from '../data/sample-ai-chat.json';
import paragraphCorrectionData from '../data/sample-paragraph-correction.json';
import extendedResponseData from '../data/sample-extended-response.json';
import dropdownSelectionData from '../data/dropdown-selection-sample.json';
import tableFillBlanksData from '../data/table-fill-blanks-sample.json';
import verbIdentificationData from '../data/verb-identification-sample.json';
import drawingVocabularyData from '../data/drawing-vocabulary-sample.json';

/**
 * API Service for fetching activity data from the backend
 * 
 * In production, these functions will make actual HTTP requests to your backend.
 * For now, they return sample data from JSON files.
 */
class ActivityAPIService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch an activity by ID and type
   * @param activityType - The type of activity to fetch
   * @param activityId - The unique ID of the activity
   */
  async fetchActivity(activityType: ActivityType, activityId: number): Promise<Activity> {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/activities/${activityType}/${activityId}`);
    // if (!response.ok) throw new Error('Failed to fetch activity');
    // return response.json();

    // For now, return mock data based on type
    return this.getMockActivity(activityType, activityId);
  }

  /**
   * Fetch a verb conjugation activity
   */
  async fetchVerbConjugation(activityId: number): Promise<VerbConjugationActivity> {
    return this.fetchActivity('verb_conjugation', activityId) as Promise<VerbConjugationActivity>;
  }

  /**
   * Fetch a fill in the blanks (AI) activity
   */
  async fetchFillInBlanksAI(activityId: number): Promise<FillInBlanksAIActivity> {
    return this.fetchActivity('fill_in_blanks_ai', activityId) as Promise<FillInBlanksAIActivity>;
  }

  /**
   * Fetch an AI composition activity
   */
  async fetchAIComposition(activityId: number): Promise<AICompositionActivity> {
    return this.fetchActivity('ai_composition', activityId) as Promise<AICompositionActivity>;
  }

  /**
   * Fetch an oral practice activity
   */
  async fetchOralPractice(activityId: number): Promise<OralPracticeActivity> {
    return this.fetchActivity('oral_practice', activityId) as Promise<OralPracticeActivity>;
  }

  /**
   * Fetch a listening comprehension activity
   */
  async fetchListeningComprehension(activityId: number): Promise<OralPracticeActivity> {
    return this.fetchActivity('listening_comprehension', activityId) as Promise<OralPracticeActivity>;
  }

  /**
   * Fetch an AI chat activity
   */
  async fetchAIChat(activityId: number): Promise<AIChatActivity> {
    return this.fetchActivity('ai_chat', activityId) as Promise<AIChatActivity>;
  }

  /**
   * Fetch a paragraph correction activity
   */
  async fetchParagraphCorrection(activityId: number): Promise<ParagraphCorrectionActivity> {
    return this.fetchActivity('paragraph_correction', activityId) as Promise<ParagraphCorrectionActivity>;
  }

  /**
   * Fetch an extended response activity
   */
  async fetchExtendedResponse(activityId: number): Promise<ExtendedResponseActivity> {
    return this.fetchActivity('extended_response', activityId) as Promise<ExtendedResponseActivity>;
  }

  /**
   * Fetch a dropdown selection activity
   */
  async fetchDropdownActivity(activityId: number): Promise<DropdownActivity> {
    return this.fetchActivity('dropdown_selection', activityId) as Promise<DropdownActivity>;
  }

  /**
   * Fetch a table fill blanks activity
   */
  async fetchTableActivity(activityId: number): Promise<TableActivity> {
    return this.fetchActivity('table_fill_blanks', activityId) as Promise<TableActivity>;
  }

  /**
   * Fetch a verb identification activity
   */
  async fetchVerbIdentification(activityId: number): Promise<VerbIdentificationActivity> {
    return this.fetchActivity('verb_identification', activityId) as Promise<VerbIdentificationActivity>;
  }

  /**
   * Fetch a drawing vocabulary activity
   */
  async fetchDrawingVocabulary(activityId: number): Promise<DrawingVocabularyActivity> {
    return this.fetchActivity('drawing_vocabulary', activityId) as Promise<DrawingVocabularyActivity>;
  }

  /**
   * Mock data generator (temporary - remove when connecting to real backend)
   */
  private getMockActivity(activityType: ActivityType, activityId: number): Activity {
    // This would be replaced with actual API calls
    // For now, return sample data from imported JSON files
    switch (activityType) {
      case 'verb_conjugation':
        return verbConjugationData as any;
      case 'fill_in_blanks_ai':
        return fillBlanksAIData as any;
      case 'ai_composition':
        return aiCompositionData as any;
      case 'oral_practice':
        return oralPracticeData as any;
      case 'listening_comprehension':
        return oralPracticeData as any; // Use same data structure as oral practice
      case 'ai_chat':
        return aiChatData as any;
      case 'paragraph_correction':
        return paragraphCorrectionData as any;
      case 'extended_response':
        return extendedResponseData as any;
      case 'dropdown_selection':
        return dropdownSelectionData as any;
      case 'table_fill_blanks':
        return tableFillBlanksData as any;
      case 'verb_identification':
        return verbIdentificationData as any;
      case 'drawing_vocabulary':
        return drawingVocabularyData as any;
      default:
        throw new Error(`Unknown activity type: ${activityType}`);
    }
  }
}

// Export a singleton instance
export const activityAPI = new ActivityAPIService();

// Export the class for custom instances if needed
export { ActivityAPIService };