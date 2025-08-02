import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Search, Phone, Instagram, MapPin } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

interface Commerce {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  phone: string;
  instagram: string;
  featured?: boolean;
  loteamento?: string;
  cidade: string;
}

const commerces: Commerce[] = [
  {
    id: 1,
    name: "Padaria Villa Real",
    description: "Pães frescos, bolos artesanais e café da manhã completo para toda família",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop",
    category: "Alimentação",
    rating: 4.8,
    phone: "(62) 99999-0001",
    instagram: "@padariavilla",
    featured: true,
    loteamento: "Cidade Inteligente",
    cidade: "Santo Antônio do Descoberto - GO"
  },
  {
    id: 2,
    name: "Farmácia Saúde+",
    description: "Medicamentos, perfumaria e cuidados com a saúde. Atendimento especializado.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    category: "Saúde",
    rating: 4.6,
    phone: "(62) 99999-0002",
    instagram: "@farmaciasaude",
    featured: true,
    loteamento: "Cidade Inteligente",
    cidade: "Santo Antônio do Descoberto - GO"
  },
  {
    id: 3,
    name: "Academia FitVille",
    description: "Equipamentos modernos, personal trainer e aulas em grupo para todos os níveis",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    category: "Fitness",
    rating: 4.9,
    phone: "(62) 99999-0003",
    instagram: "@academiafitville",
    featured: true,
    loteamento: "Cidade Verde",
    cidade: "Caldas Novas - GO"
  },
  {
    id: 4,
    name: "Salão Beleza & Estilo",
    description: "Cortes modernos, coloração e tratamentos estéticos com profissionais qualificados",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=250&fit=crop",
    category: "Serviços",
    rating: 4.7,
    phone: "(62) 99999-0004",
    instagram: "@belezaestilo",
    cidade: "Caldas Novas - GO"
  },
  {
    id: 5,
    name: "Mercadinho Central",
    description: "Produtos frescos, mercearia completa e hortifrúti selecionado diariamente",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    category: "Varejo",
    rating: 4.5,
    phone: "(62) 99999-0005",
    instagram: "@mercadinhocentral",
    loteamento: "Lago Sul",
    cidade: "Caldas Novas - GO"
  },
  {
    id: 6,
    name: "Pizzaria Napoli",
    description: "Pizzas artesanais, massas frescas e ambiente aconchegante para toda família",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop",
    category: "Alimentação",
    rating: 4.8,
    phone: "(62) 99999-0006",
    instagram: "@pizzarianapoli",
    cidade: "Santo Antônio do Descoberto - GO"
  }
];

export default function Comercios() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Alimentação", "Saúde", "Fitness", "Serviços", "Varejo"];

  const getFilteredCommerces = () => {
    let filteredByUser = commerces;
    
    // Se for cliente, mostrar comércios do loteamento + cidade
    if (user?.userType === 'client') {
      filteredByUser = commerces.filter(commerce => 
        commerce.loteamento === user.loteamento || 
        (commerce.cidade === user.cidade && !commerce.loteamento)
      );
    }
    // Se for visitante, mostrar todos

    return filteredByUser.filter(commerce => {
      const matchesSearch = commerce.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           commerce.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || commerce.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredCommerces = getFilteredCommerces();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user?.userType === 'client' 
              ? `Comércios - ${user.loteamento}` 
              : 'Comércios Locais'
            }
          </h1>
          <p className="text-muted-foreground">
            {user?.userType === 'client' 
              ? `Estabelecimentos do seu loteamento e região` 
              : 'Descubra os melhores estabelecimentos da região'
            }
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar comércios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommerces.map((commerce) => (
            <Card 
              key={commerce.id}
              className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src={commerce.image} 
                  alt={commerce.name}
                  className="w-full h-48 object-cover"
                />
                {commerce.featured && (
                  <div className="absolute top-3 right-3 bg-premium text-premium-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Destaque
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-card-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {commerce.category}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {commerce.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{commerce.rating}</span>
                  <Badge variant="secondary" className="text-xs">{commerce.category}</Badge>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" />
                  <span>{commerce.loteamento || commerce.cidade}</span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {commerce.description}
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Instagram className="h-3 w-3 mr-1" />
                    Instagram
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCommerces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum comércio encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}