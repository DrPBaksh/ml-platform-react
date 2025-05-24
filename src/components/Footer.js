import React from 'react';
import { Heart, Shield, FileText, Mail, Globe, Lock } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="ML Platform Logo" 
                className="w-10 h-10 rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold">ML</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">ML Platform</h3>
                <p className="text-sm text-gray-400">Data Analysis Made Simple</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The complete machine learning platform designed for UK DA4 (Level 4 Data Analyst) apprentices and data professionals. 
              Master data analysis, visualisation, and machine learning with our browser-based educational tool.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <Lock className="h-4 w-4" />
                <span>100% Browser-Based - Your Data Never Leaves Your Device</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>© 2025 Peter Baksh. Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>for DA4 apprentices</span>
              </div>
            </div>
          </div>

          {/* DA4 Apprenticeship Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">DA4 Apprenticeship</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-gray-400">
                  Perfect for Level 4 Data Analyst apprentices learning:
                </p>
              </li>
              <li className="text-gray-300">• Statistical Analysis</li>
              <li className="text-gray-300">• Data Visualisation</li>
              <li className="text-gray-300">• Machine Learning Basics</li>
              <li className="text-gray-300">• Business Intelligence</li>
              <li>
                <a href="https://www.gov.uk/government/publications/apprenticeship-standard-data-analyst" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary-400 hover:text-primary-300 transition-colors duration-200 flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>Official DA4 Standard</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Support & Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigate('terms')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('privacy')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('about')}
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>About</span>
                </button>
              </li>
              <li>
                <a href="mailto:pdbaksh@gmail.com" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Peter Baksh. All rights reserved. Designed for educational purposes.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-500 text-center">
                ⚠️ Educational Tool Only - Browser-Based Analysis - We Are Not Responsible For Decisions Made Using This Tool
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;