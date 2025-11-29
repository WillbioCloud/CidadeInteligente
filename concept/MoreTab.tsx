
import React from 'react';
import { 
  Calendar, 
  Camera, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Bell,
  Plus
} from 'lucide-react';

const MoreTab = () => {
  const sections = [
    {
      title: 'Eventos & Comunidade',
      items: [
        { icon: Calendar, title: 'Eventos da Comunidade', description: 'Festas, workshops e atividades', hasNotification: true },
        { icon: Camera, title: 'Câmeras de Monitoramento', description: 'Visualização das câmeras públicas', hasNotification: false },
        { icon: Bell, title: 'Notícias da Região', description: 'Últimas novidades do bairro', hasNotification: true },
      ]
    },
    {
      title: 'Serviços',
      items: [
        { icon: Star, title: 'Cursos e Formações', description: 'Escola do Futuro e capacitações', hasNotification: false },
        { icon: Heart, title: 'Contato Pós-venda', description: 'Suporte e atendimento', hasNotification: false },
        { icon: MapPin, title: 'Agendamento de Quadras', description: 'Reserve espaços esportivos', hasNotification: false },
      ]
    },
    {
      title: 'Sustentabilidade',
      items: [
        { icon: Plus, title: 'Dicas Sustentáveis', description: 'Como cuidar do seu lote', hasNotification: false },
        { icon: Calendar, title: 'Separação de Lixo', description: 'Tutorial completo de reciclagem', hasNotification: false },
        { icon: Clock, title: 'Previsão do Tempo', description: 'Condições para atividades ao ar livre', hasNotification: false },
      ]
    }
  ];

  const quickActions = [
    { icon: '🚨', title: 'Emergência', description: 'Contatos de emergência', color: 'bg-red-500' },
    { icon: '🏠', title: 'Espaço FBZ', description: 'Novidades dos empreendimentos', color: 'bg-blue-500' },
    { icon: '📊', title: 'Lotação dos Espaços', description: 'Status das áreas públicas', color: 'bg-green-500' },
    { icon: '🧾', title: 'IPTU', description: 'Emissão de documentos', color: 'bg-purple-500' }
  ];

  const handleItemClick = (title: string) => {
    console.log(`Clicked on: ${title}`);
    // Here you would navigate to the specific feature
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mais Serviços</h2>
        <p className="text-gray-600">Explore todas as funcionalidades</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(action.title)}
            className={`${action.color} text-white rounded-xl p-4 text-left hover:opacity-90 transition-opacity shadow-sm`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
            <p className="text-xs text-white/80">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Feature Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 px-2">
            {section.title}
          </h3>
          
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <button
                  key={itemIndex}
                  onClick={() => handleItemClick(item.title)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.hasNotification && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      <span className="text-gray-400">›</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Feedback Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <h3 className="font-bold text-lg mb-2">💭 Sua Opinião Importa</h3>
        <p className="text-blue-100 text-sm mb-3">
          Ajude-nos a melhorar o app com seu feedback e sugestões.
        </p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
          Enviar Feedback
        </button>
      </div>

      {/* App Info */}
      <div className="text-center pt-4 border-t border-gray-200">
        <div className="text-gray-500 text-sm">
          <p className="mb-1">Cidade Inteligente v1.0</p>
          <p>Conectando nossa comunidade</p>
        </div>
      </div>
    </div>
  );
};

export default MoreTab;
