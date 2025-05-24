import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TrainTestSplit = ({ data, onSplitComplete, onNext, onPrevious, splitData }) => {
  const [splitRatio, setSplitRatio] = useState(0.8);
  const [stratify, setStratify] = useState(true);
  const [randomSeed, setRandomSeed] = useState(42);

  const handleSplit = () => {
    const totalRows = data.originalData.length;
    const trainSize = Math.floor(totalRows * splitRatio);
    const testSize = totalRows - trainSize;
    
    const splitResult = {
      trainSize,
      testSize,
      splitRatio,
      stratify,
      randomSeed,
      trainData: data.originalData.slice(0, trainSize),
      testData: data.originalData.slice(trainSize)
    };
    
    onSplitComplete(splitResult);
  };

  const chartData = [
    { name: 'Training', value: Math.floor(data?.originalData?.length * splitRatio) || 0, color: '#0ea5e9' },
    { name: 'Testing', value: Math.ceil(data?.originalData?.length * (1 - splitRatio)) || 0, color: '#64748b' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Train/Test Split</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Split your data into training and testing sets to evaluate model performance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Controls */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Split Configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Training Set Size: {Math.round(splitRatio * 100)}%
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.05"
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>50%</span>
                  <span>70%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="stratify"
                checked={stratify}
                onChange={(e) => setStratify(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="stratify" className="text-sm text-gray-700">
                Stratified Split (maintains class distribution)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Random Seed
              </label>
              <input
                type="number"
                value={randomSeed}
                onChange={(e) => setRandomSeed(parseInt(e.target.value))}
                className="input-field"
                placeholder="42"
              />
            </div>

            <button
              onClick={handleSplit}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>Apply Split</span>
            </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Split Visualization</h2>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Training</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{chartData[0].value}</p>
              <p className="text-sm text-blue-600">rows</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-800">Testing</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">{chartData[1].value}</p>
              <p className="text-sm text-gray-600">rows</p>
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
          disabled={!splitData}
          className={`btn-primary flex items-center space-x-2 ${
            !splitData ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Continue to Model Training</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TrainTestSplit;