# WordPress Integration Guide for Breaking the Barrier Widgets

This guide explains how to embed Breaking the Barrier assessment widgets into WordPress pages using Elementor or any other page builder.

## Overview

The widget system has been designed to be easily embeddable in WordPress. It provides two initialization methods:

1. **JavaScript API** - Programmatic initialization with full control
2. **Data Attributes** - Declarative initialization (easiest for Elementor)

## Building for Production

First, build the widget bundle:

```bash
npm run build
```

This creates two outputs in the `dist/` folder:
- `index.html` and assets - The test harness for development
- `widget.js` and related chunks - The embeddable widget bundle

## WordPress Setup

### 1. Upload Files to WordPress

Upload the following files from `dist/` to your WordPress site:

```
wp-content/themes/your-theme/btb-widgets/
├── widget.js              # Main widget bundle
├── react-vendor.js        # React libraries
├── widgets.js             # Widget components
└── styles.css             # Widget styles
```

Or host them on a CDN for better performance.

### 2. Enqueue Scripts in WordPress

Add to your theme's `functions.php`:

```php
function enqueue_btb_widgets() {
    // Only load on pages that need widgets
    if (is_page('spanish-lessons')) {
        $widget_base = get_template_directory_uri() . '/btb-widgets/';
        
        // Enqueue vendor libraries first
        wp_enqueue_script(
            'btb-react-vendor',
            $widget_base . 'react-vendor.js',
            array(),
            '1.0.0',
            true
        );
        
        // Then widget components
        wp_enqueue_script(
            'btb-widgets',
            $widget_base . 'widgets.js',
            array('btb-react-vendor'),
            '1.0.0',
            true
        );
        
        // Finally, the main widget script
        wp_enqueue_script(
            'btb-widget-embed',
            $widget_base . 'widget.js',
            array('btb-react-vendor', 'btb-widgets'),
            '1.0.0',
            true
        );
        
        // Enqueue styles
        wp_enqueue_style(
            'btb-widget-styles',
            $widget_base . 'styles.css',
            array(),
            '1.0.0'
        );
    }
}
add_action('wp_enqueue_scripts', 'enqueue_btb_widgets');
```

## Integration Methods

### Method 1: Data Attributes (Recommended for Elementor)

This is the easiest method for content editors using Elementor.

#### In Elementor:

1. Add an **HTML Widget** to your page
2. Paste the following code:

```html
<div 
  id="btb-widget-1"
  data-btb-widget="true"
  data-widget-id="verb-practice-1"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
  data-language="en"
></div>
```

#### Data Attribute Reference:

| Attribute | Required | Values | Description |
|-----------|----------|--------|-------------|
| `id` | Yes | Any unique string | Unique element ID |
| `data-btb-widget` | Yes | `"true"` | Enables auto-initialization |
| `data-widget-id` | Yes | Any string | Widget instance identifier |
| `data-activity-type` | Yes | See Activity Types | Type of widget to render |
| `data-activity-id` | Yes | Number | Database ID of the activity |
| `data-book-series` | No | See Book Series | Theme/color scheme |
| `data-language` | No | `"en"` or `"es"` | Initial language (default: `"en"`) |
| `data-api-base-url` | No | URL string | Custom API endpoint |

### Method 2: JavaScript API

For more control, use the JavaScript API directly.

#### In Elementor:

1. Add an **HTML Widget** for the container:

```html
<div id="btb-widget-verb-1"></div>
```

2. Add a **Custom JavaScript** widget or use the footer code injection:

```javascript
window.BTBWidgets.initWidget('btb-widget-verb-1', {
  widgetId: 'verb-practice-1',
  activityType: 'verb_conjugation',
  activityId: 3062,
  bookSeries: 'BtSB1',
  language: 'en',
  apiBaseUrl: 'https://your-api.com/api'
});
```

## Activity Types

Use these values for `data-activity-type` or `activityType`:

| Activity Type | Display Name | Description |
|---------------|--------------|-------------|
| `verb_conjugation` | Verb Practice | Verb conjugation exercises |
| `fill_in_blanks_ai` | Guided Fill-in | AI-assisted fill-in-the-blanks |
| `ai_composition` | Writing Practice | AI composition feedback |
| `oral_practice` | Oral Practice | Audio comprehension exercises |
| `ai_chat` | Conversation Practice | AI conversation practice |
| `paragraph_correction` | Spot the Mistake | Find errors in paragraphs |
| `extended_response` | Open Response | Extended written responses |
| `dropdown_selection` | Dropdown Match | Dropdown selection exercises |
| `table_fill_blanks` | Info Grid | Table-based exercises |
| `verb_identification` | Verb Finder | Identify verbs in sentences |
| `drawing_vocabulary` | Sketch & Label | Drawing vocabulary practice |

## Book Series

Theme colors are based on the book series:

| Book Series | Color | Language | Level |
|-------------|-------|----------|-------|
| `BtSB1` | Yellow | Spanish | Beginner |
| `BtSB2` | Red | Spanish | Intermediate |
| `BtSB3` | Blue | Spanish | Advanced |
| `BtSB4` | Green | Spanish | Advanced Plus |
| `BtSB5` | Purple | Spanish | Mastery |
| `BtFB1` | Yellow | French | Beginner |
| `BtFB2` | Red | French | Intermediate |
| `BtFB3` | Blue | French | Advanced |

## Complete Example: Elementor Page

Here's a complete example of embedding multiple widgets on a single page:

```html
<!-- Widget 1: Verb Conjugation -->
<div class="widget-section">
  <h2>Practice: Verb Conjugation</h2>
  <div 
    id="widget-verb-conjugation"
    data-btb-widget="true"
    data-widget-id="lesson-1-verbs"
    data-activity-type="verb_conjugation"
    data-activity-id="3062"
    data-book-series="BtSB1"
    data-language="en"
  ></div>
</div>

<!-- Widget 2: Fill in the Blanks -->
<div class="widget-section">
  <h2>Practice: Guided Fill-in</h2>
  <div 
    id="widget-fill-blanks"
    data-btb-widget="true"
    data-widget-id="lesson-1-fillblanks"
    data-activity-type="fill_in_blanks_ai"
    data-activity-id="1"
    data-book-series="BtSB1"
    data-language="en"
  ></div>
</div>

<!-- Widget 3: Conversation Practice -->
<div class="widget-section">
  <h2>Practice: Conversation</h2>
  <div 
    id="widget-conversation"
    data-btb-widget="true"
    data-widget-id="lesson-1-chat"
    data-activity-type="ai_chat"
    data-activity-id="1"
    data-book-series="BtSB1"
    data-language="en"
  ></div>
</div>

<style>
  .widget-section {
    margin: 2rem 0;
    padding: 1rem 0;
  }
  
  .widget-section h2 {
    margin-bottom: 1rem;
    color: #1a202c;
  }
</style>
```

## Connecting to Your Backend API

By default, widgets use mock data from JSON files. To connect to your real backend:

### Option 1: Set API URL via Data Attribute

```html
<div 
  id="btb-widget-1"
  data-btb-widget="true"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-api-base-url="https://api.breakingthebarrier.com/v1"
></div>
```

### Option 2: Set API URL via JavaScript

```javascript
window.BTBWidgets.initWidget('btb-widget-1', {
  widgetId: 'widget-1',
  activityType: 'verb_conjugation',
  activityId: 3062,
  apiBaseUrl: 'https://api.breakingthebarrier.com/v1'
});
```

### Backend API Requirements

Your backend should provide an endpoint that returns activity data:

```
GET /api/activities/{activityType}/{activityId}
```

Example:
```
GET /api/activities/verb_conjugation/3062
```

Response format should match the TypeScript interfaces in `/src/types/activities.ts`.

## Advanced Features

### Dynamic Widget Loading

Load widgets dynamically based on user interaction:

```javascript
document.getElementById('load-widget-btn').addEventListener('click', function() {
  window.BTBWidgets.initWidget('dynamic-widget', {
    widgetId: 'dynamic-1',
    activityType: 'verb_conjugation',
    activityId: 3062,
    bookSeries: 'BtSB1'
  });
});
```

### Destroying Widgets

Remove a widget when no longer needed:

```javascript
window.BTBWidgets.destroyWidget('btb-widget-1');
```

### Multiple Widgets on One Page

You can have as many widgets as needed on a single page. Just ensure each has a unique `id`:

```html
<div id="widget-1" data-btb-widget="true" data-activity-type="verb_conjugation" data-activity-id="3062"></div>
<div id="widget-2" data-btb-widget="true" data-activity-type="fill_in_blanks_ai" data-activity-id="1"></div>
<div id="widget-3" data-btb-widget="true" data-activity-type="ai_chat" data-activity-id="1"></div>
```

## Styling and Customization

### Widget Container Styling

Widgets automatically adapt to their container width. You can add custom CSS:

```css
/* Add padding around widgets */
[data-btb-widget] {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive width */
[data-btb-widget] {
  max-width: 1200px;
  margin: 0 auto;
}
```

### Theme Overrides

While widgets use the book series theme, you can override colors:

```css
.btb-widget-container {
  --primary-color: #your-color;
}
```

## Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Verify scripts are loaded in correct order
3. Ensure element ID is unique
4. Confirm activity type and ID are valid

### Widget Shows Loading State

- Check API endpoint is reachable
- Verify activity ID exists in database
- Check browser network tab for failed requests

### Styling Issues

- Ensure widget styles are loaded
- Check for CSS conflicts with WordPress theme
- Use browser DevTools to inspect element styles

## Performance Optimization

### Lazy Loading

Only load widgets when they scroll into view:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      window.BTBWidgets.initWidget(el.id, {
        widgetId: el.getAttribute('data-widget-id'),
        activityType: el.getAttribute('data-activity-type'),
        activityId: parseInt(el.getAttribute('data-activity-id'))
      });
      observer.unobserve(el);
    }
  });
});

document.querySelectorAll('[data-btb-widget-lazy]').forEach(el => {
  observer.observe(el);
});
```

### Conditional Loading

Only load widget scripts on pages that need them (see the `functions.php` example above).

## Support

For technical support or questions:
- Email: support@breakingthebarrier.com
- Documentation: See `/src/types/activities.ts` for data structure details
- Version: Check `window.BTBWidgets.version`

## Example Activity IDs (Development)

For testing during development, use these activity IDs:

- Verb Conjugation: `3062`
- Fill in Blanks AI: `1`
- AI Composition: `1`
- Oral Practice: `3057`
- AI Chat: `1`
- Paragraph Correction: `3074`
- Extended Response: `2528`
- Dropdown: `2520`
- Table: `1287`
- Verb Identification: `2100`
- Drawing Vocabulary: `1500`
