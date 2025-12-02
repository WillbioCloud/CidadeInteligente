import React from 'react';
import { View, StyleSheet } from 'react-native';
// Correção do caminho da importação: sobe uma pasta (..) para 'components' e entra em 'home'
import { InstagramSection } from '../home/InstagramSection';

export default function ContentFeed() {
  return (
    <View style={styles.container}>
       <InstagramSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});