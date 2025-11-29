<<<<<<< HEAD
// src/screens/Auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, StatusBar } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, CheckSquare, Square } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { PrivacyPolicyModal } from '../../components/PrivacyPolicyModal';

// Componente reutilizado para os botões de login social
const SocialLogins = () => (
  <>
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>Ou cadastre-se com</Text>
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

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false); // Estado para o checkbox

  const handleRegister = async () => {
    // Validação do checkbox
    if (!agreedToPolicy) {
      Alert.alert('Termos Não Aceites', 'Você precisa de aceitar a Política de Privacidade para criar uma conta.');
      return;
    }

    if (!fullName || !email || !password) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          has_accepted_privacy_policy: true,
        },
      },
    });

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else if (user) {
      Alert.alert(
        'Cadastro Realizado!',
        'Verifique o seu email para confirmar a conta e depois faça o login.',
=======
// src/screens/Auth/RegisterScreen.tsx (VERSÃO FINAL E CORRIGIDA)

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase'; // Importamos o supabase diretamente
import { ALL_LOTEAMENTOS } from '../../data/loteamentos.data';

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [isAlreadyClient, setIsAlreadyClient] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLoteamento, setSelectedLoteamento] = useState(ALL_LOTEAMENTOS[0]?.id);
  const [quadra, setQuadra] = useState('');
  const [lote, setLote] = useState('');

  const [loading, setLoading] = useState(false);

  const handleInitialChoice = (isClient: boolean) => {
    setIsAlreadyClient(isClient);
    setStep(2);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha nome, email e senha.');
      return;
    }
    if (isAlreadyClient && (!selectedLoteamento || !quadra || !lote)) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha os dados da sua propriedade.');
      return;
    }

    setLoading(true);

    // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
    // Fazemos a chamada direta para o Supabase, garantindo que o `full_name` seja enviado corretamente.
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // O campo 'data' é usado para passar metadados, como o nome do usuário.
        // O nosso gatilho no Supabase vai ler este campo.
        data: {
          full_name: fullName, // Usando a chave 'full_name' que o gatilho espera
          is_client: isAlreadyClient,
          // No futuro, podemos passar os dados da propriedade aqui também
          properties: isAlreadyClient ? [{ loteamentoId: selectedLoteamento, quadra, lote }] : [],
        },
      },
    });
    // --- FIM DA CORREÇÃO ---

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else if (data.user) {
      Alert.alert(
        'Cadastro Realizado!',
        'Verifique seu e-mail para confirmar a conta e depois faça o login.',
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
    setLoading(false);
  };

<<<<<<< HEAD
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Comece a sua jornada connosco.</Text>

        <View style={styles.form}>
            <Text style={styles.label}>O seu nome</Text>
            <View style={styles.inputWrapper}>
                <UserIcon size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>

            <Text style={styles.label}>O seu email</Text>
            <View style={styles.inputWrapper}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="email@exemplo.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <Text style={styles.label}>A sua senha</Text>
            <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="mín. 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                </TouchableOpacity>
            </View>

            {/* Checkbox da Política de Privacidade */}
            <TouchableOpacity style={styles.policyContainer} onPress={() => setAgreedToPolicy(!agreedToPolicy)}>
                {agreedToPolicy ? <CheckSquare size={24} color="#16A34A" /> : <Square size={24} color="#9CA3AF" />}
                <Text style={styles.policyText}>
                    Eu li e concordo com a <Text style={styles.linkText} onPress={() => {/* Navegar para a tela da política */}}>Política de Privacidade</Text>.
                </Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Conta</Text>}
        </TouchableOpacity>

        <SocialLogins />

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Já tem uma conta? <Text style={styles.linkText}>Faça Login</Text></Text>
        </TouchableOpacity>
=======
  const renderStepOne = () => (
    <View>
        <Text style={styles.selectionTitle}>Bem-vindo à FBZ!</Text>
        <Text style={styles.selectionSubtitle}>Para começar, nos diga: você já é nosso cliente?</Text>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleInitialChoice(true)}>
            <Ionicons name="key-outline" size={24} color="#10B981" />
            <Text style={styles.optionText}>Sim, já possuo um lote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleInitialChoice(false)}>
            <Ionicons name="search-outline" size={24} color="#3B82F6" />
            <Text style={styles.optionText}>Não, quero conhecer</Text>
        </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.formSectionTitle}>Dados de Acesso</Text>
        <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Nome Completo" value={fullName} onChangeText={setFullName} />
        </View>
        <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>
        <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry value={password} onChangeText={setPassword} />
        </View>

        {isAlreadyClient && (
          <>
            <Text style={styles.formSectionTitle}>Dados da sua Propriedade</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedLoteamento}
                onValueChange={(itemValue) => setSelectedLoteamento(itemValue)}
                style={styles.picker}
              >
                {ALL_LOTEAMENTOS.map(l => <Picker.Item key={l.id} label={l.name} value={l.id} />)}
              </Picker>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="Quadra" value={quadra} onChangeText={setQuadra} />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="Lote" value={lote} onChangeText={setLote} />
            </View>
          </>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Finalizar Cadastro</Text>}
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Crie sua Conta</Text>
          </View>

          {step === 1 ? renderStepOne() : renderStepTwo()}

          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>Já tem uma conta? <Text style={styles.linkText}>Faça Login</Text></Text>
          </TouchableOpacity>
        </View>
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { paddingHorizontal: 24, paddingVertical: 20, justifyContent: 'center', flexGrow: 1 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center', marginBottom: 40 },
    form: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 15, marginBottom: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
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
    policyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    policyText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#6B7280',
        flexShrink: 1,
    }
=======
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  selectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: 8 },
  selectionSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  optionText: { fontSize: 16, color: '#1F2937', marginLeft: 16, fontWeight: '500' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  backButtonText: { color: '#4B5563', marginLeft: 8, fontWeight: '600' },
  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginTop: 16, marginBottom: 8, borderTopColor: '#E5E7EB', borderTopWidth: 1, paddingTop: 16 },
  inputWrapper: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  input: { height: 50, fontSize: 16, color: '#111827', paddingHorizontal: 15 },
  pickerWrapper: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 15 },
  picker: { height: 50 },
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerButton: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#6B7280' },
  linkText: { color: '#4F46E5', fontWeight: 'bold' },
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
});