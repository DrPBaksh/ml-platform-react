import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BarChart, Shuffle, Info, AlertTriangle, CheckCircle, Upload, Zap } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';
import _ from 'lodash';

const TrainTestSplit = ({ data, selectedColumns, onSplitComplete, onNext, onPrevious, onSkipToEvaluation, splitData, model }) => {
  const [splitRatio, setSplitRatio] = useState(0.8);
  const [stratify, setStratify] = useState(false);
  const [randomSeed, setRandomSeed] = useState(42);
  const [splitPreview, setSplitPreview] = useState(null);
  const [splitMethod, setSplitMethod] = useState('random');

  useEffect(() => {
    if (data && selectedColumns.target) {
      generateSplitPreview();
    }
  }, [data, selectedColumns, splitRatio, stratify, randomSeed, splitMethod]);

  const generateSplitPreview = () => {
    if (!data || !selectedColumns.target) return;

    const totalRows = data.data.length;
    const trainSize = Math.floor(totalRows * splitRatio);
    const testSize = totalRows - trainSize;

    // Analyze target distribution
    const targetDistribution = _.countBy(data.data, selectedColumns.target);
    const targetValues = Object.keys(targetDistribution);
    
    // Check if stratification is recommended
    const minClassSize = Math.min(...Object.values(targetDistribution));
    const isImbalanced = minClassSize < totalRows * 0.1; // Less than 10% of total
    const shouldStratify = targetValues.length <= 10 && targetValues.length > 1;

    let trainDistribution = {};
    let testDistribution = {};

    if (stratify && shouldStratify) {
      // Calculate stratified distribution
      targetValues.forEach(value => {
        const classCount = targetDistribution[value];
        const trainClassSize = Math.floor(classCount * splitRatio);
        const testClassSize = classCount - trainClassSize;
        
        trainDistribution[value] = trainClassSize;
        testDistribution[value] = testClassSize;
      });
    } else {
      // For preview, estimate random distribution
      targetValues.forEach(value => {
        const proportion = targetDistribution[value] / totalRows;
        trainDistribution[value] = Math.round(trainSize * proportion);
        testDistribution[value] = Math.round(testSize * proportion);
      });
    }

    const preview = {
      totalRows,
      trainSize,
      testSize,
      splitRatio,
      targetDistribution,
      trainDistribution,
      testDistribution,
      isImbalanced,
      shouldStratify,
      recommendStratify: shouldStratify && isImbalanced
    };

    setSplitPreview(preview);

    // Generate actual split data
    const actualSplit = performActualSplit(preview);
    onSplitComplete(actualSplit, { splitRatio, stratify, randomSeed, splitMethod });
  };

  const performActualSplit = (preview) => {
    const rows = [...data.data];
    
    // Shuffle with seed for reproducibility
    const shuffled = _.shuffle(rows);
    
    let trainData, testData;

    if (stratify && preview.shouldStratify) {
      // Stratified split
      const groupedData = _.groupBy(shuffled, selectedColumns.target);
      trainData = [];
      testData = [];

      Object.keys(groupedData).forEach(targetValue => {
        const classData = groupedData[targetValue];
        const trainClassSize = Math.floor(classData.length * splitRatio);
        
        trainData.push(...classData.slice(0, trainClassSize));
        testData.push(...classData.slice(trainClassSize));
      });
    } else {
      // Random split
      const trainSize = Math.floor(rows.length * splitRatio);
      trainData = shuffled.slice(0, trainSize);
      testData = shuffled.slice(trainSize);
    }

    return {
      trainData,
      testData,
      trainSize: trainData.length,
      testSize: testData.length,
      splitRatio,
      stratified: stratify && preview.shouldStratify,
      randomSeed,
      splitMethod,
      metadata: {
        trainDistribution: _.countBy(trainData, selectedColumns.target),
        testDistribution: _.countBy(testData, selectedColumns.target),
        originalDistribution: preview.targetDistribution
      }
    };
  };

  const handleSplitRatioChange = (e) => {
    const value = parseFloat(e.target.value);
    setSplitRatio(value);
  };

  const canProceed = splitPreview && splitPreview.trainSize > 5 && splitPreview.testSize > 5;
  const canSkipToEvaluation = model && splitData;

  return (
    <div className="space-y-6">
      {/* Header with Help */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Train/Test Split</h1>
          <HelpTooltip 
            title="Train/Test Split - Fundamental DA4 Concept" 
            level="intermediate"
            content={
              <div className="space-y-3">
                <p><strong>Why split your data?</strong> To evaluate how well your model works on new, unseen data!</p>
                <p><strong>The process:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Training Set:</strong> Teach the model patterns (usually 70-80%)</li>
                  <li>• <strong>Test Set:</strong> Evaluate performance on unseen data (20-30%)</li>
                  <li>• <strong>Never mix them!</strong> Test data must stay "blind" to the model</li>
                </ul>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ Critical Rule: Never use test data for training - this causes overfitting!</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 font-medium">🎓 DA4 Skill: Proper data splitting is essential for reliable model evaluation!</p>
                </div>
              </div>
            }
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Split your data into training and testing sets to properly evaluate model performance.
        </p>
      </div>

      {/* Skip to Evaluation Option */}
      {canSkipToEvaluation && (
        <div className="card max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-900">Skip Training & Load Model</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-purple-800">
              You have a trained model loaded and data split ready. You can skip the training steps and go directly to model evaluation.
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">Current Status:</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✅ Data uploaded and columns selected</li>
                    <li>✅ Train/test split ready ({splitData.trainSize} train, {splitData.testSize} test)</li>
                    <li>✅ Model loaded and ready for evaluation</li>
                  </ul>
                </div>
                <button
                  onClick={onSkipToEvaluation}
                  className="btn-primary bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Skip to Evaluation</span>
                </button>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This will skip correlation analysis, EDA, preprocessing, and training steps. 
                  Use this option when you have a pre-trained model to evaluate on your current data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Shuffle className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Split Configuration</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Split Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split Ratio (Training %)
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0.6"
                max="0.9"
                step="0.05"
                value={splitRatio}
                onChange={handleSplitRatioChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>60%</span>
                <span className="font-semibold text-primary-600">
                  {Math.round(splitRatio * 100)}% Training / {Math.round((1 - splitRatio) * 100)}% Testing
                </span>
                <span>90%</span>
              </div>
            </div>
          </div>

          {/* Stratification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stratification
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={stratify}
                  onChange={(e) => setStratify(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">Maintain target proportions in both sets</span>
              </label>
              
              {splitPreview?.recommendStratify && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-yellow-800 text-sm font-medium">
                      Stratification recommended - your target classes are imbalanced
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Random Seed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Random Seed
            </label>
            <input
              type="number"
              value={randomSeed}
              onChange={(e) => setRandomSeed(parseInt(e.target.value) || 42)}
              className="input-field"
              min="1"
              max="9999"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ensures reproducible results (common values: 42, 123, 2024)
            </p>
          </div>
        </div>
      </div>

      {/* Split Preview */}
      {splitPreview && (
        <div className="card max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Split Preview</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dataset Size Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Dataset Sizes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rows:</span>
                  <span className="font-medium">{splitPreview.totalRows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Training Set:</span>
                  <span className="font-medium">{splitPreview.trainSize.toLocaleString()} ({Math.round(splitPreview.splitRatio * 100)}%)</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Test Set:</span>
                  <span className="font-medium">{splitPreview.testSize.toLocaleString()} ({Math.round((1 - splitPreview.splitRatio) * 100)}%)</span>
                </div>
              </div>
              
              {/* Visual representation */}
              <div className="mt-4">
                <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${splitPreview.splitRatio * 100}%` }}
                  ></div>
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(1 - splitPreview.splitRatio) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Training</span>
                  <span>Testing</span>
                </div>
              </div>
            </div>

            {/* Target Distribution Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Target Distribution</h3>
              <div className="space-y-3">
                {Object.keys(splitPreview.targetDistribution).map(targetValue => {
                  const originalCount = splitPreview.targetDistribution[targetValue];
                  const originalPercent = ((originalCount / splitPreview.totalRows) * 100).toFixed(1);
                  const trainCount = splitPreview.trainDistribution[targetValue] || 0;
                  const testCount = splitPreview.testDistribution[targetValue] || 0;
                  
                  return (
                    <div key={targetValue} className="border-b border-gray-200 pb-2">
                      <div className="font-medium text-gray-900 mb-1">
                        {targetValue} ({originalPercent}% of total)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600">Train:</span>
                          <span>{trainCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Test:</span>
                          <span>{testCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {splitPreview.isImbalanced && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Imbalanced Dataset Detected</h4>
                  <p className="text-yellow-800 text-sm mt-1">
                    Your target variable has uneven class distribution. Consider:
                  </p>
                  <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                    <li>• ✅ Using stratified splitting (recommended)</li>
                    <li>• Using appropriate evaluation metrics (precision, recall, F1-score)</li>
                    <li>• Considering resampling techniques during preprocessing</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success confirmation */}
          {canProceed && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Split Configuration Ready</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Your data will be split into {splitPreview.trainSize} training samples and {splitPreview.testSize} test samples.
                    {stratify && splitPreview.shouldStratify && " Stratification will maintain class balance."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Warnings */}
      {!canProceed && splitPreview && (
        <div className="card max-w-4xl mx-auto bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Split Configuration Issues</h3>
              <div className="space-y-1 text-sm text-red-800">
                {splitPreview.trainSize <= 5 && <div>• Training set too small ({splitPreview.trainSize} rows) - need at least 6</div>}
                {splitPreview.testSize <= 5 && <div>• Test set too small ({splitPreview.testSize} rows) - need at least 6</div>}
                <p className="mt-2 text-red-700">Adjust your split ratio to ensure both sets have sufficient data.</p>
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
          <span>Continue to Correlation Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TrainTestSplit;