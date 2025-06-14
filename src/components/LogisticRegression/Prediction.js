import React, { useState } from 'react';
import { ArrowLeft, Upload, Download, CheckCircle, AlertTriangle, Info, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { Matrix } from 'ml-matrix';

const Prediction = ({ model, preprocessing, selectedColumns, onPrevious, data }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get actual category names from the original training data
  const getCategoryNames = () => {
    if (!data?.trainData || !selectedColumns?.target) return ['Class 0', 'Class 1'];
    
    const uniqueValues = [...new Set(data.trainData.map(row => row[selectedColumns.target]))];
    
    // If string values, return them directly
    if (typeof uniqueValues[0] === 'string') {
      return uniqueValues.sort();
    }
    
    // If numeric, check if we have targetClasses mapping
    if (model?.targetClasses && model.targetClasses.length > 0) {
      return model.targetClasses;
    }
    
    // Default to generic names
    return uniqueValues.map(val => String(val)).sort();
  };

  const categoryNames = getCategoryNames();

  const handleFileUpload = (file) => {
    if (!file) return;

    setError(null);
    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setError('Error parsing CSV: ' + result.errors[0].message);
          setIsLoading(false);
          return;
        }

        const missingColumns = selectedColumns.predictors.filter(
          col => !result.meta.fields.includes(col)
        );

        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          setIsLoading(false);
          return;
        }

        setPredictionData(result);
        makeRealPredictions(result);
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  const makeRealPredictions = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (!model?.model) {
        throw new Error('No trained model available');
      }

      const features = data.data.map(row => 
        selectedColumns.predictors.map(col => {
          const value = parseFloat(row[col]);
          return isNaN(value) ? 0 : value;
        })
      );

      const X_pred = new Matrix(features);
      const probabilities = model.model.predict(X_pred);
      const predictions = probabilities.map(prob => Math.round(prob));

      const confidences = probabilities.map(prob => {
        const distance_from_05 = Math.abs(prob - 0.5);
        return 0.5 + distance_from_05;
      });

      const realPredictions = data.data.map((row, index) => ({
        ...row,
        prediction_index: predictions[index],
        prediction_category: categoryNames[predictions[index]] || `Class ${predictions[index]}`,
        probability: probabilities[index],
        confidence: confidences[index]
      }));

      setPredictions(realPredictions);
      setIsLoading(false);

    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to make predictions: ' + error.message);
      setIsLoading(false);
    }
  };

  const downloadPredictions = () => {
    if (!predictions) return;

    const csv = Papa.unparse(predictions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'real_predictions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    if (csvFile) handleFileUpload(csvFile);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Make Real Predictions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload new data to generate real predictions using your trained logistic regression model.
        </p>
      </div>

      {/* Model Status Indicator */}
      <div className="max-w-4xl mx-auto">
        {model?.model ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">✅ Model Ready</p>
                <p className="text-green-800 text-sm">
                  Using trained {model.type || 'Logistic Regression'} model • 
                  Features: {model.features?.length || 0} • 
                  Target: {selectedColumns?.target || 'Unknown'} • 
                  Accuracy: {model.trainingAccuracy ? (model.trainingAccuracy * 100).toFixed(1) + '%' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">⚠️ No Model Available</p>
                <p className="text-yellow-800 text-sm">
                  Please train a model first or upload a saved model file to make predictions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Information */}
      {model?.model && (
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            Prediction Categories
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-900 font-medium mb-2">Your model predicts between these categories:</p>
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((category, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {category} (Class {index})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {model?.model && (
        <div className="card max-w-2xl mx-auto">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-300"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Prediction Data</h3>
            <p className="text-gray-600 mb-4">CSV file with same columns as training data</p>
            <input
              type="file" accept=".csv" onChange={handleFileInput} className="hidden" id="prediction-file-upload"
            />
            <label htmlFor="prediction-file-upload" className="btn-primary inline-block cursor-pointer">
              Choose File
            </label>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Required Columns:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedColumns.predictors.map(col => (
                <span key={col} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card max-w-2xl mx-auto bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="card max-w-2xl mx-auto text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Making real predictions with your trained model...</p>
        </div>
      )}

      {/* Real Predictions Results */}
      {predictions && (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Real Prediction Results</h2>
                <p className="text-sm text-gray-600 mt-1">Generated by your trained logistic regression model</p>
              </div>
              <button onClick={downloadPredictions} className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
                <p className="text-sm text-gray-600">Total Predictions</p>
              </div>
              {categoryNames.map((category, index) => (
                <div key={index} className={`text-center p-4 rounded-lg ${
                  index === 0 ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  <p className={`text-2xl font-bold ${
                    index === 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {predictions.filter(p => p.prediction_index === index).length}
                  </p>
                  <p className={`text-sm ${
                    index === 0 ? 'text-red-700' : 'text-green-700'
                  }`}>{category}</p>
                </div>
              ))}
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-purple-700">Avg Confidence</p>
              </div>
            </div>

            {/* Predictions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                    {selectedColumns.predictors.slice(0, 3).map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {col}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prediction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.slice(0, 10).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      {selectedColumns.predictors.slice(0, 3).map(col => (
                        <td key={col} className="px-4 py-3 text-sm text-gray-900">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : '—'}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.prediction_index === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.prediction_category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(row.probability * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(row.confidence * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {predictions.length > 10 && (
              <p className="text-sm text-gray-500 mt-4">
                Showing first 10 of {predictions.length} real predictions. Download CSV for complete results.
              </p>
            )}
          </div>

          {/* Real Model Success Message */}
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">🎉 Real ML Predictions Complete!</p>
                <p className="text-green-800 text-sm">
                  These predictions were generated using your actual trained logistic regression model with ml.js - 
                  not mock data. The probabilities and confidence scores reflect real model outputs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-6xl mx-auto">
        <button onClick={onPrevious} className="btn-secondary flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-right">
          <p className="text-lg font-semibold text-green-600 mb-2">🎉 ML Analysis Complete!</p>
          <p className="text-sm text-gray-600">Your real logistic regression model is ready for production use.</p>
        </div>
      </div>
    </div>
  );
};

export default Prediction;