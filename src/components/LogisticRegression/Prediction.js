import React, { useState } from 'react';
import { ArrowLeft, Upload, Download, Eye, FileText } from 'lucide-react';
import Papa from 'papaparse';

const Prediction = ({ model, preprocessing, selectedColumns, onPrevious }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // Validate that required columns are present
        const missingColumns = selectedColumns.predictors.filter(
          col => !result.meta.fields.includes(col)
        );

        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          setIsLoading(false);
          return;
        }

        setPredictionData(result);
        makePredictions(result);
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  const makePredictions = async (data) => {
    // Simulate prediction delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock predictions
    const mockPredictions = data.data.map((row, index) => ({
      ...row,
      prediction: Math.random() > 0.5 ? 1 : 0,
      probability: Math.random(),
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    }));

    setPredictions(mockPredictions);
    setIsLoading(false);
  };

  const downloadPredictions = () => {
    if (!predictions) return;

    const csv = Papa.unparse(predictions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'predictions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Make Predictions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload new data to generate predictions using your trained model.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card max-w-2xl mx-auto">
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-300"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Prediction Data</h3>
          <p className="text-gray-600 mb-4">
            Upload a CSV file with the same columns as your training data
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="prediction-file-upload"
          />
          <label
            htmlFor="prediction-file-upload"
            className="btn-primary inline-block cursor-pointer"
          >
            Choose File
          </label>
        </div>

        {/* Required Columns */}
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

      {/* Error Display */}
      {error && (
        <div className="card max-w-2xl mx-auto bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
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
          <p className="text-gray-600">Making predictions...</p>
        </div>
      )}

      {/* Predictions Results */}
      {predictions && (
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Prediction Results</h2>
              <div className="flex space-x-3">
                <button
                  onClick={downloadPredictions}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
                <p className="text-sm text-gray-600">Total Predictions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {predictions.filter(p => p.prediction === 1).length}
                </p>
                <p className="text-sm text-green-700">Positive Predictions</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {predictions.filter(p => p.prediction === 0).length}
                </p>
                <p className="text-sm text-blue-700">Negative Predictions</p>
              </div>
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
                          row.prediction === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.prediction === 1 ? 'Positive' : 'Negative'}
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
                Showing first 10 rows of {predictions.length} predictions. Download CSV for complete results.
              </p>
            )}
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

        <div className="text-right">
          <p className="text-lg font-semibold text-green-600 mb-2">🎉 Analysis Complete!</p>
          <p className="text-sm text-gray-600">Your logistic regression model is ready for use.</p>
        </div>
      </div>
    </div>
  );
};

export default Prediction;