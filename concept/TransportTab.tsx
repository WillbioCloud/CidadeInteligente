

import React, { useState } from 'react';
import { Bus, Clock, MapPin, Phone, AlertCircle, ChevronDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TransportTab = () => {
  const [selectedCity, setSelectedCity] = useState('santo-antonio');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cities = [
    { 
      id: 'santo-antonio', 
      name: 'Santo Antônio do Descoberto - GO', 
      loteamentos: ['Cidade Inteligente'],
      hasTransport: true
    },
    { 
      id: 'caldas-novas', 
      name: 'Caldas Novas - GO', 
      loteamentos: ['Cidade Universitária', 'Cidade Verde', 'Cidade das Flores', 'Setor Lago Sul', 'Residencial Morada Nobre', 'Caminho do Lago', 'Parque Flamboyant'],
      hasTransport: false
    }
  ];

  const transportData = {
    'santo-antonio': {
      lines: [
        {
          id: 1,
          name: 'Linha 001 - Centro/Cidade Inteligente',
          origin: 'Terminal Central',
          destination: 'Cidade Inteligente',
          schedule: ['06:00', '07:30', '12:00', '17:30', '19:00'],
          frequency: '1h30min',
          status: 'active',
          phone: '(61) 3627-1234'
        },
        {
          id: 2,
          name: 'Linha 002 - Shopping/Cidade Inteligente',
          origin: 'Shopping Popular',
          destination: 'Cidade Inteligente',
          schedule: ['06:30', '08:00', '12:30', '18:00', '19:30'],
          frequency: '1h30min',
          status: 'active',
          phone: '(61) 3627-5678'
        },
        {
          id: 3,
          name: 'Linha 003 - Expresso Centro',
          origin: 'Rodoviária',
          destination: 'Cidade Inteligente',
          schedule: ['05:30', '07:00', '11:30', '17:00', '18:30'],
          frequency: '2h',
          status: 'maintenance',
          phone: '(61) 3627-9012'
        }
      ]
    }
  };

  const selectedCityData = cities.find(city => city.id === selectedCity);
  const lines = transportData[selectedCity as keyof typeof transportData] || { lines: [] };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-orange-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Funcionando';
      case 'maintenance':
        return 'Manutenção';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Transporte Público</h1>
        <p className="text-blue-100">Horários e linhas disponíveis</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Seletor de Cidade */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              Selecionar Região
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-slate-800">{selectedCityData?.name}</p>
                  <p className="text-sm text-slate-600">
                    {selectedCityData?.loteamentos.join(', ')}
                  </p>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden animate-slide-up">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                        selectedCity === city.id ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-slate-600">{city.loteamentos.join(', ')}</p>
                        </div>
                        {!city.hasTransport && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Sem transporte público
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informação sobre transporte */}
        {!selectedCityData?.hasTransport ? (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Info className="w-8 h-8 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-orange-800 text-lg mb-2">Transporte em Caldas Novas</h3>
                  <p className="text-orange-700 mb-4">
                    Caldas Novas não possui sistema de transporte público municipal. A cidade é conhecida por suas águas termais e turismo, sendo mais comum o uso de:
                  </p>
                  <ul className="space-y-2 text-orange-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Táxi e aplicativos de transporte (Uber, 99)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Veículo próprio
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Serviços de transfer dos hotéis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Caminhadas para locais próximos
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Aviso Importante */}
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-orange-800 mb-1">Informação Importante</h3>
                    <p className="text-sm text-orange-700">
                      Os horários podem sofrer alterações. Recomendamos confirmar pelo telefone antes da viagem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Linhas de Transporte */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bus className="w-6 h-6 text-blue-600" />
                Linhas Disponíveis ({lines.lines.length})
              </h2>
              
              {lines.lines.length === 0 ? (
                <Card className="text-center p-8 bg-slate-50">
                  <Bus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma linha disponível</h3>
                  <p className="text-sm text-slate-500">
                    Não há linhas de transporte cadastradas para esta região no momento.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {lines.lines.map((line) => (
                    <Card key={line.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                      <CardContent className="p-0">
                        {/* Header da linha */}
                        <div className={`p-4 ${
                          line.status === 'active' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : line.status === 'maintenance'
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                            : 'bg-gradient-to-r from-gray-500 to-slate-500'
                        } text-white`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{line.name}</h3>
                              <p className="text-white/90 text-sm">
                                {line.origin} → {line.destination}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(line.status)} text-white border-0`}>
                              {getStatusText(line.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Informações da linha */}
                        <div className="p-4 space-y-4">
                          {/* Horários */}
                          <div>
                            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Horários de Partida
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {line.schedule.map((time, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="bg-blue-100 text-blue-800 px-3 py-1"
                                >
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Frequência e Contato */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>Intervalo: {line.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              <a 
                                href={`tel:${line.phone}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {line.phone}
                              </a>
                            </div>
                          </div>

                          {/* Aviso de manutenção */}
                          {line.status === 'maintenance' && (
                            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2 text-orange-800">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Linha em manutenção - horários podem estar alterados
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Informações Adicionais */}
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Dúvidas sobre Transporte?</h3>
                <p className="text-blue-100 mb-4">
                  Nossa equipe está pronta para ajudar com informações sobre rotas, horários e mais.
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
          </>
        )}
      </div>
    </div>
  );
};

export default TransportTab;
