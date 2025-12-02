import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Platform // <--- ADICIONADO AQUI
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Lock, Moon, Trash2, ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut, userProfile } = useUserStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Conta',
      'Esta ação é irreversível. Todos os seus dados serão apagados permanentemente. Tem a certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const { error } = await supabase.functions.invoke('delete-user');
              if (error) throw error;
              await signOut();
              Alert.alert('Conta Eliminada', 'A sua conta foi removida com sucesso.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível eliminar a conta. Entre em contacto com o suporte.');
              console.error(error);
            }
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onValueChange, 
    isSwitch = false,
    onPress,
    color = theme.colors.text.secondary
  }: any) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={isSwitch ? () => onValueChange(!value) : onPress}
      disabled={isSwitch}
      activeOpacity={isSwitch ? 1 : 0.7}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#E5E7EB', true: theme.colors.primaryLight }}
          thumbColor={value ? theme.colors.primary : '#F4F4F5'}
        />
      ) : (
        <ChevronRight size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.section}>
          <SettingItem 
            icon={Bell} 
            label="Notificações Push" 
            value={notificationsEnabled} 
            onValueChange={setNotificationsEnabled} 
            isSwitch 
            color="#F59E0B"
          />
          <SettingItem 
            icon={Moon} 
            label="Modo Escuro" 
            value={darkMode} 
            onValueChange={setDarkMode} 
            isSwitch 
            color="#6366F1"
          />
        </View>

        <Text style={styles.sectionTitle}>Segurança</Text>
        <View style={styles.section}>
          <SettingItem 
            icon={Lock} 
            label="Alterar Senha" 
            onPress={() => navigation.navigate('ForgotPassword')} 
            color="#10B981"
          />
        </View>

        <Text style={styles.sectionTitle}>Zona de Perigo</Text>
        <View style={styles.section}>
          <SettingItem 
            icon={Trash2} 
            label="Eliminar Conta" 
            onPress={handleDeleteAccount} 
            color="#EF4444"
          />
        </View>

        <Text style={styles.footerText}>
          ID do Utilizador: {userProfile?.id || 'Desconhecido'}
        </Text>
      </ScrollView>
    </View>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 32,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});