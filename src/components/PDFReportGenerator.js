import React, { useState } from 'react';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';
import HelpTooltip from './HelpTooltip';

const PDFReportGenerator = ({ 
  data, 
  selectedColumns, 
  splitData,
  correlationResults,
  edaResults, 
  edaDecisions = [],
  preprocessingResults, 
  model, 
  evaluation 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateComprehensiveReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Compile all decisions made during analysis
    const allDecisions = [
      ...edaDecisions,
      {
        step: 'Variable Selection',
        decision: `Selected ${selectedColumns?.predictors?.length || 0} predictor variables and 1 target variable`,
        rationale: `Target: ${selectedColumns?.target || 'Not specified'} - chosen for prediction outcome. Predictors: ${selectedColumns?.predictors?.join(', ') || 'None'} - selected based on business relevance and data quality.`
      },
      splitData ? {
        step: 'Train/Test Split',
        decision: `${Math.round(splitData.splitRatio * 100)}%/${Math.round((1 - splitData.splitRatio) * 100)}% split${splitData.stratified ? ' with stratification' : ''}`,
        rationale: `Used ${splitData.stratified ? 'stratified' : 'random'} splitting to ensure ${splitData.stratified ? 'balanced class representation' : 'unbiased data distribution'} in both training and test sets.`
      } : null,
      model ? {
        step: 'Model Training',
        decision: `Logistic Regression with ${model.regularization || 'no'} regularization`,
        rationale: `Selected logistic regression for binary/categorical classification. ${model.regularization ? `Applied ${model.regularization} regularization (strength: ${model.regularizationStrength}) to prevent overfitting.` : 'No regularization applied.'}`
      } : null
    ].filter(Boolean);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DA4 Machine Learning Analysis Report</title>
    <style>
        @page { margin: 20mm; size: A4; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; padding: 0; background: white;
        }
        .header { 
            border-bottom: 3px solid #0ea5e9; 
            padding-bottom: 20px; margin-bottom: 30px;
            position: relative; page-break-inside: avoid;
        }
        .logo { 
            position: absolute; top: 0; right: 0; 
            width: 60px; height: 60px;
            background: url('/logo.png') no-repeat center;
            background-size: contain; border: 1px solid #e2e8f0; border-radius: 8px;
        }
        h1 { color: #0ea5e9; margin: 0; font-size: 2.2em; }
        h2 { color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; page-break-after: avoid; }
        h3 { color: #475569; margin-top: 25px; page-break-after: avoid; }
        .info-box { background: #f8fafc; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
        .decision-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
        .stat-value { font-size: 1.8em; font-weight: bold; color: #0ea5e9; display: block; }
        .stat-label { color: #64748b; font-size: 0.9em; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; page-break-inside: auto; }
        th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 0.9em; }
        th { background: #f8fafc; font-weight: 600; color: #374151; }
        .explanation { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #bae6fd; page-break-inside: avoid; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 0.9em; page-break-inside: avoid; }
        .page-break { page-break-before: always; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo"></div>
        <h1>DA4 Machine Learning Analysis Report</h1>
        <p><strong>Platform:</strong> DA4 Apprenticeship ML Platform by Peter Baksh</p>
        <p><strong>Generated:</strong> ${currentDate} at ${currentTime} | <strong>Analysis Type:</strong> Logistic Regression</p>
        <p><strong>Contact:</strong> pdbaksh@gmail.com | <strong>Copyright:</strong> © 2025 Peter Baksh</p>
    </div>

    <div class="info-box">
        <h3>🎓 DA4 Level 4 Data Analyst Competencies Demonstrated</h3>
        <p>This analysis demonstrates core DA4 apprenticeship skills including data quality assessment, variable selection, statistical analysis, predictive modeling, and professional reporting.</p>
    </div>

    <h2>📊 Executive Summary</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${data?.data?.length || 0}</span>
            <div class="stat-label">Total Records</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${selectedColumns?.predictors?.length || 0}</span>
            <div class="stat-label">Predictor Variables</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${evaluation?.metrics?.accuracy ? (evaluation.metrics.accuracy * 100).toFixed(1) + '%' : 'TBD'}</span>
            <div class="stat-label">Model Accuracy</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${splitData ? Math.round(splitData.splitRatio * 100) + '/' + Math.round((1 - splitData.splitRatio) * 100) : '80/20'}</span>
            <div class="stat-label">Train/Test Split</div>
        </div>
    </div>

    <h2>🎯 Analysis Decisions & Rationale</h2>
    ${allDecisions.map((decision, index) => `
    <div class="decision-box">
        <h4>${index + 1}. ${decision.step}</h4>
        <p><strong>Decision:</strong> ${decision.decision}</p>
        <p><strong>Rationale:</strong> ${decision.rationale}</p>
    </div>
    `).join('')}

    <h2>📈 Variable Selection Strategy</h2>
    <div class="explanation">
        <p><strong>Target Variable:</strong> ${selectedColumns?.target || 'Not specified'}</p>
        <p><strong>DA4 Analysis:</strong> Selected as the outcome variable for prediction. Suitable for logistic regression classification.</p>
    </div>
    <div class="explanation">
        <p><strong>Predictor Variables:</strong> ${selectedColumns?.predictors?.join(', ') || 'None selected'}</p>
        <p><strong>DA4 Analysis:</strong> Selected based on potential relationship with target, data quality, and business relevance.</p>
    </div>

    ${splitData ? `
    <h2>🔄 Data Splitting Strategy</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${splitData.trainSize || 0}</span>
            <div class="stat-label">Training Records</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${splitData.testSize || 0}</span>
            <div class="stat-label">Testing Records</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${splitData.stratified ? 'Yes' : 'No'}</span>
            <div class="stat-label">Stratified</div>
        </div>
    </div>
    <div class="explanation">
        <p><strong>DA4 Learning:</strong> Used ${Math.round(splitData.splitRatio * 100)}% for training and ${Math.round((1 - splitData.splitRatio) * 100)}% for testing. ${splitData.stratified ? 'Stratification maintains class balance in both sets.' : 'Random split ensures unbiased evaluation.'}</p>
    </div>
    ` : ''}

    ${model ? `
    <h2>🤖 Model Training Results</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${model.regularization?.toUpperCase() || 'None'}</span>
            <div class="stat-label">Regularization</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${model.trainingAccuracy ? (model.trainingAccuracy * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">Training Accuracy</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${model.convergence ? 'Yes' : 'No'}</span>
            <div class="stat-label">Converged</div>
        </div>
    </div>
    <div class="explanation">
        <p><strong>DA4 Learning:</strong> Logistic regression was chosen for its interpretability and effectiveness with categorical outcomes. ${model.regularization ? `${model.regularization} regularization prevents overfitting.` : 'No regularization was applied.'}</p>
    </div>
    ` : ''}

    ${evaluation ? `
    <h2>📊 Model Performance Evaluation</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${evaluation.metrics?.accuracy ? (evaluation.metrics.accuracy * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">Accuracy</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${evaluation.metrics?.precision ? (evaluation.metrics.precision * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">Precision</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${evaluation.metrics?.recall ? (evaluation.metrics.recall * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">Recall</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${evaluation.metrics?.f1Score ? (evaluation.metrics.f1Score * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">F1-Score</div>
        </div>
    </div>
    <div class="explanation">
        <p><strong>DA4 Performance Analysis:</strong></p>
        <ul>
            <li><strong>Accuracy (${evaluation.metrics?.accuracy ? (evaluation.metrics.accuracy * 100).toFixed(1) + '%' : 'N/A'}):</strong> ${evaluation.metrics?.accuracy > 0.9 ? 'Excellent performance' : evaluation.metrics?.accuracy > 0.8 ? 'Good performance' : evaluation.metrics?.accuracy > 0.7 ? 'Acceptable performance' : 'Needs improvement'}</li>
            <li><strong>Precision:</strong> Of positive predictions, ${evaluation.metrics?.precision ? (evaluation.metrics.precision * 100).toFixed(1) + '%' : 'N/A'} were correct</li>
            <li><strong>Recall:</strong> Caught ${evaluation.metrics?.recall ? (evaluation.metrics.recall * 100).toFixed(1) + '%' : 'N/A'} of actual positive cases</li>
            <li><strong>F1-Score:</strong> Balanced measure combining precision and recall</li>
        </ul>
    </div>
    ` : ''}

    <h2>💼 Business Recommendations</h2>
    <div class="info-box">
        <h4>Key Findings & Next Steps</h4>
        <ul>
            <li><strong>Model Readiness:</strong> ${evaluation?.metrics?.accuracy > 0.8 ? 'Model shows strong performance and is suitable for business use' : evaluation?.metrics?.accuracy > 0.7 ? 'Model shows acceptable performance but consider improvements' : 'Model needs further development before business deployment'}</li>
            <li><strong>Data Quality:</strong> Dataset appears ${(data?.data?.length || 0) >= 100 ? 'robust with sufficient records for reliable analysis' : 'limited - consider gathering more data for improved reliability'}</li>
            <li><strong>Feature Engineering:</strong> ${selectedColumns?.predictors?.length >= 5 ? 'Good feature set provides comprehensive coverage' : 'Consider identifying additional relevant predictors'}</li>
            <li><strong>Deployment Readiness:</strong> ${model && evaluation ? 'Model training and evaluation complete - ready for validation testing' : 'Complete remaining analysis steps before considering deployment'}</li>
        </ul>
    </div>

    <h2>🎓 DA4 Apprenticeship Skills Applied</h2>
    <div class="info-box">
        <h4>Level 4 Data Analyst Competencies Demonstrated:</h4>
        <ul>
            <li>✅ <strong>Data Collection & Validation:</strong> Systematic assessment of data quality and completeness</li>
            <li>✅ <strong>Statistical Analysis:</strong> Applied correlation analysis and descriptive statistics</li>
            <li>✅ <strong>Predictive Modeling:</strong> Implemented and tuned logistic regression algorithm</li>
            <li>✅ <strong>Model Evaluation:</strong> Comprehensive performance assessment using multiple metrics</li>
            <li>✅ <strong>Business Communication:</strong> Professional reporting of findings and recommendations</li>
            <li>✅ <strong>Technical Documentation:</strong> Detailed recording of methodology and decisions</li>
            <li>✅ <strong>Quality Assurance:</strong> Validation through proper train/test splitting</li>
        </ul>
    </div>

    <h2>📝 Methodology & Reproducibility</h2>
    <div class="explanation">
        <p><strong>Analysis Platform:</strong> DA4 ML Platform - 100% browser-based analysis ensuring data privacy</p>
        <p><strong>Random Seeds:</strong> ${splitData?.randomSeed || model?.randomSeed || 42} (ensures reproducible results)</p>
        <p><strong>Data Processing:</strong> All analysis performed locally in browser - no data transmitted to external servers</p>
        <p><strong>Model Persistence:</strong> Complete model parameters saved for future use and deployment</p>
    </div>

    <div class="footer">
        <h3>Report Information</h3>
        <p><strong>Generated by:</strong> DA4 Apprenticeship ML Platform</p>
        <p><strong>Author:</strong> Peter Baksh | <strong>Contact:</strong> pdbaksh@gmail.com</p>
        <p><strong>Copyright:</strong> © 2025 Peter Baksh. All rights reserved.</p>
        <p><strong>Privacy:</strong> This analysis was performed entirely in-browser. No personal or business data was transmitted externally.</p>
        <p><strong>Disclaimer:</strong> This report is generated for educational and professional development purposes as part of DA4 apprenticeship training. Results should be validated with domain experts before business implementation.</p>
    </div>
</body>
</html>`;
  };

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    try {
      const htmlContent = generateComprehensiveReport();
      
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const previewReport = () => {
    const htmlContent = generateComprehensiveReport();
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const downloadHTMLReport = () => {
    const htmlContent = generateComprehensiveReport();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `DA4_ML_Analysis_Report_${timestamp}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasEnoughData = data && selectedColumns && (edaResults || model || evaluation || splitData);

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Professional Analysis Report</h3>
        <HelpTooltip 
          title="Professional Reporting - Essential DA4 Skill" 
          level="intermediate"
          content={
            <div className="space-y-3">
              <p><strong>Why professional reports matter:</strong> DA4 analysts must communicate findings clearly to stakeholders!</p>
              <p><strong>Report includes:</strong></p>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Executive Summary:</strong> Key findings at a glance</li>
                <li>• <strong>Decision Rationale:</strong> Why you made each choice</li>
                <li>• <strong>Technical Details:</strong> Model parameters and performance</li>
                <li>• <strong>Business Recommendations:</strong> Actionable next steps</li>
                <li>• <strong>DA4 Skills Evidence:</strong> Competencies demonstrated</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 font-medium">🎓 DA4 Tip: Professional documentation is crucial for career progression and stakeholder trust!</p>
              </div>
            </div>
          }
        />
      </div>
      
      <p className="text-gray-600 mb-6">
        Generate a comprehensive professional report documenting your entire analysis process, decisions, and findings with DA4 learning context.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={previewReport}
            disabled={!hasEnoughData}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              !hasEnoughData ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview Report</span>
          </button>
          
          <button
            onClick={generatePDFReport}
            disabled={!hasEnoughData || isGenerating}
            className={`btn-primary flex items-center justify-center space-x-2 ${
              !hasEnoughData || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Print/Save PDF</span>
              </>
            )}
          </button>

          <button
            onClick={downloadHTMLReport}
            disabled={!hasEnoughData}
            className={`btn-secondary flex items-center justify-center space-x-2 ${
              !hasEnoughData ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Download HTML</span>
          </button>
        </div>

        {!hasEnoughData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 text-sm font-medium">Complete More Analysis Steps</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Upload data and complete variable selection to generate a comprehensive report. 
                  The more steps you complete, the richer your report will be.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Professional Report Features:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Executive summary with key metrics</li>
              <li>• Complete decision rationale for each step</li>
              <li>• DA4 apprenticeship skills demonstrated</li>
              <li>• Professional formatting with your logo</li>
            </ul>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Model performance analysis & interpretation</li>
              <li>• Business recommendations and next steps</li>
              <li>• Technical methodology documentation</li>
              <li>• Copyright and contact information</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">🎓 DA4 Professional Development:</h4>
          <p className="text-green-800 text-sm">
            This report demonstrates your ability to document analysis processes professionally - 
            a critical skill for DA4 apprentices. Use this report to evidence your competencies 
            and communicate findings to stakeholders effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFReportGenerator;