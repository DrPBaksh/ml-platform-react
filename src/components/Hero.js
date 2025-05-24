import React, { useState } from 'react';
import { ChevronDown, Sparkles, BarChart3, TrendingUp, Zap } from 'lucide-react';

const Hero = ({ onAppSelect }) => {
  const [selectedApp, setSelectedApp] = useState('');

  const apps = [
    {
      id: 'logistic-regression',
      name: 'Logistic Regression',
      description: 'Predict binary outcomes with confidence',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-700',
      available: true
    },
    {
      id: 'linear-regression',
      name: 'Linear Regression',
      description: 'Forecast continuous values',
      icon: TrendingUp,
      color: 'from-green-500 to-green-700',
      available: false
    },
    {
      id: 'time-series',
      name: 'Time Series Forecasting',
      description: 'Predict future trends',
      icon: Zap,
      color: 'from-purple-500 to-purple-700',
      available: false
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
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Powered by Advanced ML</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Machine Learning
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Made Simple
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your data into actionable insights with our enterprise-grade ML platform. 
            No coding required – just upload, analyze, and predict.
          </p>
        </div>

        {/* App Selector */}
        <div className="mb-12 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your ML Model</h2>
            
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
                    <p className="text-sm text-gray-600">{app.description}</p>
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
              Get Started with {selectedApp ? apps.find(app => app.id === selectedApp)?.name : 'Selected Model'}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {[
            {
              title: 'No Code Required',
              description: 'Intuitive drag-and-drop interface designed for business users',
              icon: '🚀'
            },
            {
              title: 'Enterprise Ready',
              description: 'Production-grade algorithms with detailed reporting',
              icon: '⚡'
            },
            {
              title: 'Instant Insights',
              description: 'Get predictions and analysis in minutes, not hours',
              icon: '✨'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;