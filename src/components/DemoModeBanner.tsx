import { Info } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';

/** Avvisa il facilitatore quando il sito gira senza Supabase: i dati restano nel browser. */
export function DemoModeBanner() {
  const { storeMode } = useQuiz();
  if (storeMode !== 'local') return null;

  return (
    <div className="bg-warning/15 text-foreground border-b border-warning/40">
      <div className="container mx-auto px-4 py-2 flex items-start gap-2 text-sm">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Modalità dimostrativa:</strong> le risposte restano in questo browser. Per raccogliere quelle di
          tutti i partecipanti collega Supabase (vedi README).
        </p>
      </div>
    </div>
  );
}
