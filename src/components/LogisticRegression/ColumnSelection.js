import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Target, BarChart3, ArrowLeft, ArrowRight } from 'lucide-react';

const ColumnSelection = ({ data, selectedColumns, onColumnsSelected, onNext, onPrevious }) => {
  const [predictors, setPredictors] = useState(selectedColumns.predictors || []);
  const [target, setTarget] = useState(selectedColumns.target || '');
  const [columnStats, setColumnStats] = useState({});

  useEffect(() => {
    if (data && data.data) {
      const stats = {};
      data.meta.fields.forEach(field => {
        const values = data.data.map(row => row[field]).filter(v => v !== null && v !== undefined && v !== '');
        const uniqueValues = new Set(values);
        const isNumeric = values.every(v => !isNaN(parseFloat(v)));
        
        stats[field] = {
          type: isNumeric ? 'numeric' : 'categorical',
          uniqueCount: uniqueValues.size,
          totalCount: values.length,
          missingCount: data.data.length - values.length,
          sampleValues: [...uniqueValues].slice(0, 5)
        };
      });
      setColumnStats(stats);
    }
  }, [data]);

  const handlePredictorToggle = (column) => {
    const newPredictors = predictors.includes(column)
      ? predictors.filter(p => p !== column)
      : [...predictors, column];
    setPredictors(newPredictors);
  };

  const handleTargetSelect = (column) => {
    setTarget(column);
  };

  const handleContinue = () => {
    onColumnsSelected({ predictors, target });
    onNext();
  };

  const isTargetSuitableForLogistic = (column) => {
    if (!columnStats[column]) return false;
    const stats = columnStats[column];
    return stats.uniqueCount <= 5; // Reasonable for categorical target
  };

  const isPredictorSuitable = (column) => {
    if (!columnStats[column]) return false;
    const stats = columnStats[column];
    return stats.uniqueCount > 1; // Must have variation
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Columns</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your predictor variables and target variable for logistic regression analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Predictors Selection */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Predictor Variables</h2>
              <p className="text-sm text-gray-600">Features that will predict the outcome</p>
            </div>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Choose columns that might influence your target variable
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data?.meta.fields.filter(field => field !== target).map((column) => {
              const stats = columnStats[column];
              const isSelected = predictors.includes(column);
              const isSuitable = isPredictorSuitable(column);

              return (
                <div
                  key={column}
                  onClick={() => isSuitable && handlePredictorToggle(column)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isSuitable
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{column}</h3>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                  </div>
                  
                  {stats && (
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Type: {stats.type}</span>
                        <span>{stats.uniqueCount} unique values</span>
                      </div>
                      {stats.missingCount > 0 && (
                        <div className="text-yellow-600">
                          ⚠️ {stats.missingCount} missing values
                        </div>
                      )}
                      <div className="text-gray-500">
                        Sample: {stats.sampleValues.join(', ')}
                        {stats.sampleValues.length < stats.uniqueCount && '...'}
                      </div>
                    </div>
                  )}
                  
                  {!isSuitable && (
                    <div className="text-xs text-red-600 mt-2">
                      ⚠️ No variation - not suitable as predictor
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Selected {predictors.length} predictor{predictors.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Target Selection */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Target Variable</h2>
              <p className="text-sm text-gray-600">What you want to predict</p>
            </div>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Choose a binary or categorical outcome variable
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data?.meta.fields.map((column) => {
              const stats = columnStats[column];
              const isSelected = target === column;
              const isSuitable = isTargetSuitableForLogistic(column);

              return (
                <div
                  key={column}
                  onClick={() => isSuitable && handleTargetSelect(column)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : isSuitable
                      ? 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{column}</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  
                  {stats && (
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Type: {stats.type}</span>
                        <span>{stats.uniqueCount} unique values</span>
                      </div>
                      {stats.missingCount > 0 && (
                        <div className="text-yellow-600">
                          ⚠️ {stats.missingCount} missing values
                        </div>
                      )}
                      <div className="text-gray-500">
                        Values: {stats.sampleValues.join(', ')}
                        {stats.sampleValues.length < stats.uniqueCount && '...'}
                      </div>
                    </div>
                  )}
                  
                  {!isSuitable && stats && (
                    <div className="text-xs text-red-600 mt-2">
                      ⚠️ Too many unique values ({stats.uniqueCount}) for logistic regression
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {target && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Target selected: <strong>{target}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between max-w-6xl mx-auto">
        <button
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={predictors.length === 0 || !target}
          className={`btn-primary flex items-center space-x-2 ${
            predictors.length === 0 || !target 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          <span>Continue to Data Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Selection Summary */}
      {(predictors.length > 0 || target) && (
        <div className="card max-w-6xl mx-auto bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Predictors ({predictors.length})</h4>
              <div className="space-y-1">
                {predictors.map(pred => (
                  <span key={pred} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mr-2 mb-2">
                    {pred}
                  </span>
                ))}
                {predictors.length === 0 && (
                  <p className="text-gray-500 text-sm">No predictors selected</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Target</h4>
              {target ? (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {target}
                </span>
              ) : (
                <p className="text-gray-500 text-sm">No target selected</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelection;