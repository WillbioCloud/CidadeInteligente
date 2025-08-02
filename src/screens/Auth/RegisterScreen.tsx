// src/screens/Auth/RegisterScreen.tsx (VERSÃO CORRIGIDA E SIMPLIFICADA)

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { ALL_LOTEAMENTOS } from '../../data/loteamentos.data';
import { ChevronDown } from 'lucide-react-native';

const LoteamentoDropdown = ({ selectedValue, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLoteamentoInfo = ALL_LOTEAMENTOS.find(l => l.id === selectedValue);

  const handleSelect = (loteamentoId) => {
    onValueChange(loteamentoId);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsOpen(!isOpen)}>
        {selectedLoteamentoInfo ? (
          <>
            <Image source={selectedLoteamentoInfo.logo} style={styles.dropdownLogo} />
            <Text style={styles.dropdownHeaderText}>{selectedLoteamentoInfo.name}</Text>
          </>
        ) : (
          <Text style={styles.dropdownPlaceholder}>Selecione o empreendimento</Text>
        )}
        <ChevronDown size={20} color="#6B7280" style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {ALL_LOTEAMENTOS.map(loteamento => (
            <TouchableOpacity key={loteamento.id} style={styles.dropdownItem} onPress={() => handleSelect(loteamento.id)}>
              <Image source={loteamento.logo} style={styles.dropdownLogo} />
              <Text style={styles.dropdownItemText}>{loteamento.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [isAlreadyClient, setIsAlreadyClient] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedLoteamento, setSelectedLoteamento] = useState(ALL_LOTEAMENTOS[0]?.id);
  const [quadra, setQuadra] = useState('');
  const [lote, setLote] = useState('');

  const [loading, setLoading] = useState(false);

  const handleInitialChoice = (isClient: boolean) => {
    setIsAlreadyClient(isClient);
    setStep(2);
  };

  const handleRegister = async () => {
    // Validações de campos permanecem as mesmas
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha nome, email, telefone e senha.');
      return;
    }
    if (isAlreadyClient && (!selectedLoteamento || !quadra || !lote)) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha os dados da sua propriedade.');
      return;
    }

    setLoading(true);

    // --- CÓDIGO CORRIGIDO AQUI ---
    // 1. Apenas cria a conta no Supabase Auth.
    // O gatilho que criamos no Passo 1 do plano de ação vai cuidar da criação do perfil na tabela 'profiles'.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: phone, // Passando os dados que o gatilho vai usar
        },
      },
    });

    if (authError) {
      Alert.alert('Erro no Cadastro', authError.message);
      setLoading(false);
      return;
    }

    // 2. Se o usuário for um cliente, a única inserção manual que fazemos
    // é na tabela de propriedades. A inserção na tabela 'profiles' foi removida.
    if (authData.user && isAlreadyClient) {
        const { error: propertyError } = await supabase
            .from('user_properties')
            .insert({
                user_id: authData.user.id,
                loteamento_id: selectedLoteamento,
                quadra: quadra.trim(),
                lote: lote.trim()
            });

        if (propertyError) {
            // É importante ter uma lógica para lidar com esse erro em produção.
            Alert.alert('Erro ao Registrar Propriedade', `Sua conta foi criada, mas não conseguimos registrar sua propriedade. Contate o suporte. Erro: ${propertyError.message}`);
            setLoading(false);
            return;
        }
    }
    
    // 3. Se tudo deu certo, mostra a mensagem de sucesso.
    Alert.alert(
        'Cadastro Realizado!',
        'Verifique seu e-mail para confirmar a conta e depois faça o login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
    setLoading(false);
  };

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
        <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Nome Completo" value={fullName} onChangeText={setFullName} /></View>
        <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" /></View>
        <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Telefone (com DDD)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} /></View>
        <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry value={password} onChangeText={setPassword} /></View>

        {isAlreadyClient && (
          <>
            <Text style={styles.formSectionTitle}>Dados da sua Propriedade</Text>
            <LoteamentoDropdown
                selectedValue={selectedLoteamento}
                onValueChange={setSelectedLoteamento}
            />
            <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Quadra" value={quadra} onChangeText={setQuadra} /></View>
            <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="Lote" value={lote} onChangeText={setLote} /></View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerButton: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#6B7280' },
  linkText: { color: '#4F46E5', fontWeight: 'bold' },
  dropdownContainer: { marginBottom: 15, zIndex: 10 },
  dropdownHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, height: 50 },
  dropdownHeaderText: { flex: 1, fontSize: 16, color: '#111827' },
  dropdownPlaceholder: { flex: 1, fontSize: 16, color: '#9CA3AF' },
  dropdownLogo: { width: 24, height: 24, resizeMode: 'contain', marginRight: 10 },
  dropdownList: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 4 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 16, color: '#1F2937' },
});