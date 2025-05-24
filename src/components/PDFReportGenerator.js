import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

const PDFReportGenerator = ({ 
  data, 
  selectedColumns, 
  edaResults, 
  preprocessingResults, 
  splitData, 
  model, 
  evaluation,
  analysisDecisions = []
}) => {
  
  const generateHTMLReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ML Analysis Report - DA4 Platform</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 210mm; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
        }
        .header { 
            border-bottom: 3px solid #0ea5e9; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            position: relative;
        }
        .logo { 
            position: absolute; 
            top: 0; 
            right: 0; 
            width: 60px; 
            height: 60px;
            background: url('/logo.png') no-repeat;
            background-size: contain;
        }
        h1 { color: #0ea5e9; margin: 0; font-size: 2.2em; }
        h2 { color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; }
        h3 { color: #475569; margin-top: 25px; }
        .info-box { 
            background: #f8fafc; 
            border-left: 4px solid #0ea5e9; 
            padding: 15px; 
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .warning-box { 
            background: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 15px; 
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .success-box { 
            background: #ecfdf5; 
            border-left: 4px solid #10b981; 
            padding: 15px; 
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .stat-card { 
            background: #f1f5f9; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .stat-value { 
            font-size: 1.8em; 
            font-weight: bold; 
            color: #0ea5e9; 
            display: block;
        }
        .stat-label { 
            color: #64748b; 
            font-size: 0.9em; 
            margin-top: 5px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
        }
        th, td { 
            border: 1px solid #e2e8f0; 
            padding: 12px; 
            text-align: left;
        }
        th { 
            background: #f8fafc; 
            font-weight: 600;
            color: #374151;
        }
        .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 2px solid #e2e8f0; 
            color: #64748b; 
            font-size: 0.9em;
        }
        .decision-item {
            background: #e0f2fe;
            margin: 10px 0;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #0284c7;
        }
        .explanation {
            background: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #bae6fd;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo"></div>
        <h1>Machine Learning Analysis Report</h1>
        <p><strong>Platform:</strong> DA4 ML Platform | <strong>Generated:</strong> ${currentDate} at ${currentTime}</p>
        <p><strong>Analysis Type:</strong> Logistic Regression | <strong>Analyst:</strong> DA4 Apprentice</p>
    </div>

    <div class="info-box">
        <h3>🎓 DA4 Learning Objectives Achieved</h3>
        <p>This analysis demonstrates core Level 4 Data Analyst competencies including data quality assessment, 
        statistical analysis, predictive modeling, and results interpretation.</p>
    </div>

    <h2>📊 Dataset Overview</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${data?.data?.length || 0}</span>
            <div class="stat-label">Total Records</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${data?.meta?.fields?.length || 0}</span>
            <div class="stat-label">Total Columns</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${selectedColumns?.predictors?.length || 0}</span>
            <div class="stat-label">Selected Predictors</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">1</span>
            <div class="stat-label">Target Variable</div>
        </div>
    </div>

    <h2>🎯 Variable Selection & Rationale</h2>
    <h3>Target Variable</h3>
    <p><strong>${selectedColumns?.target || 'Not specified'}</strong></p>
    <div class="explanation">
        <strong>DA4 Learning:</strong> The target variable is what we're trying to predict. 
        For logistic regression, this should be a binary or categorical variable with limited categories.
    </div>

    <h3>Predictor Variables</h3>
    <ul>
        ${selectedColumns?.predictors?.map(pred => `<li><strong>${pred}</strong></li>`).join('') || '<li>No predictors selected</li>'}
    </ul>
    <div class="explanation">
        <strong>DA4 Learning:</strong> Predictor variables (features) are used to make predictions about the target. 
        We selected these based on their potential relationship with the outcome and data quality.
    </div>

    ${edaResults ? `
    <h2>🔍 Exploratory Data Analysis Findings</h2>
    
    <h3>Target Variable Distribution</h3>
    ${edaResults.targetDistribution ? `
    <table>
        <tr><th>Value</th><th>Count</th><th>Percentage</th></tr>
        ${edaResults.targetDistribution.map(item => 
            `<tr><td>${item.name}</td><td>${item.count}</td><td>${item.percentage}%</td></tr>`
        ).join('')}
    </table>
    ` : '<p>Distribution analysis not available.</p>'}
    
    <div class="explanation">
        <strong>DA4 Learning:</strong> Class distribution shows if our dataset is balanced. 
        Highly imbalanced data (e.g., 90%/10%) may require special handling techniques like resampling or adjusted metrics.
    </div>

    ${edaResults.warnings && edaResults.warnings.length > 0 ? `
    <h3>Data Quality Insights</h3>
    <div class="warning-box">
        <h4>⚠️ Issues Identified:</h4>
        <ul>
            ${edaResults.warnings.map(warning => `<li>${warning.message}</li>`).join('')}
        </ul>
    </div>
    <div class="explanation">
        <strong>DA4 Learning:</strong> Data quality issues are common in real-world datasets. 
        Identifying and addressing these early prevents problems during modeling and ensures reliable results.
    </div>
    ` : ''}
    ` : ''}

    ${preprocessingResults ? `
    <h2>🧹 Data Preprocessing Steps</h2>
    <div class="success-box">
        <h4>✅ Preprocessing Complete</h4>
        <ul>
            ${preprocessingResults.steps?.map(step => `<li>${step}</li>`).join('') || '<li>No preprocessing steps recorded</li>'}
        </ul>
    </div>
    <div class="explanation">
        <strong>DA4 Learning:</strong> Data preprocessing is crucial for machine learning success. 
        This includes handling missing values, encoding categorical variables, and scaling numerical features.
    </div>
    ` : ''}

    ${splitData ? `
    <h2>📋 Train/Test Split Configuration</h2>
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
            <span class="stat-value">${Math.round((splitData.splitRatio || 0.8) * 100)}%</span>
            <div class="stat-label">Training Percentage</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${splitData.stratify ? 'Yes' : 'No'}</span>
            <div class="stat-label">Stratified</div>
        </div>
    </div>
    <div class="explanation">
        <strong>DA4 Learning:</strong> We split data to train the model on one portion and test on unseen data. 
        This helps estimate how well our model will perform on new, real-world data.
    </div>
    ` : ''}

    ${model ? `
    <h2>🤖 Model Training Results</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">${model.regularization?.toUpperCase() || 'N/A'}</span>
            <div class="stat-label">Regularization Type</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${model.regularizationStrength || 'N/A'}</span>
            <div class="stat-label">Regularization Strength</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${model.trainingAccuracy ? (model.trainingAccuracy * 100).toFixed(1) + '%' : 'N/A'}</span>
            <div class="stat-label">Training Accuracy</div>
        </div>
        <div class="stat-card">
            <span class="stat-value">${model.convergence ? 'Yes' : 'No'}</span>
            <div class="stat-label">Model Convergence</div>
        </div>
    </div>

    ${model.coefficients ? `
    <h3>Feature Coefficients</h3>
    <table>
        <tr><th>Feature</th><th>Coefficient</th><th>Interpretation</th></tr>
        ${model.coefficients.map(coef => `
        <tr>
            <td>${coef.feature}</td>
            <td>${coef.coefficient.toFixed(4)}</td>
            <td>${Math.abs(coef.coefficient) > 0.5 ? 'Strong influence' : 'Moderate influence'}</td>
        </tr>
        `).join('')}
    </table>
    ` : ''}

    <div class="explanation">
        <strong>DA4 Learning:</strong> Model coefficients show how much each feature influences the prediction. 
        Positive coefficients increase the likelihood of the positive class, while negative coefficients decrease it.
    </div>
    ` : ''}

    ${evaluation ? `
    <h2>📈 Model Performance Evaluation</h2>
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

    ${evaluation.confusionMatrix ? `
    <h3>Confusion Matrix</h3>
    <table style="width: 50%; margin: 20px auto;">
        <tr><th></th><th>Predicted Negative</th><th>Predicted Positive</th></tr>
        <tr><th>Actual Negative</th><td>${evaluation.confusionMatrix.trueNegative}</td><td>${evaluation.confusionMatrix.falsePositive}</td></tr>
        <tr><th>Actual Positive</th><td>${evaluation.confusionMatrix.falseNegative}</td><td>${evaluation.confusionMatrix.truePositive}</td></tr>
    </table>
    ` : ''}

    <div class="explanation">
        <strong>DA4 Learning:</strong> Performance metrics help us understand how well our model works:
        <ul>
            <li><strong>Accuracy:</strong> Overall correctness of predictions</li>
            <li><strong>Precision:</strong> Of positive predictions, how many were correct?</li>
            <li><strong>Recall:</strong> Of actual positives, how many did we catch?</li>
            <li><strong>F1-Score:</strong> Balanced measure combining precision and recall</li>
        </ul>
    </div>
    ` : ''}

    <h2>🎯 Business Recommendations</h2>
    <div class="info-box">
        <h4>Key Findings & Actions</h4>
        <ul>
            <li><strong>Model Performance:</strong> ${evaluation?.metrics?.accuracy ? 
                (evaluation.metrics.accuracy > 0.85 ? 'Excellent - suitable for production use' : 
                 evaluation.metrics.accuracy > 0.75 ? 'Good - consider minor improvements' : 
                 'Needs improvement - investigate data quality and feature selection') : 'To be evaluated'}</li>
            <li><strong>Data Quality:</strong> ${edaResults?.warnings?.length > 0 ? 
                'Address identified data quality issues before deployment' : 
                'Data quality appears acceptable for modeling'}</li>
            <li><strong>Next Steps:</strong> ${model ? 
                'Validate model performance with additional test data and consider deployment' : 
                'Complete model training and evaluation phases'}</li>
        </ul>
    </div>

    <h2>🎓 DA4 Skills Demonstrated</h2>
    <div class="success-box">
        <h4>Level 4 Data Analyst Competencies Applied:</h4>
        <ul>
            <li>✅ Data collection and validation techniques</li>
            <li>✅ Statistical analysis and interpretation</li>
            <li>✅ Predictive modeling methodology</li>
            <li>✅ Data visualization and communication</li>
            <li>✅ Business insight generation</li>
            <li>✅ Technical documentation skills</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>Generated by:</strong> ML Platform - DA4 Apprenticeship Tool</p>
        <p><strong>Copyright:</strong> © 2025 Peter Baksh. All rights reserved.</p>
        <p><strong>Disclaimer:</strong> This report is generated for educational purposes. 
        All analysis is performed locally in your browser with complete data privacy.</p>
        <p><strong>Contact:</strong> pdbaksh@gmail.com</p>
    </div>
</body>
</html>`;
  };

  const downloadPDF = () => {
    const htmlContent = generateHTMLReport();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ML-Analysis-Report-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewReport = () => {
    const htmlContent = generateHTMLReport();
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const hasEnoughData = data && selectedColumns && (edaResults || model || evaluation);

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Analysis Report</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Generate a comprehensive PDF report of your analysis with professional formatting, 
        including all decisions made during EDA and detailed explanations at beginner/intermediate level.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            onClick={downloadPDF}
            disabled={!hasEnoughData}
            className={`btn-primary flex items-center justify-center space-x-2 ${
              !hasEnoughData ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>

        {!hasEnoughData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              Complete more analysis steps to generate a comprehensive report. 
              The report will include all your decisions and explanations.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Report Includes:</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Dataset overview and variable selection rationale</li>
            <li>• Exploratory data analysis findings with interpretations</li>
            <li>• Data preprocessing steps and justifications</li>
            <li>• Model training configuration and results</li>
            <li>• Performance evaluation with business implications</li>
            <li>• DA4 apprenticeship skills demonstrated</li>
            <li>• Professional formatting with your logo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFReportGenerator;