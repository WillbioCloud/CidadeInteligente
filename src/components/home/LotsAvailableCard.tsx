import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Home, ArrowRight } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/designSystem';
import { useModal } from '../../context/ModalContext';
import { LotsAvailableModal } from './LotsAvailableModal';

export const LotsAvailableCard = () => {
  const [totalLots, setTotalLots] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();

  useEffect(() => {
    const fetchLots = async () => {
      try {
        // Busca a soma dos lotes disponíveis na tabela 'loteamentos'
        const { data, error } = await supabase
          .from('loteamentos')
          .select('available_lots');

        if (error) throw error;

        // Soma o total de lotes disponíveis
        const total = data?.reduce((acc, curr) => acc + (curr.available_lots || 0), 0) || 0;
        setTotalLots(total);
      } catch (error) {
        console.error('Erro ao buscar lotes:', error);
        setTotalLots(0); // Em caso de erro, assume 0 ou mostra traço
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  const handlePress = () => {
    // Abre o modal com os detalhes
    showModal(<LotsAvailableModal />);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Home size={24} color={theme.colors.primary} />
        </View>
        {/* Indicador visual de que é clicável */}
        <ArrowRight size={16} color={theme.colors.text.tertiary} />
      </View>

      <View>
        <Text style={styles.label}>Lotes Disponíveis</Text>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ alignSelf: 'flex-start' }} />
        ) : (
          <Text style={styles.count}>
            {totalLots !== null ? totalLots : '-'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    height: 140, // Mesma altura do WeatherCard para alinhar
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: theme.colors.primaryBg, // Fundo verde claro
    padding: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  count: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
});