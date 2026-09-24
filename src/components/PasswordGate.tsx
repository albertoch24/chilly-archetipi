import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { WORKSHOP } from '@/config/workshop';

const AUTH_KEY = `${WORKSHOP.id}-workshop:auth`;

interface PasswordGateProps {
  children: React.ReactNode;
}

/**
 * Filtro leggero contro i visitatori casuali, non una protezione: la password finisce nel bundle.
 * Si attiva solo se VITE_WORKSHOP_PASSWORD è impostata.
 */
export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!WORKSHOP.password) return true;
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === WORKSHOP.password) {
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // Senza sessionStorage la password verrà richiesta al prossimo caricamento.
      }
      setIsAuthenticated(true);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-block bg-hero rounded-2xl px-6 py-3 mb-6">
            <BrandMark className="text-4xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">{WORKSHOP.title}</h1>
          <p className="text-muted-foreground text-sm">Inserisci la password che trovi sullo schermo della sala</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-4 ${isShaking ? 'animate-shake' : ''}`}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="workshop-password" className="sr-only">
              Password
            </label>
            <Input
              id="workshop-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`pl-10 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-destructive text-center">Password non corretta</p>}

          <Button type="submit" variant="hero" className="w-full">
            Entra
          </Button>
        </form>
      </div>
    </div>
  );
};
