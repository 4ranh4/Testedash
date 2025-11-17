import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plug, Lightbulb } from "lucide-react";

interface AutoInsightsProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function AutoInsights({ apiConnections }: AutoInsightsProps) {
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;

  if (!hasAnyConnection) {
    return (
      <div className="space-y-6">
        <h2 className="text-gray-900">Insights Automáticos</h2>
        
        <Card className="p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Receba insights inteligentes com IA</h3>
            <p className="text-gray-600 mb-6">
              Nossa IA analisará seus dados e gerará recomendações personalizadas para otimizar suas campanhas.
            </p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg"
              onClick={() => window.location.hash = '#integrations'}
            >
              <Plug className="w-4 h-4 mr-2" />
              Ativar Insights
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Insights Automáticos</h2>
      
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-gray-700">Gerando insights inteligentes...</p>
            <p className="text-gray-500 text-sm mt-1">Analisando padrões nos dados</p>
          </div>
        </div>
      </Card>
    </div>
  );
}