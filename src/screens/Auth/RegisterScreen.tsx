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
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
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
  pickerWrapper: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 15 },
  picker: { height: 50 },
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerButton: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#6B7280' },
  linkText: { color: '#4F46E5', fontWeight: 'bold' },
});