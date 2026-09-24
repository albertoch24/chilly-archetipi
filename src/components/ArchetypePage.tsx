import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '@/contexts/QuizContext';
import { workshopStore } from '@/lib/workshopStore';
import { archetypeDetails, answerArchetypeMapping, rankArchetypes, getArchetypePair } from '@/data/archetypeData';
import { Home, Trophy, Sparkles, CheckCircle2, RefreshCw, ExternalLink, BarChart3, ArrowRight, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { BRAND_NAME } from '@/config/workshop';

// Sotto questa soglia di scelte il risultato è troppo fragile per essere mostrato come archetipo.
const MIN_FLAGGED_FOR_RESULT = 8;

export function ArchetypePage() {
  const navigate = useNavigate();
  const { questions, flaggedAnswers, allResponses, refreshResponses } = useQuiz();

  useEffect(() => {
    refreshResponses();
    return workshopStore.subscribe(refreshResponses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flaggedCount = Object.keys(flaggedAnswers).length;
  const ranking = rankArchetypes(flaggedAnswers, allResponses);
  const { primary, secondary } = getArchetypePair(ranking);
  const showResult = primary !== null && flaggedCount >= MIN_FLAGGED_FOR_RESULT;
  const excluded = ranking
    .filter((score) => score.flagged === 0)
    .sort((a, b) => a.individual - b.individual)
    .slice(0, 3)
    .map((score) => archetypeDetails[score.archetype]);
  const maxShare = Math.max(1, ...ranking.map((s) => Math.max(s.percentage, s.individualPercentage)));

  const getFlaggedAnswerInfo = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    const flaggedOptionId = flaggedAnswers[questionId];
    if (!question || !flaggedOptionId) return null;
    const option = question.options.find((o) => o.id === flaggedOptionId);
    const archetypeId = answerArchetypeMapping[flaggedOptionId];
    return {
      text: option?.text || null,
      archetype: archetypeId ? archetypeDetails[archetypeId] : null,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      {/* Hero Header */}
      <div className="bg-hero relative overflow-hidden">
        <div className="brand-bubbles" aria-hidden="true" />
        <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Home workshop</span>
          </Link>

          <div className="text-center mt-6">
            <div>
              <BrandMark className="text-5xl" />
            </div>
            <div className="mt-5 inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Risultato dell'esercizio 1
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mt-5 mb-4 text-balance">
              L'archetipo di {BRAND_NAME}
            </h1>
            <p className="text-primary-foreground/85 text-lg max-w-2xl mx-auto tabular-nums">
              {allResponses.length} partecipant{allResponses.length === 1 ? 'e' : 'i'} · {flaggedCount} scelte del gruppo su{' '}
              {questions.length}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-10 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Primario e secondario */}
          {showResult && primary ? (
            <div className="grid md:grid-cols-5 gap-4">
              <Card
                variant="elevated"
                className="md:col-span-3 overflow-hidden cursor-pointer hover:shadow-accent transition-all"
                onClick={() => navigate(`/archetypes/${primary.id}`)}
              >
                <div className="h-2" style={{ backgroundColor: primary.color }} />
                <CardContent className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Archetipo primario</p>
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-4xl flex-shrink-0"
                      style={{ backgroundColor: `${primary.color}30` }}
                      aria-hidden="true"
                    >
                      {primary.emoji}
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold">{primary.name}</h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{primary.primaryGoal}</p>
                  <div className="flex flex-wrap gap-2">
                    {primary.voice.map((v) => (
                      <span key={v} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${primary.color}30` }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card
                variant="elevated"
                className={cn('md:col-span-2 overflow-hidden', secondary && 'cursor-pointer hover:shadow-accent transition-all')}
                onClick={() => secondary && navigate(`/archetypes/${secondary.id}`)}
              >
                <div className="h-2" style={{ backgroundColor: secondary?.color ?? 'hsl(var(--muted))' }} />
                <CardContent className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Archetipo secondario</p>
                  {secondary ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl" aria-hidden="true">
                          {secondary.emoji}
                        </span>
                        <h2 className="font-heading text-2xl font-bold">{secondary.name}</h2>
                      </div>
                      <p className="text-muted-foreground">{secondary.primaryGoal}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Le scelte del gruppo puntano a un solo archetipo.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <p className="font-medium">Servono almeno {MIN_FLAGGED_FOR_RESULT} scelte del gruppo per leggere l'archetipo.</p>
                <p className="text-muted-foreground text-sm mt-1">Adesso sono {flaggedCount}: continua dalla dashboard del quiz.</p>
                <Button variant="hero" className="mt-4" onClick={() => navigate('/archetypes/results')}>
                  Vai alla dashboard del quiz
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Distribuzione: gruppo vs individuale */}
          {flaggedCount > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Scelte del gruppo e risposte individuali
                </CardTitle>
                <CardDescription>
                  Quota di risposte che punta a ciascun archetipo. La distanza tra le due barre dice dove la discussione ha
                  spostato il gruppo.
                </CardDescription>
                <div className="flex flex-wrap gap-4 pt-2 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-primary" /> Gruppo
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-muted-foreground/40" /> Individuale
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ranking
                  .filter((s) => s.flagged > 0 || s.individual > 0)
                  .map((score) => {
                    const archetype = archetypeDetails[score.archetype];
                    return (
                      <button
                        key={score.archetype}
                        className="block w-full text-left rounded-lg p-2 -mx-2 hover:bg-accent/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => navigate(`/archetypes/${score.archetype}`)}
                      >
                        <div className="flex items-center justify-between mb-1.5 gap-3">
                          <span className="font-medium">
                            <span aria-hidden="true">{archetype.emoji}</span> {archetype.name}
                          </span>
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {score.percentage}% · {score.individualPercentage}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${(score.percentage / maxShare) * 100}%` }} />
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-muted-foreground/40"
                              style={{ width: `${(score.individualPercentage / maxShare) * 100}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </CardContent>
            </Card>
          )}

          {/* Cosa Chilly non è */}
          {showResult && excluded.length > 0 && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="w-5 h-5 text-muted-foreground" />
                  Cosa {BRAND_NAME} non è
                </CardTitle>
                <CardDescription>
                  Archetipi mai scelti dal gruppo e meno votati individualmente: un buon perimetro anche per l'Ambassador.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-3">
                {excluded.map((archetype) => (
                  <div key={archetype.id} className="rounded-lg border border-dashed border-border p-4">
                    <p className="font-medium">
                      <span aria-hidden="true">{archetype.emoji}</span> {archetype.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{archetype.primaryGoal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Verso l'esercizio 2 */}
          {showResult && (
            <Card variant="hero" className="relative overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <p className="text-sm text-primary-foreground/80">Prossimo passo · Esercizio 2</p>
                  <p className="font-heading text-2xl font-bold">
                    Quali valori definiscono oggi l'universo di significato di {BRAND_NAME}?
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 flex-shrink-0"
                  onClick={() => navigate('/valori/facilitatore')}
                >
                  Apri la dashboard valori
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Riepilogo delle scelte */}
          <Card variant="elevated" className="overflow-hidden">
            <div className="bg-primary/5 border-b border-primary/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold">Le scelte del gruppo</h2>
                  <p className="text-muted-foreground">Una risposta per domanda, decisa in sala</p>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {questions.map((question, index) => {
                  const answerInfo = getFlaggedAnswerInfo(question.id);
                  return (
                    <div key={question.id} className={cn('p-4 md:p-6 transition-colors', answerInfo ? 'hover:bg-primary/5' : 'opacity-50')}>
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium',
                            answerInfo ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {answerInfo ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Domanda {index + 1}</p>
                          <p className="font-medium text-foreground mb-2">{question.question}</p>
                          {answerInfo ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="inline-flex items-center gap-2 bg-primary/10 text-foreground px-3 py-1.5 rounded-lg text-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                {answerInfo.text}
                              </div>
                              {answerInfo.archetype && (
                                <button
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium hover:opacity-80"
                                  style={{ backgroundColor: `${answerInfo.archetype.color}30` }}
                                  onClick={() => navigate(`/archetypes/${answerInfo.archetype!.id}`)}
                                >
                                  {answerInfo.archetype.emoji} {answerInfo.archetype.name}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Nessuna risposta scelta</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tutti gli archetipi */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                I 12 archetipi
              </CardTitle>
              <CardDescription>Caratteristiche, tono di voce e rischi di ciascun archetipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.values(archetypeDetails).map((archetype) => (
                  <button
                    key={archetype.id}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => navigate(`/archetypes/${archetype.id}`)}
                  >
                    <span className="text-2xl block mb-1" aria-hidden="true">
                      {archetype.emoji}
                    </span>
                    <span className="font-medium text-xs">{archetype.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/archetypes/list')}>
                Vedi tutti i dettagli
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => navigate('/archetypes/results')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Modifica le scelte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
