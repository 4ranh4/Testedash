import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { TopFilters } from "./components/TopFilters";
import { KPICards } from "./components/KPICards";
import { MainCharts } from "./components/MainCharts";
import { PlatformSections } from "./components/PlatformSections";
import { PeriodComparison } from "./components/PeriodComparison";
import { AccountHealth } from "./components/AccountHealth";
import { AutoInsights } from "./components/AutoInsights";
import { IntegrationPlaceholders } from "./components/IntegrationPlaceholders";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
import { AuthPage } from "./components/AuthPage";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedView, setSelectedView] = useState("dashboard");
  const [filters, setFilters] = useState({
    period: "30days",
    platform: "all",
    objective: "all",
    currency: "BRL"
  });

  // Estado de conexão das APIs
  const [apiConnections, setApiConnections] = useState({
    meta: false,
    google: false,
    tiktok: false
  });

  // Listener para navegação por hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setSelectedView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Checa o hash inicial

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated && selectedView !== 'login') {
    window.location.hash = 'login';
    return <AuthPage />;
  }

  // Show login page
  if (selectedView === 'login') {
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar 
        selectedView={selectedView} 
        onViewChange={setSelectedView} 
      />
      
      <main className="flex-1 ml-64">
        <TopFilters filters={filters} onFiltersChange={setFilters} />
        
        <div className="p-8 space-y-8">
          {selectedView === "dashboard" && (
            <>
              <KPICards apiConnections={apiConnections} />
              <MainCharts apiConnections={apiConnections} />
              <PeriodComparison apiConnections={apiConnections} />
              <AccountHealth apiConnections={apiConnections} />
              <AutoInsights apiConnections={apiConnections} />
            </>
          )}
          
          {selectedView === "meta" && (
            <PlatformSections platform="meta" isConnected={apiConnections.meta} />
          )}
          
          {selectedView === "google" && (
            <PlatformSections platform="google" isConnected={apiConnections.google} />
          )}
          
          {selectedView === "tiktok" && (
            <PlatformSections platform="tiktok" isConnected={apiConnections.tiktok} />
          )}
          
          {selectedView === "reports" && (
            <ReportsPage apiConnections={apiConnections} />
          )}
          
          {selectedView === "settings" && (
            <SettingsPage />
          )}
          
          {selectedView === "integrations" && (
            <IntegrationPlaceholders 
              apiConnections={apiConnections}
              onConnectionChange={setApiConnections}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </AuthProvider>
  );
}