// screens/Transport/TransportTabScreen.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Linking, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Ícones e APIs
import { Bus, Clock, Phone, AlertCircle, ChevronDown, Info, Map } from '../../components/Icons';
import { fetchBusSchedules, BusSchedule } from '../../api/transportApi';
import { ALL_LOTEAMENTOS } from '../../data/loteamentos.data';

// A linha "import CustomHeader" foi REMOVIDA daqui.

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Seus componentes internos (LineCard, NoTransportView, SchedulesView) continuam os mesmos ---

const LineCard = ({ schedule }: { schedule: BusSchedule }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Funcionando': return { header: '#D1FAE5', text: '#065F46', badge: '#10B981' };
      case 'Manutenção': return { header: '#FEF3C7', text: '#92400E', badge: '#F59E0B' };
      default: return { header: '#FEE2E2', text: '#991B1B', badge: '#EF4444' };
    }
  };
  const statusStyle = getStatusStyle(schedule.status);

  return (
    <View style={styles.lineCard}>
      <View style={[styles.lineHeader, { backgroundColor: statusStyle.header }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.lineTitle, { color: statusStyle.text }]}>{schedule.line_name}</Text>
          <Text style={[styles.lineSubtitle, { color: statusStyle.text, opacity: 0.8 }]}>{schedule.itinerary}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.badge }]}>
            <Text style={styles.statusBadgeText}>{schedule.status}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.contentTitle}>Horários de Partida (Semana)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {schedule.times_weekday.map((time, index) => (
            <View key={index} style={styles.timeChip}><Text style={styles.timeText}>{time}</Text></View>
          ))}
        </ScrollView>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}><Clock size={16} color="#555" /><Text style={styles.detailText}>Intervalo: {schedule.interval}</Text></View>
          <TouchableOpacity style={styles.detailItem} onPress={() => Linking.openURL(`tel:${schedule.phone}`)}>
            <Phone size={16} color="#555" /><Text style={styles.detailText}>{schedule.phone}</Text>
          </TouchableOpacity>
        </View>
        {schedule.status === 'Manutenção' && (
            <View style={styles.maintenanceInfo}>
                <AlertCircle size={16} color="#92400E" />
                <Text style={styles.maintenanceText}>Linha em manutenção - horários podem estar alterados</Text>
            </View>
        )}
      </View>
    </View>
  );
};

const NoTransportView = () => (
    <View style={styles.infoCard}>
        <Info size={24} color="#D97706" />
        <View style={styles.infoCardContent}>
            <Text style={styles.infoCardTitle}>Transporte em Caldas Novas</Text>
            <Text style={styles.infoCardText}>
                Caldas Novas não possui sistema de transporte público municipal. As opções mais comuns são:
            </Text>
            <Text style={styles.infoListItem}>• Táxi e aplicativos (Uber, 99)</Text>
            <Text style={styles.infoListItem}>• Veículo próprio ou alugado</Text>
            <Text style={styles.infoListItem}>• Serviços de transfer dos hotéis</Text>
        </View>
    </View>
);

const SchedulesView = ({ schedules, isLoading }) => {
    if (isLoading) return <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />;
    if (!schedules || schedules.length === 0) return <Text style={styles.noContentText}>Nenhuma linha de ônibus encontrada para esta região.</Text>;
    return schedules.map(schedule => <LineCard key={schedule.id} schedule={schedule} />);
};


// --- Componente Principal ---
export default function TransportTabScreen() {
  const navigation = useNavigation();
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cityOptions = [
      { name: 'Santo Antônio do Descoberto - GO', hasTransport: true },
      { name: 'Caldas Novas - GO', hasTransport: false },
  ];

  useEffect(() => {
    if (selectedCityName) {
      const cityData = cityOptions.find(c => c.name === selectedCityName);
      if (cityData?.hasTransport) {
        setIsLoading(true);
        const loteamentoParaBuscar = ALL_LOTEAMENTOS.find(l => l.city === selectedCityName && l.hasTransport);
        
        if (loteamentoParaBuscar) {
            fetchBusSchedules(loteamentoParaBuscar.id).then(data => {
                setSchedules(data);
                setIsLoading(false);
            });
        } else {
             setIsLoading(false);
             setSchedules([]);
        }
      } else {
          setSchedules([]);
      }
    }
  }, [selectedCityName]);

  const selectedCityData = cityOptions.find(c => c.name === selectedCityName);

  return (
    // AQUI ESTÁ A MUDANÇA:
    // Trocamos SafeAreaView por ScrollView e removemos a chamada para o <CustomHeader />.
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* <CustomHeader /> foi REMOVIDO */}
      <View style={styles.mainHeader}>
        <Text style={styles.title}>Transporte e Região</Text>
      </View>

      <TouchableOpacity 
        style={styles.exploreMapButton} 
        onPress={() => navigation.navigate('ExploreMap')}
      >
        <Map color="white" size={20} />
        <Text style={styles.exploreMapButtonText}>Explorar Mapa de Comércios</Text>
      </TouchableOpacity>
      
      <View style={styles.selectorWrapper}>
          <Text style={styles.selectorLabel}>Horários por Região</Text>
          <TouchableOpacity 
              style={styles.selectorContainer}
              onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setDropdownOpen(!isDropdownOpen);
              }}
          >
              <Text style={styles.selectorText}>{selectedCityName || 'Escolha uma cidade'}</Text>
              <ChevronDown size={20} color="#555" style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }]}}/>
          </TouchableOpacity>
          {isDropdownOpen && (
              <View style={styles.dropdown}>
                  {cityOptions.map(city => (
                      <TouchableOpacity 
                          key={city.name} 
                          style={styles.dropdownItem}
                          onPress={() => {
                              setSelectedCityName(city.name);
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                              setDropdownOpen(false);
                          }}
                      >
                          <Text style={styles.dropdownItemText}>{city.name}</Text>
                          {!city.hasTransport && <Text style={styles.dropdownItemTag}>Sem transporte</Text>}
                      </TouchableOpacity>
                  ))}
              </View>
          )}
      </View>

      {selectedCityData && (
          <View style={styles.contentContainer}>
              {selectedCityData.hasTransport ? (
                  <SchedulesView schedules={schedules} isLoading={isLoading} />
              ) : (
                  <NoTransportView />
              )}
          </View>
      )}
    </ScrollView>
  );
}

// Seus estilos complexos continuam aqui, sem alterações.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  mainHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#121212' },
  exploreMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
  },
  exploreMapButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  selectorWrapper: { marginHorizontal: 16, marginVertical: 24, zIndex: 10 },
  selectorLabel: { fontSize: 14, fontWeight: '500', color: '#555', marginBottom: 8 },
  selectorContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  selectorText: { fontSize: 16, color: '#333' },
  dropdown: { backgroundColor: 'white', borderRadius: 12, marginTop: 4, elevation: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dropdownItemText: { fontSize: 16 },
  dropdownItemTag: { fontSize: 12, color: '#D97706', backgroundColor: '#FEF3C7', paddingHorizontal: 6, borderRadius: 8, overflow: 'hidden' },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  noContentText: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  lineCard: { backgroundColor: 'white', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  lineHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  lineTitle: { fontSize: 18, fontWeight: 'bold' },
  lineSubtitle: { fontSize: 14 },
  statusBadge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, overflow: 'hidden' },
  statusBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  cardContent: { padding: 16, borderTopWidth: 1, borderColor: '#F0F0F0' },
  contentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  timeChip: { backgroundColor: '#EBF2FC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8 },
  timeText: { color: '#4A90E2', fontWeight: '600' },
  detailsContainer: { borderTopWidth: 1, borderColor: '#F0F0F0', marginTop: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 8, color: '#555' },
  maintenanceInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 10, borderRadius: 8, marginTop: 12 },
  maintenanceText: { marginLeft: 8, color: '#92400E', fontSize: 12 },
  infoCard: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, alignItems: 'flex-start' },
  infoCardContent: { flex: 1, marginLeft: 12 },
  infoCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#B45309', marginBottom: 4 },
  infoCardText: { color: '#B45309', lineHeight: 20 },
  infoListItem: { color: '#B45309', marginTop: 4 },
});