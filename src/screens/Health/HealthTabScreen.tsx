import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Activity, 
  Apple, 
  Heart, 
  Phone, 
  MapPin, 
  ChevronRight,
  Stethoscope
} from 'lucide-react-native';
import { theme } from '../../styles/designSystem';
import { LinearGradient } from 'expo-linear-gradient';

// Definição local de tipos se o arquivo global ainda não estiver 100% propagado
type HealthScreenNavigationProp = StackNavigationProp<any>;

export default function HealthTabScreen() {
  const navigation = useNavigation<HealthScreenNavigationProp>();

  const handleEmergencyCall = () => {
    Alert.alert(
      'Ligar para Emergência?',
      'Deseja ligar para o SAMU (192)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', style: 'destructive', onPress: () => Linking.openURL('tel:192') }
      ]
    );
  };

  const menuItems = [
    {
      id: 'nutrition',
      title: 'Nutrição',
      subtitle: 'Calculadora de Calorias e IMC',
      icon: Apple,
      color: '#10B981', // Verde
      onPress: () => navigation.navigate('NutritionCalculator'),
    },
    {
      id: 'exercises',
      title: 'Exercícios',
      subtitle: 'Encontre atividades físicas',
      icon: Activity,
      color: '#3B82F6', // Azul
      onPress: () => navigation.navigate('ExerciseFinder'),
    },
    {
      id: 'pharmacies',
      title: 'Farmácias',
      subtitle: 'Ver farmácias próximas',
      icon: MapPin,
      color: '#F59E0B', // Laranja
      onPress: () => {
        // Redireciona para o mapa filtrando por saúde/comércio
        navigation.navigate('Mapa', { filter: 'Saúde' });
      },
    },
    {
      id: 'telemedicine',
      title: 'Telemedicina',
      subtitle: 'Agende uma consulta online',
      icon: Stethoscope,
      color: '#8B5CF6', // Roxo
      onPress: () => {
        Alert.alert('Em breve', 'A funcionalidade de telemedicina estará disponível na próxima atualização.');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saúde e Bem-estar</Text>
          <Text style={styles.headerSubtitle}>Cuidando de você e da sua família.</Text>
        </View>

        {/* Card de Destaque */}
        <LinearGradient
          colors={['#EF4444', '#B91C1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emergencyCard}
        >
          <View style={styles.emergencyContent}>
            <View>
              <Text style={styles.emergencyTitle}>Emergência?</Text>
              <Text style={styles.emergencySubtitle}>Toque para chamar ajuda imediata.</Text>
            </View>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={handleEmergencyCall}
            >
              <Phone size={24} color="#EF4444" fill="#EF4444" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Grid de Opções */}
        <Text style={styles.sectionTitle}>Serviços</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={28} color={item.color} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dica de Saúde (Estática por enquanto) */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Heart size={20} color={theme.colors.primary} fill={theme.colors.primary} />
            <Text style={styles.tipTitle}>Dica de Saúde</Text>
          </View>
          <Text style={styles.tipText}>
            Beber pelo menos 2 litros de água por dia ajuda a manter o corpo hidratado e melhora o funcionamento do metabolismo.
          </Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  emergencyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#FFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  tipCard: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
});