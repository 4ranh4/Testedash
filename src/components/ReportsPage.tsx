import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Plus,
  Trash2,
  Send,
  Eye,
  Clock,
  TrendingUp,
  DollarSign,
  Plug
} from "lucide-react";
import { Badge } from "./ui/badge";

interface ReportsPageProps {
  apiConnections: {
    meta: boolean;
    google: boolean;
    tiktok: boolean;
  };
}

export function ReportsPage({ apiConnections }: ReportsPageProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const hasAnyConnection = apiConnections.meta || apiConnections.google || apiConnections.tiktok;
  
  const availableMetrics = [
    { id: "spend", label: "Spend (Custo)", category: "Investimento" },
    { id: "impressions", label: "Impressões", category: "Alcance" },
    { id: "clicks", label: "Clicks", category: "Engajamento" },
    { id: "ctr", label: "CTR (%)", category: "Engajamento" },
    { id: "cpc", label: "CPC", category: "Custo" },
    { id: "cpm", label: "CPM", category: "Custo" },
    { id: "conversions", label: "Conversões", category: "Conversão" },
    { id: "cpa", label: "CPA", category: "Conversão" },
    { id: "conversionValue", label: "Valor de Conversão", category: "Conversão" },
    { id: "roas", label: "ROAS", category: "Performance" },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  if (!hasAnyConnection) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-gray-900">Relatórios Personalizados</h2>
          <p className="text-gray-600 mt-1">Crie, agende e exporte relatórios customizados</p>
        </div>

        <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Conecte suas APIs para gerar relatórios</h3>
            <p className="text-gray-600 mb-6">
              Para criar relatórios personalizados, você precisa primeiro conectar pelo menos uma plataforma de anúncios.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Relatórios Personalizados</h2>
          <p className="text-gray-600 mt-1">Crie, agende e exporte relatórios customizados</p>
        </div>
      </div>

      {/* Criar Novo Relatório */}
      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200">
        <h3 className="text-gray-900 mb-6">Configurar Novo Relatório</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-gray-700 mb-2 block">Nome do Relatório</Label>
              <Input 
                placeholder="Ex: Análise Semanal de Performance" 
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label className="text-gray-700 mb-2 block">Descrição (opcional)</Label>
              <Input 
                placeholder="Descrição do relatório..." 
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 mb-2 block">Período</Label>
                <Select defaultValue="30days">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="currentMonth">Mês atual</SelectItem>
                    <SelectItem value="lastMonth">Mês anterior</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Plataforma</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="tiktok">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 mb-2 block">Formato de Exportação</Label>
              <Select defaultValue="pdf">
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON (API)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 mb-3 block">Frequência de Envio</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="manual" defaultChecked />
                  <label htmlFor="manual" className="text-sm text-gray-700">Manual (sob demanda)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="daily" />
                  <label htmlFor="daily" className="text-sm text-gray-700">Diário (todo dia às 8h)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="weekly" />
                  <label htmlFor="weekly" className="text-sm text-gray-700">Semanal (segunda-feira)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="monthly" />
                  <label htmlFor="monthly" className="text-sm text-gray-700">Mensal (dia 1º)</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-gray-700 mb-3 block">Métricas a Incluir</Label>
            <Card className="p-4 max-h-96 overflow-y-auto border-2 border-gray-200">
              <div className="space-y-3">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={() => toggleMetric(metric.id)}
                      />
                      <label htmlFor={metric.id} className="text-sm text-gray-900 cursor-pointer">
                        {metric.label}
                      </label>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {metric.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {selectedMetrics.length} métrica(s) selecionada(s)
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Gerar e Baixar
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Salvar e Agendar
          </Button>
        </div>
      </Card>

      {/* Templates Prontos */}
      <div>
        <h3 className="text-gray-900 mb-4">Templates Prontos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Performance Overview",
              description: "Visão geral de todas as métricas principais",
              icon: TrendingUp,
              color: "from-blue-500 to-blue-600"
            },
            {
              name: "ROI Analysis",
              description: "Foco em ROAS e retorno de investimento",
              icon: DollarSign,
              color: "from-green-500 to-green-600"
            },
            {
              name: "Cost Breakdown",
              description: "Análise detalhada de custos",
              icon: Filter,
              color: "from-purple-500 to-purple-600"
            },
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-200 cursor-pointer">
                <div className={`w-12 h-12 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-gray-900 mb-2">{template.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Usar Template
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}