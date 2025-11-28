// src/layouts/MainLayout.tsx (VERSÃO CORRIGIDA E FINAL)

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MainLayoutProps {
  children: React.ReactNode;
  style?: object;
}

export default function MainLayout({ children, style }: MainLayoutProps) {
  return (
    // Esta SafeAreaView agora só aplica margens seguras nas laterais.
    // O topo é ignorado para não conflitar com o header que o navegador vai colocar.
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      
      {/* A linha do <CustomHeader /> foi REMOVIDA daqui. */}

      <ScrollView
        style={[styles.content, style]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});