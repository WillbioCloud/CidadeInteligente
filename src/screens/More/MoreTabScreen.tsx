import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Video, Newspaper, GraduationCap, LifeBuoy, Award, ChevronRight, ShieldAlert } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';
import { MoreStackParamList } from '../../navigation/types';

// Tipagem da navegação para este ecrã
type MoreScreenNavigationProp = StackNavigationProp<MoreStackParamList, 'Menu'>;

export default function MoreTabScreen() {
  const navigation = useNavigation<MoreScreenNavigationProp>();

  const menuItems = [
    {
      id: 'events',
      label: 'Eventos',
      description: 'Agenda da comunidade',
      icon: Calendar,
      color: '#8B5CF6', // Roxo
      route: 'CommunityEvents',
    },
    {
      id: 'cameras',
      label: 'Câmeras',
      description: 'Monitoramento ao vivo',
      icon: Video,
      color: '#EF4444', // Vermelho
      route: 'MonitoringCameras',
    },
    {
      id: 'news',
      label: 'Notícias',
      description: 'Atualizações da região',
      icon: Newspaper,
      color: '#3B82F6', // Azul
      route: 'RegionNews',
    },
    {
      id: 'courses',
      label: 'Cursos',
      description: 'Formação e workshops',
      icon: GraduationCap,
      color: '#F59E0B', // Laranja
      route: 'Courses',
    },
    {
      id: 'achievements',
      label: 'Conquistas',
      description: 'Seus prêmios e nível',
      icon: Award,
      color: '#10B981', // Verde
      route: 'Achievements',
    },
    {
      id: 'support',
      label: 'Suporte',
      description: 'Fale conosco',
      icon: LifeBuoy,
      color: theme.colors.text.secondary,
      route: 'Support',
    },
  ];

  const handlePanicButton = () => {
    Alert.alert(
      'Botão de Pânico',
      'Deseja enviar um alerta de emergência para a segurança do condomínio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'ENVIAR ALERTA', 
          style: 'destructive', 
          onPress: () => Alert.alert('Alerta Enviado', 'A segurança foi notificada e está a caminho.') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais Opções</Text>
        <Text style={styles.headerSubtitle}>Serviços e utilidades do condomínio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Botão de Pânico (Destaque) */}
        <TouchableOpacity 
          style={styles.panicButton} 
          onPress={handlePanicButton}
          activeOpacity={0.8}
        >
          <View style={styles.panicIconContainer}>
            <ShieldAlert size={24} color="#FFF" />
          </View>
          <View style={styles.panicTextContainer}>
            <Text style={styles.panicTitle}>Botão de Pânico</Text>
            <Text style={styles.panicSubtitle}>Acione em caso de emergência</Text>
          </View>
          <ChevronRight size={20} color="#FECACA" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Serviços</Text>

        <View style={styles.grid}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => navigation.navigate(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={24} color={item.color} />
                </View>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  panicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  panicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  panicTextContainer: {
    flex: 1,
  },
  panicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  panicSubtitle: {
    fontSize: 14,
    color: '#FEE2E2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%', // Aproximadamente metade menos o gap
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    lineHeight: 16,
  },
});