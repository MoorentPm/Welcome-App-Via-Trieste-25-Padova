import React from 'react'
import { IconCheck, IconChevronL, IconChevronR, IconHeart, IconStar } from '../Icons'
import { APARTMENT as AP } from '../../data'
import { NavBar } from './NavBar'

export function Review({ back, guest, go }) {
  const name = guest?.firstName || AP.guest.firstName
  const [stage, setStage] = React.useState("rate") // rate → coupon
  const [stars, setStars] = React.useState(0)
  const [feedback, setFeedback] = React.useState("")

  if (stage === "hello") {
    return (
      <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
        <NavBar back={back} title="Arrivederci" />
        <div style={{ padding: "0 20px" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>👋</div>
          <div className="serif" style={{ fontSize: 36, lineHeight: 1.05, fontWeight: 500, letterSpacing: -0.02 }}>
            Grazie, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{name}</em>.
          </div>
          <div className="t-15 muted-2" style={{ marginTop: 16, lineHeight: 1.6 }}>
            È stato un piacere ospitarti. Speriamo che Padova ti abbia conquistato e che il Loft ti sia sembrato casa.
          </div>
          <div className="t-15 muted-2" style={{ marginTop: 14, lineHeight: 1.6 }}>
            Se ti va, due parole sulla tua esperienza ci aiutano davvero — e abbiamo preparato un piccolo regalo per ringraziarti.
          </div>
        </div>
        <div style={{ padding: "32px 16px 0" }}>
          <button onClick={() => setStage("rate")} className="btn btn-accent btn-lg btn-full">
            Lascia un feedback →
          </button>
          <button onClick={back} className="btn btn-ghost btn-lg btn-full" style={{ marginTop: 10 }}>
            Magari più tardi
          </button>
        </div>
      </div>
    )
  }

  if (stage === "rate") {
    const isHigh = stars >= 3
    return (
      <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
        <NavBar back={back} title="Recensione" />
        <div style={{ padding: "0 20px" }}>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 500 }}>
            Com'è <em style={{ fontStyle: "italic", color: "var(--accent)" }}>andata</em>?
          </div>
          <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
            Tocca le stelle. Onesto è meglio di gentile.
          </div>
        </div>

        <div style={{ padding: "32px 0 8px", display: "flex", justifyContent: "center", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) =>
            <button key={n} onClick={() => setStars(n)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              color: n <= stars ? "var(--accent)" : "var(--ink-4)",
              transition: "transform .15s",
              transform: n <= stars ? "scale(1.08)" : "scale(1)"
            }}>
              <IconStar size={40} stroke={1.5} style={{ fill: n <= stars ? "var(--accent)" : "none" }} />
            </button>
          )}
        </div>

        {stars > 0 &&
          <div style={{ padding: "4px 20px", textAlign: "center" }}>
            <div className="t-14 w-600" style={{ color: "var(--accent-deep)" }}>
              {stars === 5 ? "Wow, grazie davvero! 🙏" :
               stars === 4 ? "Felici che sia andata bene" :
               stars === 3 ? "Ti ascoltiamo — dicci cosa migliorare" :
               "Mi dispiace. Ci aiuti a capire?"}
            </div>
          </div>
        }

        <div style={{ padding: "20px 16px 0" }}>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
            placeholder={stars >= 4 ? "Cosa ti è piaciuto di più? (facoltativo)" : "Cosa avremmo potuto fare meglio? Davvero, ci serve"}
            style={{
              width: "100%", minHeight: 110, padding: 16, borderRadius: 18,
              background: "var(--surface)", border: "none", fontFamily: "inherit",
              fontSize: 16, color: "var(--ink)", resize: "none", boxSizing: "border-box",
              boxShadow: "0 2px 10px rgba(26,25,22,0.04)", lineHeight: 1.5
            }} />
        </div>

        {isHigh &&
          <div style={{ padding: "18px 16px 0" }}>
            <div style={{
              padding: 16, borderRadius: 18,
              background: "linear-gradient(135deg, var(--accent-soft) 0%, rgba(255,255,255,0.6) 100%)",
              border: "1px solid var(--hairline)"
            }}>
              <div className="t-13 w-600" style={{ color: "var(--accent-deep)", textTransform: "uppercase", letterSpacing: 0.4 }}>
                Un piccolo favore
              </div>
              <div className="t-14" style={{ marginTop: 8, lineHeight: 1.55, color: "var(--ink-2)" }}>
                Le recensioni col massimo punteggio ci aiutano tantissimo a continuare a fare questo lavoro come piace a noi. Se condividi anche su <strong>Booking</strong> o <strong>Airbnb</strong>, riceverai un codice sconto più generoso.
              </div>
            </div>
          </div>
        }

        <div style={{ padding: "20px 16px 0" }}>
          <button onClick={() => setStage("coupon")} disabled={!stars} className="btn btn-accent btn-lg btn-full"
            style={{ opacity: stars ? 1 : 0.4 }}>
            {isHigh ? "Invia e ricevi il codice" : "Invia feedback"}
          </button>
        </div>
      </div>
    )
  }

  const isHigh = stars >= 3
  const code = isHigh ? "GRAZIE" + (10 + stars * 2) : "GRAZIE5"
  const discount = isHigh ? `-${10 + stars * 2}%` : "-5%"
  const [copiedCoupon, setCopiedCoupon] = React.useState(false)
  const copyCoupon = () => {
    try { navigator.clipboard?.writeText(code) } catch {}
    setCopiedCoupon(true)
    setTimeout(() => setCopiedCoupon(false), 2000)
  }
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Il tuo regalo" />
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999, margin: "0 auto",
          background: "var(--accent-soft)", color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <IconHeart size={40} stroke={2} style={{ fill: "var(--accent)" }} />
        </div>
        <div className="serif" style={{ fontSize: 30, marginTop: 20, fontWeight: 500, lineHeight: 1.15 }}>
          {isHigh ? "Grazie di cuore." : "Grazie del feedback."}
        </div>
        <div className="t-14 muted-2" style={{ marginTop: 12, lineHeight: 1.55, padding: "0 8px" }}>
          {isHigh
            ? "Lo apprezziamo davvero. Ecco il tuo codice sconto per la prossima volta che vieni a Padova."
            : "Ne facciamo tesoro. Tieni questo codice: vale per la tua prossima prenotazione."}
        </div>
      </div>

      <div style={{ padding: "32px 16px 0" }}>
        <div style={{
          borderRadius: 22, padding: "24px 20px",
          background: "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 200, height: 200,
            borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.4
          }} />
          <div className="t-11 w-600" style={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5, position: "relative" }}>
            Sconto sulla prossima prenotazione
          </div>
          <div className="serif" style={{ fontSize: 56, fontWeight: 500, marginTop: 8, lineHeight: 1, position: "relative" }}>
            {discount}
          </div>
          <div className="t-13" style={{ opacity: 0.8, marginTop: 16, position: "relative" }}>
            Codice da usare su <strong style={{ color: "#fff" }}>{AP.website}</strong>
          </div>
          <div style={{
            marginTop: 10, padding: "12px 16px", borderRadius: 12,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "relative"
          }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
              {code}
            </div>
            <button onClick={copyCoupon} style={{
              background: copiedCoupon ? "var(--ok)" : "var(--accent)", color: "#fff",
              border: "none", borderRadius: 999, padding: "6px 14px", fontSize: 12,
              fontWeight: 700, cursor: "pointer", display: "inline-flex",
              alignItems: "center", gap: 4, transition: "background .2s",
            }}>
              {copiedCoupon ? <><IconCheck size={12} stroke={3}/> Copiato</> : "Copia"}
            </button>
          </div>
        </div>
      </div>

      {isHigh &&
        <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href="https://www.booking.com/searchresults.it.html?ss=Via+Trieste+25+Padova"
            target="_blank" rel="noreferrer"
            className="btn btn-ghost btn-lg btn-full" style={{ background: "var(--surface)", textDecoration: "none" }}
          >
            <IconHeart size={18} /> Lascia recensione su Booking
          </a>
          <a
            href="https://www.airbnb.it/s/Padova--Italy/homes"
            target="_blank" rel="noreferrer"
            className="btn btn-ghost btn-lg btn-full" style={{ background: "var(--surface)", textDecoration: "none" }}
          >
            <IconHeart size={18} /> Lascia recensione su Airbnb
          </a>
        </div>
      }

      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={() => go ? go("home") : back()} className="btn btn-primary btn-lg btn-full">
          Torna alla home
        </button>
      </div>

      <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
        <div className="t-13 muted" style={{ lineHeight: 1.5 }}>
          Torna a trovarci, {name}. <br />
          Padova è sempre la stessa, ma cambia con te.
        </div>
      </div>
    </div>
  )
}

export function About({ back }) {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: "relative", height: "100%", overflow: "hidden",
      background: "#FFFFFF",
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif",
      color: "#232323"
    }}>
      <style>{`
        @keyframes moo-fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes moo-shimmer { 0%, 100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }
        @keyframes moo-pulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.05); opacity: 0.9; } }
        .moo-anim { opacity: 0; animation: moo-fade-up 0.8s cubic-bezier(.2,.8,.2,1) forwards; }
      `}</style>

      <div className="screen-scroll" style={{ height: "100%", overflow: "auto", paddingBottom: 110 }}>
        <div style={{
          position: "relative",
          background: "#232323", color: "#FFFFFF",
          padding: "0 0 60px",
          borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", right: -60, top: 100, width: 240, height: 240,
            borderRadius: 999, background: "#f3dfd9", opacity: 0.15,
            animation: visible ? "moo-pulse 4s ease-in-out infinite" : "none"
          }} />
          <div style={{
            position: "absolute", left: -80, top: 280, width: 200, height: 200,
            borderRadius: 999, background: "#f3dfd9", opacity: 0.08
          }} />

          <div style={{ display: "flex", alignItems: "center", padding: "56px 16px 0", position: "relative" }}>
            <button onClick={back} style={{
              width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)", color: "#FFFFFF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)"
            }}>
              <IconChevronL size={18} stroke={2.5} />
            </button>
          </div>

          <div className="moo-anim" style={{ padding: "56px 24px 0", position: "relative", animationDelay: "0s" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "6px 14px 6px 6px", borderRadius: 999,
              background: "rgba(243,223,217,0.12)", border: "1px solid rgba(243,223,217,0.25)"
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 999, background: "#f3dfd9",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#232323", fontWeight: 800, fontSize: 14
              }}>M</div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#f3dfd9" }}>
                {AP.pmName}
              </div>
            </div>
          </div>

          <div className="moo-anim" style={{ padding: "30px 24px 0", position: "relative", animationDelay: "0.15s" }}>
            <h1 style={{
              fontSize: 44, lineHeight: 1.02, fontWeight: 800, margin: 0,
              letterSpacing: -1.2, color: "#FFFFFF"
            }}>
              Affitti<br />
              brevi,<br />
              <span style={{ color: "#f3dfd9", fontStyle: "italic", fontWeight: 700 }}>fatti bene.</span>
            </h1>
          </div>

          <div className="moo-anim" style={{ padding: "20px 24px 0", position: "relative", animationDelay: "0.3s" }}>
            <p style={{
              fontSize: 15, lineHeight: 1.6, margin: 0,
              color: "rgba(255,255,255,0.75)", maxWidth: 320
            }}>
              Padova e provincia. Gestione completa per chi ha una casa e vuole metterla a reddito senza pensieri.
            </p>
          </div>

          <div className="moo-anim" style={{ padding: "36px 16px 0", position: "relative", animationDelay: "0.45s" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
              background: "rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden"
            }}>
              {[
                { n: "10+", l: "Appartamenti" },
                { n: "4.9", l: "Su 5 stelle" },
                { n: "98%", l: "Occupazione" },
              ].map((s) =>
                <div key={s.l} style={{ padding: "16px 8px", textAlign: "center", background: "#232323" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#f3dfd9", letterSpacing: -0.5 }}>{s.n}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#aca5a5", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{s.l}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="moo-anim" style={{ padding: "44px 24px 0", animationDelay: "0.55s" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aca5a5", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Cosa facciamo
          </div>
          <h2 style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 700, margin: "10px 0 0", letterSpacing: -0.5, color: "#232323" }}>
            Dalla pulizia alla revenue: ce ne occupiamo noi.
          </h2>
        </div>

        <div className="moo-anim" style={{ padding: "24px 16px 0", animationDelay: "0.7s" }}>
          {[
            { n: "01", t: "Gestione completa", d: "Annunci, prenotazioni, comunicazione con gli ospiti, check-in e check-out. Tu non muovi un dito." },
            { n: "02", t: "Pulizie e biancheria", d: "Team interno, standard hotel. Lenzuola e asciugamani inclusi, ricambio a ogni ospite." },
            { n: "03", t: "Revenue management", d: "Prezzi dinamici giorno per giorno, ottimizzati per Booking, Airbnb, VRBO. +30% medio sul rendimento." },
            { n: "04", t: "Concierge & assistenza", d: "I tuoi ospiti hanno questa app + chat AI + un host umano reperibile. Soddisfazione garantita." },
          ].map((s, i) =>
            <div key={s.n} style={{
              display: "flex", gap: 16, padding: "20px 16px",
              borderTop: i === 0 ? "none" : "1px solid #f8f8f8"
            }}>
              <div style={{
                fontSize: 24, fontWeight: 800, color: "#f3dfd9",
                fontFamily: "'Segoe UI', sans-serif", lineHeight: 1, flexShrink: 0, width: 36
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#232323", lineHeight: 1.3 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "#aca5a5", lineHeight: 1.55, marginTop: 6 }}>{s.d}</div>
              </div>
            </div>
          )}
        </div>

        <div className="moo-anim" style={{ padding: "44px 24px 0", animationDelay: "0.85s" }}>
          <div style={{
            background: "#fafafa", borderLeft: "3px solid #f3dfd9",
            padding: "22px 22px", borderRadius: "0 20px 20px 0"
          }}>
            <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 500, color: "#232323", fontStyle: "italic", letterSpacing: -0.3 }}>
              "Da quando gestiscono il mio appartamento, ho il doppio del rendimento e zero stress."
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, background: "#232323",
                color: "#f3dfd9", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 12
              }}>L</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#232323" }}>Laura M.</div>
                <div style={{ fontSize: 11, color: "#aca5a5" }}>Proprietaria a Padova centro</div>
              </div>
            </div>
          </div>
        </div>

        <div className="moo-anim" style={{ padding: "36px 24px 0", animationDelay: "1.0s" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aca5a5", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Hai un appartamento?
          </div>
          <h2 style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 700, margin: "10px 0 14px", letterSpacing: -0.5, color: "#232323" }}>
            Parliamone. Senza impegno.
          </h2>
          <p style={{ fontSize: 14, color: "#aca5a5", lineHeight: 1.6, margin: 0 }}>
            Ti facciamo una stima personalizzata del rendimento. 15 minuti al telefono, e ti diciamo onestamente se possiamo aiutarti.
          </p>
        </div>

        <div className="moo-anim" style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10, animationDelay: "1.1s" }}>
          <a href={`https://${AP.website}`} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#232323", color: "#FFFFFF", padding: "16px 22px",
            borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 8px 20px rgba(35,35,35,0.25)"
          }}>
            Visita {AP.website} <IconChevronR size={16} stroke={2.5} />
          </a>
          <a href="mailto:hello@moorentpm.it" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#f3dfd9", color: "#232323", padding: "16px 22px",
            borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none"
          }}>Scrivici a hello@moorentpm.it
          </a>
        </div>

        <div style={{ padding: "36px 24px 24px", borderTop: "1px solid #f8f8f8", marginTop: 36 }}>
          <div style={{ fontSize: 11, color: "#aca5a5", lineHeight: 1.6 }}>
            {AP.pmName} · Padova, Italia<br />
            Per privacy e dati: privacy@moorent.it
          </div>
        </div>
      </div>
    </div>
  )
}
