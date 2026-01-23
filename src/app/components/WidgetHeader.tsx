import { useState } from 'react';

interface WidgetHeaderProps {
  identifier: string;
  breadcrumb: string[];
  compact?: boolean;
}

export function WidgetHeader({ identifier, breadcrumb, compact = false }: WidgetHeaderProps) {
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowBreadcrumb(true)}
        onMouseLeave={() => setShowBreadcrumb(false)}
        className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/80 hover:bg-white border border-gray-300 rounded-md transition-colors cursor-help text-xs text-gray-600"
      >
        <span className="font-mono">{identifier}</span>
      </div>
      
      {showBreadcrumb && (
        <div className="absolute top-full left-0 mt-2 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap">
            <div className="flex items-center gap-2">
              {breadcrumb.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span>{crumb}</span>
                  {index < breadcrumb.length - 1 && (
                    <span className="text-gray-400">›</span>
                  )}
                </span>
              ))}
            </div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}