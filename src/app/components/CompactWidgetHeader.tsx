import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface CompactWidgetHeaderProps {
  identifier: string;
  breadcrumb: string[];
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  iconBgStyle?: React.CSSProperties;
  statusBadge: {
    text: string;
    color: string;
    bgColor: string;
    icon?: string | React.ReactNode;
  };
}

export function CompactWidgetHeader({
  identifier,
  breadcrumb,
  title,
  icon: Icon,
  iconColor,
  iconBg,
  iconBgStyle,
  statusBadge,
}: CompactWidgetHeaderProps) {
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);

  return (
    <div className="mb-6">
      {/* First Line - Icon & Title */}
      <div className="flex items-start gap-3 mb-3">
        {/* Icon */}
        <div 
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${iconBg}`}
          style={iconBgStyle}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Title - allow wrapping without condensed font */}
        <h2 className="text-gray-900 leading-tight flex-1 min-w-0">
          {title}
        </h2>
      </div>

      {/* Second Line - Status Badge | Widget ID */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 ${statusBadge.bgColor} ${statusBadge.color} px-2.5 py-1 rounded-full text-xs flex-shrink-0`}>
          {statusBadge.icon && (
            typeof statusBadge.icon === 'string' ? (
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${statusBadge.icon === '✓' ? 'bg-green-600' : statusBadge.icon.includes('%') ? 'bg-orange-500' : 'bg-gray-600'}`}>
                {statusBadge.icon}
              </div>
            ) : (
              statusBadge.icon
            )
          )}
          <span className="font-medium whitespace-nowrap">{statusBadge.text}</span>
        </div>

        {/* Widget Identifier */}
        <div className="relative">
          <div
            onMouseEnter={() => setShowBreadcrumb(true)}
            onMouseLeave={() => setShowBreadcrumb(false)}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/80 hover:bg-white border border-gray-300 rounded-md transition-colors cursor-help text-xs text-gray-600"
          >
            <span className="font-mono text-[11px]">{identifier}</span>
          </div>

          {showBreadcrumb && (
            <div className="absolute top-full right-0 mt-2 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {breadcrumb.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <span>{crumb}</span>
                      {index < breadcrumb.length - 1 && <span className="text-gray-400">›</span>}
                    </span>
                  ))}
                </div>
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200" />
    </div>
  );
}