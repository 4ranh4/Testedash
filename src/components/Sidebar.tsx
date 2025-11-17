import { 
  LayoutDashboard, 
  Facebook, 
  Search, 
  Play, 
  FileText, 
  Settings, 
  Plug, 
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

interface SidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ selectedView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard Geral", icon: LayoutDashboard },
    { id: "meta", label: "Meta Ads", icon: Facebook },
    { id: "google", label: "Google Ads", icon: Search },
    { id: "tiktok", label: "TikTok Ads", icon: Play },
    { id: "reports", label: "Relatórios", icon: FileText },
    { id: "settings", label: "Configurações", icon: Settings },
    { id: "integrations", label: "Integrações / API", icon: Plug },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    window.location.hash = "login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-white">Traffic Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Tráfego Pago SaaS</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50" 
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <div className="px-4 py-3 rounded-lg bg-gray-700/30">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-white">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}