import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';

export default function WelcomeSection() {
  const { userProfile } = useUserStore();
  const name = userProfile?.full_name?.split(' ')[0] || 'Vizinho';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {name} 👋</Text>
      <Text style={styles.subtitle}>O que você procura hoje?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text.primary },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, marginTop: 4 },
});