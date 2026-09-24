import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { archetypeDetails } from '@/data/archetypeData';
import { ArrowLeft, Sparkles, Home } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { BRAND_NAME } from '@/config/workshop';

export function ArchetypesListPage() {
  const navigate = useNavigate();
  
  const archetypes = Object.values(archetypeDetails);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero py-12 relative">
        {/* Home link */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home workshop</span>
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          
          <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <BrandMark className="text-4xl" />
          </Link>
          
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            I 12 archetipi di marca
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Tutti gli archetipi con le loro caratteristiche: il riferimento per leggere il risultato di {BRAND_NAME}.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archetypes.map((archetype) => (
            <Card 
              key={archetype.id}
              variant="elevated"
              className="cursor-pointer hover:shadow-accent transition-all duration-300 group overflow-hidden"
              onClick={() => navigate(`/archetypes/${archetype.id}`)}
            >
              <div 
                className="h-2"
                style={{ backgroundColor: archetype.color }}
              />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{archetype.emoji}</span>
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {archetype.name}
                    </CardTitle>
                    <CardDescription>{archetype.emotion}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {archetype.primaryGoal}
                </p>
                <div className="flex flex-wrap gap-1 mt-4">
                  {archetype.voice.slice(0, 3).map((v, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ 
                        backgroundColor: `${archetype.color}30`,
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
