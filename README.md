# Chilly · Workshop Global Ambassador

Sito del workshop con i team Marketing Chilly: tre esercizi per definire insieme **archetipo di marca**, **valori attuali** e **valori obiettivo**, la base su cui scegliere il Global Ambassador.

È un fork di Brand Compass ([sivola](https://github.com/albertoch24/sivola)), con lo stesso stack: Vite, React, shadcn/ui e Supabase. È compatibile con Lovable.

## Il flusso in sala

| Momento | Partecipanti (telefono) | Facilitatore (proiettore) |
| --- | --- | --- |
| Esercizio 1 | `/archetypes`: nome e 16 domande | `/archetypes/results`: risultati per domanda. "Scegli" fissa la risposta del gruppo; l'interruttore mostra gli archetipi solo dopo la discussione |
| Risultato | — | `/archetypes/archetype`: primario, secondario, archetipi esclusi, scelte del gruppo contro risposte individuali |
| Esercizio 2 | `/valori/attuali`: fino a 5 valori, più 2 propri | `/valori/facilitatore`, scheda 2: conferma da 3 a 5 valori. Segnala i valori dichiarati da Chilly che nessuno ha scelto |
| Esercizio 3 | `/valori/obiettivo`: fino a 2 valori da potenziare e 3 da acquisire | `/valori/facilitatore`, scheda 3: conferma fino a 3 + 3 |
| Mappa | — | `/valori/mappa`: diagramma oggi/domani e brief per lo scouting, da copiare come testo o JSON |

La home (`/`) raccoglie i tre esercizi e, in fondo, i link dell'area facilitatore.

## Avvio in locale

```sh
npm install
npm run dev   # http://localhost:8080
```

Senza le variabili Supabase il sito parte in **modalità dimostrativa**: i dati restano nel browser (un banner lo segnala). Serve per provare il flusso, non per la sala.

## Collegare Supabase per la sala

**Opzione A, progetto nuovo (consigliata).** Importa la cartella in un nuovo progetto Lovable, oppure crea un progetto Supabase e applica tutte le migrazioni in `supabase/migrations`. Poi compila `.env` partendo da `.env.example`.

**Opzione B, stesso backend di Si Vola.** Applica solo `supabase/migrations/20260924120000_workshop_namespace.sql` al progetto esistente e usa le sue credenziali.
- `VITE_WORKSHOP_ID=chilly` tiene separati i dati: le righe di Si Vola restano marcate `sivola`.
- `supabase/config.toml` punta ancora al progetto di Si Vola.

## Variabili d'ambiente

| Variabile | Obbligatoria | A cosa serve |
| --- | --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Sì, per la sala | Backend condiviso; senza, modalità dimostrativa |
| `VITE_WORKSHOP_ID` | No (default `chilly`) | Namespace dei dati |
| `VITE_WORKSHOP_DATE` | No | Data mostrata in home, per esempio "15 ottobre 2026" |
| `VITE_WORKSHOP_PASSWORD` | No | Filtro d'accesso leggero (vedi Sicurezza) |
| `VITE_QUIZ_IMAGES_URL` | No | Copia propria delle immagini del quiz. Il default è il bucket pubblico di Si Vola |

## Prima del workshop

- [ ] Azzera i dati dalla dashboard del quiz con "Azzera". Cancella solo il workshop corrente.
- [ ] Imposta la data, ed eventualmente la password, e ripubblica.
- [ ] Prepara il link e il QR code sul proiettore.
- [ ] Prova il giro completo con due telefoni: quiz, valori attuali, valori obiettivo.

## Dove si personalizza

| File | Cosa contiene |
| --- | --- |
| `src/config/workshop.ts` | Nome del brand, titolo, durata |
| `src/data/quizQuestions.ts` | Le 16 domande (la mappatura sugli archetipi è in `archetypeData.ts`) |
| `src/data/valuesData.ts` | Catalogo dei valori, valori dichiarati da Chilly, limiti di scelta |
| `src/components/BrandMark.tsx` | Wordmark tipografico. Si sostituisce qui con il logo ufficiale |
| `src/index.css` | Palette e font, dal media brief 2027 e da chilly-intimate.com |

## Sicurezza

- Come in Si Vola, le policy RLS sono aperte. Chi ha l'URL e la chiave pubblica può leggere, scrivere e cancellare. Va bene per un workshop di 90 minuti, non per dati sensibili.
- La password facoltativa finisce nel bundle JavaScript: è un filtro contro i visitatori casuali, non una protezione.
- Non inserire nel sito dati riservati del media brief, come budget o quote di mercato.

## Cosa cambia rispetto a Si Vola

- Brand, look & feel e contenuti Chilly; domande adattate alla categoria.
- Esercizi 2 e 3 sui valori, e mappa finale. Nuove tabelle `value_votes` e `value_selections`.
- Archetipo primario e secondario: i pareggi li rompono le risposte individuali. In più, gli archetipi esclusi.
- Namespace per workshop su Supabase, e modalità dimostrativa senza backend.
- Rimossi il Brand Passport e l'admin delle immagini.
- Il reset si fa solo dalla dashboard, non più dalla home dei partecipanti.
- Ogni domanda e ogni pagina ripartono dall'alto.
- Si importano solo le icone usate: il bundle scende da 1,1 MB a 480 KB.
