import { Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

interface TopFiltersProps {
  filters: {
    period: string;
    platform: string;
    objective: string;
    currency: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function TopFilters({ filters, onFiltersChange }: TopFiltersProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 px-8 py-4 shadow-md">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <Select 
            value={filters.period} 
            onValueChange={(value) => onFiltersChange({ ...filters, period: value })}
          >
            <SelectTrigger className="w-[180px] border-2 border-gray-300 focus:border-blue-500">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="14days">Últimos 14 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="currentMonth">Mês atual</SelectItem>
              <SelectItem value="lastMonth">Mês anterior</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select 
          value={filters.platform} 
          onValueChange={(value) => onFiltersChange({ ...filters, platform: value })}
        >
          <SelectTrigger className="w-[160px] border-2 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="tiktok">TikTok Ads</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.objective} 
          onValueChange={(value) => onFiltersChange({ ...filters, objective: value })}
        >
          <SelectTrigger className="w-[180px] border-2 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos objetivos</SelectItem>
            <SelectItem value="conversion">Conversão</SelectItem>
            <SelectItem value="traffic">Tráfego</SelectItem>
            <SelectItem value="engagement">Engajamento</SelectItem>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="awareness">Reconhecimento</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.currency} 
          onValueChange={(value) => onFiltersChange({ ...filters, currency: value })}
        >
          <SelectTrigger className="w-[120px] border-2 border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRL">BRL (R$)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="ml-auto border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Mais filtros
        </Button>
      </div>
    </div>
  );
}