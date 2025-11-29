<<<<<<< HEAD
// src/navigation/AppRouter.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../hooks/useUserStore';
import { supabase } from '../lib/supabase';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { ModalProvider } from '../context/ModalContext';

export default function AppRouter() {
  // --- CORREÇÃO AQUI ---
  // A função `setSession` foi adicionada à desestruturação do hook.
  const { session, setSession, userProfile, _hasHydrated, fetchUserProfile, clearStore } = useUserStore();

  useEffect(() => {
    // Esta parte agora funciona porque `setSession` está definido.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_IN') fetchUserProfile(session);
        if (_event === 'SIGNED_OUT') clearStore();
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, setSession, clearStore]); // A dependência `setSession` agora é válida.

  if (!_hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="default" />
=======
// src/navigation/AppRouter.tsx (VERSÃO DE DEBUG)

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../hooks/useUserStore';

// Navegadores
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

// Contexto e Componentes Globais
import { ModalProvider } from '../context/ModalContext';
import AppModals from './AppModals';

console.log('--- ROTEADOR: Arquivo AppRouter.tsx CARREGADO ---');

export default function AppRouter() {
  console.log('--- ROTEADOR [1]: Componente AppRouter RENDERIZOU ---');

  const [isLoading, setIsLoading] = useState(true);
  const { session, setSession, setUserProfile } = useUserStore();

  useEffect(() => {
    console.log('--- ROTEADOR [2]: useEffect INICIOU ---');

    const fetchUserProfile = async (userId: string) => {
      console.log(`--- ROTEADOR [2.1]: fetchUserProfile chamado para o usuário: ${userId}`);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
        const { data: properties } = await supabase.from('user_properties').select('*').eq('user_id', userId);
        setUserProfile(profile, properties || []);
        console.log('--- ROTEADOR [2.2]: Perfil do usuário DEFINIDO no store');
      } catch (e) {
        console.error("--- ROTEADOR [ERRO]: Falha dentro de fetchUserProfile ---", e);
      }
    };

    // Pega a sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
        console.log('--- ROTEADOR [3]: getSession CONCLUÍDO. Sessão inicial:', session ? 'EXISTE' : 'NULA');
        setSession(session);
        if (session) {
            await fetchUserProfile(session.user.id);
        }
    }).catch(err => {
        console.error("--- ROTEADOR [ERRO]: Falha em getSession ---", err);
    }).finally(() => {
        console.log('--- ROTEADOR [4]: Bloco finally de getSession EXECUTADO. isLoading será false.');
        setIsLoading(false);
    });

    // Ouve por futuras mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('--- ROTEADOR [AUTH_CHANGE]: onAuthStateChange DISPARADO ---');
        setSession(newSession);
      }
    );

    return () => {
      console.log('--- ROTEADOR: Limpando inscrição do onAuthStateChange ---');
      subscription.unsubscribe();
    };
  }, [setUserProfile, setSession]);


  console.log('--- ROTEADOR [RENDER]: Renderizando. isLoading:', isLoading, 'Session:', session ? 'EXISTE' : 'NULA');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
<<<<<<< HEAD
      {session && userProfile ? (
        userProfile.has_completed_onboarding ? (
          <ModalProvider>
            <MainNavigator />
          </ModalProvider>
        ) : (
          <OnboardingScreen />
        )
      ) : (
        <AuthNavigator />
      )}
=======
      <ModalProvider>
        {session && session.user ? <MainNavigator /> : <AuthNavigator />}
        <AppModals />
      </ModalProvider>
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
=======
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
