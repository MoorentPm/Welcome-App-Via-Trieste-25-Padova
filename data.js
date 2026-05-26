// data.js — Elegant Loft, Padova
// Copy in warm "local friend" tone, multilingua-ready structure.

window.APARTMENT = {
  name: "Elegant Loft",
  city: "Padova",
  address: "Via Trieste, 25 — Padova",
  host: { name: "Mattia", phone: "+39 351 988 6489", avatar: "M" },
  wifi: { ssid: "ElegantLoft_WIFI", password: "Civico25" },
  checkin: { from: "15:00", to: "22:00" },
  checkout: { until: "10:00" },
  tax: "€3/persona/notte, max 5 notti",
  guest: { firstName: "Giulia", nights: 3, checkoutDate: "Ven 24 apr" },
  website: "moorentpm.it",
  pmName: "MooRent",
  pmTagline: "Gestione affitti brevi a Padova e provincia",
};

// Mood categories for itinerary — no form, just taps
window.MOODS = [
  { id: "slow",  emoji: "☕", label: "Slow day",       sub: "Caffè, piazze, passeggiate" },
  { id: "art",   emoji: "🎨", label: "Arte & storia",  sub: "Giotto, Palladio, musei" },
  { id: "food",  emoji: "🍝", label: "Mangio bene",     sub: "Bacari, spritz, trattorie" },
  { id: "green", emoji: "🌿", label: "Verde & calma",   sub: "Orto botanico, Prato" },
  { id: "night", emoji: "🌙", label: "Dopocena",       sub: "Locali, movida leggera" },
  { id: "rain",  emoji: "☔", label: "Piove, che fo?", sub: "Indoor, musei, caffè" },
];

// Today suggestions — pre-cooked, context-aware
window.TODAY_PICKS = [
  {
    id: "pedrocchi",
    title: "Un caffè al Pedrocchi",
    sub: "Il caffè 'senza porte' dal 1831. Prova la menta.",
    meta: "7 min a piedi · Aperto ora",
    tag: "Iconico",
    tint: "#CFB487",
  },
  {
    id: "scrovegni",
    title: "Cappella degli Scrovegni",
    sub: "Giotto. 20 minuti dentro cambiano la giornata.",
    meta: "Prenota 15:00 · €14",
    tag: "Must-see",
    tint: "#7E6CE8",
  },
  {
    id: "spritz",
    title: "Spritz in Piazza delle Erbe",
    sub: "Alle 18 la piazza si riempie. Trova un tavolo prima.",
    meta: "12 min · da €3.50",
    tag: "Come i locali",
    tint: "#E08762",
  },
];

window.PLACES = [
  { id: "scrovegni", name: "Cappella degli Scrovegni",  sub: "Giotto · prenotazione obbligatoria", dist: "12 min a piedi", tag: "Arte" },
  { id: "prato",     name: "Prato della Valle",          sub: "La piazza più grande d'Europa",      dist: "8 min a piedi",  tag: "Iconico" },
  { id: "orto",      name: "Orto Botanico",              sub: "Patrimonio UNESCO dal 1545",         dist: "10 min a piedi", tag: "Verde" },
  { id: "basilica",  name: "Basilica di Sant'Antonio",   sub: "Il Santo — pellegrinaggio storico",  dist: "15 min a piedi", tag: "Storia" },
  { id: "pedrocchi", name: "Caffè Pedrocchi",            sub: "Dal 1831, simbolo della città",      dist: "7 min a piedi",  tag: "Cibo" },
  { id: "ragione",   name: "Palazzo della Ragione",      sub: "Mercati storici attorno",            dist: "9 min a piedi",  tag: "Storia" },
];

window.FOOD = [
  { name: "Osteria dei Fabbri",    tag: "Trattoria",   meta: "8 min · €€", sub: "Pasta fatta in casa, vibe locale" },
  { name: "Dalla Zita",             tag: "Tramezzini", meta: "6 min · €",  sub: "80+ tramezzini, storia vivente" },
  { name: "Bar Nazionale",          tag: "Spritz",     meta: "5 min · €",  sub: "Piazza delle Erbe, il migliore" },
  { name: "Pasticceria Graziati",   tag: "Dolci",      meta: "9 min · €",  sub: "Dal 1919. Sconto 10% per te" },
];

window.CHECKIN_STEPS = [
  { t: "Raggiungi Via Trieste 25", d: "5 min a piedi dalla stazione. Cerca il civico blu.", img: "Foto: facciata" },
  { t: "Portone esterno",          d: "Codice 25#. Premi a fondo fino al click.",            img: "Foto: portone" },
  { t: "Cassetta",                 d: "Prendi le chiavi dalla cassetta 5. Codice 0425.",     img: "Foto: cassetta" },
  { t: "Secondo piano",            d: "Prendi l'ascensore o le scale. Porta con targhetta 'Elegant Loft'.", img: "Foto: porta" },
  { t: "Benvenuto!",               d: "Luci a sinistra entrando. Wi-Fi nella Home.",          img: "Foto: interno" },
];

window.HOUSE_RULES = [
  { icon: "🚭", t: "Non si fuma in casa",      d: "Né sigarette, né elettroniche, né altro. Sanzione €150. Si può fumare in cortile, mai sul balcone." },
  { icon: "🌙", t: "Silenzio dopo le 22",       d: "Il palazzo è residenziale. TV bassa, niente musica alta, no party." },
  { icon: "🎉", t: "Niente feste o eventi",      d: "Massimo amici per cena tranquilla. Il vicinato apprezza." },
  { icon: "🧳", t: "Max 2 ospiti registrati",     d: "Come da prenotazione. Visite brevi ok, ma solo gli ospiti registrati dormono qui." },
  { icon: "🐾", t: "Animali su richiesta",        d: "Scrivici prima, diciamo sì quasi sempre. €30 di pulizia extra." },
  { icon: "🔥", t: "Mai candele o incenso",        d: "L'allarme antincendio è sensibile. Diffusori elettrici ok." },
  { icon: "🍳", t: "Cucina con cura",                d: "Usa la cappa quando friggi. Se rompi qualcosa va bene, dicci e basta." },
  { icon: "🗑️", t: "Raccolta differenziata",       d: "Sacchetti divisi sotto il lavello. Calendario in 'Aiuto elettrodomestici → Differenziata'." },
  { icon: "🔑", t: "Una sola chiave per gruppo",   d: "Se la perdi: €50 per la sostituzione della serratura." },
  { icon: "❄️", t: "Aria condizionata & finestre",   d: "Quando apri le finestre, spegni il clima. Risparmiamo energia insieme." },
  { icon: "🌊", t: "Acqua: ne hai quanta vuoi",      d: "È buona dal rubinetto. Usala con buon senso — niente docce di 40 minuti." },
  { icon: "💶", t: "Tassa di soggiorno",              d: "€3 a persona a notte, max 5 notti. Si paga in contanti al check-in." },
];

// Checkout — the 'before you leave' checklist
window.CHECKOUT_STEPS = [
  { t: "Chiudi tutte le finestre",       d: "Anche quella in bagno, se aperta." },
  { t: "Spegni clima e termostato",      d: "Vicino alla porta d'ingresso." },
  { t: "Spegni le luci",                  d: "Tutte, anche bagno e ripostiglio." },
  { t: "Piatti sporchi in lavastoviglie", d: "Non serve farla partire — basta caricarla." },
  { t: "Asciugamani usati nel bagno",     d: "A terra in bagno o nel cesto, come preferisci." },
  { t: "Spazzatura fuori, nei bidoni",    d: "Bidoni nel cortile a sinistra entrando. Già divisa: basta portarla giù." },
  { t: "Riponi il telecomando",            d: "Sul tavolino del salotto, dove l'hai trovato." },
  { t: "Controlla di non dimenticare nulla", d: "Cassetti del comodino, bagno, frigo, presa del caricabatterie." },
  { t: "Chiavi nella cassetta n° 5",       d: "Codice 0425. Richiudi finché senti clic." },
  { t: "Porta accostata, non sbattuta",    d: "Parte l'allarme di sicurezza altrimenti." },
];

window.EMERGENCY = [
  { label: "Mattia (host)",   value: "+39 351 988 6489", type: "phone" },
  { label: "Emergenza 112",    value: "112",               type: "phone" },
];

window.FAQ = [
  { q: "Posso arrivare prima delle 15?",    a: "Certo, scrivici sul Concierge: se la casa è pronta ti facciamo entrare. Altrimenti puoi lasciare i bagagli in un armadietto a 2 min." },
  { q: "C'è parcheggio gratuito?",            a: "Sì, in Via Trieste e laterali. Dettagli in 'Come arrivare'." },
  { q: "L'acqua del rubinetto è potabile?",   a: "Sì, è ottima. In dispensa anche bottiglie filtrate se preferisci." },
  { q: "Posso ricevere pacchi qui?",           a: "Sì, durante il soggiorno. Indirizzo: Via Trieste 25, 'Elegant Loft', 35121 Padova." },
  { q: "C'è un ferro da stiro?",                a: "Sì, nel ripostiglio in corridoio, con l'asse pieghevole." },
  { q: "Posso chiedere il late check-out?",     a: "Su richiesta sì, dipende dal turn-over. Scrivici il giorno prima e proviamo a darti fino alle 12." },
];

// Appliance how-to — each links to a detail screen with video + steps
window.APPLIANCES = [
  { id: "router",       icon: "📶", t: "Wi-Fi non funziona",     sub: "Riavvio in 3 mosse",
    desc: "Se la rete sparisce, stacca la spina del router (dietro la TV, scatola nera) per 10 secondi, poi riattaccala. Aspetta 2 minuti: la rete riappare automaticamente.",
    steps: ["Trova il router dietro la TV (scatola nera con luci)", "Stacca la spina dalla presa, 10 secondi", "Riattacca. Aspetta 2 minuti che le luci tornino verdi"]
  },
  { id: "termostato",   icon: "🌡️", t: "Termostato",              sub: "Riscaldamento e clima",
    desc: "Vicino alla porta d'ingresso, rotella circolare con display.",
    steps: ["Per accendere: gira a destra fino al simbolo del sole", "Per spegnere: torna al simbolo della luna", "Aspetta 10 minuti prima di sentire la differenza"]
  },
  { id: "lavatrice",    icon: "🧺", t: "Lavatrice",                sub: "Bosch — quick 30 minuti",
    desc: "In bagno, a sinistra. Detersivo già in dotazione nello scaffale sopra. Max 6 kg di carico.",
    steps: ["Apri lo sportello, carica i panni", "Detersivo nella vaschetta sinistra (1 misurino)", "Gira la rotella su 'Quick 30°'", "Premi Start. Spia verde = sta partendo"]
  },
  { id: "lavastoviglie", icon: "🍽️", t: "Lavastoviglie",          sub: "Aggiungi pastiglia e via",
    desc: "Sotto il piano cucina. Pastiglie nel cassetto sopra, sale e brillantante già caricati.",
    steps: ["Carica piatti e bicchieri", "Inserisci una pastiglia nello sportellino in alto", "Chiudi, premi 'Eco' (la spia si accende)", "Premi Start. Dura 3 ore ma consuma poco"]
  },
  { id: "induzione",    icon: "🔥", t: "Piano cottura induzione",  sub: "Pulsanti touch, niente fiamme",
    desc: "Funziona solo con pentole magnetiche — quelle in casa lo sono già. Si pulisce con un panno umido.",
    steps: ["Tocca il pulsante on/off in basso", "Seleziona la zona toccando il cerchio corrispondente", "Imposta la potenza con + e –", "Per spegnere: torna a 0 o usa il pulsante off"]
  },
  { id: "tv",           icon: "📺", t: "TV & streaming",            sub: "Netflix, Prime, Disney+",
    desc: "Telecomando nero sul tavolino. I nostri account sono già attivi — per favore non cambiarli.",
    steps: ["Tasto rosso in alto per accendere", "Tasto Home (cerchio centrale)", "Seleziona l'app che vuoi", "Per spegnere: tieni premuto il tasto rosso"]
  },
  { id: "differenziata", icon: "♻️", t: "Raccolta differenziata",   sub: "Calendario e bidoni",
    desc: "Sacchetti già divisi sotto il lavello (colorati). Bidoni nel cortile, a sinistra entrando dal portone.",
    steps: ["Lunedì sera: secco indifferenziato", "Martedì sera: vetro", "Mercoledì sera: carta", "Giovedì sera: organico (umido)", "Venerdì sera: plastica e lattine"]
  },
];

window.COUPONS = [
  { shop: "Pasticceria Graziati", deal: "-10% su tutto", meta: "Mostra l'app in cassa" },
  { shop: "Osteria dei Fabbri",   deal: "Calice omaggio", meta: "Con menu degustazione" },
  { shop: "Bike Rental Padova",    deal: "-20% noleggio", meta: "Solo giorni feriali" },
];

// Used by the "Oggi" feed — time-aware copy
window.getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buongiorno";
  if (h < 18) return "Buon pomeriggio";
  return "Buonasera";
};
