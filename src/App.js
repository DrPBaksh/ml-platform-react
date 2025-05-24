import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import LogisticRegressionApp from './components/LogisticRegressionApp';

function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleAppSelect = (appType) => {
    setSelectedApp(appType);
    setCurrentPage('app');
  };

  const handleBackToHome = () => {
    setSelectedApp(null);
    setCurrentPage('home');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Listen for footer link clicks
  React.useEffect(() => {
    const handleFooterNavigation = (event) => {
      if (event.target.getAttribute('href') === '/terms') {
        event.preventDefault();
        setCurrentPage('terms');
      } else if (event.target.getAttribute('href') === '/privacy') {
        event.preventDefault();
        setCurrentPage('privacy');
      }
    };

    document.addEventListener('click', handleFooterNavigation);
    return () => document.removeEventListener('click', handleFooterNavigation);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'terms':
        return <Terms onBack={handleBackToHome} />;
      case 'privacy':
        return <Privacy onBack={handleBackToHome} />;
      case 'app':
        return selectedApp === 'logistic-regression' ? <LogisticRegressionApp /> : null;
      case 'home':
      default:
        return (
          <>
            <Hero onAppSelect={handleAppSelect} />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onBackToHome={handleBackToHome} 
        showBackButton={currentPage !== 'home'} 
      />
      
      {renderCurrentPage()}
    </div>
  );
}

export default App;