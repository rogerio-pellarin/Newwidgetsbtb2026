# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Breaking the Barrier Widgets                      │
│                     Dual-Purpose Application                         │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼──────────┐    ┌────────▼─────────────┐
│   Test Harness     │    │  Embeddable Widget   │
│   (Development)    │    │   (Production)       │
│                    │    │                      │
│  • All 13 widgets  │    │  • Single widget     │
│  • Widget selector │    │  • WordPress ready   │
│  • Book selector   │    │  • Auto-init         │
│  • Dev tools       │    │  • Global API        │
└────────────────────┘    └──────────────────────┘
```

## Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WordPress Page                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Elementor / HTML                            │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  <div id="widget-1" data-btb-widget="true" ...>          │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ Auto-init or
                               │ window.BTBWidgets.initWidget()
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                     widget-embed.tsx                                 │
│                   (Entry Point / Bootstrap)                          │
│                                                                      │
│  • Creates window.BTBWidgets global API                             │
│  • Auto-initializes [data-btb-widget] elements                      │
│  • Manages React roots                                              │
│  • Handles cleanup                                                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ Creates React root
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                    EmbeddableWidget.tsx                              │
│                   (Widget Wrapper Component)                         │
│                                                                      │
│  ┌────────────────┐  ┌─────────────────┐  ┌───────────────────┐   │
│  │ Theme Provider │  │ Data Fetching   │  │ State Management  │   │
│  │   - Book theme │  │  - API service  │  │  - Language       │   │
│  │   - Colors     │  │  - Loading      │  │  - Progress       │   │
│  └────────────────┘  └─────────────────┘  └───────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Widget Type Router                               │  │
│  │   (Selects correct widget based on activityType)             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ Renders specific widget
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                       Widget Components                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐   │
│  │ FillInBlanks   │  │ VerbConjugation│  │ AIComposition      │   │
│  │ Widget         │  │ Widget         │  │ Widget             │   │
│  └────────────────┘  └────────────────┘  └────────────────────┘   │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐   │
│  │ OralPractice   │  │ AIChatWidget   │  │ CorrectParagraph   │   │
│  │ Widget         │  │                │  │ Widget             │   │
│  └────────────────┘  └────────────────┘  └────────────────────┘   │
│                                                                      │
│  └────────────────── ... 13 total widgets ───────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┴────────────────┐
                │                               │
┌───────────────▼──────────┐      ┌─────────────▼─────────────┐
│   Shared Contexts        │      │   Shared Services         │
│                          │      │                           │
│  • ThemeContext          │      │  • API Service            │
│    - Current book        │      │    - Fetch activities     │
│    - Theme colors        │      │    - Mock data (dev)      │
│    - Icons               │      │    - Real API (prod)      │
│                          │      │                           │
│  • Language State        │      │  • Text Matching          │
│    - Current language    │      │    - Fuzzy matching       │
│    - Toggle function     │      │    - Accent handling      │
│                          │      │                           │
└──────────────────────────┘      └───────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Initialization Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. Page Load
   └─> Scripts loaded in order:
       ├─> react-vendor.js  (React, ReactDOM)
       ├─> widgets.js       (All widget components)
       └─> widget.js        (Initialization code)

2. Auto-Init or Manual Init
   ├─> Auto: widget-embed.tsx scans for [data-btb-widget]
   └─> Manual: window.BTBWidgets.initWidget() called

3. Widget Configuration Parsed
   ├─> widgetId extracted
   ├─> activityType determined
   ├─> activityId extracted
   ├─> bookSeries theme set
   └─> language preference set

4. React Root Created
   └─> EmbeddableWidget mounted

5. Theme Applied
   └─> ThemeContext sets book series theme

6. Data Fetched
   ├─> API service called with activityType + activityId
   ├─> Mock data returned (dev) or
   └─> Real API data returned (prod)

7. Widget Rendered
   ├─> Correct widget component selected
   ├─> Activity data passed as props
   ├─> Language toggle enabled
   └─> UI fully interactive

┌─────────────────────────────────────────────────────────────────┐
│                      User Interaction Flow                       │
└─────────────────────────────────────────────────────────────────┘

User Input
   └─> Widget Component
       ├─> State updates
       ├─> Validation (text matching)
       ├─> Feedback color (green/yellow/red)
       ├─> Auto-save triggered
       └─> Progress updated
```

## Build Process

```
┌─────────────────────────────────────────────────────────────────┐
│                         npm run build                            │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
┌─────────────▼──────────┐      ┌──────────────▼────────────────┐
│   Test Harness Build   │      │   Embeddable Widget Build     │
│   (index.html)         │      │   (widget.js + chunks)        │
│                        │      │                               │
│  Entry: index.html     │      │  Entry: widget-embed.tsx      │
│  Output: dist/index.*  │      │  Output:                      │
│                        │      │    • dist/widget.js           │
│  Used for:             │      │    • dist/widgets.js          │
│  • Development         │      │    • dist/react-vendor.js     │
│  • Testing             │      │    • dist/styles.css          │
│  • Internal demos      │      │                               │
│                        │      │  Used for:                    │
│                        │      │  • WordPress embedding        │
│                        │      │  • Production deployment      │
└────────────────────────┘      └───────────────────────────────┘
```

## File Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                     # Test harness (unchanged)
│   │   ├── EmbeddableWidget.tsx        # NEW: Widget wrapper
│   │   └── components/
│   │       ├── FillInBlanksWidget.tsx
│   │       ├── VerbConjugationWidget.tsx
│   │       └── ... (11 more widgets)
│   │
│   ├── widget-embed.tsx                # NEW: WordPress entry point
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx            # Theme management (shared)
│   │
│   ├── services/
│   │   └── api.ts                      # Data fetching (shared)
│   │
│   ├── types/
│   │   └── activities.ts               # TypeScript types (shared)
│   │
│   └── data/                           # Sample JSON data
│       ├── sample-verb-conjugation.json
│       └── ... (11 more data files)
│
├── vite.config.ts                      # UPDATED: Dual build config
│
├── Documentation/
│   ├── README.md                       # Project overview
│   ├── START_HERE.md                   # Getting started guide
│   ├── WORDPRESS_INTEGRATION.md        # Integration guide
│   ├── EMBEDDABLE_WIDGETS.md           # Architecture docs
│   ├── QUICK_REFERENCE.md              # Quick examples
│   └── CONFIGURATION_EXAMPLES.md       # Advanced configs
│
└── wordpress-example.html              # NEW: Demo file
```

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                        State Architecture                        │
└─────────────────────────────────────────────────────────────────┘

Global State (via Context)
├── ThemeContext
│   ├── currentBook: 'BtSB1' | 'BtSB2' | ... | 'BtFB3'
│   ├── setCurrentBook: (book) => void
│   ├── themeColors: { primary, icon, ... }
│   └── activityIcons: { verb_conjugation, ai_chat, ... }

Widget-Level State (via useState in EmbeddableWidget)
├── language: 'en' | 'es'
├── activityData: Activity | null
├── loading: boolean
└── error: string | null

Component-Level State (within each widget)
├── userAnswers: Record<string, string>
├── validationResults: Record<string, 'correct' | 'partial' | 'incorrect'>
├── currentQuestion: number
├── showAnswer: boolean
├── aiResponse: string
└── ... (widget-specific state)
```

## API Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Flow                                 │
└─────────────────────────────────────────────────────────────────┘

Widget Config
   ├─> activityType: 'verb_conjugation'
   ├─> activityId: 3062
   └─> apiBaseUrl: 'https://api.example.com' (optional)
        │
        │
┌───────▼─────────────────────────────────────────────────────────┐
│                    API Service                                   │
│                                                                  │
│  fetchActivity(type, id)                                         │
│    ├─> Check if apiBaseUrl is custom                            │
│    ├─> If yes: fetch from custom API                            │
│    │   GET {apiBaseUrl}/activities/{type}/{id}                  │
│    └─> If no: return mock data (development)                    │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
        ┌───────────▼──────┐   ┌─────────▼────────┐
        │  Mock Data       │   │  Real API        │
        │  (Development)   │   │  (Production)    │
        │                  │   │                  │
        │  • JSON files    │   │  • HTTP request  │
        │  • /src/data/    │   │  • Auth headers  │
        │  • No network    │   │  • Error handling│
        └──────────────────┘   └──────────────────┘
```

## Theme System

```
┌─────────────────────────────────────────────────────────────────┐
│                      Theme Configuration                         │
└─────────────────────────────────────────────────────────────────┘

Book Series Code (e.g., 'BtSB1')
   │
   ├─> ThemeContext.setCurrentBook('BtSB1')
   │
   ├─> Determines:
   │   ├─> Primary color: '#F59E0B' (yellow)
   │   ├─> Icon color: Same as primary
   │   ├─> Background tint: Lighter version
   │   └─> Activity icons: Colored versions
   │
   └─> Applied to:
       ├─> Widget header background
       ├─> Activity type icon
       ├─> Progress indicators
       ├─> Accent colors
       └─> Hover states

Widget Content
   └─> Remains neutral (gray palette)
       ├─> Feedback colors: green/yellow/red (always)
       ├─> Text: Gray-900 / Gray-600
       └─> Borders: Gray-200 / Gray-300
```

## Multiple Widgets on One Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    WordPress Page                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Widget 1 (Verb Conjugation)                               │ │
│  │  React Root #1                                             │ │
│  │  ├─> ThemeContext: BtSB1 (Yellow)                          │ │
│  │  ├─> activityId: 3062                                      │ │
│  │  └─> Independent state                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Widget 2 (AI Chat)                                        │ │
│  │  React Root #2                                             │ │
│  │  ├─> ThemeContext: BtSB2 (Red)                             │ │
│  │  ├─> activityId: 1                                         │ │
│  │  └─> Independent state                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Widget 3 (Fill-in Blanks)                                │ │
│  │  React Root #3                                             │ │
│  │  ├─> ThemeContext: BtFB1 (Yellow, French)                  │ │
│  │  ├─> activityId: 1                                         │ │
│  │  └─> Independent state                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Each widget:
  • Has its own React root (isolated)
  • Has its own theme context (can be different)
  • Has its own state (completely independent)
  • Can be destroyed independently
  • Shares the same JavaScript bundle (efficient)
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                    Bundle Optimization                           │
└─────────────────────────────────────────────────────────────────┘

Code Splitting:
├── react-vendor.js (~140KB gzipped)
│   └─> React, ReactDOM (rarely changes, long cache)
│
├── widgets.js (~80KB gzipped)
│   └─> All 13 widget components (changes occasionally)
│
└── widget.js (~15KB gzipped)
    └─> Initialization code (changes frequently)

Browser caching:
  ├─> react-vendor.js: Cache for 1 year
  ├─> widgets.js: Cache for 1 month
  └─> widget.js: Cache for 1 week

Result:
  ✓ First load: ~235KB total
  ✓ Cached load: ~15KB (only widget.js if updated)
  ✓ Parallel downloads via HTTP/2
  ✓ Shared across all widgets on page
```

---

## Integration Points

### WordPress Integration Points

1. **Theme functions.php** - Script enqueueing
2. **Elementor HTML Widget** - Widget containers
3. **Custom JavaScript** - Dynamic initialization
4. **CSS Customization** - Optional styling overrides

### API Integration Points

1. **activityAPI.fetchActivity()** - Main data fetching
2. **Custom API base URL** - Production endpoints
3. **Authentication headers** - Can be added to API service
4. **Error handling** - Network failures, 404s, etc.

### Theme Integration Points

1. **data-book-series** - HTML attribute
2. **ThemeContext.setCurrentBook()** - Programmatic
3. **CSS variables** - Can override colors
4. **Activity icons** - Automatically themed

---

## Security Considerations

```
Data Flow Security:
├── Input Validation
│   ├─> HTML attributes sanitized
│   ├─> Activity IDs validated (numbers only)
│   └─> Widget IDs validated (alphanumeric + hyphens)
│
├── Output Encoding
│   ├─> React automatically escapes output
│   ├─> No dangerouslySetInnerHTML (except for controlled HTML)
│   └─> XSS protection built-in
│
└── API Security
    ├─> CORS configured correctly
    ├─> Authentication tokens (if needed)
    └─> Rate limiting (on backend)
```
