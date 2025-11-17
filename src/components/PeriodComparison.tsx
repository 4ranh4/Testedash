import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plug, GitCompare } from "lucide-react";

interface PeriodComparisonProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function PeriodComparison({ apiConnections }: PeriodComparisonProps) {
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;

  if (!hasAnyConnection) {
    return (
      <div className="space-y-6">
        <h2 className="text-gray-900">Comparação entre Períodos</h2>
        
        <Card className="p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <GitCompare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Compare períodos após conectar suas APIs</h3>
            <p className="text-gray-600 mb-6">
              Analise a evolução das suas campanhas comparando diferentes períodos de tempo.
            </p>
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
              onClick={() => window.location.hash = '#integrations'}
            >
              <Plug className="w-4 h-4 mr-2" />
              Conectar APIs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Comparação entre Períodos</h2>
      
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <GitCompare className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-gray-700">Carregando comparações...</p>
            <p className="text-gray-500 text-sm mt-1">Processando dados da API</p>
          </div>
        </div>
      </Card>
    </div>
  );
}