import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageCircle, Mail, Map, Calendar, ArrowRight } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Dados fictícios do corretor ou equipa de vendas
const REALTOR_CONTACTS = [
  {
    id: '1',
    name: 'Central de Vendas',
    role: 'Atendimento Geral',
    whatsapp: '5561999999999', // Substitua pelo número real
    email: 'vendas@cidadeinteligente.com.br',
    avatar: 'https://via.placeholder.com/100', // Pode usar um logo
  },
  {
    id: '2',
    name: 'João Silva',
    role: 'Corretor Especialista',
    whatsapp: '5561988888888',
    email: 'joao.silva@cidadeinteligente.com.br',
    avatar: 'https://via.placeholder.com/100',
  }
];

export default function RealtorTabScreen() {
  
  const handleWhatsApp = (number: string) => {
    const message = "Olá! Gostaria de saber mais sobre os lotes disponíveis.";
    Linking.openURL(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plantão de Vendas</Text>
        <Text style={styles.headerSubtitle}>Realize o sonho da casa própria</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Banner Promocional */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Oportunidade Única!</Text>
            <Text style={styles.promoText}>
              Lotes no "Cidade das Flores" com condições especiais de financiamento.
            </Text>
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => handleWhatsApp(REALTOR_CONTACTS[0].whatsapp)}
            >
              <Text style={styles.promoButtonText}>Saiba Mais</Text>
              <ArrowRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nossa Equipe</Text>

        {REALTOR_CONTACTS.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.whatsappButton]}
                onPress={() => handleWhatsApp(contact.whatsapp)}
              >
                <MessageCircle size={20} color="#FFF" />
                <Text style={styles.actionTextWhite}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => handleCall(contact.whatsapp)}
              >
                <Phone size={20} color={theme.colors.text.secondary} />
                <Text style={styles.actionTextGray}>Ligar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.emailButton]}
                onPress={() => handleEmail(contact.email)}
              >
                <Mail size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Serviços</Text>
        
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceCard} onPress={() => Alert.alert('Em breve', 'Agendamento online em breve.')}>
            <Calendar size={28} color={theme.colors.primary} />
            <Text style={styles.serviceText}>Agendar Visita</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard} onPress={() => Alert.alert('Em breve', 'Mapa de disponibilidade em breve.')}>
            <Map size={28} color={theme.colors.primary} />
            <Text style={styles.serviceText}>Mapa de Lotes</Text>
          </TouchableOpacity>
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
    paddingVertical: 16,
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
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  promoCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  promoContent: {
    gap: 8,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  promoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 8,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  contactRole: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    flex: 1,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flex: 2, // Botão maior
  },
  callButton: {
    backgroundColor: '#F3F4F6',
  },
  emailButton: {
    backgroundColor: '#F3F4F6',
    width: 44,
    flex: 0, // Tamanho fixo
    paddingHorizontal: 0, // Centralizar ícone
  },
  actionTextWhite: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  actionTextGray: {
    color: theme.colors.text.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
});