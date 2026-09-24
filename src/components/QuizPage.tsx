import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuiz } from '@/contexts/QuizContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  Drama,
  GraduationCap,
  Hand,
  HeartHandshake,
  HeartPulse,
  Infinity as InfinityIcon,
  Paintbrush,
  Send,
  Shield,
  Smile,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';

// Solo le icone della domanda 12: importarle tutte da lucide pesava circa 700 kB sui telefoni in sala.
const QUIZ_ICONS: Record<string, LucideIcon> = {
  HeartPulse,
  Drama,
  Smile,
  Shield,
  Users,
  Sparkles,
  Hand,
  Infinity: InfinityIcon,
  GraduationCap,
  Crown,
  Paintbrush,
  HeartHandshake,
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = QUIZ_ICONS[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

// Image with loading state
const LazyImage = ({ src, alt, className, onLoad }: { src: string; alt: string; className?: string; onLoad?: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
      />
    </>
  );
};

export function QuizPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentParticipant,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentAnswers,
    setAnswer,
    submitResponse,
    questions,
    resetQuiz,
  } = useQuiz();

  // Ogni nuova domanda parte dall'alto: su telefono il bottone Avanti sta in fondo alla pagina.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  // Redirect if no participant
  useEffect(() => {
    if (!currentParticipant) {
      navigate('/archetypes');
    }
  }, [currentParticipant, navigate]);

  if (!currentParticipant) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const selectedOption = currentAnswers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const answeredCount = Object.keys(currentAnswers).length;

  const handleOptionSelect = (optionId: string) => {
    setAnswer(currentQuestion.id, optionId);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitResponse(currentParticipant, currentAnswers);
      resetQuiz();
      navigate('/archetypes/complete');
    } catch (error) {
      // L'errore è già mostrato dal context
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasVisualContent = currentQuestion.hasImages || currentQuestion.hasIcons;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-3">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <BrandMark className="text-3xl" />
              </Link>
              <div>
                <p className="text-sm text-primary-foreground/70">Partecipante</p>
                <p className="font-semibold">{currentParticipant}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/70">Domanda</p>
              <p className="font-semibold">{currentQuestionIndex + 1} di {totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 -mt-2">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Number Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              Domanda {currentQuestionIndex + 1}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 animate-fade-in">
            {currentQuestion.question}
          </h2>

          {/* Options - Grid for images/icons, List for text */}
          {hasVisualContent ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <Card
                  key={option.id}
                  variant={selectedOption === option.id ? 'quizSelected' : 'quiz'}
                  className={cn(
                    'p-0 overflow-hidden animate-slide-up cursor-pointer',
                    'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    {option.image && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <LazyImage
                          src={option.image}
                          alt={option.text}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {selectedOption === option.id && (
                          <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-accent-foreground drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Icon */}
                    {option.icon && (
                      <div className={cn(
                        "aspect-square flex items-center justify-center",
                        selectedOption === option.id ? "bg-accent/20" : "bg-secondary/50"
                      )}>
                        <DynamicIcon 
                          name={option.icon} 
                          className={cn(
                            "w-16 h-16 transition-colors duration-200",
                            selectedOption === option.id ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      </div>
                    )}
                    
                    {/* Text Label */}
                    <div className={cn(
                      "p-3 text-center border-t transition-colors duration-200",
                      selectedOption === option.id 
                        ? "bg-accent/10 border-accent/30" 
                        : "bg-card border-border"
                    )}>
                      <span className={cn(
                        "text-sm font-medium",
                        selectedOption === option.id && "text-primary"
                      )}>
                        {option.text}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <Card
                  key={option.id}
                  variant={selectedOption === option.id ? 'quizSelected' : 'quiz'}
                  className={cn(
                    'p-4 animate-slide-up',
                    'hover:scale-[1.01] active:scale-[0.99]'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-0 flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                        selectedOption === option.id
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {selectedOption === option.id ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span className={cn(
                      'text-base',
                      selectedOption === option.id && 'font-medium'
                    )}>
                      {option.text}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="w-28"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Indietro
            </Button>

            <div className="text-sm text-muted-foreground">
              {answeredCount} / {totalQuestions} risposte
            </div>

            {isLastQuestion ? (
              <Button
                variant="hero"
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedOption || isSubmitting || answeredCount < totalQuestions}
              >
                {isSubmitting ? 'Invio...' : 'Invia risposte'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="hero"
                size="lg"
                onClick={handleNext}
                disabled={!selectedOption}
                className="w-28"
              >
                Avanti
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-medium transition-all duration-200',
                  index === currentQuestionIndex
                    ? 'bg-accent text-accent-foreground shadow-accent'
                    : currentAnswers[q.id]
                    ? 'bg-success text-success-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
