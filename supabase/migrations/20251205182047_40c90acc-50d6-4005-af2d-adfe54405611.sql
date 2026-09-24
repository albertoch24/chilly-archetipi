-- Create passport_sessions table
CREATE TABLE public.passport_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  current_phase TEXT NOT NULL DEFAULT 'setup' CHECK (current_phase IN ('setup', 'silent_writing', 'vertical_scan', 'veto', 'manifesto')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create passport_founders table
CREATE TABLE public.passport_founders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.passport_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  veto_used BOOLEAN NOT NULL DEFAULT false,
  veto_column TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create passport_entries table (founder cells)
CREATE TABLE public.passport_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.passport_sessions(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES public.passport_founders(id) ON DELETE CASCADE,
  column_type TEXT NOT NULL CHECK (column_type IN ('insight', 'purpose', 'philosophy', 'promise', 'values', 'signature')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(founder_id, column_type)
);

-- Create passport_master_row table
CREATE TABLE public.passport_master_row (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.passport_sessions(id) ON DELETE CASCADE,
  column_type TEXT NOT NULL CHECK (column_type IN ('insight', 'purpose', 'philosophy', 'promise', 'values', 'signature')),
  content TEXT NOT NULL DEFAULT '',
  source_founder_id UUID REFERENCES public.passport_founders(id) ON DELETE SET NULL,
  has_veto BOOLEAN NOT NULL DEFAULT false,
  veto_founder_id UUID REFERENCES public.passport_founders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, column_type)
);

-- Enable RLS on all tables
ALTER TABLE public.passport_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_master_row ENABLE ROW LEVEL SECURITY;

-- RLS policies for passport_sessions (public access for workshop)
CREATE POLICY "Anyone can view sessions" ON public.passport_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create sessions" ON public.passport_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON public.passport_sessions FOR UPDATE USING (true);

-- RLS policies for passport_founders
CREATE POLICY "Anyone can view founders" ON public.passport_founders FOR SELECT USING (true);
CREATE POLICY "Anyone can create founders" ON public.passport_founders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update founders" ON public.passport_founders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete founders" ON public.passport_founders FOR DELETE USING (true);

-- RLS policies for passport_entries
CREATE POLICY "Anyone can view entries" ON public.passport_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can create entries" ON public.passport_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update entries" ON public.passport_entries FOR UPDATE USING (true);

-- RLS policies for passport_master_row
CREATE POLICY "Anyone can view master row" ON public.passport_master_row FOR SELECT USING (true);
CREATE POLICY "Anyone can create master row" ON public.passport_master_row FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update master row" ON public.passport_master_row FOR UPDATE USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.passport_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.passport_founders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.passport_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.passport_master_row;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_passport_sessions_updated_at
  BEFORE UPDATE ON public.passport_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_passport_entries_updated_at
  BEFORE UPDATE ON public.passport_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_passport_master_row_updated_at
  BEFORE UPDATE ON public.passport_master_row
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();