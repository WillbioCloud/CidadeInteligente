import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl,Text } from 'react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';

// Importação dos componentes da Gamificação
// Vamos corrigir estes arquivos nos próximos passos para garantir que não há erros
import LevelCard from '../../components/Gamification/LevelCard';
import DailyMissions from '../../components/Gamification/DailyMissions.component';
import AchievementsSection from '../../components/Gamification/AchievementsSection';
import InfoBanner from '../../components/Gamification/InfoBanner';

export default function GamificationTabScreen() {
  const { userProfile, fetchUserProfile, session } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (session) {
      setRefreshing(true);
      // Recarrega o perfil para atualizar pontos e nível
      await fetchUserProfile(session);
      setRefreshing(false);
    }
  }, [session, fetchUserProfile]);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.headerSpacer} />
        
        {/* Cartão de Nível e Progresso */}
        <LevelCard />

        {/* Banner de Informação (ex: Dica do dia ou Evento) */}
        <InfoBanner />

        {/* Missões Diárias */}
        <DailyMissions />

        {/* Seção de Conquistas (Resumo) */}
        <AchievementsSection />

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 16,
  },
  footerSpacer: {
    height: 100, // Espaço extra no final para não ficar coberto pela TabBar
  },
});