<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import { Award, CheckCircle, Coins, Gift, ScanLine, Shield, Type, Zap, Lock } from 'lucide-react-native';
import { Mission } from '../../screens/Gamification/GamificationTabScreen';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MissionCardProps {
  mission: Mission;
  onActionPress: (mission: Mission) => void;
}

const PrizeDetail = ({ icon: Icon, title, description, color }) => (
  <View style={styles.prizeContainer}>
    <View style={[styles.prizeIconContainer, { backgroundColor: `${color}20` }]}>
      <Icon size={22} color={color} />
    </View>
    <View style={styles.prizeTextContainer}>
      <Text style={styles.prizeTitle}>{title}</Text>
      <Text style={styles.prizeDescription}>{description}</Text>
    </View>
  </View>
);

export default function MissionCard({ mission, onActionPress }: MissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isCompleted = mission.is_completed === true;
  const missionType = (mission.type || '').trim().toUpperCase();
  const isQrScan = missionType === 'QR_CODE';
  const isCode = missionType === 'CODE';
  const progressPercentage = mission.progressPercentage || 57; // Valor padrão 57% baseado na imagem, pode vir do mission

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: isCompleted ? 100 : progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isCompleted, progressAnim, progressPercentage]);

  const progressStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    if (isCompleted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const animatedCardStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const renderSpoils = () => {
    const spoils = [];
    if (mission.xp_reward) spoils.push(<PrizeDetail key="xp" icon={Zap} title={`${mission.xp_reward} XP`} description="Pontos de experiência." color="#4F46E5" />);
    if (mission.coin_reward) spoils.push(<PrizeDetail key="coins" icon={Coins} title={`${mission.coin_reward} Moedas`} description="Moedas para usar na loja." color="#F59E0B" />);
    if (mission.conquista) spoils.push(<PrizeDetail key="conquista" icon={Shield} title={mission.conquista} description="Será adicionada ao seu perfil." color="#EC4899" />);
    if (mission.desconto) spoils.push(<PrizeDetail key="desconto" icon={Gift} title={mission.desconto} description="Voucher especial para aquisição de lote." color="#8B5CF6" />);
    return spoils.length > 0 ? spoils : null;
  };

  return (
    <Animated.View style={animatedCardStyle}>
      <Pressable
        style={[styles.card, isCompleted && styles.completedCard]}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={200}
        disabled={isCompleted}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconAndTitle}>
            {isCompleted ? (
              <CheckCircle size={24} color="#16A34A" />
            ) : (
              <View style={styles.lockContainer}>
                <Lock size={28} color="#F59E0B" style={styles.lockIcon} />
                <Text style={styles.progressText}>{progressPercentage}%</Text>
              </View>
            )}
            <Text style={styles.missionTitle}>{mission.title}</Text>
          </View>
          <Text style={styles.xpText}>+{mission.xp_reward} XP</Text>
        </View>

        <Text style={styles.missionDescription}>{mission.description}</Text>

        {!isCompleted && (
          <View style={styles.buttonContainer}>
            {isQrScan && (
              <TouchableOpacity style={[styles.actionButton, styles.qrButton]} onPress={() => onActionPress(mission)}>
                <ScanLine size={18} color="white" />
                <Text style={styles.actionButtonText}>Escanear QR</Text>
              </TouchableOpacity>
            )}
            {isCode && (
              <TouchableOpacity style={[styles.actionButton, styles.codeButton]} onPress={() => onActionPress(mission)}>
                <Type size={18} color="white" />
                <Text style={styles.actionButtonText}>Inserir Código</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isExpanded && !isCompleted && renderSpoils() && (
          <View style={styles.expandedContent}>
            <Text style={styles.spoilsTitle}>Espólios da Missão</Text>
            {renderSpoils()}
          </View>
        )}

        <View style={styles.progressWrapper}>
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressStyle, { backgroundColor: isCompleted ? '#22C55E' : '#F59E0B' }]} />
          </View>
          <Text style={styles.progressStatus}>{isCompleted ? 'Concluído' : `${progressPercentage}% Completado`}</Text>
        </View>
      </Pressable>
    </Animated.View>
=======
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyMission, LevelMission } from '../../data/missions.data';

interface MissionCardProps {
  // O card pode receber tanto uma missão diária quanto de evolução
  mission: DailyMission | LevelMission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  // A barra de progresso ainda não é dinâmica, ficará em 0% por enquanto
  const progress = 0; 

  return (
    <View style={styles.card}>
      {/* Container do Ícone */}
      <View style={[styles.iconContainer, { backgroundColor: mission.color }]}>
        <Ionicons name={mission.icon as any} size={28} color="white" />
      </View>

      {/* Container de Texto e Progresso */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{mission.title}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.points}>{mission.points}</Text>
          </View>
        </View>
        <Text style={styles.description}>{mission.description}</Text>
        
        {/* Barra de Progresso */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% concluída</Text>
      </View>
    </View>
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
  );
}

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
    backgroundColor: '#1E40AF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  completedCard: { backgroundColor: '#22C55E', borderColor: '#A7F3D0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  iconAndTitle: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lockContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 6, borderRadius: 10, marginRight: 8 },
  lockIcon: { marginRight: 4 },
  progressText: { fontSize: 14, color: '#B45309', fontWeight: 'bold' },
  missionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 12, flex: 1 },
  xpText: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
  missionDescription: { fontSize: 14, color: '#E0E7FF', lineHeight: 20, marginBottom: 12, marginLeft: 40 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, marginHorizontal: 4, gap: 6 },
  qrButton: { backgroundColor: '#10B981' },
  codeButton: { backgroundColor: '#8B5CF6' },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  expandedContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#4B5563' },
  spoilsTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  prizeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  prizeIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  prizeTextContainer: { flex: 1 },
  prizeTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  prizeDescription: { fontSize: 12, color: '#E0E7FF' },
  progressWrapper: { marginTop: 12 },
  progressContainer: { height: 10, backgroundColor: '#4B5563', borderRadius: 5, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 5 },
  progressStatus: { fontSize: 12, color: '#FFFFFF', textAlign: 'center', marginTop: 4 },
});
=======
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Permite que o texto quebre a linha se for muito grande
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007BFF', // Azul para o progresso
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#6C757D',
    marginTop: 4,
    textAlign: 'right',
  },
});// ...existing code...
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Verifica a sessão atual quando o app abre
  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
  };

  fetchSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    authListener?.subscription.unsubscribe();
  };
}, []);

if (loading) {
  return null; // Ou um componente de <LoadingScreen />
}
// ...existing code...
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
