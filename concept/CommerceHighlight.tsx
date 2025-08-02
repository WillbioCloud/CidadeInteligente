import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

interface CommerceItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
}

const featuredCommerces: CommerceItem[] = [
  {
    id: 1,
    name: "Padaria Villa Real",
    description: "Pães frescos, bolos artesanais e café da manhã completo",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop",
    category: "Alimentação",
    featured: true
  },
  {
    id: 2,
    name: "Farmácia Saúde+",
    description: "Medicamentos, perfumaria e cuidados com a saúde",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    category: "Saúde",
    featured: true
  },
  {
    id: 3,
    name: "Academia FitVille",
    description: "Equipamentos modernos, personal trainer e aulas",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    category: "Fitness",
    featured: true
  }
];

export function CommerceHighlight() {
  const { user } = useUser();
  
  const getHeaderText = () => {
    if (user?.userType === 'client') {
      return {
        title: `Comércios do ${user.loteamento}`,
        subtitle: `Descubra o melhor do seu loteamento`
      };
    }
    return {
      title: "Comércios em Destaque",
      subtitle: "Descubra todos os nossos empreendimentos"
    };
  };

  const headerText = getHeaderText();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{headerText.title}</h2>
          <p className="text-muted-foreground">{headerText.subtitle}</p>
        </div>
        <Link to="/comercios">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Ver todos
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {featuredCommerces.map((commerce) => (
          <Card 
            key={commerce.id}
            className="flex-shrink-0 w-80 overflow-hidden bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <img 
                src={commerce.image} 
                alt={commerce.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 bg-premium text-premium-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Destaque
              </div>
              <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-card-foreground px-2 py-1 rounded-full text-xs font-medium">
                {commerce.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{commerce.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{commerce.description}</p>
              
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Ver detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}