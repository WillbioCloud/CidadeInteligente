import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Trophy, ArrowRight, Lock, Star, Award } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';
import { GamificationStackParamList } from '../../navigation/types';

// Tipagem da navegação
type GamificationNavigationProp = StackNavigationProp<GamificationStackParamList>;

// Dados Mockados para o resumo (pode vir do backend)
const RECENT_ACHIEVEMENTS = [
  { id: '1', icon: Award, color: '#F59E0B', unlocked: true },
  { id: '2', icon: Trophy, color: '#3B82F6', unlocked: true },
  { id: '3', icon: Star, color: '#10B981', unlocked: false },
  { id: '4', icon: Award, color: '#8B5CF6', unlocked: false },
];

export default function AchievementsSection() {
  const navigation = useNavigation<GamificationNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suas Conquistas</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('Achievements')}
        >
          <Text style={styles.seeAllText}>Ver todas</Text>
          <ArrowRight size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgesContainer}
      >
        {RECENT_ACHIEVEMENTS.map((item) => {
          const Icon = item.icon;
          return (
            <View 
              key={item.id} 
              style={[
                styles.badge, 
                !item.unlocked && styles.badgeLocked
              ]}
            >
              {item.unlocked ? (
                <Icon size={24} color={item.color} />
              ) : (
                <Lock size={20} color="#9CA3AF" />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  badgesContainer: {
    gap: 12,
    paddingRight: 16,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  badgeLocked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
});