import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Brain, Settings, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import HelpTooltip from '../HelpTooltip';

const ModelTraining = ({ data, selectedColumns, onModelTrained, onNext, onPrevious, model }) => {
  const [regularisation, setRegularisation] = useState('none');
  const [regularisationStrength, setRegularisationStrength] = useState(1.0);
  const [training, setTraining] = useState(false);
  const [trainedModel, setTrainedModel] = useState(null);

  const handleTraining = async () => {
    setTraining(true);
    
    // Simulate training delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock model coefficients with variation based on regularisation
    const mockCoefficients = selectedColumns.predictors.map((predictor, index) => {
      let coefficient;
      if (regularisation === 'none') {
        // No regularisation - potentially larger coefficients
        coefficient = (Math.random() - 0.5) * 6;
      } else if (regularisation === 'l1') {
        // L1 - some coefficients might be zero (sparse)
        coefficient = Math.random() < 0.3 ? 0 : (Math.random() - 0.5) * 3;
      } else {
        // L2 - smaller, more distributed coefficients  
        coefficient = (Math.random() - 0.5) * 2;
      }
      
      return {
        feature: predictor,
        coefficient: coefficient,
        importance: Math.abs(coefficient)
      };
    });
    
    // Accuracy varies based on regularisation choice
    let baseAccuracy = 0.85;
    if (regularisation === 'none' && selectedColumns.predictors.length > 5) {
      baseAccuracy = 0.78; // Might overfit with many features
    } else if (regularisation === 'l1' || regularisation === 'l2') {
      baseAccuracy = 0.87; // Better generalisation
    }
    
    const modelResult = {
      coefficients: mockCoefficients,
      regularisation,
      regularisationStrength: regularisation === 'none' ? 0 : regularisationStrength,
      intercept: Math.random() - 0.5,
      trainingAccuracy: baseAccuracy + Math.random() * 0.08,
      convergence: true,
      featureNames: selectedColumns.predictors,
      targetClasses: ['Class 0', 'Class 1']
    };
    
    setTrainedModel(modelResult);
    onModelTrained(modelResult);
    setTraining(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Help */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Model Training</h1>
          <HelpTooltip 
            title="Model Training - Core DA4 Competency" 
            level="intermediate"
            content={
              <div className="space-y-3">
                <p><strong>What is model training?</strong> Teaching the algorithm to find patterns in your data - a key DA4 skill!</p>
                <p><strong>Logistic Regression:</strong> Perfect for predicting categories (yes/no, pass/fail, etc.)</p>
                <p><strong>The process:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Algorithm:</strong> Finds the best line to separate your classes</li>
                  <li>• <strong>Coefficients:</strong> Show how much each feature influences the prediction</li>
                  <li>• <strong>Training:</strong> Uses your training data to learn these patterns</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 font-medium">🎓 DA4 Skill: Understanding how models learn from data is fundamental for data analysts!</p>
                </div>
              </div>
            }
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Configure and train your logistic regression model with professional regularisation options.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Training Configuration */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Training Configuration</h2>
            <HelpTooltip 
              title="Training Configuration Options" 
              level="beginner"
              content={
                <div className="space-y-2">
                  <p><strong>Think of these as training rules:</strong></p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>No Regularisation:</strong> Let the model learn freely</li>
                    <li>• <strong>L1 (Lasso):</strong> Encourage simple models by removing weak features</li>
                    <li>• <strong>L2 (Ridge):</strong> Prevent overconfident predictions</li>
                  </ul>
                  <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                    💡 <strong>New to ML?</strong> Start with "No Regularisation" to see how basic models work!
                  </p>
                </div>
              }
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Regularisation Type
              </label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="regularisation"
                    value="none"
                    checked={regularisation === 'none'}
                    onChange={(e) => setRegularisation(e.target.value)}
                    className="text-primary-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">No Regularisation</span>
                      <HelpTooltip 
                        title="No Regularisation - Simple & Direct" 
                        level="beginner"
                        content={
                          <div className="space-y-2">
                            <p><strong>What it means:</strong> The model learns without any restrictions.</p>
                            <p><strong>Pros:</strong></p>
                            <ul className="space-y-1 text-sm">
                              <li>• Simple to understand</li>
                              <li>• May achieve high training accuracy</li>
                              <li>• Good for learning fundamentals</li>
                            </ul>
                            <p><strong>Cons:</strong></p>
                            <ul className="space-y-1 text-sm">
                              <li>• Risk of overfitting with many features</li>
                              <li>• May not generalise well to new data</li>
                            </ul>
                            <p className="text-green-800 text-sm bg-green-50 p-2 rounded">
                              🌱 <strong>Perfect for beginners:</strong> Start here to understand basic model behaviour!
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Basic model without constraints - great for learning fundamentals
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="regularisation"
                    value="l1"
                    checked={regularisation === 'l1'}
                    onChange={(e) => setRegularisation(e.target.value)}
                    className="text-primary-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">L1 Regularisation (Lasso)</span>
                      <HelpTooltip 
                        title="L1 Regularisation - Feature Selection" 
                        level="intermediate"
                        content={
                          <div className="space-y-2">
                            <p><strong>What it does:</strong> Encourages the model to use fewer features by setting weak coefficients to zero.</p>
                            <p><strong>Think of it as:</strong> A strict teacher who says "only use the most important features!"</p>
                            <p><strong>Benefits:</strong></p>
                            <ul className="space-y-1 text-sm">
                              <li>• Automatic feature selection</li>
                              <li>• Simpler, more interpretable models</li>
                              <li>• Reduces overfitting</li>
                            </ul>
                            <p><strong>Use when:</strong> You have many features and want to identify the most important ones.</p>
                            <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                              🎯 <strong>DA4 Tip:</strong> Great for building parsimonious models that focus on key drivers!
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Automatic feature selection - identifies most important variables
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="regularisation"
                    value="l2"
                    checked={regularisation === 'l2'}
                    onChange={(e) => setRegularisation(e.target.value)}
                    className="text-primary-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">L2 Regularisation (Ridge)</span>
                      <HelpTooltip 
                        title="L2 Regularisation - Balanced Approach" 
                        level="intermediate"
                        content={
                          <div className="space-y-2">
                            <p><strong>What it does:</strong> Prevents any single feature from having too much influence by keeping coefficients small.</p>
                            <p><strong>Think of it as:</strong> A balanced teacher who says "everyone contributes, but no one dominates!"</p>
                            <p><strong>Benefits:</strong></p>
                            <ul className="space-y-1 text-sm">
                              <li>• Prevents overfitting</li>
                              <li>• More stable predictions</li>
                              <li>• Uses all features but balances their influence</li>
                            </ul>
                            <p><strong>Use when:</strong> You want stable, reliable models that generalise well.</p>
                            <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                              🎯 <strong>DA4 Tip:</strong> Most commonly used in professional practice - great default choice!
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Balanced approach - prevents overfitting whilst using all features
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {regularisation !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center space-x-2">
                    <span>Regularisation Strength: {regularisationStrength}</span>
                    <HelpTooltip 
                      title="Regularisation Strength" 
                      level="beginner"
                      content={
                        <div className="space-y-2">
                          <p><strong>Controls how strict the regularisation is:</strong></p>
                          <ul className="space-y-1 text-sm">
                            <li>• <strong>Low (0.1):</strong> Very gentle - model learns more freely</li>
                            <li>• <strong>Medium (1.0):</strong> Balanced approach - good starting point</li>
                            <li>• <strong>High (10):</strong> Very strict - heavily constrained model</li>
                          </ul>
                          <p className="text-green-800 text-sm bg-green-50 p-2 rounded">
                            💡 <strong>Start with 1.0</strong> and adjust based on results!
                          </p>
                        </div>
                      }
                    />
                  </div>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={regularisationStrength}
                  onChange={(e) => setRegularisationStrength(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0.1 (Gentle)</span>
                  <span>1.0 (Balanced)</span>
                  <span>10.0 (Strict)</span>
                </div>
              </div>
            )}

            {regularisation === 'none' && selectedColumns.predictors.length > 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Consider Regularisation</h4>
                    <p className="text-yellow-800 text-sm mt-1">
                      With {selectedColumns.predictors.length} features, regularisation can help prevent overfitting and improve generalisation to new data.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleTraining}
              disabled={training}
              className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                training ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>{training ? 'Training Model...' : 'Train Model'}</span>
            </button>
          </div>
        </div>

        {/* Training Results */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Training Results</h2>
            <HelpTooltip 
              title="Understanding Training Results" 
              level="beginner"
              content={
                <div className="space-y-2">
                  <p><strong>What to look for:</strong></p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Training Accuracy:</strong> How well model fits training data</li>
                    <li>• <strong>Coefficients:</strong> Show which features are most important</li>
                    <li>• <strong>Positive values:</strong> Increase probability of positive class</li>
                    <li>• <strong>Negative values:</strong> Decrease probability of positive class</li>
                  </ul>
                  <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                    📊 <strong>DA4 Tip:</strong> High training accuracy is good, but test accuracy is what really matters!
                  </p>
                </div>
              }
            />
          </div>
          
          {training ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Training your logistic regression model...</p>
              <p className="text-gray-500 text-sm mt-2">
                {regularisation === 'none' ? 'Training without regularisation' : 
                 regularisation === 'l1' ? 'Applying L1 regularisation for feature selection' :
                 'Applying L2 regularisation for balanced learning'}
              </p>
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
                    {trainedModel.coefficients.filter(c => Math.abs(c.coefficient) > 0.01).length}
                  </p>
                  <p className="text-sm text-blue-700">Active Features</p>
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
                <p className="text-xs text-gray-600 mt-2">
                  Positive coefficients increase the probability of the positive class, negative coefficients decrease it.
                </p>
              </div>

              {/* Regularisation Impact */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">🎓 DA4 Learning: Regularisation Impact</h4>
                <div className="text-blue-800 text-sm space-y-1">
                  {regularisation === 'none' && (
                    <>
                      <p>• <strong>No constraints:</strong> Model learned freely from training data</p>
                      <p>• <strong>Risk:</strong> May overfit if you have many features relative to data points</p>
                      <p>• <strong>Benefit:</strong> Simple, interpretable approach perfect for learning</p>
                    </>
                  )}
                  {regularisation === 'l1' && (
                    <>
                      <p>• <strong>Feature selection:</strong> {trainedModel.coefficients.filter(c => Math.abs(c.coefficient) < 0.01).length} features were effectively removed</p>
                      <p>• <strong>Sparsity:</strong> Model focuses on most important predictors only</p>
                      <p>• <strong>Benefit:</strong> Simpler, more interpretable model</p>
                    </>
                  )}
                  {regularisation === 'l2' && (
                    <>
                      <p>• <strong>Balanced influence:</strong> All features contribute but none dominate</p>
                      <p>• <strong>Stability:</strong> More stable predictions on new data</p>
                      <p>• <strong>Benefit:</strong> Good generalisation whilst using all information</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Click "Train Model" to start training</p>
              <p className="text-sm text-gray-400 mt-2">
                Choose your regularisation settings above, then train your model
              </p>
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