// src/screens/Profile/EditProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { ArrowLeft, User, Mail, Phone, Lock, Trash2, Camera } from '../../components/Icons';
import { useUserStore } from '../../hooks/useUserStore';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

const FormInput = ({ icon: Icon, label, value, onChangeText, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon size={20} color="#9CA3AF" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  </View>
);

export default function EditProfileScreen({ navigation }) {
  const { userProfile, updateUserProfile } = useUserStore();
  
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePickAvatar = async () => {
    setUploading(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão Necessária", "Você precisa permitir o acesso à galeria para escolher uma foto.");
      setUploading(false);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // --- CORREÇÃO DO AVISO DE DEPRECIAÇÃO ---
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const uri = img.uri;
      const fileExt = uri.split('.').pop();
      const fileName = `${userProfile.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { upsert: true });

      if (uploadError) {
        Alert.alert('Erro no Upload', 'Não foi possível enviar sua foto.');
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', userProfile.id);

      if (updateError) {
        Alert.alert('Erro', 'Não foi possível salvar seu novo avatar.');
      } else {
        updateUserProfile({ avatar_url: publicUrl });
        Alert.alert('Sucesso!', 'Sua foto de perfil foi atualizada.');
      }
    }
    setUploading(false);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const updates = { id: userProfile.id, full_name: fullName, phone, updated_at: new Date() };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } else {
      updateUserProfile({ full_name: fullName, phone });
      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
    }
    setLoading(false);
  };
  
  const handleDeleteAccount = () => {
     Alert.alert(
      "Excluir Conta Permanentemente",
      "Esta ação é irreversível. Todos os seus dados, pontos e conquistas serão perdidos. Tem certeza que deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Excluir Minha Conta", style: "destructive", onPress: async () => {
            setLoading(true);
            try {
                const { error } = await supabase.functions.invoke('delete-user');
                if (error) throw error;
                Alert.alert("Conta Excluída", "Sua conta foi removida com sucesso.");
            } catch (err) {
                Alert.alert("Erro", "Não foi possível excluir sua conta. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }}
      ]
    );
  };

  const handleChangePassword = async () => {
    Alert.alert(
        "Alterar Senha",
        "Enviaremos um link para o seu e-mail para que você possa criar uma nova senha. Deseja continuar?",
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Sim, Enviar Link", onPress: async () => {
                const { error } = await supabase.auth.resetPasswordForEmail(userProfile.email);
                if(error) Alert.alert("Erro", error.message);
                else Alert.alert("Link Enviado", "Verifique sua caixa de entrada.");
            }}
        ]
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><ArrowLeft size={24} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickAvatar} disabled={uploading}>
            <Image 
              source={{ uri: userProfile?.avatar_url || 'https://placehold.co/200' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIcon}>
              {uploading ? <ActivityIndicator color="#fff" /> : <Camera size={20} color="white" />}
            </View>
          </TouchableOpacity>
        </View>

        <FormInput icon={User} label="Nome Completo" value={fullName} onChangeText={setFullName} />
        <FormInput icon={Phone} label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <FormInput icon={Mail} label="E-mail (não pode ser alterado)" value={email} editable={false} />

        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}><Lock size={16} color="#4F46E5" /><Text style={styles.changePasswordText}>Alterar Senha</Text></TouchableOpacity>
        <View style={styles.dangerZone}><TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}><Trash2 size={16} color="#EF4444" /><Text style={styles.deleteButtonText}>Excluir minha conta</Text></TouchableOpacity></View>
      </ScrollView>

      <View style={styles.footer}><TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading}>{loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}</TouchableOpacity></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 20, paddingHorizontal: 16, paddingBottom: 100, position: 'relative', marginBottom: 76 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContainer: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E2E8F0' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4F46E5', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', height: 50, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  changePasswordButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#C7D2FE', backgroundColor: '#EEF2FF', marginTop: 6, marginBottom: -26 },
  changePasswordText: { color: '#4F46E5', fontWeight: 'bold', marginLeft: 8 },
  dangerZone: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20, alignItems: 'center' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', buttom: 60, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F87171', backgroundColor: '#FEF2F2' },
  deleteButtonText: { color: '#EF4444', marginLeft: 8, fontWeight: 'bold' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: 'white' },
  // --- CORREÇÃO DO ERRO DE SINTAXE ---
  saveButton: { backgroundColor: '#22C55E', paddingVertical: 16, borderRadius: 12, alignItems: 'center', minHeight: 54, justifyContent: 'center', bottom: 16 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});