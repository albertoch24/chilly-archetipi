import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { archetypeDetails } from '@/data/archetypeData';
import { 
  ArrowLeft, 
  Target, 
  MessageCircle, 
  AlertTriangle, 
  Building2,
  Heart,
  Home
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { BRAND_NAME } from '@/config/workshop';

export function ArchetypeDetailPage() {
  const { archetypeId } = useParams<{ archetypeId: string }>();
  const navigate = useNavigate();
  
  const archetype = archetypeId ? archetypeDetails[archetypeId] : null;
  
  if (!archetype) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="elevated" className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Archetipo non trovato</CardTitle>
            <CardDescription>L'archetipo richiesto non esiste.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="hero" onClick={() => navigate('/archetypes/archetype')}>
              Torna ai risultati
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div 
        className="py-12 md:py-20 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${archetype.color}40 0%, ${archetype.color}20 50%, hsl(var(--background)) 100%)` 
        }}
      >
        {/* Home link */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home workshop</span>
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-hero rounded-full px-3 py-1">
                <BrandMark className="text-lg" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Archetipi di marca · workshop {BRAND_NAME}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{archetype.emoji}</span>
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold">
                  {archetype.name}
                </h1>
                <p className="text-xl text-muted-foreground mt-1">
                  Emozione chiave: <span className="font-semibold text-foreground">{archetype.emotion}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Primary Goal */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Obiettivo primario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{archetype.primaryGoal}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Descrizione</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{archetype.description}</p>
            </CardContent>
          </Card>

          {/* Voice */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Tono di voce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {archetype.voice.map((v, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${archetype.color}30`,
                      color: 'hsl(var(--foreground))'
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pitfalls */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Punti di attenzione
              </CardTitle>
              <CardDescription>
                Rischi da evitare per questo archetipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {archetype.pitfalls.map((pitfall, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span className="text-muted-foreground">{pitfall}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Brand di esempio
              </CardTitle>
              <CardDescription>
                Brand che incarnano questo archetipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {archetype.examples.map((example, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-secondary rounded-lg font-medium"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emotion Card */}
          <Card 
            variant="elevated" 
            className="text-center"
            style={{ 
              background: `linear-gradient(135deg, ${archetype.color}20 0%, ${archetype.color}40 100%)` 
            }}
          >
            <CardContent className="py-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground mb-2">Emozione chiave</p>
              <p className="text-3xl font-heading font-bold">{archetype.emotion}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/archetypes/archetype')}
            >
              Torna al risultato
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
