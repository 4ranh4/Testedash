import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plug, Shield } from "lucide-react";

interface AccountHealthProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function AccountHealth({ apiConnections }: AccountHealthProps) {
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;

  if (!hasAnyConnection) {
    return (
      <div className="space-y-6">
        <h2 className="text-gray-900">Saúde da Conta</h2>
        
        <Card className="p-12 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-dashed border-orange-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Monitore a saúde das suas integrações</h3>
            <p className="text-gray-600 mb-6">
              Acompanhe status de APIs, erros de pixel, latência e muito mais após conectar suas plataformas.
            </p>
            <Button 
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg"
              onClick={() => window.location.hash = '#integrations'}
            >
              <Plug className="w-4 h-4 mr-2" />
              Conectar e Monitorar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Saúde da Conta</h2>
      
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-gray-700">Analisando saúde das integrações...</p>
            <p className="text-gray-500 text-sm mt-1">Verificando status das APIs</p>
          </div>
        </div>
      </Card>
    </div>
  );
}