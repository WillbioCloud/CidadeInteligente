import React, { useState } from 'react';
import { Play, Heart, MessageCircle, ExternalLink, MapPin, Calendar, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeatherCard } from '@/components/home/WeatherCard';
import { LotsAvailableCard } from '@/components/home/LotsAvailableCard';

interface HomeTabProps {
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

const loteamentos = [
  {
    id: 'cidade-inteligente',
    name: 'Cidade Inteligente',
    description: 'O futuro da habitação sustentável',
    image: '/lovable-uploads/4d814fb7-4f31-4036-afe9-8b22dbc9c38f.png',
    video: 'https://example.com/video1.mp4',
    status: 'available',
    color: 'from-blue-500 to-cyan-500',
    features: ['Smart Home', 'Área Verde', 'Segurança 24h']
  },
  {
    id: 'cidade-universitaria',
    name: 'Cidade Universitária',
    description: 'Próximo aos principais centros educacionais',
    image: '/lovable-uploads/55f09ff9-c946-4c0a-93b8-3a457a2f49b1.png',
    video: 'https://example.com/video2.mp4',
    status: 'available',
    color: 'from-purple-500 to-pink-500',
    features: ['Localização Premium', 'Transporte Público', 'Área de Lazer']
  },
  {
    id: 'cidade-verde',
    name: 'Cidade Verde',
    description: 'Sustentabilidade e natureza em harmonia',
    image: '/lovable-uploads/5e79b5f5-adde-450d-bf54-13624ee144fc.png',
    video: 'https://example.com/video3.mp4',
    status: 'available',
    color: 'from-green-500 to-emerald-500',
    features: ['100% Sustentável', 'Parque Ecológico', 'Energia Solar']
  },
  {
    id: 'cidade-das-flores',
    name: 'Cidade das Flores',
    description: 'Beleza natural em cada esquina',
    image: '/lovable-uploads/7d5d6c7e-8ba3-4972-8e8e-89b4fa40cd51.png',
    video: 'https://example.com/video4.mp4',
    status: 'sold_out',
    color: 'from-pink-500 to-rose-500',
    features: ['Jardins Temáticos', 'Paisagismo', 'Clube Recreativo']
  },
  {
    id: 'setor-lago-sul',
    name: 'Setor Lago Sul',
    description: 'Vista privilegiada para o lago',
    image: '/placeholder.svg',
    video: 'https://example.com/video5.mp4',
    status: 'available',
    color: 'from-indigo-500 to-blue-500',
    features: ['Vista para o Lago', 'Marina', 'Clube Náutico']
  },
  {
    id: 'residencial-morada-nobre',
    name: 'Residencial Morada Nobre',
    description: 'Elegância e sofisticação',
    image: '/placeholder.svg',
    video: 'https://example.com/video6.mp4',
    status: 'available',
    color: 'from-amber-500 to-orange-500',
    features: ['Alto Padrão', 'Portaria 24h', 'Área Gourmet']
  },
  {
    id: 'caminho-do-lago',
    name: 'Caminho do Lago',
    description: 'Trilhas e natureza preservada',
    image: '/placeholder.svg',
    video: 'https://example.com/video7.mp4',
    status: 'available',
    color: 'from-teal-500 to-cyan-500',
    features: ['Trilhas Ecológicas', 'Preservação Ambiental', 'Pesca Esportiva']
  },
  {
    id: 'parque-flamboyant',
    name: 'Parque Flamboyant',
    description: 'Natureza exuberante em cada detalhe',
    image: '/placeholder.svg',
    video: 'https://example.com/video8.mp4',
    status: 'sold_out',
    color: 'from-red-500 to-pink-500',
    features: ['Parque Central', 'Playground', 'Academia ao Ar Livre']
  }
];

const instagramPosts = [
  {
    id: 1,
    image: '/lovable-uploads/4d814fb7-4f31-4036-afe9-8b22dbc9c38f.png',
    caption: 'Conheça o futuro da habitação sustentável! 🏡✨ #CidadeInteligente #Sustentabilidade',
    likes: 142,
    comments: 23,
    timeAgo: '2h'
  },
  {
    id: 2,
    image: '/lovable-uploads/55f09ff9-c946-4c0a-93b8-3a457a2f49b1.png',
    caption: 'Localização privilegiada próxima às melhores universidades 🎓 #CidadeUniversitária',
    likes: 89,
    comments: 15,
    timeAgo: '4h'
  },
  {
    id: 3,
    image: '/lovable-uploads/5e79b5f5-adde-450d-bf54-13624ee144fc.png',
    caption: 'Viva em harmonia com a natureza 🌿🌱 #CidadeVerde #MeioAmbiente',
    likes: 203,
    comments: 31,
    timeAgo: '6h'
  }
];

export const HomeTab = ({ user, currentLoteamento, isUserInLoteamento }: HomeTabProps) => {
  const [selectedLoteamento, setSelectedLoteamento] = useState<any>(null);
  const [showMedia, setShowMedia] = useState(false);

  const handleVerMidias = (loteamento: any) => {
    setSelectedLoteamento(loteamento);
    setShowMedia(true);
  };

  const handleAdquirirLote = (loteamento: any) => {
    if (loteamento.status === 'sold_out') {
      alert('Lotes esgotados no momento. Em breve novas unidades.');
      return;
    }
    // Lógica para adquirir lote
    console.log('Adquirir lote:', loteamento.name);
  };

  if (showMedia && selectedLoteamento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header com botão voltar */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowMedia(false)}
              className="rounded-full w-10 h-10 p-0"
            >
              ←
            </Button>
            <h1 className="text-xl font-bold">{selectedLoteamento.name}</h1>
          </div>
        </div>

        {/* Vídeo em destaque */}
        <div className="relative w-full h-64 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white text-xl font-bold">{selectedLoteamento.name}</h2>
            <p className="text-white/80">{selectedLoteamento.description}</p>
          </div>
        </div>

        {/* Galeria de imagens */}
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Galeria de Imagens</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-square bg-slate-200 rounded-xl overflow-hidden">
                  <img
                    src={selectedLoteamento.image}
                    alt={`${selectedLoteamento.name} - Imagem ${index}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-bold mb-4">Características</h3>
            <div className="grid grid-cols-1 gap-3">
              {selectedLoteamento.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header com boas-vindas */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">
              Olá, {user.name?.split(' ')[0] || 'Usuário'}!
            </h1>
            <p className="text-blue-100">
              {user.user_type === 'cliente' 
                ? `Bem-vindo ao ${currentLoteamento.name}` 
                : 'Explore nossos loteamentos'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Weather and Lots Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherCard />
          <LotsAvailableCard />
        </div>

        {/* Cards dos Loteamentos */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Nossos Empreendimentos</h2>
          <div className="space-y-4">
            {loteamentos.map((loteamento) => (
              <Card key={loteamento.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className={`h-48 bg-gradient-to-r ${loteamento.color} relative overflow-hidden`}>
                  <img
                    src={loteamento.image}
                    alt={loteamento.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">{loteamento.name}</h3>
                    <p className="text-white/90 text-sm">{loteamento.description}</p>
                  </div>
                  {loteamento.status === 'sold_out' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white">Esgotado</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {loteamento.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVerMidias(loteamento)}
                      variant="outline"
                      className="flex-1 rounded-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Mídias
                    </Button>
                    <Button
                      onClick={() => handleAdquirirLote(loteamento)}
                      disabled={loteamento.status === 'sold_out'}
                      className={`flex-1 rounded-xl ${
                        loteamento.status === 'sold_out' 
                          ? 'bg-gray-400' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      }`}
                    >
                      {loteamento.status === 'sold_out' ? 'Esgotado' : 'Adquirir'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feed do Instagram */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">@fbzempreendimentos</h2>
          </div>
          
          <div className="space-y-4">
            {instagramPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-slate-100">
                  <img
                    src={post.image}
                    alt="Instagram post"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-slate-700">{post.caption}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">{post.timeAgo}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={() => window.open('https://instagram.com/fbzempreendimentos', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver no Instagram
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
