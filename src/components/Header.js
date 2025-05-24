import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';

const Header = ({ onBackToHome, showBackButton }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackToHome}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="ML Platform Logo" 
                className="w-10 h-10 rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl" style={{display: 'none'}}>
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ML Platform</h1>
                <p className="text-xs text-gray-500">DA4 Apprenticeship Tool</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;