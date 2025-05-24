import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Target, Layers, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';

const ColumnSelection = ({ data, selectedColumns, onColumnsSelected, onNext, onPrevious }) => {
  const [predictors, setPredictors] = useState(selectedColumns.predictors || []);
  const [target, setTarget] = useState(selectedColumns.target || '');
  const [columnStats, setColumnStats] = useState({});
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    if (data && data.meta.fields) {
      analyzeColumns();
    }
  }, [data]);

  useEffect(() => {
    onColumnsSelected({ predictors, target });
  }, [predictors, target, onColumnsSelected]);

  const analyzeColumns = () => {
    const fields = data.meta.fields;
    const rows = data.data;
    const stats = {};
    const recs = {};

    fields.forEach(field => {
      const values = rows.map(row => row[field]).filter(val => val !== '' && val != null);
      const uniqueValues = [...new Set(values)];
      const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
      const isNumeric = numericValues.length > values.length * 0.7;
      const missingPercentage = ((rows.length - values.length) / rows.length) * 100;

      stats[field] = {
        totalValues: values.length,
        uniqueCount: uniqueValues.length,
        isNumeric,
        missingPercentage: missingPercentage.toFixed(1),
        sampleValues: uniqueValues.slice(0, 5),
        dataType: isNumeric ? 'Numeric' : 'Categorical'
      };

      // Generate recommendations
      if (uniqueValues.length === 2 && !isNumeric) {
        recs[field] = {
          forTarget: 'excellent',
          reason: 'Binary categorical - perfect for logistic regression target'
        };
      } else if (uniqueValues.length <= 10 && !isNumeric) {
        recs[field] = {
          forTarget: 'good',
          reason: 'Few categories - suitable for classification target'
        };
      } else if (isNumeric && uniqueValues.length > 10) {
        recs[field] = {
          forPredictor: 'excellent',
          reason: 'Numeric with good variation - ideal predictor'
        };
      } else if (!isNumeric && uniqueValues.length <= 20) {
        recs[field] = {
          forPredictor: 'good',
          reason: 'Categorical with reasonable categories - good predictor'
        };
      } else if (uniqueValues.length > 50) {
        recs[field] = {
          warning: 'High cardinality - may need preprocessing'
        };
      }

      if (missingPercentage > 20) {
        recs[field] = {
          ...recs[field],
          warning: `${missingPercentage}% missing values - consider preprocessing`
        };
      }
    });

    setColumnStats(stats);
    setRecommendations(recs);
  };

  const handlePredictorToggle = (column) => {
    if (predictors.includes(column)) {
      setPredictors(predictors.filter(p => p !== column));
    } else {
      setPredictors([...predictors, column]);
    }
  };

  const handleTargetSelect = (column) => {
    setTarget(column === target ? '' : column);
  };

  const getRecommendationBadge = (column) => {
    const rec = recommendations[column];
    if (!rec) return null;

    if (rec.forTarget === 'excellent') {
      return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Perfect Target</span>;
    }
    if (rec.forTarget === 'good') {
      return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Good Target</span>;
    }
    if (rec.forPredictor === 'excellent') {
      return <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Great Predictor</span>;
    }
    if (rec.forPredictor === 'good') {
      return <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Good Predictor</span>;
    }
    if (rec.warning) {
      return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Needs Attention</span>;
    }
    return null;
  };

  const canProceed = predictors.length > 0 && target !== '';

  return (
    <div className="space-y-6">
      {/* Header with Help */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Select Your Variables</h1>
          <HelpTooltip 
            title="Variable Selection - Critical DA4 Skill" 
            level="intermediate"
            content={
              <div className="space-y-3">
                <p><strong>What you're doing:</strong> Choosing which columns to use for prediction - this determines your entire analysis!</p>
                <p><strong>Two types of variables:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Target Variable:</strong> What you want to predict (outcome)</li>
                  <li>• <strong>Predictor Variables:</strong> What you use to make predictions (features)</li>
                </ul>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ Common Mistake: Including the target as a predictor (data leakage!)</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 font-medium">🎓 DA4 Skill: Variable selection directly impacts model quality and business value!</p>
                </div>
              </div>
            }
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your target variable (what to predict) and predictor variables (what to use for predictions).
        </p>
      </div>

      {/* Target Variable Selection */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">Target Variable</h2>
          <HelpTooltip 
            title="Choosing Your Target Variable" 
            level="beginner"
            content={
              <div className="space-y-3">
                <p><strong>What is a target variable?</strong> The outcome you want to predict or classify.</p>
                <p><strong>For logistic regression, choose:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Binary:</strong> Yes/No, Pass/Fail, Buy/Don't Buy</li>
                  <li>• <strong>Categories:</strong> Small number of groups (Low/Medium/High)</li>
                </ul>
                <p><strong>Examples:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• Will customer buy? (Yes/No)</li>
                  <li>• Email spam or not? (Spam/Not Spam)</li>
                  <li>• Risk level? (Low/Medium/High)</li>
                </ul>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium">💡 Look for our recommendations marked with colored badges!</p>
                </div>
              </div>
            }
          />
        </div>
        
        <p className="text-gray-600 mb-4">
          Select the column you want to predict. For logistic regression, this should be categorical with 2-10 categories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.meta?.fields?.map(column => (
            <div
              key={column}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                target === column
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
              }`}
              onClick={() => handleTargetSelect(column)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{column}</h3>
                {target === column && <CheckCircle className="w-5 h-5 text-red-600" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{columnStats[column]?.dataType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unique:</span>
                  <span className="font-medium">{columnStats[column]?.uniqueCount}</span>
                </div>
                {columnStats[column]?.missingPercentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Missing:</span>
                    <span className="font-medium text-yellow-600">{columnStats[column]?.missingPercentage}%</span>
                  </div>
                )}
                
                {/* Sample Values */}
                <div className="text-xs text-gray-500">
                  <div className="font-medium mb-1">Sample values:</div>
                  <div className="flex flex-wrap gap-1">
                    {columnStats[column]?.sampleValues?.map((val, idx) => (
                      <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {String(val).length > 10 ? String(val).substring(0, 10) + '...' : val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendation Badge */}
                <div className="pt-2">
                  {getRecommendationBadge(column)}
                  {recommendations[column]?.reason && (
                    <div className="text-xs text-gray-600 mt-1">
                      {recommendations[column].reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {target && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Target Selected: {target}</h4>
                <p className="text-green-800 text-sm mt-1">
                  Great choice! This will be your prediction outcome.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predictor Variables Selection */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Layers className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Predictor Variables</h2>
          <HelpTooltip 
            title="Choosing Predictor Variables" 
            level="beginner"
            content={
              <div className="space-y-3">
                <p><strong>What are predictors?</strong> The variables you use to make predictions about your target.</p>
                <p><strong>Good predictors should:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Be related</strong> to your target outcome</li>
                  <li>• <strong>Have variation</strong> - not all the same value</li>
                  <li>• <strong>Be available</strong> when making real predictions</li>
                  <li>• <strong>Not leak information</strong> about the target</li>
                </ul>
                <p><strong>Example:</strong> To predict "Will buy product?"</p>
                <ul className="space-y-1 text-sm">
                  <li>✅ <strong>Good:</strong> Age, Income, Previous Purchases</li>
                  <li>❌ <strong>Bad:</strong> Purchase Receipt Number (comes after purchase!)</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 font-medium">🎯 DA4 Tip: Select 3-10 predictors to start. You can always refine later!</p>
                </div>
              </div>
            }
          />
        </div>
        
        <p className="text-gray-600 mb-4">
          Select multiple columns to use as predictors. Choose variables that might influence your target outcome.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.meta?.fields?.filter(col => col !== target).map(column => (
            <div
              key={column}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                predictors.includes(column)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => handlePredictorToggle(column)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{column}</h3>
                {predictors.includes(column) && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{columnStats[column]?.dataType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unique:</span>
                  <span className="font-medium">{columnStats[column]?.uniqueCount}</span>
                </div>
                {columnStats[column]?.missingPercentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Missing:</span>
                    <span className="font-medium text-yellow-600">{columnStats[column]?.missingPercentage}%</span>
                  </div>
                )}
                
                {/* Sample Values */}
                <div className="text-xs text-gray-500">
                  <div className="font-medium mb-1">Sample values:</div>
                  <div className="flex flex-wrap gap-1">
                    {columnStats[column]?.sampleValues?.map((val, idx) => (
                      <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {String(val).length > 10 ? String(val).substring(0, 10) + '...' : val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendation Badge */}
                <div className="pt-2">
                  {getRecommendationBadge(column)}
                  {recommendations[column]?.reason && (
                    <div className="text-xs text-gray-600 mt-1">
                      {recommendations[column].reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {predictors.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  {predictors.length} Predictor{predictors.length > 1 ? 's' : ''} Selected
                </h4>
                <p className="text-blue-800 text-sm mt-1">
                  {predictors.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {canProceed && (
        <div className="card max-w-4xl mx-auto bg-green-50 border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Ready to Proceed!</h3>
              <div className="space-y-2 text-sm text-green-800">
                <div>
                  <strong>Target Variable:</strong> {target} (what we'll predict)
                </div>
                <div>
                  <strong>Predictor Variables:</strong> {predictors.join(', ')} (what we'll use to predict)
                </div>
                <div className="bg-green-100 p-3 rounded-lg mt-3">
                  <p className="font-medium">🎓 DA4 Learning Checkpoint:</p>
                  <p>You've successfully identified your variables! This foundation determines your entire analysis success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {!canProceed && (
        <div className="card max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Complete Your Selection</h3>
              <div className="space-y-1 text-sm text-yellow-800">
                {!target && <div>• Please select a target variable (what to predict)</div>}
                {predictors.length === 0 && <div>• Please select at least one predictor variable</div>}
                {predictors.length === 1 && <div>• Consider selecting 2-3 more predictors for better predictions</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
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
          disabled={!canProceed}
          className={`btn-primary flex items-center space-x-2 ${
            !canProceed ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Continue to Train/Test Split</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ColumnSelection;