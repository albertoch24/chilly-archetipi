import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  Compass,
  Gem,
  ListChecks,
  Map as MapIcon,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { BRAND_NAME, WORKSHOP } from '@/config/workshop';

const EXERCISES = [
  {
    step: 'Esercizio 1',
    title: 'Archetipo di marca',
    description:
      'Sedici domande a testa, poi la lettura collettiva: il gruppo sceglie una risposta per domanda e ne emergono archetipo primario e secondario.',
    icon: Compass,
    meta: ['16 domande', 'Voto individuale, scelta di gruppo'],
    to: '/archetypes',
    cta: 'Inizia il quiz',
  },
  {
    step: 'Esercizio 2',
    title: 'Valori attuali',
    description: `Quali valori definiscono oggi l'universo di significato di ${BRAND_NAME}? Ognuno ne sceglie fino a cinque, il gruppo ne conferma da tre a cinque.`,
    icon: Gem,
    meta: ['Fino a 5 valori', 'Parte dall\'archetipo'],
    to: '/valori/attuali',
    cta: 'Scegli i valori di oggi',
  },
  {
    step: 'Esercizio 3',
    title: 'Valori obiettivo',
    description:
      "Quali valori di oggi potenziare e quali valori nuovi acquisire attraverso l'associazione con il Global Ambassador.",
    icon: TrendingUp,
    meta: ['2 da potenziare', '3 da acquisire'],
    to: '/valori/obiettivo',
    cta: 'Scegli i valori obiettivo',
  },
];

const FACILITATOR_LINKS = [
  { label: 'Dashboard quiz', description: 'Risultati per domanda e scelta del gruppo', to: '/archetypes/results', icon: BarChart3 },
  { label: 'Archetipo', description: 'Primario, secondario ed esclusi', to: '/archetypes/archetype', icon: Trophy },
  { label: 'Dashboard valori', description: 'Voti degli esercizi 2 e 3, conferme', to: '/valori/facilitatore', icon: ListChecks },
  { label: 'Mappa dei valori', description: 'Oggi, da potenziare, da acquisire', to: '/valori/mappa', icon: MapIcon },
];

const JOURNEY = [
  { title: 'Archetipo', when: 'oggi' },
  { title: 'Valori attuali', when: 'oggi' },
  { title: 'Valori obiettivo', when: 'oggi' },
  { title: 'Scouting dei candidati', when: 'dopo' },
  { title: 'Mappa di overlap dei valori', when: 'dopo' },
  { title: 'KPI: mercati, brand, rischi', when: 'dopo' },
  { title: 'Score finale', when: 'dopo' },
];

export function WorkshopLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      {/* Hero */}
      <div className="bg-hero relative overflow-hidden">
        <div className="brand-bubbles" aria-hidden="true" />
        <div className="container mx-auto px-4 pt-14 pb-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <BrandMark className="text-6xl md:text-7xl animate-fade-in" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              {WORKSHOP.title}
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mt-6 mb-5 text-balance animate-slide-up !leading-[1.4]">
              Chi è {BRAND_NAME}, prima di scegliere <span className="hl-pill">chi la rappresenta</span>
            </h1>

            <p className="text-primary-foreground/85 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Tre esercizi per definire insieme archetipo, valori attuali e valori obiettivo: la base su cui cercare il
              Global Ambassador.
            </p>

            <div
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 bg-primary-foreground/15 rounded-xl px-5 py-3 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              {WORKSHOP.date && (
                <>
                  <div className="flex items-center gap-2 text-primary-foreground">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">{WORKSHOP.date}</span>
                  </div>
                  <div className="h-6 w-px bg-primary-foreground/30 hidden sm:block" />
                </>
              )}
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Clock className="w-4 h-4" />
                <span>{WORKSHOP.duration} · team Marketing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Esercizi */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {EXERCISES.map((exercise) => (
            <Card key={exercise.step} variant="elevated" className="relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent-gradient" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-primary border-primary/40">
                    {exercise.step}
                  </Badge>
                  <exercise.icon className="h-7 w-7 text-primary/40" />
                </div>
                <CardTitle className="text-2xl">{exercise.title}</CardTitle>
                <CardDescription className="text-base">{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {exercise.meta.map((item) => (
                    <span key={item} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={() => navigate(exercise.to)}>
                  {exercise.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Il percorso */}
      <div className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">Il percorso verso il Global Ambassador</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Oggi definiamo i primi tre passi. Dopo il workshop un agente di scouting userà la mappa dei valori per
              valutare i candidati e calcolare uno score finale.
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {JOURNEY.map((item, index) => (
                <li
                  key={item.title}
                  className={
                    item.when === 'oggi'
                      ? 'rounded-xl p-4 bg-card border-2 border-primary/40 shadow-soft'
                      : 'rounded-xl p-4 bg-background/60 border border-dashed border-border'
                  }
                >
                  <span
                    className={
                      item.when === 'oggi'
                        ? 'inline-flex w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold items-center justify-center'
                        : 'inline-flex w-7 h-7 rounded-full bg-muted text-muted-foreground text-sm font-bold items-center justify-center'
                    }
                  >
                    {index + 1}
                  </span>
                  <p className="font-medium mt-3 leading-snug">{item.title}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    {item.when === 'oggi' ? 'Workshop' : 'Dopo il workshop'}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Area facilitatore */}
      <div className="container mx-auto px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-xl font-bold mb-1">Area facilitatore</h2>
          <p className="text-muted-foreground mb-6">Da aprire sul proiettore, non sui telefoni dei partecipanti.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACILITATOR_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <link.icon className="w-5 h-5 text-primary mb-3" />
                <p className="font-semibold group-hover:text-primary transition-colors">{link.label}</p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {WORKSHOP.title} · {BRAND_NAME}
            {WORKSHOP.date ? ` · ${WORKSHOP.date}` : ''} · strumento di lavoro interno
          </p>
        </div>
      </footer>
    </div>
  );
}
