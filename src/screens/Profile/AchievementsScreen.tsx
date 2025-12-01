import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Lock, Star, Award } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/designSystem';
import { useUserStore } from '../../hooks/useUserStore';

const { width } = Dimensions.get('window');

// Dados simulados de conquistas (depois podes mover para src/data/achievements.data.ts)
const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'Primeiros Passos',
    description: 'Completou o cadastro inicial.',
    icon: UserBadge,
    unlocked: true,
    progress: 100,
  },
  {
    id: '2',
    title: 'Explorador',
    description: 'Visitou 5 comércios diferentes.',
    icon: MapBadge,
    unlocked: true,
    progress: 100,
  },
  {
    id: '3',
    title: 'Cidadão Ativo',
    description: 'Participou de 3 enquetes.',
    icon: VoteBadge,
    unlocked: false,
    progress: 33, // 1 de 3
  },
  {
    id: '4',
    title: 'Influenciador',
    description: 'Convidou 5 amigos para o app.',
    icon: SocialBadge,
    unlocked: false,
    progress: 0,
  },
];

// Componentes de Ícones (simples)
function UserBadge({ color }: { color: string }) { return <Award size={24} color={color} />; }
function MapBadge({ color }: { color: string }) { return <Trophy size={24} color={color} />; }
function VoteBadge({ color }: { color: string }) { return <Star size={24} color={color} />; }
function SocialBadge({ color }: { color: string }) { return <Award size={24} color={color} />; }

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const { userProfile } = useUserStore();

  // Nível fictício baseado em pontos (podes vir do backend depois)
  const currentLevel = 3;
  const currentPoints = 350;
  const nextLevelPoints = 500;
  const progressPercentage = (currentPoints / nextLevelPoints) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Conquistas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cartão de Nível Principal */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.levelCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.levelInfo}>
            <View>
              <Text style={styles.levelLabel}>Nível Atual</Text>
              <Text style={styles.levelValue}>{currentLevel}</Text>
            </View>
            <Trophy size={48} color="#FBBF24" />
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressText}>{currentPoints} XP</Text>
              <Text style={styles.progressText}>{nextLevelPoints} XP</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.motivationText}>
              Faltam {nextLevelPoints - currentPoints} pontos para o próximo nível!
            </Text>
          </View>
        </LinearGradient>

        {/* Lista de Conquistas */}
        <Text style={styles.sectionTitle}>Medalhas</Text>
        
        <View style={styles.grid}>
          {ACHIEVEMENTS.map((item) => {
            const IconComponent = item.icon;
            return (
              <View key={item.id} style={[styles.card, !item.unlocked && styles.cardLocked]}>
                <View style={[
                  styles.iconCircle, 
                  { backgroundColor: item.unlocked ? theme.colors.primaryBg : '#F3F4F6' }
                ]}>
                  {item.unlocked ? (
                    <IconComponent color={theme.colors.primary} />
                  ) : (
                    <Lock size={24} color="#9CA3AF" />
                  )}
                </View>
                
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                
                {!item.unlocked && item.progress > 0 && (
                  <View style={styles.miniProgressBg}>
                    <View 
                      style={[
                        styles.miniProgressFill, 
                        { width: `${item.progress}%`, backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  levelCard: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  levelValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 56,
  },
  progressContainer: {
    gap: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24', // Amarelo Dourado
    borderRadius: 4,
  },
  motivationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginLeft: 20,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  card: {
    width: (width - 48) / 2, // 2 colunas com margens
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  miniProgressBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 8,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});