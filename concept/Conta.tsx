import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { User, MapPin, Mail, Edit, LogOut, Save, X } from "lucide-react";

const loteamentos = {
  "Caldas Novas - GO": ["Cidade Verde", "Lago Sul", "Morada Nobre", "Flamboyant", "Jardim Tropical"],
  "Santo Antônio do Descoberto - GO": ["Cidade Inteligente"]
};

export default function Conta() {
  const { user, setUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cidade: user?.cidade || '',
    loteamento: user?.loteamento || ''
  });

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        ...(user.userType === 'client' && {
          cidade: formData.cidade,
          loteamento: formData.loteamento
        })
      };
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      cidade: user?.cidade || '',
      loteamento: user?.loteamento || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso necessário</h2>
          <p className="text-muted-foreground mb-4">Faça login para acessar sua conta</p>
          <Button onClick={() => window.location.reload()}>
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <Badge variant={user.userType === 'client' ? 'default' : 'secondary'}>
                  {user.userType === 'client' ? 'Cliente' : 'Visitante'}
                </Badge>
              </div>
            </div>
            
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-foreground">{user.name}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing && user.userType === 'client' ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-foreground">{user.email || 'Não informado'}</span>
                )}
              </div>
            </div>

            {user.userType === 'client' && (
              <>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Select 
                        value={formData.cidade} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cidade: value, loteamento: '' }))}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione a cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(loteamentos).map((cidade) => (
                            <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-foreground">{user.cidade}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Loteamento</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Select 
                        value={formData.loteamento} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, loteamento: value }))}
                        disabled={!formData.cidade}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione o loteamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.cidade && loteamentos[formData.cidade as keyof typeof loteamentos]?.map((loteamento) => (
                            <SelectItem key={loteamento} value={loteamento}>{loteamento}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-foreground">{user.loteamento}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Configurações da Conta</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div>
                <h4 className="font-medium">Tipo de Conta</h4>
                <p className="text-sm text-muted-foreground">
                  {user.userType === 'client' 
                    ? 'Você tem acesso personalizado ao seu loteamento' 
                    : 'Você pode navegar por todos os empreendimentos'
                  }
                </p>
              </div>
              <Badge variant={user.userType === 'client' ? 'default' : 'secondary'}>
                {user.userType === 'client' ? 'Cliente' : 'Visitante'}
              </Badge>
            </div>

            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}