import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Target,
  Users,
  Activity,
  Zap,
  Plug
} from "lucide-react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

interface KPICardsProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function KPICards({ apiConnections }: KPICardsProps) {
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;

  const kpis = [
    { label: "Spend", icon: DollarSign, color: "blue" },
    { label: "Impressions", icon: Eye, color: "purple" },
    { label: "Clicks", icon: MousePointer, color: "green" },
    { label: "CTR", icon: Activity, color: "orange" },
    { label: "CPC", icon: Target, color: "pink" },
    { label: "CPM", icon: Zap, color: "indigo" },
    { label: "Conversions", icon: Users, color: "cyan" },
    { label: "CPA", icon: Target, color: "teal" },
    { label: "Conversion Value", icon: DollarSign, color: "emerald" },
    { label: "ROAS", icon: TrendingUp, color: "green" }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string; gradient: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-600", gradient: "from-blue-500 to-blue-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-700", icon: "text-purple-600", gradient: "from-purple-500 to-purple-600" },
      green: { bg: "bg-green-100", text: "text-green-700", icon: "text-green-600", gradient: "from-green-500 to-green-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-600", gradient: "from-orange-500 to-orange-600" },
      pink: { bg: "bg-pink-100", text: "text-pink-700", icon: "text-pink-600", gradient: "from-pink-500 to-pink-600" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "text-indigo-600", gradient: "from-indigo-500 to-indigo-600" },
      cyan: { bg: "bg-cyan-100", text: "text-cyan-700", icon: "text-cyan-600", gradient: "from-cyan-500 to-cyan-600" },
      teal: { bg: "bg-teal-100", text: "text-teal-700", icon: "text-teal-600", gradient: "from-teal-500 to-teal-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
    };
    return colors[color] || colors.blue;
  };

  if (!hasAnyConnection) {
    return (
      <div>
        <h2 className="text-gray-900 mb-4">KPIs Principais</h2>
        <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plug className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Conecte suas APIs para visualizar métricas</h3>
            <p className="text-gray-600 mb-6">
              Para começar a visualizar seus KPIs, conecte pelo menos uma plataforma de anúncios na seção de Integrações.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
    <div>
      <h2 className="text-gray-900 mb-4">KPIs Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const colors = getColorClasses(kpi.color);
          
          return (
            <Card key={kpi.label} className="p-6 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{kpi.label}</p>
              <Skeleton className="h-8 w-24 bg-gray-200" />
              <p className="text-xs text-gray-500 mt-2">Aguardando dados da API...</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}