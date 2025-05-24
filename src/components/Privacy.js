import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle } from 'lucide-react';

const Privacy = ({ onBack }) => {
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
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600">
            Your privacy is our priority - complete transparency about data handling
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          
          {/* Privacy Guarantee */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">100% Privacy Guarantee</h3>
                <p className="text-green-800 leading-relaxed">
                  <strong>Your data never leaves your computer.</strong> All analysis happens entirely within your web browser. 
                  We cannot see, access, store, or transmit your data because our platform is designed as a completely 
                  client-side application.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How Our Privacy-First Design Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Browser-Based Processing</h4>
                </div>
                <p className="text-blue-800 text-sm">
                  All machine learning algorithms run directly in your browser using JavaScript. 
                  Your CSV files are processed locally without any server communication.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">No Data Transmission</h4>
                </div>
                <p className="text-purple-800 text-sm">
                  Zero data uploads to servers. Your sensitive business data, personal information, 
                  and analysis results remain entirely on your device.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What We Don't Collect</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't collect your CSV data or analysis results</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't store your trained machine learning models</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't track your analysis activities or decisions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't collect personal information or contact details</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't use cookies for tracking or analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>We don't integrate with third-party analytics services</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Technical Implementation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our privacy-first approach is built into the platform's architecture:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Client-Side Processing</h4>
                <p className="text-gray-600 text-sm">
                  All machine learning algorithms, data preprocessing, and visualisation are performed 
                  using client-side JavaScript libraries within your browser.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">No Server Communication</h4>
                <p className="text-gray-600 text-sm">
                  The platform operates as a static web application with no backend servers 
                  for data processing or storage.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Local Storage Only</h4>
                <p className="text-gray-600 text-sm">
                  Any temporary data storage uses your browser's local storage, which remains 
                  entirely on your device and is cleared when you close the browser.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Perfect for Sensitive Data</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our privacy-first design makes the platform ideal for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Commercial and business-sensitive datasets</li>
              <li>Personal information requiring GDPR compliance</li>
              <li>Confidential research and academic data</li>
              <li>Financial and healthcare information</li>
              <li>DA4 apprenticeship training with real business data</li>
              <li>Any scenario where data privacy is paramount</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">GDPR Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              As no personal data is collected, transmitted, or stored by our platform, GDPR compliance 
              is inherent in our design. Users maintain complete control over their data at all times, 
              and no data processing activities occur outside of the user's own browser environment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Educational Context</h2>
            <p className="text-gray-700 leading-relaxed">
              This platform is designed for educational purposes, specifically supporting UK Level 4 Data Analyst 
              apprentices. The privacy-first approach ensures that learners can safely practice with real-world 
              datasets without compromising data security or confidentiality requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions About Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our privacy practices or would like to verify our privacy-first approach, 
              please contact Peter Baksh at: 
              <a href="mailto:pdbaksh@gmail.com" className="text-primary-600 hover:text-primary-700 ml-1">
                pdbaksh@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Verify Our Privacy Commitment</h4>
              <p className="text-blue-800 text-sm">
                Technical users can verify our privacy claims by inspecting the platform's network activity 
                in browser developer tools. You'll see no data transmission to external servers during analysis.
              </p>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB')}<br/>
                <strong>Contact:</strong> pdbaksh@gmail.com<br/>
                <strong>Copyright:</strong> © 2025 Peter Baksh. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;