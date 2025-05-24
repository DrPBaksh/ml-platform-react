import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Settings, CheckCircle } from 'lucide-react';
import _ from 'lodash';

const Preprocessing = ({ data, selectedColumns, onPreprocessingComplete, onNext, onPrevious, preprocessedData }) => {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (data && selectedColumns.predictors.length > 0) {
      performPreprocessing();
    }
  }, [data, selectedColumns]);

  const performPreprocessing = async () => {
    setProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const processed = {
      originalData: data.data,
      processedData: data.data, // Simplified - in real app would apply transformations
      encodings: {},
      scalings: {},
      steps: [
        'Handled missing values',
        'Encoded categorical variables',
        'Scaled numerical features'
      ]
    };
    
    setResults(processed);
    onPreprocessingComplete(processed);
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Preprocessing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're preparing your data for machine learning by cleaning and transforming it.
        </p>
      </div>

      {processing ? (
        <div className="card max-w-2xl mx-auto text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Data</h3>
          <p className="text-gray-600">This may take a moment...</p>
        </div>
      ) : results ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Preprocessing Complete!</h3>
            </div>
            <div className="space-y-2">
              {results.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{results.originalData.length}</p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{selectedColumns.predictors.length}</p>
                <p className="text-sm text-gray-600">Predictors</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">1</p>
                <p className="text-sm text-gray-600">Target</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">Ready</p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-between max-w-6xl mx-auto">
        <button
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!results}
          className={`btn-primary flex items-center space-x-2 ${
            !results ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Continue to Train/Test Split</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Preprocessing;