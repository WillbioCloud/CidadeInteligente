// src/hooks/useUserStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Loteamento, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';
import { THEME_COLORS } from '../styles/designSystem';

export interface UserProperty {
  id: string;
  loteamento_id: string;
  quadra?: string;
  lote?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  user_status?: 'client' | 'non_client';
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
  selectedLoteamentoId: string;
  _hasHydrated: boolean;

  // actions
  setHasHydrated: (state: boolean) => void;
  setSession: (session: any) => void;
  setUserProfile: (profile: Profile | null, properties?: UserProperty[]) => void;
  setSelectedLoteamentoId: (loteamentoId: string) => void;
  fetchUserProfile: (session: any) => Promise<void>;
  clearStore: () => void;
  updateUserProfile: (updates: Partial<Profile>) => void;
  setDisplayedAchievements: (achievements: string[]) => void;

  // selectors
  getCurrentLoteamento: () => Loteamento | undefined;
  getThemeColors: () => ThemeColors;

  isClient: boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      selectedLoteamentoId: 'cidade_inteligente',
      _hasHydrated: false,
      isClient: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setSession: (session) => set({ session }),

      setSelectedLoteamentoId: (loteamentoId) => set({ selectedLoteamentoId: loteamentoId }),

      setUserProfile: (profile, properties = []) => {
        const isClient = !!(properties && properties.length > 0);
        let selectedId = get().selectedLoteamentoId || 'cidade_inteligente';
        if (isClient && properties[0]?.loteamento_id) {
          selectedId = properties[0].loteamento_id;
        }

        const currentDisplayedAchievements = get().userProfile?.displayed_achievements || [];

        set({
          userProfile: profile
            ? {
                ...profile,
                properties,
                available_achievements:
                  profile.available_achievements || ['Pioneiro', 'Explorador', 'Bom Vizinho', 'Visionário'],
                displayed_achievements: currentDisplayedAchievements,
              }
            : null,
          isClient,
          selectedLoteamentoId: selectedId,
        });
      },

      fetchUserProfile: async (session) => {
        if (!session?.user) return;

        const fetchProfileWithRetries = async (retries = 3, delay = 500) => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error && retries > 0) {
              await new Promise((r) => setTimeout(r, delay));
              return fetchProfileWithRetries(retries - 1, delay);
            }

            if (error) throw error;

            const { data: propertiesData, error: propertiesError } = await supabase
              .from('user_properties')
              .select('*')
              .eq('user_id', session.user.id);

            if (propertiesError) throw propertiesError;

            get().setUserProfile(data as Profile, (propertiesData as UserProperty[]) || []);
          } catch (err) {
            console.error('Erro ao buscar perfil do usuário:', err);
            get().clearStore();
            try {
              await supabase.auth.signOut();
            } catch (_) {
              // ignore
            }
          }
        };

        await fetchProfileWithRetries();
      },

      updateUserProfile: (updates) => {
        set((state) => ({ userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null }));
      },

      setDisplayedAchievements: (achievements) => {
        set((state) => ({
          userProfile: state.userProfile ? { ...state.userProfile, displayed_achievements: achievements } : null,
        }));
      },

      getCurrentLoteamento: () => {
        const state = get();
        return LOTEAMENTOS_CONFIG[state.selectedLoteamentoId];
      },

      getThemeColors: () => {
        const loteamento = get().getCurrentLoteamento();
        const defaultTheme = THEME_COLORS['dark_blue'] || {
          primary: '#3B82F6',
          accent: '#60A5FA',
          light: '#EFF6FF',
          gradient: ['#3B82F6', '#2563EB'],
        };

        if (!loteamento || !THEME_COLORS[loteamento.color]) return defaultTheme;
        return THEME_COLORS[loteamento.color];
      },

      clearStore: () => set({ session: null, userProfile: null, _hasHydrated: true, isClient: false, selectedLoteamentoId: 'cidade_inteligente' }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

export default useUserStore;