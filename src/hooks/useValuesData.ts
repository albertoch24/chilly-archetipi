import { useCallback, useEffect, useState } from 'react';
import { workshopStore, EMPTY_SELECTION, ValueSelection, ValueVote } from '@/lib/workshopStore';
import { useToast } from '@/hooks/use-toast';

/**
 * Voti sui valori (esercizi 2 e 3) e selezione confermata dal facilitatore.
 * Con `live` la pagina si aggiorna da sola quando altri dispositivi votano.
 */
export function useValuesData({ live = false }: { live?: boolean } = {}) {
  const [currentVotes, setCurrentVotes] = useState<ValueVote[]>([]);
  const [targetVotes, setTargetVotes] = useState<ValueVote[]>([]);
  const [selection, setSelection] = useState<ValueSelection>(EMPTY_SELECTION);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    try {
      const [current, target, confirmed] = await Promise.all([
        workshopStore.listValueVotes('current'),
        workshopStore.listValueVotes('target'),
        workshopStore.getValueSelection(),
      ]);
      setCurrentVotes(current);
      setTargetVotes(target);
      setSelection(confirmed);
    } catch (error) {
      console.error('Error loading values:', error);
      toast({ title: 'Errore', description: 'Impossibile caricare i valori', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
    if (!live) return;
    return workshopStore.subscribe(refresh);
  }, [refresh, live]);

  const saveSelection = async (next: ValueSelection) => {
    setSelection(next);
    try {
      await workshopStore.saveValueSelection(next);
    } catch (error) {
      console.error('Error saving selection:', error);
      toast({ title: 'Errore', description: 'Impossibile salvare la conferma. Riprova.', variant: 'destructive' });
      refresh();
    }
  };

  const saveVote = async (vote: ValueVote) => {
    try {
      await workshopStore.saveValueVote(vote);
      const update = (votes: ValueVote[]) => [...votes.filter((v) => v.participantId !== vote.participantId), vote];
      if (vote.exercise === 'current') setCurrentVotes(update);
      else setTargetVotes(update);
      return true;
    } catch (error) {
      console.error('Error saving vote:', error);
      toast({ title: 'Errore', description: 'Impossibile inviare le tue scelte. Riprova.', variant: 'destructive' });
      return false;
    }
  };

  return { currentVotes, targetVotes, selection, isLoading, refresh, saveSelection, saveVote };
}
