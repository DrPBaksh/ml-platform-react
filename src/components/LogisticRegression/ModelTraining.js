import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Brain, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelTraining = ({ data, selectedColumns, onModelTrained, onNext, onPrevious, model }) => {
  const [regularization, setRegularization] = useState('l2');
  const [regularizationStrength, setRegularizationStrength] = useState(1.0);
  const [training, setTraining] = useState(false);
  const [trainedModel, setTrainedModel] = useState(null);

  const handleTraining = async () => {
    setTraining(true);
    
    // Simulate training delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock model coefficients
    const mockCoefficients = selectedColumns.predictors.map((predictor, index) => ({
      feature: predictor,
      coefficient: (Math.random() - 0.5) * 4, // Random coefficient between -2 and 2
      importance: Math.random()
    }));
    
    const modelResult = {
      coefficients: mockCoefficients,
      regularization,
      regularizationStrength,
      intercept: Math.random() - 0.5,
      trainingAccuracy: 0.85 + Math.random() * 0.1, // Mock accuracy between 85-95%
      convergence: true
    };
    
    setTrainedModel(modelResult);
    onModelTrained(modelResult);
    setTraining(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Training</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Configure and train your logistic regression model.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Training Configuration */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Training Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Regularization Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="regularization"
                    value="l1"
                    checked={regularization === 'l1'}
                    onChange={(e) => setRegularization(e.target.value)}
                    className="text-primary-600"
                  />
                  <div>
                    <span className="font-medium">L1 (Lasso)</span>
                    <p className="text-sm text-gray-600">Feature selection, sparse coefficients</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="regularization"
                    value="l2"
                    checked={regularization === 'l2'}
                    onChange={(e) => setRegularization(e.target.value)}
                    className="text-primary-600"
                  />
                  <div>
                    <span className="font-medium">L2 (Ridge)</span>
                    <p className="text-sm text-gray-600">Prevents overfitting, smaller coefficients</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Regularization Strength: {regularizationStrength}
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={regularizationStrength}
                onChange={(e) => setRegularizationStrength(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0.1 (Less)</span>
                <span>5.0 (More)</span>
                <span>10.0 (Maximum)</span>
              </div>
            </div>

            <button
              onClick={handleTraining}
              disabled={training}
              className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                training ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>{training ? 'Training...' : 'Train Model'}</span>
            </button>
          </div>
        </div>

        {/* Training Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Training Results</h2>
          
          {training ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Training your model...</p>
            </div>
          ) : trainedModel ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {(trainedModel.trainingAccuracy * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-700">Training Accuracy</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {trainedModel.coefficients.length}
                  </p>
                  <p className="text-sm text-blue-700">Features</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Coefficients</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainedModel.coefficients}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="coefficient" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Click "Train Model" to start training</p>
            </div>
          )}
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
          disabled={!trainedModel}
          className={`btn-primary flex items-center space-x-2 ${
            !trainedModel ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Continue to Evaluation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModelTraining;