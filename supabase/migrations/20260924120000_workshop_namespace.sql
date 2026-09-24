-- Namespace per workshop: lo stesso backend ospita più workshop (es. Si Vola e Chilly)
-- senza mescolare risposte e scelte del facilitatore. Le righe esistenti restano a 'sivola'.
ALTER TABLE public.quiz_responses ADD COLUMN IF NOT EXISTS workshop TEXT NOT NULL DEFAULT 'sivola';
ALTER TABLE public.flagged_answers ADD COLUMN IF NOT EXISTS workshop TEXT NOT NULL DEFAULT 'sivola';

-- Una scelta per domanda PER WORKSHOP (prima era una per domanda in assoluto).
ALTER TABLE public.flagged_answers DROP CONSTRAINT IF EXISTS flagged_answers_question_id_key;
ALTER TABLE public.flagged_answers ADD CONSTRAINT flagged_answers_workshop_question_key UNIQUE (workshop, question_id);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_workshop ON public.quiz_responses(workshop, completed_at DESC);

-- Esercizi 2 e 3: i voti individuali sui valori (uno per partecipante e per esercizio, modificabile).
-- current: {"values": [...]} · target: {"strengthen": [...], "add": [...]}
CREATE TABLE IF NOT EXISTS public.value_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop TEXT NOT NULL,
  exercise TEXT NOT NULL CHECK (exercise IN ('current', 'target')),
  participant_id TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  picks JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (workshop, exercise, participant_id)
);

ALTER TABLE public.value_votes ENABLE ROW LEVEL SECURITY;

-- Stesso modello aperto del quiz: partecipanti senza login durante il workshop.
CREATE POLICY "Anyone can view value votes" ON public.value_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert value votes" ON public.value_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update value votes" ON public.value_votes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete value votes" ON public.value_votes FOR DELETE USING (true);

-- Le scelte confermate dal facilitatore: una riga per workshop.
CREATE TABLE IF NOT EXISTS public.value_selections (
  workshop TEXT NOT NULL PRIMARY KEY,
  current_values JSONB NOT NULL DEFAULT '[]',
  strengthen_values JSONB NOT NULL DEFAULT '[]',
  new_values JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.value_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage value selections" ON public.value_selections FOR ALL USING (true) WITH CHECK (true);
