import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/designSystem';
import MissionCard from './MissionCard'; 

// Interface local para evitar dependências externas que podem falhar
export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  icon: string; // nome do ícone
}

// Dados simulados (Mock) para garantir que a UI aparece
const INITIAL_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Caminhada Matinal',
    description: 'Caminhe 2km pelas trilhas ecológicas.',
    xp: 50,
    completed: true, // Exemplo de missão já feita
    icon: 'footsteps',
  },
  {
    id: '2',
    title: 'Apoie o Local',
    description: 'Faça um check-in em um comércio parceiro.',
    xp: 100,
    completed: false,
    icon: 'store',
  },
  {
    id: '3',
    title: 'Hidratação',
    description: 'Beba água nos bebedouros do parque.',
    xp: 20,
    completed: false,
    icon: 'water',
  },
];

export default function DailyMissions() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

  const handleClaim = (id: string) => {
    // Lógica para coletar recompensa (marcar como completada visualmente)
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, completed: true } : m
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Missões Diárias</Text>
      
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          onClaim={() => handleClaim(mission.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});