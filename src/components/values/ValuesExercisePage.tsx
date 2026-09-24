import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Home, Loader2, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrandMark } from '@/components/BrandMark';
import { ValuePicker } from '@/components/values/ValuePicker';
import { useQuiz } from '@/contexts/QuizContext';
import { useValuesData } from '@/hooks/useValuesData';
import { loadParticipant, saveParticipant, Participant } from '@/lib/participant';
import { ValueExercise, ValuePicks } from '@/lib/workshopStore';
import { getArchetypePair, rankArchetypes } from '@/data/archetypeData';
import { PICK_LIMITS, VALUE_CATALOG, includesValue, suggestedValues } from '@/data/valuesData';
import { BRAND_NAME } from '@/config/workshop';

const COPY: Record<ValueExercise, { step: string; title: string; question: string; hint: string }> = {
  current: {
    step: 'Esercizio 2',
    title: 'Valori attuali',
    question: `Quali valori definiscono oggi l'universo di significato di ${BRAND_NAME}?`,
    hint: `Scegli fino a ${PICK_LIMITS.current} valori. Pensa a come ${BRAND_NAME} è oggi, non a come vorremmo che fosse.`,
  },
  target: {
    step: 'Esercizio 3',
    title: 'Valori obiettivo',
    question: `Quali valori vogliamo che ${BRAND_NAME} rafforzi o conquisti grazie al Global Ambassador?`,
    hint: `Scegli fino a ${PICK_LIMITS.strengthen} valori da potenziare e fino a ${PICK_LIMITS.add} valori nuovi.`,
  },
};

export function ValuesExercisePage({ exercise }: { exercise: ValueExercise }) {
  const copy = COPY[exercise];
  const { setCurrentParticipant, flaggedAnswers, allResponses } = useQuiz();
  // Il 3 aspetta le conferme del facilitatore sull'esercizio 2: resta in ascolto.
  const { currentVotes, targetVotes, selection, isLoading, refresh, saveVote } = useValuesData({ live: exercise === 'target' });

  const [participant, setParticipant] = useState<Participant | null>(() => loadParticipant());
  const [nameDraft, setNameDraft] = useState('');
  const [nameError, setNameError] = useState('');
  const [draft, setDraft] = useState<ValuePicks | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const myVote = (exercise === 'current' ? currentVotes : targetVotes).find((v) => v.participantId === participant?.id);
  const picks: ValuePicks = draft ?? myVote?.picks ?? {};
  const values = picks.values ?? [];
  const strengthen = (picks.strengthen ?? []).filter((v) => includesValue(selection.current, v));
  const add = picks.add ?? [];
  const pickedCount = exercise === 'current' ? values.length : strengthen.length + add.length;

  const { primary, secondary } = getArchetypePair(rankArchetypes(flaggedAnswers, allResponses));
  const suggested = suggestedValues([primary?.id, secondary?.id].filter((id): id is string => Boolean(id))).map((v) => v.label);

  const startWithName = () => {
    const name = nameDraft.trim();
    if (name.length < 2) {
      setNameError('Inserisci un nome valido (almeno 2 caratteri)');
      return;
    }
    const saved = saveParticipant(name);
    setParticipant(saved);
    setCurrentParticipant(saved.name);
  };

  const handleSubmit = async () => {
    if (!participant || pickedCount === 0) return;
    setIsSubmitting(true);
    const cleaned: ValuePicks = exercise === 'current' ? { values } : { strengthen, add };
    const ok = await saveVote({
      exercise,
      participantId: participant.id,
      participantName: participant.name,
      picks: cleaned,
      updatedAt: new Date(),
    });
    setIsSubmitting(false);
    if (ok) {
      setSubmitted(true);
      setDraft(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const waitingForCurrent = exercise === 'target' && !isLoading && selection.current.length === 0;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-hero relative overflow-hidden">
        <div className="brand-bubbles" aria-hidden="true" />
        <div className="container mx-auto px-4 py-5 relative z-10">
          <div className="flex items-center justify-between gap-4 text-primary-foreground">
            <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="Home workshop">
              <BrandMark className="text-3xl" />
            </Link>
            {participant && (
              <div className="text-right">
                <p className="text-sm text-primary-foreground/75">Partecipante</p>
                <p className="font-semibold">{participant.name}</p>
              </div>
            )}
          </div>
          <div className="mt-6 mb-2 max-w-2xl">
            <p className="text-sm font-medium text-primary-foreground/80">
              {copy.step} · {copy.title}
            </p>
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mt-2 text-balance">{copy.question}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {!participant ? (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Come ti chiami?</CardTitle>
                <CardDescription>Serve per contare un solo voto a persona. Puoi cambiare le tue scelte fino alla chiusura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <label htmlFor="values-name" className="sr-only">
                  Il tuo nome
                </label>
                <Input
                  id="values-name"
                  value={nameDraft}
                  placeholder="Il tuo nome..."
                  autoComplete="given-name"
                  onChange={(e) => {
                    setNameDraft(e.target.value);
                    setNameError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && startWithName()}
                />
                {nameError && <p className="text-destructive text-sm">{nameError}</p>}
                <Button variant="hero" className="w-full" onClick={startWithName}>
                  Continua
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Caricamento…
            </div>
          ) : waitingForCurrent ? (
            <Card variant="elevated" className="text-center">
              <CardContent className="p-8 space-y-3">
                <p className="font-heading text-xl font-semibold">In attesa dei valori attuali</p>
                <p className="text-muted-foreground">
                  Il facilitatore li conferma alla fine dell'esercizio 2. La pagina si aggiorna da sola.
                </p>
                <Button variant="outline" onClick={refresh}>
                  <RefreshCw className="w-4 h-4" />
                  Aggiorna ora
                </Button>
              </CardContent>
            </Card>
          ) : submitted ? (
            <Card variant="elevated" className="text-center">
              <CardContent className="p-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <p className="font-heading text-xl font-semibold">Scelte inviate, grazie!</p>
                <p className="text-muted-foreground">
                  Guarda lo schermo della sala: tra poco leggiamo insieme i risultati.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {(exercise === 'current' ? values : [...strengthen, ...add]).map((value) => (
                    <span key={value} className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      {value}
                    </span>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Modifica le mie scelte
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-muted-foreground">{copy.hint}</p>

              {myVote && !draft && (
                <p className="text-sm rounded-lg bg-secondary/60 text-secondary-foreground px-4 py-3">
                  Hai già inviato le tue scelte: puoi modificarle e inviarle di nuovo.
                </p>
              )}

              {exercise === 'current' ? (
                <Card variant="elevated">
                  <CardContent className="p-5 md:p-6">
                    <ValuePicker
                      id="current"
                      selected={values}
                      limit={PICK_LIMITS.current}
                      allowCustom
                      onChange={(next) => setDraft({ values: next })}
                      groups={[
                        {
                          title: primary
                            ? `Suggeriti dall'archetipo: ${[primary.name, secondary?.name].filter(Boolean).join(' e ')}`
                            : undefined,
                          values: suggested,
                        },
                        {
                          title: suggested.length ? 'Altri valori' : undefined,
                          values: VALUE_CATALOG.map((v) => v.label).filter((label) => !suggested.includes(label)),
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card variant="elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Da potenziare</CardTitle>
                      <CardDescription>
                        Quali valori di oggi vogliamo rendere più forti con l'Ambassador? Fino a {PICK_LIMITS.strengthen}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ValuePicker
                        id="strengthen"
                        selected={strengthen}
                        limit={PICK_LIMITS.strengthen}
                        onChange={(next) => setDraft({ strengthen: next, add })}
                        groups={[{ values: selection.current }]}
                      />
                    </CardContent>
                  </Card>
                  <Card variant="elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Da acquisire</CardTitle>
                      <CardDescription>
                        Quali valori nuovi vogliamo che l'Ambassador porti a {BRAND_NAME}? Fino a {PICK_LIMITS.add}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ValuePicker
                        id="add"
                        selected={add}
                        limit={PICK_LIMITS.add}
                        allowCustom
                        onChange={(next) => setDraft({ strengthen, add: next })}
                        blocked={{
                          values: selection.current,
                          reason: 'È già tra i valori attuali: sceglilo tra quelli da potenziare.',
                        }}
                        groups={[
                          {
                            values: VALUE_CATALOG.map((v) => v.label).filter((label) => !includesValue(selection.current, label)),
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Barra di invio */}
      {participant && !isLoading && !waitingForCurrent && !submitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-2xl">
            <p className="text-sm text-muted-foreground tabular-nums">
              {exercise === 'current'
                ? `${values.length} di ${PICK_LIMITS.current} scelti`
                : `${strengthen.length} da potenziare · ${add.length} nuovi`}
            </p>
            <Button variant="hero" size="lg" onClick={handleSubmit} disabled={pickedCount === 0 || isSubmitting}>
              {isSubmitting ? 'Invio…' : 'Invia'}
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Home className="w-4 h-4" />
            Home workshop
          </Link>
        </div>
      </div>
    </div>
  );
}
