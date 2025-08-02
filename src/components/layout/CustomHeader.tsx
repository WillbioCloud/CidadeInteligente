// src/components/layout/CustomHeader.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Bell, User, Award, Star } from '../Icons';
import { useUserStore } from '../../hooks/useUserStore';
import { useModals } from '../../context/ModalContext';

// --- AQUI ESTÁ A MUDANÇA ---
// Adicionamos a nova prop para que o MainLayout possa nos dizer o que fazer
interface CustomHeaderProps {
  onNotificationsPress: () => void;
}

export default function CustomHeader({ onNotificationsPress }: CustomHeaderProps) {
  const { userProfile } = useUserStore();
  const { showProfile } = useModals();

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Usuário';
  const displayedAchievements = userProfile?.displayed_achievements || [];
  const userLevel = userProfile?.level || 1;
  const avatarUrl = userProfile?.avatar_url;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.avatarContainer} onPress={showProfile}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color="#4A90E2" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfoContainer}>
          <View style={styles.userRow}>
            <Text style={styles.greetingText}>Olá, {firstName}!</Text>
            <View style={styles.levelContainer}>
              <Star size={14} color="#F5A623" />
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            {displayedAchievements.length > 0 ? (
              displayedAchievements.map((ach, index) => (
                <View key={index} style={styles.achievementTag}>
                  <Award size={10} color="#4338CA" />
                  <Text style={styles.achievementText}>{ach}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.loteamentoText}>Selecione suas conquistas</Text>
            )}
          </View>
        </View>

        {/* Agora, ao pressionar o sino, ele chama a função que o MainLayout nos passou */}
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationsPress}>
          <Bell size={24} color="#333" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  // --- FIM DA MUDANÇA ---
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF2FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfoContainer: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    color: '#F5A623',
    marginLeft: 2,
  },
  loteamentoText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  notificationButton: {
    marginLeft: 12,
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: 'white',
    pulse: {
      animation: 'pulse 1.5s infinite',
      '@keyframes pulse': {
        '0%': { transform: [{ scale: 1 }] },
        '50%': { transform: [{ scale: 1.5 }] },
        '100%': { transform: [{ scale: 1 }] },
      }}
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
  },
  achievementText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
});