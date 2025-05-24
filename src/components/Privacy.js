import React from 'react';
import { ArrowLeft, Lock, Eye, Shield, Server } from 'lucide-react';

const Privacy = ({ onBack }) => {
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
              <Lock className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Your Data Stays Private and Secure</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: May 2025</p>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="card space-y-8">
          {/* Privacy Promise */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Our Privacy Promise</h3>
                <p className="text-green-700">
                  <strong>Your data never leaves your device.</strong> All analysis happens in your browser. 
                  We cannot see, access, or store any of your data files or results.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Server className="w-6 h-6 text-primary-600" />
              <span>How Browser-Based Analysis Works</span>
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Our platform uses advanced JavaScript technologies to perform all data analysis 
                directly in your web browser, without any server communication for your data:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">✓ What Happens Locally</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• CSV file parsing and validation</li>
                    <li>• Statistical calculations</li>
                    <li>• Machine learning algorithms</li>
                    <li>• Data visualization</li>
                    <li>• Report generation</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">✗ What Never Happens</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Data uploaded to servers</li>
                    <li>• Files stored remotely</li>
                    <li>• Analysis results transmitted</li>
                    <li>• User data tracking</li>
                    <li>• Third-party data sharing</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data We Don't Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Eye className="w-6 h-6 text-gray-600" />
              <span>Data We Don't Collect</span>
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>Because all processing happens in your browser, we do not collect:</p>
              <ul className="grid md:grid-cols-2 gap-2 list-disc pl-6 space-y-1">
                <li>Your CSV files or data content</li>
                <li>Analysis results or outputs</li>
                <li>Statistical calculations</li>
                <li>Model predictions</li>
                <li>Downloaded reports</li>
                <li>User behavior within analysis</li>
                <li>Data patterns or insights</li>
                <li>Column names or data structure</li>
              </ul>
            </div>
          </section>

          {/* What We May Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limited Technical Information</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Like most websites, we may collect minimal technical information to ensure the platform works properly:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Technical Information Only</h4>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Browser type and version (for compatibility)</li>
                  <li>• Device type (mobile/desktop for responsive design)</li>
                  <li>• Page load times (for performance optimization)</li>
                  <li>• Error messages (for bug fixes)</li>
                </ul>
                <p className="text-yellow-700 text-sm mt-3">
                  <strong>Note:</strong> This information cannot be linked to your data analysis activities.
                </p>
              </div>
            </div>
          </section>

          {/* Educational Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safe for Educational Use</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                Our privacy-first approach makes this platform ideal for educational environments:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Perfect for:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>DA4 apprenticeship coursework</li>
                    <li>University data science courses</li>
                    <li>Corporate training with sensitive data</li>
                    <li>Personal skill development</li>
                    <li>Portfolio projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>No data governance concerns</li>
                    <li>GDPR compliance by design</li>
                    <li>Safe for confidential data</li>
                    <li>No server security risks</li>
                    <li>Works offline once loaded</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Storage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Storage Only</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                The platform may use your browser's local storage for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Saving your progress through analysis steps</li>
                <li>Remembering your preferences (like theme settings)</li>
                <li>Caching the application for faster loading</li>
              </ul>
              <p>
                <strong>Important:</strong> All local storage remains on your device and can be cleared 
                at any time through your browser settings.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>The platform uses these third-party services for functionality (not data collection):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Fonts:</strong> For typography (no personal data shared)</li>
                <li><strong>CDN Services:</strong> For faster loading of JavaScript libraries</li>
              </ul>
              <p>
                None of these services have access to your analysis data, which remains in your browser.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="prose text-gray-700 space-y-4">
              <p>Because we don't collect your data, you automatically have:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Complete control:</strong> Your data never leaves your device</li>
                <li><strong>Right to deletion:</strong> Clear your browser data anytime</li>
                <li><strong>Data portability:</strong> Download your results directly</li>
                <li><strong>No tracking:</strong> We can't build profiles about you</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy</h2>
            <div className="prose text-gray-700">
              <p>
                If you have questions about our privacy practices, please contact:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="font-semibold">Peter Baksh</p>
                <p>Email: <a href="mailto:pdbaksh@gmail.com" className="text-primary-600 hover:text-primary-700">pdbaksh@gmail.com</a></p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <div className="prose text-gray-700">
              <p>
                This privacy policy may be updated to reflect changes in our practices or legal requirements. 
                Any changes will be posted on this page with an updated date.
              </p>
              <p>
                <strong>Current version:</strong> May 2025
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;