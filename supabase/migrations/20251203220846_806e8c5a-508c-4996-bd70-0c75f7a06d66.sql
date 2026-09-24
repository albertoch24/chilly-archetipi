-- Create table for quiz responses
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_quiz_responses_completed_at ON public.quiz_responses(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for workshop participants without auth)
CREATE POLICY "Anyone can insert responses"
ON public.quiz_responses
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select (for facilitator to view results)
CREATE POLICY "Anyone can view responses"
ON public.quiz_responses
FOR SELECT
USING (true);

-- Create table for flagged answers (facilitator selections)
CREATE TABLE public.flagged_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id INTEGER NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(question_id)
);

-- Enable RLS
ALTER TABLE public.flagged_answers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage flagged answers (workshop facilitator)
CREATE POLICY "Anyone can manage flagged answers"
ON public.flagged_answers
FOR ALL
USING (true)
WITH CHECK (true);