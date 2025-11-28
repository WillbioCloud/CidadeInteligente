import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyMission, LevelMission } from '../../data/missions.data';

interface MissionCardProps {
  // O card pode receber tanto uma missão diária quanto de evolução
  mission: DailyMission | LevelMission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  // A barra de progresso ainda não é dinâmica, ficará em 0% por enquanto
  const progress = 0; 

  return (
    <View style={styles.card}>
      {/* Container do Ícone */}
      <View style={[styles.iconContainer, { backgroundColor: mission.color }]}>
        <Ionicons name={mission.icon as any} size={28} color="white" />
      </View>

      {/* Container de Texto e Progresso */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{mission.title}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.points}>{mission.points}</Text>
          </View>
        </View>
        <Text style={styles.description}>{mission.description}</Text>
        
        {/* Barra de Progresso */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% concluída</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Permite que o texto quebre a linha se for muito grande
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007BFF', // Azul para o progresso
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#6C757D',
    marginTop: 4,
    textAlign: 'right',
  },
});// ...existing code...
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Verifica a sessão atual quando o app abre
  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
  };

  fetchSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    authListener?.subscription.unsubscribe();
  };
}, []);

if (loading) {
  return null; // Ou um componente de <LoadingScreen />
}
// ...existing code...