import { Header } from "@/components/layout/Header";
import { CommerceHighlight } from "@/components/sections/CommerceHighlight";
import { ResidentFeatures } from "@/components/sections/ResidentFeatures";
import { DevelopmentsDropdown } from "@/components/sections/DevelopmentsDropdown";
import { ContentFeed } from "@/components/sections/ContentFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 px-4 pt-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          <CommerceHighlight />
          <ResidentFeatures />
          <DevelopmentsDropdown />
          <ContentFeed />
        </div>
      </main>
    </div>
  );
}