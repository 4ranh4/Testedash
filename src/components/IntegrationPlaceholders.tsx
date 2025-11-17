import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Facebook, 
  Search, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Link as LinkIcon,
  Settings,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface IntegrationPlaceholdersProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
  onConnectionChange: (connections: { meta: boolean; google: boolean; tiktok: boolean }) => void;
}

interface Account {
  id: string;
  provider: 'meta' | 'google' | 'tiktok';
  advertiserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function IntegrationPlaceholders({ apiConnections, onConnectionChange }: IntegrationPlaceholdersProps) {
  const { user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar contas conectadas
  useEffect(() => {
    if (isAuthenticated) {
      loadAccounts();
    } else {
      setLoading(false);
    }
    
    // Escutar eventos de OAuth
    const handleOAuthSuccess = () => {
      loadAccounts();
      toast.success("Plataforma conectada com sucesso!");
    };

    const handleOAuthError = (event: any) => {
      toast.error(event.detail?.message || "Erro ao conectar plataforma");
    };

    window.addEventListener('oauth-success', handleOAuthSuccess);
    window.addEventListener('oauth-error', handleOAuthError);
    
    return () => {
      window.removeEventListener('oauth-success', handleOAuthSuccess);
      window.removeEventListener('oauth-error', handleOAuthError);
    };
  }, [isAuthenticated]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.listAccounts();
      setAccounts(response.accounts);
      
      // Atualizar estado de conexões
      onConnectionChange({
        meta: response.accounts.some(acc => acc.provider === 'meta'),
        google: response.accounts.some(acc => acc.provider === 'google'),
        tiktok: response.accounts.some(acc => acc.provider === 'tiktok'),
      });
    } catch (error: any) {
      console.error('Error loading accounts:', error);
      if (error.message !== 'HTTP 401') {
        toast.error("Erro ao carregar contas conectadas");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platformId: "meta" | "google" | "tiktok") => {
    if (!isAuthenticated || !user) {
      toast.error("Você precisa estar logado para conectar plataformas");
      return;
    }

    const oauthUrl = api.getOAuthUrl(platformId, user.id);
    
    // Abrir popup OAuth
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      oauthUrl, 
      'OAuth', 
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no`
    );

    // Verificar se popup foi bloqueado
    if (!popup) {
      toast.error("Popup bloqueado! Habilite popups para este site.");
      return;
    }

    toast.info(`Abrindo autenticação ${platformId.toUpperCase()}...`);
    
    // Verificar quando popup fecha
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        // Recarregar contas após 1 segundo
        setTimeout(() => loadAccounts(), 1000);
      }
    }, 500);
  };

  const handleSync = async (platformId: "meta" | "google" | "tiktok") => {
    const account = accounts.find(acc => acc.provider === platformId);
    if (!account) return;

    try {
      setSyncing(platformId);
      toast.info(`Sincronizando ${platformId.toUpperCase()}...`);
      
      const result = await api.syncAccount(account.id);
      
      toast.success(`${platformId.toUpperCase()} sincronizado! ${result.recordsProcessed} registros processados.`);
      await loadAccounts();
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(`Erro ao sincronizar: ${error.message}`);
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (platformId: "meta" | "google" | "tiktok") => {
    const account = accounts.find(acc => acc.provider === platformId);
    if (!account) return;

    if (!confirm(`Deseja realmente desconectar ${platformId.toUpperCase()}? Todos os dados serão removidos.`)) {
      return;
    }

    try {
      await api.deleteAccount(account.id);
      toast.success(`${platformId.toUpperCase()} desconectado!`);
      await loadAccounts();
    } catch (error: any) {
      console.error('Disconnect error:', error);
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const integrations = [
    {
      id: "meta" as const,
      name: "Meta Ads",
      icon: Facebook,
      color: "#0084FF",
      status: apiConnections.meta ? "connected" : "disconnected",
      description: "Conecte sua conta do Facebook Business Manager para importar dados do Meta Ads (Facebook e Instagram).",
      docs: "https://developers.facebook.com/docs/marketing-apis",
    },
    {
      id: "google" as const,
      name: "Google Ads",
      icon: Search,
      color: "#4285F4",
      status: apiConnections.google ? "connected" : "disconnected",
      description: "Conecte sua conta do Google Ads para visualizar campanhas de pesquisa, display e YouTube.",
      docs: "https://developers.google.com/google-ads/api/docs/start",
    },
    {
      id: "tiktok" as const,
      name: "TikTok Ads",
      icon: Play,
      color: "#000000",
      status: apiConnections.tiktok ? "connected" : "disconnected",
      description: "Conecte sua conta do TikTok Ads Manager para rastrear performance de anúncios em vídeo.",
      docs: "https://ads.tiktok.com/marketing_api/docs",
    },
  ];

  const syncStatus = [
    {
      platform: "Meta Ads",
      status: apiConnections.meta ? "success" : "error",
      progress: apiConnections.meta ? 100 : 0,
      message: apiConnections.meta ? "Conectado e pronto" : "Não conectado"
    },
    {
      platform: "Google Ads",
      status: apiConnections.google ? "success" : "error",
      progress: apiConnections.google ? 100 : 0,
      message: apiConnections.google ? "Conectado e pronto" : "Não conectado"
    },
    {
      platform: "TikTok Ads",
      status: apiConnections.tiktok ? "success" : "error",
      progress: apiConnections.tiktok ? 100 : 0,
      message: apiConnections.tiktok ? "Conectado e pronto" : "Não conectado"
    },
  ];

  // Encontrar conta para pegar última sync
  const getAccountInfo = (platformId: string) => {
    const account = accounts.find(acc => acc.provider === platformId);
    if (!account) return null;
    
    const lastSync = new Date(account.updatedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / 60000);
    
    let lastSyncText = "Agora mesmo";
    if (diffMinutes > 0) {
      if (diffMinutes < 60) {
        lastSyncText = `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        lastSyncText = `${hours} hora${hours > 1 ? 's' : ''} atrás`;
      }
    }
    
    return {
      lastSync: lastSyncText,
      advertiserId: account.advertiserId || "N/A"
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Autenticação Necessária</h3>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para conectar plataformas de anúncios.
          </p>
          <Button 
            onClick={() => window.location.hash = 'login'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Integrações e API</h2>
        <p className="text-gray-600 mt-1">Configure as conexões com as plataformas de anúncios via OAuth 2.0</p>
      </div>

      {/* Status de Sincronização */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <RefreshCw className={`w-5 h-5 text-blue-700 mt-1 ${loading ? 'animate-spin' : ''}`} />
          <div>
            <h3 className="text-gray-900 mb-1">Status de Sincronização</h3>
            <p className="text-gray-600 text-sm">
              {loading ? 'Carregando...' : `${accounts.length} plataforma${accounts.length !== 1 ? 's' : ''} conectada${accounts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {syncStatus.map((sync) => (
            <div key={sync.platform} className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-900">{sync.platform}</span>
                {sync.status === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {sync.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{sync.message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    sync.status === "success" ? "bg-gradient-to-r from-green-600 to-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${sync.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Integrações Disponíveis */}
      <div className="space-y-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isConnected = integration.status === "connected";
          const accountInfo = getAccountInfo(integration.id);
          const isSyncing = syncing === integration.id;
          
          return (
            <Card key={integration.id} className="p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-4 rounded-xl shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${integration.color}, ${integration.color}dd)` }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{integration.name}</h3>
                      <Badge 
                        className={isConnected 
                          ? "bg-green-100 text-green-700 border-green-300" 
                          : "bg-gray-100 text-gray-700 border-gray-300"
                        }
                      >
                        {isConnected ? "✓ Conectado" : "○ Desconectado"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{integration.description}</p>
                  </div>
                </div>
                
                <a 
                  href={integration.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {isConnected && accountInfo && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Última sincronização</p>
                    <p className="text-sm text-gray-900">{accountInfo.lastSync}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Account ID</p>
                    <p className="text-sm text-gray-900 font-mono">{accountInfo.advertiserId}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!isConnected ? (
                  <Button 
                    className="flex-1 shadow-lg text-white" 
                    style={{ background: `linear-gradient(135deg, ${integration.color}, ${integration.color}dd)` }}
                    onClick={() => handleConnect(integration.id)}
                    disabled={loading}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Conectar via OAuth
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleSync(integration.id)}
                      disabled={isSyncing}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-2 border-gray-300"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Desconectar
                    </Button>
                  </>
                )}
              </div>

              {!isConnected && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">
                        🔐 Autenticação OAuth 2.0
                      </p>
                      <p className="text-xs text-gray-600">
                        Ao clicar em "Conectar", você será redirecionado para {integration.name} para autorizar o acesso.
                        Seus dados estarão seguros e você poderá revogar o acesso a qualquer momento.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Informações sobre Backend */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg">
        <h3 className="text-gray-900 mb-2">⚙️ Configuração do Backend</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            Para conectar as plataformas, certifique-se de que o backend está rodando e configurado:
          </p>
          <div className="flex gap-2">
            <span className="text-purple-700">1.</span>
            <p>Backend rodando em: <code className="bg-white px-2 py-1 rounded">http://localhost:4000</code></p>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-700">2.</span>
            <p>Credenciais OAuth configuradas no arquivo <code className="bg-white px-2 py-1 rounded">backend/.env</code></p>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-700">3.</span>
            <p>Banco de dados PostgreSQL configurado e migrations executadas</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
