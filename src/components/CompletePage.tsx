import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home, PartyPopper, ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

export function CompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Home link */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home workshop</span>
        </Link>
      </div>

      {/* Logo Header */}
      <div className="mb-8 animate-fade-in">
        <Link to="/">
          <div className="bg-hero rounded-full px-6 py-3 hover:opacity-80 transition-opacity">
            <BrandMark className="text-3xl" />
          </div>
        </Link>
      </div>
      
      <Card variant="elevated" className="max-w-md w-full text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-success/10 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            Quiz completato!
            <PartyPopper className="w-6 h-6 text-primary" />
          </CardTitle>
          <CardDescription className="text-base">
            Grazie per aver partecipato al workshop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Le tue risposte sono state registrate con successo. 
            Il facilitatore analizzerà i risultati aggregati con il gruppo.
          </p>

          <div className="bg-accent/10 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Prossimo passo:</strong> tieni aperta questa pagina. Dopo la lettura collettiva
              passeremo all'esercizio sui valori attuali.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Torna alla home del workshop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
