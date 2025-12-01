import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy } from 'lucide-react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';

const { width } = Dimensions.get('window');

export default function LevelCard() {
  const { userProfile } = useUserStore();

  // Lógica simulada de nível (pode ser substituída por dados reais do backend)
  // Exemplo: Nível = (pontos / 100) arredondado para baixo
  // XP Atual = pontos % 100
  const totalPoints = 350; // Mock ou userProfile.points
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const currentXP = totalPoints % 100;
  const nextLevelXP = 100;
  const progressPercent = (currentXP / nextLevelXP) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.contentRow}>
          <View>
            <Text style={styles.label}>Nível Atual</Text>
            <Text style={styles.levelNumber}>{currentLevel}</Text>
            <Text style={styles.pointsText}>{currentXP} / {nextLevelXP} XP</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <Trophy size={40} color="#FBBF24" fill="#FBBF24" />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.motivationText}>
            Faltam apenas {nextLevelXP - currentXP} pontos para o próximo nível!
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    padding: 24,
    borderRadius: 24,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levelNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 56,
  },
  pointsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressContainer: {
    marginTop: 8,
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FBBF24', // Amarelo Dourado
    borderRadius: 4,
  },
  motivationText: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});