import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bus, Map, Heart, Calendar, MapPin, MoreHorizontal } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

const FEATURES = [
  { id: 'transport', label: 'Ônibus', icon: Bus, route: 'Transport', color: '#3B82F6' },
  { id: 'map', label: 'Mapa', icon: Map, route: 'Mapa', color: '#10B981' },
  { id: 'health', label: 'Saúde', icon: Heart, route: 'Health', color: '#EF4444' },
  { id: 'scheduling', label: 'Quadras', icon: Calendar, route: 'CourtScheduling', color: '#F59E0B' },
  { id: 'explore', label: 'Plantas', icon: MapPin, route: 'ExploreMap', color: '#8B5CF6' },
  { id: 'more', label: 'Mais', icon: MoreHorizontal, route: 'More', color: '#6B7280' },
];

export const ResidentFeatures = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Serviços</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.grid}
      >
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.item} 
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Icon size={28} color={item.color} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginLeft: 20,
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: 12,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    width: 80,
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});