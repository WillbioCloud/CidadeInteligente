// src/screens/Home/HomeTabScreen.tsx (VERSÃO FINAL COM SCROLL AUTOMÁTICO)

import React, { useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';

// Caminhos para os seus componentes de seção
import { CommerceHighlight } from '../../components/sections/CommerceHighlight';
import { ResidentFeatures } from '../../components/sections/ResidentFeatures';
import { ContentFeed } from '../../components/sections/ContentFeed';

export default function HomeTabScreen() {
  // 1. Cria a referência para o ScrollView
  const scrollRef = useRef<ScrollView>(null);

  // 2. Obtém os parâmetros passados pela navegação
  const route = useRoute();
  const { scrollToEnd } = route.params || {};

  // 3. Usa o hook 'useFocusEffect' para executar a lógica sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      // Verifica se o parâmetro 'scrollToEnd' foi recebido e é verdadeiro
      if (scrollToEnd) {
        // Um pequeno atraso garante que a interface foi totalmente renderizada antes de rolar
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 300); // 300ms é geralmente suficiente
      }
    }, [scrollToEnd])
  );

  return (
    // 4. Associa a referência ao componente ScrollView
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Seus componentes de seção permanecem os mesmos */}
      <CommerceHighlight />
      <ResidentFeatures />
      <ContentFeed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    
  },
  contentContainer: {
    paddingVertical: 16,
    paddingTop: 16,
    // Removido o paddingHorizontal daqui para que as seções controlem seu próprio espaçamento
    paddingBottom: 84,
  },
});