// src/screens/Profile/AchievementsScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator,
    Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { ArrowLeft, Medal, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Interface para os dados da tabela 'achievements'
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: 'Junior' | 'Senior' | 'Star';
  xp_reward: number;
  is_earned?: boolean; // Adicionamos este campo para controle
}

// --- NOVO AchievementCard Component ---
const AchievementCard = ({ item }: { item: Achievement }) => {
    const getRarityStyle = (rarity: string) => {
        switch (rarity) {
            case 'Star': return { color: '#FBBF24', label: 'Estrela' };
            case 'Senior': return { color: '#34D399', label: 'Sênior' };
            case 'Junior': return { color: '#A78BFA', label: 'Júnior' };
            default: return { color: '#9CA3AF', label: 'Comum' };
        }
    };

    const rarityStyle = getRarityStyle(item.rarity);

    return (
        <View style={[styles.card, !item.is_earned && styles.cardLocked]}>
            <Image source={{ uri: item.icon_url }} style={styles.cardIcon} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            
            <View style={[styles.rarityBadge, { backgroundColor: `${rarityStyle.color}20` }]}>
                <Star size={12} color={rarityStyle.color} fill={rarityStyle.color} />
                <Text style={[styles.rarityText, { color: rarityStyle.color }]}>{rarityStyle.label}</Text>
            </View>

            {item.is_earned ? (
                <Text style={styles.statusTextCompleted}>Concluído</Text>
            ) : (
                <>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '50%' }]} />
                    </View>
                    <Text style={styles.statusTextNext}>Próximo</Text>
                </>
            )}
        </View>
    );
};


// --- TELA PRINCIPAL ---
export default function AchievementsScreen({ navigation }) {
  const { userProfile } = useUserStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // --- A CORREÇÃO ESTÁ AQUI ---
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!userProfile?.id) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        // 1. Buscar todas as conquistas disponíveis
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        // 2. Buscar os IDs das conquistas que o usuário já ganhou
        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', userProfile.id);

        if (achievementsError || userAchievementsError) {
          console.error(achievementsError || userAchievementsError);
          setLoading(false);
          return;
        }

        const earnedIds = new Set(userAchievementsData.map(ua => ua.achievement_id));
        
        // 3. Combinar os dados: marcar quais foram ganhas
        const finalAchievements = allAchievements.map(ach => ({
            ...ach,
            is_earned: earnedIds.has(ach.id),
        }));

        setAchievements(finalAchievements);
        setLoading(false);
      };

      fetchData();
    }, [userProfile?.id])
  );

  const earnedCount = achievements.filter(a => a.is_earned).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={StyleSheet.absoluteFill} />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Honras</Text>
        <View style={{width: 40}} />
      </View>

      {/* Card de Progresso */}
      <View style={styles.progressCard}>
        <View style={styles.medalIconContainer}>
            <Medal size={32} color="#FBBF24" />
        </View>
        <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Conquistas</Text>
            <Text style={styles.progressCount}>{earnedCount} / {totalCount}</Text>
        </View>
      </View>

      {/* Grelha de Conquistas */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({ item }) => <AchievementCard item={item} />}
          contentContainerStyle={styles.gridContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma conquista encontrada.</Text>}
        />
      )}

// src/screens/Profile/AchievementsScreen.tsx (VERSÃO COM RODAPÉ ESTÁTICO)

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { X, CheckCircle, Award, Crown, Circle, Trophy } from '../../components/Icons';

// --- Seus componentes AchievementCard, etc. continuam os mesmos ---
const AchievementCard = ({ achievement, isSelected, onSelect, isEarned }) => {
  const handlePress = () => {
    if (isEarned) {
      onSelect(achievement);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, !isEarned && styles.cardLocked]}
      onPress={handlePress}
      disabled={!isEarned}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Award size={28} color={isEarned ? '#4F46E5' : '#A0AEC0'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, !isEarned && styles.textLocked]}>{achievement}</Text>
        <Text style={[styles.cardSubtitle, !isEarned && styles.textLocked]}>
          {isEarned ? 'Conquistada em 14/01/2025' : 'Complete missões para desbloquear'}
        </Text>
      </View>
      {isEarned && (
        <View style={styles.checkbox}>
          {isSelected ? <CheckCircle size={24} color="#4F46E5" /> : <Circle size={24} color="#CBD5E1" />}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function AchievementsScreen({ navigation }) {
  const { userProfile, setDisplayedAchievements } = useUserStore();
  
  const [selected, setSelected] = useState(userProfile?.displayed_achievements || []);

  const earnedAchievements = userProfile?.available_achievements || ['Explorador', 'Ecológico', 'Saúde Total'];
  const allPossibleAchievements = ['Explorador', 'Ecológico', 'Saúde Total', 'Pioneiro', 'Conectado'];
  const toEarnAchievements = allPossibleAchievements.filter(ach => !earnedAchievements.includes(ach));

  const handleSelectAchievement = (achievement: string) => {
    const isAlreadySelected = selected.includes(achievement);
    if (isAlreadySelected) {
      setSelected(prev => prev.filter(item => item !== achievement));
    } else {
      if (selected.length < 3) {
        setSelected(prev => [...prev, achievement]);
      } else {
        Alert.alert('Limite Atingido', 'Você pode selecionar no máximo 3 conquistas para exibir.');
      }
    }
  };

  const handleClose = () => {
    setDisplayedAchievements(selected);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Conquistas</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
      
      {/* AQUI ESTÁ A MUDANÇA: O ScrollView agora ocupa o espaço flexível */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Exibir no Header</Text>
          <Text style={styles.infoSubtitle}>
            Selecione até 3 conquistas para aparecer no cabeçalho do app
          </Text>
          <Text style={styles.infoCounter}>{selected.length}/3 selecionadas</Text>
        </View>

        <Text style={styles.sectionTitle}>
          <Trophy size={20} color="#F59E0B" /> Conquistadas ({earnedAchievements.length})
        </Text>
        {earnedAchievements.map(ach => (
          <AchievementCard 
            key={ach}
            achievement={ach}
            isEarned={true}
            isSelected={selected.includes(ach)}
            onSelect={handleSelectAchievement}
          />
        ))}

        <Text style={styles.sectionTitle}>
          <Crown size={20} color="#6B7280" /> A Conquistar ({toEarnAchievements.length})
        </Text>
        {toEarnAchievements.map(ach => (
          <AchievementCard 
            key={ach}
            achievement={ach}
            isEarned={false}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </ScrollView>

      {/* O footer agora está FORA do ScrollView, ficando fixo embaixo */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Selecionadas para o Header:</Text>
        <View style={styles.tagsContainer}>
          {selected.length > 0 ? selected.map(ach => (
            <View key={ach} style={styles.tag}><Text style={styles.tagText}>{ach}</Text></View>
          )) : <Text style={styles.noTagText}>Nenhuma selecionada</Text>}
        </View>
      </View>    </SafeAreaView>
  );
}

// --- ESTILOS (sem alterações) ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    medalIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    progressInfo: { flex: 1, marginLeft: 16 },
    progressTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
    progressCount: { color: '#E5E7EB', fontSize: 14 },
    gridContainer: { paddingHorizontal: 16, paddingBottom: 40 },
    card: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    cardLocked: { opacity: 0.6 },
    cardIcon: { width: 64, height: 64, marginBottom: 12 },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 8, textAlign: 'center' },
    rarityBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    rarityText: { fontWeight: 'bold', fontSize: 12 },
    progressContainer: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        marginTop: 8,
    },
    progressBar: { height: '100%', backgroundColor: '#34D399', borderRadius: 3 },
    statusTextNext: { fontSize: 12, color: '#A7F3D0', marginTop: 4 },
    statusTextCompleted: { fontSize: 14, color: '#6EE7B7', fontWeight: '600', marginTop: 12 },
    emptyText: { color: 'white', textAlign: 'center', marginTop: 50 },
})

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' }, // O container principal agora usa flex
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingLeft: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
    closeButton: { padding: 4 },
    scrollContainer: { paddingHorizontal: 16, paddingBottom: 20 }, // Reduzi o padding de baixo
    infoBox: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
    infoSubtitle: { fontSize: 14, color: '#475569', marginTop: 4 },
    infoCounter: { fontSize: 14, fontWeight: '600', color: '#4F46E5', marginTop: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    cardLocked: { backgroundColor: '#F8FAFC' },
    iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
    cardSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
    textLocked: { color: '#9CA3AF' },
    checkbox: { marginLeft: 'auto' },
    // Estilo do Footer foi ajustado, não é mais 'position: absolute'
    footer: { 
      backgroundColor: 'white', 
      padding: 16, 
      paddingTop: 12, 
      borderTopWidth: 1, 
      borderTopColor: '#E2E8F0',
      // Ajuste para o espaçamento do bottom da safe area
      paddingBottom: 30,
      bottom: 55,
    },
    footerTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#475569' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    tagText: { color: '#4338CA', fontWeight: '500' },
    noTagText: { color: '#9CA3AF', fontStyle: 'italic' },
});