// Define a "forma" dos dados de um loteamento
export interface Loteamento {
  id: string;
  name: string;
  city: string;
  logo: any; // Em React Native, 'any' é ideal para o require() de imagens
  color: 'red' | 'green' | 'light_blue' | 'dark_blue' | 'orange';
  hasTransport?: boolean;
}

// Interface para um loteamento que o usuário possui (com dados de quadra/lote)
export interface UserLoteamento extends Loteamento {
  quadra: string;
  lote: string;
  tamanho?: string;
}

// Array com todos os loteamentos disponíveis para o seletor
export const ALL_LOTEAMENTOS: Loteamento[] = [
    { 
      id: 'cidade_inteligente', 
      name: 'Cidade Inteligente', 
      city: 'Santo Antônio do Descoberto - GO', 
      logo: require('../assets/logos/LOGO-CIDADE-INTELIGENTE.webp'), // Usando require
      color: 'orange', 
      hasTransport: true 
    },
    { 
      id: 'cidade_das_flores', 
      name: 'Cidade das Flores', 
      city: 'Caldas Novas - GO', 
      logo: require('../assets/logos/LOGO-CIDADE-DAS-FLORES.webp'), // Usando require
      color: 'red' 
    },
    { 
      id: 'cidade_verde', 
      name: 'Cidade Verde', 
      city: 'Caldas Novas - GO', 
      logo: require('../assets/logos/LOGO-CIDADE-VERDE.webp'), // Usando require
      color: 'green' 
    },
    { 
      id: 'lago_sul', 
      name: 'Setor Lago Sul', 
      city: 'Caldas Novas - GO', 
      logo: require('../assets/logos/LOGO-LAGO-SUL.webp'), // Usando require
      color: 'dark_blue' 
    },
    { 
      id: 'cidade_universitaria', 
      name: 'Cidade Universitária', 
      city: 'Cidade Exemplo - GO', 
      // Adicione um logo placeholder se não tiver o arquivo ainda
      logo: require('../assets/logos/LOGO-CIDADE-UNIVERSITARIA.webp'), // Usando require
      color: 'light_blue' 
    },
];

// Objeto para fácil acesso aos dados de um loteamento pela sua ID
export const LOTEAMENTOS_CONFIG: { [key: string]: Loteamento } = ALL_LOTEAMENTOS.reduce((acc, loteamento) => {
    acc[loteamento.id] = loteamento;
    return acc;
}, {});