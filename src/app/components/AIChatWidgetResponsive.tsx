import { useState, useEffect } from 'react';
import { AIChatWidget } from './AIChatWidget';
import { AIChatWidgetMobile } from './AIChatWidgetMobile';
import type { AIChatActivity } from '../../types/activities';

interface AIChatWidgetResponsiveProps {
  language: 'en' | 'es';
  onLanguageToggle: () => void;
  activity: AIChatActivity;
}

export function AIChatWidgetResponsive({ language, onLanguageToggle, activity }: AIChatWidgetResponsiveProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? (
    <AIChatWidgetMobile language={language} onLanguageToggle={onLanguageToggle} activity={activity} />
  ) : (
    <AIChatWidget language={language} onLanguageToggle={onLanguageToggle} activity={activity} />
  );
}