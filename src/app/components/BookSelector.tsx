import { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { useTheme, bookThemes, type BookSeries } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function BookSelector() {
  const { currentBook, theme, setCurrentBook } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (bookId: BookSeries) => {
    setCurrentBook(bookId);
    setIsOpen(false);
  };

  // Group books by language
  const spanishBooks = Object.values(bookThemes).filter((book) => book.language === 'Spanish');
  const frenchBooks = Object.values(bookThemes).filter((book) => book.language === 'French');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        style={{
          borderColor: isOpen ? theme.primary : undefined,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: theme.primary }}
        >
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">{theme.name}</div>
          <div className="text-xs text-gray-500">{theme.level}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Spanish Books */}
            <div className="border-b border-gray-200">
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Spanish Series
              </div>
              <div className="py-1">
                {spanishBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelect(book.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                      currentBook === book.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: book.primary }}
                    >
                      <span className="text-white text-xs font-bold">
                        {book.id === 'spanish-1'
                          ? '1'
                          : book.id === 'spanish-2'
                          ? '2'
                          : book.id === 'spanish-3'
                          ? '3'
                          : book.id === 'en-camino'
                          ? 'B'
                          : 'A'}
                      </span>
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-gray-900">{book.name}</div>
                      <div className="text-xs text-gray-500">{book.level}</div>
                    </div>
                    {currentBook === book.id && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: book.primary }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* French Books */}
            <div>
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                French Series
              </div>
              <div className="py-1">
                {frenchBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelect(book.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                      currentBook === book.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: book.primary }}
                    >
                      <span className="text-white text-xs font-bold">
                        {book.id === 'french-1' ? '1' : book.id === 'french-2' ? '2' : '3'}
                      </span>
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-gray-900">{book.name}</div>
                      <div className="text-xs text-gray-500">{book.level}</div>
                    </div>
                    {currentBook === book.id && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: book.primary }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
