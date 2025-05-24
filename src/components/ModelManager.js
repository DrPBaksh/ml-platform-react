import React, { useState } from 'react';
import { Download, Upload, Save, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const ModelManager = ({ model, onModelLoad, onModelSave }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportModel = () => {
    if (!model) return;

    setIsExporting(true);
    
    const modelData = {
      type: 'logistic-regression',
      timestamp: new Date().toISOString(),
      version: '1.0',
      model: {
        coefficients: model.coefficients,
        intercept: model.intercept,
        regularization: model.regularization,
        regularizationStrength: model.regularizationStrength,
        trainingAccuracy: model.trainingAccuracy,
        convergence: model.convergence
      },
      metadata: {
        createdBy: 'ML Platform - DA4 Tool',
        copyright: '© 2025 Peter Baksh'
      }
    };

    const dataStr = JSON.stringify(modelData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logistic-regression-model-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);

    if (onModelSave) {
      onModelSave(modelData);
    }
  };

  const handleImportModel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const modelData = JSON.parse(e.target.result);
        
        // Validate model structure
        if (!modelData.model || !modelData.model.coefficients) {
          throw new Error('Invalid model file format');
        }

        if (onModelLoad) {
          onModelLoad(modelData.model);
        }
      } catch (error) {
        alert('Error loading model: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Model */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <Download className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Export Model</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Save your trained model as a JSON file for future use
          </p>
          <button
            onClick={handleExportModel}
            disabled={!model || isExporting}
            className={`btn-primary w-full ${
              !model || isExporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isExporting ? 'Exporting...' : 'Download Model'}
          </button>
          
          {exportSuccess && (
            <div className="flex items-center space-x-2 mt-3 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Model exported successfully!</span>
            </div>
          )}
        </div>

        {/* Import Model */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <Upload className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Import Model</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Load a previously saved model from a JSON file
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImportModel}
            className="hidden"
            id="model-upload"
          />
          <label
            htmlFor="model-upload"
            className="btn-secondary w-full text-center cursor-pointer inline-block"
          >
            Upload Model
          </label>
        </div>
      </div>

      {/* Model Info */}
      {model && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Current Model</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Features:</span>
              <span className="text-blue-900 font-medium">{model.coefficients?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Regularization:</span>
              <span className="text-blue-900 font-medium">{model.regularization?.toUpperCase() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Training Accuracy:</span>
              <span className="text-blue-900 font-medium">
                {model.trainingAccuracy ? `${(model.trainingAccuracy * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelManager;