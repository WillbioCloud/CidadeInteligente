
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WelcomeSectionProps {
  user: any;
  currentLoteamento: {
    id: string;
    name: string;
    logo: string;
    color: string;
    city: string;
    hasTransport: boolean;
  };
  isUserInLoteamento?: boolean;
}

export const WelcomeSection = ({ user, currentLoteamento, isUserInLoteamento }: WelcomeSectionProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="text-center mb-8">
      <div className="relative inline-block mb-6">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in mb-2">
            {getGreeting()}, {user.name?.split(' ')[0]}! 👋
          </h1>
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl blur-xl animate-glow"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="relative">
          <img 
            src={currentLoteamento.logo} 
            alt={currentLoteamento.name}
            className="h-12 w-12 rounded-2xl object-cover shadow-xl ring-3 ring-white/50 transition-all duration-300 hover:scale-110"
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-3xl blur-lg"></div>
        </div>
        <div className="text-left">
          <p className="font-bold text-xl text-slate-800 dark:text-slate-200">{currentLoteamento.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{currentLoteamento.city}</p>
        </div>
      </div>

      {/* Enhanced Status Badge */}
      <div className="flex justify-center">
        <Badge 
          className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full text-sm font-semibold animate-pulse shadow-lg border-0 ${
            isUserInLoteamento 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isUserInLoteamento ? 'bg-green-200' : 'bg-orange-200'} animate-pulse`}></div>
          <span>{isUserInLoteamento ? 'No loteamento' : 'Fora do loteamento'}</span>
        </Badge>
      </div>
    </div>
  );
};
