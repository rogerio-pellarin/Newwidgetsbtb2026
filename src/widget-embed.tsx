import React from 'react';
import ReactDOM from 'react-dom/client';
import { EmbeddableWidget, EmbeddableWidgetConfig } from './app/EmbeddableWidget';
import './styles/index.css';

/**
 * Global namespace for Breaking the Barrier widgets
 * This will be available as window.BTBWidgets in WordPress
 */
declare global {
  interface Window {
    BTBWidgets: {
      initWidget: (elementId: string, config: EmbeddableWidgetConfig) => void;
      destroyWidget: (elementId: string) => void;
      version: string;
    };
  }
}

// Store React roots for cleanup
const widgetRoots = new Map<string, ReactDOM.Root>();

/**
 * Initialize a Breaking the Barrier widget in a DOM element
 * 
 * @param elementId - The ID of the DOM element to mount the widget into
 * @param config - Widget configuration object
 * 
 * @example WordPress/Elementor usage:
 * ```html
 * <!-- Add this div where you want the widget to appear -->
 * <div id="btb-widget-verb-conjugation-1"></div>
 * 
 * <!-- Initialize the widget -->
 * <script>
 *   window.BTBWidgets.initWidget('btb-widget-verb-conjugation-1', {
 *     widgetId: 'verb-conjugation-1',
 *     activityType: 'verb_conjugation',
 *     activityId: 3062,
 *     bookSeries: 'BtSB1',
 *     language: 'en',
 *     apiBaseUrl: 'https://your-api.com/api'
 *   });
 * </script>
 * ```
 */
function initWidget(elementId: string, config: EmbeddableWidgetConfig): void {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`BTB Widget Error: Element with id "${elementId}" not found`);
    return;
  }

  // Clean up existing widget if any
  if (widgetRoots.has(elementId)) {
    destroyWidget(elementId);
  }

  try {
    // Create React root and render widget
    const root = ReactDOM.createRoot(element);
    root.render(
      <React.StrictMode>
        <EmbeddableWidget config={config} />
      </React.StrictMode>
    );
    
    widgetRoots.set(elementId, root);
    console.log(`BTB Widget initialized: ${elementId}`, config);
  } catch (error) {
    console.error(`BTB Widget Error: Failed to initialize widget "${elementId}"`, error);
  }
}

/**
 * Destroy a widget and clean up its React root
 * 
 * @param elementId - The ID of the DOM element containing the widget
 */
function destroyWidget(elementId: string): void {
  const root = widgetRoots.get(elementId);
  
  if (root) {
    root.unmount();
    widgetRoots.delete(elementId);
    console.log(`BTB Widget destroyed: ${elementId}`);
  }
}

/**
 * Auto-initialize widgets with data attributes
 * This allows for declarative widget initialization:
 * 
 * @example
 * ```html
 * <div 
 *   id="my-widget"
 *   data-btb-widget="true"
 *   data-widget-id="auto-widget-1"
 *   data-activity-type="verb_conjugation"
 *   data-activity-id="3062"
 *   data-book-series="BtSB1"
 *   data-language="en"
 * ></div>
 * ```
 */
function autoInitWidgets(): void {
  const widgetElements = document.querySelectorAll('[data-btb-widget="true"]');
  
  widgetElements.forEach((element) => {
    const id = element.id;
    if (!id) {
      console.warn('BTB Widget: Found widget element without ID, skipping', element);
      return;
    }

    const config: EmbeddableWidgetConfig = {
      widgetId: element.getAttribute('data-widget-id') || id,
      activityType: element.getAttribute('data-activity-type') as any,
      activityId: parseInt(element.getAttribute('data-activity-id') || '0', 10),
      bookSeries: element.getAttribute('data-book-series') as any,
      language: element.getAttribute('data-language') as 'en' | 'es',
      apiBaseUrl: element.getAttribute('data-api-base-url') || undefined,
    };

    if (!config.activityType || !config.activityId) {
      console.error('BTB Widget: Missing required attributes (data-activity-type or data-activity-id)', element);
      return;
    }

    initWidget(id, config);
  });
}

// Create global API
window.BTBWidgets = {
  initWidget,
  destroyWidget,
  version: '1.0.0',
};

// Auto-initialize widgets when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitWidgets);
} else {
  autoInitWidgets();
}

// Also export for module usage
export { initWidget, destroyWidget, autoInitWidgets };
