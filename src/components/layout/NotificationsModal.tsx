// src/components/layout/NotificationsModal.tsx (VERSÃO FINAL COM REALTIME SUBSCRIPTION)

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ActivityIndicator, SectionList } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { X, Bell, Zap, Store, Newspaper, Gift, ArrowUpCircle, Sparkles, ChevronDown } from 'lucide-react-native';

// Tipagem para a navegação
type RootStackParamList = {
    Home: { screen: string, params?: { scrollToEnd?: boolean } };
    Comercios: { screen: string, params: { commerceId: string } };
    Gamificacao: undefined;
};

// Tipagem da Notificação
interface Notification {
  id: string;
  type: 'lote_disponivel' | 'novidade_feed' | 'nova_missao' | 'workshop' | 'novo_comercio' | 'app_update' | 'novidade_comercio';
  title: string;
  message: string;
  metadata: { [key: string]: any };
  is_read: boolean;
  created_at: string;
}

const NotificationCard = ({ item, onClose }: { item: Notification, onClose: () => void }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);

  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedOpacity.value,
    overflow: 'hidden',
  }));

  const toggleExpansion = () => {
    const targetHeight = isExpanded ? 0 : 80;
    animatedHeight.value = withTiming(targetHeight, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    animatedOpacity.value = withTiming(isExpanded ? 0 : 1, { duration: 250 });
    setIsExpanded(!isExpanded);
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'nova_missao': return { Icon: Zap, color: '#8B5CF6' };
      case 'novo_comercio': return { Icon: Store, color: '#10B981' };
      case 'novidade_comercio': return { Icon: Sparkles, color: '#10B981' };
      case 'novidade_feed': return { Icon: Newspaper, color: '#3B82F6' };
      case 'lote_disponivel': return { Icon: Gift, color: '#F59E0B' };
      case 'app_update': return { Icon: ArrowUpCircle, color: '#EF4444' };
      default: return { Icon: Bell, color: '#6B7280' };
    }
  };

  const handlePress = () => {
    console.log('Dados da Notificação Clicada:', JSON.stringify(item, null, 2));
    onClose();
    setTimeout(() => {
      switch (item.type) {
        case 'novo_comercio':
        case 'novidade_comercio':
          if (item.metadata?.commerce_id) {
            navigation.navigate('Comercios', {
              screen: 'CommerceDetail',
              params: { commerceId: item.metadata.commerce_id },
            });
          } else {
             console.warn("Navegação falhou: 'commerce_id' não foi encontrado no metadata.");
          }
          break;
        case 'novidade_feed':
          navigation.navigate('Home', { screen: 'HomeTab', params: { scrollToEnd: true } });
          break;
        case 'nova_missao':
          navigation.navigate('Gamificacao');
          break;
        default:
          navigation.navigate('Home', { screen: 'HomeTab' });
          break;
      }
    }, 250);
  };

  const { Icon, color } = getNotificationStyle(item.type);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} onLongPress={toggleExpansion} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
        </View>
        {!item.is_read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
      </View>

      <Animated.View style={animatedStyle}>
        <View style={styles.expandedContent}>
            <Text style={styles.detailsTitle}>Detalhes Adicionais:</Text>
            {item.metadata && Object.entries(item.metadata).map(([key, value]) => (
                <Text key={key} style={styles.detailsText}>
                    <Text style={{fontWeight: 'bold'}}>{key.replace(/_/g, ' ')}:</Text> {String(value)}
                </Text>
            ))}
        </View>
      </Animated.View>

      <View style={styles.expandIndicator}>
        <ChevronDown size={16} color="#94A3B8" style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationsModal({ isVisible, onClose }) {
  const { userProfile } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userProfile?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userProfile.id},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Erro ao buscar notificações:', error);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, [userProfile?.id]);

  useEffect(() => {
    if (isVisible) {
      fetchNotifications();
    }
  }, [isVisible, fetchNotifications]);

  // LÓGICA DE ATUALIZAÇÃO EM TEMPO REAL
  useEffect(() => {
    if (!isVisible) return;

    const handleNewNotification = (payload) => {
      console.log('Nova notificação recebida!', payload.new);
      setNotifications(currentNotifications => [payload.new as Notification, ...currentNotifications]);
    };

    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        handleNewNotification
      )
      .subscribe();

    console.log('Inscrito no canal de notificações.');

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
        console.log('Desinscrito do canal de notificações.');
      }
    };
  }, [isVisible]);

  const groupedNotifications = notifications.reduce((acc, notif) => {
      const today = new Date();
      const notifDate = new Date(notif.created_at);
      let title = '';
      if(today.toDateString() === notifDate.toDateString()) {
          title = 'Hoje';
      } else {
          title = notifDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
      }
      if(!acc[title]) {
          acc[title] = [];
      }
      acc[title].push(notif);
      return acc;
  }, {});

  const sections = Object.keys(groupedNotifications).map(title => ({
      title,
      data: groupedNotifications[title]
  }));

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Notificações</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
            <ActivityIndicator style={{flex: 1}} size="large" />
        ) : (
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard item={item} onClose={onClose} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.scrollContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação por aqui.</Text>}
            />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    title: { fontSize: 22, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    scrollContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 30 },
    sectionHeader: { fontSize: 14, fontWeight: '600', color: '#64748B', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
    card: { 
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        padding: 12, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
    cardMessage: { fontSize: 14, color: '#475569', marginTop: 2, lineHeight: 20 },
    cardTime: { fontSize: 12, color: '#94A3B8', marginTop: 6 },
    unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8, alignSelf: 'flex-start' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#6B7280' },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    detailsTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 4,
    },
    detailsText: {
        fontSize: 13,
        color: '#475569',
        textTransform: 'capitalize',
        lineHeight: 18,
    },
    expandIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 8,
        opacity: 0.5,
    },
});