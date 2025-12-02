import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { theme } from '../../styles/designSystem';
import MissionCard, { Mission } from './MissionCard';
import MissionValidationModal from './MissionValidationModal';

const INITIAL_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Check-in no Parque',
    description: 'Visite o Parque Linear e escaneie o código na entrada.',
    xp: 150,
    completed: false,
    icon: 'map-pin',
    requiresValidation: true, // Esta missão requer QR Code
  },
  {
    id: '2',
    title: 'Cliente Fiel',
    description: 'Faça uma compra em um comércio local parceiro.',
    xp: 100,
    completed: false,
    icon: 'shopping-bag',
    requiresValidation: true,
  },
  {
    id: '3',
    title: 'Hidratação Diária',
    description: 'Beba água e marque aqui para ganhar pontos.',
    xp: 20,
    completed: false,
    icon: 'droplet',
    requiresValidation: false, // Esta é automática (apenas clique)
  },
];

export default function DailyMissions() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleMissionPress = (mission: Mission) => {
    if (mission.requiresValidation) {
      setSelectedMission(mission);
      setModalVisible(true);
    } else {
      // Se não requer validação, completa direto
      completeMission(mission.id);
    }
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, completed: true } : m
    ));
    Alert.alert('Parabéns!', 'Você completou a missão e ganhou XP!');
  };

  const validateCode = async (code: string): Promise<boolean> => {
    // Simulação de validação no backend
    // Aqui você chamaria: await supabase.rpc('validate_mission_code', { code })
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para teste, qualquer código com "OK" é válido
    if (code.includes('OK') || code.length > 3) {
      if (selectedMission) completeMission(selectedMission.id);
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Missões Disponíveis</Text>
      
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          onPress={() => handleMissionPress(mission)}
        />
      ))}

      {selectedMission && (
        <MissionValidationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onValidate={validateCode}
          missionTitle={selectedMission.title}
        />
      )}
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
});