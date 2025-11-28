
import React, { useState } from 'react';
import { Home, MapPin, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const loteamentosData = [
  {
    id: 'cidade-inteligente',
    name: 'Cidade Inteligente',
    icon: '🏙️',
    city: 'Santo Antônio do Descoberto - GO',
    availableLots: 24,
    totalLots: 120,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cidade-universitaria',
    name: 'Cidade Universitária',
    icon: '🎓',
    city: 'Caldas Novas - GO',
    availableLots: 18,
    totalLots: 80,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'cidade-verde',
    name: 'Cidade Verde',
    icon: '🌿',
    city: 'Caldas Novas - GO',
    availableLots: 31,
    totalLots: 100,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'cidade-das-flores',
    name: 'Cidade das Flores',
    icon: '🌸',
    city: 'Caldas Novas - GO',
    availableLots: 0,
    totalLots: 60,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'setor-lago-sul',
    name: 'Setor Lago Sul',
    icon: '🏞️',
    city: 'Caldas Novas - GO',
    availableLots: 12,
    totalLots: 45,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'residencial-morada-nobre',
    name: 'Residencial Morada Nobre',
    icon: '🏘️',
    city: 'Caldas Novas - GO',
    availableLots: 8,
    totalLots: 35,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'caminho-do-lago',
    name: 'Caminho do Lago',
    icon: '🛤️',
    city: 'Caldas Novas - GO',
    availableLots: 15,
    totalLots: 70,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'parque-flamboyant',
    name: 'Parque Flamboyant',
    icon: '🌳',
    city: 'Caldas Novas - GO',
    availableLots: 0,
    totalLots: 50,
    color: 'from-red-500 to-pink-500'
  }
];

export const LotsAvailableCard = () => {
  const totalAvailable = loteamentosData.reduce((sum, lot) => sum + lot.availableLots, 0);
  const totalLots = loteamentosData.reduce((sum, lot) => sum + lot.totalLots, 0);
  const percentageAvailable = Math.round((totalAvailable / totalLots) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-slate-800 dark:text-slate-200">{totalAvailable}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lotes Disponíveis</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Total</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{totalLots}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{percentageAvailable}% Disponível</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>8 Loteamentos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Lotes Disponíveis por Loteamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {loteamentosData.map((loteamento) => (
            <div 
              key={loteamento.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{loteamento.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{loteamento.name}</p>
                  <p className="text-xs text-slate-500">{loteamento.city}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={loteamento.availableLots > 0 ? "default" : "secondary"}
                  className={`${
                    loteamento.availableLots > 0 
                      ? "bg-emerald-500 hover:bg-emerald-600" 
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {loteamento.availableLots}/{loteamento.totalLots}
                </Badge>
                {loteamento.availableLots === 0 && (
                  <p className="text-xs text-red-500 mt-1">Esgotado</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Total Geral:</span>
            <span className="text-lg font-bold text-emerald-600">{totalAvailable}/{totalLots} lotes</span>
          </div>
          <div className="mt-2 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentageAvailable}%` }}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
