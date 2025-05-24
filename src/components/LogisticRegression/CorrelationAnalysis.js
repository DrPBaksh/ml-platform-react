import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ArrowRight, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import HelpTooltip from '../HelpTooltip';
import _ from 'lodash';

const CorrelationAnalysis = ({ data, selectedColumns, onNext, onPrevious, onColumnsRevised }) => {
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [selectedPredictor1, setSelectedPredictor1] = useState('');
  const [selectedPredictor2, setSelectedPredictor2] = useState('');
  const [scatterData, setScatterData] = useState([]);
  const [highlyCorrelated, setHighlyCorrelated] = useState([]);

  useEffect(() => {
    if (data && selectedColumns.predictors.length > 1) {
      calculateCorrelationMatrix();
    }
  }, [data, selectedColumns]);

  useEffect(() => {
    if (selectedPredictor1 && selectedPredictor2 && data) {
      generateScatterData();
    }
  }, [selectedPredictor1, selectedPredictor2, data]);

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
    
    if (numericPredictors.length >= 2) {
      setSelectedPredictor1(numericPredictors[0]);
      setSelectedPredictor2(numericPredictors[1]);
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
    const scatter = data.data
      .map(row => ({
        x: parseFloat(row[selectedPredictor1]),
        y: parseFloat(row[selectedPredictor2])
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));
    
    setScatterData(scatter);
  };

  const removeHighlyCorrelatedVariable = (pred1, pred2) => {
    const updatedPredictors = selectedColumns.predictors.filter(p => p !== pred2);
    onColumnsRevised({
      ...selectedColumns,
      predictors: updatedPredictors
    });
  };

  const numericPredictors = selectedColumns.predictors.filter(pred => {
    const values = data.data.map(row => parseFloat(row[pred])).filter(v => !isNaN(v));
    return values.length > data.data.length * 0.7;
  });

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
                  </div>
                }
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis Variable</label>
                <select
                  value={selectedPredictor1}
                  onChange={(e) => setSelectedPredictor1(e.target.value)}
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
                  onChange={(e) => setSelectedPredictor2(e.target.value)}
                  className="input-field"
                >
                  {numericPredictors.map(pred => (
                    <option key={pred} value={pred}>{pred}</option>
                  ))}
                </select>
              </div>
            </div>

            {scatterData.length > 0 && (
              <>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" name={selectedPredictor1} />
                      <YAxis dataKey="y" name={selectedPredictor2} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter fill="#0ea5e9" />
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
          <span>Continue to Train/Test Split</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;