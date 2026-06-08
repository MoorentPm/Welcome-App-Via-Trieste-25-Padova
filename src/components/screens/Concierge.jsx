import React from 'react'
import { IconChevronL, IconChevronR, IconSparkle } from '../Icons'
import { APARTMENT as AP, HOUSE_RULES, APPLIANCES } from '../../data'
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

export function Host({ back, guest }) {
  const { t } = useLang()
  const name = guest?.firstName || AP.guest.firstName
  const [msgs, setMsgs] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("elegant-loft-chat") || "null")
      if (saved && saved.length) return saved
    } catch {}
    return [
      { from: "ai", text: `Ciao ${name}! Sono il Concierge del Loft ✨ Posso suggerirti dove mangiare, come arrivare ovunque, o aiutarti con la casa. Cosa ti serve?` },
    ]
  })
  const [draft, setDraft] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const scrollRef = React.useRef(null)

  React.useEffect(() => {
    try { localStorage.setItem("elegant-loft-chat", JSON.stringify(msgs)) } catch {}
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing])

  const systemContext = () => {
    const rules = HOUSE_RULES.map((r) => `• ${r.t}: ${r.d}`).join("\n")
    const appliances = APPLIANCES.map((a) => `• ${a.t}: ${a.desc}`).join("\n")
    return `Sei il Concierge AI dell'appartamento "Elegant Loft" a Padova, in Via Trieste 25.
Rispondi sempre in italiano (o nella lingua dell'utente) con tono caldo, breve, di amico locale. Mai formale, mai elenchi puntati lunghi. Frasi corte. Una emoji ogni tanto, non di più.
Non inventare informazioni. Se non sai, dillo e suggerisci di scrivere a Mattia l'host al +39 351 988 6489.

Ospite: ${name}, ${guest?.nights || 3} notti.
Wi-Fi: ${AP.wifi.ssid} / password ${AP.wifi.password}.
Check-in dalle ${AP.checkin.from}, check-out entro ${AP.checkout.until}.

REGOLE DELLA CASA:
${rules}

ELETTRODOMESTICI:
${appliances}

Luoghi consigliati: Cappella degli Scrovegni, Prato della Valle, Orto Botanico, Caffè Pedrocchi, Basilica di Sant'Antonio, Palazzo della Ragione.`
  }

  const send = async (textOverride) => {
    const text = (textOverride ?? draft).trim()
    if (!text || typing) return
    const newMsgs = [...msgs, { from: "me", text }]
    setMsgs(newMsgs)
    setDraft("")
    setTyping(true)

    try {
      const conversation = newMsgs.slice(-10).map((m) => ({
        role: m.from === "me" ? "user" : "assistant",
        content: m.text,
      }))
      const reply = await callConcierge({
        messages: conversation,
        system: systemContext(),
      })
      setMsgs((m) => [...m, { from: "ai", text: (reply || "Scusa, riprova tra un attimo 🙏").trim() }])
    } catch {
      setMsgs((m) => [...m, { from: "ai", text: "Ops, problema di connessione. Riprova, o scrivi a Mattia al +39 351 988 6489." }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
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

      <div ref={scrollRef} className="screen-scroll grow" style={{ padding: "4px 16px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) =>
          <div key={i} style={{
            alignSelf: m.from === "me" ? "flex-end" : "flex-start",
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
        )}
        {typing &&
          <div style={{
            alignSelf: "flex-start", padding: "12px 16px", borderRadius: 18,
            background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex", gap: 4
          }}>
            {[0, 1, 2].map((i) =>
              <span key={i} style={{
                width: 7, height: 7, borderRadius: 999, background: "var(--ink-3)",
                animation: "tbounce 1.2s infinite", animationDelay: `${i * 0.15}s`
              }} />
            )}
            <style>{`@keyframes tbounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-4px);opacity:1}}`}</style>
          </div>
        }
      </div>

      {msgs.length <= 2 &&
        <div style={{ padding: "8px 16px 0", display: "flex", gap: 6, overflowX: "auto" }}>
          {[t('host.chip1'), t('host.chip2'), t('host.chip3'), t('host.chip4')].map((s) =>
            <button key={s} onClick={() => send(s)} className="chip chip-ghost"
              style={{ whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, fontWeight: 600 }}>
              {s}
            </button>
          )}
        </div>
      }

      <div style={{ padding: "10px 12px 90px", display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
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
