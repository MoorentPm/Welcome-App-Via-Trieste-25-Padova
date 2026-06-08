import React from 'react'
import { IconChevronL, IconChevronR, IconSparkle } from '../Icons'
import { APARTMENT as AP, HOUSE_RULES, APPLIANCES, FAQ } from '../../data'
import { NavBar } from './NavBar'
import { useLang } from '../../i18n'

const WORKER_URL = 'https://moorent-concierge.moorentpm.workers.dev'

async function callConcierge({ messages, system }) {
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system }),
  })
  if (!res.ok) throw new Error('worker-error')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.text
}

// Maps screen keys to labels and emojis for navigation buttons
const SCREEN_NAV = {
  checkin:   { label: 'Arrivo & Casa', emoji: '🔑', route: 'arrival_checkin' },
  checkout:  { label: 'Checkout',      emoji: '🧳' },
  wifi:      { label: 'Wi-Fi',         emoji: '📶' },
  house:     { label: 'Regole casa',   emoji: '🏠' },
  coupons:   { label: 'Coupon',        emoji: '🎫' },
  places:    { label: 'Luoghi',        emoji: '📍' },
  itinerary: { label: 'Itinerario',    emoji: '🗺️' },
  tip:       { label: 'Consiglio',     emoji: '✨' },
}

// ── DailyTip ──────────────────────────────────────────────────────────────────

export function DailyTip({ back, go }) {
  const { t } = useLang()
  const [tip, setTip] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState(false)

  const staticIdxRef = React.useRef(
    (() => { const n = new Date(); return (n.getHours() + n.getDay()) % 6 })()
  )

  const STATIC_TIPS = [
    { title: "Caffè al Pedrocchi", subtitle: "Il caffè 'senza porte' dal 1831 · 7 min a piedi", body: "Ordina un caffè alla menta — è la loro specialità storica. Non è sul menu standard, chiedi al banco. L'atmosfera è quella di sempre, immutabile.", tag: "Iconico", emoji: "☕" },
    { title: "Prato della Valle", subtitle: "La piazza più grande d'Europa · 8 min a piedi", body: "82 statue, un'isola verde al centro, e tantissimi padovani in giro. Perfetto in qualsiasi ora. Portati qualcosa da mangiare e siediti sull'erba.", tag: "Piazza", emoji: "🌿" },
    { title: "Cappella degli Scrovegni", subtitle: "Prenota online · 12 min a piedi", body: "Giotto. 20 minuti là dentro cambiano il modo in cui guardi un muro. Prenotazione obbligatoria — falla ora sul sito del museo.", tag: "Arte", emoji: "🎨" },
    { title: "Mercato di Piazza delle Erbe", subtitle: "Aperto la mattina · 9 min a piedi", body: "Il mercato più vivo della città. Frutta, verdura, formaggi, e i padovani che litigano sui prezzi. Meglio di qualsiasi museo.", tag: "Mercato", emoji: "🛒" },
    { title: "Spritz al tramonto", subtitle: "Piazza delle Erbe, dalle 18 · 9 min a piedi", body: "Trova un tavolino all'aperto nella piazza, ordina uno spritz Aperol, e guarda la città rallentare. Questo è il momento.", tag: "Aperitivo", emoji: "🥂" },
    { title: "Orto Botanico", subtitle: "Patrimonio UNESCO · 10 min a piedi", body: "Il più antico orto botanico universitario del mondo, dal 1545. Piccolo, tranquillo, bellissimo. Ci vuole un'ora e ci si dimentica di tutto.", tag: "Verde", emoji: "🌱" },
  ]

  const fetchTip = async () => {
    setLoading(true); setErr(false)
    try {
      const now = new Date()
      const hh = now.getHours()
      const timeContext = hh < 11 ? "mattina presto" : hh < 14 ? "mezzogiorno" : hh < 18 ? "pomeriggio" : hh < 21 ? "ora di aperitivo" : "sera"
      const dayName = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][now.getDay()]
      const month = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"][now.getMonth()]

      const reply = await callConcierge({
        messages: [{
          role: "user",
          content: `Sei un amico padovano che dà UN solo consiglio breve e ispirante su cosa fare a Padova ORA.
Contesto: è ${dayName}, ${timeContext}, mese di ${month}.
L'ospite alloggia in Via Trieste 25.
Suggerisci UNA cosa specifica (un locale, un luogo, un'attività) che si possa fare nelle prossime 1-3 ore. Sii creativo: varia tra cose iconiche e perle nascoste.

Rispondi in formato JSON valido:
{
  "title": "titolo breve, max 6 parole, evocativo",
  "subtitle": "un dettaglio o ora consigliata, max 10 parole",
  "body": "2-3 frasi corte, tono amico locale, max 60 parole. Spiega perché è una buona idea proprio adesso.",
  "tag": "una sola parola tipo Caffè, Arte, Aperitivo, Verde, Vista...",
  "emoji": "una sola emoji"
}
Solo JSON, nessun altro testo.`
        }],
      })

      const match = reply.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          setTip(JSON.parse(match[0]))
        } catch {
          setTip({ title: "Un giro per il centro", subtitle: "Adesso è un buon momento", body: reply, tag: "Padova", emoji: "✨" })
        }
      } else {
        setTip({ title: "Un giro per il centro", subtitle: "Adesso è un buon momento", body: reply, tag: "Padova", emoji: "✨" })
      }
    } catch {
      const idx = staticIdxRef.current
      staticIdxRef.current = (idx + 1) % STATIC_TIPS.length
      setTip(STATIC_TIPS[idx])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchTip() }, [])

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('tip.title')} />

      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          {t('daily.heading')}
        </div>
        <div className="t-13 muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
          {t('daily.sub')}
        </div>
      </div>

      {loading && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999, border: "3px solid var(--ink-4)",
            borderTopColor: "var(--accent)", animation: "sp 0.9s linear infinite", margin: "0 auto",
          }}/>
          <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
          <div className="t-14 muted" style={{ marginTop: 16 }}>{t('daily.thinking')}</div>
        </div>
      )}

      {!loading && tip && (
        <>
          <div style={{ padding: "24px 16px 0" }}>
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 26, padding: "28px 22px",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
              color: "#fff",
            }}>
              <div style={{
                position: "absolute", right: -40, top: -40, width: 200, height: 200,
                borderRadius: 999, background: "rgba(255,255,255,0.15)", pointerEvents: "none",
              }}/>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }}>{tip.emoji}</div>
                <div style={{
                  display: "inline-flex", padding: "5px 12px", borderRadius: 999,
                  background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
                }}>{tip.tag}</div>
                <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 500, marginTop: 14 }}>
                  {tip.title}
                </div>
                <div className="t-13" style={{ opacity: 0.85, marginTop: 8 }}>
                  {tip.subtitle}
                </div>
                <div className="t-15" style={{ marginTop: 18, lineHeight: 1.55, opacity: 0.95 }}>
                  {tip.body}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 16px 0" }}>
            <button onClick={fetchTip} disabled={loading} className="btn btn-ghost btn-lg btn-full">
              <IconSparkle size={18} stroke={2}/> {t('daily.another')}
            </button>
          </div>

          <div style={{ padding: "26px 20px 0" }}>
            <div className="t-13 muted" style={{ lineHeight: 1.5, marginBottom: 14 }}>
              {t('daily.itinerary_prompt')}
            </div>
            <button onClick={() => go("itinerary")} className="btn btn-accent btn-lg btn-full">
              {t('daily.create_itinerary')}
            </button>
          </div>
        </>
      )}

      {err && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div className="t-14 muted" style={{ lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {t('daily.error')}
          </div>
          <button onClick={fetchTip} className="btn btn-ghost btn-lg" style={{ marginTop: 20 }}>
            {t('daily.retry')}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Host (chatbot) ─────────────────────────────────────────────────────────────

export function Host({ back, guest, go }) {
  const { t } = useLang()
  const name = guest?.firstName || AP.guest.firstName
  const nights = guest?.nights || 3

  const [msgs, setMsgs] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("elegant-loft-chat") || "null")
      if (saved && saved.length) return saved
    } catch {}
    return [
      { from: "ai", text: `Ciao ${name}! Sono il Concierge del Loft ✨ Chiedimi tutto: WiFi, check-in, dove mangiare, come funzionano gli elettrodomestici. Cosa ti serve?`, screens: [], contactHost: false },
    ]
  })
  const [draft, setDraft] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const scrollRef = React.useRef(null)

  React.useEffect(() => {
    try { localStorage.setItem("elegant-loft-chat", JSON.stringify(msgs)) } catch {}
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing])

  const buildSystemPrompt = () => {
    const rules = HOUSE_RULES.map(r => `${r.icon} ${r.t}: ${r.d}`).join('\n')
    const appliances = APPLIANCES.map(a => `${a.icon} ${a.t}: ${a.desc}`).join('\n')
    const faqs = FAQ.map(f => `Q: ${f.q} → A: ${f.a}`).join('\n')

    return `=== IDENTITÀ ===
Sei il Concierge AI di "Elegant Loft", Via Trieste 25, Padova. Gestito da Moorent Pm.
Tono: amico locale, caldo, diretto. Mai formale. Frasi corte. Una emoji ogni tanto va bene, non di più.
Non inventare informazioni non presenti in questa knowledge base. Se non sai, di' di contattare Mattia.
Rispondi nella lingua del messaggio dell'utente (italiano, inglese, tedesco, francese...).

=== KNOWLEDGE BASE ===
WIFI-RETE: ElegantLoft_WIFI
WIFI-PASSWORD: Civico25
PORTONE-CODICE: 25#
CHIAVI-CASSETTA: n°5
CHIAVI-CODICE: 0425
CHECK-IN: dalle 15:00 alle 22:00
CHECKOUT: entro le 10:00
TASSA-SOGGIORNO: €3/persona/notte, max 5 notti, contanti al check-in
HOST-NOME: Mattia
HOST-TELEFONO: +39 351 988 6489
INDIRIZZO: Via Trieste 25, 35121 Padova
OSPITE-NOME: ${name}
OSPITE-NOTTI: ${nights}

=== APPARTAMENTO — DOTAZIONI ===
CAMERE: 1 camera da letto (letto matrimoniale) + soggiorno con divano letto matrimoniale = 4 posti letto totali
TERRAZZO: piccolo terrazzo con tavolino e sedia
ARIA-CONDIZIONATA: sì, presente
MACCHINA-CAFFE: sì, in cucina — capsule/cialde sul tavolo della cucina vicino alla macchina
FERRO-DA-STIRO: sì, nel ripostiglio in corridoio con asse pieghevole
ASCIUGAMANI-LENZUOLA: forniti — per extra contattare Mattia
ACQUA-RUBINETTO: potabile, ottima qualità
STREAMING: Netflix, Prime Video, Disney+ già attivi sulla TV (non modificare gli account)

=== CHECK-IN / CHECK-OUT SPECIALE ===
CHECK-IN-TARDIVO: il self check-in funziona a qualsiasi ora — l'ospite può entrare quando vuole purché non prima delle 15:00
EARLY-CHECK-IN: contattare l'host — se l'appartamento è libero si può anticipare
LATE-CHECK-OUT: su richiesta fino alle 12:00 — chiedere il giorno prima a Mattia
BAGAGLI-ANTICIPATI: se si arriva prima delle 15 e l'appartamento non è pronto, c'è un armadietto bagagli a 2 minuti

=== EMERGENZE E SERVIZI VICINI ===
EMERGENZA-GENERALE: 112
EMERGENZA-MEDICA: 118 (ambulanza)
HOST-URGENZE: Mattia +39 351 988 6489
PRONTO-SOCCORSO: Ospedale di Padova — Via Giustiniani 2 (5 min in taxi, 20 min a piedi)
FARMACIA: Farmacia alla Stazione — Corso del Popolo 53, Padova (2 min a piedi)
SUPERMERCATO: Super A&O — Corso del Popolo 25, Padova (2 min a piedi)
CHIAVI-PERSE: contattare subito Mattia al +39 351 988 6489

=== COUPON ESCLUSIVI OSPITI ===
1. Pasticceria Graziati — Piazza della Frutta 39 · sconto -10% su tutto · codice: ELEGANT10 · mostrare l'app in cassa
2. Osteria dei Fabbri — Via dei Fabbri 13 · calice di vino omaggio con menu degustazione · codice: FABBRI-LOFT
3. Bike Rental Padova — Via Niccolò Tommaseo · -20% noleggio bici (solo giorni feriali) · codice: LOFT-BIKE-20

=== COSA FARE AL CHECKOUT ===
1. Chiudi tutte le finestre (anche bagno)
2. Spegni clima e termostato (vicino alla porta d'ingresso)
3. Spegni tutte le luci
4. Piatti sporchi in lavastoviglie (non serve farla partire)
5. Asciugamani usati lasciati in bagno
6. Spazzatura nei bidoni del cortile (a sinistra entrando)
7. Telecomando sul tavolino del salotto
8. Controlla di non dimenticare nulla (cassetti, bagno, frigo, caricabatterie)
9. Chiavi nella cassetta n°5 (codice 0425) — richiudi finché senti clic
10. Porta accostata, non sbattuta (parte l'allarme)

=== REGOLE DELLA CASA ===
${rules}

=== ELETTRODOMESTICI ===
${appliances}

=== FAQ ===
${faqs}

=== COME ARRIVARE AL LOFT ===
INDIRIZZO-ESATTO: Via Trieste 25, Padova — civico blu sul lato destro

TRENO: La stazione di Padova è a 5 minuti a piedi. Uscita principale → gira a destra in Via Trieste → civico 25 sul lato destro. Taxi dalla stazione: ~€8, 3 minuti. Frecciarossa, Italo e regionali: Venezia 25 min, Verona 50 min, Bologna 1h.

AUTO: Uscita autostradale Padova Est, poi 12 minuti al loft. Parcheggio gratuito in Via Trieste e vie laterali. Parcheggio coperto Park Antenore: €15/giorno, 4 min a piedi.

BUS/TRAM: Fermata "Trieste" a 100 metri dal loft. Tram T1 dalla stazione: scendi alla fermata Trieste (2 minuti). Biglietto €1.50. Rete BusItalia Veneto.

=== LUOGHI CONSIGLIATI (a piedi da Via Trieste 25) ===
Caffè Pedrocchi (7 min) · Piazza delle Erbe (9 min) · Prato della Valle (8 min)
Cappella degli Scrovegni (12 min, prenotare) · Orto Botanico (10 min)
Basilica di Sant'Antonio (15 min) · Palazzo della Ragione (9 min)

=== SEZIONI APP NAVIGABILI ===
REGOLA FONDAMENTALE: includi SEMPRE almeno 1 screen key in "screens". Anche per domande generiche, scegli il più rilevante. Solo per saluti puri (es. "ciao") puoi lasciare [].
- "checkin"   → check-in, codici, portone, cassetta chiavi, come entrare
- "checkout"  → checkout, partire, orario uscita, lasciare le chiavi
- "wifi"      → WiFi, internet, password, connessione
- "house"     → regole casa, elettrodomestici, lavatrice, TV, termostato, raccolta differenziata
- "coupons"   → sconti, offerte, coupon, esercizi locali
- "places"    → ristoranti, bar, caffè, luoghi da visitare, Padova
- "itinerary" → itinerario, cosa fare oggi, giro della città
- "tip"       → consiglio del momento, cosa fare adesso

=== FORMATO OUTPUT ===
Rispondi SEMPRE e SOLO con un oggetto JSON valido. Nessun testo fuori dal JSON.
{"answer":"testo risposta","screens":[],"contactHost":false}

- "answer": risposta testuale pura, max 120 parole. ZERO Markdown: niente **grassetto**, niente *corsivo*, niente # titoli, niente trattini lista. Solo testo normale e emoji.
- "screens": array con ALMENO 1 screen key per quasi ogni risposta. Solo per saluti puri lascia [].
- "contactHost": true solo se serve l'intervento diretto di Mattia (guasto, emergenza, richiesta speciale)

=== ESEMPI (few-shot) ===
User: "Qual è la password wifi?"
{"answer":"Rete: ElegantLoft_WIFI, password: Civico25 📶","screens":["wifi"],"contactHost":false}

User: "Come faccio il check-in?"
{"answer":"Portone: codice 25#. Poi trova la cassetta n°5 sul cancello a destra, codice 0425. Secondo piano, porta con lo zerbino grigio. Nell'app hai tutti i dettagli con le foto! 🔑","screens":["checkin"],"contactHost":false}

User: "A che ora devo fare il checkout?"
{"answer":"Entro le 10:00. Lascia le chiavi nella cassetta n°5 (codice 0425), porta accostata. La lista completa di tutto da fare è nell'app.","screens":["checkout"],"contactHost":false}

User: "Come funziona la lavatrice?"
{"answer":"In bagno a sinistra. Un misurino di detersivo nella vaschetta sinistra, programma Quick 30°, premi Start. Max 6 kg. 🧺","screens":["house"],"contactHost":false}

User: "Dove mangio bene stasera?"
{"answer":"L'area di Piazza delle Erbe è perfetta — bacari e osterie a 9 minuti a piedi. Nell'app trovi una selezione con foto e distanze.","screens":["places"],"contactHost":false}

User: "Il riscaldamento non funziona"
{"answer":"Il termostato è vicino alla porta d'ingresso, rotella circolare — girala verso il sole. Se non parte entro 10 minuti, contatta Mattia.","screens":["house"],"contactHost":true}

User: "Ho bisogno di parlare con qualcuno"
{"answer":"Certo! Mattia è sempre disponibile — puoi chiamarlo o scrivergli su WhatsApp. 📞","screens":[],"contactHost":true}

User: "Ciao!"
{"answer":"Ciao! Sono qui per aiutarti con tutto — WiFi, check-in, dove mangiare, come funziona la casa. Cosa ti serve? 😊","screens":[],"contactHost":false}

User: "Come arrivo in treno?"
{"answer":"La stazione di Padova è a 5 minuti a piedi. Esci dall'uscita principale, gira a destra in Via Trieste e il civico 25 è sul lato destro. In taxi ci vogliono 3 minuti, circa €8. Nell'app trovi tutte le istruzioni di arrivo. 🚆","screens":["checkin"],"contactHost":false}

User: "C'è parcheggio?"
{"answer":"Sì, parcheggio gratuito in Via Trieste e nelle vie laterali. Oppure il Park Antenore coperto: €15/giorno, a 4 minuti a piedi. 🚗","screens":["checkin"],"contactHost":false}

User: "C'è la macchina del caffè?"
{"answer":"Sì! È in cucina. Le capsule le trovi sul tavolo della cucina, vicino alla macchina stessa. ☕","screens":["house"],"contactHost":false}

User: "Ho bisogno di un medico / mi sento male"
{"answer":"Per emergenze chiama il 118 (ambulanza) o il 112. Il Pronto Soccorso più vicino è l'Ospedale di Padova in Via Giustiniani 2, a 5 minuti in taxi. Puoi anche avvisare Mattia.","screens":[],"contactHost":true}

User: "C'è uno sconto da qualche parte?"
{"answer":"Sì! Hai 3 coupon esclusivi nell'app: -10% alla Pasticceria Graziati (codice ELEGANT10), calice omaggio all'Osteria dei Fabbri (FABBRI-LOFT), e -20% da Bike Rental Padova (LOFT-BIKE-20). 🎫","screens":["coupons"],"contactHost":false}

User: "What time is check-in?"
{"answer":"Check-in from 3:00 PM to 10:00 PM. Front door code: 25#, lockbox n°5 with code 0425. Full photo guide in the Check-in section.","screens":["checkin"],"contactHost":false}`
  }

  const detectScreens = (userText) => {
    const t = userText.toLowerCase()
    const found = []
    if (/check.?in|entrar|chiav|portone|cassetta|arriv|come\s*(si\s*)?(entra|arriv)|codice\s*(portone|ingresso)|aprir|treno|stazion|bus|tram|auto|macchina|taxi|parcheggio|a\s*piedi|transport|train|car|come.*arrivare|how.*get/.test(t)) found.push('checkin')
    if (/check.?out|partir|lasci|uscit|orario.*us|when.*leav|leave|depart/.test(t)) found.push('checkout')
    if (/wi.?fi|internet|password|rete|connessione|pw|accedo/.test(t)) found.push('wifi')
    if (/lavatr|lavastovigh|termostato|climatiz|aria.condi|riscald|tv|televi|differen|appl|elettrodom|forno|induzion|router/.test(t)) found.push('house')
    if (/regol|vietat|rumore|fumo|animali|norme/.test(t)) found.push('house')
    if (/coupon|sconto|offert|convenzione|gratis|omaggio/.test(t)) found.push('coupons')
    if (/mangi|ristorante|caffè|caffe|bar|spritz|pizza|trattoria|osteria|dove.*mangi|cosa.*mangi|food|eat|restaurant/.test(t)) found.push('places')
    if (/luoghi|visita|padova|cosa.*fare|vedere|monument|museo|prato|scrovegni|basilica/.test(t)) found.push('places')
    if (/itinerar|giro|giornata|programma/.test(t)) found.push('itinerary')
    if (/consiglio|sugger|adesso|momento|oggi|now/.test(t)) found.push('tip')
    return [...new Set(found)].slice(0, 2)
  }

  const stripMarkdown = (s) => s
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .trim()

  const parseReply = (raw) => {
    try {
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('no-json')
      const parsed = JSON.parse(match[0])
      return {
        text: stripMarkdown(parsed.answer || raw),
        screens: Array.isArray(parsed.screens) ? parsed.screens.filter(s => SCREEN_NAV[s]) : [],
        contactHost: !!parsed.contactHost,
      }
    } catch {
      return { text: stripMarkdown(raw), screens: [], contactHost: false }
    }
  }

  const send = async (textOverride) => {
    const text = (textOverride ?? draft).trim()
    if (!text || typing) return
    const newMsgs = [...msgs, { from: "me", text }]
    setMsgs(newMsgs)
    setDraft("")
    setTyping(true)

    try {
      const conversation = newMsgs.slice(-6).map(m => ({
        role: m.from === "me" ? "user" : "assistant",
        content: m.text,
      }))
      const raw = await callConcierge({
        messages: conversation,
        system: buildSystemPrompt(),
      })
      const { text: answer, screens: modelScreens, contactHost } = parseReply(raw)
      // If model didn't suggest screens, detect them from the user's question
      const screens = modelScreens.length > 0 ? modelScreens : detectScreens(text)
      setMsgs(m => [...m, { from: "ai", text: answer.trim() || "Scusa, riprova 🙏", screens, contactHost }])
    } catch {
      setMsgs(m => [...m, {
        from: "ai",
        text: "Ops, problema di connessione. Riprova, o scrivi a Mattia al +39 351 988 6489.",
        screens: [],
        contactHost: true,
      }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "max(44px, calc(env(safe-area-inset-top, 0px) + 12px)) 16px 12px",
        background: "linear-gradient(180deg, var(--bg) 70%, rgba(242,239,234,0) 100%)",
        position: "sticky", top: 0, zIndex: 5
      }}>
        <button onClick={back} className="nav-btn" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}>
          <IconChevronL size={18} stroke={2.5} />
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <IconSparkle size={20} stroke={2} />
        </div>
        <div className="grow">
          <div className="t-15 w-600" style={{ lineHeight: 1.2 }}>{t('host.ai_title')}</div>
          <div className="t-11 muted" style={{ marginTop: 2, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--ok)" }} />
            {t('host.status')}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="screen-scroll grow" style={{ padding: "4px 16px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "me" ? "flex-end" : "flex-start", gap: 6 }}>
            {/* Bubble */}
            <div style={{
              maxWidth: "82%",
              background: m.from === "me" ? "var(--accent)" : "#fff",
              color: m.from === "me" ? "#fff" : "var(--ink)",
              padding: "10px 14px", borderRadius: 18,
              borderBottomRightRadius: m.from === "me" ? 6 : 18,
              borderBottomLeftRadius: m.from === "me" ? 18 : 6,
              fontSize: 15, lineHeight: 1.45,
              boxShadow: m.from === "me" ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
              whiteSpace: "pre-wrap"
            }}>{m.text}</div>

            {/* Contact host buttons */}
            {m.from === "ai" && m.contactHost && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <a href={`tel:${AP.host.phone}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 999,
                  background: "rgba(255,255,255,0.9)", border: "1px solid var(--hairline)",
                  fontSize: 13, fontWeight: 600, color: "var(--ink)",
                  textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                  📞 Chiama Mattia
                </a>
                <a href={`https://wa.me/${AP.host.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Ciao Mattia, sono ${name} ospite di Elegant Loft. Ho bisogno di aiuto.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 999,
                    background: "#25D366", color: "#fff",
                    fontSize: 13, fontWeight: 600,
                    textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  }}>
                  💬 WhatsApp
                </a>
              </div>
            )}

            {/* Navigation chips */}
            {m.from === "ai" && m.screens && m.screens.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {m.screens.map(screen => {
                  const nav = SCREEN_NAV[screen]
                  if (!nav || !go) return null
                  return (
                    <button key={screen} onClick={() => go(nav.route || screen)}
                      className="chip chip-ghost"
                      style={{
                        cursor: "pointer", fontWeight: 600, fontSize: 13,
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "7px 13px", borderRadius: 999,
                        background: "rgba(255,255,255,0.9)",
                        border: "1.5px solid var(--accent-soft)",
                        color: "var(--accent-deep)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      }}>
                      {nav.emoji} {nav.label} →
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{
            alignSelf: "flex-start", padding: "12px 16px", borderRadius: 18,
            background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex", gap: 4
          }}>
            {[0, 1, 2].map(i =>
              <span key={i} style={{
                width: 7, height: 7, borderRadius: 999, background: "var(--ink-3)",
                animation: "tbounce 1.2s infinite", animationDelay: `${i * 0.15}s`
              }} />
            )}
            <style>{`@keyframes tbounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-4px);opacity:1}}`}</style>
          </div>
        )}
      </div>

      {/* Quick chips — only on first 2 messages */}
      {msgs.length <= 2 && (
        <div style={{ padding: "8px 16px 0", display: "flex", gap: 6, overflowX: "auto" }}>
          {[t('host.chip1'), t('host.chip2'), t('host.chip3'), t('host.chip4')].map(s =>
            <button key={s} onClick={() => send(s)} className="chip chip-ghost"
              style={{ whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, fontWeight: 600 }}>
              {s}
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 12px 90px", display: "flex", gap: 8 }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder={t('host.placeholder')}
          style={{
            flex: 1, padding: "14px 16px", borderRadius: 22, border: "none",
            background: "var(--surface)", fontSize: 16, fontFamily: "inherit",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)", outline: "none"
          }} />
        <button onClick={() => send()} disabled={typing} className="nav-btn" style={{
          width: 46, height: 46, background: "var(--accent)", color: "#fff",
          opacity: typing ? 0.5 : 1
        }}>
          <IconChevronR size={20} stroke={2.5} />
        </button>
      </div>
    </div>
  )
}
