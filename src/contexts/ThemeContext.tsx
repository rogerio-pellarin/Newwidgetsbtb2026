import { createContext, useContext, useState, ReactNode } from 'react';

export type BookSeries =
  | 'spanish-1'
  | 'spanish-2'
  | 'spanish-3'
  | 'french-1'
  | 'french-2'
  | 'french-3'
  | 'en-camino'
  | 'vamos';

export interface BookTheme {
  id: BookSeries;
  name: string;
  level: string;
  language: 'Spanish' | 'French';
  primary: string; // Main brand color
  primaryDark: string; // Darker shade for hover states
  primaryLight: string; // Light tint for backgrounds
  primaryPale: string; // Very light tint for subtle backgrounds
  primaryBorder: string; // Soft border color - between light and pale
}

export const bookThemes: Record<BookSeries, BookTheme> = {
  'spanish-1': {
    id: 'spanish-1',
    name: 'Breaking the Spanish Barrier 1',
    level: 'Beginner',
    language: 'Spanish',
    primary: '#FDB813',
    primaryDark: '#E5A50F',
    primaryLight: '#FDC84B',
    primaryPale: '#FEF3D9',
    primaryBorder: '#F8E9A1',
  },
  'spanish-2': {
    id: 'spanish-2',
    name: 'Breaking the Spanish Barrier 2',
    level: 'Intermediate',
    language: 'Spanish',
    primary: '#FF6B35',
    primaryDark: '#E65A28',
    primaryLight: '#FF8C5E',
    primaryPale: '#FFEDE6',
    primaryBorder: '#FFB082',
  },
  'spanish-3': {
    id: 'spanish-3',
    name: 'Breaking the Spanish Barrier 3',
    level: 'Advanced',
    language: 'Spanish',
    primary: '#E91E63',
    primaryDark: '#C2185B',
    primaryLight: '#F06292',
    primaryPale: '#FCE4EC',
    primaryBorder: '#F8BBD0',
  },
  'french-1': {
    id: 'french-1',
    name: 'Breaking the French Barrier 1',
    level: 'Beginner',
    language: 'French',
    primary: '#C6D82E',
    primaryDark: '#A8B828',
    primaryLight: '#D4E356',
    primaryPale: '#F5F8E1',
    primaryBorder: '#E6E996',
  },
  'french-2': {
    id: 'french-2',
    name: 'Breaking the French Barrier 2',
    level: 'Intermediate',
    language: 'French',
    primary: '#9B59B6',
    primaryDark: '#8E44AD',
    primaryLight: '#B77FCF',
    primaryPale: '#F3E5F5',
    primaryBorder: '#C1B0D7',
  },
  'french-3': {
    id: 'french-3',
    name: 'Breaking the French Barrier 3',
    level: 'Advanced',
    language: 'French',
    primary: '#1E88E5',
    primaryDark: '#1976D2',
    primaryLight: '#42A5F5',
    primaryPale: '#E3F2FD',
    primaryBorder: '#90CAF9',
  },
  'en-camino': {
    id: 'en-camino',
    name: 'En Camino',
    level: 'Beginner B',
    language: 'Spanish',
    primary: '#00BCD4',
    primaryDark: '#0097A7',
    primaryLight: '#26C6DA',
    primaryPale: '#E0F7FA',
    primaryBorder: '#80DEEA',
  },
  'vamos': {
    id: 'vamos',
    name: '¡Vamos!',
    level: 'Beginner A',
    language: 'Spanish',
    primary: '#EC407A',
    primaryDark: '#D81B60',
    primaryLight: '#F06292',
    primaryPale: '#FCE4EC',
    primaryBorder: '#F8BBD0',
  },
};

interface ThemeContextType {
  currentBook: BookSeries;
  theme: BookTheme;
  setCurrentBook: (book: BookSeries) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentBook, setCurrentBook] = useState<BookSeries>('spanish-1');

  const value: ThemeContextType = {
    currentBook,
    theme: bookThemes[currentBook],
    setCurrentBook,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide a safe fallback during hot-reload or missing provider
    // Only warn once in development to avoid console spam
    if (typeof window !== 'undefined' && !window.__theme_warning_shown) {
      console.warn('⚠️ useTheme: ThemeProvider not found, using default theme');
      window.__theme_warning_shown = true;
    }
    return {
      currentBook: 'spanish-1',
      theme: bookThemes['spanish-1'],
      setCurrentBook: () => {
        // Silently ignore calls outside provider
      },
    };
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __theme_warning_shown?: boolean;
  }
}