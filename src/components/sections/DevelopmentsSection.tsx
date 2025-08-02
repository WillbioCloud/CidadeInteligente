// src/components/sections/DevelopmentsSection.tsx (VERSÃO FINAL COM TAGS)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ALL_LOTEAMENTOS } from '../../data/loteamentos.data';
import { PlayCircle, ShoppingCart } from '../Icons'; // Usando ícones para os botões

// Card individual para cada loteamento
const DevelopmentCard = ({ loteamento }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.devCard}>
      <View style={styles.logoContainer}>
        <Image source={loteamento.logo} style={styles.devLogo} />
      </View>
      <Text style={styles.devName}>{loteamento.name}</Text>
      <Text style={styles.devTagline}>{loteamento.tagline}</Text>

      {/* --- SEÇÃO DE TAGS ADICIONADA --- */}
      <View style={styles.highlightsContainer}>
        {loteamento.highlights.map((highlight, index) => (
          <View key={index} style={styles.highlightChip}>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('LoteamentoMedia', { loteamento })}
        >
          <PlayCircle size={18} color="#4B5563" />
          <Text style={styles.buttonSecondaryText}>Mídias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPrimary}>
          <ShoppingCart size={18} color="white" />
          <Text style={styles.buttonPrimaryText}>Adquirir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente principal da seção
export const DevelopmentsSection = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Nossos Empreendimentos</Text>
      <View style={styles.listContainer}>
        {ALL_LOTEAMENTOS.map(lote => (
          <DevelopmentCard key={lote.id} loteamento={lote} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { 
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      marginBottom: 16,
  },
  listContainer: {
    gap: 14,
  },
  devCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  logoContainer: {
    marginBottom: 8,
    padding: 8,
    paddingHorizontal: 96,
    borderRadius: 12,
    backgroundColor: '#F8FAFC'
  },
  devLogo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
  devName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  devTagline: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    minHeight: 40,
  },
  // --- NOVOS ESTILOS PARA AS TAGS ---
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 0,
  },
  highlightChip: {
    backgroundColor: '#EEF2FF', // Azul claro suave
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  highlightText: {
    color: '#4338CA', // Azul mais escuro
    fontSize: 12,
    fontWeight: '500',
  },
  // --- FIM DOS NOVOS ESTILOS ---
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonSecondaryText: {
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonPrimaryText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});