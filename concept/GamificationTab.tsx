
import React from 'react';
import { Trophy, Star, Lock, Gift, Target, Zap, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface GamificationTabProps {
  user: any;
  currentLoteamento: any;
  isUserInLoteamento?: boolean;
}

const GamificationTab = ({ user, currentLoteamento }: GamificationTabProps) => {
  const isClient = user.userType === 'cliente';
  
  // Componente para usuários não-clientes
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          {/* Ícone desativado com animação */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-16 h-16 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-6 h-6 text-white opacity-50" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-700">Área Exclusiva para Clientes</h2>
            <p className="text-slate-600 leading-relaxed">
              Você ainda não possui nenhum produto da nossa empresa.
            </p>
            <p className="text-sm text-slate-500">
              Adquira um lote em um de nossos empreendimentos e desbloqueie um mundo de recompensas e benefícios exclusivos!
            </p>
          </div>

          {/* Prévia dos benefícios */}
          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">O que você vai desbloquear:</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 p-3 rounded-xl border border-slate-200">
                <Target className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Missões Exclusivas</p>
              </div>
              <div className="bg-white/50 p-3 rounded-xl border border-slate-200">
                <Gift className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Recompensas</p>
              </div>
              <div className="bg-white/50 p-3 rounded-xl border border-slate-200">
                <Star className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Sistema de Níveis</p>
              </div>
              <div className="bg-white/50 p-3 rounded-xl border border-slate-200">
                <Crown className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Conquistas</p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <Button 
            className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              // Navegar para a aba Home
              console.log('Navegar para ver loteamentos');
            }}
          >
            Ver Nossos Loteamentos
          </Button>
        </div>
      </div>
    );
  }

  // Interface para clientes ativos
  const userLevel = user.level || 1;
  const userXP = user.xp || 0;
  const nextLevelXP = userLevel * 1000;
  const progressPercentage = (userXP / nextLevelXP) * 100;

  const missions = [
    {
      id: 1,
      title: 'Primeira Visita ao Loteamento',
      description: 'Visite seu lote pela primeira vez',
      xp: 100,
      icon: <Target className="w-6 h-6" />,
      completed: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'Compartilhe nas Redes Sociais',
      description: 'Publique uma foto do seu lote no Instagram',
      xp: 150,
      icon: <Star className="w-6 h-6" />,
      completed: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Participe de um Evento',
      description: 'Compareça a um evento do loteamento',
      xp: 200,
      icon: <Gift className="w-6 h-6" />,
      completed: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Indique um Amigo',
      description: 'Indique alguém para conhecer nossos empreendimentos',
      xp: 300,
      icon: <Crown className="w-6 h-6" />,
      completed: false,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Primeiro Cliente',
      description: 'Primeira compra realizada',
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      unlocked: true
    },
    {
      id: 2,
      title: 'Explorador',
      description: 'Visitou o loteamento 5 vezes',
      icon: <Target className="w-8 h-8 text-blue-500" />,
      unlocked: false
    },
    {
      id: 3,
      title: 'Influenciador',
      description: 'Compartilhou 10 posts nas redes sociais',
      icon: <Star className="w-8 h-8 text-purple-500" />,
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header com nível do usuário */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nível {userLevel}</h1>
            <p className="text-purple-100">{currentLoteamento.name}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{userXP} XP</span>
            </div>
            <p className="text-xs text-purple-100">
              {nextLevelXP - userXP} XP para o próximo nível
            </p>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Nível {userLevel}</span>
            <span>Nível {userLevel + 1}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 animate-pulse"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Missões Ativas */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Suas Missões
          </h2>
          <div className="space-y-3">
            {missions.map((mission) => (
              <Card 
                key={mission.id} 
                className={`overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  mission.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${mission.color} rounded-xl flex items-center justify-center text-white shadow-lg ${
                      mission.completed ? 'opacity-75' : 'animate-pulse'
                    }`}>
                      {mission.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{mission.title}</h3>
                      <p className="text-sm text-slate-600">{mission.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-600">+{mission.xp} XP</span>
                      </div>
                    </div>
                    <div>
                      {mission.completed ? (
                        <Badge className="bg-green-500 text-white">
                          Concluída ✓
                        </Badge>
                      ) : (
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conquistas */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Suas Conquistas
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                    : 'bg-slate-50 opacity-60'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`transition-all duration-300 ${
                      achievement.unlocked ? 'animate-bounce-gentle' : 'grayscale'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${
                        achievement.unlocked ? 'text-yellow-800' : 'text-slate-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-slate-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-500 text-white animate-pulse">
                        Desbloqueada!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recompensas Disponíveis */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Recompensas Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-100 mb-4">
              Troque seus pontos XP por recompensas exclusivas!
            </p>
            <Button 
              variant="secondary" 
              className="w-full bg-white text-purple-600 hover:bg-purple-50 rounded-xl"
            >
              Ver Catálogo de Recompensas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationTab;
