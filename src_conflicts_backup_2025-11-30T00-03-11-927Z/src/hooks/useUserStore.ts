<<<<<<< HEAD
// src/hooks/useUserStore.ts (VERSÃO FINAL COM A CORREÇÃO DE TENTATIVAS)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';
import { THEME_COLORS } from '../styles/designSystem';

// --- SUAS INTERFACES (sem alterações) ---
=======
// src/hooks/useUserStore.ts (VERSÃO FINAL COM PERSISTÊNCIA DE CONQUISTAS)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';

>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
export interface UserProperty {
  id: string;
  loteamento_id: string;
  quadra: string;
  lote: string;
}

export interface Profile {
  id: string;
<<<<<<< HEAD
  full_name: string;
  isClient?: boolean;
  avatar_url?: string;
=======
  user_status: 'client' | 'non_client';
  full_name: string;
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
  email?: string;
  points?: number;
  level?: number;
  properties?: UserProperty[];
<<<<<<< HEAD
  dependents?: any[];
  available_achievements?: string[];
  displayed_achievements?: string[];
  phone?: string;
=======
  available_achievements?: string[];
  displayed_achievements?: string[];
  avatar_url?: string; // Adicionado para a foto de perfil
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
}

export interface ThemeColors {
  primary: string;
  accent: string;
  light: string;
  gradient: string[];
}

interface UserState {
  session: any | null;
  userProfile: Profile | null;
  selectedLoteamentoId: string | null;
<<<<<<< HEAD
  _hasHydrated: boolean;
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  setHasHydrated: (state: boolean) => void;
  fetchUserProfile: (session: any) => Promise<void>;
  clearStore: () => void;
  updateUserProfile: (updates: Partial<Profile>) => void;
  setDisplayedAchievements: (achievements: string[]) => void;
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;
=======
  isClient: boolean;
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  setDisplayedAchievements: (achievements: string[]) => void;
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;
  clearStore: () => void;
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      selectedLoteamentoId: 'cidade_inteligente',
<<<<<<< HEAD
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setSession: (session) => set({ session }),
      setSelectedLoteamentoId: (loteamentoId) => set({ selectedLoteamentoId: loteamentoId }),

      setUserProfile: (profile, properties) => {
        const isClient = !!(properties && properties.length > 0);
        let selectedId = get().selectedLoteamentoId || 'cidade_inteligente';
        if (isClient && properties[0]?.loteamento_id) {
          selectedId = properties[0].loteamento_id;
        }
        set({
          userProfile: profile ? { ...profile, properties, isClient } : null,
          selectedLoteamentoId: selectedId,
        });
      },

      // --- FUNÇÃO CORRIGIDA AQUI ---
      fetchUserProfile: async (session) => {
        if (!session?.user) return;

        const fetchProfileWithRetries = async (retries = 3, delay = 500) => {
          try {
            console.log(`Buscando perfil... Tentativas restantes: ${retries}`);

            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            // Se o erro for "nenhuma linha encontrada" e ainda houver tentativas, tenta de novo
            if (error && error.code === 'PGRST116' && retries > 0) {
              console.warn('Perfil ainda não encontrado. Tentando novamente em 500ms.');
              await new Promise(res => setTimeout(res, delay));
              return fetchProfileWithRetries(retries - 1, delay);
            }

            // Se for qualquer outro tipo de erro, lança para o catch
            if (error && error.code !== 'PGRST116') {
              throw error;
            }

            // Se encontrou, busca as propriedades
            const { data: propertiesData, error: propertiesError } = await supabase
              .from('user_properties')
              .select('*')
              .eq('user_id', session.user.id);
            
            if (propertiesError) throw propertiesError;

            // Atualiza o estado da aplicação
            get().setUserProfile(data, propertiesData || []);

          } catch (error) {
            console.error("Erro crítico ao buscar perfil do usuário:", error);
            // Desloga o usuário para evitar que ele fique em um estado inconsistente
            get().clearStore();
            supabase.auth.signOut();
          }
        };

        // Inicia a busca com a lógica de tentativas
        await fetchProfileWithRetries();
      },
      
      updateUserProfile: (updates) => {
        set(state => ({
            userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null
        }))
      },
=======
      isClient: false,

      setSession: (session) => set({ session }),

      // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
      setUserProfile: (profile, properties) => {
        const isClient = !!(properties && properties.length > 0);
        let selectedId = get().selectedLoteamentoId;
        if (isClient && properties[0]?.loteamento_id) {
          selectedId = properties[0].loteamento_id;
        }

        // Pega as conquistas que JÁ ESTÃO SALVAS no estado atual antes de qualquer mudança.
        const currentDisplayedAchievements = get().userProfile?.displayed_achievements || [];

        set({ 
          userProfile: profile ? { 
            ...profile, 
            properties,
            available_achievements: profile.available_achievements || ['Pioneiro', 'Explorador', 'Bom Vizinho', 'Visionário'],
            // Usa as conquistas que já estavam salvas, em vez de resetar para uma lista vazia.
            displayed_achievements: currentDisplayedAchievements,
          } : null,
          isClient,
          selectedLoteamentoId: selectedId,
        });
      },
      
      setSelectedLoteamentoId: (loteamentoId) => set({ selectedLoteamentoId: loteamentoId }),
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391

      setDisplayedAchievements: (achievements) => {
        set(state => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, displayed_achievements: achievements }
            : null,
        }));
      },

      getCurrentLoteamento: () => {
        const state = get();
        return LOTEAMENTOS_CONFIG[state.selectedLoteamentoId!];
      },

      getThemeColors: () => {
        const loteamento = get().getCurrentLoteamento();
<<<<<<< HEAD
        const defaultTheme = THEME_COLORS['dark_blue'];
        if (!loteamento || !THEME_COLORS[loteamento.color]) {
            return defaultTheme;
        }
        return THEME_COLORS[loteamento.color];
      },

      clearStore: () => set({ session: null, userProfile: null, _hasHydrated: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
=======
        const defaultTheme = {
            primary: '#4A90E2', accent: '#60A5FA', light: '#EFF6FF', gradient: ['#4A90E2', '#3B82F6']
        };
        if (!loteamento) return defaultTheme;

        const themes = {
          'orange': { primary: '#F97316', accent: '#FB923C', light: '#FFF7ED', gradient: ['#F97316', '#EA580C'] },
          'red': { primary: '#EF4444', accent: '#F87171', light: '#FEF2F2', gradient: ['#EF4444', '#DC2626'] },
          'green': { primary: '#22C55E', accent: '#4ADE80', light: '#F0FDF4', gradient: ['#22C55E', '#16A34A'] },
          'dark_blue': { primary: '#3B82F6', accent: '#60A5FA', light: '#EFF6FF', gradient: ['#3B82F6', '#2563EB'] },
          'light_blue': { primary: '#0EA5E9', accent: '#38BDF8', light: '#F0F9FF', gradient: ['#0EA5E9', '##0284C7'] },
        };
        return themes[loteamento.color] || defaultTheme;
      },

      clearStore: () => {
        set({ userProfile: null, isClient: false, session: null, selectedLoteamentoId: 'cidade_inteligente' });
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => AsyncStorage,
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
    }
  )
);