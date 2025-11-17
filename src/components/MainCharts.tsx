import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plug, BarChart3 } from "lucide-react";

interface MainChartsProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function MainCharts({ apiConnections }: MainChartsProps) {
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;

  if (!hasAnyConnection) {
    return (
      <div className="space-y-6">
        <h2 className="text-gray-900">Gráficos Principais</h2>
        
        <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Gráficos disponíveis após conectar APIs</h3>
            <p className="text-gray-600 mb-6">
              Visualize gráficos de performance, ROAS, distribuição de gastos e muito mais após conectar suas plataformas de anúncios.
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg"
              onClick={() => window.location.hash = '#integrations'}
            >
              <Plug className="w-4 h-4 mr-2" />
              Conectar Plataformas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Gráficos Principais</h2>
      
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-gray-700">Carregando dados dos gráficos...</p>
            <p className="text-gray-500 text-sm mt-1">Aguardando resposta da API</p>
          </div>
        </div>
      </Card>
    </div>
  );
}