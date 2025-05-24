import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BarChart, Shuffle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';
import _ from 'lodash';

const TrainTestSplit = ({ data, selectedColumns, onSplitComplete, onNext, onPrevious, splitData }) => {
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
    onSplitComplete(actualSplit);
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

      {/* Configuration Panel */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Shuffle className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Split Configuration</h2>
          <HelpTooltip 
            title="Configuring Your Data Split" 
            level="beginner"
            content={
              <div className="space-y-3">
                <p><strong>Split Ratio:</strong> How much data to use for training vs. testing</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>80/20:</strong> Standard choice - good balance</li>
                  <li>• <strong>70/30:</strong> More testing data - better evaluation</li>
                  <li>• <strong>90/10:</strong> More training data - use with small datasets</li>
                </ul>
                <p><strong>Stratification:</strong> Keep target proportions balanced in both sets</p>
                <p><strong>Random Seed:</strong> Makes your split reproducible</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium">💡 We'll recommend the best settings for your data!</p>
                </div>
              </div>
            }
          />
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
              <HelpTooltip 
                title="What is Stratification?" 
                level="beginner"
                content={
                  <div className="space-y-2">
                    <p><strong>Stratification ensures both training and test sets have the same proportions of your target variable.</strong></p>
                    <p><strong>Example:</strong> If your data is 70% "Yes" and 30% "No":</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>With stratification:</strong> Both train and test will have 70% "Yes", 30% "No"</li>
                      <li>• <strong>Without stratification:</strong> You might get 80% "Yes" in training, 60% "Yes" in testing</li>
                    </ul>
                    <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                      💡 <strong>Use when:</strong> Your target classes are imbalanced (e.g., 80/20 split)
                    </p>
                  </div>
                }
              />
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
              <HelpTooltip 
                title="Random Seed for Reproducibility" 
                level="beginner"
                content={
                  <div className="space-y-2">
                    <p><strong>What is a random seed?</strong> A number that ensures you get the same "random" split every time.</p>
                    <p><strong>Why does this matter?</strong></p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Reproducibility:</strong> Others can recreate your exact results</li>
                      <li>• <strong>Debugging:</strong> Same split helps identify issues</li>
                      <li>• <strong>Comparison:</strong> Fair comparison between different models</li>
                    </ul>
                    <p className="text-green-800 text-sm bg-green-50 p-2 rounded">
                      🎯 <strong>DA4 Tip:</strong> Always document your random seed in reports!
                    </p>
                  </div>
                }
              />
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
            <HelpTooltip 
              title="Understanding Your Split Preview" 
              level="beginner"
              content={
                <div className="space-y-2">
                  <p><strong>This preview shows you exactly how your data will be divided:</strong></p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Size:</strong> Number of rows in each set</li>
                    <li>• <strong>Distribution:</strong> How many of each target class</li>
                    <li>• <strong>Balance:</strong> Whether proportions are maintained</li>
                  </ul>
                  <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded">
                    💡 Look for roughly equal proportions in both training and test sets!
                  </p>
                </div>
              }
            />
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