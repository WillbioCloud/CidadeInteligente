import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  has_completed_onboarding?: boolean;
  // Adicione outros campos conforme necessário baseados na sua tabela 'profiles'
}

interface UserState {
  session: Session | null;
  userProfile: UserProfile | null;
  _hasHydrated: boolean; // Controla se o Zustand já carregou do disco

  setSession: (session: Session | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setHasHydrated: (state: boolean) => void;
  
  fetchUserProfile: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  clearStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      session: null,
      userProfile: null,
      _hasHydrated: false,

      setSession: (session) => set({ session }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      fetchUserProfile: async (session) => {
        if (!session?.user) return;
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Erro ao buscar perfil:', error);
            // Em caso de erro (ex: perfil não existe), podemos tentar criar um básico ou apenas logar
            return;
          }

          if (data) {
            set({ userProfile: data });
          }
        } catch (e) {
          console.error('Exceção ao buscar perfil:', e);
        }
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, userProfile: null });
      },

      clearStore: () => set({ session: null, userProfile: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);