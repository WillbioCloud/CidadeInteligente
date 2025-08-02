// src/screens/Auth/LoginScreen.tsx (VERSÃO FINAL COM SWITCH DE BIOMETRIA)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Switch } from 'react-native';
import { Mail, Lock, Fingerprint } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const CREDENTIALS_KEY = 'userCredentials';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);

  // Função para verificar se a biometria está disponível e tentar logar
  const checkAndAttemptBiometricLogin = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const hasSavedCredentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    
    setCanUseBiometrics(hasHardware); // Habilita o switch se o hardware existir
    
    if (hasHardware && hasSavedCredentials) {
      handleBiometricLogin();
    }
  }, []);

  // useFocusEffect roda toda vez que a tela de login fica visível
  useFocusEffect(
    useCallback(() => {
      checkAndAttemptBiometricLogin();
    }, [checkAndAttemptBiometricLogin])
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Erro no Login', 'Email ou senha inválidos.');
      setLoading(false);
      return;
    }

    // Se o login foi sucesso E o switch de biometria está LIGADO
    if (enableBiometrics) {
      await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify({ email, password }));
    } else {
      // Se estava desligado, garante que não há nada salvo
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    }
    // O AppRouter vai lidar com a navegação
    setLoading(false);
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Autentique-se para entrar' });

      if (result.success) {
        setLoading(true);
        const savedCredentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (savedCredentials) {
            const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
            const { error } = await supabase.auth.signInWithPassword({ email: savedEmail, password: savedPassword });
            if (error) {
                // Se as credenciais salvas falharem, limpa elas
                await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
                Alert.alert('Falha no Login', 'Suas credenciais salvas são inválidas. Por favor, entre com e-mail e senha.');
            }
        }
        setLoading(false);
      }
    } catch (e) {
      console.error("Erro na biometria:", e)
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}><Mail size={20} color="#9CA3AF" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></View>
          <View style={styles.inputWrapper}><Lock size={20} color="#9CA3AF" style={styles.inputIcon} /><TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry /></View>
          
          <View style={styles.optionsContainer}>
            {canUseBiometrics && (
              <View style={styles.biometricSwitchContainer}>
                <Fingerprint size={20} color="#6B7280" />
                <Text style={styles.biometricSwitchLabel}>Lembrar para login rápido</Text>
                <Switch
                    value={enableBiometrics}
                    onValueChange={setEnableBiometrics}
                />
              </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>Não tem conta? <Text style={styles.linkText}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center' },
  content: { paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  form: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  forgotPasswordText: { color: '#4F46E5', fontWeight: '600', fontSize: 14 },
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  biometricSwitchContainer: { flexDirection: 'row', alignItems: 'center' },
  biometricSwitchLabel: { color: '#374151', fontWeight: '500', marginLeft: 8, marginRight: 8 },
  footerButton: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#6B7280' },
  linkText: { color: '#4F46E5', fontWeight: 'bold' },
});