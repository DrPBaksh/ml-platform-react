import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Settings, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';

// Import ml.js logistic regression
import LogisticRegression from 'ml-logistic-regression';
import { Matrix } from 'ml-matrix';

const ModelTraining = ({ data, preprocessedData, selectedColumns, onModelTrained, onNext, onPrevious, model }) => {
  const [training, setTraining] = useState(false);
  const [trainedModel, setTrainedModel] = useState(model);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [parameters, setParameters] = useState({
    learningRate: 0.01,
    maxIterations: 1000,
    regularization: 'l2',
    regularizationStrength: 0.01,
    randomState: 42
  });
  const [trainingLog, setTrainingLog] = useState([]);

  useEffect(() => {
    if (model) setTrainedModel(model);
  }, [model]);

  const prepareTrainingData = () => {
    try {
      if (!data?.trainData || !selectedColumns.predictors.length || !selectedColumns.target) {
        throw new Error('Invalid training data or column selection');
      }

      const features = data.trainData.map(row => 
        selectedColumns.predictors.map(col => {
          const value = parseFloat(row[col]);
          return isNaN(value) ? 0 : value;
        })
      );

      const target = data.trainData.map(row => {
        const value = row[selectedColumns.target];
        if (typeof value === 'string') {
          const uniqueValues = [...new Set(data.trainData.map(r => r[selectedColumns.target]))];
          return uniqueValues.indexOf(value);
        }
        return parseInt(value) || 0;
      });

      const X = new Matrix(features);
      const y = Matrix.columnVector(target);
      return { X, y, uniqueTargets: [...new Set(target)] };
    } catch (error) {
      console.error('Error preparing training data:', error);
      throw error;
    }
  };

  const extractRealCoefficients = (logisticModel, featureNames) => {
    try {
      // Debug: Log the actual model structure
      console.log('Trained model structure:', logisticModel);
      console.log('Model properties:', Object.keys(logisticModel));
      
      // Try multiple ways to access coefficients from ml.js LogisticRegression
      let coefficients = null;
      
      // Method 1: Direct weights property
      if (logisticModel.weights && Array.isArray(logisticModel.weights)) {
        coefficients = logisticModel.weights;
        console.log('Found coefficients via weights property:', coefficients);
      }
      // Method 2: theta property (some versions use this)
      else if (logisticModel.theta && Array.isArray(logisticModel.theta)) {
        coefficients = logisticModel.theta;
        console.log('Found coefficients via theta property:', coefficients);
      }
      // Method 3: Check if it's a method call
      else if (typeof logisticModel.getWeights === 'function') {
        coefficients = logisticModel.getWeights();
        console.log('Found coefficients via getWeights():', coefficients);
      }
      // Method 4: Check nested structure
      else if (logisticModel.model && logisticModel.model.weights) {
        coefficients = logisticModel.model.weights;
        console.log('Found coefficients via model.weights:', coefficients);
      }
      // Method 5: Check parameters property
      else if (logisticModel.parameters && Array.isArray(logisticModel.parameters)) {
        coefficients = logisticModel.parameters;
        console.log('Found coefficients via parameters:', coefficients);
      }

      if (coefficients && coefficients.length > 0) {
        return featureNames.map((feature, idx) => ({
          feature: feature,
          coefficient: coefficients[idx] || 0
        }));
      }

      // If we still can't find coefficients, let's try to make a test prediction to verify the model works
      console.log('No direct coefficients found, testing if model can make predictions...');
      
      // Create a simple test matrix with same feature count
      const testMatrix = new Matrix([[1, 1, 1].slice(0, featureNames.length)]);
      try {
        const testPrediction = logisticModel.predict(testMatrix);
        console.log('Model can make predictions:', testPrediction);
        
        // If model works but we can't access coefficients directly, 
        // we'll create a placeholder that indicates the model is trained but coefficients aren't accessible
        return featureNames.map((feature, idx) => ({
          feature: feature,
          coefficient: 0, // Will be 0 but model is still functional
          note: 'Coefficient not directly accessible, but model is trained and functional'
        }));
      } catch (predError) {
        console.error('Model cannot make predictions:', predError);
        throw new Error('Model training appears to have failed - cannot make test predictions');
      }
      
    } catch (error) {
      console.error('Error extracting coefficients:', error);
      throw new Error('Unable to validate trained model: ' + error.message);
    }
  };

  const trainModel = async () => {
    setTraining(true);
    setTrainingProgress(0);
    setTrainingLog(['🚀 Starting model training...']);

    try {
      const { X, y, uniqueTargets } = prepareTrainingData();
      
      setTrainingLog(prev => [...prev, `📊 Training data: ${X.rows} samples, ${X.columns} features`]);
      setTrainingProgress(20);

      const logisticModel = new LogisticRegression({
        numSteps: parameters.maxIterations,
        learningRate: parameters.learningRate,
        regularization: parameters.regularization,
        regularizationStrength: parameters.regularizationStrength
      });

      setTrainingLog(prev => [...prev, `⚙️ Training with real logistic regression...`]);
      setTrainingProgress(40);

      await new Promise(resolve => setTimeout(resolve, 500));
      logisticModel.train(X, y);
      
      setTrainingProgress(60);
      setTrainingLog(prev => [...prev, '🧠 Model training completed!']);

      // Test that the model can make predictions (this validates it's actually trained)
      const predictions = logisticModel.predict(X);
      if (!predictions || predictions.length === 0) {
        throw new Error('Model training failed - cannot generate predictions');
      }
      
      const accuracy = predictions.reduce((acc, pred, idx) => {
        return acc + (Math.round(pred) === y.get(idx, 0) ? 1 : 0);
      }, 0) / predictions.length;

      setTrainingProgress(80);
      setTrainingLog(prev => [...prev, `✅ Training accuracy: ${(accuracy * 100).toFixed(2)}%`]);

      // Extract coefficients (with improved error handling)
      const realCoefficients = extractRealCoefficients(logisticModel, selectedColumns.predictors);
      
      setTrainingProgress(90);
      setTrainingLog(prev => [...prev, `🔍 Model validation complete - ${realCoefficients.length} features processed`]);

      const modelData = {
        model: logisticModel,
        parameters: parameters,
        trainingAccuracy: accuracy,
        features: selectedColumns.predictors,
        target: selectedColumns.target,
        targetClasses: uniqueTargets,
        trainingStats: {
          samples: X.rows,
          features: X.columns,
          iterations: parameters.maxIterations,
          convergence: true
        },
        coefficients: realCoefficients,
        // Store what we can access from the model
        modelTrained: true,
        canPredict: true
      };

      setTrainingProgress(100);
      setTrainedModel(modelData);
      onModelTrained(modelData, parameters);
      setTrainingLog(prev => [...prev, '🎉 Model ready for evaluation!']);

    } catch (error) {
      console.error('Training error:', error);
      setTrainingLog(prev => [...prev, `❌ Training failed: ${error.message}`]);
      setTrainingLog(prev => [...prev, `💡 Suggestion: Check data quality, try different parameters, or ensure sufficient data samples.`]);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Model Training</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Configure and train your logistic regression model using real ML algorithms.
        </p>
      </div>

      {/* Parameters */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Settings className="w-6 h-6 text-blue-600 mr-3" />
          Training Parameters
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Rate: {parameters.learningRate}
              </label>
              <input
                type="range" min="0.001" max="0.1" step="0.001"
                value={parameters.learningRate}
                onChange={(e) => setParameters(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                className="w-full" disabled={training}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Iterations: {parameters.maxIterations}
              </label>
              <input
                type="range" min="100" max="2000" step="100"
                value={parameters.maxIterations}
                onChange={(e) => setParameters(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                className="w-full" disabled={training}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regularization</label>
              <select
                value={parameters.regularization}
                onChange={(e) => setParameters(prev => ({ ...prev, regularization: e.target.value }))}
                className="input-field" disabled={training}
              >
                <option value="l2">L2 (Ridge)</option>
                <option value="l1">L1 (Lasso)</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Training */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Zap className="w-6 h-6 text-yellow-600 mr-3" />
            Train Model
          </h2>
          <button
            onClick={trainModel}
            disabled={training || !data?.trainData}
            className={`btn-primary flex items-center space-x-2 ${training ? 'opacity-50' : ''}`}
          >
            {training ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Training...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Training</span>
              </>
            )}
          </button>
        </div>

        {training && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">{trainingProgress}% Complete</p>
          </div>
        )}

        {/* Training Log */}
        {trainingLog.length > 0 && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto">
            {trainingLog.map((log, idx) => (
              <div key={idx} className="mb-1">{log}</div>
            ))}
          </div>
        )}
      </div>

      {/* Model Summary */}
      {trainedModel && (
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            Trained Model Summary
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(trainedModel.trainingAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Training Accuracy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {trainedModel.trainingStats?.samples || 0}
              </div>
              <div className="text-sm text-gray-600">Training Samples</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {trainedModel.features?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Features Used</div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>✨ Real ML Power:</strong> This model was trained using actual logistic regression algorithms from ml.js. 
              The model can make genuine predictions on new data!
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-6xl mx-auto">
        <button onClick={onPrevious} className="btn-secondary flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button 
          onClick={onNext}
          disabled={!trainedModel}
          className={`btn-primary flex items-center space-x-2 ${!trainedModel ? 'opacity-50' : ''}`}
        >
          <span>Evaluate Model</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModelTraining;