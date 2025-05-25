import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, ArrowRight, Shield, Lock, Database, Sparkles, Info, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';
import HelpTooltip from '../HelpTooltip';

const DataUpload = ({ onDataUploaded, onNext, data }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);
  const [loadingExample, setLoadingExample] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const loadIrisExample = async () => {
    setLoadingExample(true);
    setError(null);
    setValidationWarnings([]);

    try {
      const response = await fetch('/iris.csv');
      if (!response.ok) {
        throw new Error('Failed to load Iris dataset');
      }
      
      const csvText = await response.text();
      
      const result = await new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          complete: resolve,
          error: reject
        });
      });

      if (result.errors.length > 0 && result.errors[0].type === 'Delimiter') {
        setError('CSV parsing error. Please check the file format.');
        return;
      }

      // Validate the Iris dataset
      const validation = validateData(result);
      setValidationWarnings(validation.warnings);

      // Set file info for Iris dataset
      setFileInfo({
        name: 'Iris Dataset (Example)',
        size: '5.0 KB',
        lastModified: 'Classic ML Dataset',
        ...validation.stats,
        isExample: true
      });

      // Pass the data up with filename
      onDataUploaded(result, 'iris_dataset');
      
    } catch (err) {
      setError('Error loading Iris example dataset: ' + err.message);
    } finally {
      setLoadingExample(false);
    }
  };

  const validateData = (parsedData) => {
    const warnings = [];
    const data = parsedData.data;
    const fields = parsedData.meta.fields;

    // Check for sufficient data
    if (data.length < 10) {
      warnings.push({
        type: 'warning',
        message: `Small dataset detected (${data.length} rows). Consider having at least 50+ rows for reliable analysis.`
      });
    }

    // Check for missing values
    const missingValueStats = {};
    fields.forEach(field => {
      const missingCount = data.filter(row => !row[field] || row[field] === '').length;
      const missingPercentage = (missingCount / data.length) * 100;
      
      if (missingPercentage > 50) {
        warnings.push({
          type: 'error',
          message: `Column "${field}" has ${missingPercentage.toFixed(1)}% missing values. Consider removing this column.`
        });
      } else if (missingPercentage > 10) {
        warnings.push({
          type: 'warning',
          message: `Column "${field}" has ${missingPercentage.toFixed(1)}% missing values. May need preprocessing.`
        });
      }
      
      missingValueStats[field] = {
        count: missingCount,
        percentage: missingPercentage
      };
    });

    // Check for data types
    const numericColumns = [];
    const categoricalColumns = [];
    
    fields.forEach(field => {
      const sample = data.slice(0, 100).map(row => row[field]).filter(val => val !== '');
      const numericValues = sample.filter(val => !isNaN(parseFloat(val))).length;
      const numericPercentage = (numericValues / sample.length) * 100;
      
      if (numericPercentage > 70) {
        numericColumns.push(field);
      } else {
        categoricalColumns.push(field);
        
        // Check unique values for categorical columns
        const uniqueValues = [...new Set(sample)];
        if (uniqueValues.length > 50) {
          warnings.push({
            type: 'warning',
            message: `Column "${field}" has ${uniqueValues.length} unique values. High cardinality may affect model performance.`
          });
        }
      }
    });

    // Check for duplicate rows
    const duplicateCount = data.length - new Set(data.map(row => JSON.stringify(row))).size;
    if (duplicateCount > 0) {
      warnings.push({
        type: 'warning',
        message: `Found ${duplicateCount} duplicate rows. Consider removing duplicates during preprocessing.`
      });
    }

    return {
      warnings,
      stats: {
        totalRows: data.length,
        totalColumns: fields.length,
        numericColumns: numericColumns.length,
        categoricalColumns: categoricalColumns.length,
        missingValueStats,
        duplicateRows: duplicateCount
      }
    };
  };

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file (.csv extension required)');
      return;
    }

    setUploading(true);
    setError(null);
    setValidationWarnings([]);

    try {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          complete: resolve,
          error: reject
        });
      });

      if (result.errors.length > 0 && result.errors[0].type === 'Delimiter') {
        setError('CSV parsing error. Please check your file format and delimiter.');
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError('No data found in the CSV file. Please check your file.');
        return;
      }

      if (!result.meta.fields || result.meta.fields.length === 0) {
        setError('No column headers found. Please ensure your CSV has column headers in the first row.');
        return;
      }

      // Validate the data
      const validation = validateData(result);
      setValidationWarnings(validation.warnings);

      // Set file info
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        lastModified: new Date(file.lastModified).toLocaleDateString('en-GB'),
        ...validation.stats
      });

      // Pass the data up with filename (without extension)
      const fileName = file.name.replace('.csv', '');
      onDataUploaded(result, fileName);
      
    } catch (err) {
      setError('Error reading the CSV file: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Help */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Data</h1>
          <HelpTooltip 
            title="Data Upload - DA4 Foundation Skill" 
            level="beginner"
            content={
              <div className="space-y-3">
                <p><strong>What you're doing:</strong> Uploading your dataset to begin analysis - a core DA4 skill!</p>
                <p><strong>What makes good data:</strong></p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>50+ rows:</strong> More data = better insights</li>
                  <li>• <strong>Clear headers:</strong> First row should contain column names</li>
                  <li>• <strong>Consistent format:</strong> Same data type in each column</li>
                  <li>• <strong>Minimal missing data:</strong> Less than 10% gaps per column</li>
                </ul>
                <div className="bg-green-50 p-3 rounded-lg mt-3">
                  <p className="text-green-800 font-medium">🎓 DA4 Skill: Data collection and quality assessment is fundamental to all analysis work!</p>
                </div>
              </div>
            }
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a CSV file to begin your machine learning analysis. Your data stays 100% private in your browser.
        </p>
      </div>

      {/* Clean Data Expectation Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="font-semibold text-blue-900">This App Expects Clean Data</h3>
              <HelpTooltip 
                title="What is Clean Data? - DA4 Essential Knowledge" 
                level="beginner"
                content={
                  <div className="space-y-3">
                    <p><strong>Clean data means your dataset is:</strong></p>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Properly formatted:</strong> CSV with clear column headers</li>
                      <li>• <strong>Consistent values:</strong> Same format throughout each column</li>
                      <li>• <strong>Minimal missing data:</strong> Few empty cells or "N/A" values</li>
                      <li>• <strong>No duplicates:</strong> Each row represents a unique observation</li>
                      <li>• <strong>Appropriate data types:</strong> Numbers as numbers, text as text</li>
                      <li>• <strong>Reasonable size:</strong> At least 50+ rows for meaningful analysis</li>
                    </ul>
                    <div className="bg-green-50 p-3 rounded-lg mt-3">
                      <p className="text-green-800 font-medium">🧹 DA4 Reality: Most real-world data needs cleaning first - this app focuses on the analysis after cleaning!</p>
                    </div>
                  </div>
                }
              />
            </div>
            
            <p className="text-blue-800 text-sm mb-4">
              For the best experience, please ensure your data is already cleaned and ready for analysis. 
              This app is designed to teach machine learning concepts, not data cleaning techniques.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Good Clean Data Has:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Clear column headers in row 1</li>
                  <li>• Consistent data formats</li>
                  <li>• Minimal missing values (&lt;10%)</li>
                  <li>• No obvious errors or typos</li>
                  <li>• Appropriate data types</li>
                  <li>• Sufficient rows (50+)</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                  Data That May Need Cleaning:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Many empty cells or "N/A" values</li>
                  <li>• Inconsistent date formats</li>
                  <li>• Mixed data types in columns</li>
                  <li>• Duplicate rows</li>
                  <li>• Special characters in numbers</li>
                  <li>• Very small datasets (&lt;20 rows)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm">
                <strong>💡 DA4 Tip:</strong> If your data needs cleaning, consider using tools like Excel, Google Sheets, 
                or Python/R first. This app will help you learn what to do <em>after</em> your data is clean!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Assurance */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">100% Browser-Based & Private</h3>
            <p className="text-green-800 text-sm">
              Your data never leaves your computer. All analysis happens locally in your browser.
            </p>
          </div>
          <Lock className="w-5 h-5 text-green-600" />
        </div>
      </div>

      {/* Example Dataset Option */}
      <div className="max-w-4xl mx-auto">
        <div className="card bg-blue-50 border-blue-200 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Try with Example Data</h3>
            <HelpTooltip 
              title="Iris Dataset - Perfect for Learning" 
              level="beginner"
              content={
                <div className="space-y-3">
                  <p><strong>The Iris Dataset:</strong> A classic machine learning dataset perfect for beginners!</p>
                  <p><strong>What's included:</strong></p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>150 records:</strong> Perfect size for learning</li>
                    <li>• <strong>4 numeric features:</strong> Sepal/Petal measurements</li>
                    <li>• <strong>3 species:</strong> Setosa, Versicolor, Virginica</li>
                    <li>• <strong>Clean data:</strong> No missing values</li>
                  </ul>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 font-medium">🌸 Perfect for learning classification techniques!</p>
                  </div>
                </div>
              }
            />
          </div>
          <p className="text-blue-800 text-sm mb-4">
            New to machine learning? Start with the famous Iris dataset - it's already perfectly clean and ready for analysis!
          </p>
          <button
            onClick={loadIrisExample}
            disabled={loadingExample}
            className={`btn-primary flex items-center space-x-2 ${
              loadingExample ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loadingExample ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading Iris Dataset...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Use Iris Example Dataset</span>
              </>
            )}
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : data
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600">Processing your CSV file...</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-green-900">File Uploaded Successfully!</h3>
                <p className="text-green-700 mt-2">Your data is ready for analysis</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Drop your CSV file here</h3>
                <p className="text-gray-600 mt-2">or click to browse files</p>
              </div>
              <button
                onClick={handleBrowseClick}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Choose CSV File</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Upload Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* File Information */}
        {fileInfo && (
          <div className="mt-6 card">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dataset Overview</h3>
              {fileInfo.isExample && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Example Dataset
                </span>
              )}
              <HelpTooltip 
                title="Understanding Your Dataset" 
                level="beginner"
                content={
                  <div className="space-y-2">
                    <p><strong>Key metrics to understand:</strong></p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Rows:</strong> Number of observations/records</li>
                      <li>• <strong>Columns:</strong> Number of variables/features</li>
                      <li>• <strong>Numeric:</strong> Columns with numbers (age, price, etc.)</li>
                      <li>• <strong>Categorical:</strong> Columns with categories (colour, type, etc.)</li>
                    </ul>
                    <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded mt-2">
                      💡 <strong>DA4 Tip:</strong> Understanding your data structure is the first step in any analysis!
                    </p>
                  </div>
                }
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{fileInfo.totalRows}</div>
                <div className="text-sm text-gray-600">Rows</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{fileInfo.totalColumns}</div>
                <div className="text-sm text-gray-600">Columns</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{fileInfo.numericColumns}</div>
                <div className="text-sm text-gray-600">Numeric</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{fileInfo.categoricalColumns}</div>
                <div className="text-sm text-gray-600">Categorical</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">File:</span> {fileInfo.name}
              </div>
              <div>
                <span className="font-medium">Size:</span> {fileInfo.size}
              </div>
              <div>
                <span className="font-medium">Modified:</span> {fileInfo.lastModified}
              </div>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validationWarnings.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Data Quality Assessment</h3>
              <HelpTooltip 
                title="Data Quality Matters - DA4 Core Principle" 
                level="intermediate"
                content={
                  <div className="space-y-2">
                    <p><strong>Why data quality matters:</strong></p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Rubbish in, rubbish out</strong> - Poor data = poor models</li>
                      <li>• <strong>Missing data</strong> can bias results</li>
                      <li>• <strong>Inconsistent data</strong> reduces model accuracy</li>
                      <li>• <strong>Too few rows</strong> makes patterns unreliable</li>
                    </ul>
                    <p className="text-blue-800 text-sm bg-blue-50 p-2 rounded mt-2">
                      🎯 <strong>DA4 Skill:</strong> Quality assessment is what separates professional analysts from beginners!
                    </p>
                  </div>
                }
              />
            </div>
            
            {validationWarnings.map((warning, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  warning.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${
                    warning.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <p className="text-sm">{warning.message}</p>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>DA4 Note:</strong> These warnings help you understand your data better. 
                You can proceed with analysis, but consider addressing these issues for better results.
              </p>
            </div>
          </div>
        )}

        {/* Next Button */}
        {data && (
          <div className="mt-8 text-center">
            <button
              onClick={onNext}
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Continue to Column Selection</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;