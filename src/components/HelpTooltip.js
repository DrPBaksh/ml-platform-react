import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, Lightbulb } from 'lucide-react';

const HelpTooltip = ({ title, content, level = 'beginner', children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const levelColors = {
    beginner: 'bg-green-50 border-green-200 text-green-800',
    intermediate: 'bg-blue-50 border-blue-200 text-blue-800',
    advanced: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  const levelIcons = {
    beginner: BookOpen,
    intermediate: Lightbulb,
    advanced: HelpCircle
  };

  const LevelIcon = levelIcons[level];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        type="button"
      >
        <HelpCircle className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute z-50 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200 transform -translate-x-1/2 left-1/2 mt-2">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <LevelIcon className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${levelColors[level]}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </div>
            
            <div className="text-sm text-gray-700 leading-relaxed">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>
            
            {children && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {children}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HelpTooltip;