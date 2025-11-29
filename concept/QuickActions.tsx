
import React from 'react';
import { MapPin, Calculator, MessageCircle, Phone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const QuickActions = () => {
  const quickActions = [
    { 
      icon: MapPin, 
      label: 'Explorar Mapa', 
      color: 'from-blue-500 to-cyan-500', 
      bgColor: 'from-blue-50 to-cyan-50',
      darkBgColor: 'dark:from-blue-900/20 dark:to-cyan-900/20',
      description: 'Navegue pelas áreas',
      urgent: false 
    },
    { 
      icon: Calculator, 
      label: 'Simular Financ.', 
      color: 'from-green-500 to-emerald-500', 
      bgColor: 'from-green-50 to-emerald-50',
      darkBgColor: 'dark:from-green-900/20 dark:to-emerald-900/20',
      description: 'Calcule seu investimento',
      urgent: false 
    },
    { 
      icon: MessageCircle, 
      label: 'Enviar Feedback', 
      color: 'from-purple-500 to-pink-500', 
      bgColor: 'from-purple-50 to-pink-50',
      darkBgColor: 'dark:from-purple-900/20 dark:to-pink-900/20',
      description: 'Compartilhe sua opinião',
      urgent: false 
    },
    { 
      icon: Phone, 
      label: 'SOS', 
      color: 'from-red-500 to-red-600', 
      bgColor: 'from-red-50 to-red-100',
      darkBgColor: 'dark:from-red-900/20 dark:to-red-800/20',
      description: 'Emergência 24h',
      urgent: true 
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
        <Zap className="w-6 h-6 mr-3 text-yellow-500 animate-pulse" />
        Acesso Rápido
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="ghost"
              className={`relative h-28 rounded-3xl border-0 bg-gradient-to-br ${action.bgColor} ${action.darkBgColor} 
                transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden 
                animate-scale-in active:scale-95 p-5`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
              <div className="flex flex-col items-center space-y-3 relative z-10 text-center">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-xl transition-all duration-300 ${
                  action.urgent ? 'animate-bounce-gentle' : 'group-hover:scale-110 group-hover:shadow-2xl'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{action.label}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{action.description}</span>
                </div>
              </div>
              {action.urgent && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg"></div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
