# Widget Configuration Examples

Complete configuration examples for all widget types and scenarios.

## Table of Contents

1. [Basic Configuration](#basic-configuration)
2. [All Widget Types](#all-widget-types)
3. [All Book Series](#all-book-series)
4. [Advanced Scenarios](#advanced-scenarios)
5. [Dynamic Loading](#dynamic-loading)

---

## Basic Configuration

### Minimal Configuration (Data Attributes)

```html
<div 
  id="widget-1"
  data-btb-widget="true"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
></div>
```

### Full Configuration (Data Attributes)

```html
<div 
  id="widget-1"
  data-btb-widget="true"
  data-widget-id="lesson-1-verbs"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
  data-language="en"
  data-api-base-url="https://api.breakingthebarrier.com/v1"
></div>
```

### JavaScript API

```javascript
window.BTBWidgets.initWidget('widget-1', {
  widgetId: 'lesson-1-verbs',
  activityType: 'verb_conjugation',
  activityId: 3062,
  bookSeries: 'BtSB1',
  language: 'en',
  apiBaseUrl: 'https://api.breakingthebarrier.com/v1'
});
```

---

## All Widget Types

### 1. Fill-in Practice

```html
<!-- Basic fill-in-the-blank -->
<div 
  id="widget-fillblanks"
  data-btb-widget="true"
  data-activity-type="fill_in_blanks_ai"
  data-activity-id="1"
  data-book-series="BtSB1"
></div>
```

### 2. Verb Conjugation

```html
<!-- Verb conjugation practice -->
<div 
  id="widget-verbs"
  data-btb-widget="true"
  data-activity-type="verb_conjugation"
  data-activity-id="3062"
  data-book-series="BtSB1"
></div>
```

### 3. Extended Response

```html
<!-- Open-ended written responses -->
<div 
  id="widget-extended"
  data-btb-widget="true"
  data-activity-type="extended_response"
  data-activity-id="2528"
  data-book-series="BtSB2"
></div>
```

### 4. Oral Practice

```html
<!-- Audio comprehension exercises -->
<div 
  id="widget-oral"
  data-btb-widget="true"
  data-activity-type="oral_practice"
  data-activity-id="3057"
  data-book-series="BtFB1"
></div>
```

### 5. Paragraph Correction

```html
<!-- Find errors in paragraphs -->
<div 
  id="widget-correction"
  data-btb-widget="true"
  data-activity-type="paragraph_correction"
  data-activity-id="3074"
  data-book-series="BtSB3"
></div>
```

### 6. AI Composition

```html
<!-- AI-powered writing feedback -->
<div 
  id="widget-composition"
  data-btb-widget="true"
  data-activity-type="ai_composition"
  data-activity-id="1"
  data-book-series="BtSB4"
></div>
```

### 7. AI Chat

```html
<!-- Conversational AI practice -->
<div 
  id="widget-chat"
  data-btb-widget="true"
  data-activity-type="ai_chat"
  data-activity-id="1"
  data-book-series="BtSB1"
></div>
```

### 8. Dropdown Selection

```html
<!-- Dropdown matching exercises -->
<div 
  id="widget-dropdown"
  data-btb-widget="true"
  data-activity-type="dropdown_selection"
  data-activity-id="2520"
  data-book-series="BtSB2"
></div>
```

### 9. Table Fill-in

```html
<!-- Table-based exercises -->
<div 
  id="widget-table"
  data-btb-widget="true"
  data-activity-type="table_fill_blanks"
  data-activity-id="1287"
  data-book-series="BtFB2"
></div>
```

### 10. Verb Identification

```html
<!-- Identify verbs in text -->
<div 
  id="widget-verbid"
  data-btb-widget="true"
  data-activity-type="verb_identification"
  data-activity-id="2100"
  data-book-series="BtSB3"
></div>
```

### 11. Drawing Vocabulary

```html
<!-- Draw and label vocabulary -->
<div 
  id="widget-drawing"
  data-btb-widget="true"
  data-activity-type="drawing_vocabulary"
  data-activity-id="1500"
  data-book-series="BtSB1"
></div>
```

---

## All Book Series

### Spanish Series

```html
<!-- Spanish 1 (Yellow - Beginner) -->
<div id="s1" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtSB1"></div>

<!-- Spanish 2 (Red - Intermediate) -->
<div id="s2" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtSB2"></div>

<!-- Spanish 3 (Blue - Advanced) -->
<div id="s3" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtSB3"></div>

<!-- Spanish 4 (Green - Advanced Plus) -->
<div id="s4" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtSB4"></div>

<!-- Spanish 5 (Purple - Mastery) -->
<div id="s5" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtSB5"></div>
```

### French Series

```html
<!-- French 1 (Yellow - Beginner) -->
<div id="f1" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtFB1"></div>

<!-- French 2 (Red - Intermediate) -->
<div id="f2" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtFB2"></div>

<!-- French 3 (Blue - Advanced) -->
<div id="f3" data-btb-widget="true" data-activity-type="verb_conjugation" 
     data-activity-id="3062" data-book-series="BtFB3"></div>
```

---

## Advanced Scenarios

### Multiple Widgets on One Page

```html
<!-- Lesson Page with 3 Activities -->
<section class="lesson-content">
  <h2>Lesson 1: Practice Activities</h2>
  
  <!-- Activity 1: Vocabulary -->
  <div class="activity">
    <h3>Activity 1: Vocabulary Practice</h3>
    <div id="lesson1-vocab" data-btb-widget="true" 
         data-activity-type="fill_in_blanks_ai" 
         data-activity-id="1" 
         data-book-series="BtSB1"></div>
  </div>
  
  <!-- Activity 2: Verbs -->
  <div class="activity">
    <h3>Activity 2: Verb Conjugation</h3>
    <div id="lesson1-verbs" data-btb-widget="true" 
         data-activity-type="verb_conjugation" 
         data-activity-id="3062" 
         data-book-series="BtSB1"></div>
  </div>
  
  <!-- Activity 3: Conversation -->
  <div class="activity">
    <h3>Activity 3: Conversation Practice</h3>
    <div id="lesson1-chat" data-btb-widget="true" 
         data-activity-type="ai_chat" 
         data-activity-id="1" 
         data-book-series="BtSB1"></div>
  </div>
</section>
```

### Tab-Based Interface

```html
<!-- WordPress Tabs Widget -->
<div class="tabs">
  <ul class="tab-nav">
    <li><a href="#tab-practice">Practice</a></li>
    <li><a href="#tab-test">Test</a></li>
    <li><a href="#tab-review">Review</a></li>
  </ul>
  
  <div id="tab-practice" class="tab-content">
    <div id="practice-widget" data-btb-widget="true" 
         data-activity-type="fill_in_blanks_ai" 
         data-activity-id="1"></div>
  </div>
  
  <div id="tab-test" class="tab-content">
    <div id="test-widget" data-btb-widget="true" 
         data-activity-type="verb_conjugation" 
         data-activity-id="3062"></div>
  </div>
  
  <div id="tab-review" class="tab-content">
    <div id="review-widget" data-btb-widget="true" 
         data-activity-type="ai_composition" 
         data-activity-id="1"></div>
  </div>
</div>
```

### Accordion Layout

```html
<!-- Elementor Accordion -->
<div class="accordion">
  <div class="accordion-item">
    <h3 class="accordion-header">Exercise 1: Fill in the Blanks</h3>
    <div class="accordion-content">
      <div id="accordion-ex1" data-btb-widget="true" 
           data-activity-type="fill_in_blanks_ai" 
           data-activity-id="1"></div>
    </div>
  </div>
  
  <div class="accordion-item">
    <h3 class="accordion-header">Exercise 2: Verb Practice</h3>
    <div class="accordion-content">
      <div id="accordion-ex2" data-btb-widget="true" 
           data-activity-type="verb_conjugation" 
           data-activity-id="3062"></div>
    </div>
  </div>
</div>
```

### Different Languages (English vs Spanish Interface)

```html
<!-- Widget with English interface (default) -->
<div id="widget-en" data-btb-widget="true" 
     data-activity-type="verb_conjugation" 
     data-activity-id="3062" 
     data-language="en"></div>

<!-- Widget starting with Spanish interface -->
<div id="widget-es" data-btb-widget="true" 
     data-activity-type="verb_conjugation" 
     data-activity-id="3062" 
     data-language="es"></div>
```

---

## Dynamic Loading

### Load Widget on Button Click

```html
<button id="load-widget-btn">Start Exercise</button>
<div id="dynamic-widget"></div>

<script>
document.getElementById('load-widget-btn').addEventListener('click', function() {
  this.style.display = 'none'; // Hide button
  
  window.BTBWidgets.initWidget('dynamic-widget', {
    widgetId: 'dynamic-1',
    activityType: 'verb_conjugation',
    activityId: 3062,
    bookSeries: 'BtSB1'
  });
});
</script>
```

### Lazy Load on Scroll

```html
<div id="lazy-widget" 
     data-activity-type="ai_chat" 
     data-activity-id="1" 
     data-lazy-load="true"></div>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      window.BTBWidgets.initWidget(el.id, {
        widgetId: el.id,
        activityType: el.dataset.activityType,
        activityId: parseInt(el.dataset.activityId)
      });
      observer.unobserve(el);
    }
  });
});

document.querySelectorAll('[data-lazy-load]').forEach(el => {
  observer.observe(el);
});
</script>
```

### Conditional Loading (User Progress)

```html
<div id="conditional-widget"></div>

<script>
// Check if user has completed prerequisite
const userProgress = getUserProgress(); // Your function

if (userProgress.completedLesson1) {
  // Load advanced widget
  window.BTBWidgets.initWidget('conditional-widget', {
    widgetId: 'advanced-1',
    activityType: 'ai_composition',
    activityId: 1,
    bookSeries: 'BtSB2'
  });
} else {
  // Load beginner widget
  window.BTBWidgets.initWidget('conditional-widget', {
    widgetId: 'beginner-1',
    activityType: 'fill_in_blanks_ai',
    activityId: 1,
    bookSeries: 'BtSB1'
  });
}
</script>
```

### Load Different Widget Based on User Selection

```html
<select id="activity-selector">
  <option value="verb_conjugation">Verb Practice</option>
  <option value="ai_chat">Conversation</option>
  <option value="fill_in_blanks_ai">Fill in Blanks</option>
</select>

<button id="load-selected">Load Activity</button>
<div id="selected-widget"></div>

<script>
document.getElementById('load-selected').addEventListener('click', function() {
  const selected = document.getElementById('activity-selector').value;
  
  // Activity IDs for each type
  const activityIds = {
    'verb_conjugation': 3062,
    'ai_chat': 1,
    'fill_in_blanks_ai': 1
  };
  
  window.BTBWidgets.initWidget('selected-widget', {
    widgetId: 'user-selected',
    activityType: selected,
    activityId: activityIds[selected],
    bookSeries: 'BtSB1'
  });
});
</script>
```

### Destroy and Reload Widget

```html
<div id="reloadable-widget" data-btb-widget="true" 
     data-activity-type="verb_conjugation" 
     data-activity-id="3062"></div>

<button id="reset-widget">Reset Exercise</button>

<script>
document.getElementById('reset-widget').addEventListener('click', function() {
  // Destroy existing widget
  window.BTBWidgets.destroyWidget('reloadable-widget');
  
  // Reload fresh widget
  setTimeout(() => {
    window.BTBWidgets.initWidget('reloadable-widget', {
      widgetId: 'reloadable-1',
      activityType: 'verb_conjugation',
      activityId: 3062,
      bookSeries: 'BtSB1'
    });
  }, 100);
});
</script>
```

---

## Custom Styling

### Wrapper Styles

```html
<style>
.widget-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

<div class="widget-wrapper">
  <div id="styled-widget" data-btb-widget="true" 
       data-activity-type="verb_conjugation" 
       data-activity-id="3062"></div>
</div>
```

### Responsive Container

```html
<style>
.responsive-widget {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .responsive-widget {
    padding: 1rem;
  }
}
</style>

<div class="responsive-widget">
  <div id="responsive-widget" data-btb-widget="true" 
       data-activity-type="ai_chat" 
       data-activity-id="1"></div>
</div>
```

---

## WordPress Shortcode Example

If you want to create a WordPress shortcode for easier widget embedding:

```php
// Add to functions.php
function btb_widget_shortcode($atts) {
    $a = shortcode_atts(array(
        'type' => 'verb_conjugation',
        'id' => '3062',
        'series' => 'BtSB1',
        'language' => 'en'
    ), $atts);
    
    $widget_id = 'btb-' . uniqid();
    
    return sprintf(
        '<div id="%s" data-btb-widget="true" data-activity-type="%s" data-activity-id="%s" data-book-series="%s" data-language="%s"></div>',
        esc_attr($widget_id),
        esc_attr($a['type']),
        esc_attr($a['id']),
        esc_attr($a['series']),
        esc_attr($a['language'])
    );
}
add_shortcode('btb_widget', 'btb_widget_shortcode');
```

Usage in WordPress editor:

```
[btb_widget type="verb_conjugation" id="3062" series="BtSB1" language="en"]
```

---

## Error Handling

### Check if Widget API is Loaded

```javascript
if (window.BTBWidgets) {
  window.BTBWidgets.initWidget('widget-1', { ... });
} else {
  console.error('BTB Widgets not loaded');
}
```

### Check Widget Version

```javascript
console.log('BTB Widgets Version:', window.BTBWidgets.version);
```

### Handle Widget Initialization Errors

```javascript
try {
  window.BTBWidgets.initWidget('widget-1', {
    widgetId: 'test',
    activityType: 'verb_conjugation',
    activityId: 3062
  });
} catch (error) {
  console.error('Failed to initialize widget:', error);
  // Show fallback content
  document.getElementById('widget-1').innerHTML = 
    '<p>Failed to load exercise. Please refresh the page.</p>';
}
```

---

## Performance Tips

### Preload Widget Scripts

```html
<link rel="preload" href="/path/to/react-vendor.js" as="script">
<link rel="preload" href="/path/to/widgets.js" as="script">
<link rel="preload" href="/path/to/widget.js" as="script">
```

### Defer Non-Critical Widgets

```html
<!-- Load immediately -->
<div id="critical-widget" data-btb-widget="true" 
     data-activity-type="verb_conjugation" data-activity-id="3062"></div>

<!-- Load after page load -->
<div id="deferred-widget"></div>
<script>
window.addEventListener('load', function() {
  window.BTBWidgets.initWidget('deferred-widget', { ... });
});
</script>
```
