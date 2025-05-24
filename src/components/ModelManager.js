import React, { useState, useRef } from 'react';
import { Download, Upload, Save, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import HelpTooltip from './HelpTooltip';

const ModelManager = ({ model, onModelLoad, onModelSave }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const generateModelExport = () => {
    if (!model) return null;

    const exportData = {
      metadata: {
        modelType: 'LogisticRegression',
        exportDate: new Date().toISOString(),
        platform: 'DA4 ML Platform',
        version: '1.0.0',
        description: 'Trained logistic regression model with parameters and preprocessing info'
      },
      model: {
        type: model.type || 'LogisticRegression',
        parameters: {
          regularization: model.regularization,
          regularizationStrength: model.regularizationStrength,
          maxIterations: model.maxIterations,
          tolerance: model.tolerance,
          randomSeed: model.randomSeed
        },
        coefficients: model.coefficients || [],
        intercept: model.intercept || 0,
        trainingMetrics: {
          accuracy: model.trainingAccuracy,
          convergence: model.convergence,
          iterations: model.iterations
        },
        featureNames: model.featureNames || [],
        targetClasses: model.targetClasses || []
      },
      preprocessing: {
        scalingMethod: model.scalingMethod,
        encodingMethod: model.encodingMethod,
        scalingParameters: model.scalingParameters,
        encodingMappings: model.encodingMappings
      },
      trainingConfig: {
        selectedColumns: model.selectedColumns,
        splitRatio: model.splitRatio,
        stratified: model.stratified,
        dataShape: model.dataShape
      },
      performance: model.evaluation ? {
        accuracy: model.evaluation.accuracy,
        precision: model.evaluation.precision,
        recall: model.evaluation.recall,
        f1Score: model.evaluation.f1Score,
        confusionMatrix: model.evaluation.confusionMatrix
      } : null
    };

    return exportData;
  };

  const downloadModel = async () => {
    if (!model) return;

    setIsExporting(true);
    setExportSuccess(false);

    try {
      const exportData = generateModelExport();
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const modelName = model.name || 'logistic_regression';
      link.download = `${modelName}_model_${timestamp}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      onModelSave(exportData);
      
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting model:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    if (!file.name.toLowerCase().endsWith('.json')) {
      setImportError('Please select a JSON file (.json extension required)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate the imported model structure
        if (!validateModelStructure(importedData)) {
          setImportError('Invalid model file format. Please ensure this is a valid DA4 ML Platform model export.');
          return;
        }

        // Extract the model data
        const reconstructedModel = {
          ...importedData.model,
          name: file.name.replace('.json', ''),
          importDate: new Date().toISOString(),
          imported: true,
          originalExportDate: importedData.metadata.exportDate,
          selectedColumns: importedData.trainingConfig?.selectedColumns,
          evaluation: importedData.performance
        };

        onModelLoad(reconstructedModel);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
        
      } catch (error) {
        setImportError('Error reading model file. Please ensure it\'s a valid JSON file.');
      }
    };

    reader.readAsText(file);
  };

  const validateModelStructure = (data) => {
    // Check required structure
    const requiredFields = ['metadata', 'model', 'trainingConfig'];
    const hasRequiredFields = requiredFields.every(field => data.hasOwnProperty(field));
    
    if (!hasRequiredFields) return false;
    
    // Check model metadata
    if (!data.metadata.modelType || !data.metadata.platform) return false;
    
    // Check model structure
    if (!data.model.type || !data.model.parameters) return false;
    
    return true;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Save className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Model Management</h3>
        <HelpTooltip 
          title="Save & Load Models - DA4 Professional Practice" 
          level="intermediate"
          content={
            <div className="space-y-3">
              <p><strong>Why save models?</strong> Professional data analysts always save their trained models for:</p>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Reuse:</strong> Apply the same model to new data</li>
                <li>• <strong>Sharing:</strong> Collaborate with colleagues</li>
                <li>• <strong>Documentation:</strong> Keep records of model versions</li>
                <li>• <strong>Production:</strong> Deploy models to live systems</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 font-medium">🎓 DA4 Skill: Model versioning and deployment are key professional competencies!</p>
              </div>
              <p className="text-sm"><strong>File contains:</strong> All model parameters, preprocessing steps, and performance metrics.</p>
            </div>
          }
        />
      </div>
      
      <p className="text-gray-600 mb-6">
        Save your trained model to reuse later, or load a previously saved model to continue your analysis.
      </p>

      <div className="space-y-4">
        {/* Model Export */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-600" />
            <span>Export Model</span>
          </h4>
          
          {model ? (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Model Type:</span>
                    <span className="font-medium ml-2">Logistic Regression</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Features:</span>
                    <span className="font-medium ml-2">{model.featureNames?.length || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Regularization:</span>
                    <span className="font-medium ml-2">{model.regularization?.toUpperCase() || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium ml-2">
                      {model.trainingAccuracy ? (model.trainingAccuracy * 100).toFixed(1) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadModel}
                disabled={isExporting}
                className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                  isExporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Model (.json)</span>
                  </>
                )}
              </button>

              {exportSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">
                      Model exported successfully! You can now reuse this model anytime.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="font-medium text-blue-900 mb-2">Export Includes:</h5>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• All model parameters and coefficients</li>
                  <li>• Preprocessing configuration (scaling, encoding)</li>
                  <li>• Training configuration and data split info</li>
                  <li>• Performance metrics and evaluation results</li>
                  <li>• Feature names and target classes</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No trained model available to export.</p>
              <p className="text-gray-500 text-sm mt-1">Complete the model training step first.</p>
            </div>
          )}
        </div>

        {/* Model Import */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Import Model</span>
          </h4>
          
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Load a previously saved model to continue your analysis or make new predictions.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={triggerFileInput}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Model File (.json)</span>
            </button>

            {importError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 text-sm font-medium">Import Error</p>
                    <p className="text-red-700 text-sm mt-1">{importError}</p>
                  </div>
                </div>
              </div>
            )}

            {importSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-green-800 text-sm font-medium">
                    Model imported successfully! You can now use it for predictions.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h5 className="font-medium text-yellow-900 mb-2">Import Requirements:</h5>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• File must be a valid JSON model export from this platform</li>
                <li>• Model will overwrite current training progress</li>
                <li>• All original preprocessing and configuration will be restored</li>
                <li>• You can immediately proceed to make predictions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model Information */}
        {model && model.imported && (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Imported Model Information</span>
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Model Name:</span>
                <span className="font-medium text-blue-900">{model.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Original Export:</span>
                <span className="font-medium text-blue-900">
                  {model.originalExportDate ? new Date(model.originalExportDate).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Imported:</span>
                <span className="font-medium text-blue-900">
                  {new Date(model.importDate).toLocaleDateString()}
                </span>
              </div>
              {model.evaluation && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Original Accuracy:</span>
                  <span className="font-medium text-blue-900">
                    {(model.evaluation.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelManager;