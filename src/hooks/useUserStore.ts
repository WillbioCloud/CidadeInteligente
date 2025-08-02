// src/hooks/useUserStore.ts (VERSÃO FINAL COM CONTROLE DE HIDRATAÇÃO)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';
import { THEME_COLORS } from '../styles/designSystem';

export interface UserProperty {
  id: string;
  loteamento_id: string;
  quadra: string;
  lote: string;
}

export interface Profile {
  id: string;
  full_name: string;
  isClient?: boolean;
  avatar_url?: string;
  email?: string;
  points?: number;
  level?: number;
  properties?: UserProperty[];
  dependents?: any[];
  available_achievements?: string[];
  displayed_achievements?: string[];
  phone?: string;
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
  _hasHydrated: boolean; // Estado para controlar a hidratação
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  setHasHydrated: (state: boolean) => void;
  fetchUserProfile: (session: any) => Promise<void>;
  clearStore: () => void;
  // Adicionando as funções que faltavam na interface
  updateUserProfile: (updates: Partial<Profile>) => void;
  setDisplayedAchievements: (achievements: string[]) => void;
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      selectedLoteamentoId: 'cidade_inteligente',
      _hasHydrated: false, // Começa como falso

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

      fetchUserProfile: async (session) => {
        if (!session?.user) return;
        try {
          const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profileError) throw profileError;
          const { data: propertiesData, error: propertiesError } = await supabase.from('user_properties').select('*').eq('user_id', session.user.id);
          if (propertiesError) throw propertiesError;
          get().setUserProfile(profileData, propertiesData || []);
        } catch (error) {
          console.error("Erro ao buscar perfil completo:", error);
          get().clearStore();
          supabase.auth.signOut();
        }
      },
      
      updateUserProfile: (updates) => {
        set(state => ({
            userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null
        }))
      },

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
    }
  )
);