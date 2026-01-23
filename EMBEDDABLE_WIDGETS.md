# Embeddable Widgets System

## Overview

The Breaking the Barrier assessment widget system has been transformed into a dual-purpose application:

1. **Test Harness** (`/src/app/App.tsx`) - Full-featured development and testing environment
2. **Embeddable Widgets** (`/src/widget-embed.tsx`) - Production-ready components for WordPress/Elementor

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Vite Build System                        │
└────────────────────┬───────────────────┬────────────────────┘
                     │                   │
         ┌───────────▼──────────┐   ┌────▼──────────────────┐
         │   Test Harness       │   │  Embeddable Widget    │
         │   (index.html)       │   │  (widget-embed.tsx)   │
         │                      │   │                       │
         │  - All widgets       │   │  - Single widget      │
         │  - Widget selector   │   │  - Auto-init          │
         │  - Book selector     │   │  - WordPress ready    │
         │  - Development UI    │   │  - Global API         │
         └──────────────────────┘   └───────────────────────┘
```

## File Structure

```
/src
├── app/
│   ├── App.tsx                    # Test harness (unchanged)
│   ├── EmbeddableWidget.tsx       # NEW: Single widget wrapper
│   └── components/                # All widget components
│       ├── FillInBlanksWidget.tsx
│       ├── VerbConjugationWidget.tsx
│       └── ... (all other widgets)
├── widget-embed.tsx               # NEW: WordPress entry point
├── contexts/
│   └── ThemeContext.tsx           # Theme system (shared)
├── services/
│   └── api.ts                     # API service (shared)
└── types/
    └── activities.ts              # Type definitions (shared)

/
├── vite.config.ts                 # UPDATED: Dual build config
├── wordpress-example.html         # NEW: Integration example
├── WORDPRESS_INTEGRATION.md       # NEW: Integration docs
└── EMBEDDABLE_WIDGETS.md          # This file
```

## Key Components

### 1. EmbeddableWidget.tsx

Main component that wraps individual widgets for embedding.

**Features:**
- Fetches activity data based on config
- Handles loading and error states
- Automatically applies theme based on book series
- Manages language toggle
- Renders appropriate widget type

**Props:**
```typescript
interface EmbeddableWidgetConfig {
  widgetId: string;          // Unique instance ID
  activityType: ActivityType; // Which widget to render
  activityId: number;         // Database ID for data
  bookSeries?: string;        // Theme override
  language?: 'en' | 'es';    // Initial language
  apiBaseUrl?: string;        // Custom API endpoint
}
```

### 2. widget-embed.tsx

Entry point for the embeddable widget bundle.

**Features:**
- Creates global `window.BTBWidgets` API
- Auto-initializes widgets with data attributes
- Manages React roots for multiple widgets
- Provides cleanup methods

**Global API:**
```javascript
window.BTBWidgets = {
  initWidget(elementId, config),
  destroyWidget(elementId),
  version: '1.0.0'
}
```

### 3. Updated vite.config.ts

Build configuration for dual outputs.

**Outputs:**
- **Main**: Full test harness with all widgets
- **Widget**: Standalone embeddable bundle
- **Chunks**: Optimized code splitting for better caching

## Usage Patterns

### Pattern 1: Data Attributes (Declarative)

Best for non-technical users and Elementor.

```html
<div 
  id="unique-id"
  data-btb-widget="true"
  data-widget-id="my-widget"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
  data-language="en"
></div>
```

**Pros:**
- No JavaScript knowledge required
- Easy to copy/paste in Elementor
- Auto-initializes on page load
- Perfect for content editors

**Cons:**
- Less control over initialization timing
- All config in HTML attributes

### Pattern 2: JavaScript API (Programmatic)

Best for developers and dynamic content.

```javascript
window.BTBWidgets.initWidget('container-id', {
  widgetId: 'dynamic-widget-1',
  activityType: 'ai_chat',
  activityId: 1,
  bookSeries: 'BtSB1',
  language: 'en'
});
```

**Pros:**
- Full programmatic control
- Dynamic initialization
- Can be triggered by events
- Easier to manage complex scenarios

**Cons:**
- Requires JavaScript knowledge
- More code to maintain

## Development Workflow

### Local Development

The test harness (`App.tsx`) remains **unchanged** and provides:

```bash
npm run dev
```

- Full widget selector
- Book series selector
- Language toggle
- All widgets visible
- Development tools

### Building for Production

```bash
npm run build
```

Creates two separate bundles:
1. **Test harness** - For internal development/testing
2. **Widget bundle** - For WordPress deployment

### Testing the Embeddable Version

1. Build the project: `npm run build`
2. Serve the dist folder: `npx serve dist`
3. Open `wordpress-example.html` in a browser
4. Test different initialization methods

## Integration Checklist

- [ ] Build the widget bundle
- [ ] Upload files to WordPress theme/CDN
- [ ] Enqueue scripts in `functions.php`
- [ ] Test on a development page
- [ ] Verify API endpoint configuration
- [ ] Test different activity types
- [ ] Test multiple widgets on one page
- [ ] Test on mobile devices
- [ ] Test language toggle
- [ ] Test theme switching
- [ ] Performance test (page load speed)
- [ ] Deploy to production

## API Integration

### Current State (Mock Data)

Widgets currently use static JSON files from `/src/data/`.

### Production Setup

Update `/src/services/api.ts` to make real HTTP requests:

```typescript
async fetchActivity(activityType: ActivityType, activityId: number): Promise<Activity> {
  const response = await fetch(`${this.baseUrl}/activities/${activityType}/${activityId}`);
  if (!response.ok) throw new Error('Failed to fetch activity');
  return response.json();
}
```

### WordPress API Configuration

Pass custom API URL when initializing:

```javascript
window.BTBWidgets.initWidget('widget-1', {
  widgetId: 'widget-1',
  activityType: 'verb_conjugation',
  activityId: 3062,
  apiBaseUrl: 'https://api.breakingthebarrier.com/v1'
});
```

## Advanced Features

### Multiple Widgets per Page

Each widget instance is independent:

```html
<div id="widget-1" data-btb-widget="true" data-activity-type="verb_conjugation" data-activity-id="3062"></div>
<div id="widget-2" data-btb-widget="true" data-activity-type="ai_chat" data-activity-id="1"></div>
<div id="widget-3" data-btb-widget="true" data-activity-type="oral_practice" data-activity-id="3057"></div>
```

### Dynamic Loading

Load widgets on-demand (e.g., in tabs, accordions):

```javascript
// When tab becomes visible
tabElement.addEventListener('shown', function() {
  window.BTBWidgets.initWidget('tab-widget', {
    widgetId: 'tab-1-widget',
    activityType: 'verb_conjugation',
    activityId: 3062
  });
});
```

### Lazy Loading

Defer widget initialization until scrolled into view:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const config = JSON.parse(entry.target.dataset.config);
      window.BTBWidgets.initWidget(entry.target.id, config);
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('[data-btb-lazy]').forEach(el => {
  observer.observe(el);
});
```

### Widget Cleanup

Remove widgets when no longer needed:

```javascript
// Single widget
window.BTBWidgets.destroyWidget('widget-1');

// All widgets on page
document.querySelectorAll('[data-btb-widget]').forEach(el => {
  window.BTBWidgets.destroyWidget(el.id);
});
```

## Performance Considerations

### Bundle Size

The widget bundle is optimized with code splitting:

- **react-vendor.js** - React and ReactDOM (shared)
- **widgets.js** - All widget components (shared)
- **widget.js** - Initialization code (small)

### Caching Strategy

Use long cache times for versioned files:

```php
wp_enqueue_script(
    'btb-widget-embed',
    $widget_base . 'widget.js',
    array('btb-react-vendor', 'btb-widgets'),
    '1.0.0',  // Version number for cache busting
    true
);
```

### Loading Strategy

1. **Critical pages**: Load scripts in `<head>` with `defer`
2. **Non-critical pages**: Load scripts before `</body>`
3. **On-demand pages**: Load only when widget is needed

### Network Optimization

- Host on CDN for faster global delivery
- Enable gzip/brotli compression
- Use HTTP/2 for parallel downloads
- Consider preloading critical resources

## Troubleshooting

### Widget Not Rendering

1. Check console for errors
2. Verify element ID is unique
3. Confirm scripts loaded in correct order
4. Check data-attributes are correct
5. Verify activityType and activityId are valid

### Multiple Widgets Conflict

- Ensure each widget has unique `id` attribute
- Check for duplicate `widgetId` values
- Verify book series theming doesn't conflict

### Styling Issues

- Check CSS load order
- Inspect for theme CSS conflicts
- Verify Tailwind classes are not purged
- Test with browser DevTools

### API Errors

- Check network tab for failed requests
- Verify API endpoint URL
- Check CORS settings
- Confirm activity exists in database

## Future Enhancements

Potential improvements for the embeddable system:

1. **Widget Communication** - Allow widgets to communicate with each other
2. **Progress Tracking** - Emit events for external progress tracking
3. **Custom Styling** - Allow CSS variable overrides
4. **Offline Support** - Service worker for offline functionality
5. **Analytics Integration** - Built-in analytics hooks
6. **A/B Testing** - Support for variant testing
7. **Accessibility** - Enhanced ARIA labels and keyboard navigation
8. **i18n Support** - Additional languages beyond English/Spanish

## Support & Documentation

- **Integration Guide**: See `WORDPRESS_INTEGRATION.md`
- **Type Definitions**: See `/src/types/activities.ts`
- **Component Docs**: See individual widget files
- **API Reference**: See `/src/services/api.ts`
- **Theme System**: See `THEMING_SYSTEM.md`

## Version History

### v1.0.0 (Current)
- Initial embeddable widget system
- WordPress/Elementor integration
- Dual-build configuration
- Auto-initialization support
- Global JavaScript API
- Comprehensive documentation
