// src/components/layout/ProfileModal.tsx (VERSÃO COM NAVEGAÇÃO CORRIGIDA)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../hooks/useUserStore';
import { X, User, Award, Settings, LogOut, Camera, Building } from '../Icons';
import LoteamentoSelector from '../LoteamentoSelector';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

const ProfileButton = ({ icon: Icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon size={22} color="#374151" style={styles.actionIcon} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export default function ProfileModal({ isVisible, onClose, onLogout }) {
    const navigation = useNavigation();
    const { userProfile, setUserProfile } = useUserStore();
    const [isSelectorVisible, setSelectorVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        setAvatarUrl(userProfile?.avatar_url || null);
    }, [userProfile?.avatar_url]);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const image = result.assets[0];
            setUploading(true);
            
            setAvatarUrl(image.uri);
            setUserProfile({ ...userProfile, avatar_url: image.uri }, userProfile.properties);

            setUploading(false);
            Alert.alert('Sucesso', 'Foto de perfil atualizada!');
        }
    };

    const navigateTo = (screenName, params = {}) => {
        onClose();
        setTimeout(() => {
            navigation.navigate(screenName, params);
        }, 100);
    };

    return (
      <>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPressOut={onClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X size={24} color="#555" />
                        </TouchableOpacity>

                        <View style={styles.userInfoSection}>
                            <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} disabled={uploading}>
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}><User size={40} color="#4A90E2" /></View>
                                )}
                                <View style={styles.editIconContainer}>
                                    {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Camera size={16} color="#fff" />}
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.userName}>{userProfile?.full_name || 'Usuário'}</Text>
                            <Text style={styles.userStatus}>{userProfile?.isClient ? 'Cliente' : 'Visitante'}</Text>
                        </View>
                        
                        <View style={styles.actionsSection}>
                            <ProfileButton
                                icon={Building}
                                label="Meus Empreendimentos"
                                onPress={() => {
                                    onClose();
                                    setTimeout(() => setSelectorVisible(true), 300);
                                }}
                            />
                             <ProfileButton
                                icon={Award}
                                label="Minhas Conquistas"
                                // AQUI ESTÁ A MUDANÇA: Apontando para a nova tela 'Achievements'
                                onPress={() => navigateTo('Achievements')}
                            />
                            <ProfileButton
                                icon={Settings}
                                label="Configurações"
                                onPress={() => navigateTo('Placeholder', { screenName: 'Configurações' })}
                            />
                            <ProfileButton
                                icon={LogOut}
                                label="Sair da Conta"
                                onPress={onLogout}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
        <LoteamentoSelector isVisible={isSelectorVisible} onClose={() => setSelectorVisible(false)} />
      </>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 20, paddingTop: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
    userInfoSection: { alignItems: 'center', marginBottom: 24 },
    avatarContainer: { width: 90, height: 90, borderRadius: 45, marginBottom: 12, position: 'relative' },
    avatarImage: { width: '100%', height: '100%', borderRadius: 45 },
    avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 45, backgroundColor: '#EBF2FC', justifyContent: 'center', alignItems: 'center' },
    editIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4A90E2', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: 'white' },
    userName: { fontSize: 22, fontWeight: 'bold' },
    userStatus: { fontSize: 14, color: '#6B7280', backgroundColor: '#F4F5F7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden', marginTop: 4 },
    actionsSection: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
    actionIcon: { marginRight: 16 },
    actionText: { fontSize: 16, color: '#1F2937' },
});