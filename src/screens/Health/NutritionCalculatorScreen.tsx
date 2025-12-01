import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Activity, Info, CheckCircle } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

export default function NutritionCalculatorScreen() {
  const navigation = useNavigation();
  
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState(1.2);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height); // assumindo cm
    const a = parseFloat(age);

    if (!w || !h || !a) {
      Alert.alert('Dados Incompletos', 'Por favor, preencha todos os campos.');
      return;
    }

    // 1. Cálculo do IMC
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    
    let bmiStatus = '';
    let bmiColor = '';

    if (bmi < 18.5) { bmiStatus = 'Abaixo do peso'; bmiColor = '#F59E0B'; }
    else if (bmi < 24.9) { bmiStatus = 'Peso normal'; bmiColor = '#10B981'; }
    else if (bmi < 29.9) { bmiStatus = 'Sobrepeso'; bmiColor = '#F59E0B'; }
    else { bmiStatus = 'Obesidade'; bmiColor = '#EF4444'; }

    // 2. Cálculo da Taxa Metabólica Basal (Fórmula de Harris-Benedict revisada)
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * w) + (4.8 * h) - (5.7 * a);
    } else {
      bmr = 447.6 + (9.2 * w) + (3.1 * h) - (4.3 * a);
    }

    // Gasto energético total
    const tdee = Math.round(bmr * activityLevel);

    setResult({
      bmi: bmi.toFixed(1),
      bmiStatus,
      bmiColor,
      calories: tdee,
    });
  };

  const ActivityOption = ({ label, value }: { label: string, value: number }) => (
    <TouchableOpacity 
      style={[
        styles.activityOption, 
        activityLevel === value && styles.activityOptionSelected
      ]}
      onPress={() => setActivityLevel(value)}
    >
      <View style={[
        styles.radioCircle,
        activityLevel === value && styles.radioCircleSelected
      ]} />
      <Text style={[
        styles.activityLabel,
        activityLevel === value && styles.activityLabelSelected
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculadora Nutricional</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Seletor de Gênero */}
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]} 
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Homem</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]} 
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Mulher</Text>
            </TouchableOpacity>
          </View>

          {/* Inputs Numéricos */}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="0"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="0"
                value={height}
                onChangeText={setHeight}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="0"
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>

          {/* Nível de Atividade */}
          <Text style={styles.label}>Nível de Atividade Física</Text>
          <View style={styles.activityContainer}>
            <ActivityOption label="Sedentário (pouco ou nenhum exercício)" value={1.2} />
            <ActivityOption label="Leve (exercício 1-3 dias/semana)" value={1.375} />
            <ActivityOption label="Moderado (exercício 3-5 dias/semana)" value={1.55} />
            <ActivityOption label="Intenso (exercício 6-7 dias/semana)" value={1.725} />
          </View>

          {/* Botão Calcular */}
          <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
            <Activity size={20} color="#FFF" />
            <Text style={styles.calculateButtonText}>Calcular</Text>
          </TouchableOpacity>

          {/* Resultados */}
          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <CheckCircle size={24} color={theme.colors.primary} />
                <Text style={styles.resultTitle}>Seus Resultados</Text>
              </View>
              
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>IMC</Text>
                  <Text style={[styles.resultValue, { color: result.bmiColor }]}>{result.bmi}</Text>
                  <Text style={[styles.resultStatus, { color: result.bmiColor }]}>{result.bmiStatus}</Text>
                </View>
                
                <View style={styles.divider} />

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Calorias Diárias</Text>
                  <Text style={styles.resultValue}>{result.calories}</Text>
                  <Text style={styles.resultStatus}>Kcal / dia</Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Info size={16} color={theme.colors.text.secondary} style={{marginTop: 2}} />
                <Text style={styles.infoText}>
                  Estes valores são estimativas. Consulte um nutricionista para um plano personalizado.
                </Text>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 8,
    marginTop: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: theme.colors.primary,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  genderTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityOptionSelected: {
    backgroundColor: '#F9FAFB',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 6,
  },
  activityLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  activityLabelSelected: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  calculateButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginTop: 32,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginBottom: 8,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});