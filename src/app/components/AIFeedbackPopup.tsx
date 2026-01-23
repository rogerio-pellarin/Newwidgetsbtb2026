import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import feedbackIllustration from 'figma:asset/c2f458ac1a81841f73b8795aed0e97b98b1318dc.png';

interface AIFeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  feedback: string;
  language: 'en' | 'es';
}

export function AIFeedbackPopup({ isOpen, onClose, title, feedback, language }: AIFeedbackPopupProps) {
  const closeText = language === 'en' ? 'Close' : 'Cerrar';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-t-2xl relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-white text-2xl font-semibold">{title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Illustration */}
                <div className="flex justify-center mb-6">
                  <img
                    src={feedbackIllustration}
                    alt="AI Feedback"
                    className="w-64 h-auto"
                  />
                </div>

                {/* Feedback Text */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {feedback}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                >
                  {closeText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
