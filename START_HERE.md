# 👋 Start Here

Welcome to the Breaking the Barrier Assessment Widgets! This guide will help you get started quickly based on your role and goals.

## 🎯 Choose Your Path

### 🎨 I'm a Content Editor (WordPress/Elementor User)

**Goal:** Embed widgets into WordPress pages

**Start with:**
1. 📖 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Copy/paste examples
2. 📖 [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) - Full integration guide

**Quick Example:**
```html
<!-- Paste this into Elementor HTML widget -->
<div 
  id="btb-widget-1"
  data-btb-widget="true"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
></div>
```

---

### 💻 I'm a Developer (WordPress Theme Developer)

**Goal:** Integrate widget system into WordPress theme

**Start with:**
1. 📖 [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) - Technical integration
2. 📖 [EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md) - Architecture details
3. 📖 [CONFIGURATION_EXAMPLES.md](./CONFIGURATION_EXAMPLES.md) - Advanced scenarios

**Quick Setup:**
```php
// functions.php
function enqueue_btb_widgets() {
    $base = get_template_directory_uri() . '/btb-widgets/';
    wp_enqueue_script('btb-react-vendor', $base . 'react-vendor.js', [], '1.0.0', true);
    wp_enqueue_script('btb-widgets', $base . 'widgets.js', ['btb-react-vendor'], '1.0.0', true);
    wp_enqueue_script('btb-widget-embed', $base . 'widget.js', ['btb-react-vendor', 'btb-widgets'], '1.0.0', true);
    wp_enqueue_style('btb-widget-styles', $base . 'styles.css', [], '1.0.0');
}
add_action('wp_enqueue_scripts', 'enqueue_btb_widgets');
```

---

### 🔧 I'm a Widget Developer (React Developer)

**Goal:** Develop, modify, or extend widgets

**Start with:**
1. 📖 [README.md](./README.md) - Project overview
2. 📖 [DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md) - Component development
3. 📖 [EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md) - System architecture

**Quick Start:**
```bash
npm install
npm run dev
```

Open `http://localhost:5173` - see all widgets in test harness.

---

### 🎓 I'm Learning the System

**Goal:** Understand how everything works

**Start with:**
1. 📖 [README.md](./README.md) - High-level overview
2. 📖 [EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md) - System architecture
3. 🌐 [wordpress-example.html](./wordpress-example.html) - Live examples (after build)

---

### 📊 I Need Data Structure Information

**Goal:** Understand activity data formats

**Start with:**
1. 📖 [JSON_SCHEMA_REFERENCE.md](./JSON_SCHEMA_REFERENCE.md) - Data schemas
2. 📁 `/src/types/activities.ts` - TypeScript definitions
3. 📁 `/src/data/` - Sample JSON files

---

## 📚 Complete Documentation Index

### Getting Started
- **[README.md](./README.md)** - Project overview and quick start
- **[START_HERE.md](./START_HERE.md)** - This file

### WordPress Integration
- **[WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md)** - Complete integration guide ⭐
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick copy/paste examples ⭐
- **[CONFIGURATION_EXAMPLES.md](./CONFIGURATION_EXAMPLES.md)** - Advanced configurations
- **[wordpress-example.html](./wordpress-example.html)** - Live demo file

### Development
- **[EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md)** - System architecture ⭐
- **[DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)** - Component guide
- **[THEMING_SYSTEM.md](./THEMING_SYSTEM.md)** - Theme system documentation
- **[REFACTORING_STATUS.md](./REFACTORING_STATUS.md)** - Codebase status

### Data & Types
- **[JSON_SCHEMA_REFERENCE.md](./JSON_SCHEMA_REFERENCE.md)** - Data structures
- **[LANGUAGE_AND_MATCHING.md](./LANGUAGE_AND_MATCHING.md)** - Text matching logic
- **[/src/types/activities.ts](./src/types/activities.ts)** - TypeScript types

### Reference
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[ATTRIBUTIONS.md](./ATTRIBUTIONS.md)** - Credits and licenses

---

## 🚀 Common Tasks

### Task: Embed a Widget in WordPress

1. Build the project: `npm run build`
2. Upload `dist/` files to WordPress theme
3. Enqueue scripts in `functions.php` ([guide](./WORDPRESS_INTEGRATION.md#2-enqueue-scripts-in-wordpress))
4. Add HTML to page ([examples](./QUICK_REFERENCE.md#copy-paste-template))

### Task: Test Widgets Locally

```bash
npm install
npm run dev
```

Open browser to `http://localhost:5173`

### Task: Add a New Widget Type

1. Create component in `/src/app/components/YourWidget.tsx`
2. Add type in `/src/types/activities.ts`
3. Add sample data in `/src/data/`
4. Register in `/src/app/EmbeddableWidget.tsx`
5. Add to test harness in `/src/app/App.tsx`

### Task: Change Widget Theme

Set the `data-book-series` attribute:

```html
<div data-book-series="BtSB2">  <!-- Red theme, Spanish 2 -->
```

Options: `BtSB1`, `BtSB2`, `BtSB3`, `BtSB4`, `BtSB5`, `BtFB1`, `BtFB2`, `BtFB3`

### Task: Connect to Backend API

```html
<div data-api-base-url="https://api.yoursite.com/v1">
```

Or via JavaScript:

```javascript
window.BTBWidgets.initWidget('widget-1', {
  apiBaseUrl: 'https://api.yoursite.com/v1',
  // ... other config
});
```

---

## 🎯 Widget Types Quick Reference

| Widget Type | Activity Type Code | Sample ID |
|-------------|-------------------|-----------|
| Fill-in Practice | `fill_in_blanks_ai` | 1 |
| Verb Practice | `verb_conjugation` | 3062 |
| Open Response | `extended_response` | 2528 |
| Oral Practice | `oral_practice` | 3057 |
| Spot the Mistake | `paragraph_correction` | 3074 |
| Writing Practice | `ai_composition` | 1 |
| Conversation Practice | `ai_chat` | 1 |
| Dropdown Match | `dropdown_selection` | 2520 |
| Info Grid | `table_fill_blanks` | 1287 |
| Verb Finder | `verb_identification` | 2100 |
| Sketch & Label | `drawing_vocabulary` | 1500 |

---

## 🎨 Book Series (Themes)

| Code | Language | Level | Color |
|------|----------|-------|-------|
| `BtSB1` | Spanish | Beginner | 🟡 Yellow |
| `BtSB2` | Spanish | Intermediate | 🔴 Red |
| `BtSB3` | Spanish | Advanced | 🔵 Blue |
| `BtSB4` | Spanish | Advanced+ | 🟢 Green |
| `BtSB5` | Spanish | Mastery | 🟣 Purple |
| `BtFB1` | French | Beginner | 🟡 Yellow |
| `BtFB2` | French | Intermediate | 🔴 Red |
| `BtFB3` | French | Advanced | 🔵 Blue |

---

## ❓ Need Help?

### Common Questions

**Q: How do I embed a widget in Elementor?**  
A: Add an HTML widget and paste the embed code from [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Q: Can I have multiple widgets on one page?**  
A: Yes! Just give each widget a unique `id`. See [examples](./CONFIGURATION_EXAMPLES.md#multiple-widgets-on-one-page)

**Q: How do I change the theme/colors?**  
A: Set the `data-book-series` attribute. See [theming guide](./THEMING_SYSTEM.md)

**Q: Where are the widget scripts after building?**  
A: In the `dist/` folder after running `npm run build`

**Q: The widget won't load. What's wrong?**  
A: Check browser console for errors. See [troubleshooting](./WORDPRESS_INTEGRATION.md#troubleshooting)

### Get Support

1. Check the relevant documentation (see index above)
2. Review [CONFIGURATION_EXAMPLES.md](./CONFIGURATION_EXAMPLES.md) for similar scenarios
3. Check browser console for error messages
4. Review [WORDPRESS_INTEGRATION.md#troubleshooting](./WORDPRESS_INTEGRATION.md#troubleshooting)

---

## 📋 Checklist: First-Time Setup

For WordPress integration:

- [ ] Build project: `npm run build`
- [ ] Upload files from `dist/` to WordPress
- [ ] Add enqueue code to `functions.php`
- [ ] Test on a development page first
- [ ] Verify scripts load (check browser Network tab)
- [ ] Test widget renders correctly
- [ ] Test language toggle works
- [ ] Test on mobile devices
- [ ] Deploy to production

---

## 🎉 Quick Success Path

**Want to see results in 5 minutes?**

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd btb-widgets
   ```

2. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173`

4. **See all widgets**
   Click through different widget types in the test harness

5. **Try embedding (optional)**
   ```bash
   npm run build
   ```
   Then open `wordpress-example.html` in your browser

---

## 📖 Recommended Reading Order

### For WordPress Users:
1. This file (START_HERE.md)
2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md)
4. [CONFIGURATION_EXAMPLES.md](./CONFIGURATION_EXAMPLES.md)

### For Developers:
1. This file (START_HERE.md)
2. [README.md](./README.md)
3. [EMBEDDABLE_WIDGETS.md](./EMBEDDABLE_WIDGETS.md)
4. [DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)
5. Source code in `/src/app/`

### For Understanding Data:
1. [JSON_SCHEMA_REFERENCE.md](./JSON_SCHEMA_REFERENCE.md)
2. [/src/types/activities.ts](./src/types/activities.ts)
3. Sample files in `/src/data/`

---

## 🎯 Next Steps

Based on your role:

**Content Editor:**
→ Go to [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) and copy your first embed code

**Theme Developer:**
→ Go to [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) for integration steps

**Widget Developer:**
→ Run `npm run dev` and start exploring the code

**Project Manager:**
→ Read [README.md](./README.md) for project overview

---

**Welcome aboard! 🚀**
