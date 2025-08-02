import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Calendar } from "lucide-react";

const feedPosts = [
	{
		id: 1,
		type: "event",
		title: "Festival de Primavera no Villa Real",
		description:
			"Venha celebrar conosco com música, comida e diversão para toda família!",
		image:
			"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop",
		date: "15 de Outubro",
		likes: 45,
		comments: 12,
	},
	{
		id: 2,
		type: "news",
		title: "Nova Academia Inaugurada",
		description:
			"Equipamentos de última geração agora disponíveis para os moradores.",
		image:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
		date: "10 de Outubro",
		likes: 32,
		comments: 8,
	},
	{
		id: 3,
		type: "community",
		title: "Horta Comunitária em Crescimento",
		description:
			"Participe do projeto sustentável e cultive seus próprios alimentos.",
		image:
			"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
		date: "8 de Outubro",
		likes: 28,
		comments: 15,
	},
	{
		id: 4,
		type: "business",
		title: "Novo Café na Praça Central",
		description:
			"Café especial, doces artesanais e ambiente aconchegante te esperam.",
		image:
			"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop",
		date: "5 de Outubro",
		likes: 52,
		comments: 20,
	},
];

export function ContentFeed() {
	return (
		<section className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-2xl font-bold text-foreground">
						Novidades do Loteamento
					</h2>
					<p className="text-muted-foreground">
						Fique por dentro de tudo que acontece
					</p>
				</div>
			</div>

			<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
				{feedPosts.map((post) => (
					<Card
						key={post.id}
						className="flex-shrink-0 w-72 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 overflow-hidden"
					>
						<div className="relative">
							<img
								src={post.image}
								alt={post.title}
								className="w-full h-40 object-cover"
							/>
							<div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-card-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
								<Calendar size={12} />
								{post.date}
							</div>
						</div>

						<div className="p-4">
							<h3 className="font-semibold text-base mb-2 line-clamp-2">
								{post.title}
							</h3>
							<p className="text-muted-foreground text-sm mb-4 line-clamp-3">
								{post.description}
							</p>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4 text-muted-foreground">
									<Button
										variant="ghost"
										size="sm"
										className="p-0 h-auto"
									>
										<Heart size={16} className="mr-1" />
										<span className="text-xs">{post.likes}</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="p-0 h-auto"
									>
										<MessageCircle size={16} className="mr-1" />
										<span className="text-xs">{post.comments}</span>
									</Button>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="p-0 h-auto text-muted-foreground hover:text-primary"
								>
									<Share2 size={16} />
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</section>
	);
}

const focusedColor =
	label === "Gamificacao"
		? (theme?.primary ?? defaultTheme.primary)
		: designSystem.colors.primary.green;