import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle, Gift } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Interface compatível com o que definimos em DailyMissions
interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  icon: string;
}

interface MissionCardProps {
  mission: Mission;
  onClaim: () => void;
}

export default function MissionCard({ mission, onClaim }: MissionCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, mission.completed && styles.cardCompleted]} 
      onPress={onClaim}
      activeOpacity={0.8}
      disabled={mission.completed}
    >
      <View style={styles.iconContainer}>
        {mission.completed ? (
          <CheckCircle size={28} color={theme.colors.primary} />
        ) : (
          <Circle size={28} color={theme.colors.text.tertiary} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, mission.completed && styles.textCompleted]}>
          {mission.title}
        </Text>
        <Text style={styles.description}>{mission.description}</Text>
      </View>

      <View style={styles.rewardContainer}>
        {mission.completed ? (
          <Text style={styles.completedLabel}>Feito!</Text>
        ) : (
          <View style={styles.xpBadge}>
            <Gift size={14} color="#FFF" />
            <Text style={styles.xpText}>+{mission.xp} XP</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: 'transparent',
    elevation: 0,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.tertiary,
  },
  description: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  rewardContainer: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});