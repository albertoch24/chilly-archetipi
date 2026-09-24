import { WORKSHOP } from '@/config/workshop';

export interface ParticipantResponse {
  participantName: string;
  participantId: string;
  answers: Record<number, string>;
  completedAt: Date;
}

export type ValueExercise = 'current' | 'target';

/** Esercizio 2 usa `values`; esercizio 3 usa `strengthen` e `add`. */
export type ValuePicks = {
  values?: string[];
  strengthen?: string[];
  add?: string[];
};

export interface ValueVote {
  exercise: ValueExercise;
  participantId: string;
  participantName: string;
  picks: ValuePicks;
  updatedAt: Date;
}

/** I valori confermati dal facilitatore: la mappa dei valori di Chilly. */
export interface ValueSelection {
  current: string[];
  strengthen: string[];
  add: string[];
}

export const EMPTY_SELECTION: ValueSelection = { current: [], strengthen: [], add: [] };

export interface WorkshopStore {
  /** 'shared' = Supabase, risposte da tutti i dispositivi; 'local' = solo questo browser (demo o offline). */
  mode: 'shared' | 'local';
  listResponses(): Promise<ParticipantResponse[]>;
  addResponse(response: ParticipantResponse): Promise<void>;
  listFlags(): Promise<Record<number, string>>;
  setFlag(questionId: number, optionId: string): Promise<void>;
  listValueVotes(exercise: ValueExercise): Promise<ValueVote[]>;
  /** Un voto per partecipante ed esercizio: un nuovo invio sostituisce il precedente. */
  saveValueVote(vote: ValueVote): Promise<void>;
  getValueSelection(): Promise<ValueSelection>;
  saveValueSelection(selection: ValueSelection): Promise<void>;
  reset(): Promise<void>;
  /** Richiama onChange quando altri dispositivi o schede cambiano i dati; restituisce la funzione per smettere. */
  subscribe(onChange: () => void): () => void;
}

const REFRESH_INTERVAL_MS = 10_000;

function createSupabaseStore(): WorkshopStore {
  // Import pigro: il client generato da Lovable lancia un errore all'import se mancano le variabili d'ambiente.
  const client = import('@/integrations/supabase/client').then((m) => m.supabase);
  const workshop = WORKSHOP.id;

  return {
    mode: 'shared',

    async listResponses() {
      const supabase = await client;
      const { data, error } = await supabase
        .from('quiz_responses')
        .select('*')
        .eq('workshop', workshop)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((row) => ({
        participantName: row.participant_name,
        participantId: row.participant_id,
        answers: row.answers as Record<number, string>,
        completedAt: new Date(row.completed_at),
      }));
    },

    async addResponse(response) {
      const supabase = await client;
      const { error } = await supabase.from('quiz_responses').insert({
        workshop,
        participant_name: response.participantName,
        participant_id: response.participantId,
        answers: response.answers,
        completed_at: response.completedAt.toISOString(),
      });
      if (error) throw error;
    },

    async listFlags() {
      const supabase = await client;
      const { data, error } = await supabase.from('flagged_answers').select('*').eq('workshop', workshop);
      if (error) throw error;
      const flagged: Record<number, string> = {};
      (data || []).forEach((row) => {
        flagged[row.question_id] = row.option_id;
      });
      return flagged;
    },

    async setFlag(questionId, optionId) {
      const supabase = await client;
      const { error } = await supabase.from('flagged_answers').upsert(
        {
          workshop,
          question_id: questionId,
          option_id: optionId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'workshop,question_id' },
      );
      if (error) throw error;
    },

    async listValueVotes(exercise) {
      const supabase = await client;
      const { data, error } = await supabase
        .from('value_votes')
        .select('*')
        .eq('workshop', workshop)
        .eq('exercise', exercise);
      if (error) throw error;
      return (data || []).map((row) => ({
        exercise,
        participantId: row.participant_id,
        participantName: row.participant_name,
        picks: row.picks as ValuePicks,
        updatedAt: new Date(row.updated_at),
      }));
    },

    async saveValueVote(vote) {
      const supabase = await client;
      const { error } = await supabase.from('value_votes').upsert(
        {
          workshop,
          exercise: vote.exercise,
          participant_id: vote.participantId,
          participant_name: vote.participantName,
          picks: vote.picks,
          updated_at: vote.updatedAt.toISOString(),
        },
        { onConflict: 'workshop,exercise,participant_id' },
      );
      if (error) throw error;
    },

    async getValueSelection() {
      const supabase = await client;
      const { data, error } = await supabase
        .from('value_selections')
        .select('*')
        .eq('workshop', workshop)
        .maybeSingle();
      if (error) throw error;
      if (!data) return EMPTY_SELECTION;
      return {
        current: (data.current_values as string[]) || [],
        strengthen: (data.strengthen_values as string[]) || [],
        add: (data.new_values as string[]) || [],
      };
    },

    async saveValueSelection(selection) {
      const supabase = await client;
      const { error } = await supabase.from('value_selections').upsert(
        {
          workshop,
          current_values: selection.current,
          strengthen_values: selection.strengthen,
          new_values: selection.add,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'workshop' },
      );
      if (error) throw error;
    },

    async reset() {
      const supabase = await client;
      for (const table of ['quiz_responses', 'flagged_answers', 'value_votes', 'value_selections'] as const) {
        const { error } = await supabase.from(table).delete().eq('workshop', workshop);
        if (error) throw error;
      }
    },

    subscribe(onChange) {
      // Le tabelle del quiz non sono nella publication realtime: le dashboard fanno polling finché sono aperte.
      const timer = window.setInterval(onChange, REFRESH_INTERVAL_MS);
      return () => window.clearInterval(timer);
    },
  };
}

type Stored<T> = Omit<T, 'completedAt' | 'updatedAt'> & { completedAt?: string; updatedAt?: string };

function createLocalStore(): WorkshopStore {
  const prefix = `${WORKSHOP.id}-workshop:`;
  const keys = ['responses', 'flags', 'votes-current', 'votes-target', 'selection'];

  const read = <T,>(name: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(prefix + name);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (name: string, value: unknown) => {
    try {
      localStorage.setItem(prefix + name, JSON.stringify(value));
    } catch {
      // Storage pieno o bloccato (navigazione privata): il dato non viene salvato.
    }
  };

  return {
    mode: 'local',

    async listResponses() {
      return read<Stored<ParticipantResponse>[]>('responses', [])
        .map((r) => ({ ...r, completedAt: new Date(r.completedAt ?? 0) }))
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    },

    async addResponse(response) {
      const all = read<Stored<ParticipantResponse>[]>('responses', []);
      write('responses', [...all, { ...response, completedAt: response.completedAt.toISOString() }]);
    },

    async listFlags() {
      return read<Record<number, string>>('flags', {});
    },

    async setFlag(questionId, optionId) {
      write('flags', { ...read<Record<number, string>>('flags', {}), [questionId]: optionId });
    },

    async listValueVotes(exercise) {
      return read<Stored<ValueVote>[]>(`votes-${exercise}`, []).map((v) => ({
        ...v,
        updatedAt: new Date(v.updatedAt ?? 0),
      }));
    },

    async saveValueVote(vote) {
      const others = read<Stored<ValueVote>[]>(`votes-${vote.exercise}`, []).filter(
        (v) => v.participantId !== vote.participantId,
      );
      write(`votes-${vote.exercise}`, [...others, { ...vote, updatedAt: vote.updatedAt.toISOString() }]);
    },

    async getValueSelection() {
      return { ...EMPTY_SELECTION, ...read<Partial<ValueSelection>>('selection', {}) };
    },

    async saveValueSelection(selection) {
      write('selection', selection);
    },

    async reset() {
      try {
        keys.forEach((name) => localStorage.removeItem(prefix + name));
      } catch {
        // Niente da cancellare se lo storage non è accessibile.
      }
    },

    subscribe(onChange) {
      // L'evento storage arriva dalle ALTRE schede: quiz in una scheda, dashboard nell'altra.
      const handler = (event: StorageEvent) => {
        if (event.key?.startsWith(prefix)) onChange();
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
  };
}

const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const workshopStore: WorkshopStore = hasSupabase ? createSupabaseStore() : createLocalStore();
