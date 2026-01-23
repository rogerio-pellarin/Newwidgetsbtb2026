# Quick Reference Card - BTB Widgets

## Installation (WordPress)

### 1. Upload Files
Upload `dist/` contents to: `/wp-content/themes/your-theme/btb-widgets/`

### 2. Enqueue Scripts (functions.php)
```php
function enqueue_btb_widgets() {
    $base = get_template_directory_uri() . '/btb-widgets/';
    wp_enqueue_script('btb-react-vendor', $base . 'react-vendor.js', [], '1.0.0', true);
    wp_enqueue_script('btb-widgets', $base . 'widgets.js', ['btb-react-vendor'], '1.0.0', true);
    wp_enqueue_script('btb-widget-embed', $base . 'widget.js', ['btb-react-vendor', 'btb-widgets'], '1.0.0', true);
    wp_enqueue_style('btb-widget-styles', $base . 'styles.css', [], '1.0.0');
}
add_action('wp_enqueue_scripts', 'enqueue_btb_widgets');
```

## Elementor Integration

### Copy/Paste Template
```html
<div 
  id="btb-widget-CHANGE-ME"
  data-btb-widget="true"
  data-widget-id="CHANGE-ME"
  data-activity-type="CHANGE-ME"
  data-activity-id="CHANGE-ME"
  data-book-series="BtSB1"
  data-language="en"
></div>
```

## Activity Types Cheat Sheet

| Activity Type | Display Name | Activity IDs (Dev) |
|---------------|--------------|-------------------|
| `verb_conjugation` | Verb Practice | 3062 |
| `fill_in_blanks_ai` | Guided Fill-in | 1 |
| `ai_composition` | Writing Practice | 1 |
| `oral_practice` | Oral Practice | 3057 |
| `ai_chat` | Conversation Practice | 1 |
| `paragraph_correction` | Spot the Mistake | 3074 |
| `extended_response` | Open Response | 2528 |
| `dropdown_selection` | Dropdown Match | 2520 |
| `table_fill_blanks` | Info Grid | 1287 |
| `verb_identification` | Verb Finder | 2100 |
| `drawing_vocabulary` | Sketch & Label | 1500 |

## Book Series (Themes)

| Code | Color | Language | Level |
|------|-------|----------|-------|
| `BtSB1` | 🟡 Yellow | Spanish | Beginner |
| `BtSB2` | 🔴 Red | Spanish | Intermediate |
| `BtSB3` | 🔵 Blue | Spanish | Advanced |
| `BtSB4` | 🟢 Green | Spanish | Advanced+ |
| `BtSB5` | 🟣 Purple | Spanish | Mastery |
| `BtFB1` | 🟡 Yellow | French | Beginner |
| `BtFB2` | 🔴 Red | French | Intermediate |
| `BtFB3` | 🔵 Blue | French | Advanced |

## Common Examples

### Example 1: Verb Conjugation (Spanish 1)
```html
<div 
  id="widget-verb-1"
  data-btb-widget="true"
  data-widget-id="lesson-1-verbs"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
  data-language="en"
></div>
```

### Example 2: AI Chat (Spanish 2)
```html
<div 
  id="widget-chat-1"
  data-btb-widget="true"
  data-widget-id="lesson-2-chat"
  data-activity-type="ai_chat"
  data-activity-id="1"
  data-book-series="BtSB2"
  data-language="en"
></div>
```

### Example 3: Fill-in Blanks (French 1)
```html
<div 
  id="widget-fillblanks-1"
  data-btb-widget="true"
  data-widget-id="lesson-1-fillblanks"
  data-activity-type="fill_in_blanks_ai"
  data-activity-id="1"
  data-book-series="BtFB1"
  data-language="en"
></div>
```

## JavaScript API

### Initialize Widget
```javascript
window.BTBWidgets.initWidget('element-id', {
  widgetId: 'unique-id',
  activityType: 'verb_conjugation',
  activityId: 3062,
  bookSeries: 'BtSB1',
  language: 'en'
});
```

### Destroy Widget
```javascript
window.BTBWidgets.destroyWidget('element-id');
```

### Check Version
```javascript
console.log(window.BTBWidgets.version);
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Widget not appearing | Check console for errors, verify unique ID |
| Scripts not loading | Check enqueue order in functions.php |
| Wrong theme colors | Verify `data-book-series` attribute |
| Stuck on loading | Check API endpoint, verify activity ID exists |
| Multiple widgets conflict | Ensure each has unique ID |

## Custom API Endpoint

### Via Data Attribute
```html
<div 
  id="widget-1"
  data-btb-widget="true"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-api-base-url="https://api.yoursite.com/v1"
></div>
```

### Via JavaScript
```javascript
window.BTBWidgets.initWidget('widget-1', {
  widgetId: 'widget-1',
  activityType: 'verb_conjugation',
  activityId: 3062,
  apiBaseUrl: 'https://api.yoursite.com/v1'
});
```

## Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build
```

## File Locations

- **Built widgets**: `dist/widget.js`, `dist/widgets.js`, `dist/react-vendor.js`
- **Styles**: `dist/styles.css`
- **Test harness**: `dist/index.html`
- **Source code**: `/src/app/`, `/src/widget-embed.tsx`

## Resources

- Full guide: `WORDPRESS_INTEGRATION.md`
- Architecture: `EMBEDDABLE_WIDGETS.md`
- Type definitions: `/src/types/activities.ts`
- Theme docs: `THEMING_SYSTEM.md`
