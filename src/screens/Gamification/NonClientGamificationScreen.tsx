import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Lock, Trophy, Target, Gift, Star, Crown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const BenefitItem = ({ icon: Icon, text }) => (
  <View style={styles.benefitItem}>
    <Icon size={24} color="#A0AEC0" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

export const NonClientGamificationScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={64} color="#A0AEC0" />
          <View style={styles.trophyBadge}>
            <Trophy size={20} color="white" />
          </View>
        </View>

        <Text style={styles.title}>Área Exclusiva para Clientes</Text>
        <Text style={styles.subtitle}>
          Adquira um lote em nossos empreendimentos e desbloqueie um mundo de recompensas e benefícios!
        </Text>

        <View style={styles.benefitsGrid}>
          <BenefitItem icon={Target} text="Missões Exclusivas" />
          <BenefitItem icon={Gift} text="Recompensas" />
          <BenefitItem icon={Star} text="Sistema de Níveis" />
          <BenefitItem icon={Crown} text="Conquistas" />
        </View>

        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.ctaButtonText}>Ver Nossos Loteamentos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  trophyBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F56565',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F7FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  benefitItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: '45%',
    margin: '2.5%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});