import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { PageContainer } from './components/layout/PageContainer';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { SimulationModal } from './components/common/SimulationModal';

import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { LiveRiskMapPage } from './pages/LiveRiskMapPage';
import { ZoneAnalysisPage } from './pages/ZoneAnalysisPage';
import { ExposurePage } from './pages/ExposurePage';
import { RainfallPage } from './pages/RainfallPage';
import { SatellitePage } from './pages/SatellitePage';
import { TerrainPage } from './pages/TerrainPage';
import { AlertsPage } from './pages/AlertsPage';
import { FieldFeedbackPage } from './pages/FieldFeedbackPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { DataHealthPage } from './pages/DataHealthPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    activePage,
    isSimulating,
    simulationStep,
    simulationStepName,
    showSimulationModal,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'map':
        return <LiveRiskMapPage />;
      case 'zones':
        return <ZoneAnalysisPage />;
      case 'exposure':
        return <ExposurePage />;
      case 'rainfall':
        return <RainfallPage />;
      case 'satellite':
        return <SatellitePage />;
      case 'terrain':
        return <TerrainPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'feedback':
        return <FieldFeedbackPage />;
      case 'model':
        return <ModelPerformancePage />;
      case 'health':
        return <DataHealthPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Prototype & Demo Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main App Layout: Sidebar + Main Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop Sidebar */}
        <div style={{ display: 'flex', height: '100%' }}>
          <Sidebar isCollapsed={sidebarCollapsed} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              backgroundColor: 'rgba(3, 8, 16, 0.8)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
            }}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ height: '100%', width: '260px' }}>
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {/* Topbar */}
          <Topbar onToggleSidebar={() => setMobileSidebarOpen(true)} />

          {/* Active View Container */}
          <PageContainer>{renderActivePage()}</PageContainer>
        </div>
      </div>

      {/* Pipeline Simulation Animated Modal */}
      <SimulationModal
        isOpen={showSimulationModal}
        currentStep={simulationStep}
        stepName={simulationStepName}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
