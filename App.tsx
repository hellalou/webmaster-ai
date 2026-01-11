
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DomainManager from './components/DomainManager';
import HostingDashboard from './components/HostingDashboard';
import BlogManager from './components/BlogManager';
import TemplateLibrary from './components/TemplateLibrary';
import ContentAI from './components/ContentAI';
import SEOTools from './components/SEOTools';
import LandingPage from './components/LandingPage';
import ChatBot from './components/ChatBot';
import SiteBuilder from './components/SiteBuilder';
import { AppView } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeView, setActiveView] = React.useState<AppView>('analysis');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'analysis':
        return <Dashboard />;
      case 'builder':
        return <SiteBuilder />;
      case 'templates':
        return <TemplateLibrary />;
      case 'domains':
        return <DomainManager />;
      case 'hosting':
        return <HostingDashboard />;
      case 'blog':
        return <BlogManager />;
      case 'content-ai':
        return <ContentAI />;
      case 'seo':
        return <SEOTools />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Layout activeView={activeView} setView={setActiveView} onLogout={handleLogout}>
        {renderContent()}
      </Layout>
      <ChatBot />
    </>
  );
}

export default App;
