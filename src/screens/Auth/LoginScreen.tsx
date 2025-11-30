// src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Image } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

// Componente para os botões de login social
const SocialLogins = () => (
  <>
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>Ou entre com</Text>
      <View style={styles.dividerLine} />
    </View>
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/google.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/facebook.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/logos/apple.png')} style={styles.socialIcon} />
      </TouchableOpacity>
    </View>
  </>
);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Erro no Login', 'Email ou senha inválidos.');
    }
    // O AppRouter irá tratar da navegação após o login ser bem-sucedido
    setLoading(false);
  };

// Local: src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Mail, Lock, CheckSquare, Square } from 'lucide-react-native'; // <-- Adicionado ícones de checkbox
import { supabase } from '../../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(''); //
  const [password, setPassword] = useState(''); //
  const [loading, setLoading] = useState(false); //
  const [rememberMe, setRememberMe] = useState(true); // <-- NOVO: Estado para o checkbox

  const handleLogin = async () => { //
    if (!email || !password) { //
      alert('Por favor, preencha o email e a senha.'); //
      return; //
    } //
    setLoading(true); //
    const { error } = await supabase.auth.signInWithPassword({ //
      email: email, //
      password: password, //
    }); //

    if (error) { //
      alert(error.message); //
    } //
    setLoading(false); //
  }; //
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

        <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="email@exemplo.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Mín. 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          {/* --- MUDANÇA: Novo container para alinhar o checkbox e o link --- */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              {rememberMe ? <CheckSquare size={20} color="#4F46E5" /> : <Square size={20} color="#9CA3AF" />}
              <Text style={styles.checkboxLabel}>Manter logado</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <SocialLogins />

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>Não tem uma conta? <Text style={styles.linkText}>Cadastre-se</Text></Text>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>Não tem conta? <Text style={styles.linkText}>Cadastre-se</Text></Text>        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  content: { paddingHorizontal: 24, },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', marginBottom: 40 },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 15, marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
  forgotPasswordText: { color: '#16A34A', fontWeight: '600', fontSize: 14, textAlign: 'right', marginBottom: 20 },
  button: { backgroundColor: '#16A34A', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 10, color: '#9CA3AF' },
  socialButtonsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialButton: { padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 999 },
  socialIcon: { width: 28, height: 28 },
  footerButton: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#6B7280' },
  linkText: { color: '#16A34A', fontWeight: 'bold' },

  // Seus estilos originais
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', paddingHorizontal: 24 }, //
  content: { width: '100%', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 20}, // O estilo aqui foi removido para evitar duplicidade e usar o do container
  header: { alignItems: 'center', marginBottom: 40 }, //
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' }, //
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 }, //
  form: { marginBottom: 20 }, //
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 }, //
  inputIcon: { marginRight: 10 }, //
  input: { flex: 1, height: 50, fontSize: 16, color: '#111827' }, //
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 12, alignItems: 'center' }, //
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }, //
  footerButton: { marginTop: 30, alignItems: 'center' }, //
  footerText: { fontSize: 16, color: '#6B7280' }, //
  linkText: { color: '#4F46E5', fontWeight: 'bold' }, //

  // --- MUDANÇA: Estilos novos e ajustados ---
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  forgotPasswordText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },});