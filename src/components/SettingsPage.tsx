import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield,
  Palette,
  Mail,
  Globe,
  Crown,
  Check,
  Upload,
  X
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState, useRef } from "react";
import { toast } from "sonner@2.0.3";

export function SettingsPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    position: ""
  });
  const [companyData, setCompanyData] = useState({
    companyName: "",
    cnpj: "",
    stateRegistration: "",
    address: "",
    city: "",
    state: "sp"
  });
  const [notifications, setNotifications] = useState({
    reports: true,
    performance: true,
    security: true,
    billing: true
  });
  const [preferences, setPreferences] = useState({
    language: "pt-br",
    timezone: "america-sao-paulo",
    currency: "brl",
    dateFormat: "dd-mm-yyyy"
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande! Máximo 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Foto atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    toast.success("Foto removida com sucesso!");
  };

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleSaveCompany = () => {
    toast.success("Dados da empresa atualizados!");
  };

  const handleSavePreferences = () => {
    toast.success("Preferências salvas com sucesso!");
  };

  const handleChangePassword = () => {
    toast.success("Senha alterada com sucesso!");
  };

  const handleEnable2FA = () => {
    toast.success("Autenticação 2FA ativada!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-gray-900">Configurações</h2>
        <p className="text-gray-600 mt-1">Gerencie sua conta, preferências e plano</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Building2 className="w-4 h-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Palette className="w-4 h-4 mr-2" />
            Preferências
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Informações Pessoais</h3>
            
            <div className="flex items-start gap-8 mb-8">
              <div className="relative">
                {profileImage ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl">
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white shadow-xl">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="mr-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Alterar Foto
                </Button>
                {profileImage && (
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleRemoveImage}
                  >
                    Remover
                  </Button>
                )}
                <p className="text-xs text-gray-500 mt-2">JPG, PNG ou GIF. Máximo 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700 mb-2 block">Nome Completo</Label>
                <Input 
                  placeholder="Seu nome" 
                  className="border-gray-300"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="border-gray-300"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Telefone</Label>
                <Input 
                  placeholder="+55 (11) 99999-9999" 
                  className="border-gray-300"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Cargo</Label>
                <Input 
                  placeholder="Ex: Marketing Manager" 
                  className="border-gray-300"
                  value={profileData.position}
                  onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={() => {
                  setProfileData({ name: "", email: "", phone: "", position: "" });
                  toast.info("Alterações canceladas");
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                onClick={handleSaveProfile}
              >
                Salvar Alterações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Empresa */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Informações da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label className="text-gray-700 mb-2 block">Nome da Empresa</Label>
                <Input 
                  placeholder="Sua Empresa Ltda" 
                  className="border-gray-300"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">CNPJ</Label>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  className="border-gray-300"
                  value={companyData.cnpj}
                  onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Inscrição Estadual</Label>
                <Input 
                  placeholder="000.000.000.000" 
                  className="border-gray-300"
                  value={companyData.stateRegistration}
                  onChange={(e) => setCompanyData({...companyData, stateRegistration: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-700 mb-2 block">Endereço</Label>
                <Input 
                  placeholder="Rua, número, complemento" 
                  className="border-gray-300"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Cidade</Label>
                <Input 
                  placeholder="São Paulo" 
                  className="border-gray-300"
                  value={companyData.city}
                  onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Estado</Label>
                <Select 
                  value={companyData.state}
                  onValueChange={(value) => setCompanyData({...companyData, state: value})}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Minas Gerais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={() => {
                  setCompanyData({ 
                    companyName: "", 
                    cnpj: "", 
                    stateRegistration: "", 
                    address: "", 
                    city: "", 
                    state: "sp" 
                  });
                  toast.info("Alterações canceladas");
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                onClick={handleSaveCompany}
              >
                Salvar Alterações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-gray-900">Plano Atual: Professional</h3>
                </div>
                <p className="text-gray-600">Renova em 15 de dezembro de 2024</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
                Ativo
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "R$ 197",
                features: ["1 usuário", "2 integrações", "30 dias de dados", "Suporte por email"],
                current: false,
                color: "from-gray-500 to-gray-600"
              },
              {
                name: "Professional",
                price: "R$ 497",
                features: ["5 usuários", "Todas integrações", "90 dias de dados", "Suporte prioritário"],
                current: true,
                color: "from-blue-600 to-blue-500"
              },
              {
                name: "Enterprise",
                price: "R$ 997",
                features: ["Usuários ilimitados", "API customizada", "Dados ilimitados", "Suporte 24/7"],
                current: false,
                color: "from-purple-600 to-purple-500"
              },
            ].map((plan) => (
              <Card 
                key={plan.name} 
                className={`p-6 ${plan.current ? 'border-4 border-blue-500 shadow-xl' : 'border-2 border-gray-200'}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-gray-900 mb-2">{plan.name}</h4>
                <div className="mb-4">
                  <span className="text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 text-sm">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={plan.current 
                    ? "w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg" 
                    : "w-full"
                  }
                  variant={plan.current ? "default" : "outline"}
                  disabled={plan.current}
                >
                  {plan.current ? "Plano Atual" : "Fazer Upgrade"}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Método de Pagamento</h3>
            
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-6 border-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-gray-600 text-sm">Expira em 12/2025</p>
                </div>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Alterar
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900">Histórico de Pagamentos</h4>
              {[
                { date: "01/11/2024", amount: "R$ 497,00", status: "Pago" },
                { date: "01/10/2024", amount: "R$ 497,00", status: "Pago" },
                { date: "01/09/2024", amount: "R$ 497,00", status: "Pago" },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900">{payment.date}</p>
                    <p className="text-gray-600 text-sm">{payment.amount}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Preferências de Notificação</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">E-mails de Relatórios</p>
                    <p className="text-gray-600 text-sm">Receber relatórios agendados por e-mail</p>
                  </div>
                </div>
                <Switch 
                  defaultChecked={notifications.reports}
                  onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">Alertas de Performance</p>
                    <p className="text-gray-600 text-sm">Notificar quando métricas ultrapassarem limites</p>
                  </div>
                </div>
                <Switch 
                  defaultChecked={notifications.performance}
                  onCheckedChange={(checked) => setNotifications({...notifications, performance: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">Alertas de Segurança</p>
                    <p className="text-gray-600 text-sm">Notificar sobre login ou alterações na conta</p>
                  </div>
                </div>
                <Switch 
                  defaultChecked={notifications.security}
                  onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">Notificações de Billing</p>
                    <p className="text-gray-600 text-sm">Receber lembretes de pagamento e faturas</p>
                  </div>
                </div>
                <Switch 
                  defaultChecked={notifications.billing}
                  onCheckedChange={(checked) => setNotifications({...notifications, billing: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Segurança da Conta</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700 mb-2 block">Senha Atual</Label>
                <Input type="password" placeholder="••••••••" className="border-gray-300" />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Nova Senha</Label>
                <Input type="password" placeholder="••••••••" className="border-gray-300" />
              </div>
              <div>
                <Label className="text-gray-700 mb-2 block">Confirmar Nova Senha</Label>
                <Input type="password" placeholder="••••••••" className="border-gray-300" />
              </div>

              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                onClick={handleChangePassword}
              >
                Alterar Senha
              </Button>
            </div>

            <Separator className="my-8" />

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <div>
                <p className="text-gray-900 mb-1">Autenticação de Dois Fatores (2FA)</p>
                <p className="text-gray-600 text-sm">Adicione uma camada extra de segurança</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
                onClick={handleEnable2FA}
              >
                Ativar 2FA
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Preferências */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="p-8">
            <h3 className="text-gray-900 mb-6">Preferências do Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700 mb-2 block">Idioma</Label>
                <Select 
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({...preferences, language: value})}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">Português (BR)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Fuso Horário</Label>
                <Select 
                  value={preferences.timezone}
                  onValueChange={(value) => setPreferences({...preferences, timezone: value})}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-sao-paulo">América/São Paulo (BRT)</SelectItem>
                    <SelectItem value="america-new-york">América/New York (EST)</SelectItem>
                    <SelectItem value="europe-london">Europa/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Moeda Padrão</Label>
                <Select 
                  value={preferences.currency}
                  onValueChange={(value) => setPreferences({...preferences, currency: value})}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brl">BRL (R$)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Formato de Data</Label>
                <Select 
                  value={preferences.dateFormat}
                  onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={() => {
                  setPreferences({ 
                    language: "pt-br", 
                    timezone: "america-sao-paulo", 
                    currency: "brl", 
                    dateFormat: "dd-mm-yyyy" 
                  });
                  toast.info("Alterações canceladas");
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                onClick={handleSavePreferences}
              >
                Salvar Preferências
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}