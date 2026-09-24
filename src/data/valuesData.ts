// Esercizi 2 e 3: il catalogo di valori da cui partono i partecipanti.
// Ogni valore è legato a un archetipo, così i primi suggerimenti seguono l'archetipo scelto dal gruppo.

export interface BrandValue {
  label: string;
  archetype: string;
}

export const VALUE_CATALOG: BrandValue[] = [
  { label: 'Freschezza', archetype: 'innocent' },
  { label: 'Positività', archetype: 'innocent' },
  { label: 'Semplicità', archetype: 'innocent' },
  { label: 'Sisterhood', archetype: 'everyman' },
  { label: 'Autenticità', archetype: 'everyman' },
  { label: 'Inclusione', archetype: 'everyman' },
  { label: 'Vicinanza', archetype: 'everyman' },
  { label: 'Cura', archetype: 'caregiver' },
  { label: 'Rispetto', archetype: 'caregiver' },
  { label: 'Protezione', archetype: 'caregiver' },
  { label: 'Delicatezza', archetype: 'caregiver' },
  { label: 'Sicurezza di sé', archetype: 'hero' },
  { label: 'Energia', archetype: 'hero' },
  { label: 'Coraggio', archetype: 'hero' },
  { label: 'Libertà', archetype: 'explorer' },
  { label: 'Indipendenza', archetype: 'explorer' },
  { label: 'Scoperta', archetype: 'explorer' },
  { label: 'Creatività', archetype: 'creator' },
  { label: 'Innovazione', archetype: 'creator' },
  { label: 'Espressione di sé', archetype: 'creator' },
  { label: 'Specificità', archetype: 'sage' },
  { label: 'Competenza', archetype: 'sage' },
  { label: 'Educazione', archetype: 'sage' },
  { label: 'Benessere', archetype: 'magician' },
  { label: 'Equilibrio', archetype: 'magician' },
  { label: 'Trasformazione', archetype: 'magician' },
  { label: 'Intimità', archetype: 'lover' },
  { label: 'Sensorialità', archetype: 'lover' },
  { label: 'Femminilità', archetype: 'lover' },
  { label: 'Spensieratezza', archetype: 'entertainer' },
  { label: 'Leggerezza', archetype: 'entertainer' },
  { label: 'Ironia', archetype: 'entertainer' },
  { label: 'Rottura dei tabù', archetype: 'maverick' },
  { label: 'Audacia', archetype: 'maverick' },
  { label: 'Emancipazione', archetype: 'maverick' },
  { label: 'Eccellenza', archetype: 'royalty' },
  { label: 'Qualità', archetype: 'royalty' },
  { label: 'Leadership', archetype: 'royalty' },
];

/**
 * I valori che Chilly dichiara oggi: il Manifesto sul sito e il brand framework
 * (freschezza bilanciata dalla specificità). In dashboard si vede quali il team riconosce davvero.
 */
export const DECLARED_VALUES = [
  'Freschezza',
  'Spensieratezza',
  'Sisterhood',
  'Intimità',
  'Autenticità',
  'Creatività',
  'Inclusione',
  'Positività',
  'Sicurezza di sé',
  'Specificità',
  'Rispetto',
];

/** Quanti valori sceglie ogni partecipante. */
export const PICK_LIMITS = { current: 5, strengthen: 2, add: 3, custom: 2 } as const;

/** Quanti valori conferma il facilitatore per la mappa finale. */
export const CONFIRM_LIMITS = { current: 5, strengthen: 3, add: 3 } as const;

export const MAX_VALUE_LENGTH = 32;

export const valueKey = (label: string) => label.trim().replace(/\s+/g, ' ').toLocaleLowerCase('it');

export const formatValue = (label: string) => {
  const text = label.trim().replace(/\s+/g, ' ');
  return text.charAt(0).toLocaleUpperCase('it') + text.slice(1);
};

const catalogByKey = new Map(VALUE_CATALOG.map((value) => [valueKey(value.label), value]));
const declaredKeys = new Set(DECLARED_VALUES.map(valueKey));

export const isDeclaredValue = (label: string) => declaredKeys.has(valueKey(label));

export const findCatalogValue = (label: string) => catalogByKey.get(valueKey(label));

export const includesValue = (list: string[], label: string) =>
  list.some((item) => valueKey(item) === valueKey(label));

/** I valori degli archetipi indicati, nell'ordine degli archetipi. */
export function suggestedValues(archetypeIds: string[]): BrandValue[] {
  return archetypeIds.flatMap((id) => VALUE_CATALOG.filter((value) => value.archetype === id));
}

export interface ValueTally {
  key: string;
  label: string;
  votes: number;
  archetype?: string;
  /** Proposto da un partecipante, non presente nel catalogo. */
  custom: boolean;
  /** Dichiarato da Chilly nel Manifesto o nel brand framework. */
  declared: boolean;
}

/** Conta quante persone hanno scelto ciascun valore (un voto per persona, anche se scritto in modi diversi). */
export function tallyValues(lists: string[][]): ValueTally[] {
  const tallies = new Map<string, ValueTally>();
  lists.forEach((list) => {
    const seen = new Set<string>();
    list.forEach((raw) => {
      const key = valueKey(raw);
      if (!key || seen.has(key)) return;
      seen.add(key);
      const catalog = catalogByKey.get(key);
      const entry = tallies.get(key) ?? {
        key,
        label: catalog?.label ?? formatValue(raw),
        votes: 0,
        archetype: catalog?.archetype,
        custom: !catalog,
        declared: declaredKeys.has(key),
      };
      entry.votes += 1;
      tallies.set(key, entry);
    });
  });
  return [...tallies.values()].sort((a, b) => b.votes - a.votes || a.label.localeCompare(b.label, 'it'));
}
