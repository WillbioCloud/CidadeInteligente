import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useLoteamentos } from '@/hooks/useLoteamentos';

interface LoteamentoSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (loteamentoId: string) => void;
  showAddOption?: boolean;
}

const LoteamentoSelector: React.FC<LoteamentoSelectorProps> = ({
  isOpen,
  onOpenChange,
  onSelect,
  showAddOption = false
}) => {
  const { getAllLoteamentos, userLoteamentos, currentLoteamento, addUserLoteamento } = useLoteamentos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    loteamentoId: '',
    quadra: '',
    lote: '',
    tamanho: ''
  });

  const allLoteamentos = getAllLoteamentos();
  const availableLoteamentos = showAddOption 
    ? allLoteamentos.filter(l => !userLoteamentos.find(ul => ul.id === l.id))
    : allLoteamentos;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addFormData.loteamentoId && addFormData.quadra && addFormData.lote) {
      // Fix: Change loteamentoId to id to match the expected interface
      const loteamentoData = {
        id: addFormData.loteamentoId,
        quadra: addFormData.quadra,
        lote: addFormData.lote,
        tamanho: addFormData.tamanho
      };
      
      addUserLoteamento(loteamentoData);
      
      // Update localStorage with new loteamento
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const updatedLoteamentos = [...(userData.loteamentos || []), loteamentoData];
        const updatedUser = { ...userData, loteamentos: updatedLoteamentos };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      
      setShowAddForm(false);
      setAddFormData({ loteamentoId: '', quadra: '', lote: '', tamanho: '' });
      onOpenChange(false);
    }
  };

  if (showAddForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Adicionar Propriedade
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loteamento
              </label>
              <select
                value={addFormData.loteamentoId}
                onChange={(e) => setAddFormData({ ...addFormData, loteamentoId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um loteamento</option>
                {availableLoteamentos.map((loteamento) => (
                  <option key={loteamento.id} value={loteamento.id}>
                    {loteamento.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadra
                </label>
                <input
                  type="text"
                  value={addFormData.quadra}
                  onChange={(e) => setAddFormData({ ...addFormData, quadra: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lote
                </label>
                <input
                  type="text"
                  value={addFormData.lote}
                  onChange={(e) => setAddFormData({ ...addFormData, lote: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 15"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho do Lote (opcional)
              </label>
              <input
                type="text"
                value={addFormData.tamanho}
                onChange={(e) => setAddFormData({ ...addFormData, tamanho: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 300m²"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Adicionar Propriedade
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showAddOption ? 'Gerenciar Propriedades' : 'Selecionar Loteamento'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {showAddOption && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="w-full justify-start h-16 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Plus className="w-5 h-5 mr-3" />
              <span>Adicionar Nova Propriedade</span>
            </Button>
          )}
          
          {userLoteamentos.map((loteamento) => (
            <button
              key={loteamento.id}
              onClick={() => {
                onSelect(loteamento.id);
                onOpenChange(false);
              }}
              className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-200 hover:scale-105 ${
                currentLoteamento === loteamento.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={loteamento.logo}
                  alt={loteamento.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{loteamento.name}</h3>
                  <p className="text-sm text-gray-600">{loteamento.city}</p>
                  <p className="text-xs text-gray-500">
                    Quadra {loteamento.quadra} • Lote {loteamento.lote}
                  </p>
                  {loteamento.tamanho && (
                    <p className="text-xs text-gray-400">{loteamento.tamanho}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {userLoteamentos.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-600 mb-3">Nenhuma propriedade cadastrada</p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Propriedade
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoteamentoSelector;
