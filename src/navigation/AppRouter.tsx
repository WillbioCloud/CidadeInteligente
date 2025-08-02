// src/navigation/AppRouter.tsx (VERSÃO FINAL COM "PORTÃO" DE HIDRATAÇÃO)

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../hooks/useUserStore';
import { supabase } from '../lib/supabase';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { ModalProvider } from '../context/ModalContext';

export default function AppRouter() {
  const { session, setSession, _hasHydrated, fetchUserProfile, clearStore } = useUserStore();

  useEffect(() => {
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
  }, [fetchUserProfile, setSession, clearStore]);

  // --- O "PORTÃO" ---
  if (!_hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && session.user ? (
        <ModalProvider>
          <MainNavigator />
        </ModalProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});