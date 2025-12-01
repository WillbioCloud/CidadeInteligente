import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Award, 
  HelpCircle, 
  Shield, 
  Edit2,
  Bell
} from 'lucide-react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';
import { ProfileStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

export default function ProfileTabScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { userProfile, signOut } = useUserStore();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem a certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut();
              // O AppRouter deteta a mudança de sessão e redireciona para o Login
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit_profile',
      icon: User,
      label: 'Editar Perfil',
      onPress: () => navigation.navigate('EditProfile'),
      color: '#3B82F6', // Azul
    },
    {
      id: 'achievements',
      icon: Award,
      label: 'Minhas Conquistas',
      onPress: () => navigation.navigate('Achievements'),
      color: '#F59E0B', // Amarelo
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Configurações',
      onPress: () => navigation.navigate('Settings'),
      color: '#6B7280', // Cinza
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Política de Privacidade',
      onPress: () => navigation.navigate('PrivacyPolicy'),
      color: '#10B981', // Verde
    },
    {
      id: 'support',
      icon: HelpCircle,
      label: 'Ajuda e Suporte',
      onPress: () => navigation.navigate('Support'),
      color: '#8B5CF6', // Roxo
    },
  ];

  // Iniciais para o avatar padrão
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Header do Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {userProfile?.avatar_url ? (
            <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {userProfile?.full_name ? getInitials(userProfile.full_name) : 'US'}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit2 size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{userProfile?.full_name || 'Usuário'}</Text>
        <Text style={styles.email}>{userProfile?.email || 'email@exemplo.com'}</Text>
        
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {userProfile?.role === 'admin' ? 'Administrador' : 'Cidadão'}
          </Text>
        </View>
      </View>

      {/* Menu de Opções */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Geral</Text>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem} 
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                <Icon size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ECFDF5',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 24,
  },
});