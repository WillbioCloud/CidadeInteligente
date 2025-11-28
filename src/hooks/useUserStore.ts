// src/hooks/useUserStore.ts (VERSÃO FINAL COM PERSISTÊNCIA DE CONQUISTAS)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';

export interface UserProperty {
  id: string;
  loteamento_id: string;
  quadra: string;
  lote: string;
}

export interface Profile {
  id: string;
  user_status: 'client' | 'non_client';
  full_name: string;
  email?: string;
  points?: number;
  level?: number;
  properties?: UserProperty[];
  available_achievements?: string[];
  displayed_achievements?: string[];
  avatar_url?: string; // Adicionado para a foto de perfil
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
  isClient: boolean;
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  setDisplayedAchievements: (achievements: string[]) => void;
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;
  clearStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      selectedLoteamentoId: 'cidade_inteligente',
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
    }
  )
);