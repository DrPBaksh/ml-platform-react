import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LogisticRegressionApp from './components/LogisticRegressionApp';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import About from './components/About';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedApp, setSelectedApp] = useState(null);

  const handleAppSelect = (appId) => {
    setSelectedApp(appId);
    setCurrentView('app');
  };

  const handleSkipToModel = (appId) => {
    setSelectedApp(appId);
    setCurrentView('app-skip-training');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedApp(null);
  };

  const handleNavigate = (page) => {
    setCurrentView(page);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Header onNavigate={handleNavigate} />
            <Hero onAppSelect={handleAppSelect} onSkipToModel={handleSkipToModel} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      case 'app':
        return (
          <>
            <Header onNavigate={handleNavigate} showBackButton onBack={handleBackToHome} />
            {selectedApp === 'logistic-regression' && (
              <LogisticRegressionApp skipTraining={false} />
            )}
          </>
        );
      case 'app-skip-training':
        return (
          <>
            <Header onNavigate={handleNavigate} showBackButton onBack={handleBackToHome} />
            {selectedApp === 'logistic-regression' && (
              <LogisticRegressionApp skipTraining={true} />
            )}
          </>
        );
      case 'terms':
        return <Terms onBack={handleBackToHome} />;
      case 'privacy':
        return <Privacy onBack={handleBackToHome} />;
      case 'about':
        return <About onBack={handleBackToHome} />;
      default:
        return (
          <>
            <Header onNavigate={handleNavigate} />
            <Hero onAppSelect={handleAppSelect} onSkipToModel={handleSkipToModel} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;