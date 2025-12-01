import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera, Save, Mail, User, Phone } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { userProfile, setUserProfile, session } = useUserStore();
  
  const [name, setName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(''); // Adicione o campo 'phone' ao seu perfil no Supabase se ainda não existir
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.full_name || '');
      // Se tiver campo de telefone no perfil, carregue-o aqui:
      // setPhone(userProfile.phone || ''); 
    }
  }, [userProfile]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Se tiver base64, podemos usar para upload direto ou mostrar preview
        uploadAvatar(asset);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const uploadAvatar = async (imageAsset: ImagePicker.ImagePickerAsset) => {
    if (!session?.user) return;
    setUploading(true);

    try {
      // 1. Prepara o arquivo (Transforma URI em ArrayBuffer se necessário ou usa base64)
      const arrayBuffer = await fetch(imageAsset.uri).then(res => res.arrayBuffer());
      const fileExt = imageAsset.uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload para o Supabase Storage (Bucket 'avatars')
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: imageAsset.mimeType || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 3. Obter URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);

    } catch (error: any) {
      console.log('Erro no upload:', error);
      // Fallback: Apenas mostra a imagem localmente se o upload falhar (ex: bucket não existe)
      setAvatarUrl(imageAsset.uri);
      // Alert.alert('Aviso', 'Não foi possível salvar a imagem no servidor, mas ela será usada localmente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user) return;
    setSaving(true);

    try {
      const updates = {
        id: session.user.id,
        full_name: name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      // Atualiza o store localmente para refletir a mudança instantaneamente
      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Seção de Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <View style={styles.avatarContainer}>
              {uploading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.initials}>
                    {name ? name.substring(0, 2).toUpperCase() : 'US'}
                  </Text>
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={20} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Toque para alterar a foto</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={theme.colors.text.tertiary} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Mail size={20} color={theme.colors.text.tertiary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text.tertiary }]}
                value={userProfile?.email}
                editable={false}
              />
            </View>
            <Text style={styles.helperText}>O email não pode ser alterado.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telemóvel (Opcional)</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={theme.colors.text.tertiary} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={saving || uploading}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Save size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  initials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    marginTop: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginTop: 40,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});