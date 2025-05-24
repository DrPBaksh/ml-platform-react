import React from 'react';
import { ArrowLeft, User, Heart, Brain, Mail, GraduationCap, Code } from 'lucide-react';

const About = ({ onBack }) => {
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
            <User className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">About</h1>
          </div>
          <p className="text-lg text-gray-600">
            Meet the creator behind the DA4 ML Platform
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Personal Introduction */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">PB</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Peter Baksh</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 leading-relaxed text-lg">
                    My name is Peter Baksh. I am passionate about AI and data science and wish to make an 
                    accessible tool for all to use.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-900">My Mission</h3>
              </div>
              <p className="text-purple-800 leading-relaxed">
                To democratise machine learning education by creating intuitive, browser-based tools that 
                make data science accessible to everyone - from beginners to DA4 apprentices to experienced analysts.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-900">Education Focus</h3>
              </div>
              <p className="text-green-800 leading-relaxed">
                Specifically designed to support UK Level 4 Data Analyst apprentices with hands-on, 
                practical learning experiences that build real-world skills in statistical analysis and predictive modelling.
              </p>
            </div>
          </div>

          {/* Why This Platform */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why I Built This Platform</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Having worked extensively with data science and machine learning, I noticed a significant gap 
                between complex theoretical concepts and practical, accessible learning tools. Many existing platforms 
                either require extensive technical setup or compromise user privacy by processing data on remote servers.
              </p>
              
              <p>
                The DA4 ML Platform addresses both challenges by providing:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Complete Privacy:</strong> All processing happens in your browser - your data never leaves your device</li>
                <li><strong>Educational Focus:</strong> Designed specifically for learning with comprehensive explanations</li>
                <li><strong>Professional Quality:</strong> Enterprise-grade analysis capabilities without the complexity</li>
                <li><strong>Accessibility:</strong> No installation required - works in any modern web browser</li>
                <li><strong>DA4 Alignment:</strong> Perfectly aligned with UK Level 4 Data Analyst apprenticeship requirements</li>
              </ul>
            </div>
          </section>

          {/* Technical Innovation */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Technical Innovation</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Code className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Browser-Based Machine Learning</h4>
                  <p className="text-gray-700 leading-relaxed">
                    This platform represents a significant technical achievement: running complete machine learning 
                    workflows entirely within web browsers using modern JavaScript libraries. This approach ensures 
                    data privacy whilst providing professional-grade analysis capabilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values & Principles */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Core Values</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Privacy First</h4>
                <p className="text-gray-600 text-sm">
                  Your data security and privacy are non-negotiable priorities in every design decision.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Education Focused</h4>
                <p className="text-gray-600 text-sm">
                  Every feature is designed to teach and explain, not just perform calculations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
                <p className="text-gray-600 text-sm">
                  Making advanced data science tools available to everyone, regardless of technical background.
                </p>
              </div>
            </div>
          </section>

          {/* Future Vision */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Looking Forward</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed">
                The DA4 ML Platform is just the beginning. My vision is to expand this educational ecosystem 
                with additional machine learning algorithms, advanced statistical methods, and specialised tools 
                for different industries - all whilst maintaining our core commitment to privacy, education, and accessibility.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-primary-600" />
                <div>
                  <h4 className="font-semibold text-primary-900 mb-1">Contact Me</h4>
                  <p className="text-primary-800 text-sm mb-2">
                    I'd love to hear from educators, apprentices, and data professionals using the platform.
                  </p>
                  <a 
                    href="mailto:pdbaksh@gmail.com" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    pdbaksh@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              <strong>Platform:</strong> DA4 ML Platform - Making Machine Learning Accessible<br/>
              <strong>Copyright:</strong> © 2025 Peter Baksh. All rights reserved.<br/>
              <strong>Built with:</strong> React, Tailwind CSS, and a passion for education
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;