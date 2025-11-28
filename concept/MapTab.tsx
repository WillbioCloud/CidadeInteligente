
import React, { useState } from 'react';
import { MapPin, Search, Star, Phone, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MapTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏪', color: 'bg-blue-500' },
    { id: 'food', name: 'Alimentação', icon: '🍽️', color: 'bg-orange-500' },
    { id: 'health', name: 'Saúde', icon: '🏥', color: 'bg-red-500' },
    { id: 'services', name: 'Serviços', icon: '🔧', color: 'bg-green-500' },
    { id: 'leisure', name: 'Lazer', icon: '🎯', color: 'bg-purple-500' },
    { id: 'fuel', name: 'Combustível', icon: '⛽', color: 'bg-yellow-500' }
  ];

  const establishments = [
    {
      id: 1,
      name: 'Farmácia Preço Popular',
      category: 'health',
      address: 'Av. JK, Centro, Santo Antônio do Descoberto - GO',
      phone: '(61) 3627-1234',
      hours: 'Seg-Sáb: 7h às 22h | Dom: 8h às 18h',
      rating: 4.3,
      distance: '350m',
      image: '/placeholder.svg',
      coordinates: '-15.814742,-48.277218'
    },
    {
      id: 2,
      name: 'Padaria e Confeitaria Pão Quente',
      category: 'food',
      address: 'Rua Tocantins, 245, Centro',
      phone: '(61) 3627-5678',
      hours: 'Todos os dias: 5h às 21h',
      rating: 4.6,
      distance: '280m',
      image: '/placeholder.svg',
      coordinates: '-15.814000,-48.276000'
    },
    {
      id: 3,
      name: 'Posto Shell',
      category: 'fuel',
      address: 'BR-060, Km 12, Santo Antônio do Descoberto',
      phone: '(61) 3627-9999',
      hours: '24 horas',
      rating: 4.1,
      distance: '1.8km',
      image: '/placeholder.svg',
      coordinates: '-15.820000,-48.280000'
    },
    {
      id: 4,
      name: 'Supermercado São Jorge',
      category: 'food',
      address: 'Av. Goiás, 567, Centro',
      phone: '(61) 3627-9876',
      hours: 'Seg-Sáb: 7h às 22h | Dom: 8h às 20h',
      rating: 4.4,
      distance: '450m',
      image: '/placeholder.svg',
      coordinates: '-15.816000,-48.278000'
    },
    {
      id: 5,
      name: 'Salão Beleza Pura',
      category: 'services',
      address: 'Rua Bahia, 89, Setor Norte',
      phone: '(61) 9 1234-5678',
      hours: 'Ter-Sáb: 8h às 18h',
      rating: 4.7,
      distance: '600m',
      image: '/placeholder.svg',
      coordinates: '-15.812000,-48.275000'
    },
    {
      id: 6,
      name: 'Academia Power Fitness',
      category: 'leisure',
      address: 'Quadra 15, Lote 12, Cidade Jardim',
      phone: '(61) 9 8765-4321',
      hours: 'Seg-Sex: 5h às 23h | Sáb: 6h às 18h',
      rating: 4.2,
      distance: '1.2km',
      image: '/placeholder.svg',
      coordinates: '-15.818000,-48.285000'
    },
    {
      id: 7,
      name: 'Hospital Regional',
      category: 'health',
      address: 'Setor Central, Quadra 1, Lote 1',
      phone: '(61) 3627-8000',
      hours: '24 horas - Emergência',
      rating: 4.0,
      distance: '2.1km',
      image: '/placeholder.svg',
      coordinates: '-15.810000,-48.270000'
    },
    {
      id: 8,
      name: 'Pizzaria Dona Maria',
      category: 'food',
      address: 'Rua Minas Gerais, 156, Vila Nova',
      phone: '(61) 9 8765-1234',
      hours: 'Ter-Dom: 18h às 23h',
      rating: 4.8,
      distance: '800m',
      image: '/placeholder.svg',
      coordinates: '-15.815000,-48.279000'
    }
  ];

  const filteredEstablishments = establishments.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewOnMap = (establishment: any) => {
    const [lat, lng] = establishment.coordinates.split(',');
    const query = encodeURIComponent(`${establishment.name}, ${establishment.address}`);
    
    // Detecta se é iOS ou Android para usar o app nativo apropriado
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS - Apple Maps
      window.open(`maps://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=16`, '_blank');
    } else {
      // Android/Desktop - Google Maps
      window.open(`https://www.google.com/maps/search/${query}/@${lat},${lng},16z`, '_blank');
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '🏪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Explorar Região</h1>
        <p className="text-green-100">Estabelecimentos próximos aos nossos empreendimentos</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Mapa da Região */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div 
            className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-bold mb-1">Santo Antônio do Descoberto</h3>
              <p className="text-white/90 text-sm">Região com {establishments.length} estabelecimentos cadastrados</p>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <MapPin className="w-4 h-4 mr-1" />
                Mapa Interativo
              </Badge>
            </div>
          </div>
        </Card>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar estabelecimentos..."
            className="pl-10 pr-4 py-3 bg-white border-slate-200 rounded-xl focus:border-green-400 focus:ring-green-400/20 shadow-sm"
          />
        </div>

        {/* Filtros de Categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Lista de Estabelecimentos */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-600" />
            Estabelecimentos Próximos ({filteredEstablishments.length})
          </h2>
          
          {filteredEstablishments.length === 0 ? (
            <Card className="text-center p-8 bg-slate-50">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum resultado encontrado</h3>
              <p className="text-sm text-slate-500">
                Tente ajustar os filtros ou termo de busca.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEstablishments.map((establishment) => (
                <Card key={establishment.id} className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Imagem/Ícone */}
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-2xl">
                        {getCategoryIcon(establishment.category)}
                      </div>
                      
                      {/* Informações */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">{establishment.name}</h3>
                            <p className="text-slate-600 text-sm">{establishment.address}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-500 mb-1">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-slate-700 font-medium text-sm">{establishment.rating}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {establishment.distance}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Horários e Telefone */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Clock className="w-3 h-3" />
                            <span>{establishment.hours}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3 h-3" />
                            <a 
                              href={`tel:${establishment.phone}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {establishment.phone}
                            </a>
                          </div>
                        </div>
                        
                        {/* Botão Ver no Mapa */}
                        <Button
                          onClick={() => handleViewOnMap(establishment)}
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver no Mapa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Card de Informações */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3">Não encontrou o que procura?</h3>
            <p className="text-blue-100 mb-4">
              Sugestões de novos estabelecimentos são sempre bem-vindas! Entre em contato conosco.
            </p>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <a 
                href="tel:(61) 3333-4444"
                className="font-medium hover:text-blue-200 transition-colors"
              >
                (61) 3333-4444
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapTab;
