# Dynamic Theming System

## Overview

The Breaking the Barrier assessment widgets now feature a dynamic theming system that allows switching between different book series, each with its own unique brand color while maintaining a professional, content-focused design.

---

## Book Series & Colors

### Spanish Series

| Book | Level | Primary Color | Use Case |
|------|-------|---------------|----------|
| Breaking the Spanish Barrier 1 | Beginner | `#FDB813` (Gold/Yellow) | Entry level students |
| Breaking the Spanish Barrier 2 | Intermediate | `#FF6B35` (Orange/Coral) | Progressive learners |
| Breaking the Spanish Barrier 3 | Advanced | `#E91E63` (Pink/Red) | Advanced students |
| En Camino | Beginner B | `#00BCD4` (Cyan/Turquoise) | Alternative beginner path |
| ¡Vamos! | Beginner A | `#EC407A` (Pink) | Introductory level |

### French Series

| Book | Level | Primary Color | Use Case |
|------|-------|---------------|----------|
| Breaking the French Barrier 1 | Beginner | `#C6D82E` (Lime Green) | Entry level students |
| Breaking the French Barrier 2 | Intermediate | `#9B59B6` (Purple) | Progressive learners |
| Breaking the French Barrier 3 | Advanced | `#1E88E5` (Blue) | Advanced students |

---

## Design Philosophy

### Color Application Strategy

**The theme color is applied ONLY to:**
- ✅ Icons and badges (activity type identifiers)
- ✅ Progress bars
- ✅ Question numbers
- ✅ Lightbulb/hint icons
- ✅ Border accents on instruction panels
- ✅ Hover states on interactive elements
- ✅ Show/hide answer buttons

**Content areas remain NEUTRAL:**
- ⬜ White backgrounds for questions
- ⬜ Gray text for readability
- ⬜ Standard green/yellow/red for answer feedback
- ⬜ Coral/red for verb highlights (consistent across all themes)

This ensures:
1. **Professional appearance** - No overwhelming colors
2. **Focus on content** - Students concentrate on learning
3. **Brand consistency** - Each book series has visual identity
4. **Accessibility** - High contrast, readable text

---

## Implementation

### ThemeContext

Located in `/src/contexts/ThemeContext.tsx`

```typescript
export interface BookTheme {
  id: BookSeries;
  name: string;
  level: string;
  language: 'Spanish' | 'French';
  primary: string;        // Main brand color
  primaryDark: string;    // Darker shade for hover states
  primaryLight: string;   // Light tint for borders
  primaryPale: string;    // Very light tint for subtle backgrounds
}
```

### Usage in Components

```typescript
import { useTheme } from '../../contexts/ThemeContext';

export function MyWidget() {
  const { theme } = useTheme();
  
  return (
    <div 
      className="border-2"
      style={{ borderColor: theme.primaryLight }}
    >
      <div 
        className="w-8 h-8 rounded-lg"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Icon */}
      </div>
    </div>
  );
}
```

### BookSelector Component

Located in `/src/app/components/BookSelector.tsx`

Features:
- Dropdown selector in top navigation
- Grouped by language (Spanish / French)
- Shows book level and name
- Color-coded book icons
- Active selection indicator

---

## Color Palette Details

### Spanish 1 (Beginner)
```css
--primary: #FDB813        /* Vibrant yellow/gold */
--primary-dark: #E5A50F   /* Darker gold */
--primary-light: #FEEFC7  /* Light gold tint */
--primary-pale: #FFF9E6   /* Very light gold */
```

### Spanish 2 (Intermediate)
```css
--primary: #FF6B35        /* Orange/coral */
--primary-dark: #E65A28   /* Dark orange */
--primary-light: #FFD5C7  /* Light orange tint */
--primary-pale: #FFF0EB   /* Very light orange */
```

### Spanish 3 (Advanced)
```css
--primary: #E91E63        /* Pink/magenta */
--primary-dark: #C2185B   /* Dark pink */
--primary-light: #F8BBD0  /* Light pink tint */
--primary-pale: #FCE4EC   /* Very light pink */
```

### French 1 (Beginner)
```css
--primary: #C6D82E        /* Lime/yellow-green */
--primary-dark: #A8B828   /* Dark lime */
--primary-light: #E9F0B8  /* Light lime tint */
--primary-pale: #F5F8E1   /* Very light lime */
```

### French 2 (Intermediate)
```css
--primary: #9B59B6        /* Purple */
--primary-dark: #8E44AD   /* Dark purple */
--primary-light: #E1BEE7  /* Light purple tint */
--primary-pale: #F3E5F5   /* Very light purple */
```

### French 3 (Advanced)
```css
--primary: #1E88E5        /* Blue */
--primary-dark: #1976D2   /* Dark blue */
--primary-light: #BBDEFB  /* Light blue tint */
--primary-pale: #E3F2FD   /* Very light blue */
```

---

## Widget Theming Examples

### Fill-in-the-Blanks Widget

**Themed Elements:**
- Instruction panel border (primaryLight)
- Lightbulb icon background (primary)
- Tips section bullets (primary)
- Collapse arrow (primary)
- Progress bar background (primaryPale)
- Progress bar fill (primary → primaryDark gradient)
- Question number badges (primary)
- Show/hide answer button hover (primary)
- Answer callout border (primary)
- Answer callout background (primaryPale)

**Neutral Elements:**
- White question cards
- Gray text
- Green/yellow/red answer feedback
- Coral verb highlights

### Verb Conjugation Widget

**Themed Elements:**
- Icon backgrounds
- Progress indicators
- Submit buttons
- Border accents

**Neutral Elements:**
- Input fields
- Text content
- Feedback colors

---

## Benefits

### 1. **Multi-Product Support**
- Single codebase supports all book series
- Easy to add new products
- Consistent UX across all levels

### 2. **Brand Recognition**
- Students instantly recognize their book level
- Visual consistency with physical textbooks
- Professional, cohesive appearance

### 3. **Maintainability**
- Centralized theme management
- Easy to update colors
- No hardcoded values in components

### 4. **Accessibility**
- High contrast maintained
- Readable text on all backgrounds
- Color-blind friendly (uses shapes + colors)

---

## Adding a New Book Series

1. **Add to ThemeContext:**
```typescript
'new-book': {
  id: 'new-book',
  name: 'New Book Title',
  level: 'Intermediate',
  language: 'Spanish',
  primary: '#FF5733',
  primaryDark: '#E64A2E',
  primaryLight: '#FFB3A0',
  primaryPale: '#FFE8E0',
}
```

2. **Update BookSelector** if needed for new language groups

3. **Test** with all widgets to ensure proper color application

---

## Best Practices

### ✅ DO:
- Use `theme.primary` for icons, badges, and interactive elements
- Use `theme.primaryLight` for borders and subtle accents
- Use `theme.primaryPale` for background tints
- Use `theme.primaryDark` for hover states and gradients
- Keep content backgrounds white or light gray
- Maintain green/yellow/red for answer feedback

### ❌ DON'T:
- Don't apply theme color to text (reduces readability)
- Don't use theme color for large background areas
- Don't override answer feedback colors (green/yellow/red)
- Don't change verb highlight colors (keep coral/red)

---

## Future Enhancements

Potential additions:
- Dark mode support per book series
- Custom fonts per language
- Additional accent colors for different widget types
- Theme preview in book selector
- User preference persistence
