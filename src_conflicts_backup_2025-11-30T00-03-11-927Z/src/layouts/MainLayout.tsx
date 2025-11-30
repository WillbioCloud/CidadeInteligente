<<<<<<< HEAD
// src/layouts/MainLayout.tsx
=======
// src/layouts/MainLayout.tsx (VERSÃO CORRIGIDA E FINAL)
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

<<<<<<< HEAD
// Removido o estado e as funções do modal daqui, pois eles agora
// viverão no navegador principal, que controla tudo.

=======
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
