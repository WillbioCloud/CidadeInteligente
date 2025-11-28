import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// O mesmo componente de card que usamos na Home, agora aqui dentro.
const InfoCard = ({ icon, title, subtitle, color, buttonText, onPress }) => (
    <View style={[styles.infoCard, { borderLeftColor: color }]}>
        <View style={styles.infoCardContent}>
            <Ionicons name={icon} size={28} color={color} style={styles.infoCardIcon} />
            <View>
                <Text style={styles.infoCardTitle}>{title}</Text>
                <Text style={styles.infoCardSubtitle}>{subtitle}</Text>
            </View>
        </View>
        {buttonText && <TouchableOpacity style={[styles.infoCardButton, {backgroundColor: color}]} onPress={onPress}><Text style={styles.infoCardButtonText}>{buttonText}</Text></TouchableOpacity>}
    </View>
);

interface NotificationsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isVisible, onClose }: NotificationsModalProps) {
  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
        <SafeAreaView style={styles.modalContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Notificações</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Cards de informação agora vivem aqui */}
                <InfoCard
                    icon="trending-up-outline"
                    title="Oportunidades em Destaque"
                    subtitle="Quadra 15 - Lote 8 por R$ 85.000"
                    color="#10B981"
                />
                 <InfoCard
                    icon="people-outline"
                    title="Comunidade Ativa"
                    subtitle='"Investimento que mudou nossa vida!" - Maria Silva'
                    color="#3B82F6"
                />
                 <InfoCard
                    icon="calendar-outline"
                    title="Próximos Eventos"
                    subtitle="Visita Guiada Premium: Sábado, 15/07"
                    color="#8B5CF6"
                    buttonText="Confirmar Presença"
                    onPress={() => alert('Presença confirmada!')}
                />
                <InfoCard
                    icon="warning-outline"
                    title="Aviso Importante"
                    subtitle="Interrupção no fornecimento de água amanhã, das 8h às 10h para manutenção."
                    color="#F59E0B"
                />
            </ScrollView>
        </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    title: { fontSize: 22, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    scrollContainer: { padding: 16 },
    infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginTop: 12, borderLeftWidth: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
    infoCardContent: { flexDirection: 'row', alignItems: 'center' },
    infoCardIcon: { marginRight: 16 },
    infoCardTitle: { fontSize: 16, fontWeight: 'bold' },
    infoCardSubtitle: { fontSize: 14, color: '#6B7280', maxWidth: '90%' },
    infoCardButton: { marginTop: 16, borderRadius: 12, padding: 12, alignItems: 'center' },
    infoCardButtonText: { color: '#FFF', fontWeight: 'bold' },
});