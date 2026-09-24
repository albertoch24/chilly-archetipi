import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuiz } from '@/contexts/QuizContext';
import { Users, BarChart3, Target, ArrowRight, Shield, Home } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { BRAND_NAME } from '@/config/workshop';

export function HomePage() {
  const { currentParticipant, setCurrentParticipant, setIsAdminMode, resetQuiz } = useQuiz();
  const [name, setName] = useState(currentParticipant ?? '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (name.trim().length < 2) {
      setError('Inserisci un nome valido (almeno 2 caratteri)');
      return;
    }
    setError('');
    resetQuiz();
    setCurrentParticipant(name.trim());
    setIsAdminMode(false);
    navigate('/archetypes/quiz');
  };

  const handleAdminAccess = () => {
    setIsAdminMode(true);
    navigate('/archetypes/results');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home workshop</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-hero relative overflow-hidden">
        <div className="brand-bubbles" aria-hidden="true" />

        <div className="container mx-auto px-4 pt-16 pb-24 md:pt-20 md:pb-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <BrandMark className="text-5xl md:text-6xl animate-fade-in" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              Esercizio 1 · Archetipo di marca
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mt-6 mb-6 text-balance animate-slide-up">
              Scopriamo l'archetipo di {BRAND_NAME}
            </h1>

            <p className="text-primary-foreground/85 text-lg md:text-xl md:mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Sedici domande, una risposta a testa, senza confrontarti con gli altri. Poi decidiamo insieme.
            </p>

            {/* Su telefono si va dritti al nome: i tre riquadri spingerebbero il campo sotto la piega */}
            <div className="hidden md:grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {[
                { icon: Target, label: '16 domande', desc: 'Circa 10 minuti' },
                { icon: Users, label: 'Collaborativo', desc: 'Risposte aggregate' },
                { icon: BarChart3, label: 'Statistiche', desc: 'Risultati in sala' },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                  <div className="text-left">
                    <div className="font-semibold text-primary-foreground">{feature.label}</div>
                    <div className="text-sm text-primary-foreground/75">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Name Entry Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-16">
        <Card variant="elevated" className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Inizia il quiz</CardTitle>
            <CardDescription>Inserisci il tuo nome: resterà lo stesso anche negli esercizi sui valori</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="participant-name" className="sr-only">
                Il tuo nome
              </label>
              <Input
                id="participant-name"
                type="text"
                placeholder="Il tuo nome..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleStartQuiz()}
                className="text-lg"
                autoComplete="given-name"
              />
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>

            <Button variant="hero" size="xl" className="w-full" onClick={handleStartQuiz}>
              Inizia il quiz
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>

        <div className="max-w-lg mx-auto mt-8 text-center">
          <Button variant="ghost" onClick={handleAdminAccess} className="text-muted-foreground hover:text-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Accesso facilitatore
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">Come funziona</h2>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Rispondi al quiz',
                  desc: `Completa le 16 domande scegliendo le risposte che meglio rappresentano ${BRAND_NAME}.`,
                },
                {
                  title: 'Discussione collettiva',
                  desc: 'Analizziamo insieme le risposte aggregate e per ogni domanda il gruppo sceglie la sua.',
                },
                {
                  title: 'Archetipo di marca',
                  desc: 'Dalle scelte del gruppo emergono archetipo primario e secondario, la base per i valori.',
                },
              ].map((item, i) => (
                <li key={item.title}>
                  <Card variant="elevated" className="relative overflow-hidden h-full">
                    <CardHeader>
                      <span className="absolute top-4 right-4 text-6xl font-bold text-primary/10 font-heading" aria-hidden="true">
                        {i + 1}
                      </span>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
