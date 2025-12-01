import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, FlatList, ActivityIndicator, Keyboard,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, ArrowLeft, Dumbbell, AlertCircle } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Interface local para garantir tipagem
interface Exercise {
  name: string;
  muscle: string;
  instructions: string;
  difficulty?: string;
}

export default function ExerciseFinderScreen() {
  const navigation = useNavigation();
  const [muscle, setMuscle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Função de busca
  const handleSearch = async () => {
    if (!muscle.trim()) return;

    Keyboard.dismiss();
    setIsLoading(true);
    setSearched(true);
    setExercises([]);

    try {
      // Simulação de chamada de API (Substitua pela sua lógica real do healthApi quando estiver pronta)
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados para teste imediato
      const allExercises: Exercise[] = [
        { name: 'Flexão de Braço', muscle: 'Peito', instructions: 'Deite-se de bruços e levante o corpo com os braços.', difficulty: 'Iniciante' },
        { name: 'Agachamento', muscle: 'Pernas', instructions: 'Agache como se fosse sentar em uma cadeira, mantendo as costas retas.', difficulty: 'Iniciante' },
        { name: 'Supino Reto', muscle: 'Peito', instructions: 'Empurre a barra para cima deitado no banco.', difficulty: 'Intermediário' },
        { name: 'Rosca Direta', muscle: 'Bíceps', instructions: 'Levante os halteres flexionando os cotovelos.', difficulty: 'Iniciante' },
        { name: 'Prancha', muscle: 'Abdômen', instructions: 'Mantenha o corpo reto apoiado nos antebraços.', difficulty: 'Intermediário' },
        { name: 'Corrida', muscle: 'Cardio', instructions: 'Corrida leve ou moderada.', difficulty: 'Iniciante' },
      ];

      // Filtro local
      const results = allExercises.filter(e => 
        e.muscle.toLowerCase().includes(muscle.toLowerCase()) || 
        e.name.toLowerCase().includes(muscle.toLowerCase())
      );

      setExercises(results);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ExerciseCard = ({ item }: { item: Exercise }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.muscle}</Text>
        </View>
      </View>
      <Text style={styles.cardInstructions}>{item.instructions}</Text>
      {item.difficulty && (
        <Text style={styles.difficultyText}>Dificuldade: {item.difficulty}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Exercícios</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Encontre exercícios por grupo muscular</Text>

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ex: peito, pernas, abdômen..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={muscle}
            onChangeText={setMuscle}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => <ExerciseCard item={item} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searched ? (
                <View style={styles.emptyContainer}>
                  <AlertCircle size={48} color={theme.colors.text.tertiary} />
                  <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
                  <Text style={styles.emptySubtext}>Tente termos como "peito" ou "pernas".</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Dumbbell size={64} color="#E5E7EB" />
                  <Text style={styles.emptySubtext}>Digite um músculo para começar a busca.</Text>
                </View>
              )
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
    textTransform: 'capitalize',
  },
  cardInstructions: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginTop: 8,
    textAlign: 'center',
  },
});