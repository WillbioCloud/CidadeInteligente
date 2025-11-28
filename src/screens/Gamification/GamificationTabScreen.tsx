import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, Trophy, Target, Gift, Star, Crown, Calendar, Zap } from 'lucide-react-native';
import { NonClientGamificationScreen } from './NonClientGamificationScreen'; // Importando a nova tela

// Hooks, Dados e Componentes
import { useUserStore } from '../../hooks/useUserStore';
import { getMissionsForLoteamento } from '../../data/missions';
import { Mission } from '../../data/missions/types';
import { ALL_ACHIEVEMENTS } from '../../data/achievements.data';
import { LEVELS_DATA } from '../../data/levels.data';
import { LOTEAMENTOS_CONFIG } from '../../data/loteamentos.data';

// Componentes da Gamificação
import LevelCard from '../../components/Gamification/LevelCard';
import AppTabs from '../../components/ui/AppTabs';
import InfoBanner from '../../components/Gamification/InfoBanner';
import InteractiveMissionCard from '../../components/Gamification/InteractiveMissionCard';
import AchievementsSection from '../../components/Gamification/AchievementsSection';
import MotivationalCard from '../../components/Gamification/MotivationalCard';
import LevelDetailsModal from '../../components/Gamification/LevelDetailsModal';
import AchievementsCatalogModal from '../../components/Gamification/AchievementsCatalog.modal';
import LoteamentoSelector from '../../components/LoteamentoSelector';
import RewardPopup from '../../components/ui/RewardPopup';

// --- Componente para a tela de "Não Cliente" ---
const NonClientView = () => {
  const navigation = useNavigation();

  const BenefitItem = ({ icon: Icon, text }) => (
    <View style={styles.benefitItem}>
      <Icon size={24} color="#A0AEC0" />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.nonClientContainer}>
      <View style={styles.nonClientContent}>
        <View style={styles.iconContainer}>
          <Lock size={64} color="#A0AEC0" />
          <View style={styles.trophyBadge}>
            <Trophy size={20} color="white" />
          </View>
        </View>

        <Text style={styles.title}>Área Exclusiva para Clientes</Text>
        <Text style={styles.subtitle}>
          Adquira um lote em nossos empreendimentos e desbloqueie um mundo de recompensas e benefícios!
        </Text>

        <View style={styles.benefitsGrid}>
          <BenefitItem icon={Target} text="Missões Exclusivas" />
          <BenefitItem icon={Gift} text="Recompensas" />
          <BenefitItem icon={Star} text="Sistema de Níveis" />
          <BenefitItem icon={Crown} text="Conquistas" />
        </View>

        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.ctaButtonText}>Ver Nossos Loteamentos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const ClientGamificationView = () => (
  <SafeAreaView style={styles.container}>
      <ScrollView>
          <Text style={styles.headerTitle}>Minha Jornada</Text>
          {/* Aqui entraria a lógica do LevelCard, Missões, etc. */}
          <Text style={{padding: 20}}>Conteúdo da Gamificação para clientes aqui...</Text>
      </ScrollView>
  </SafeAreaView>
);

// --- Componente Principal ---
export default function GamificationTabScreen() {
    const { isClient, userProfile, selectedLoteamentoId, setUserProfile } = useUserStore();
    
    const [activeTab, setActiveTab] = useState('Diárias');
    const [missionsProgress, setMissionsProgress] = useState({});
    
    const [isCatalogVisible, setCatalogVisible] = useState(false);
    const [isLevelModalVisible, setLevelModalVisible] = useState(false);
    const [isSelectorVisible, setSelectorVisible] = useState(false);
    const [isRewardVisible, setRewardVisible] = useState(false);
    const [lastReward, setLastReward] = useState({ title: '', points: 0 });
    
    const loteamento = LOTEAMENTOS_CONFIG[selectedLoteamentoId];
    const { getThemeColors } = useUserStore.getState();
    const theme = getThemeColors();

    // Se não for cliente, mostra a tela de bloqueio
    if (!isClient) {
      return <NonClientView />;
    }

    // Se for cliente, mas os dados ainda não carregaram, mostra loading
    if (!userProfile || !loteamento) {
      return <View style={styles.centered}><ActivityIndicator size="large" color={theme.primary} /></View>;
    }
    
    const userPoints = userProfile.points || 0;
    const userFullName = userProfile.full_name || 'Morador';

    const userLevel = useMemo(() => {
        let currentLvl = 1;
        const sortedLevels = Object.keys(LEVELS_DATA).map(Number).sort((a, b) => a - b);
        for (const level of sortedLevels) {
            if (userPoints >= LEVELS_DATA[level].pointsRequired) { currentLvl = level; } 
            else { break; }
        }
        return currentLvl;
    }, [userPoints]);
    
    const allMissions = useMemo(() => getMissionsForLoteamento(loteamento.id), [loteamento.id]);
    const dailyMissions = useMemo(() => allMissions.filter(m => m.type === 'daily'), [allMissions]);
    const evolutionMissions = useMemo(() => allMissions.filter(m => m.type === 'evolution'), [allMissions]);
    
    const handleClaimReward = useCallback((mission: Mission) => {
        const newPoints = userPoints + mission.points;
        setUserProfile({ ...userProfile, points: newPoints }, userProfile.properties);

        setMissionsProgress(prev => ({
            ...prev,
            [mission.id]: { ...prev[mission.id], completedBy: userFullName }
        }));
        setLastReward({ title: mission.title, points: mission.points });
        setRewardVisible(true);
    }, [userProfile, userPoints, userFullName, setUserProfile]);
    
    const handleToggleTask = useCallback((missionId: number, taskIndex: number) => {
        setMissionsProgress(prev => {
            const currentMissionProgress = prev[missionId] || { tasks: [] };
            const newTasks = [...currentMissionProgress.tasks];
            newTasks[taskIndex] = !newTasks[taskIndex];
            return { ...prev, [missionId]: { ...currentMissionProgress, tasks: newTasks } };
        });
    }, []);

    const currentLevelData = LEVELS_DATA[userLevel];
    const nextLevelData = LEVELS_DATA[userLevel + 1];
    let pointsToNextLevel = 0;
    let progressPercent = 100;

    if (currentLevelData && nextLevelData) {
        const pointsForCurrentLevel = currentLevelData.pointsRequired;
        const pointsForNextLevelReq = nextLevelData.pointsRequired;
        pointsToNextLevel = pointsForNextLevelReq - userPoints;
        const totalPointsInSegment = pointsForNextLevelReq - pointsForCurrentLevel;
        const pointsEarnedInSegment = userPoints - pointsForCurrentLevel;
        if (totalPointsInSegment > 0) {
            progressPercent = (pointsEarnedInSegment / totalPointsInSegment) * 100;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <LevelCard
                    level={userLevel}
                    levelName={currentLevelData.name}
                    userName={userFullName}
                    loteamento={loteamento}
                    points={userPoints}
                    pointsToNextLevel={pointsToNextLevel}
                    progressPercent={progressPercent}
                    theme={theme}
                    onPress={() => setLevelModalVisible(true)}
                    onLogoPress={() => setSelectorVisible(true)}
                />
                
                <AppTabs tabs={['Diárias', 'Evolução']} activeTab={activeTab} onTabPress={setActiveTab} theme={theme} />
                
                <View style={styles.contentContainer}>
                    {activeTab === 'Diárias' ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Calendar size={24} color="#374151" />
                                    <Text style={styles.sectionTitle}>Missões Diárias</Text>
                                </View>
                            </View>
                            <InfoBanner />
                            <View style={styles.missionsList}>
                                {dailyMissions.map(mission => (
                                    <InteractiveMissionCard
                                        key={mission.id} mission={mission} theme={theme}
                                        progressInfo={missionsProgress[mission.id] || { tasks: [], completedBy: null }}
                                        onToggleTask={handleToggleTask} onClaimReward={handleClaimReward}
                                    />
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleContainer}>
                                <Zap size={24} color="#374151" />
                                <Text style={styles.sectionTitle}>Missões de Evolução</Text>
                            </View>
                            <View style={styles.missionsList}>
                              {evolutionMissions.map(mission => (
                                  <InteractiveMissionCard
                                      key={mission.id} mission={mission} theme={theme}
                                      progressInfo={missionsProgress[mission.id] || { tasks: [], completedBy: null }}
                                      onToggleTask={handleToggleTask} onClaimReward={handleClaimReward}
                                  />
                              ))}
                            </View>
                        </View>
                    )}
                </View>

                <AchievementsSection
                    achievements={ALL_ACHIEVEMENTS.slice(0, 4)}
                    onShowCatalog={() => setCatalogVisible(true)}
                />

                <MotivationalCard 
                    userName={userFullName.split(' ')[0]}
                    loteamentoName={loteamento.name}
                    theme={theme}
                />
                
                <View style={{ height: 120 }} />
            </ScrollView>
            
            <LevelDetailsModal isVisible={isLevelModalVisible} onClose={() => setLevelModalVisible(false)} currentLevel={userLevel} userPoints={userPoints} totalPointsForNextLevel={nextLevelData?.pointsRequired || userPoints}/>
            <AchievementsCatalogModal isVisible={isCatalogVisible} onClose={() => setCatalogVisible(false)} />
            <LoteamentoSelector isVisible={isSelectorVisible} onClose={() => setSelectorVisible(false)} />
            <RewardPopup isVisible={isRewardVisible} onClose={() => setRewardVisible(false)} title={lastReward.title} points={lastReward.points} theme={theme} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F5F7' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { marginTop: 16 },
    missionsList: { paddingHorizontal: 16, marginTop: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, },
    sectionTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginLeft: 8 },
    // Estilos para NonClientView
    nonClientContainer: { flex: 1, backgroundColor: '#F7FAFC' },
    nonClientContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    trophyBadge: { position: 'absolute', top: -5, right: -5, width: 40, height: 40, borderRadius: 20, backgroundColor: '#F56565', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F7FAFC' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginTop: 8, lineHeight: 24 },
    benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 32, marginBottom: 32 },
    benefitItem: { alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, width: '45%', margin: '2.5%', borderWidth: 1, borderColor: '#E2E8F0' },
    benefitText: { marginTop: 8, fontSize: 12, color: '#4A5568', fontWeight: '500' },
    ctaButton: { backgroundColor: '#4A90E2', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 25 },
    ctaButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
