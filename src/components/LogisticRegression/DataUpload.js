import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react';
import Papa from 'papaparse';

const DataUpload = ({ onDataUploaded, onNext, data }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const validateData = (parsedData) => {
    const warnings = [];
    const data = parsedData.data;
    const fields = parsedData.meta.fields;

    // Check for missing values
    const missingValueCounts = {};
    fields.forEach(field => {
      const missingCount = data.filter(row => !row[field] || row[field] === '' || row[field] === null).length;
      if (missingCount > 0) {
        missingValueCounts[field] = missingCount;
      }
    });

    if (Object.keys(missingValueCounts).length > 0) {
      warnings.push({
        type: 'missing-values',
        message: 'Missing values detected',
        details: missingValueCounts
      });
    }

    // Check for high cardinality categorical columns
    fields.forEach(field => {
      const uniqueValues = new Set(data.map(row => row[field]));
      const cardinality = uniqueValues.size;
      const total = data.length;
      
      if (cardinality > total * 0.5 && cardinality > 10) {
        warnings.push({
          type: 'high-cardinality',
          message: `Column "${field}" has high cardinality (${cardinality} unique values)`,
          details: { field, cardinality, total }
        });
      }
    });

    // Check for numeric columns with no variation
    fields.forEach(field => {
      const values = data.map(row => parseFloat(row[field])).filter(v => !isNaN(v));
      if (values.length > 0) {
        const uniqueValues = new Set(values);
        if (uniqueValues.size === 1) {
          warnings.push({
            type: 'no-variation',
            message: `Numeric column "${field}" has no variation (all values are ${[...uniqueValues][0]})`,
            details: { field, value: [...uniqueValues][0] }
          });
        }
      }
    });

    return warnings;
  };

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setWarnings([]);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          if (result.errors.length > 0) {
            setError('Error parsing CSV: ' + result.errors[0].message);
            setIsLoading(false);
            return;
          }

          if (result.data.length === 0) {
            setError('The CSV file appears to be empty.');
            setIsLoading(false);
            return;
          }

          if (!result.meta.fields || result.meta.fields.length === 0) {
            setError('No columns detected in the CSV file.');
            setIsLoading(false);
            return;
          }

          const validationWarnings = validateData(result);
          setWarnings(validationWarnings);

          onDataUploaded(result);
          setIsLoading(false);
        } catch (err) {
          setError('An unexpected error occurred while processing the file.');
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
        setIsLoading(false);
      }
    });
  }, [onDataUploaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      setError('Please upload a CSV file.');
    }
  }, [handleFileUpload]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Data</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start by uploading a CSV file containing your data. We'll analyze it and guide you through the process.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card max-w-2xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-primary-500 bg-primary-50'
              : data
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"></div>
              <p className="text-gray-600">Processing your file...</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">File Uploaded Successfully!</h3>
                <p className="text-green-600">
                  {data.data.length} rows, {data.meta.fields.length} columns
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Drop your CSV file here</h3>
                <p className="text-gray-600">or click to browse</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-primary inline-block cursor-pointer"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card max-w-2xl mx-auto bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <X className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Warnings Display */}
      {warnings.length > 0 && (
        <div className="card max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Data Quality Warnings</h3>
              <div className="mt-2 space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    <p className="font-medium">{warning.message}</p>
                    {warning.type === 'missing-values' && (
                      <ul className="mt-1 text-xs space-y-1">
                        {Object.entries(warning.details).map(([field, count]) => (
                          <li key={field}>• {field}: {count} missing values</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {data && (
        <div className="card max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data.meta.fields.map((field) => (
                    <th key={field} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {data.meta.fields.map((field) => (
                      <td key={field} className="px-4 py-3 text-sm text-gray-900">
                        {row[field] !== null && row[field] !== undefined ? String(row[field]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.data.length > 5 && (
            <p className="text-sm text-gray-500 mt-3">
              Showing first 5 rows of {data.data.length} total rows
            </p>
          )}
        </div>
      )}

      {/* Next Button */}
      {data && (
        <div className="flex justify-end max-w-6xl mx-auto">
          <button
            onClick={onNext}
            className="btn-primary"
          >
            Continue to Column Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default DataUpload;