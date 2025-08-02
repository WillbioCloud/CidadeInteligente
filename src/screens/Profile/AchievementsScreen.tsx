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
      </View>
    </SafeAreaView>
  );
}

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