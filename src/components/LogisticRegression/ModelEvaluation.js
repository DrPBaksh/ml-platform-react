import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, Target, Info, Code, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Matrix } from 'ml-matrix';

const ModelEvaluation = ({ 
  model, 
  data, 
  onEvaluationComplete, 
  onNext, 
  onPrevious, 
  evaluation,
  selectedColumns,
  correlationResults,
  preprocessingInfo,
  trainTestSplit,
  modelParameters,
  fileName 
}) => {
  const [metrics, setMetrics] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);
  const [categoryConfusionMatrix, setCategoryConfusionMatrix] = useState(null);
  const [showPythonPrompt, setShowPythonPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [evaluationError, setEvaluationError] = useState(null);

  useEffect(() => {
    if (model && data) {
      performRealEvaluation();
    }
  }, [model, data]);

  // Get actual category names from the training data
  const getCategoryNames = () => {
    if (!data?.trainData || !selectedColumns?.target) return ['Class 0', 'Class 1'];
    
    const uniqueValues = [...new Set(data.trainData.map(row => row[selectedColumns.target]))];
    
    // If string values, return them directly
    if (typeof uniqueValues[0] === 'string') {
      return uniqueValues.sort();
    }
    
    // If numeric, check if we have targetClasses mapping
    if (model?.targetClasses && model.targetClasses.length > 0) {
      return model.targetClasses;
    }
    
    // Default to generic names
    return uniqueValues.map(val => String(val)).sort();
  };

  const performRealEvaluation = () => {
    try {
      setEvaluationError(null);
      
      if (!model.model) {
        throw new Error('No trained model available for evaluation');
      }
      
      if (!data.testData || data.testData.length === 0) {
        throw new Error('No test data available for evaluation');
      }

      // Prepare test data in the same format as training
      const testFeatures = data.testData.map(row => 
        selectedColumns.predictors.map(col => {
          const value = parseFloat(row[col]);
          return isNaN(value) ? 0 : value;
        })
      );

      const testTarget = data.testData.map(row => {
        const value = row[selectedColumns.target];
        if (typeof value === 'string') {
          const uniqueValues = [...new Set([...data.trainData, ...data.testData].map(r => r[selectedColumns.target]))];
          return uniqueValues.indexOf(value);
        }
        return parseInt(value) || 0;
      });

      // Create test matrices
      const X_test = new Matrix(testFeatures);
      const y_test = testTarget;

      // Get real predictions from the trained model
      const predictions = model.model.predict(X_test);
      
      if (!predictions || predictions.length === 0) {
        throw new Error('Model failed to generate predictions on test data');
      }
      
      const predictedClasses = predictions.map(p => Math.round(p));

      // Calculate real metrics
      let tp = 0, tn = 0, fp = 0, fn = 0;
      
      // Also create category-based confusion matrix
      const categoryNames = getCategoryNames();
      const categoryMatrix = {};
      categoryNames.forEach(actualCat => {
        categoryMatrix[actualCat] = {};
        categoryNames.forEach(predCat => {
          categoryMatrix[actualCat][predCat] = 0;
        });
      });
      
      for (let i = 0; i < y_test.length; i++) {
        const actual = y_test[i];
        const predicted = predictedClasses[i];
        
        // Standard binary confusion matrix
        if (actual === 1 && predicted === 1) tp++;
        else if (actual === 0 && predicted === 0) tn++;
        else if (actual === 0 && predicted === 1) fp++;
        else if (actual === 1 && predicted === 0) fn++;

        // Category-based confusion matrix
        const actualCategory = categoryNames[actual] || `Class ${actual}`;
        const predictedCategory = categoryNames[predicted] || `Class ${predicted}`;
        categoryMatrix[actualCategory][predictedCategory]++;
      }

      // Calculate performance metrics
      const accuracy = (tp + tn) / (tp + tn + fp + fn);
      const precision = tp / (tp + fp) || 0;
      const recall = tp / (tp + fn) || 0;
      const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

      // Calculate a more realistic AUC estimate based on the confusion matrix
      const specificity = tn / (tn + fp) || 0;
      const sensitivity = recall; // Same as recall/true positive rate
      const auc = (sensitivity + specificity) / 2;

      const realMetrics = {
        accuracy,
        precision,
        recall,
        f1Score,
        auc
      };

      const realConfusionMatrix = {
        truePositive: tp,
        falsePositive: fp,
        trueNegative: tn,
        falseNegative: fn
      };

      console.log('Real evaluation metrics:', realMetrics);
      console.log('Real confusion matrix:', realConfusionMatrix);
      console.log('Category confusion matrix:', categoryMatrix);

      setMetrics(realMetrics);
      setConfusionMatrix(realConfusionMatrix);
      setCategoryConfusionMatrix(categoryMatrix);
      onEvaluationComplete({ metrics: realMetrics, confusionMatrix: realConfusionMatrix });

    } catch (error) {
      console.error('Error in real evaluation:', error);
      setEvaluationError(error.message);
      
      // Instead of falling back to fake data, show the error and suggestions
      setMetrics(null);
      setConfusionMatrix(null);
      setCategoryConfusionMatrix(null);
    }
  };

  const generatePythonPrompt = () => {
    const correlationText = correlationResults?.highlyCorrelated?.length > 0 
      ? `High correlations found: ${correlationResults.highlyCorrelated.map(pair => `${pair.pred1}-${pair.pred2} (${pair.correlation.toFixed(3)})`).join(', ')}`
      : 'No high correlations (>0.7) detected';

    return `I analyzed "${fileName || 'my_dataset'}.csv" using a web ML platform.

Dataset: ${selectedColumns?.predictors?.join(', ') || '[predictors]'} → ${selectedColumns?.target || '[target]'}
Records: ${data?.data?.length || '[count]'}

Analysis Results:
- ${correlationText}  
- Split: ${trainTestSplit?.ratio || 80}/${100-(trainTestSplit?.ratio || 80)}% train/test
- Algorithm: Logistic Regression
- Params: LR=${modelParameters?.learningRate || 0.01}, iterations=${modelParameters?.maxIterations || 1000}

Performance:
- Accuracy: ${metrics ? (metrics.accuracy * 100).toFixed(1) : '[accuracy]'}%
- Precision: ${metrics ? (metrics.precision * 100).toFixed(1) : '[precision]'}%  
- Recall: ${metrics ? (metrics.recall * 100).toFixed(1) : '[recall]'}%
- F1: ${metrics ? (metrics.f1Score * 100).toFixed(1) : '[f1]'}%

Please recreate this ML workflow in Python with scikit-learn including:
1. Data loading & EDA 2. Correlation analysis 3. Train/test split 4. Logistic regression
5. Evaluation metrics 6. Feature importance 7. Best practices & comments

Also suggest improvements, alternatives, and advanced techniques for DA4 learning.

IMPORTANT: Review license/privacy laws before sharing actual data with AI assistants.`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePythonPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const getPerformanceColor = (value) => {
    if (value >= 0.9) return 'text-green-600';
    if (value >= 0.8) return 'text-blue-600';
    if (value >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBg = (value) => {
    if (value >= 0.9) return 'bg-green-50 border-green-200';
    if (value >= 0.8) return 'bg-blue-50 border-blue-200';
    if (value >= 0.7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Show error state if evaluation failed
  if (evaluationError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Evaluation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unable to evaluate model performance.
          </p>
        </div>

        <div className="card max-w-4xl mx-auto bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-medium text-red-900 mb-2">Evaluation Error</h3>
              <p className="text-red-800 mb-4">{evaluationError}</p>
              
              <div className="bg-red-100 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">💡 Troubleshooting Steps:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Ensure your model was properly trained</li>
                  <li>• Check that test data has the same format as training data</li>
                  <li>• Verify all required predictor columns are present</li>
                  <li>• Try retraining the model with different parameters</li>
                  <li>• Ensure sufficient data samples for evaluation</li>
                </ul>
              </div>
              
              <button 
                onClick={performRealEvaluation}
                className="btn-primary mt-4 flex items-center space-x-2"
              >
                <span>Retry Evaluation</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between max-w-6xl mx-auto">
          <button onClick={onPrevious} className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button 
            onClick={onNext} 
            disabled={true}
            className="btn-primary flex items-center space-x-2 opacity-50"
          >
            <span>Make Predictions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Evaluating real model performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Evaluation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real performance metrics from your trained logistic regression model.
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {[
          { name: 'Accuracy', value: metrics.accuracy, description: 'Overall correctness' },
          { name: 'Precision', value: metrics.precision, description: 'Positive prediction accuracy' },
          { name: 'Recall', value: metrics.recall, description: 'True positive detection rate' },
          { name: 'F1-Score', value: metrics.f1Score, description: 'Balanced precision & recall' }
        ].map((metric, index) => (
          <div key={index} className={`card ${getPerformanceBg(metric.value)}`}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${getPerformanceColor(metric.value)}`}>
                {(metric.value * 100).toFixed(1)}%
              </p>
              <p className="font-semibold text-gray-900 mt-2">{metric.name}</p>
              <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Real vs Mock Indicator */}
      <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-900">✨ 100% Real Model Evaluation</p>
            <p className="text-green-800 text-sm">
              These metrics are calculated from your actual trained model's predictions on test data - no mock results!
            </p>
          </div>
        </div>
      </div>

      {/* Confusion Matrices */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Technical Confusion Matrix (TP/FP/TN/FN) */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Confusion Matrix</h2>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
              <p className="text-2xl font-bold text-green-700">{confusionMatrix.truePositive}</p>
              <p className="text-sm text-green-600">True Positive</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
              <p className="text-2xl font-bold text-red-700">{confusionMatrix.falsePositive}</p>
              <p className="text-sm text-red-600">False Positive</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
              <p className="text-2xl font-bold text-red-700">{confusionMatrix.falseNegative}</p>
              <p className="text-sm text-red-600">False Negative</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
              <p className="text-2xl font-bold text-green-700">{confusionMatrix.trueNegative}</p>
              <p className="text-sm text-green-600">True Negative</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Technical view: TP/FP/FN/TN format
          </p>
        </div>

        {/* Category-Based Confusion Matrix */}
        {categoryConfusionMatrix && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Confusion Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-gray-700">Actual ↓ / Predicted →</th>
                    {getCategoryNames().map(category => (
                      <th key={category} className="text-center p-2 font-medium text-gray-700">
                        {category}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categoryConfusionMatrix).map(([actualCategory, predictions]) => (
                    <tr key={actualCategory} className="border-b">
                      <td className="p-2 font-medium text-gray-900">{actualCategory}</td>
                      {Object.entries(predictions).map(([predCategory, count]) => {
                        const isCorrect = actualCategory === predCategory;
                        return (
                          <td key={predCategory} className={`text-center p-2 font-bold ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Category view: Actual category names
            </p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Model Performance</p>
              <p className="text-sm text-gray-600">
                {(metrics.accuracy * 100).toFixed(1)}% accuracy on test data.
                {metrics.accuracy >= 0.85 ? ' Excellent!' : metrics.accuracy >= 0.75 ? ' Good performance.' : ' Consider improvements.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Precision vs Recall</p>
              <p className="text-sm text-gray-600">
                {metrics.precision > metrics.recall ? 
                  'More conservative - avoids false positives.' :
                  'More sensitive - catches most true cases.'}
              </p>
            </div>
          </div>

          {categoryConfusionMatrix && (
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Category Performance</p>
                <p className="text-sm text-gray-600">
                  Check the category confusion matrix above to see how well your model distinguishes between {getCategoryNames().join(' and ')}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Importance from Real Model */}
      {model?.coefficients && (
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Feature Importance (Real Coefficients)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={model.coefficients.map(c => ({ ...c, absCoeff: Math.abs(c.coefficient) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [value.toFixed(3), 'Coefficient']} />
                <Bar dataKey="absCoeff" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Real coefficients from your trained model showing feature influence.
          </p>
        </div>
      )}

      {/* Python Generation Section */}
      <div className="card max-w-6xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <Code className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Taking It Further with Python</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-700">
                <strong>Privacy Notice:</strong> Review license agreements and data protection laws before sharing data with AI assistants.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">LLM Prompt Template (with your real results)</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPythonPrompt(!showPythonPrompt)}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                <Code className="w-4 h-4" />
                <span>{showPythonPrompt ? 'Hide' : 'Show'} Prompt</span>
              </button>
              {showPythonPrompt && (
                <button
                  onClick={copyToClipboard}
                  className={`btn-primary text-sm flex items-center space-x-2 ${copied ? 'bg-green-600' : ''}`}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {showPythonPrompt && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generatePythonPrompt()}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between max-w-6xl mx-auto">
        <button onClick={onPrevious} className="btn-secondary flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button onClick={onNext} className="btn-primary flex items-center space-x-2">
          <span>Make Predictions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModelEvaluation;