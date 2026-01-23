# Breaking the Barrier - Assessment Widgets

A comprehensive interactive widget system for language learning assessments, designed for Breaking the Barrier Spanish and French courses.

## 🎯 Overview

This project provides 13 different types of interactive assessment widgets that can be:
- **Tested locally** using the built-in test harness
- **Embedded in WordPress** pages via Elementor or custom code
- **Themed dynamically** based on book series (Spanish 1-5, French 1-3)
- **Localized** with instant English/Spanish language switching

## 📦 What's Included

### Widget Types

1. **Fill-in Practice** - Basic fill-in-the-blank exercises
2. **Guided Fill-in** - AI-assisted fill-in-the-blanks with feedback
3. **Open Response** - Extended written response exercises
4. **Oral Practice** - Audio comprehension activities
5. **Spot the Mistake** - Paragraph error correction
6. **Verb Practice** - Verb conjugation exercises
7. **Writing Practice** - AI composition feedback
8. **Conversation Practice** - AI-powered chat scenarios
9. **Dropdown Match** - Dropdown selection exercises
10. **Info Grid** - Table-based fill-in activities
11. **Verb Finder** - Identify verbs in sentences
12. **Sketch & Label** - Drawing vocabulary practice

### Key Features

- ✅ **Two-column responsive layout** (instructions left, content right)
- ✅ **Three-tier feedback system** (green/yellow/red for correct/partial/incorrect)
- ✅ **Auto-save functionality** for student progress
- ✅ **AI-enabled feedback** displayed in right sidebar
- ✅ **Dynamic theming** across 8 book series
- ✅ **Language toggle** with bilingual vocabulary lists
- ✅ **Completion microinteractions** and visual feedback
- ✅ **WordPress/Elementor ready** with simple embed codes

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` to see the test harness with all widgets.

### Production Build

```bash
# Build for production
npm run build
```

This creates:
- **Test harness** in `dist/index.html` (for internal use)
- **Embeddable widgets** in `dist/widget.js` (for WordPress)

## 📖 Documentation

### For Developers

- **[EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md)** - Architecture and system design
- **[THEMING_SYSTEM.md](./THEMING_SYSTEM.md)** - Dynamic theming documentation
- **[DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)** - Component development guide
- **[REFACTORING_STATUS.md](./REFACTORING_STATUS.md)** - Codebase status tracking

### For WordPress Integration

- **[WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md)** - Complete integration guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick copy/paste examples
- **[wordpress-example.html](./wordpress-example.html)** - Live demo examples

### For Data Structure

- **[JSON_SCHEMA_REFERENCE.md](./JSON_SCHEMA_REFERENCE.md)** - Activity data schemas
- **[LANGUAGE_AND_MATCHING.md](./LANGUAGE_AND_MATCHING.md)** - Text matching algorithms
- **[/src/types/activities.ts](./src/types/activities.ts)** - TypeScript definitions

## 🔌 WordPress Integration (Quick)

### 1. Upload Files

After building, upload these files to your WordPress theme:

```
/wp-content/themes/your-theme/btb-widgets/
├── widget.js
├── widgets.js
├── react-vendor.js
└── styles.css
```

### 2. Enqueue Scripts

Add to `functions.php`:

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

### 3. Add Widget to Page

In Elementor HTML widget:

```html
<div 
  id="btb-widget-1"
  data-btb-widget="true"
  data-widget-id="my-widget"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
  data-language="en"
></div>
```

That's it! See [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) for complete details.

## 🎨 Theming

Widgets automatically theme based on the book series:

| Series | Color | Language | Level |
|--------|-------|----------|-------|
| BtSB1 | 🟡 Yellow | Spanish | Beginner |
| BtSB2 | 🔴 Red | Spanish | Intermediate |
| BtSB3 | 🔵 Blue | Spanish | Advanced |
| BtSB4 | 🟢 Green | Spanish | Advanced+ |
| BtSB5 | 🟣 Purple | Spanish | Mastery |
| BtFB1 | 🟡 Yellow | French | Beginner |
| BtFB2 | 🔴 Red | French | Intermediate |
| BtFB3 | 🔵 Blue | French | Advanced |

Set via `data-book-series` attribute or `bookSeries` config property.

## 🏗️ Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Test harness (development)
│   │   ├── EmbeddableWidget.tsx       # Widget wrapper (production)
│   │   └── components/                # All 13 widget components
│   ├── widget-embed.tsx               # WordPress entry point
│   ├── contexts/ThemeContext.tsx      # Theme management
│   ├── services/api.ts                # Data fetching
│   ├── types/activities.ts            # TypeScript types
│   └── data/                          # Sample JSON data
├── vite.config.ts                     # Dual build config
├── package.json
└── documentation files
```

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## 📊 Activity Data

Widgets fetch activity data via the API service. Currently uses mock JSON data, but can be connected to a real backend:

```typescript
window.BTBWidgets.initWidget('widget-1', {
  widgetId: 'widget-1',
  activityType: 'verb_conjugation',
  activityId: 3062,
  apiBaseUrl: 'https://api.yoursite.com/v1'  // Your API endpoint
});
```

Expected API format: `GET /api/activities/{activityType}/{activityId}`

## 🧪 Testing

### Test Harness

The built-in test harness (`App.tsx`) provides:
- Widget selector to test all 13 types
- Book series selector for theme testing
- Language toggle functionality
- Sample data for each widget type

### WordPress Example

See `wordpress-example.html` for a standalone demo of embedded widgets.

## 📝 Development Guidelines

### Adding a New Widget

1. Create component in `/src/app/components/`
2. Add type definition in `/src/types/activities.ts`
3. Add sample data in `/src/data/`
4. Register in `EmbeddableWidget.tsx`
5. Add to test harness in `App.tsx`
6. Update documentation

### Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Use Tailwind CSS for styling
- Implement responsive design
- Add proper accessibility attributes

## 🐛 Troubleshooting

Common issues and solutions:

| Problem | Solution |
|---------|----------|
| Widget not rendering | Check console errors, verify unique ID |
| Scripts not loading | Check enqueue order in functions.php |
| Wrong theme | Verify `data-book-series` attribute |
| Stuck on loading | Check API endpoint, verify activity ID |

See [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) for detailed troubleshooting.

## 📄 License

Copyright © 2024 Breaking the Barrier. All rights reserved.

## 🤝 Support

For questions or support:
- Review documentation in this repository
- Check `/src/types/activities.ts` for data structures
- See example implementations in `/src/app/components/`

## 🗺️ Roadmap

Future enhancements:
- [ ] Offline support with service workers
- [ ] Advanced analytics integration
- [ ] Additional language support (German, Italian, etc.)
- [ ] Enhanced accessibility features
- [ ] Mobile app integration
- [ ] Real-time collaboration features

---

**Current Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready ✅
