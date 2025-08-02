// screens/Transport/TransportTabScreen.tsx (VERSÃO FINAL INTEGRADA COM API)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { AlertTriangle, ChevronRight, Phone, Clock, AlertCircle } from '../../components/Icons';
import { useUserStore } from '../../hooks/useUserStore';
// --- AQUI ESTÁ A MUDANÇA ---
import { fetchBusSchedules, BusSchedule } from '../../api/transportApi'; // Importa a função da API e o tipo

// --- COMPONENTES DA TELA (sem alteração) ---
const TimeChip = ({ time, isNext }) => (
  <View style={[styles.timeChip, isNext && styles.nextTimeChip]}>
    <Text style={[styles.timeText, isNext && styles.nextTimeText]}>{time}</Text>
    {isNext && <Text style={styles.nextTag}>próximo</Text>}
  </View>
);

const LineCard = ({ schedule, currentTime }) => {
  const getNextDeparture = () => {
    // ... (lógica interna do card continua a mesma)
    for (const timeStr of schedule.times_weekday) {
      const [hour, minute] = timeStr.split(':').map(Number);
      const departureTime = new Date(currentTime);
      departureTime.setHours(hour, minute, 0, 0);

      if (departureTime > currentTime) {
        const diffMs = departureTime.getTime() - currentTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        let timeToGo = '';
        if (diffHours > 0) timeToGo += `${diffHours}h `;
        timeToGo += `${diffMins}min`;
        
        return { time: timeStr, timeToGo };
      }
    }
    return { time: null, timeToGo: null };
  };

  const { time: nextTime, timeToGo } = getNextDeparture();
  const statusStyles = { Funcionando: { header: '#D1FAE5', text: '#065F46', icon: '#10B981' }, Manutenção: { header: '#FEF3C7', text: '#92400E', icon: '#92400E' }, };
  const style = statusStyles[schedule.status] || statusStyles['Manutenção'];

  return (
    <View style={styles.lineCard}>
      <View style={[styles.lineHeader, { backgroundColor: style.header }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.lineTitle, { color: style.text }]}>{schedule.line_name}</Text>
          <Text style={[styles.lineSubtitle, { color: style.text }]}>{schedule.itinerary}</Text>
        </View>
        {schedule.status === 'Funcionando' && timeToGo && (
          <View style={styles.nextDepartureInfo}>
            <Text style={styles.nextDepartureText}>Próxima em</Text>
            <Text style={styles.nextDepartureTime}>{timeToGo}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.contentTitle}>Horários de Partida</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timesContainer}>
          {schedule.times_weekday.map((time) => (
            <TimeChip key={time} time={time} isNext={time === nextTime && schedule.status === 'Funcionando'} />
          ))}
        </ScrollView>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}><Clock size={14} color="#555" /><Text style={styles.detailText}>Intervalo: {schedule.interval}</Text></View>
          <TouchableOpacity style={styles.detailItem} onPress={() => Linking.openURL(`tel:${schedule.phone}`)}>
            <Phone size={14} color="#555" /><Text style={styles.detailText}>{schedule.phone}</Text>
          </TouchableOpacity>
        </View>
        {schedule.status === 'Manutenção' && (
          <View style={styles.maintenanceInfo}>
            <AlertCircle size={16} color={style.icon} />
            <Text style={[styles.maintenanceText, { color: style.text }]}>Linha em manutenção - horários podem estar alterados</Text>
          </View>
        )}
      </View>
    </View>
  );
};


// --- TELA PRINCIPAL (COM A LÓGICA DE DADOS ATUALIZADA) ---
export default function TransportTabScreen() {
  const { selectedLoteamentoId } = useUserStore();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Busca os dados do Supabase quando a tela carrega
    const loadSchedules = async () => {
      if (selectedLoteamentoId) {
        setLoading(true);
        const data = await fetchBusSchedules(selectedLoteamentoId);
        setSchedules(data);
        setLoading(false);
      }
    };
    loadSchedules();
  }, [selectedLoteamentoId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* O seu header e a UI continuam os mesmos */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transporte Público</Text>
        <View style={styles.headerStatus}>
          <Text style={styles.statusText}>Operação parcial</Text>
          <Text style={styles.timeTextHeader}>Agora {formatTime(currentTime)}</Text>
        </View>
      </View>
      
      {/* ... (resto da UI: seletor de região, caixa de informação) ... */}
       <View style={styles.section}>
        <TouchableOpacity style={styles.selector}>
          <View>
            <Text style={styles.selectorLabel}>Selecionar Região</Text>
            <Text style={styles.selectorValue}>Santo Antônio do Descoberto - GO</Text>
          </View>
          <ChevronRight size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <View style={styles.infoBox}>
          <AlertTriangle size={20} color="#D97706" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoBoxTitle}>Informação Importante</Text>
            <Text style={styles.infoBoxText}>Os horários podem sofrer alterações. Recomendamos confirmar pelo telefone antes da viagem.</Text>
          </View>
        </View>
      </View>

      {/* --- RENDERIZAÇÃO DINÂMICA --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Linhas Disponíveis ({schedules.length})</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#339949ff" style={{ marginTop: 20 }} />
        ) : (
          schedules.length > 0 ? (
            schedules.map(schedule => (
              <LineCard key={schedule.id} schedule={schedule} currentTime={currentTime} />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma linha de transporte encontrada para este loteamento.</Text>
          )
        )}
      </View>

       <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.helpBox}>
          <Phone size={24} color="#2563EB" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.helpBoxTitle}>Dúvidas sobre Transporte?</Text>
            <Text style={styles.helpBoxText}>Nossa equipe está pronta para ajudar com informações sobre rotas, horários e mais.</Text>
            <Text style={styles.helpBoxPhone}>(61) 3333-4444</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// --- ESTILOS (com a adição do 'emptyText') ---
const styles = StyleSheet.create({
  // ... (todos os seus estilos anteriores)
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A202C' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { backgroundColor: '#F59E0B', color: 'white', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, overflow: 'hidden' },
  timeTextHeader: { marginLeft: 8, color: '#4A5568', fontWeight: '500' },
  section: { paddingHorizontal: 20, marginTop: 20 },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  selectorLabel: { color: '#718096', fontSize: 12 },
  selectorValue: { color: '#1A202C', fontSize: 16, fontWeight: '600' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FEF3C7', padding: 16, borderRadius: 12 },
  infoBoxTitle: { fontWeight: 'bold', color: '#92400E' },
  infoBoxText: { color: '#92400E', marginTop: 2, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 12 },
  lineCard: { backgroundColor: 'white', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  lineHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineTitle: { fontSize: 16, fontWeight: 'bold' },
  lineSubtitle: { fontSize: 13, opacity: 0.9 },
  nextDepartureInfo: { alignItems: 'flex-end' },
  nextDepartureText: { fontSize: 12, color: '#4A5568' },
  nextDepartureTime: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  cardContent: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  contentTitle: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 12 },
  timesContainer: { marginLeft: -4 },
  timeChip: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, alignItems: 'center' },
  nextTimeChip: { backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#60A5FA' },
  timeText: { color: '#334155', fontWeight: '600' },
  nextTimeText: { color: '#1E40AF' },
  nextTag: { color: '#1D4ED8', fontSize: 10, fontWeight: 'bold', marginTop: 2, textTransform: 'uppercase' },
  detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 6, color: '#4A5568' },
  maintenanceInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginTop: 16 },
  maintenanceText: { marginLeft: 8, fontSize: 12, flex: 1 },
  helpBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#DBEAFE', padding: 16, borderRadius: 12 },
  helpBoxTitle: { fontWeight: 'bold', color: '#1E3A8A' },
  helpBoxText: { color: '#1E40AF', marginTop: 2, lineHeight: 18, marginBottom: 8 },
  helpBoxPhone: { color: '#1E3A8A', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#6B7280', fontStyle: 'italic', paddingVertical: 20 },
});