// screens/More/MoreTabScreen.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
    Calendar, Camera, Heart, Star, MapPin, Clock, Bell, Plus, ChevronRight, Newspaper 
} from '../../components/Icons';
// A linha "import CustomHeader" foi REMOVIDA daqui.

// Seus componentes 'sections' e 'quickActions' continuam os mesmos
const sections = [
  {
    title: 'Eventos & Comunidade',
    items: [
      { id: 'CommunityEvents', icon: Calendar, title: 'Eventos da Comunidade', description: 'Festas, workshops e atividades' },
      { id: 'MonitoringCameras', icon: Camera, title: 'Câmeras de Monitoramento', description: 'Visualização das câmeras públicas' },
      { id: 'RegionNews', icon: Newspaper, title: 'Notícias da Região', description: 'Últimas novidades do bairro' },
    ]
  },
  {
    title: 'Serviços & Suporte',
    items: [
      { id: 'Courses', icon: Star, title: 'Cursos e Formações', description: 'Escola do Futuro e capacitações' },
      { id: 'Support', icon: Heart, title: 'Contato Pós-venda', description: 'Suporte e atendimento ao cliente' },
      { id: 'CourtScheduling', icon: MapPin, title: 'Agendamento de Quadras', description: 'Reserve espaços esportivos' },
    ]
  },
  {
    title: 'Sustentabilidade',
    items: [
      { id: 'SustainableTips', icon: Plus, title: 'Dicas Sustentáveis', description: 'Como cuidar do seu lote e do planeta' },
      { id: 'GarbageSeparation', icon: Bell, title: 'Separação de Lixo', description: 'Tutorial completo de reciclagem' },
      { id: 'WeatherForecast', icon: Clock, title: 'Previsão do Tempo', description: 'Condições para atividades ao ar livre' },
    ]
  }
];

const quickActions = [
    { id: 'Emergency', icon: '🚨', title: 'Emergência', color: '#EF4444' },
    { id: 'FBZSpace', icon: '🏠', title: 'Espaço FBZ', color: '#3B82F6' },
    { id: 'SpaceCapacity', icon: '📊', title: 'Lotação', color: '#10B981' },
    { id: 'IPTU', icon: '🧾', title: 'IPTU', color: '#8B5CF6' }
];

export default function MoreTabScreen({ navigation }) {
  const handleNavigation = (screenId: string) => {
    navigation.navigate(screenId);
  };

  return (
    // AQUI ESTÁ A MUDANÇA:
    // Trocamos SafeAreaView por ScrollView. O header e o espaçamento do topo
    // são agora controlados pelo navegador, garantindo consistência.
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
    >
      {/* A linha <CustomHeader /> foi REMOVIDA */}
      <View style={styles.header}>
          <Text style={styles.title}>Mais Serviços</Text>
          <Text style={styles.subtitle}>Explore todas as funcionalidades do app</Text>
      </View>

      <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={[styles.quickActionCard, { backgroundColor: action.color }]} onPress={() => handleNavigation(action.id)}>
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
      </View>

      {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                      <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleNavigation(item.id)}>
                          <View style={styles.iconContainer}>
                              <Icon size={22} color="#3B82F6"/>
                          </View>
                          <View style={styles.menuItemTextContainer}>
                              <Text style={styles.menuItemTitle}>{item.title}</Text>
                              <Text style={styles.menuItemDescription}>{item.description}</Text>
                          </View>
                          <ChevronRight size={20} color="#CBD5E1" />
                      </TouchableOpacity>
                  )
              })}
          </View>
      ))}

      <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>💭 Sua Opinião Importa</Text>
          <Text style={styles.feedbackDescription}>Ajude-nos a melhorar o app com seu feedback.</Text>
          <TouchableOpacity style={styles.feedbackButton} onPress={() => handleNavigation('Feedback')}>
              <Text style={styles.feedbackButtonText}>Enviar Feedback</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  quickActionIcon: {
    fontSize: 28,
  },
  quickActionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  feedbackCard: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  feedbackTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackDescription: {
    color: '#E0E7FF',
    marginTop: 5,
    marginBottom: 15,
  },
  feedbackButton: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  feedbackButtonText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});