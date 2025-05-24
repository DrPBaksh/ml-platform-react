import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, TrendingUp, Target, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelEvaluation = ({ model, data, onEvaluationComplete, onNext, onPrevious, evaluation }) => {
  const [metrics, setMetrics] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);

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