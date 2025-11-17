import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plug, Facebook, Search, Play } from "lucide-react";

interface PlatformSectionsProps {
  platform: "meta" | "google" | "tiktok";
  isConnected: boolean;
}

export function PlatformSections({ platform, isConnected }: PlatformSectionsProps) {
  const platformData = {
    meta: {
      name: "Meta Ads",
      color: "#0084FF",
      icon: Facebook,
      description: "Facebook e Instagram Ads"
    },
    google: {
      name: "Google Ads",
      color: "#4285F4",
      icon: Search,
      description: "Pesquisa, Display e YouTube"
    },
    tiktok: {
      name: "TikTok Ads",
      color: "#000000",
      icon: Play,
      description: "Anúncios em vídeo no TikTok"
    }
  };

  const currentPlatform = platformData[platform];
  const Icon = currentPlatform.icon;

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-900">{currentPlatform.name}</h2>
          <p className="text-gray-600 mt-1">{currentPlatform.description}</p>
        </div>

        <Card 
          className="p-12 text-center border-2 border-dashed"
          style={{ 
            background: `linear-gradient(135deg, ${currentPlatform.color}10, ${currentPlatform.color}05)`,
            borderColor: `${currentPlatform.color}40`
          }}
        >
          <div className="max-w-md mx-auto">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${currentPlatform.color}, ${currentPlatform.color}dd)` }}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Conecte sua conta {currentPlatform.name}</h3>
            <p className="text-gray-600 mb-6">
              Para visualizar métricas, campanhas e relatórios do {currentPlatform.name}, 
              você precisa conectar sua API na seção de Integrações.
            </p>
            <Button 
              className="shadow-xl text-white"
              style={{ background: `linear-gradient(135deg, ${currentPlatform.color}, ${currentPlatform.color}dd)` }}
              onClick={() => window.location.hash = '#integrations'}
            >
              <Plug className="w-4 h-4 mr-2" />
              Ir para Integrações
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">{currentPlatform.name}</h2>
          <p className="text-gray-600 mt-1">Performance detalhada da plataforma</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-300">
          Conectado
        </Badge>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-gray-700">Carregando dados do {currentPlatform.name}...</p>
            <p className="text-gray-500 text-sm mt-1">Sincronizando com a API</p>
          </div>
        </div>
      </Card>
    </div>
  );
}