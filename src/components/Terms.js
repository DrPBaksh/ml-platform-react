import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, BookOpen } from 'lucide-react';

const Terms = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center space-x-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform</span>
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">ML Platform - Educational Data Analysis Tool</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: May 2025</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="card space-y-8">
          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700">
                  This is an educational tool designed for learning purposes. 
                  We are not responsible for any business decisions made based on analyses performed using this platform.
                </p>
              </div>
            </div>
          </div>

          {/* Educational Purpose */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <span>Educational Purpose</span>
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                ML Platform is designed specifically for educational purposes, particularly to support 
                UK Level 4 Data Analyst (DA4) apprentices and students learning data analysis and machine learning concepts.
              </p>
              <p>
                This platform provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Interactive learning modules for statistical analysis</li>
                <li>Hands-on experience with machine learning algorithms</li>
                <li>Step-by-step guidance through data analysis workflows</li>
                <li>Safe environment to practice with real data</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Privacy & Security</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                <strong>Your data never leaves your device.</strong> All analysis is performed entirely in your web browser using JavaScript. 
                We do not collect, store, or transmit any of your data files or analysis results.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">100% Browser-Based Processing</h4>
                <ul className="text-green-700 space-y-1">
                  <li>✓ No data uploaded to servers</li>
                  <li>✓ No data stored remotely</li>
                  <li>✓ No tracking of your analysis</li>
                  <li>✓ Complete privacy for sensitive data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations of Liability</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                <strong>Educational Tool Disclaimer:</strong> This platform is provided for educational and learning purposes only. 
                While we strive for accuracy in our algorithms and explanations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not guarantee the accuracy of analysis results</li>
                <li>We are not responsible for business decisions made using this tool</li>
                <li>Users should validate results with professional data scientists</li>
                <li>This tool should not be used for critical business decisions without validation</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>You may use this platform for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational and learning purposes</li>
                <li>DA4 apprenticeship coursework and practice</li>
                <li>Personal skill development in data analysis</li>
                <li>Academic research and study</li>
              </ul>
              
              <p>You may not use this platform for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Critical business decision-making without validation</li>
                <li>Analysis of illegal or harmful content</li>
                <li>Attempts to reverse engineer or copy the algorithms</li>
                <li>Commercial use without explicit permission</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="prose text-gray-700">
              <p>
                For questions about these terms or the platform, please contact:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="font-semibold">Peter Baksh</p>
                <p>Email: <a href="mailto:pdbaksh@gmail.com" className="text-primary-600 hover:text-primary-700">pdbaksh@gmail.com</a></p>
              </div>
            </div>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Copyright & Ownership</h2>
            <div className="prose text-gray-700">
              <p>
                © 2025 Peter Baksh. All rights reserved.
              </p>
              <p>
                This platform, including its design, algorithms, and educational content, 
                is the intellectual property of Peter Baksh. The platform is provided free of charge 
                for educational purposes.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to Terms</h2>
            <div className="prose text-gray-700">
              <p>
                These terms may be updated occasionally to reflect changes in the platform or legal requirements. 
                Continued use of the platform constitutes acceptance of any updated terms.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;