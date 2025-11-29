
import React from 'react';
import { Leaf, Star, Calendar, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const InformativeCards = () => {
  const informativeCards = [
    {
      id: 1,
      title: 'Cuide do seu lote',
      description: 'Dicas de jardinagem, limpeza e manutenção para valorizar seu investimento',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      darkBgColor: 'dark:from-green-900/20 dark:to-emerald-900/20',
      tips: ['Regue as plantas pela manhã', 'Mantenha o terreno limpo', 'Plante espécies nativas']
    },
    {
      id: 2,
      title: 'Novidades FBZ',
      description: 'Últimos lançamentos e oportunidades especiais para você',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      darkBgColor: 'dark:from-yellow-900/20 dark:to-orange-900/20',
      tips: ['Novos lotes disponíveis', 'Condições especiais', 'Documentação facilitada']
    },
    {
      id: 3,
      title: 'Eventos & Cursos',
      description: 'Participe das atividades da comunidade e desenvolva novas habilidades',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      darkBgColor: 'dark:from-blue-900/20 dark:to-indigo-900/20',
      tips: ['Workshop de jardinagem', 'Reunião de moradores', 'Aula de yoga gratuita']
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
        <Lightbulb className="w-6 h-6 mr-3 text-yellow-500 animate-pulse" />
        Dicas e Informações
      </h2>
      <div className="space-y-6">
        {informativeCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.id}
              className={`bg-gradient-to-br ${card.bgColor} ${card.darkBgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group animate-fade-in cursor-pointer overflow-hidden`}
              style={{ animationDelay: `${index * 250}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-5">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3">{card.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{card.description}</p>
                    <div className="space-y-2">
                      {card.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 flex-shrink-0"></div>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
