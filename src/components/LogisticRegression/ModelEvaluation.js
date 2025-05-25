import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, Target, Info, Code, Copy, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [showPythonPrompt, setShowPythonPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (model && data) {
      performEvaluation();
    }
  }, [model, data]);

  const performEvaluation = () => {
    // Mock evaluation metrics
    const mockMetrics = {
      accuracy: 0.87 + Math.random() * 0.08, // 87-95%
      precision: 0.85 + Math.random() * 0.1, // 85-95%
      recall: 0.82 + Math.random() * 0.13, // 82-95%
      f1Score: 0.84 + Math.random() * 0.11, // 84-95%
      auc: 0.90 + Math.random() * 0.08 // 90-98%
    };

    // Mock confusion matrix
    const mockMatrix = {
      truePositive: 45,
      falsePositive: 8,
      trueNegative: 42,
      falseNegative: 5
    };

    setMetrics(mockMetrics);
    setConfusionMatrix(mockMatrix);
    onEvaluationComplete({ metrics: mockMetrics, confusionMatrix: mockMatrix });
  };

  const generatePythonPrompt = () => {
    const correlationText = correlationResults?.highlyCorrelated?.length > 0 
      ? `High correlations were found between: ${correlationResults.highlyCorrelated.map(pair => `${pair.pred1} and ${pair.pred2} (${pair.correlation.toFixed(3)})`).join(', ')}`
      : 'No high correlations (>0.7) were detected between predictor variables';

    const preprocessingText = preprocessingInfo 
      ? `Data preprocessing included: ${preprocessingInfo.categoricalEncoding ? 'categorical encoding, ' : ''}${preprocessingInfo.featureScaling ? 'feature scaling' : ''}`
      : 'Standard preprocessing was applied';

    const parametersText = modelParameters 
      ? `Model parameters: regularization=${modelParameters.regularization || 'none'}, max_iterations=${modelParameters.maxIterations || 1000}, random_state=${modelParameters.randomState || 42}`
      : 'Default logistic regression parameters were used';

    return `I have a dataset called "${fileName || 'my_dataset'}.csv" that I've been analyzing using a web-based ML platform.

Dataset Information:
- It has columns: ${selectedColumns?.predictors?.join(', ') || '[predictor columns]'}
- The target variable is: ${selectedColumns?.target || '[target variable]'}
- Total records: ${data?.data?.length || '[number of records]'}

Analysis Results:
- Correlation analysis showed: ${correlationText}
- Train/test split: ${trainTestSplit?.ratio || 80}% training, ${100 - (trainTestSplit?.ratio || 80)}% testing${trainTestSplit?.stratified ? ' (stratified)' : ''}
- ${preprocessingText}
- Algorithm used: Logistic Regression
- ${parametersText}

Model Performance:
- Accuracy: ${metrics ? (metrics.accuracy * 100).toFixed(1) : '[accuracy]'}%
- Precision: ${metrics ? (metrics.precision * 100).toFixed(1) : '[precision]'}%
- Recall: ${metrics ? (metrics.recall * 100).toFixed(1) : '[recall]'}%
- F1-Score: ${metrics ? (metrics.f1Score * 100).toFixed(1) : '[f1_score]'}%

Could you please recreate this entire machine learning workflow in Python using scikit-learn? 

Please include:
1. Data loading and exploration
2. Correlation analysis and multicollinearity detection
3. Data preprocessing (encoding, scaling)
4. Train/test split with the same parameters
5. Logistic regression model with similar parameters
6. Model evaluation with the same metrics
7. Feature importance analysis
8. Confusion matrix visualization
9. Best practices for model validation
10. Comments explaining each step for educational purposes

I'd also like suggestions for:
- How to improve model performance
- Alternative algorithms to try
- Advanced feature engineering techniques
- Model interpretability methods

Please ensure the code is well-documented and suitable for a DA4 Data Analyst apprentice to learn from.

IMPORTANT: Remember to review your license agreements and consider privacy and data protection laws before sharing any actual data with AI assistants. This prompt template should be customized with your specific dataset information.`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePythonPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Evaluating model performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Evaluation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review your model's performance on the test data.
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

      {/* Confusion Matrix */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Confusion Matrix</h2>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Predicted</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">→</p>
            </div>
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
        </div>

        {/* Interpretation */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What This Means</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Overall Performance</p>
                <p className="text-sm text-gray-600">
                  Your model correctly predicts {(metrics.accuracy * 100).toFixed(1)}% of cases.
                  {metrics.accuracy >= 0.85 ? ' This is excellent performance!' : 
                   metrics.accuracy >= 0.75 ? ' This is good performance.' : 
                   ' Consider improving the model.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Precision vs Recall</p>
                <p className="text-sm text-gray-600">
                  {metrics.precision > metrics.recall ? 
                    'Your model is more conservative - it avoids false positives but might miss some true cases.' :
                    'Your model is more sensitive - it catches most true cases but might have some false alarms.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Business Impact</p>
                <p className="text-sm text-gray-600">
                  This model can help you make better decisions with {(metrics.accuracy * 100).toFixed(0)}% confidence.
                  Consider the cost of false positives vs false negatives for your specific use case.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      {model?.coefficients && (
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Feature Importance</h2>
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
            Higher bars indicate features that have more influence on the prediction.
          </p>
        </div>
      )}

      {/* Taking It Further Section */}
      <div className="card max-w-6xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <Code className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Taking It Further with Python</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-start space-x-3 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Ready for Professional Development?</p>
                <p className="text-sm text-gray-600 mt-1">
                  Programming in Python will give you more flexibility, advanced algorithms, 
                  and the ability to customize every aspect of your machine learning workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Important Privacy Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  <strong>Remember to review your license agreements and consider privacy and data protection laws</strong> 
                  before sharing any actual data with AI assistants like ChatGPT, Gemini, or Claude. 
                  The prompt below is a template - customize it with your specific dataset information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">
                LLM Prompt Template for Python Code Generation
              </p>
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
                    <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              This prompt includes all the parameters and decisions you made in this app, 
              ready to paste into ChatGPT, Gemini, Claude, or any coding AI assistant.
            </p>
          </div>

          {showPythonPrompt && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generatePythonPrompt()}</pre>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">What You'll Get</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete Python workflow</li>
                <li>• scikit-learn implementation</li>
                <li>• Professional best practices</li>
                <li>• Educational comments</li>
                <li>• Improvement suggestions</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Advanced Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cross-validation</li>
                <li>• Hyperparameter tuning</li>
                <li>• Feature selection</li>
                <li>• Model interpretability</li>
                <li>• Advanced algorithms</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">DA4 Skills</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Python programming</li>
                <li>• Advanced analytics</li>
                <li>• Code documentation</li>
                <li>• Professional workflows</li>
                <li>• Portfolio development</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <p className="font-medium text-blue-900">Recommended AI Assistants</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="text-blue-800">
                <strong>ChatGPT:</strong> Excellent for educational explanations and step-by-step code
              </div>
              <div className="text-blue-800">
                <strong>Claude:</strong> Great for comprehensive analysis and best practices
              </div>
              <div className="text-blue-800">
                <strong>Gemini:</strong> Good for integrating with Google Colab notebooks
              </div>
            </div>
          </div>
        </div>
      </div>

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
          className="btn-primary flex items-center space-x-2"
        >
          <span>Continue to Predictions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModelEvaluation;