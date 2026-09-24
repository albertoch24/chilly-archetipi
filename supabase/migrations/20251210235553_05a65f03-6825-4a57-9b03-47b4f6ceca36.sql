-- Add DELETE policy for quiz_responses table
CREATE POLICY "Anyone can delete responses" 
ON public.quiz_responses 
FOR DELETE 
USING (true);