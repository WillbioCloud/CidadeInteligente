import { NavigatorScreenParams } from '@react-navigation/native';

// --- Auth Navigator ---
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// --- Home Stack (dentro da aba Home) ---
export type HomeStackParamList = {
  HomeTab: undefined;
  CourtScheduling: undefined;
  CourtBookingDetail: { bookingId: string } | undefined;
  MyBookings: undefined;
  CommerceDetail: { commerceId: string; commerceName?: string }; // Exemplo de parametros
  Placeholder: { title: string };
  Health: undefined;
  Empreendimentos: undefined;
  LoteamentoMedia: { loteamentoId?: string } | undefined;
  OperatingHours: undefined;
  More: undefined;
  Mapa: undefined;
  Transport: undefined;
  Achievements: undefined;
};

// --- Comercios Stack ---
export type ComerciosStackParamList = {
  ComerciosTab: undefined;
  CommerceDetail: { commerceId: string; commerceName?: string };
};

// --- Gamificação Stack ---
export type GamificationStackParamList = {
  GamificacaoTab: undefined;
  Achievements: undefined;
  Placeholder: { title: string };
};

// --- Profile Stack ---
export type ProfileStackParamList = {
  ProfileTab: undefined;
  EditProfile: undefined;
  Achievements: undefined;
  Settings: undefined;
  Support: undefined;
  PrivacyPolicy: undefined;
  Placeholder: { title: string };
};

// --- Feed Stack ---
export type FeedStackParamList = {
  FeedList: undefined;
  PostDetail: { postId: string };
};

// --- More Stack ---
export type MoreStackParamList = {
  Menu: undefined;
  Placeholder: { title: string };
  Achievements: undefined;
};

// --- Main Tab Navigator (O principal) ---
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Comercios: NavigatorScreenParams<ComerciosStackParamList>;
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Gamificacao: NavigatorScreenParams<GamificationStackParamList>;
  Conta: NavigatorScreenParams<ProfileStackParamList>;
};

// --- Root Navigator (Se tiveres um Root que engloba tudo, opcional mas bom ter) ---
// Normalmente o AppRouter decide entre Auth e Main, então não há um "Root" de navegação único,
// mas tipamos as props globalmente se necessário.

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList, MainTabParamList {}
  }
}