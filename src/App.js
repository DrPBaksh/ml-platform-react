import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LogisticRegressionApp from './components/LogisticRegressionApp';

function App() {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleAppSelect = (appType) => {
    setSelectedApp(appType);
  };

  const handleBackToHome = () => {
    setSelectedApp(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBackToHome={handleBackToHome} showBackButton={selectedApp !== null} />
      
      {selectedApp === null ? (
        <>
          <Hero onAppSelect={handleAppSelect} />
          <Footer />
        </>
      ) : selectedApp === 'logistic-regression' ? (
        <LogisticRegressionApp />
      ) : null}
    </div>
  );
}

export default App;