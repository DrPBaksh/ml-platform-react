import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { ArrowLeft, ArrowRight, AlertTriangle, Info, Edit3 } from 'lucide-react';
import _ from 'lodash';

const ExploratoryDataAnalysis = ({ data, selectedColumns, onEdaComplete, onColumnsRevised, onNext, onPrevious, edaResults }) => {
  const [analysis, setAnalysis] = useState(null);
  const [showRevision, setShowRevision] = useState(false);
  const [revisedColumns, setRevisedColumns] = useState(selectedColumns);

  useEffect(() => {
    if (data && selectedColumns.predictors.length > 0 && selectedColumns.target) {
      performAnalysis();
    }
  }, [data, selectedColumns]);

  const performAnalysis = () => {
    const analysisResults = {
      targetDistribution: analyzeTargetDistribution(),
      predictorStats: analyzePredictors(),
      correlations: analyzeCorrelations(),
      warnings: generateWarnings()
    };
    
    setAnalysis(analysisResults);
    onEdaComplete(analysisResults);
  };

  const analyzeTargetDistribution = () => {
    const targetValues = data.data.map(row => row[selectedColumns.target]);
    const distribution = _.countBy(targetValues);
    
    return Object.entries(distribution).map(([value, count]) => ({
      name: String(value),
      count,
      percentage: ((count / data.data.length) * 100).toFixed(1)
    }));
  };

  const analyzePredictors = () => {
    return selectedColumns.predictors.map(predictor => {
      const values = data.data.map(row => row[predictor]).filter(v => v !== null && v !== undefined && v !== '');
      const uniqueCount = new Set(values).size;
      const isNumeric = values.every(v => !isNaN(parseFloat(v)));
      
      let distribution = [];
      if (isNumeric) {
        const numValues = values.map(v => parseFloat(v));
        const min = Math.min(...numValues);
        const max = Math.max(...numValues);
        const mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
        const std = Math.sqrt(numValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numValues.length);
        
        distribution = { min, max, mean: mean.toFixed(2), std: std.toFixed(2) };
      } else {
        const counts = _.countBy(values);
        distribution = Object.entries(counts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([value, count]) => ({ name: value, count }));
      }

      return {
        name: predictor,
        type: isNumeric ? 'numeric' : 'categorical',
        uniqueCount,
        missingCount: data.data.length - values.length,
        distribution
      };
    });
  };

  const analyzeCorrelations = () => {
    // Simplified correlation analysis
    const warnings = [];
    const numericPredictors = selectedColumns.predictors.filter(pred => {
      const values = data.data.map(row => row[pred]).filter(v => v !== null && v !== undefined && v !== '');
      return values.every(v => !isNaN(parseFloat(v)));
    });

    // Check for highly correlated predictors (simplified)
    for (let i = 0; i < numericPredictors.length; i++) {
      for (let j = i + 1; j < numericPredictors.length; j++) {
        const pred1 = numericPredictors[i];
        const pred2 = numericPredictors[j];
        
        const values1 = data.data.map(row => parseFloat(row[pred1])).filter(v => !isNaN(v));
        const values2 = data.data.map(row => parseFloat(row[pred2])).filter(v => !isNaN(v));
        
        // Simple correlation check (if ranges are similar, flag as potentially correlated)
        const range1 = Math.max(...values1) - Math.min(...values1);
        const range2 = Math.max(...values2) - Math.min(...values2);
        const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
        const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
        
        if (Math.abs(range1 - range2) / Math.max(range1, range2) < 0.2 && 
            Math.abs(mean1 - mean2) / Math.max(Math.abs(mean1), Math.abs(mean2)) < 0.3) {
          warnings.push(`${pred1} and ${pred2} may be highly correlated`);
        }
      }
    }

    return { warnings };
  };

  const generateWarnings = () => {
    const warnings = [];
    
    // Check class imbalance
    const targetDist = analyzeTargetDistribution();
    const maxPct = Math.max(...targetDist.map(d => parseFloat(d.percentage)));
    const minPct = Math.min(...targetDist.map(d => parseFloat(d.percentage)));
    
    if (maxPct / minPct > 3) {
      warnings.push({
        type: 'class-imbalance',
        message: 'Significant class imbalance detected in target variable',
        severity: 'warning'
      });
    }

    // Check for predictors with high missing values
    selectedColumns.predictors.forEach(pred => {
      const values = data.data.map(row => row[pred]);
      const missingCount = values.filter(v => v === null || v === undefined || v === '').length;
      const missingPct = (missingCount / data.data.length) * 100;
      
      if (missingPct > 20) {
        warnings.push({
          type: 'missing-data',
          message: `${pred} has ${missingPct.toFixed(1)}% missing values`,
          severity: 'warning'
        });
      }
    });

    return warnings;
  };

  const handleRevisionSave = () => {
    onColumnsRevised(revisedColumns);
    setSelectedColumns(revisedColumns);
    setShowRevision(false);
    performAnalysis();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Exploratory Data Analysis</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's explore your data to understand patterns and identify potential issues.
        </p>
      </div>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="card bg-yellow-50 border-yellow-200 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Data Quality Insights</h3>
              <div className="space-y-2">
                {analysis.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    <p>{warning.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Distribution */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Variable Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.targetDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {analysis.targetDistribution.map((item, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.count} ({item.percentage}%)</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictor Analysis */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {analysis.predictorStats.map((predictor, index) => (
          <div key={index} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{predictor.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  predictor.type === 'numeric' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {predictor.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Unique values:</span>
                <span className="text-sm font-medium">{predictor.uniqueCount}</span>
              </div>
              {predictor.missingCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Missing:</span>
                  <span className="text-sm font-medium text-yellow-600">{predictor.missingCount}</span>
                </div>
              )}
              
              {predictor.type === 'numeric' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span>{predictor.distribution.min} - {predictor.distribution.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mean:</span>
                    <span>{predictor.distribution.mean}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Std Dev:</span>
                    <span>{predictor.distribution.std}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">Top Categories:</p>
                  {predictor.distribution.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Column Revision Option */}
      <div className="card max-w-4xl mx-auto bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Want to revise your column selection?</h3>
              <p className="text-sm text-blue-600">Based on the analysis, you might want to adjust your predictors or target.</p>
            </div>
          </div>
          <button
            onClick={() => setShowRevision(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Revise Selection</span>
          </button>
        </div>
      </div>

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
          <span>Continue to Preprocessing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExploratoryDataAnalysis;