// src/components/comercio/CommerceCard.tsx (VERSÃO FINAL COM NAVEGAÇÃO CORRIGIDA)

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Star, Phone, Instagram, MapPin } from '../Icons';
import { useNavigation } from '@react-navigation/native'; // 1. Importa o hook de navegação

export default function CommerceCard({ commerce }) {
  const navigation = useNavigation(); // 2. Inicializa o hook de navegação

  const handleCall = () => {
    Linking.openURL(`tel:${commerce.contact.whatsapp}`);
  };

  const handleInstagram = () => {
    Linking.openURL(`https://instagram.com/${commerce.contact.instagram.replace('@', '')}`);
  };
  

  return (
    // --- AQUI ESTÁ A CORREÇÃO ---
    // 3. O card inteiro agora é um TouchableOpacity que navega para a tela de detalhes.
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CommerceDetail', { commerce: commerce })}
    >
      <View>
        <Image source={{ uri: commerce.coverImage }} style={styles.cardImage} />
        <View style={[styles.tag, styles.categoryTag]}>
          <Text style={styles.tagText}>{commerce.category}</Text>
        </View>
        {commerce.featured && (
          <View style={[styles.tag, styles.featuredTag]}>
            <Star size={12} color="#1C1C1E" />
            <Text style={[styles.tagText, { color: '#1C1C1E' }]}>Destaque</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{commerce.name}</Text>
        <View style={styles.infoRow}>
          <Star size={16} color="#F59E0B" />
          <Text style={styles.rating}>{commerce.rating}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{commerce.category}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locationText}>{commerce.loteamento_id.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{commerce.description}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleCall}>
            <Phone size={16} color="white" />
            <Text style={styles.buttonPrimaryText}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={handleInstagram}>
            <Instagram size={16} color="#374151" />
            <Text style={styles.buttonSecondaryText}>Instagram</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardImage: { width: '100%', height: 160, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  tag: { position: 'absolute', top: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  categoryTag: { left: 12, backgroundColor: 'rgba(0,0,0,0.5)' },
  featuredTag: { right: 12, backgroundColor: '#F59E0B' },
  tagText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rating: { marginLeft: 4, fontWeight: 'bold', color: '#374151' },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  categoryBadgeText: { fontSize: 12, color: '#4B5563' },
  locationText: { marginLeft: 4, color: '#6B7280' },
  description: { color: '#4B5563', marginVertical: 8, lineHeight: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 12 },
  buttonPrimary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B82F6', padding: 12, borderRadius: 8 },
  buttonPrimaryText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  buttonSecondary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  buttonSecondaryText: { color: '#374151', fontWeight: 'bold', marginLeft: 8 },
});