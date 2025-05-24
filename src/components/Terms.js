import React from 'react';
import { ArrowLeft, Shield, Book, AlertTriangle } from 'lucide-react';

const Terms = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <Book className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-lg text-gray-600">
            Educational tool terms and conditions for the DA4 ML Platform
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          
          {/* Educational Purpose */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Educational Tool Notice</h3>
                <p className="text-blue-800 text-sm mt-1">
                  This platform is designed for educational purposes, specifically to support UK Level 4 Data Analyst apprentices 
                  and data science learners. All analysis is performed locally in your browser.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the DA4 ML Platform, you agree to be bound by these Terms of Service. 
              This platform is provided by Peter Baksh for educational purposes to support data analysis learning 
              and DA4 apprenticeship development.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Educational Use Only</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              This platform is intended for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Learning machine learning and data analysis concepts</li>
              <li>Supporting DA4 (Level 4 Data Analyst) apprenticeship training</li>
              <li>Educational demonstrations and practice</li>
              <li>Skill development in statistical analysis and predictive modelling</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Browser-Based Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              All data processing occurs entirely within your web browser. No data is transmitted to external servers, 
              ensuring complete privacy and security of your information. The platform operates as a client-side application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Disclaimer of Warranties</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Important Notice</h4>
                  <p className="text-yellow-800 text-sm mt-1">
                    This is an educational tool. Results should not be used for critical business decisions without proper validation.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The platform is provided "as is" without warranties of any kind. Whilst we strive for accuracy, 
              this tool is designed for learning and should not be relied upon for production business decisions 
              without proper validation by qualified data professionals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Peter Baksh and the DA4 ML Platform shall not be liable for any direct, indirect, incidental, 
              special, or consequential damages resulting from the use or inability to use this educational platform. 
              Users are responsible for validating all results independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The platform design, code, and educational content are the property of Peter Baksh. 
              Users retain full ownership of their data and any models created using the platform. 
              The platform is provided for educational use under these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Privacy and Data</h2>
            <p className="text-gray-700 leading-relaxed">
              As all processing occurs in your browser, we do not collect, store, or transmit your data. 
              See our Privacy Policy for complete details on our privacy practices and commitment to data protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Updates to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms may be updated periodically to reflect platform improvements or legal requirements. 
              Continued use of the platform constitutes acceptance of any updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms or the platform, please contact: 
              <a href="mailto:pdbaksh@gmail.com" className="text-primary-600 hover:text-primary-700 ml-1">
                pdbaksh@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB')}<br/>
              <strong>Copyright:</strong> © 2025 Peter Baksh. All rights reserved.<br/>
              <strong>Platform:</strong> DA4 ML Platform - Educational Machine Learning Tool
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;