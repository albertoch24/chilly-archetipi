export interface ArchetypeDetail {
  id: string;
  name: string;
  emoji: string;
  primaryGoal: string;
  description: string;
  voice: string[];
  pitfalls: string[];
  examples: string[];
  emotion: string;
  color: string;
}

export const archetypeDetails: Record<string, ArchetypeDetail> = {
  innocent: {
    id: "innocent",
    name: "Innocent",
    emoji: "🌸",
    primaryGoal: "Vivere nel bene, creare un mondo semplice, giusto e sereno.",
    description: "L'Innocent vede la vita con occhi limpidi: crede che la bontà porti altra bontà. Rifiuta cinismo e complessità inutili, e cerca di semplificare l'esperienza umana. Il brand Innocent promette ottimismo, trasparenza e sicurezza emotiva: una bolla di respiro in un mondo caotico.",
    voice: ["Positiva", "Rassicurante", "Pura", "Semplice"],
    pitfalls: ["Naïveté", "Evitare il conflitto", "Rischio di apparire infantile"],
    examples: ["Mulino Bianco", "Dove", "Kinder"],
    emotion: "Fiducia",
    color: "#FFE4B5"
  },
  everyman: {
    id: "everyman",
    name: "Everyman / Next Door",
    emoji: "🤝",
    primaryGoal: "Far sentire tutti parte della stessa comunità.",
    description: "Amichevole, realistico, accessibile. L'Everyman parla come il pubblico, vive come loro, combatte le stesse battaglie. Fa sentire le persone accolte, mai giudicate.",
    voice: ["Onesta", "Umile", "Pratica", "Conversazionale"],
    pitfalls: ["Mimetizzarsi troppo", "Mancanza di differenziazione", "Dipendenza dal consenso"],
    examples: ["Ford", "Esselunga", "Ikea"],
    emotion: "Vicinanza",
    color: "#8B4513"
  },
  caregiver: {
    id: "caregiver",
    name: "Caregiver",
    emoji: "💚",
    primaryGoal: "Proteggere e prendersi cura.",
    description: "Empatico fino al profondo. Il brand Caregiver mette il benessere altrui sopra al proprio. Incoraggia, sostiene, guarisce.",
    voice: ["Calda", "Premurosa", "Altruista"],
    pitfalls: ["Auto-sacrificio eccessivo", "Paternalismo", "Essere dato per scontato"],
    examples: ["Chicco", "Croce Rossa", "Pampers"],
    emotion: "Tenerezza",
    color: "#90EE90"
  },
  hero: {
    id: "hero",
    name: "Hero",
    emoji: "🦸",
    primaryGoal: "Guidare alla vittoria attraverso forza e disciplina.",
    description: "Ambizione e coraggio. Il brand Hero dimostra con i fatti. Combatte l'ingiustizia, supera sfide, ispira crescita.",
    voice: ["Assertiva", "Motivante", "Potente"],
    pitfalls: ["Arrogante", "Zero margine di errore", "Pressione costante sugli altri"],
    examples: ["Nike", "Red Bull", "Marvel"],
    emotion: "Orgoglio",
    color: "#DC143C"
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    emoji: "🧭",
    primaryGoal: "Trovare libertà al di là dei confini.",
    description: "Curiosità, viaggio, autenticità. Il brand Explorer guida verso strade meno battute e invita a scoprire chi siamo davvero.",
    voice: ["Avventurosa", "Anticonformista", "Ispirazionale"],
    pitfalls: ["Mancanza di radici", "Ricerca infinita", "Elitismo spirituale"],
    examples: ["The North Face", "Jeep", "Airbnb"],
    emotion: "Meraviglia",
    color: "#2E8B57"
  },
  creator: {
    id: "creator",
    name: "Creator",
    emoji: "🎨",
    primaryGoal: "Dare forma alle idee.",
    description: "Visionario, originale, sensibile all'estetica. Il brand Creator vuole lasciare un'opera che resista al tempo.",
    voice: ["Artistica", "Evocativa", "Immaginifica"],
    pitfalls: ["Perfezionismo", "Complessità eccessiva", "Disconnessione dal mercato"],
    examples: ["Lego", "Adobe", "Apple (fase Jobs)"],
    emotion: "Ispirazione",
    color: "#9370DB"
  },
  sage: {
    id: "sage",
    name: "Sage",
    emoji: "📚",
    primaryGoal: "Capire il mondo e rivelarne la verità.",
    description: "Razionale, studioso, guida attraverso la conoscenza. Il brand Sage educa sempre, mai in modo arrogante.",
    voice: ["Chiara", "Competente", "Documentata"],
    pitfalls: ["Troppa teoria", "Distacco emotivo", "Rischio elitismo intellettuale"],
    examples: ["Google", "National Geographic", "Wikipedia"],
    emotion: "Chiarezza",
    color: "#4169E1"
  },
  magician: {
    id: "magician",
    name: "Magician",
    emoji: "✨",
    primaryGoal: "Trasformare la realtà e il potenziale delle persone.",
    description: "Trascende il visibile. Il brand Magician crea esperienze di stupore, trasformazione, guarigione o innovazione radicale.",
    voice: ["Visionaria", "Misteriosa", "Ispirazionale"],
    pitfalls: ["Segretezza eccessiva", "Promesse 'miracolose'", "Percezione di manipolazione"],
    examples: ["Disney", "Tesla", "Mastercard 'Priceless'"],
    emotion: "Stupore",
    color: "#8A2BE2"
  },
  lover: {
    id: "lover",
    name: "Lover",
    emoji: "❤️",
    primaryGoal: "Generare connessione, intensità, attenzione alla bellezza.",
    description: "Il brand Lover seduce attraverso estetica, cura dei dettagli, intimità. Promette piacere, piacere di vivere, relazione.",
    voice: ["Sensuale", "Emozionale", "Elegante"],
    pitfalls: ["Eccesso di romanticizzazione", "Gelosia del pubblico", "Apparenza > sostanza"],
    examples: ["Chanel", "Victoria's Secret", "Martini"],
    emotion: "Desiderio",
    color: "#FF1493"
  },
  entertainer: {
    id: "entertainer",
    name: "Entertainer (Jester)",
    emoji: "🎭",
    primaryGoal: "Portare leggerezza e divertimento.",
    description: "Il brand Entertainer fa ridere, sorprende, libera. Usa l'umorismo come forma di verità e connessione.",
    voice: ["Ironica", "Playful", "Brillante"],
    pitfalls: ["Percepito come poco serio", "Shock gratuito", "Strategia debole dietro la battuta"],
    examples: ["Netflix", "Ceres", "Skittles"],
    emotion: "Gioia",
    color: "#FFD700"
  },
  maverick: {
    id: "maverick",
    name: "Maverick (Rebel)",
    emoji: "🔥",
    primaryGoal: "Rompere le regole per liberare nuove possibilità.",
    description: "Anticonformista, provocatore, rivoluzionario. Il brand Maverick attacca lo status quo e si schiera sempre.",
    voice: ["Diretta", "Audace", "Estrema"],
    pitfalls: ["Ribellione fine a sé stessa", "Rischio reputazionale alto", "Polarizzazione del pubblico"],
    examples: ["Diesel", "Harley-Davidson", "OBEY"],
    emotion: "Trasgressione",
    color: "#FF4500"
  },
  royalty: {
    id: "royalty",
    name: "Royalty (Ruler)",
    emoji: "👑",
    primaryGoal: "Fornire ordine e successi tangibili, guidando dall'alto.",
    description: "Leadership, controllo, lusso. Il brand Royalty promette eccellenza e stabilità. È ciò a cui si aspira.",
    voice: ["Autorevole", "Precisa", "Prestigiosa"],
    pitfalls: ["Snobismo", "Distanza emotiva", "Pressione sul 'perfetto'"],
    examples: ["Rolex", "BMW", "Louis Vuitton"],
    emotion: "Ammirazione",
    color: "#DAA520"
  }
};

// Mapping delle risposte agli archetipi (basato sulle caratteristiche delle opzioni)
export const answerArchetypeMapping: Record<string, string> = {
  // Domanda 1 - Punto di forza
  "1a": "everyman",      // relazione con gli altri
  "1b": "explorer",      // curiosità
  "1c": "hero",          // far sentire più forti
  "1d": "lover",         // personalità magnetica
  "1e": "innocent",      // seguire il cuore
  "1f": "creator",       // immaginazione
  "1g": "caregiver",     // compassione
  "1h": "sage",          // lavorare per migliorare
  "1i": "royalty",       // forte senso di identità
  
  // Domanda 2 - Persona in linea con missione
  "2a": "hero",          // atleta
  "2b": "everyman",      // migliore amico
  "2c": "maverick",      // rivoluzionario
  "2d": "magician",      // istruttore yoga
  "2e": "lover",         // stilista
  "2f": "explorer",      // guida turistica
  "2g": "caregiver",     // infermiere
  "2h": "royalty",       // imprenditore
  "2i": "entertainer",   // comico
  
  // Domanda 3 - Debolezza
  "3a": "lover",         // gestire emozioni
  "3b": "maverick",      // superare il limite
  "3c": "magician",      // ignorare consigli pratici
  "3d": "royalty",       // difficoltà con persona comune
  "3e": "everyman",      // perdere identità
  "3f": "creator",       // organizzazione
  "3g": "entertainer",   // costanza
  "3h": "caregiver",     // dire di no
  "3i": "sage",          // capire valori altri
  
  // Domanda 4 - Personaggio
  "4a": "creator",       // Geppetto
  "4b": "maverick",      // Jack Sparrow
  "4c": "magician",      // Fata Madrina
  "4d": "sage",          // Sherlock Holmes
  "4e": "innocent",      // Dorothy
  "4f": "explorer",      // Luke Skywalker
  "4g": "entertainer",   // Bugs Bunny
  "4h": "hero",          // Aladdin
  "4i": "lover",         // Romeo & Giulietta
  
  // Domanda 5 - Valore principale
  "5a": "everyman",      // comunità
  "5b": "lover",         // bellezza
  "5c": "entertainer",   // vivere il momento
  "5d": "sage",          // verità universale
  "5e": "caregiver",     // generosità
  "5f": "maverick",      // audacia
  "5g": "magician",      // evoluzione
  "5h": "innocent",      // semplicità
  "5i": "creator",       // unicità
  "5j": "royalty",       // eccellenza
  "5k": "explorer",      // scoperta
  "5l": "hero",          // coraggio
  
  // Domanda 6 - Tono di voce
  "6a": "sage",          // fattuale
  "6b": "magician",      // ispirazionale
  "6c": "explorer",      // interrogativo
  "6d": "lover",         // intuitivo
  "6e": "innocent",      // semplice
  "6f": "everyman",      // pratico
  
  // Domanda 7 - Personalità
  "7a": "hero",          // forte
  "7b": "caregiver",     // gentile
  "7c": "maverick",      // diretto e sincero
  "7d": "lover",         // appassionato
  "7e": "entertainer",   // divertente
  "7f": "innocent",      // ottimista, puro
  "7g": "everyman",      // alla mano
  "7h": "sage",          // analitico, saggio
  "7i": "maverick",      // audace
  "7j": "hero",          // determinato
  "7k": "magician",      // quasi divino
  "7l": "creator",       // immaginativo
  "7m": "caregiver",     // premuroso
  "7n": "explorer",      // avventuroso
  "7o": "magician",      // misterioso
  "7p": "entertainer",   // giocherellone
  "7q": "royalty",       // raffinato
  
  // Domanda 8 - Contenuti
  "8a": "hero",          // motivazionali
  "8b": "everyman",      // community
  "8c": "maverick",      // denunce
  "8d": "royalty",       // casi studio successo
  "8e": "entertainer",   // meme
  "8f": "sage",          // articoli documentati
  "8g": "explorer",      // nuove esperienze
  "8h": "magician",      // citazioni ispirazionali
  
  // Domanda 9 - Come aiuta clienti
  "9a": "magician",      // risorse dentro di sé
  "9b": "sage",          // cambiare prospettiva
  "9c": "everyman",      // condividere esperienze
  "9d": "hero",          // insegnare visione
  "9e": "caregiver",     // spazio sicuro
  
  // Domanda 10 - Luogo
  "10a": "entertainer",  // parco divertimenti
  "10b": "hero",         // palestra
  "10c": "explorer",     // luna
  "10d": "sage",         // biblioteca
  "10e": "lover",        // città romantica
  "10f": "innocent",     // cucina accogliente
  "10g": "creator",      // studio artista
  "10h": "royalty",      // attico lusso
  "10i": "everyman",     // concerto
  
  // Domanda 11 - Obiettivo principale
  "11a": "explorer",     // creare libertà
  "11b": "hero",         // motivare
  "11c": "creator",      // creare qualcosa nuovo
  "11d": "royalty",      // successo e influenza
  "11e": "maverick",     // modo diverso di pensare
  "11f": "caregiver",    // aiutare persone
  "11g": "everyman",     // costruire comunità
  "11h": "magician",     // trasformare vita
  "11i": "entertainer",  // godersi la vita
  "11j": "sage",         // trovare verità
  "11k": "innocent",     // tornare essenziale
  "11l": "lover",        // vivere con passione
  
  // Domanda 12 - Simbolo
  "12a": "lover",        // cuore
  "12b": "entertainer",  // maschere
  "12c": "innocent",     // smiley
  "12d": "hero",         // scudo
  "12e": "everyman",     // gruppo persone
  "12f": "magician",     // stella magica
  "12g": "maverick",     // pugno
  "12h": "explorer",     // infinito
  "12i": "sage",         // tocco laurea
  "12j": "royalty",      // corona
  "12k": "creator",      // pennello
  "12l": "caregiver",    // figure con cuore
  
  // Domanda 13 - Paura
  "13a": "hero",         // non raggiungere obiettivi
  "13b": "caregiver",    // deludere
  "13c": "maverick",     // mettere in discussione valori
  "13d": "creator",      // non essere diverso
  
  // Domanda 14 - Immagine
  "14a": "royalty",      // persona elegante
  "14b": "explorer",     // libertà
  "14c": "innocent",     // fragilità e bellezza
  "14d": "entertainer",  // festa
  "14e": "caregiver",    // cura e crescita
  "14f": "creator",      // diversità e ricchezza
  "14g": "sage",         // strategia
  "14h": "magician",     // meraviglia
  "14i": "everyman",     // team collaborazione
  
  // Domanda 15 - Convinzione
  "15a": "hero",         // lavorare sodo
  "15b": "royalty",      // obiettivi chiari
  "15c": "caregiver",    // donando
  "15d": "maverick",     // popolare è sbagliato
  "15e": "explorer",     // disagio stimola crescita
  "15f": "magician",     // equilibrio dentro
  
  // Domanda 16 - Affermazione
  "16a": "lover",        // follow passion
  "16b": "royalty",      // non accettare meno
  "16c": "magician",     // cambiamento alla portata
  "16d": "sage",         // conoscenza chiave
  "16e": "creator",      // immaginazione e passione
  "16f": "entertainer",  // YOLO
};

export interface ArchetypeScore {
  archetype: string;
  /** Risposte scelte dal gruppo (flag del facilitatore) che puntano a questo archetipo. */
  flagged: number;
  /** Risposte individuali di tutti i partecipanti che puntano a questo archetipo. */
  individual: number;
  /** Quota sulle risposte scelte dal gruppo. */
  percentage: number;
  /** Quota sulle risposte individuali. */
  individualPercentage: number;
}

function countByArchetype(optionIds: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  optionIds.forEach((optionId) => {
    const archetype = answerArchetypeMapping[optionId];
    if (archetype) counts[archetype] = (counts[archetype] || 0) + 1;
  });
  return counts;
}

/**
 * Classifica i 12 archetipi: decidono le scelte del gruppo, le risposte individuali
 * rompono i pareggi. Il primo è l'archetipo primario, il secondo il secondario.
 */
export function rankArchetypes(
  flaggedAnswers: Record<number, string>,
  responses: { answers: Record<number, string> }[],
): ArchetypeScore[] {
  const flaggedIds = Object.values(flaggedAnswers);
  const individualIds = responses.flatMap((r) => Object.values(r.answers));
  const flagged = countByArchetype(flaggedIds);
  const individual = countByArchetype(individualIds);

  return Object.keys(archetypeDetails)
    .map((archetype) => ({
      archetype,
      flagged: flagged[archetype] || 0,
      individual: individual[archetype] || 0,
      percentage: flaggedIds.length ? Math.round(((flagged[archetype] || 0) / flaggedIds.length) * 100) : 0,
      individualPercentage: individualIds.length
        ? Math.round(((individual[archetype] || 0) / individualIds.length) * 100)
        : 0,
    }))
    .sort((a, b) => b.flagged - a.flagged || b.individual - a.individual);
}

/** Archetipo primario e secondario, solo se il gruppo ha già scelto qualche risposta. */
export function getArchetypePair(ranking: ArchetypeScore[]) {
  const [primary, secondary] = ranking;
  return {
    primary: primary && primary.flagged > 0 ? archetypeDetails[primary.archetype] : null,
    secondary: secondary && secondary.flagged > 0 ? archetypeDetails[secondary.archetype] : null,
  };
}
