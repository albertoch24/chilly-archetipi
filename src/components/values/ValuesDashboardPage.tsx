import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle, Home, Map as MapIcon, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandMark } from '@/components/BrandMark';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { useQuiz } from '@/contexts/QuizContext';
import { useValuesData } from '@/hooks/useValuesData';
import { useToast } from '@/hooks/use-toast';
import { ValueSelection, ValueVote } from '@/lib/workshopStore';
import { archetypeDetails, getArchetypePair, rankArchetypes } from '@/data/archetypeData';
import { CONFIRM_LIMITS, DECLARED_VALUES, ValueTally, includesValue, isDeclaredValue, tallyValues, valueKey } from '@/data/valuesData';
import { cn } from '@/lib/utils';
import { BRAND_NAME } from '@/config/workshop';

type SelectionList = keyof ValueSelection;

interface TallyListProps {
  tallies: ValueTally[];
  voters: number;
  confirmed: string[];
  limit: number;
  onToggle: (label: string) => void;
  emptyText: string;
}

function TallyList({ tallies, voters, confirmed, limit, onToggle, emptyText }: TallyListProps) {
  if (tallies.length === 0) {
    return <p className="text-muted-foreground text-sm py-6 text-center">{emptyText}</p>;
  }
  const isFull = confirmed.length >= limit;
  return (
    <ul className="space-y-3">
      {tallies.map((tally) => {
        const isConfirmed = includesValue(confirmed, tally.label);
        const share = voters > 0 ? Math.round((tally.votes / voters) * 100) : 0;
        const archetype = tally.archetype ? archetypeDetails[tally.archetype] : null;
        return (
          <li
            key={tally.key}
            className={cn(
              'rounded-lg border-2 p-3 md:p-4 transition-colors',
              isConfirmed ? 'border-success bg-success/5' : 'border-border bg-card',
            )}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="min-w-0 flex flex-wrap items-center gap-2">
                <span className="font-medium">{tally.label}</span>
                {tally.custom && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">proposto</span>
                )}
                {tally.declared && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-foreground" title={`Dichiarato da ${BRAND_NAME}`}>
                    dichiarato
                  </span>
                )}
                {archetype && (
                  <span className="text-xs text-muted-foreground">
                    <span aria-hidden="true">{archetype.emoji}</span> {archetype.name.split(' ')[0]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm tabular-nums">
                  <strong>{tally.votes}</strong> <span className="text-muted-foreground">({share}%)</span>
                </span>
                <Button
                  size="sm"
                  variant={isConfirmed ? 'flag' : 'outline'}
                  onClick={() => onToggle(tally.label)}
                  disabled={!isConfirmed && isFull}
                  aria-pressed={isConfirmed}
                >
                  {isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  {isConfirmed ? 'Confermato' : 'Conferma'}
                </Button>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', isConfirmed ? 'bg-success' : 'bg-accent-gradient')}
                style={{ width: `${share}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function VotersLine({ votes }: { votes: ValueVote[] }) {
  if (votes.length === 0) return null;
  return (
    <p className="text-sm text-muted-foreground">
      Hanno votato: {votes.map((v) => v.participantName).sort((a, b) => a.localeCompare(b, 'it')).join(', ')}
    </p>
  );
}

export function ValuesDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { flaggedAnswers, allResponses } = useQuiz();
  const { currentVotes, targetVotes, selection, saveSelection, refresh, isLoading } = useValuesData({ live: true });
  const [tab, setTab] = useState('current');

  const { primary, secondary } = getArchetypePair(rankArchetypes(flaggedAnswers, allResponses));

  const currentTally = tallyValues(currentVotes.map((v) => v.picks.values ?? []));
  // Tutti i valori attuali confermati compaiono tra quelli da potenziare, anche senza voti.
  const strengthenVotes = tallyValues(targetVotes.map((v) => v.picks.strengthen ?? []));
  const strengthenTally: ValueTally[] = selection.current
    .map(
      (label) =>
        strengthenVotes.find((t) => t.key === valueKey(label)) ?? {
          key: valueKey(label),
          label,
          votes: 0,
          custom: false,
          declared: isDeclaredValue(label),
        },
    )
    .sort((a, b) => b.votes - a.votes);
  const addTally = tallyValues(targetVotes.map((v) => v.picks.add ?? []));
  // Dichiarati da Chilly ma scelti da nessuno: lo spunto più utile per la discussione.
  const declaredNotChosen =
    currentVotes.length > 0 ? DECLARED_VALUES.filter((label) => !currentTally.some((t) => t.key === valueKey(label))) : [];

  const toggle = (list: SelectionList, label: string) => {
    const items = selection[list];
    const exists = includesValue(items, label);
    if (!exists && items.length >= CONFIRM_LIMITS[list]) {
      toast({ title: 'Limite raggiunto', description: `Puoi confermare al massimo ${CONFIRM_LIMITS[list]} valori qui.` });
      return;
    }
    const next: ValueSelection = {
      ...selection,
      [list]: exists ? items.filter((v) => valueKey(v) !== valueKey(label)) : [...items, label],
    };
    // Un valore tolto dagli attuali non può restare tra quelli da potenziare.
    if (list === 'current' && exists) {
      next.strengthen = selection.strengthen.filter((v) => valueKey(v) !== valueKey(label));
    }
    saveSelection(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      <div className="bg-hero py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-primary-foreground/10"
                title="Home workshop"
              >
                <Home className="w-5 h-5" />
              </Button>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <BrandMark className="text-3xl" />
              </Link>
              <div>
                <p className="text-sm text-primary-foreground/75">Dashboard facilitatore</p>
                <p className="font-semibold font-heading">Esercizi 2 e 3 · Valori</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
                Aggiorna
              </Button>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/75">Voti esercizio 2 · 3</p>
                <p className="font-semibold flex items-center gap-2 justify-end tabular-nums">
                  <Users className="w-4 h-4" />
                  {currentVotes.length} · {targetVotes.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {primary && (
            <p className="text-muted-foreground">
              Archetipo del gruppo:{' '}
              <strong className="text-foreground">
                {primary.emoji} {primary.name}
              </strong>
              {secondary && (
                <>
                  {' '}
                  con{' '}
                  <strong className="text-foreground">
                    {secondary.emoji} {secondary.name}
                  </strong>
                </>
              )}
            </p>
          )}

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger value="current" className="py-2">
                Esercizio 2 · Valori attuali
              </TabsTrigger>
              <TabsTrigger value="target" className="py-2">
                Esercizio 3 · Valori obiettivo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4 mt-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>L'universo di significato di oggi</CardTitle>
                  <CardDescription>
                    Conferma da 3 a {CONFIRM_LIMITS.current} valori dopo la discussione: saranno la base dell'esercizio 3.
                    Confermati: <span className="tabular-nums">{selection.current.length}</span> di {CONFIRM_LIMITS.current}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TallyList
                    tallies={currentTally}
                    voters={currentVotes.length}
                    confirmed={selection.current}
                    limit={CONFIRM_LIMITS.current}
                    onToggle={(label) => toggle('current', label)}
                    emptyText="Ancora nessun voto. La pagina si aggiorna da sola."
                  />
                  {declaredNotChosen.length > 0 && (
                    <p className="text-sm rounded-lg bg-secondary/70 text-secondary-foreground px-4 py-3">
                      <strong>Dichiarati da {BRAND_NAME} ma scelti da nessuno:</strong> {declaredNotChosen.join(', ')}. Valori
                      vissuti o solo dichiarati?
                    </p>
                  )}
                  <VotersLine votes={currentVotes} />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button variant="hero" onClick={() => setTab('target')} disabled={selection.current.length === 0}>
                  Passa all'esercizio 3
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="target" className="space-y-4 mt-6">
              {selection.current.length === 0 ? (
                <Card variant="elevated">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Conferma prima i valori attuali nell'esercizio 2: i partecipanti li vedranno come valori da potenziare.
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Da potenziare</CardTitle>
                      <CardDescription>
                        Valori di oggi che l'Ambassador deve rafforzare. Confermati:{' '}
                        <span className="tabular-nums">{selection.strengthen.length}</span> di {CONFIRM_LIMITS.strengthen}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TallyList
                        tallies={strengthenTally}
                        voters={targetVotes.length}
                        confirmed={selection.strengthen}
                        limit={CONFIRM_LIMITS.strengthen}
                        onToggle={(label) => toggle('strengthen', label)}
                        emptyText="Ancora nessun voto."
                      />
                    </CardContent>
                  </Card>
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Da acquisire</CardTitle>
                      <CardDescription>
                        Valori nuovi che {BRAND_NAME} vuole conquistare attraverso l'associazione. Confermati:{' '}
                        <span className="tabular-nums">{selection.add.length}</span> di {CONFIRM_LIMITS.add}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <TallyList
                        tallies={addTally}
                        voters={targetVotes.length}
                        confirmed={selection.add}
                        limit={CONFIRM_LIMITS.add}
                        onToggle={(label) => toggle('add', label)}
                        emptyText="Ancora nessun voto. La pagina si aggiorna da sola."
                      />
                      <VotersLine votes={targetVotes} />
                    </CardContent>
                  </Card>
                  <div className="flex justify-end">
                    <Button variant="hero" onClick={() => navigate('/valori/mappa')}>
                      <MapIcon className="w-4 h-4" />
                      Apri la mappa dei valori
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
