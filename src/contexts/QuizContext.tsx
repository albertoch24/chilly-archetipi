import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizQuestions, QuizQuestion } from '@/data/quizQuestions';
import { workshopStore, ParticipantResponse } from '@/lib/workshopStore';
import { loadParticipant, saveParticipant } from '@/lib/participant';
import { useToast } from '@/hooks/use-toast';

export type { ParticipantResponse };

interface QuizContextType {
  currentParticipant: string | null;
  setCurrentParticipant: (name: string | null) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  currentAnswers: Record<number, string>;
  setAnswer: (questionId: number, optionId: string) => void;
  allResponses: ParticipantResponse[];
  submitResponse: (participantName: string, answers: Record<number, string>) => Promise<void>;
  flaggedAnswers: Record<number, string>;
  setFlaggedAnswer: (questionId: number, optionId: string) => Promise<void>;
  questions: QuizQuestion[];
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;
  resetQuiz: () => void;
  isLoading: boolean;
  /** Ricarica risposte e scelte del facilitatore. */
  refreshResponses: () => Promise<void>;
  resetWorkshop: () => Promise<void>;
  /** 'shared' con Supabase configurato, 'local' in modalità dimostrativa. */
  storeMode: 'shared' | 'local';
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentParticipant, setCurrentParticipantState] = useState<string | null>(
    () => loadParticipant()?.name ?? null,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [allResponses, setAllResponses] = useState<ParticipantResponse[]>([]);
  const [flaggedAnswers, setFlaggedAnswersState] = useState<Record<number, string>>({});
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setCurrentParticipant = (name: string | null) => {
    if (name) saveParticipant(name);
    setCurrentParticipantState(name);
  };

  const refreshResponses = async () => {
    setIsLoading(true);
    try {
      const [responses, flags] = await Promise.all([workshopStore.listResponses(), workshopStore.listFlags()]);
      setAllResponses(responses);
      setFlaggedAnswersState(flags);
    } catch (error) {
      console.error('Error loading responses:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le risposte',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAnswer = (questionId: number, optionId: string) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const submitResponse = async (participantName: string, answers: Record<number, string>) => {
    const response: ParticipantResponse = {
      participantName,
      participantId: loadParticipant()?.id ?? `${participantName}-${Date.now()}`,
      answers,
      completedAt: new Date(),
    };

    try {
      await workshopStore.addResponse(response);
      setAllResponses((prev) => [response, ...prev]);
      toast({
        title: 'Risposte inviate!',
        description: 'Le tue risposte sono state salvate con successo.',
      });
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare le risposte. Riprova.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const setFlaggedAnswer = async (questionId: number, optionId: string) => {
    try {
      await workshopStore.setFlag(questionId, optionId);
      setFlaggedAnswersState((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    } catch (error) {
      console.error('Error flagging answer:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare la selezione.',
        variant: 'destructive',
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setCurrentAnswers({});
  };

  const resetWorkshop = async () => {
    setIsLoading(true);
    try {
      await workshopStore.reset();
      setAllResponses([]);
      setFlaggedAnswersState({});
      resetQuiz();
      toast({
        title: 'Workshop azzerato',
        description: 'Risposte, voti sui valori e scelte del facilitatore sono stati eliminati.',
      });
    } catch (error) {
      console.error('Error resetting workshop:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile azzerare il workshop. Riprova.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentParticipant,
        setCurrentParticipant,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentAnswers,
        setAnswer,
        allResponses,
        submitResponse,
        flaggedAnswers,
        setFlaggedAnswer,
        questions: quizQuestions,
        isAdminMode,
        setIsAdminMode,
        resetQuiz,
        isLoading,
        refreshResponses,
        resetWorkshop,
        storeMode: workshopStore.mode,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
