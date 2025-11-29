// src/screens/Profile/ProfileTabScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../hooks/useUserStore';
import { supabase } from '../../lib/supabase';
import { User, ChevronRight, LogOut, Building, Award, Settings, Star, Heart, Moon, HelpCircle } from 'lucide-react-native';

// O import de LEVELS_DATA foi removido pois não é mais necessário

// Componente para um item do menu
const MenuItem = ({ icon: Icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Icon size={22} color="#4B5563" />
        <Text style={styles.menuText}>{label}</Text>
        <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

export default function ProfileTabScreen() {
  const navigation = useNavigation();
  const { userProfile, clearStore } = useUserStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- ALTERAÇÃO AQUI ---
  // Buscamos o nível e o XP diretamente do perfil do usuário,
  // garantindo a sincronia com o resto do app.
  const userLevel = userProfile?.level || 1;
  const userXp = userProfile?.xp || 0;
  // A lógica antiga com useMemo foi removida.

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearStore();
  };

  if (!userProfile) return <SafeAreaView style={styles.container} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Conta</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seção de Perfil */}
        <View style={styles.profileSection}>
            <View style={styles.avatar}>
                {userProfile.avatar_url ? (
                    <Image source={{ uri: userProfile.avatar_url }} style={styles.avatarImage} />
                ) : ( <User size={40} color="#4A90E2" /> )}
            </View>
            <Text style={styles.userName}>{userProfile.full_name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        {/* Card Principal de Gamificação */}
        <View style={styles.gamificationCard}>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>NÍVEL</Text>
                <View style={styles.statValueContainer}>
                    <Star size={20} color="#166534" />
                    {/* --- VALOR ATUALIZADO --- */}
                    <Text style={styles.statValue}>{userLevel}</Text>
                </View>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>XP</Text>
                 <View style={styles.statValueContainer}>
                    <Heart size={20} color="#166534" />
                    {/* --- VALOR ATUALIZADO --- */}
                    <Text style={styles.statValue}>{userXp}</Text>
                </View>
            </View>
        </View>

        {/* Seção CONTA */}
        <Text style={styles.sectionTitle}>CONTA</Text>
        <View style={styles.menuContainer}>
            <MenuItem icon={Building} label="Meus Empreendimentos" onPress={() => navigation.navigate('Empreendimentos')} />
            <MenuItem icon={Award} label="Minhas Conquistas" onPress={() => navigation.navigate('Achievements')} />
            <MenuItem icon={Settings} label="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
        </View>

        {/* Seção PREFERÊNCIAS */}
        <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
        <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
                <Moon size={22} color="#4B5563" />
                <Text style={styles.menuText}>Modo Escuro</Text>
                <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
            <MenuItem icon={HelpCircle} label="Suporte" onPress={() => navigation.navigate('Support')} />
        </View>

        {/* Logout e Versão */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { alignItems: 'center', paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80 },
  profileSection: { alignItems: 'center', marginVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userEmail: { color: '#64748B', marginTop: 4 },
  gamificationCard: { flexDirection: 'row', backgroundColor: '#DCFCE7', borderRadius: 16, padding: 20, marginBottom: 32 },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: '#15803D', fontWeight: '600', marginBottom: 8 },
  statValueContainer: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#166534', marginLeft: 6 },
  statSeparator: { width: 1, backgroundColor: 'rgba(22, 101, 52, 0.2)' },
  sectionTitle: { color: '#64748B', fontWeight: '600', marginBottom: 8, marginLeft: 8 },
  menuContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuText: { flex: 1, marginLeft: 16, fontSize: 16, color: '#1E293B' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  logoutText: { flex: 1, marginLeft: 16, fontSize: 16, color: '#EF4444', fontWeight: '600' },
  versionText: { textAlign: 'center', color: '#9CA3AF', marginTop: 24 },
});