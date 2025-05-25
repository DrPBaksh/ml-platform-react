import React, { useState } from 'react';
import DataUpload from './LogisticRegression/DataUpload';
import ColumnSelection from './LogisticRegression/ColumnSelection';
import TrainTestSplit from './LogisticRegression/TrainTestSplit';
import CorrelationAnalysis from './LogisticRegression/CorrelationAnalysis';
import ExploratoryDataAnalysis from './LogisticRegression/ExploratoryDataAnalysis';
import Preprocessing from './LogisticRegression/Preprocessing';
import ModelTraining from './LogisticRegression/ModelTraining';
import ModelEvaluation from './LogisticRegression/ModelEvaluation';
import Prediction from './LogisticRegression/Prediction';
import ProgressIndicator from './LogisticRegression/ProgressIndicator';
import ModelManager from './ModelManager';
import PDFReportGenerator from './PDFReportGenerator';

const LogisticRegressionApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({ predictors: [], target: '' });
  const [splitData, setSplitData] = useState(null);
  const [splitParameters, setSplitParameters] = useState(null);
  const [correlationResults, setCorrelationResults] = useState(null);
  const [edaResults, setEdaResults] = useState(null);
  const [edaDecisions, setEdaDecisions] = useState([]);
  const [preprocessedData, setPreprocessedData] = useState(null);
  const [preprocessingInfo, setPreprocessingInfo] = useState(null);
  const [model, setModel] = useState(null);
  const [modelParameters, setModelParameters] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [fileName, setFileName] = useState('');

  // CORRECTED WORKFLOW ORDER: Column Selection → Train/Test Split → Correlation → EDA → Preprocessing → Training
  const steps = [
    { id: 1, name: 'Upload Data', description: 'Upload your CSV file' },
    { id: 2, name: 'Select Columns', description: 'Choose predictors and target' },
    { id: 3, name: 'Train/Test Split', description: 'Split data for validation' },
    { id: 4, name: 'Correlation Analysis', description: 'Check variable relationships' },
    { id: 5, name: 'Explore Data', description: 'Analyze data patterns' },
    { id: 6, name: 'Preprocessing', description: 'Clean and prepare data' },
    { id: 7, name: 'Train Model', description: 'Train logistic regression' },
    { id: 8, name: 'Evaluate Model', description: 'Assess performance' },
    { id: 9, name: 'Make Predictions', description: 'Predict new outcomes' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep || (stepId === currentStep + 1 && canProceedToStep(stepId))) {
      setCurrentStep(stepId);
    }
  };

  // Function to skip training and go directly to evaluation with loaded model
  const handleSkipToEvaluation = () => {
    if (model && splitData) {
      setCurrentStep(8); // Go to Model Evaluation step
    }
  };

  const canProceedToStep = (stepId) => {
    switch (stepId) {
      case 2: return data !== null;
      case 3: return selectedColumns.predictors.length > 0 && selectedColumns.target;
      case 4: return splitData !== null;
      case 5: return selectedColumns.predictors.length > 0 && selectedColumns.target;
      case 6: return edaResults !== null;
      case 7: return preprocessedData !== null;
      case 8: return model !== null; // Allow evaluation if model exists (even if loaded)
      case 9: return evaluation !== null;
      default: return true;
    }
  };

  const handleColumnsRevised = (newColumns) => {
    setSelectedColumns(newColumns);
    // Reset dependent states when columns change
    setSplitData(null);
    setSplitParameters(null);
    setCorrelationResults(null);
    setEdaResults(null);
    setEdaDecisions([]);
    setPreprocessedData(null);
    setPreprocessingInfo(null);
    setModel(null);
    setModelParameters(null);
    setEvaluation(null);
  };

  const handleModelLoad = (loadedModel) => {
    setModel(loadedModel);
    setEvaluation(null);
    
    // If we have both model and split data, we can proceed to evaluation
    if (loadedModel && splitData) {
      // Automatically set up the required data for evaluation
      if (loadedModel.selectedColumns) {
        setSelectedColumns(loadedModel.selectedColumns);
      }
      
      // Set parameters if available
      if (loadedModel.parameters) {
        setModelParameters(loadedModel.parameters);
      }
    }
  };

  const handleEDADecisions = (decisions) => {
    setEdaDecisions(prev => [...prev, ...decisions]);
  };

  const handleDataUploaded = (uploadedData, uploadedFileName) => {
    setData(uploadedData);
    setFileName(uploadedFileName || 'dataset');
  };

  const handleSplitComplete = (splitResult, parameters) => {
    setSplitData(splitResult);
    setSplitParameters(parameters);
  };

  const handlePreprocessingComplete = (processedData, processingInfo) => {
    setPreprocessedData(processedData);
    setPreprocessingInfo(processingInfo);
  };

  const handleModelTrained = (trainedModel, parameters) => {
    setModel(trainedModel);
    setModelParameters(parameters);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataUpload
            onDataUploaded={handleDataUploaded}
            onNext={handleNext}
            data={data}
          />
        );
      case 2:
        return (
          <ColumnSelection
            data={data}
            selectedColumns={selectedColumns}
            onColumnsSelected={setSelectedColumns}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <TrainTestSplit
            data={data}
            selectedColumns={selectedColumns}
            onSplitComplete={handleSplitComplete}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkipToEvaluation={handleSkipToEvaluation}
            splitData={splitData}
            model={model}
          />
        );
      case 4:
        return (
          <CorrelationAnalysis
            data={data}
            selectedColumns={selectedColumns}
            onCorrelationComplete={setCorrelationResults}
            onColumnsRevised={handleColumnsRevised}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <ExploratoryDataAnalysis
            data={data}
            selectedColumns={selectedColumns}
            onEdaComplete={setEdaResults}
            onDecisionsMade={handleEDADecisions}
            onColumnsRevised={handleColumnsRevised}
            onNext={handleNext}
            onPrevious={handlePrevious}
            edaResults={edaResults}
          />
        );
      case 6:
        return (
          <Preprocessing
            data={splitData}
            selectedColumns={selectedColumns}
            onPreprocessingComplete={handlePreprocessingComplete}
            onNext={handleNext}
            onPrevious={handlePrevious}
            preprocessedData={preprocessedData}
          />
        );
      case 7:
        return (
          <ModelTraining
            data={splitData}
            preprocessedData={preprocessedData}
            selectedColumns={selectedColumns}
            onModelTrained={handleModelTrained}
            onNext={handleNext}
            onPrevious={handlePrevious}
            model={model}
          />
        );
      case 8:
        return (
          <ModelEvaluation
            model={model}
            data={splitData}
            onEvaluationComplete={setEvaluation}
            onNext={handleNext}
            onPrevious={handlePrevious}
            evaluation={evaluation}
            selectedColumns={selectedColumns}
            correlationResults={correlationResults}
            preprocessingInfo={preprocessingInfo}
            trainTestSplit={splitParameters}
            modelParameters={modelParameters}
            fileName={fileName}
          />
        );
      case 9:
        return (
          <Prediction
            model={model}
            preprocessing={preprocessedData}
            selectedColumns={selectedColumns}
            onPrevious={handlePrevious}
            data={splitData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          canProceedToStep={canProceedToStep}
        />

        {/* Main Content */}
        <div className="mt-8">
          {renderCurrentStep()}
        </div>

        {/* Side Panel for Model Management and Reports */}
        {(model || evaluation) && (
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            {/* Model Management */}
            <ModelManager
              model={model}
              onModelLoad={handleModelLoad}
              onModelSave={(modelData) => {
                console.log('Model saved:', modelData);
              }}
            />

            {/* PDF Report Generator */}
            <PDFReportGenerator
              data={data}
              selectedColumns={selectedColumns}
              splitData={splitData}
              correlationResults={correlationResults}
              edaResults={edaResults}
              edaDecisions={edaDecisions}
              preprocessingResults={preprocessedData}
              model={model}
              evaluation={evaluation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticRegressionApp;