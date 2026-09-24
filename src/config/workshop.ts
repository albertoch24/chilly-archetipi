// Tutto ciò che cambia da un workshop all'altro sta qui.

export const BRAND_NAME = 'Chilly';

export const WORKSHOP = {
  title: 'Workshop Global Ambassador',
  duration: '90 minuti',
  // Data mostrata in home (es. "15 ottobre 2026"); vuota = nascosta.
  date: (import.meta.env.VITE_WORKSHOP_DATE as string | undefined) ?? '',
  // Namespace dei dati su Supabase: tiene separati workshop diversi sullo stesso backend.
  id: (import.meta.env.VITE_WORKSHOP_ID as string | undefined) || 'chilly',
  // Password facoltativa per entrare nel sito; vuota = accesso libero.
  password: (import.meta.env.VITE_WORKSHOP_PASSWORD as string | undefined) ?? '',
};
