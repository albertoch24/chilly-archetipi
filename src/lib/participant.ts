import { WORKSHOP } from '@/config/workshop';

export interface Participant {
  id: string;
  name: string;
}

const KEY = `${WORKSHOP.id}-workshop:participant`;

export function loadParticipant(): Participant | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Participant) : null;
  } catch {
    return null;
  }
}

/**
 * Lo stesso id accompagna il partecipante in tutti gli esercizi: così un secondo invio
 * sui valori sostituisce il primo invece di contare due volte.
 */
export function saveParticipant(name: string): Participant {
  const existing = loadParticipant();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'partecipante';
  const participant = existing?.name === name ? existing : { id: `${slug}-${Date.now().toString(36)}`, name };
  try {
    localStorage.setItem(KEY, JSON.stringify(participant));
  } catch {
    // Senza storage il partecipante resta valido solo per questa pagina.
  }
  return participant;
}
