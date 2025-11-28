// src/components/layout/CustomHeader.tsx (VERSÃO COM TAGS MENORES E NÍVEL)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Bell, User, Award, Star } from '../Icons'; // Importamos o Star de volta
import { useUserStore } from '../../hooks/useUserStore';
import { useModals } from '../../context/ModalContext';

export default function CustomHeader() {
  const { userProfile } = useUserStore();
  const { showProfile, showNotifications } = useModals();

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Usuário';
  const displayedAchievements = userProfile?.displayed_achievements || [];
  const userLevel = userProfile?.level || 1; // Pega o nível do usuário

  return (
    <View style={styles.headerContainer}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.avatarContainer} onPress={showProfile}>
          <View style={styles.avatarPlaceholder}>
            <User size={24} color="#4A90E2" />
          </View>
        </TouchableOpacity>

        <View style={styles.userInfoContainer}>
          <View style={styles.userRow}>
            <Text style={styles.greetingText}>Olá, {firstName}!</Text>
            {/* Exibe a estrela com o nível */}
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

        <TouchableOpacity style={styles.notificationButton} onPress={showNotifications}>
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
  userInfoContainer: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha os itens à esquerda
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 8, // Espaço entre o nome e o nível
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
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2, // Reduzi um pouco a margem superior
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10, // Arredondamento menor
    paddingHorizontal: 6, // Padding menor
    paddingVertical: 3,   // Padding menor
    marginRight: 4,     // Margem menor
  },
  achievementText: {
    color: '#4338CA',
    fontSize: 10,     // Fonte menor
    fontWeight: '600',
    marginLeft: 3,    // Espaço menor para o ícone
  },
});