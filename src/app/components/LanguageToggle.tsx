import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  language: 'en' | 'es';
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-sm"
      title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
    >
      <Languages className="w-4 h-4 text-gray-600" />
      <span className="font-medium text-gray-700">{language === 'en' ? 'EN' : 'ES'}</span>
    </button>
  );
}
