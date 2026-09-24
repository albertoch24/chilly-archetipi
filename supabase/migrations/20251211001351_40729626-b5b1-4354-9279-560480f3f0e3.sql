-- Add DELETE policies for passport tables
CREATE POLICY "Anyone can delete entries" 
ON public.passport_entries 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can delete master row" 
ON public.passport_master_row 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can delete sessions" 
ON public.passport_sessions 
FOR DELETE 
USING (true);