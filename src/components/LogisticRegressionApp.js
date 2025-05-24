import React, { useState } from 'react';
import DataUpload from './LogisticRegression/DataUpload';
import ColumnSelection from './LogisticRegression/ColumnSelection';
import ExploratoryDataAnalysis from './LogisticRegression/ExploratoryDataAnalysis';
import Preprocessing from './LogisticRegression/Preprocessing';
import TrainTestSplit from './LogisticRegression/TrainTestSplit';
import ModelTraining from './LogisticRegression/ModelTraining';
import ModelEvaluation from './LogisticRegression/ModelEvaluation';
import Prediction from './LogisticRegression/Prediction';
import ProgressIndicator from './LogisticRegression/ProgressIndicator';

const LogisticRegressionApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({ predictors: [], target: '' });
  const [edaResults, setEdaResults] = useState(null);
  const [preprocessedData, setPreprocessedData] = useState(null);
  const [splitData, setSplitData] = useState(null);
  const [model, setModel] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const steps = [
    { id: 1, name: 'Upload Data', description: 'Upload your CSV file' },
    { id: 2, name: 'Select Columns', description: 'Choose predictors and target' },
    { id: 3, name: 'Explore Data', description: 'Analyze data patterns' },
    { id: 4, name: 'Preprocessing', description: 'Clean and prepare data' },
    { id: 5, name: 'Train/Test Split', description: 'Split data for training' },
    { id: 6, name: 'Train Model', description: 'Train logistic regression' },
    { id: 7, name: 'Evaluate Model', description: 'Assess performance' },
    { id: 8, name: 'Make Predictions', description: 'Predict new outcomes' }
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

  const canProceedToStep = (stepId) => {
    switch (stepId) {
      case 2: return data !== null;
      case 3: return selectedColumns.predictors.length > 0 && selectedColumns.target;
      case 4: return edaResults !== null;
      case 5: return preprocessedData !== null;
      case 6: return splitData !== null;
      case 7: return model !== null;
      case 8: return evaluation !== null;
      default: return true;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataUpload
            onDataUploaded={setData}
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
          <ExploratoryDataAnalysis
            data={data}
            selectedColumns={selectedColumns}
            onEdaComplete={setEdaResults}
            onColumnsRevised={setSelectedColumns}
            onNext={handleNext}
            onPrevious={handlePrevious}
            edaResults={edaResults}
          />
        );
      case 4:
        return (
          <Preprocessing
            data={data}
            selectedColumns={selectedColumns}
            onPreprocessingComplete={setPreprocessedData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            preprocessedData={preprocessedData}
          />
        );
      case 5:
        return (
          <TrainTestSplit
            data={preprocessedData}
            onSplitComplete={setSplitData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            splitData={splitData}
          />
        );
      case 6:
        return (
          <ModelTraining
            data={splitData}
            selectedColumns={selectedColumns}
            onModelTrained={setModel}
            onNext={handleNext}
            onPrevious={handlePrevious}
            model={model}
          />
        );
      case 7:
        return (
          <ModelEvaluation
            model={model}
            data={splitData}
            onEvaluationComplete={setEvaluation}
            onNext={handleNext}
            onPrevious={handlePrevious}
            evaluation={evaluation}
          />
        );
      case 8:
        return (
          <Prediction
            model={model}
            preprocessing={preprocessedData}
            selectedColumns={selectedColumns}
            onPrevious={handlePrevious}
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
      </div>
    </div>
  );
};

export default LogisticRegressionApp;