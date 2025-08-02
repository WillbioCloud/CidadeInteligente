// src/components/Gamification/MissionCard.tsx

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
import { Award, CheckCircle, Coins, Gift, ScanLine, Shield, Type, Zap } from 'lucide-react-native';
import { Mission } from '../../screens/Gamification/GamificationTabScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MissionCardProps {
  mission: Mission;
  onActionPress: (mission: Mission) => void; // Prop unificada para qualquer ação
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

  const isCompleted = mission.is_completed === true;
  const missionType = (mission.type || '').trim().toUpperCase();
  const isQrScan = missionType === 'QR_CODE';
  const isCode = missionType === 'CODE';

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: isCompleted ? 100 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isCompleted, progressAnim]);

  const progressStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  const toggleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <Pressable
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={toggleExpansion}
      disabled={isCompleted}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconAndTitle}>
          {isCompleted ? <CheckCircle size={24} color="#16A34A" /> : <Award size={24} color="#4F46E5" />}
          <Text style={styles.missionTitle}>{mission.title}</Text>
        </View>
        <Text style={styles.xpText}>+{mission.xp_reward} XP</Text>
      </View>

      <Text style={styles.missionDescription}>{mission.description}</Text>

      {!isCompleted && (
        <>
          {isQrScan && (
            <TouchableOpacity style={[styles.actionButton, styles.qrButton]} onPress={() => onActionPress(mission)}>
              <ScanLine size={18} color="white" />
              <Text style={styles.actionButtonText}>Escanear QR Code</Text>
            </TouchableOpacity>
          )}
          {isCode && (
            <TouchableOpacity style={[styles.actionButton, styles.codeButton]} onPress={() => onActionPress(mission)}>
              <Type size={18} color="white" />
              <Text style={styles.actionButtonText}>Inserir Código</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {isExpanded && !isCompleted && (
        <View style={styles.expandedContent}>
          <Text style={styles.spoilsTitle}>Espólios da Missão</Text>
          <PrizeDetail icon={Zap} title={`${mission.xp_reward} XP`} description="Pontos de experiência." color="#4F46E5" />
          <PrizeDetail icon={Coins} title={`${mission.coin_reward} Moedas`} description="Moedas para usar na loja." color="#F59E0B" />
          <PrizeDetail icon={Shield} title="Conquista: Pioneiro" description="Será adicionada ao seu perfil." color="#EC4899" />
          <PrizeDetail icon={Gift} title="Desconto Exclusivo" description="Voucher especial para aquisição de lote." color="#8B5CF6" />
        </View>
      )}

      <View style={styles.progressWrapper}>
        <Text style={styles.progressText}>{isCompleted ? 'Missão Concluída!' : 'Missão Pendente'}</Text>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressStyle, isCompleted && { backgroundColor: '#22C55E' }]} />
        </View>
      </View>
    </Pressable>
  );
}

// ... (Estilos completos abaixo)
const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  completedCard: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  iconAndTitle: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  missionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 12, color: '#1F2937', flex: 1 },
  xpText: { fontSize: 14, fontWeight: 'bold', color: '#4F46E5' },
  missionDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 16, marginLeft: 36 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, marginTop: 4, marginBottom: 16, gap: 8 },
  qrButton: { backgroundColor: '#10B981' },
  codeButton: { backgroundColor: '#8B5CF6' },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  expandedContent: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
  spoilsTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  prizeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  prizeIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  prizeTextContainer: { flex: 1 },
  prizeTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  prizeDescription: { fontSize: 13, color: '#6B7280' },
  progressWrapper: { marginTop: 12 },
  progressText: { fontSize: 12, color: '#6B7280', marginBottom: 4, textAlign: 'center' },
  progressContainer: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#4F46E5' },
});