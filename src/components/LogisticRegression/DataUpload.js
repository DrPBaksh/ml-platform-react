import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, ArrowRight, Shield, Lock, Database, Sparkles, Info, AlertTriangle, FileSpreadsheet, Zap } from 'lucide-react';
import Papa from 'papaparse';
import HelpTooltip from '../HelpTooltip';

const DataUpload = ({ onDataUploaded, onNext, data }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);
  const [loadingExample, setLoadingExample] = useState(false);
  const [showCleaningTips, setShowCleaningTips] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const loadIrisExample = async () => {
    setLoadingExample(true);
    try {
      const response = await fetch('/iris.csv');
      const csvText = await response.text();
      const result = await new Promise((resolve, reject) => {
        Papa.parse(csvText, { header: true, skipEmptyLines: true, complete: resolve, error: reject });
      });
      
      const validation = validateData(result);
      setValidationWarnings(validation.warnings);
      setFileInfo({ name: 'Iris Dataset (Example)', size: '5.0 KB', lastModified: 'Classic ML Dataset', ...validation.stats, isExample: true });
      onDataUploaded(result, 'iris_dataset');
    } catch (err) {
      setError('Error loading Iris dataset: ' + err.message);
    } finally {
      setLoadingExample(false);
    }
  };

  const validateData = (parsedData) => {
    const warnings = [];
    const { data, meta: { fields } } = parsedData;
    
    if (data.length < 10) warnings.push({ type: 'warning', message: `Small dataset (${data.length} rows). Consider 50+ rows.` });
    
    const numericColumns = [], categoricalColumns = [];
    fields.forEach(field => {
      const sample = data.slice(0, 100).map(row => row[field]).filter(val => val);
      const numericPercentage = (sample.filter(val => !isNaN(parseFloat(val))).length / sample.length) * 100;
      (numericPercentage > 70 ? numericColumns : categoricalColumns).push(field);
    });

    return {
      warnings,
      stats: { totalRows: data.length, totalColumns: fields.length, numericColumns: numericColumns.length, categoricalColumns: categoricalColumns.length }
    };
  };

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: resolve, error: reject });
      });

      if (!result.data?.length || !result.meta?.fields?.length) {
        setError('No valid data found in CSV file');
        return;
      }

      const validation = validateData(result);
      setValidationWarnings(validation.warnings);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        lastModified: new Date(file.lastModified).toLocaleDateString(),
        ...validation.stats
      });

      onDataUploaded(result, file.name.replace('.csv', ''));
    } catch (err) {
      setError('Error reading CSV: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
      `}</style>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Data</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
          Upload a CSV file to begin your machine learning analysis. Your data stays 100% private in your browser.
        </p>
      </div>

      {/* Clean Data Notice */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Info className="w-6 h-6 text-blue-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="font-semibold text-blue-900">This App Expects Clean Data</h3>
              <Sparkles className="w-5 h-5 text-blue-500 animate-bounce" />
            </div>
            
            <p className="text-blue-800 text-sm mb-4">
              For best results, ensure your data is already cleaned. This app teaches ML concepts, not data cleaning.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 animate-bounce-in">
              <div className="bg-white rounded-lg p-4 border border-blue-200 hover:scale-105 transition-transform">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Good Clean Data:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Clear headers, consistent formats</li>
                  <li>• Minimal missing values (&lt;10%)</li>
                  <li>• No duplicates, sufficient rows (50+)</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200 hover:scale-105 transition-transform">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                  May Need Cleaning:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Many empty cells, mixed data types</li>
                  <li>• Inconsistent formats, duplicates</li>
                  <li>• Very small datasets (&lt;20 rows)</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowCleaningTips(!showCleaningTips)}
              className="mt-4 flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition-colors group"
            >
              <FileSpreadsheet className="w-4 h-4 group-hover:animate-bounce" />
              <span className="font-medium">Need to clean? Excel can help!</span>
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            </button>
            
            {showCleaningTips && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 animate-slide-up">
                <p className="text-green-800 text-sm">
                  <strong>Excel Tools:</strong> Find & Replace, Remove Duplicates, AutoFilter, Data Validation, Text to Columns, Conditional Formatting
                </p>
                <p className="text-blue-800 text-sm mt-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <strong>Pro Tip:</strong> Clean in Excel/Sheets first, then export as CSV!
                </p>
              </div>
            )}

            <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <strong>If your data is clean, you're ready to go!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-600 animate-pulse" />
          <div>
            <h3 className="font-semibold text-green-900">100% Browser-Based & Private</h3>
            <p className="text-green-800 text-sm">Your data never leaves your computer.</p>
          </div>
        </div>
      </div>

      {/* Example Dataset */}
      <div className="max-w-4xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 mb-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-600 animate-pulse" />
            <h3 className="font-semibold text-blue-900">Try with Example Data</h3>
          </div>
          <p className="text-blue-800 text-sm mb-4">
            Start with the Iris dataset - perfectly clean and ready for analysis!
          </p>
          <button
            onClick={loadIrisExample}
            disabled={loadingExample}
            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            {loadingExample ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Sparkles className="w-4 h-4 animate-bounce" />
            )}
            <span>{loadingExample ? 'Loading...' : 'Use Iris Dataset'}</span>
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 hover:scale-[1.02] ${
            dragActive ? 'border-primary-400 bg-primary-50 shadow-xl' :
            data ? 'border-green-400 bg-green-50' :
            'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
          }`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleChange} className="hidden" />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600">Processing...</p>
            </div>
          ) : data ? (
            <div className="space-y-4 animate-bounce-in">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
              <div>
                <h3 className="text-xl font-semibold text-green-900">Success!</h3>
                <p className="text-green-700">Ready for analysis</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto animate-bounce" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Drop CSV here</h3>
                <p className="text-gray-600">or click to browse</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </button>
            </div>
          )}
        </div>

        {/* Error & File Info */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-up">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {fileInfo && (
          <div className="mt-6 card animate-bounce-in">
            <h3 className="text-lg font-semibold mb-4">Dataset Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Rows', value: fileInfo.totalRows, color: 'text-primary-600' },
                { label: 'Columns', value: fileInfo.totalColumns, color: 'text-primary-600' },
                { label: 'Numeric', value: fileInfo.numericColumns, color: 'text-green-600' },
                { label: 'Categorical', value: fileInfo.categoricalColumns, color: 'text-blue-600' }
              ].map((item, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-lg hover:scale-105 transition-transform">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data && (
          <div className="mt-8 text-center">
            <button onClick={onNext} className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform">
              Continue to Column Selection
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;