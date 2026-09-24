import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCopy, Braces, Home, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandMark } from '@/components/BrandMark';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { useQuiz } from '@/contexts/QuizContext';
import { useValuesData } from '@/hooks/useValuesData';
import { useToast } from '@/hooks/use-toast';
import { archetypeDetails, getArchetypePair, rankArchetypes } from '@/data/archetypeData';
import { includesValue } from '@/data/valuesData';
import { BRAND_NAME, WORKSHOP } from '@/config/workshop';

function ValueList({ values, empty }: { values: string[]; empty: string }) {
  if (values.length === 0) return <p className="text-sm text-muted-foreground italic">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {values.map((value) => (
        <li key={value} className="font-heading font-semibold text-lg leading-tight">
          {value}
        </li>
      ))}
    </ul>
  );
}

const QUADRANTS = [
  { title: 'Scommessa', text: 'Porta valori nuovi ma rischia di non risultare credibile', tone: 'bg-accent/10' },
  { title: 'Ideale', text: 'Credibile oggi e porta i valori che cerchiamo', tone: 'bg-success/15' },
  { title: 'Fuori target', text: 'Non conferma né fa crescere', tone: 'bg-muted' },
  { title: 'Conferma', text: "Rafforza l'esistente ma non fa crescere", tone: 'bg-primary/10' },
];

export function ValuesMapPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { flaggedAnswers, allResponses } = useQuiz();
  const { selection, currentVotes, targetVotes } = useValuesData({ live: true });
  const [fallbackText, setFallbackText] = useState('');
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  const ranking = rankArchetypes(flaggedAnswers, allResponses);
  const { primary, secondary } = getArchetypePair(ranking);
  const excluded = ranking
    .filter((s) => s.flagged === 0)
    .sort((a, b) => a.individual - b.individual)
    .slice(0, 3)
    .map((s) => archetypeDetails[s.archetype].name);

  const keep = selection.current.filter((value) => !includesValue(selection.strengthen, value));
  const hasMap = selection.current.length > 0;

  const briefText = [
    `Brief per lo scouting · Global Ambassador ${BRAND_NAME}`,
    WORKSHOP.date ? `Workshop del ${WORKSHOP.date}` : WORKSHOP.title,
    '',
    `Archetipo primario: ${primary ? `${primary.name} (${primary.primaryGoal})` : 'da definire'}`,
    `Archetipo secondario: ${secondary ? `${secondary.name} (${secondary.primaryGoal})` : 'nessuno'}`,
    `Archetipi esclusi: ${excluded.join(', ') || 'nessuno'}`,
    '',
    `Valori attuali da mantenere: ${keep.join(', ') || 'nessuno'}`,
    `Valori attuali da potenziare: ${selection.strengthen.join(', ') || 'nessuno'}`,
    `Valori nuovi da acquisire con l'Ambassador: ${selection.add.join(', ') || 'nessuno'}`,
    '',
    `Partecipanti: quiz ${allResponses.length}, valori attuali ${currentVotes.length}, valori obiettivo ${targetVotes.length}`,
  ].join('\n');

  const briefJson = JSON.stringify(
    {
      brand: BRAND_NAME,
      workshop: WORKSHOP.id,
      date: WORKSHOP.date || null,
      archetype: {
        primary: primary?.id ?? null,
        secondary: secondary?.id ?? null,
        excluded: ranking.filter((s) => s.flagged === 0).map((s) => s.archetype),
      },
      values: {
        current: selection.current,
        strengthen: selection.strengthen,
        add: selection.add,
      },
      participants: { quiz: allResponses.length, current: currentVotes.length, target: targetVotes.length },
    },
    null,
    2,
  );

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFallbackText('');
      toast({ title: 'Copiato', description: `${what} è negli appunti.` });
    } catch {
      // Appunti non disponibili: mostro il testo già selezionato da copiare a mano.
      setFallbackText(text);
      requestAnimationFrame(() => fallbackRef.current?.select());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      <div className="bg-hero relative overflow-hidden">
        <div className="brand-bubbles" aria-hidden="true" />
        <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home workshop</span>
          </Link>
          <div className="text-center mt-6">
            <BrandMark className="text-5xl" />
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mt-5 mb-4 text-balance">
              La mappa dei valori di {BRAND_NAME}
            </h1>
            <p className="text-primary-foreground/85 text-lg max-w-2xl mx-auto">
              {primary ? (
                <>
                  Archetipo {primary.name}
                  {secondary ? ` con ${secondary.name}` : ''} · da qui parte lo scouting del Global Ambassador
                </>
              ) : (
                'Da qui parte lo scouting del Global Ambassador'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 -mt-12 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {!hasMap ? (
            <Card variant="elevated">
              <CardContent className="p-8 text-center space-y-3">
                <p className="font-medium">La mappa si compone quando il facilitatore conferma i valori.</p>
                <Button variant="hero" onClick={() => navigate('/valori/facilitatore')}>
                  <ListChecks className="w-4 h-4" />
                  Vai alla dashboard valori
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 md:p-10">
                {/* Diagramma di Venn: oggi a sinistra, domani a destra, l'intersezione è ciò che potenziamo */}
                <div className="hidden md:block relative mx-auto w-full max-w-4xl aspect-[2/1]">
                  <div className="venn-circle venn-today" />
                  <div className="venn-circle venn-tomorrow" />
                  <p className="absolute top-[4%] left-[14%] text-xs uppercase tracking-wider font-semibold text-success">
                    {BRAND_NAME} oggi
                  </p>
                  <p className="absolute top-[4%] right-[14%] text-xs uppercase tracking-wider font-semibold text-primary text-right">
                    {BRAND_NAME} con l'Ambassador
                  </p>
                  <div className="absolute top-1/2 -translate-y-1/2 left-[13%] w-[24%]">
                    <p className="text-sm text-muted-foreground mb-2">Da mantenere</p>
                    <ValueList values={keep} empty="Tutti i valori attuali vanno potenziati" />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-[20%] text-center">
                    <p className="text-sm text-muted-foreground mb-2">Da potenziare</p>
                    <ValueList values={selection.strengthen} empty="Da decidere" />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-[13%] w-[24%] text-right">
                    <p className="text-sm text-muted-foreground mb-2">Da acquisire</p>
                    <ValueList values={selection.add} empty="Da decidere" />
                  </div>
                </div>

                {/* Su telefono: tre elenchi */}
                <div className="md:hidden space-y-4">
                  {[
                    { title: 'Da mantenere', values: keep, dot: 'bg-pop-mint' },
                    { title: 'Da potenziare', values: selection.strengthen, dot: 'bg-gradient-to-r from-pop-mint to-pop-pink' },
                    { title: 'Da acquisire', values: selection.add, dot: 'bg-pop-pink' },
                  ].map((group) => (
                    <div key={group.title} className="rounded-lg border border-border p-4">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className={`w-3 h-3 rounded-full ${group.dot}`} />
                        {group.title}
                      </p>
                      <ValueList values={group.values} empty="Da decidere" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Come la userà l'agente */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Dopo il workshop: la mappa di overlap dei candidati</CardTitle>
              <CardDescription>
                L'agente di scouting ricostruisce i valori di ogni candidato e lo colloca in base all'overlap con i valori
                attuali e con quelli obiettivo. A questo si aggiungono i KPI su mercati, brand già associati e rischio
                reputazionale, fino allo score finale.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <p className="text-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180 text-center self-center">
                  Overlap con i valori obiettivo →
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUADRANTS.map((q) => (
                    <div key={q.title} className={`rounded-lg p-4 ${q.tone}`}>
                      <p className="font-heading font-semibold">{q.title}</p>
                      <p className="text-sm text-muted-foreground">{q.text}</p>
                    </div>
                  ))}
                </div>
                <span />
                <p className="text-xs text-muted-foreground text-center">Overlap con i valori attuali →</p>
              </div>
            </CardContent>
          </Card>

          {/* Export per lo scouting */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Porta la mappa allo step successivo</CardTitle>
              <CardDescription>
                Il brief riassume archetipo e valori confermati: incollalo nel documento di lavoro o passalo all'agente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="whitespace-pre-wrap text-sm bg-secondary/50 rounded-lg p-4 overflow-x-auto">{briefText}</pre>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => copy(briefText, 'Il brief')}>
                  <ClipboardCopy className="w-4 h-4" />
                  Copia il brief
                </Button>
                <Button variant="outline" onClick={() => copy(briefJson, 'Il JSON')}>
                  <Braces className="w-4 h-4" />
                  Copia in JSON
                </Button>
              </div>
              {fallbackText && (
                <div>
                  <label htmlFor="copy-fallback" className="text-sm text-muted-foreground">
                    Gli appunti non sono disponibili: il testo è selezionato, copialo con Cmd+C o Ctrl+C.
                  </label>
                  <textarea
                    id="copy-fallback"
                    ref={fallbackRef}
                    readOnly
                    value={fallbackText}
                    className="mt-2 w-full h-40 rounded-lg border border-input bg-background p-3 text-sm font-mono"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
