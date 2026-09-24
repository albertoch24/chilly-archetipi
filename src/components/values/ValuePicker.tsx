import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MAX_VALUE_LENGTH, PICK_LIMITS, formatValue, includesValue, valueKey } from '@/data/valuesData';

interface ValueChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ValueChip({ label, selected, disabled, onToggle }: ValueChipProps) {
  const blocked = disabled && !selected;
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={blocked}
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-accent bg-accent text-accent-foreground shadow-soft'
          : 'border-border bg-card text-foreground hover:border-accent/60',
        blocked && 'opacity-40 cursor-not-allowed hover:border-border',
      )}
    >
      {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
      {label}
    </button>
  );
}

interface ValueGroup {
  title?: string;
  values: string[];
}

interface ValuePickerProps {
  id: string;
  groups: ValueGroup[];
  selected: string[];
  limit: number;
  onChange: (next: string[]) => void;
  allowCustom?: boolean;
  /** Valori che non si possono aggiungere a mano, con il motivo mostrato a chi ci prova. */
  blocked?: { values: string[]; reason: string };
}

export function ValuePicker({ id, groups, selected, limit, onChange, allowCustom = false, blocked }: ValuePickerProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const options = groups.flatMap((group) => group.values);
  const optionKeys = new Set(options.map(valueKey));
  const customSelected = selected.filter((value) => !optionKeys.has(valueKey(value)));
  const isFull = selected.length >= limit;

  const toggle = (label: string) => {
    if (includesValue(selected, label)) {
      onChange(selected.filter((value) => valueKey(value) !== valueKey(label)));
    } else if (!isFull) {
      onChange([...selected, label]);
    }
    setError('');
  };

  const addCustom = () => {
    const label = formatValue(draft);
    if (label.length < 2) {
      setError('Scrivi almeno 2 caratteri.');
      return;
    }
    if (blocked && includesValue(blocked.values, label)) {
      setError(blocked.reason);
      return;
    }
    if (includesValue(selected, label)) {
      setDraft('');
      return;
    }
    if (isFull) {
      setError(`Hai già scelto ${limit} valori: togline uno per aggiungerne un altro.`);
      return;
    }
    const catalogMatch = options.find((value) => valueKey(value) === valueKey(label));
    if (!catalogMatch && customSelected.length >= PICK_LIMITS.custom) {
      setError(`Puoi aggiungere al massimo ${PICK_LIMITS.custom} valori tuoi.`);
      return;
    }
    onChange([...selected, catalogMatch ?? label]);
    setDraft('');
    setError('');
  };

  return (
    <div className="space-y-5">
      {groups
        .filter((group) => group.values.length > 0)
        .map((group, index) => (
          <div key={group.title ?? index}>
            {group.title && (
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">{group.title}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => (
                <ValueChip
                  key={value}
                  label={value}
                  selected={includesValue(selected, value)}
                  disabled={isFull}
                  onToggle={() => toggle(value)}
                />
              ))}
            </div>
          </div>
        ))}

      {allowCustom && (
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Manca un valore?</p>
          {customSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {customSelected.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-accent bg-accent text-accent-foreground px-4 py-2 text-sm font-medium"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => toggle(value)}
                    className="rounded-full hover:bg-accent-foreground/20 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Rimuovi ${value}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <label htmlFor={`${id}-custom`} className="sr-only">
              Aggiungi un valore
            </label>
            <Input
              id={`${id}-custom`}
              value={draft}
              maxLength={MAX_VALUE_LENGTH}
              placeholder="Scrivi un valore che non trovi"
              onChange={(e) => {
                setDraft(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustom();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addCustom} disabled={!draft.trim()}>
              Aggiungi
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
