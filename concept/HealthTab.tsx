import React, { useState } from 'react';
import { Heart, Clock, Search, ChevronRight, BookOpen, Share2, Bookmark, Star } from 'lucide-react';

const HealthTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTip, setSelectedTip] = useState(null);
  const [bookmarkedTips, setBookmarkedTips] = useState(new Set());
  const [viewMode, setViewMode] = useState('all'); // 'all' ou 'favorites'

  const categories = [
    { id: 'all', name: 'Todas', color: 'bg-blue-500' },
    { id: 'nutrition', name: 'Alimentação', color: 'bg-green-500' },
    { id: 'exercise', name: 'Exercícios', color: 'bg-orange-500' },
    { id: 'mental', name: 'Saúde Mental', color: 'bg-purple-500' },
    { id: 'public', name: 'Espaços Públicos', color: 'bg-teal-500' }
  ];

  const healthTips = [
    {
      id: 1,
      title: 'Caminhada Matinal: Benefícios para o Corpo e Mente',
      excerpt: 'Descubra como uma simples caminhada pode transformar seu dia e melhorar sua saúde geral.',
      content: 'A caminhada matinal é uma das formas mais simples e eficazes de exercício. Além de melhorar a saúde cardiovascular, ela aumenta a disposição, melhora o humor e fortalece o sistema imunológico. Caminhar 30 minutos por dia pode reduzir o risco de doenças crônicas e melhorar a qualidade do sono.',
      category: 'exercise',
      readTime: '5 min',
      image: '🚶‍♀️',
      date: '2 dias atrás',
      tips: ['Comece devagar e aumente gradualmente', 'Use roupas e calçados confortáveis', 'Hidrate-se antes e depois', 'Escolha percursos seguros e agradáveis']
    },
    {
      id: 2,
      title: 'Alimentação Saudável: 10 Dicas Práticas',
      excerpt: 'Aprenda a fazer escolhas alimentares inteligentes sem complicar sua rotina.',
      content: 'Uma alimentação equilibrada é fundamental para manter a saúde e prevenir doenças. Inclua frutas, vegetais, grãos integrais e proteínas magras em suas refeições. Evite alimentos ultraprocessados e mantenha-se hidratado.',
      category: 'nutrition',
      readTime: '8 min',
      image: '🥗',
      date: '3 dias atrás',
      tips: ['Planeje suas refeições', 'Inclua cores variadas no prato', 'Mastigue devagar', 'Beba água regularmente']
    },
    {
      id: 3,
      title: 'Como Usar as Quadras da Comunidade para Exercitar-se',
      excerpt: 'Maximize o uso dos espaços esportivos do seu bairro para manter-se ativo.',
      content: 'As quadras do loteamento são excelentes espaços para atividades físicas em grupo. Organize jogos de futebol, vôlei ou basquete com os vizinhos. Isso fortalece vínculos comunitários e mantém todos ativos.',
      category: 'public',
      readTime: '6 min',
      image: '⚽',
      date: '5 dias atrás',
      tips: ['Organize grupos de exercício', 'Respeite os horários de uso', 'Mantenha o espaço limpo', 'Convide os vizinhos']
    },
    {
      id: 4,
      title: 'Técnicas de Relaxamento para o Dia a Dia',
      excerpt: 'Métodos simples para reduzir o estresse e aumentar o bem-estar mental.',
      content: 'O estresse do dia a dia pode ser gerenciado com técnicas simples de relaxamento. A respiração profunda, meditação e exercícios de mindfulness podem ser praticados em qualquer lugar.',
      category: 'mental',
      readTime: '7 min',
      image: '🧘‍♂️',
      date: '1 semana atrás',
      tips: ['Pratique respiração profunda', 'Reserve tempo para si mesmo', 'Desconecte-se das telas', 'Pratique gratidão']
    },
    {
      id: 5,
      title: 'Hidratação: Importância e Dicas Práticas',
      excerpt: 'Entenda por que beber água é fundamental e como manter-se hidratado.',
      content: 'A hidratação adequada é essencial para o bom funcionamento do organismo. Beber água regularmente melhora a digestão, regula a temperatura corporal e mantém a pele saudável.',
      category: 'nutrition',
      readTime: '4 min',
      image: '💧',
      date: '1 semana atrás',
      tips: ['Beba um copo ao acordar', 'Tenha sempre uma garrafa por perto', 'Inclua frutas com água', 'Monitore a cor da urina']
    },
    {
      id: 6,
      title: 'Exercícios Simples para Fazer em Casa',
      excerpt: 'Rotina de exercícios que não requer equipamentos especiais.',
      content: 'Você pode manter-se ativo sem sair de casa. Exercícios como flexões, agachamentos, abdominais e alongamentos podem ser feitos em qualquer espaço pequeno.',
      category: 'exercise',
      readTime: '10 min',
      image: '🏋️‍♀️',
      date: '2 semanas atrás',
      tips: ['Comece com 10 minutos diários', 'Use o peso do próprio corpo', 'Varie os exercícios', 'Mantenha regularidade']
    }
  ];

  // Filtrar dicas baseado no modo de visualização
  const getFilteredTips = () => {
    let tips = healthTips;
    
    // Se está no modo favoritas, filtrar apenas as favoritas
    if (viewMode === 'favorites') {
      tips = tips.filter(tip => bookmarkedTips.has(tip.id));
    }
    
    // Aplicar filtros de categoria e busca
    return tips.filter(tip => {
      const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
      const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tip.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredTips = getFilteredTips();

  const toggleBookmark = (tipId) => {
    const newBookmarks = new Set(bookmarkedTips);
    if (newBookmarks.has(tipId)) {
      newBookmarks.delete(tipId);
    } else {
      newBookmarks.add(tipId);
    }
    setBookmarkedTips(newBookmarks);
  };

  const openTipDetail = (tip) => {
    setSelectedTip(tip);
  };

  const closeTipDetail = () => {
    setSelectedTip(null);
  };

  if (selectedTip) {
    return (
      <div className="p-4 space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-3">
          <button
            onClick={closeTipDetail}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Dica de Saúde</h2>
        </div>

        {/* Conteúdo da dica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedTip.image}</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedTip.title}</h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedTip.readTime}
                </span>
                <span>{selectedTip.date}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">{selectedTip.content}</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Dicas Práticas:</h3>
              <ul className="space-y-2">
                {selectedTip.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ações */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => toggleBookmark(selectedTip.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  bookmarkedTips.has(selectedTip.id)
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {bookmarkedTips.has(selectedTip.id) ? 'Salvo' : 'Salvar'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dicas de Saúde</h2>
        <p className="text-gray-600">Conteúdo confiável para seu bem-estar</p>
      </div>

      {/* Toggle entre Todas e Favoritas */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Todas as Dicas
        </button>
        <button
          onClick={() => setViewMode('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'favorites'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Star className="w-4 h-4" />
          Favoritas ({bookmarkedTips.size})
        </button>
      </div>

      {/* Search Bar - só aparece quando não está no modo favoritas ou quando há favoritas para buscar */}
      {(viewMode === 'all' || bookmarkedTips.size > 0) && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={viewMode === 'favorites' ? "Buscar nas favoritas..." : "Buscar dicas de saúde..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Category Filters - só aparece no modo "all" */}
      {viewMode === 'all' && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-md transform scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Health Tips Feed */}
      <div className="space-y-4">
        {filteredTips.map((tip) => (
          <article
            key={tip.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => openTipDetail(tip)}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {tip.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                        {tip.excerpt}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(tip.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                          bookmarkedTips.has(tip.id)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tip.readTime}
                      </span>
                      <span>{tip.date}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-white text-xs ${
                      categories.find(cat => cat.id === tip.category)?.color || 'bg-gray-500'
                    }`}>
                      {categories.find(cat => cat.id === tip.category)?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty States */}
      {filteredTips.length === 0 && viewMode === 'favorites' && bookmarkedTips.size === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma dica favorita ainda</h3>
          <p className="text-gray-500 mb-4">Toque no ícone de bookmark para salvar suas dicas favoritas</p>
          <button
            onClick={() => setViewMode('all')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver Todas as Dicas
          </button>
        </div>
      )}

      {filteredTips.length === 0 && viewMode === 'favorites' && bookmarkedTips.size > 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma favorita encontrada</h3>
          <p className="text-gray-500">Tente ajustar o termo de busca</p>
        </div>
      )}

      {filteredTips.length === 0 && viewMode === 'all' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma dica encontrada</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}

      {/* Source Attribution */}
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Conteúdo baseado em fontes confiáveis como 
          <span className="font-medium text-blue-600"> Ministério da Saúde</span> e 
          <span className="font-medium text-blue-600"> Dr. Drauzio Varella</span>
        </p>
      </div>
    </div>
  );
};

export default HealthTab;
