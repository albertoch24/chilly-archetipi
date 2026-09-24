import { BRAND_NAME } from '@/config/workshop';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  /** 'light' su fondi colorati, 'dark' su fondi chiari. */
  tone?: 'light' | 'dark';
}

/**
 * Wordmark tipografico del brand. Per usare il logo ufficiale (fornito dal cliente)
 * sostituisci questo span con <img src={logo} alt={BRAND_NAME} />: è l'unico punto da cambiare.
 */
export function BrandMark({ className, tone = 'light' }: BrandMarkProps) {
  return (
    <span
      className={cn('brand-wordmark', tone === 'light' ? 'text-primary-foreground' : 'text-primary', className)}
      aria-label={BRAND_NAME}
    >
      {BRAND_NAME}
    </span>
  );
}
