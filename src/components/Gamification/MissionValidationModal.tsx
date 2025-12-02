import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { QrCode, X, Check } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

interface MissionValidationModalProps {
  visible: boolean;
  onClose: () => void;
  onValidate: (code: string) => Promise<boolean>;
  missionTitle: string;
}

export default function MissionValidationModal({ 
  visible, 
  onClose, 
  onValidate,
  missionTitle 
}: MissionValidationModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!code.trim()) {
      Alert.alert('Erro', 'Por favor, digite o código.');
      return;
    }

    setLoading(true);
    const success = await onValidate(code);
    setLoading(false);

    if (success) {
      setCode('');
      onClose();
    } else {
      Alert.alert('Código Inválido', 'Verifique o código e tente novamente.');
    }
  };

  const handleScanQRCode = () => {
    // Aqui você integraria a 'expo-camera' futuramente
    Alert.alert('Câmera', 'A leitura de QR Code será aberta aqui.');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Validar Missão</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.missionTitle}>{missionTitle}</Text>
          <Text style={styles.instruction}>
            Escaneie o QR Code no local ou digite o código abaixo para completar a missão.
          </Text>

          <TouchableOpacity style={styles.qrButton} onPress={handleScanQRCode}>
            <QrCode size={32} color={theme.colors.primary} />
            <Text style={styles.qrText}>Escanear QR Code</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OU</Text>
            <View style={styles.line} />
          </View>

          <Text style={styles.label}>Código Manual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: MISSÃO-123"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={text => setCode(text.toUpperCase())}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={[styles.validateButton, loading && styles.buttonDisabled]} 
            onPress={handleValidate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Check size={20} color="#FFF" />
                <Text style={styles.validateButtonText}>Validar Código</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderStyle: 'dashed',
    marginBottom: 20,
    gap: 12,
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 10,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 24,
  },
  validateButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  validateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});