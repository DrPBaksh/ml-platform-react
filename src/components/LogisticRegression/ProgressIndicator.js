import React from 'react';
import { Check, Circle } from 'lucide-react';

const ProgressIndicator = ({ steps, currentStep, onStepClick, canProceedToStep }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Progress</h2>
      
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = step.id <= currentStep || (step.id === currentStep + 1 && canProceedToStep(step.id));
            
            return (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-4 left-12 w-full h-0.5 bg-gray-200">
                    <div 
                      className={`h-full transition-all duration-500 ease-in-out ${
                        isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
                
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`group relative flex flex-col items-center transition-all duration-200 ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : isCurrent
                        ? 'bg-white border-primary-500 text-primary-500'
                        : isClickable
                        ? 'bg-white border-gray-300 text-gray-500 group-hover:border-primary-300'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4 fill-current" />
                    )}
                  </span>
                  
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isCurrent
                          ? 'text-primary-600'
                          : isCompleted
                          ? 'text-gray-900'
                          : isClickable
                          ? 'text-gray-700 group-hover:text-primary-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </p>
                    <p
                      className={`text-xs mt-1 transition-colors duration-200 ${
                        isCurrent
                          ? 'text-primary-500'
                          : isCompleted
                          ? 'text-gray-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressIndicator;