
import React from 'react';
import { Instagram, Camera, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const InstagramSection = () => {
  const instagramPosts = [
    {
      id: 1,
      image: '/api/placeholder/300/300',
      caption: 'Novos lançamentos chegando em 2024! 🏡✨ #FBZEmpreendimentos #NovoLar',
      likes: 127,
      comments: 23,
      timestamp: '2h'
    },
    {
      id: 2,
      image: '/api/placeholder/300/300',
      caption: 'Área de lazer completa para toda família! 🏊‍♀️🎾 #LazerCompleto #VidaQualidade',
      likes: 89,
      comments: 15,
      timestamp: '5h'
    },
    {
      id: 3,
      image: '/api/placeholder/300/300',
      caption: 'Sustentabilidade e natureza em harmonia 🌱🌿 #SustentabilidadeReal #MeioAmbiente',
      likes: 156,
      comments: 34,
      timestamp: '1d'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <Instagram className="w-6 h-6 mr-3 text-pink-500 animate-pulse" />
          @fbzempreendimentos
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver perfil
        </Button>
      </div>
      
      <div className="space-y-6">
        {instagramPosts.map((post, index) => (
          <Card 
            key={post.id}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden animate-fade-in group"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                <Camera className="w-16 h-16 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">{post.caption}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-6">
                    <span className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 cursor-pointer">
                      <Heart className="w-4 h-4" /> 
                      <span className="font-medium">{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                      <MessageCircle className="w-4 h-4" /> 
                      <span className="font-medium">{post.comments}</span>
                    </span>
                  </div>
                  <span className="font-medium">{post.timestamp}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
