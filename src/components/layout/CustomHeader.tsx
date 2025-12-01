import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, User, Award, Star } from 'lucide-react-native'; // Usando Lucide direto para consistência
import { useUserStore } from '../../hooks/useUserStore';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/designSystem';

interface CustomHeaderProps {
  onNotificationsPress?: () => void;
}

export default function CustomHeader({ onNotificationsPress }: CustomHeaderProps) {
  const navigation = useNavigation<any>();
  const { userProfile } = useUserStore();
  const [hasUnread, setHasUnread] = useState(false);

  const firstName = userProfile?.full_name?.split(' ')[0] || 'Vizinho';
  const avatarUrl = userProfile?.avatar_url;
  
  // Cálculo simples de nível (ou pegar do banco se existir)
  // Se não houver campo 'points', assume 0
  const points = (userProfile as any)?.points || 0;
  const userLevel = Math.floor(points / 100) + 1;

  // Mock de conquistas para exibição (ou pegar do perfil)
  const displayedAchievements = ['Pioneiro', 'Verificado']; 

  useEffect(() => {
    if (!userProfile?.id) return;

    // 1. Verificar notificações iniciais
    const checkUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userProfile.id)
        .eq('is_read', false);
      
      if (count && count > 0) setHasUnread(true);
    };

    checkUnread();

    // 2. Ouvir novas notificações em tempo real
    const subscription = supabase
      .channel('header_notifications')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userProfile.id}`
        },
        () => {
          setHasUnread(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userProfile?.id]);

  const handleProfilePress = () => {
    // Navega para a aba de Conta
    navigation.navigate('Conta');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.content}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={handleProfilePress}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={20} color={theme.colors.primary} />
            </View>
          )}
        </TouchableOpacity>

        {/* Info do Utilizador */}
        <View style={styles.userInfoContainer}>
          <View style={styles.userRow}>
            <Text style={styles.greetingText}>Olá, {firstName}!</Text>
            <View style={styles.levelBadge}>
              <Star size={10} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          </View>

          <View style={styles.achievementsContainer}>
            {displayedAchievements.map((ach, index) => (
              <View key={index} style={styles.achievementTag}>
                <Award size={10} color={theme.colors.primary} />
                <Text style={styles.achievementText}>{ach}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão de Notificações */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => {
            setHasUnread(false);
            if (onNotificationsPress) onNotificationsPress();
          }}
        >
          <Bell size={24} color={theme.colors.text.primary} />
          {hasUnread && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 50 : 10, // Ajuste de Safe Area
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 70,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginRight: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  levelText: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    gap: 4,
  },
  achievementText: {
    color: theme.colors.primaryDark,
    fontSize: 10,
    fontWeight: '600',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});