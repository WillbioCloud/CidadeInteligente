
import React, { useState } from 'react';
import { Cloud, Sun, Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WeatherCard = () => {
  const [weatherData] = useState({ 
    temp: 28, 
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    feelsLike: 31,
    description: 'Ensolarado'
  });

  const WeatherIcon = weatherData.condition === 'sunny' ? Sun : weatherData.condition === 'cloudy' ? Cloud : Droplets;

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg">
              <WeatherIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-2xl text-slate-800 dark:text-slate-200">{weatherData.temp}°C</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{weatherData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Sensação</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{weatherData.feelsLike}°C</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Droplets className="h-3 w-3" />
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3" />
            <span>{weatherData.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{weatherData.visibility} km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
