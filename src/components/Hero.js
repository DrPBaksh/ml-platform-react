import React, { useState } from 'react';
import { ChevronDown, Sparkles, BarChart3, TrendingUp, Zap, Lock, GraduationCap } from 'lucide-react';

const Hero = ({ onAppSelect }) => {
  const [selectedApp, setSelectedApp] = useState('');

  const apps = [
    {
      id: 'logistic-regression',
      name: 'Logistic Regression',
      description: 'Predict binary outcomes with confidence - perfect for DA4 apprentices',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-700',
      available: true,
      da4Skills: ['Statistical Analysis', 'Binary Classification', 'Model Evaluation']
    },
    {
      id: 'linear-regression',
      name: 'Linear Regression',
      description: 'Forecast continuous values and understand relationships',
      icon: TrendingUp,
      color: 'from-green-500 to-green-700',
      available: false,
      da4Skills: ['Predictive Modeling', 'Correlation Analysis']
    },
    {
      id: 'time-series',
      name: 'Time Series Forecasting',
      description: 'Predict future trends and seasonal patterns',
      icon: Zap,
      color: 'from-purple-500 to-purple-700',
      available: false,
      da4Skills: ['Trend Analysis', 'Forecasting', 'Business Intelligence']
    }
  ];

  const handleGetStarted = () => {
    if (selectedApp) {
      onAppSelect(selectedApp);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/20">
              <GraduationCap className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">UK DA4 Apprenticeship Platform</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Data Analysis
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Made Simple
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The complete machine learning platform designed for UK Level 4 Data Analyst apprentices. 
            Master statistical analysis, data visualization, and predictive modeling with our interactive, browser-based tools.
          </p>

          {/* Privacy & DA4 Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">100% Browser-Based</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">DA4 Curriculum Aligned</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Educational Focus</span>
            </div>
          </div>
        </div>

        {/* App Selector */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Learning Module</h2>
            <p className="text-gray-600 mb-6">Each module is designed to build core DA4 apprenticeship competencies</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {apps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    onClick={() => app.available && setSelectedApp(app.id)}
                    className={`card-interactive relative overflow-hidden ${
                      selectedApp === app.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                    } ${!app.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!app.available && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        Coming Soon
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                    
                    {app.da4Skills && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">DA4 Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {app.da4Skills.map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={handleGetStarted}
              disabled={!selectedApp}
              className={`btn-primary text-lg px-8 py-4 ${
                !selectedApp ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Start Learning with {selectedApp ? apps.find(app => app.id === selectedApp)?.name : 'Selected Module'}
            </button>
          </div>
        </div>

        {/* DA4 Features */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {[
            {
              title: 'DA4 Curriculum Aligned',
              description: 'Covers Level 4 Data Analyst apprenticeship standards including statistical analysis, data visualization, and business intelligence',
              icon: '🎓'
            },
            {
              title: 'Complete Privacy',
              description: 'All analysis happens in your browser - your data never leaves your device. Perfect for sensitive business data training',
              icon: '🔒'
            },
            {
              title: 'Learn by Doing',
              description: 'Interactive step-by-step guidance with explanations designed for apprentices and data professionals',
              icon: '⚡'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* DA4 Info Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About the UK Level 4 Data Analyst Apprenticeship</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            The DA4 apprenticeship is a 24-month program that develops skills in data collection, analysis, and visualization. 
            Our platform provides hands-on experience with the tools and techniques you'll need to succeed, including statistical analysis, 
            machine learning fundamentals, and business intelligence - all while keeping your data completely private and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;