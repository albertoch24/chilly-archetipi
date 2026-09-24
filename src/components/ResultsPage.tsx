import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuiz } from '@/contexts/QuizContext';
import { workshopStore } from '@/lib/workshopStore';
import { answerArchetypeMapping, archetypeDetails } from '@/data/archetypeData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Flag, Users, CheckCircle2, Home, Trophy, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';
import { DemoModeBanner } from '@/components/DemoModeBanner';

export function ResultsPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Gli archetipi restano nascosti durante la discussione, per non orientarla.
  const [showArchetypes, setShowArchetypes] = useState(false);

  const { questions, allResponses, flaggedAnswers, setFlaggedAnswer, isLoading, refreshResponses, resetWorkshop } = useQuiz();

  // Dati aggiornati all'apertura e poi in automatico mentre i partecipanti inviano.
  useEffect(() => {
    refreshResponses();
    return workshopStore.subscribe(refreshResponses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const totalParticipants = allResponses.length;

  const optionStats: Record<string, number> = {};
  currentQuestion.options.forEach((opt) => {
    optionStats[opt.id] = 0;
  });
  allResponses.forEach((response) => {
    const answer = response.answers[currentQuestion.id];
    if (answer && optionStats[answer] !== undefined) optionStats[answer]++;
  });
  const maxVotes = Math.max(...Object.values(optionStats), 1);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const flaggedCount = Object.keys(flaggedAnswers).length;

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      {/* Header */}
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
                <p className="font-semibold font-heading">Esercizio 1 · Archetipo</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground/90 hover:bg-primary-foreground/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Azzera
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Azzerare il workshop?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Elimina per sempre le risposte al quiz, i voti sui valori e tutte le scelte del facilitatore di
                      questo workshop. Gli altri workshop sullo stesso backend non vengono toccati.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => resetWorkshop()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Elimina tutto
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refreshResponses()}
                disabled={isLoading}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
                Aggiorna
              </Button>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/75">Partecipanti</p>
                <p className="font-semibold flex items-center gap-2 tabular-nums">
                  <Users className="w-4 h-4" />
                  {totalParticipants}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/75">Scelte del gruppo</p>
                <p className="font-semibold flex items-center gap-2 tabular-nums">
                  <Flag className="w-4 h-4" />
                  {flaggedCount} / {totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {totalParticipants === 0 ? (
          <Card variant="elevated" className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Nessuna risposta</CardTitle>
              <CardDescription>
                Non ci sono ancora risposte da analizzare. La pagina si aggiorna da sola quando i partecipanti inviano il
                quiz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" onClick={() => navigate('/archetypes')}>
                Vai alla pagina del quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Question Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  aria-label={`Domanda ${index + 1}${flaggedAnswers[q.id] ? ', scelta fatta' : ''}`}
                  className={cn(
                    'w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 relative',
                    index === currentQuestionIndex
                      ? 'bg-accent text-accent-foreground shadow-accent'
                      : flaggedAnswers[q.id]
                        ? 'bg-success text-success-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  )}
                >
                  {index + 1}
                  {flaggedAnswers[q.id] && (
                    <CheckCircle2 className="w-3.5 h-3.5 absolute -top-0.5 -right-0.5 text-success bg-background rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mb-4">
              <Switch id="show-archetypes" checked={showArchetypes} onCheckedChange={setShowArchetypes} />
              <Label htmlFor="show-archetypes" className="text-sm text-muted-foreground cursor-pointer">
                Mostra l'archetipo di ogni risposta
              </Label>
            </div>

            {/* Current Question */}
            <Card variant="elevated" className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Domanda {currentQuestionIndex + 1}
                  </span>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {totalParticipants} rispost{totalParticipants === 1 ? 'a' : 'e'}
                  </span>
                </div>
                <CardTitle className="text-xl md:text-2xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const votes = optionStats[option.id] || 0;
                    const percentage = totalParticipants > 0 ? Math.round((votes / totalParticipants) * 100) : 0;
                    const isHighest = votes === maxVotes && votes > 0;
                    const isFlagged = flaggedAnswers[currentQuestion.id] === option.id;
                    const archetype = archetypeDetails[answerArchetypeMapping[option.id]];

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'relative rounded-lg border-2 p-4 transition-all duration-300',
                          isFlagged ? 'border-success bg-success/5' : isHighest ? 'border-accent/50 bg-accent/5' : 'border-border bg-card',
                        )}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium',
                                isFlagged
                                  ? 'bg-success text-success-foreground'
                                  : isHighest
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-secondary text-secondary-foreground',
                              )}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="min-w-0">
                              <span className={cn('text-sm', isFlagged && 'font-medium')}>{option.text}</span>
                              {showArchetypes && archetype && (
                                <span
                                  className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium align-middle"
                                  style={{ backgroundColor: `${archetype.color}30` }}
                                >
                                  {archetype.emoji} {archetype.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right tabular-nums">
                              <span className={cn('text-lg font-bold', isFlagged ? 'text-success' : isHighest ? 'text-primary' : '')}>
                                {votes}
                              </span>
                              <span className="text-muted-foreground text-sm ml-1">({percentage}%)</span>
                            </div>

                            <Button
                              variant={isFlagged ? 'flag' : 'outline'}
                              size="sm"
                              onClick={() => setFlaggedAnswer(currentQuestion.id, option.id)}
                              className="flex-shrink-0"
                            >
                              {isFlagged ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Scelta
                                </>
                              ) : (
                                <>
                                  <Flag className="w-4 h-4 mr-1" />
                                  Scegli
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Vote bar */}
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              isFlagged ? 'bg-success' : isHighest ? 'bg-accent-gradient' : 'bg-muted-foreground/30',
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Precedente
              </Button>

              <div className="text-sm text-muted-foreground tabular-nums">
                {currentQuestionIndex + 1} / {totalQuestions}
              </div>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate('/archetypes/archetype')}
                  disabled={flaggedCount < totalQuestions}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Vedi l'archetipo
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={handleNext}>
                  Successiva
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {flaggedCount < totalQuestions && currentQuestionIndex === totalQuestions - 1 && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                Scegli una risposta per ogni domanda ({flaggedCount}/{totalQuestions} completate)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
