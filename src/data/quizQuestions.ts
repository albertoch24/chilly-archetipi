export interface QuizOption {
  id: string;
  text: string;
  archetype?: string;
  image?: string;
  icon?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  hasImages?: boolean;
  hasIcons?: boolean;
}

// Le immagini arrivano dal bucket pubblico del workshop Si Vola; VITE_QUIZ_IMAGES_URL punta a una copia propria.
const STORAGE_BASE_URL =
  (import.meta.env.VITE_QUIZ_IMAGES_URL as string | undefined) ||
  "https://zfrxeenipbkmssnouyzd.supabase.co/storage/v1/object/public/quiz-images";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual è il punto di forza più grande di Chilly?",
    options: [
      { id: "1a", text: "La capacità di entrare in relazione con gli altri" },
      { id: "1b", text: "Curiosità" },
      { id: "1c", text: "Far sentire gli altri più forti e capaci" },
      { id: "1d", text: "La sua personalità magnetica" },
      { id: "1e", text: "Seguire sempre il cuore" },
      { id: "1f", text: "Immaginazione" },
      { id: "1g", text: "Compassione" },
      { id: "1h", text: "Lavorare sempre per migliorare" },
      { id: "1i", text: "Forte senso di identità" },
    ],
  },
  {
    id: 2,
    question: "Quale di queste persone è più in linea con la missione di Chilly?",
    hasImages: true,
    options: [
      { id: "2a", text: "Atleta", image: `${STORAGE_BASE_URL}/professioni/atleta.png` },
      { id: "2b", text: "Migliore amico/a", image: `${STORAGE_BASE_URL}/professioni/migliore-amico.png` },
      { id: "2c", text: "Rivoluzionario/a", image: `${STORAGE_BASE_URL}/professioni/rivoluzionario.png` },
      { id: "2d", text: "Istruttore/trice di yoga", image: `${STORAGE_BASE_URL}/professioni/istruttore-yoga.png` },
      { id: "2e", text: "Stilista / consulente", image: `${STORAGE_BASE_URL}/professioni/stilista.png` },
      { id: "2f", text: "Guida turistica", image: `${STORAGE_BASE_URL}/professioni/guida-turistica.png` },
      { id: "2g", text: "Infermiere/a", image: `${STORAGE_BASE_URL}/professioni/infermiere.png` },
      { id: "2h", text: "Imprenditore", image: `${STORAGE_BASE_URL}/professioni/imprenditore.png` },
      { id: "2i", text: "Comico/a", image: `${STORAGE_BASE_URL}/professioni/comico.png` },
    ],
  },
  {
    id: 3,
    question: "Qual è la debolezza principale di Chilly?",
    options: [
      { id: "3a", text: "Gestire le emozioni" },
      { id: "3b", text: "Superare troppo spesso il limite" },
      { id: "3c", text: "Ignorare i consigli pratici" },
      { id: "3d", text: "Difficoltà a relazionarsi con la persona comune" },
      { id: "3e", text: "Rischiare di perdere la propria identità" },
      { id: "3f", text: "Organizzazione" },
      { id: "3g", text: "Costanza e impegno nel lungo periodo" },
      { id: "3h", text: "Dire di no" },
      { id: "3i", text: "Difficoltà a capire i valori o le convinzioni degli altri" },
    ],
  },
  {
    id: 4,
    question: "Quale personaggio rappresenta meglio Chilly?",
    hasImages: true,
    options: [
      { id: "4a", text: "Geppetto - Artigiano", image: `${STORAGE_BASE_URL}/personaggi/geppetto.png` },
      { id: "4b", text: "Jack Sparrow - Eccentrico", image: `${STORAGE_BASE_URL}/personaggi/jack-sparrow.png` },
      { id: "4c", text: "Fata Madrina - Materna", image: `${STORAGE_BASE_URL}/personaggi/fata-madrina.png` },
      { id: "4d", text: "Sherlock Holmes - Indagatore", image: `${STORAGE_BASE_URL}/personaggi/sherlock-holmes.png` },
      { id: "4e", text: "Dorothy - Positiva", image: `${STORAGE_BASE_URL}/personaggi/dorothy.png` },
      { id: "4f", text: "Luke Skywalker - Avventuroso", image: `${STORAGE_BASE_URL}/personaggi/luke-skywalker.png` },
      { id: "4g", text: "Bugs Bunny - Furbo", image: `${STORAGE_BASE_URL}/personaggi/bugs-bunny.png` },
      { id: "4h", text: "Aladdin - Ingegnoso", image: `${STORAGE_BASE_URL}/personaggi/aladdin.png` },
      { id: "4i", text: "Romeo & Giulietta - Romantici", image: `${STORAGE_BASE_URL}/personaggi/romeo-giulietta.png` },
    ],
  },
  {
    id: 5,
    question: "Qual è il valore principale di Chilly?",
    options: [
      { id: "5a", text: "Comunità" },
      { id: "5b", text: "Bellezza" },
      { id: "5c", text: "Vivere il momento" },
      { id: "5d", text: "Verità universale" },
      { id: "5e", text: "Generosità" },
      { id: "5f", text: "Audacia" },
      { id: "5g", text: "Evoluzione" },
      { id: "5h", text: "Semplicità" },
      { id: "5i", text: "Unicità" },
      { id: "5j", text: "Eccellenza" },
      { id: "5k", text: "Scoperta" },
      { id: "5l", text: "Coraggio" },
    ],
  },
  {
    id: 6,
    question: "Che tono di voce usa Chilly quando parla alle persone?",
    options: [
      { id: "6a", text: "Fattuale" },
      { id: "6b", text: "Ispirazionale" },
      { id: "6c", text: "Interrogativo, fa domande" },
      { id: "6d", text: "Intuitivo" },
      { id: "6e", text: "Semplice" },
      { id: "6f", text: "Pratico" },
    ],
  },
  {
    id: 7,
    question: "Come descriveresti la personalità di Chilly?",
    options: [
      { id: "7a", text: "Forte" },
      { id: "7b", text: "Gentile" },
      { id: "7c", text: "Diretto e sincero" },
      { id: "7d", text: "Appassionato" },
      { id: "7e", text: "Divertente" },
      { id: "7f", text: "Ottimista, puro" },
      { id: "7g", text: "Alla mano, amichevole" },
      { id: "7h", text: "Analitico, saggio" },
      { id: "7i", text: "Audace, senza freni" },
      { id: "7j", text: "Determinato, disciplinato" },
      { id: "7k", text: "Appassionato, quasi divino" },
      { id: "7l", text: "Immaginativo, vibrante" },
      { id: "7m", text: "Premuroso, generoso" },
      { id: "7n", text: "Ingegnoso, avventuroso" },
      { id: "7o", text: "Intuitivo, misterioso" },
      { id: "7p", text: "Giocherellone, magnetico" },
      { id: "7q", text: "Raffinato, influente" },
    ],
  },
  {
    id: 8,
    question: "Che tipo di contenuti vuole creare Chilly?",
    options: [
      { id: "8a", text: "Contenuti motivazionali" },
      { id: "8b", text: "Modi per far connettere le persone (community, gruppi, eventi)" },
      { id: "8c", text: "Prese di posizione contro tabù e pregiudizi sul corpo" },
      { id: "8d", text: "Storie di successo e di eccellenza" },
      { id: "8e", text: "Meme e video divertenti" },
      { id: "8f", text: "Guide e articoli ben documentati, anche con esperti" },
      { id: "8g", text: "Nuove esperienze e rituali da far provare alle persone" },
      { id: "8h", text: "Frasi e citazioni ispirazionali" },
    ],
  },
  {
    id: 9,
    question: "In che modo Chilly aiuta le persone ad affrontare i loro momenti delicati?",
    options: [
      { id: "9a", text: "Incoraggiandole a trovare dentro di sé le risorse per superare le sfide" },
      { id: "9b", text: "Aiutandole a cambiare prospettiva e a vedere i problemi in modo nuovo" },
      { id: "9c", text: "Condividendo esperienze vissute, da pari a pari" },
      { id: "9d", text: "Mostrando con decisione la strada per risolvere il problema" },
      { id: "9e", text: "Offrendo uno spazio sicuro in cui parlare di ciò che le mette a disagio" },
    ],
  },
  {
    id: 10,
    question: "Quale di questi luoghi 'somiglia' di più a Chilly?",
    hasImages: true,
    options: [
      { id: "10a", text: "Parco divertimenti", image: `${STORAGE_BASE_URL}/luoghi/parco-divertimenti.png` },
      { id: "10b", text: "Palestra", image: `${STORAGE_BASE_URL}/luoghi/palestra.png` },
      { id: "10c", text: "Superficie della luna", image: `${STORAGE_BASE_URL}/luoghi/superficie-luna.png` },
      { id: "10d", text: "Biblioteca silenziosa", image: `${STORAGE_BASE_URL}/luoghi/biblioteca.png` },
      { id: "10e", text: "Parigi romantica", image: `${STORAGE_BASE_URL}/luoghi/parigi.png` },
      { id: "10f", text: "Cucina luminosa", image: `${STORAGE_BASE_URL}/luoghi/cucina.png` },
      { id: "10g", text: "Studio d'artista", image: `${STORAGE_BASE_URL}/luoghi/studio-artista.png` },
      { id: "10h", text: "Attico di lusso", image: `${STORAGE_BASE_URL}/luoghi/attico-lusso.png` },
      { id: "10i", text: "Grande concerto", image: `${STORAGE_BASE_URL}/luoghi/grande-concerto.png` },
    ],
  },
  {
    id: 11,
    question: "Qual è l'obiettivo principale di Chilly?",
    options: [
      { id: "11a", text: "Dare alle persone più libertà" },
      { id: "11b", text: "Motivare gli altri a dare il meglio di sé" },
      { id: "11c", text: "Creare qualcosa di nuovo e frutto dell'immaginazione" },
      { id: "11d", text: "Raggiungere leadership e influenza" },
      { id: "11e", text: "Promuovere un modo diverso di pensare" },
      { id: "11f", text: "Aiutare quante più persone possibile" },
      { id: "11g", text: "Costruire una comunità" },
      { id: "11h", text: "Trasformare la vita delle persone" },
      { id: "11i", text: "Aiutare le persone a godersi la vita" },
      { id: "11j", text: "Trovare e condividere la verità" },
      { id: "11k", text: "Tornare all'essenziale e mantenere le cose naturali" },
      { id: "11l", text: "Vivere la vita con passione" },
    ],
  },
  {
    id: 12,
    question: "Quale simbolo rappresenta meglio Chilly?",
    hasIcons: true,
    options: [
      { id: "12a", text: "Cuore con battito", icon: "HeartPulse" },
      { id: "12b", text: "Maschere teatrali", icon: "Drama" },
      { id: "12c", text: "Faccina sorridente", icon: "Smile" },
      { id: "12d", text: "Scudo", icon: "Shield" },
      { id: "12e", text: "Gruppo di persone", icon: "Users" },
      { id: "12f", text: "Stella magica", icon: "Sparkles" },
      { id: "12g", text: "Pugno alzato", icon: "Hand" },
      { id: "12h", text: "Simbolo infinito", icon: "Infinity" },
      { id: "12i", text: "Tocco da laurea", icon: "GraduationCap" },
      { id: "12j", text: "Corona", icon: "Crown" },
      { id: "12k", text: "Pennello", icon: "Paintbrush" },
      { id: "12l", text: "Due figure vicine", icon: "HeartHandshake" },
    ],
  },
  {
    id: 13,
    question: "Qual è la paura più grande per Chilly?",
    options: [
      { id: "13a", text: "Non raggiungere ciò che si è prefissata" },
      { id: "13b", text: "Deludere le persone che si fidano di lei" },
      { id: "13c", text: "Che qualcuno metta in discussione i suoi valori" },
      { id: "13d", text: "Scoprire di non essere diversa dalla concorrenza" },
    ],
  },
  {
    id: 14,
    question: "Quale di queste immagini 'ti sembra' più vicina a Chilly?",
    hasImages: true,
    options: [
      { id: "14a", text: "Look iconico", image: `${STORAGE_BASE_URL}/scene/look-iconico.png` },
      { id: "14b", text: "Libertà", image: `${STORAGE_BASE_URL}/scene/liberta.png` },
      { id: "14c", text: "Fragilità e bellezza", image: `${STORAGE_BASE_URL}/scene/fragilita-bellezza.png` },
      { id: "14d", text: "Celebrazione", image: `${STORAGE_BASE_URL}/scene/celebrazione.png` },
      { id: "14e", text: "Cura e crescita", image: `${STORAGE_BASE_URL}/scene/cura-crescita.png` },
      { id: "14f", text: "Diversità e ricchezza", image: `${STORAGE_BASE_URL}/scene/diversita-ricchezza.png` },
      { id: "14g", text: "Strategia", image: `${STORAGE_BASE_URL}/scene/strategia.png` },
      { id: "14h", text: "Meraviglia", image: `${STORAGE_BASE_URL}/scene/meraviglia.png` },
      { id: "14i", text: "Collaborazione", image: `${STORAGE_BASE_URL}/scene/collaborazione.png` },
    ],
  },
  {
    id: 15,
    question: "Quale di queste frasi descrive meglio ciò che Chilly crede del mondo?",
    options: [
      { id: "15a", text: "Devi lavorare sodo per ottenere ciò che vuoi" },
      { id: "15b", text: "Puoi superare qualsiasi sfida fissando obiettivi chiari" },
      { id: "15c", text: "Donando ciò che puoi, avrai sempre abbastanza" },
      { id: "15d", text: "Ciò che è popolare è spesso sbagliato" },
      { id: "15e", text: "Sentirsi un po' a disagio e fuori posto stimola la crescita" },
      { id: "15f", text: "Diventiamo interi e felici trovando equilibrio dentro di noi" },
    ],
  },
  {
    id: 16,
    question: "Quale di queste frasi potrebbe firmare Chilly?",
    options: [
      { id: "16a", text: "Segui le tue passioni e ascolta il cuore" },
      { id: "16b", text: "Non accettare mai meno di quanto vali" },
      { id: "16c", text: "Sei capace di più di quanto pensi: il cambiamento è alla tua portata" },
      { id: "16d", text: "La conoscenza è la chiave di tutto" },
      { id: "16e", text: "Immaginazione e vera passione sono tutto ciò di cui hai bisogno" },
      { id: "16f", text: "Si vive una volta sola (#YOLO)" },
    ],
  },
];
