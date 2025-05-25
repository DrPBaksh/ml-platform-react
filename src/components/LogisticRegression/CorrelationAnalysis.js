import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, ArrowRight, AlertTriangle, Info, TrendingUp, Eye, EyeOff } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';
import _ from 'lodash';

const CorrelationAnalysis = ({ data, selectedColumns, onNext, onPrevious, onColumnsRevised }) => {
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [selectedPredictor1, setSelectedPredictor1] = useState('');
  const [selectedPredictor2, setSelectedPredictor2] = useState('');
  const [scatterData, setScatterData] = useState([]);
  const [highlyCorrelated, setHighlyCorrelated] = useState([]);
  const [showTargetOverlay, setShowTargetOverlay] = useState(false);
  const [targetColoredData, setTargetColoredData] = useState([]);
  const [targetClasses, setTargetClasses] = useState([]);

  useEffect(() => {
    if (data && selectedColumns.predictors.length > 1) {
      calculateCorrelationMatrix();
    }
  }, [data, selectedColumns]);

  useEffect(() => {
    if (selectedPredictor1 && selectedPredictor2 && selectedPredictor1 !== selectedPredictor2 && data) {
      generateScatterData();
    }
  }, [selectedPredictor1, selectedPredictor2, data, showTargetOverlay]);

  const calculateCorrelationMatrix = () => {
    const numericPredictors = selectedColumns.predictors.filter(pred => {
      const values = data.data.map(row => parseFloat(row[pred])).filter(v => !isNaN(v));
      return values.length > data.data.length * 0.7; // At least 70% numeric values
    });

    if (numericPredictors.length < 2) return;

    const matrix = {};
    const correlations = [];
    const highCorr = [];

    // Calculate correlation for each pair
    numericPredictors.forEach((pred1, i) => {
      matrix[pred1] = {};
      numericPredictors.forEach((pred2, j) => {
        if (i <= j) {
          const correlation = calculatePearsonCorrelation(pred1, pred2);
          matrix[pred1][pred2] = correlation;
          if (i !== j) {
            matrix[pred2] = matrix[pred2] || {};
            matrix[pred2][pred1] = correlation;
            correlations.push({ pred1, pred2, correlation: Math.abs(correlation) });
            
            if (Math.abs(correlation) > 0.7) {
              highCorr.push({ pred1, pred2, correlation });
            }
          }
        }
      });
    });

    setCorrelationMatrix(matrix);
    setHighlyCorrelated(highCorr);
    
    // Set different default variables for X and Y axes
    if (numericPredictors.length >= 2) {
      setSelectedPredictor1(numericPredictors[0]);
      setSelectedPredictor2(numericPredictors[1]); // Different from predictor1
    }
  };

  const calculatePearsonCorrelation = (var1, var2) => {
    const pairs = data.data
      .map(row => [parseFloat(row[var1]), parseFloat(row[var2])])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    if (pairs.length < 3) return 0;

    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumXX = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumYY = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const generateScatterData = () => {
    // Get clean numeric data pairs
    const rawPairs = data.data
      .map((row, index) => ({
        x: parseFloat(row[selectedPredictor1]),
        y: parseFloat(row[selectedPredictor2]),
        target: row[selectedColumns.target],
        originalIndex: index
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));

    // Sort by X-axis values for better visualization
    const sortedPairs = rawPairs.sort((a, b) => a.x - b.x);

    if (showTargetOverlay && selectedColumns.target) {
      // Get unique target classes for color mapping
      const uniqueClasses = [...new Set(rawPairs.map(point => point.target))].sort();
      setTargetClasses(uniqueClasses);

      // Define colors for different classes (supports up to 8 classes)
      const classColors = [
        '#0ea5e9', // Blue
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#f87171', // Red
        '#a78bfa', // Violet
        '#34d399', // Green
        '#fb7185', // Pink
        '#fbbf24'  // Yellow
      ];

      // Group data by target class
      const groupedData = _.groupBy(sortedPairs, 'target');
      const coloredData = [];

      Object.keys(groupedData).forEach((targetClass, index) => {
        const classData = groupedData[targetClass].map(point => ({
          x: Number(point.x.toFixed(3)),
          y: Number(point.y.toFixed(3)),
          target: point.target,
          id: point.originalIndex,
          fill: classColors[index % classColors.length]
        }));
        coloredData.push({
          name: `${selectedColumns.target}: ${targetClass}`,
          data: classData,
          fill: classColors[index % classColors.length]
        });
      });

      setTargetColoredData(coloredData);
    } else {
      // Standard single-color scatter plot
      const cleanData = sortedPairs.map((point, index) => ({
        x: Number(point.x.toFixed(3)),
        y: Number(point.y.toFixed(3)),
        target: point.target,
        id: point.originalIndex
      }));
      
      setScatterData(cleanData);
    }
    
    console.log(`Generated ${sortedPairs.length} data points for scatter plot`);
  };

  const removeHighlyCorrelatedVariable = (pred1, pred2) => {
    const updatedPredictors = selectedColumns.predictors.filter(p => p !== pred2);
    onColumnsRevised({
      ...selectedColumns,
      predictors: updatedPredictors
    });
  };

  const handlePredictor1Change = (value) => {
    setSelectedPredictor1(value);
    if (value === selectedPredictor2) {
      const numericPredictors = selectedColumns.predictors.filter(pred => {
        const values = data.data.map(row => parseFloat(row[pred])).filter(v => !isNaN(v));
        return values.length > data.data.length * 0.7;
      });
      const alternativePredictor = numericPredictors.find(pred => pred !== value);
      if (alternativePredictor) {
        setSelectedPredictor2(alternativePredictor);
      }
    }
  };

  const handlePredictor2Change = (value) => {
    setSelectedPredictor2(value);
    if (value === selectedPredictor1) {
      const numericPredictors = selectedColumns.predictors.filter(pred => {
        const values = data.data.map(row => parseFloat(row[pred])).filter(v => !isNaN(v));
        return values.length > data.data.length * 0.7;
      });
      const alternativePredictor = numericPredictors.find(pred => pred !== value);
      if (alternativePredictor) {
        setSelectedPredictor1(alternativePredictor);
      }
    }
  };

  const numericPredictors = selectedColumns.predictors.filter(pred => {
    const values = data.data.map(row => parseFloat(row[pred])).filter(v => !isNaN(v));
    return values.length > data.data.length * 0.7;
  });

  // Enhanced custom tooltip for scatter plot
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{selectedPredictor1}: {data.x}</p>
          <p className="font-medium text-gray-900">{selectedPredictor2}: {data.y}</p>
          {showTargetOverlay && selectedColumns.target && (
            <p className="font-medium text-gray-900">{selectedColumns.target}: {data.target}</p>
          )}
          <p className="text-sm text-gray-600">Data Point #{data.id + 1}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Correlation Analysis</h1>
          <HelpTooltip 
            title="Understanding Variable Relationships - DA4 Core Skill" 
            level="intermediate"
            content={
              <div className="space-y-3">
                <p><strong>What is Correlation?</strong> Correlation measures how strongly two variables are related. Values range from -1 to +1.</p>
                <p><strong>Interpretation:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>+1:</strong> Perfect positive relationship</li>
                  <li>• <strong>0:</strong> No linear relationship</li>
                  <li>• <strong>-1:</strong> Perfect negative relationship</li>
                  <li>• <strong>>0.7:</strong> Strong correlation (may cause multicollinearity)</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-blue-800 font-medium">🎓 DA4 Skill: Identifying and handling multicollinearity is crucial for building reliable predictive models!</p>
                </div>
              </div>
            }
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Examine relationships between your predictor variables to identify potential multicollinearity issues.
        </p>
      </div>

      {numericPredictors.length < 2 ? (
        <div className="card max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">Insufficient Numeric Variables</h3>
              <p className="text-yellow-700 text-sm mt-1">
                You need at least 2 numeric predictor variables to perform correlation analysis. 
                Most of your selected predictors appear to be categorical.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Correlation Matrix */}
          {correlationMatrix && (
            <div className="card max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Correlation Matrix</h2>
                <HelpTooltip 
                  title="Reading the Correlation Matrix" 
                  level="beginner"
                  content={
                    <div className="space-y-2">
                      <p>Each cell shows the correlation between two variables:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• <span className="text-green-600 font-medium">Green:</span> Weak correlation (&lt;0.3)</li>
                        <li>• <span className="text-yellow-600 font-medium">Yellow:</span> Moderate correlation (0.3-0.7)</li>
                        <li>• <span className="text-red-600 font-medium">Red:</span> Strong correlation (&gt;0.7)</li>
                      </ul>
                    </div>
                  }
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {numericPredictors.map(pred => (
                        <th key={pred} className="p-2 text-xs font-medium text-gray-600 transform -rotate-45">
                          {pred}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {numericPredictors.map(pred1 => (
                      <tr key={pred1}>
                        <td className="p-2 text-xs font-medium text-gray-600 max-w-24 truncate">
                          {pred1}
                        </td>
                        {numericPredictors.map(pred2 => {
                          const corr = correlationMatrix[pred1]?.[pred2] || 0;
                          const absCorr = Math.abs(corr);
                          const bgColor = absCorr > 0.7 ? 'bg-red-100' : 
                                         absCorr > 0.3 ? 'bg-yellow-100' : 'bg-green-100';
                          const textColor = absCorr > 0.7 ? 'text-red-800' : 
                                           absCorr > 0.3 ? 'text-yellow-800' : 'text-green-800';
                          
                          return (
                            <td key={pred2} className={`p-2 text-center text-xs font-medium ${bgColor} ${textColor}`}>
                              {corr.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* High Correlation Warnings */}
          {highlyCorrelated.length > 0 && (
            <div className="card max-w-4xl mx-auto bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-3">High Correlation Detected!</h3>
                  <p className="text-red-700 text-sm mb-4">
                    These variable pairs have correlation above 0.7, which may cause multicollinearity issues in your model:
                  </p>
                  
                  <div className="space-y-3">
                    {highlyCorrelated.map((pair, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {pair.pred1} ↔ {pair.pred2}
                            </p>
                            <p className="text-sm text-gray-600">
                              Correlation: {pair.correlation.toFixed(3)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeHighlyCorrelatedVariable(pair.pred1, pair.pred2)}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            Remove {pair.pred2}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>DA4 Tip:</strong> When variables are highly correlated, removing one can improve model stability 
                      and interpretability without losing much predictive power.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scatter Plot */}
          <div className="card max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Variable Relationship Visualization</h2>
              <HelpTooltip 
                title="Interpreting Scatter Plots" 
                level="beginner"
                content={
                  <div className="space-y-2">
                    <p>Scatter plots show the relationship between two variables:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Upward trend:</strong> Positive correlation</li>
                      <li>• <strong>Downward trend:</strong> Negative correlation</li>
                      <li>• <strong>No pattern:</strong> No correlation</li>
                      <li>• <strong>Tight line:</strong> Strong correlation</li>
                      <li>• <strong>Scattered points:</strong> Weak correlation</li>
                    </ul>
                    {selectedColumns.target && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <p><strong>Target Overlay:</strong> Color-code points by target variable to visualize classification patterns!</p>
                      </div>
                    )}
                  </div>
                }
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis Variable</label>
                <select
                  value={selectedPredictor1}
                  onChange={(e) => handlePredictor1Change(e.target.value)}
                  className="input-field"
                >
                  {numericPredictors.map(pred => (
                    <option key={pred} value={pred}>{pred}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis Variable</label>
                <select
                  value={selectedPredictor2}
                  onChange={(e) => handlePredictor2Change(e.target.value)}
                  className="input-field"
                >
                  {numericPredictors.map(pred => (
                    <option key={pred} value={pred}>{pred}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Variable Overlay Toggle */}
            {selectedColumns.target && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowTargetOverlay(!showTargetOverlay)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        showTargetOverlay 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-blue-600 border border-blue-300'
                      }`}
                    >
                      {showTargetOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="font-medium">
                        {showTargetOverlay ? 'Hide' : 'Show'} Target Variable Overlay
                      </span>
                    </button>
                    <div className="text-sm text-blue-800">
                      <strong>Target:</strong> {selectedColumns.target}
                    </div>
                  </div>
                  <HelpTooltip 
                    title="Target Variable Overlay" 
                    level="intermediate"
                    content={
                      <div className="space-y-2">
                        <p>This feature colors data points by their target variable value, helping you:</p>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Visualize class separation:</strong> See how well predictors separate different classes</li>
                          <li>• <strong>Identify decision boundaries:</strong> Understand where classification occurs</li>
                          <li>• <strong>Assess feature quality:</strong> Good predictors show clear color clustering</li>
                          <li>• <strong>Spot patterns:</strong> Discover non-linear relationships in classification problems</li>
                        </ul>
                        <div className="bg-blue-50 p-2 rounded mt-2">
                          <p className="text-blue-800 text-sm"><strong>DA4 Tip:</strong> This visualization helps you understand your classification problem before building the model!</p>
                        </div>
                      </div>
                    }
                  />
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Note:</strong> This overlay may help you visualize how your predictors relate to the classification problem - 
                  look for clear separation between different colored clusters!
                </p>
              </div>
            )}

            {/* Warning if same variable selected */}
            {selectedPredictor1 === selectedPredictor2 && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-yellow-800 text-sm font-medium">
                    Same variable selected for both axes - this will always show perfect correlation!
                  </p>
                </div>
              </div>
            )}

            {((scatterData.length > 0 && !showTargetOverlay) || (targetColoredData.length > 0 && showTargetOverlay)) && selectedPredictor1 !== selectedPredictor2 && (
              <>
                {/* Data Information */}
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <p className="text-blue-800 text-sm">
                        Displaying {showTargetOverlay 
                          ? targetColoredData.reduce((sum, group) => sum + group.data.length, 0)
                          : scatterData.length
                        } data points (sorted by {selectedPredictor1} for better visualization)
                      </p>
                    </div>
                    {showTargetOverlay && targetClasses.length > 0 && (
                      <div className="text-sm text-blue-800">
                        <strong>{targetClasses.length} classes detected:</strong> {targetClasses.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        name={selectedPredictor1}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <YAxis 
                        dataKey="y" 
                        name={selectedPredictor2}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {showTargetOverlay && selectedColumns.target ? (
                        <>
                          <Legend />
                          {targetColoredData.map((group, index) => (
                            <Scatter
                              key={index}
                              name={group.name}
                              data={group.data}
                              fill={group.fill}
                              fillOpacity={0.7}
                              stroke={group.fill}
                              strokeWidth={1}
                            />
                          ))}
                        </>
                      ) : (
                        <Scatter 
                          data={scatterData}
                          fill="#0ea5e9" 
                          fillOpacity={0.7}
                          stroke="#0284c7"
                          strokeWidth={1}
                        />
                      )}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                
                {correlationMatrix && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-gray-900">
                        Correlation: {(correlationMatrix[selectedPredictor1]?.[selectedPredictor2] || 0).toFixed(3)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.abs(correlationMatrix[selectedPredictor1]?.[selectedPredictor2] || 0) > 0.7 
                        ? "Strong correlation - consider removing one variable"
                        : Math.abs(correlationMatrix[selectedPredictor1]?.[selectedPredictor2] || 0) > 0.3
                        ? "Moderate correlation - monitor for multicollinearity"
                        : "Weak correlation - variables are largely independent"}
                    </p>
                    {showTargetOverlay && selectedColumns.target && (
                      <p className="text-sm text-blue-600 mt-2">
                        <strong>Classification Insight:</strong> Look for clear separation between different colored clusters - 
                        this indicates how well these predictors distinguish between target classes.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
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
          className="btn-primary flex items-center space-x-2"
        >
          <span>Continue to Exploratory Data Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;