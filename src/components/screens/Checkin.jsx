import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  IconCheck, IconChevronL, IconChevronR,
  IconCopy, IconKey, IconMap,
} from '../Icons'
import { APARTMENT as AP, CHECKIN_STEPS } from '../../data'
import { NavBar } from './NavBar'
import { useLang, DATA_TRANSLATIONS } from '../../i18n'

const ArrivalMap = React.memo(function ArrivalMap() {
  const containerRef = React.useRef(null)
  const mapRef = React.useRef(null)
  React.useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    const map = L.map(containerRef.current, {
      center: AP.coords, zoom: 17,
      zoomControl: false, attributionControl: false,
      dragging: false, scrollWheelZoom: false,
      doubleClickZoom: false, touchZoom: false, keyboard: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
    const icon = L.divIcon({
      html: `<div style="transform:translate(-50%,-50%);width:44px;height:44px;position:relative;">
        <div style="position:absolute;inset:0;border-radius:999px;background:var(--accent,#C27248);opacity:.18;animation:ping 2s infinite;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:999px;background:var(--accent,#C27248);border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.3);"></div>
      </div>`,
      className: '', iconSize: [0, 0], iconAnchor: [0, 0],
    })
    L.marker(AP.coords, { icon, interactive: false }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
})

export function ArrivalCheckin({ back, go }) {
  const { t, tData, lang } = useLang()
  const localSteps = tData('checkinSteps')
  const steps = localSteps || CHECKIN_STEPS
  const [i, setI] = React.useState(0)
  const [copiedCode, setCopiedCode] = React.useState(false)
  const s = steps[i]
  // photo comes from the Italian source when translated steps don't have it
  const photo = s.photo || (CHECKIN_STEPS[i] && CHECKIN_STEPS[i].photo)
  const checkinRef = React.useRef(null)
  const copyCode = (val) => {
    try { navigator.clipboard?.writeText(val) } catch {}
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const transportItems = [
    { id: "train", icon: "🚆", t: t('arrival.trainLabel'), sub: t('arrival.trainSub') },
    { id: "car",   icon: "🚗", t: t('arrival.carLabel'),   sub: t('arrival.carSub') },
    { id: "bus",   icon: "🚌", t: t('arrival.busLabel'),   sub: t('arrival.busSub') },
  ]

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('arrival.title')} />

      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          {t('arrival.hero').split(' ').slice(0, -1).join(' ')} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t('arrival.hero').split(' ').slice(-1)[0]}</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10 }}>{AP.address}</div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ height: 180, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
          <ArrivalMap />
        </div>
        <a href="https://maps.google.com/?q=Via+Trieste+25+Padova" target="_blank" rel="noreferrer"
          className="btn btn-ghost btn-full" style={{ marginTop: 10 }}>
          <IconMap size={18} stroke={2} /> {t('arrival.openNav')}
        </a>
      </div>

      <div style={{ padding: "26px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>
          {t('arrival.howToGet')}
        </div>
        <div className="card-tight">
          {transportItems.map((r) =>
            <button key={r.id} onClick={() => go("transport", r.id)}
              className="row" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 24, flexShrink: 0, width: 36, textAlign: "center" }}>{r.icon}</div>
              <div className="grow">
                <div className="t-15 w-600">{r.t}</div>
                <div className="t-12 muted" style={{ marginTop: 2 }}>{r.sub}</div>
              </div>
              <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)" }} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <button onClick={() => checkinRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="btn btn-accent btn-lg btn-full">
          {t('arrival.checkinBtn')}
        </button>
      </div>

      <div ref={checkinRef} style={{ padding: "36px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{t('arrival.onceHere')}</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, fontWeight: 500, marginTop: 6 }}>
          {t('arrival.procedure')}
        </div>
        <div className="t-13 muted" style={{ marginTop: 6 }}>{t('arrival.step')} {i + 1} {t('arrival.of')} {steps.length}</div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="https://youtu.be/SPO1ag6bz5Q" target="_blank" rel="noreferrer" style={{
          position: "relative", overflow: "hidden", borderRadius: 22, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", padding: "18px 18px", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 24px rgba(26,25,22,0.18)", textDecoration: "none"
        }}>
          <div style={{
            position: "absolute", right: -20, top: -20, width: 140, height: 140,
            borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.45
          }} />
          <div style={{
            width: 52, height: 52, borderRadius: 999, flexShrink: 0,
            background: "rgba(255,255,255,0.95)", color: "#1A1916",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)", position: "relative"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          </div>
          <div className="grow" style={{ position: "relative" }}>
            <div className="t-11 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {t('arrival.videoLabel')}
            </div>
            <div className="t-15 w-600" style={{ marginTop: 4, lineHeight: 1.3 }}>
              {t('arrival.videoTitle')}
            </div>
          </div>
          <IconChevronR size={18} stroke={2.5} style={{ position: "relative", opacity: 0.6, flexShrink: 0 }} />
        </a>

        <div style={{
          background: "var(--surface)", borderRadius: 22, padding: "18px",
          boxShadow: "0 4px 14px rgba(26,25,22,0.05)",
          display: "flex", alignItems: "center", gap: 14
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: "var(--accent-soft)", color: "var(--accent-deep)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <IconKey size={24} stroke={2} />
          </div>
          <div className="grow">
            <div className="t-11 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t('arrival.keySafe')}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <div style={{
                fontFamily: "ui-monospace, monospace", fontSize: 26, fontWeight: 800,
                letterSpacing: 4, color: "var(--ink)"
              }}>1470</div>
              <div className="t-11 muted">{t('arrival.keyCode')}</div>
            </div>
          </div>
          <button onClick={() => copyCode("1470")} style={{
            height: 38, borderRadius: 10, border: "none",
            background: copiedCode ? "var(--ok)" : "rgba(26,25,22,0.06)",
            color: copiedCode ? "#fff" : "var(--ink)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, padding: copiedCode ? "0 12px" : "0",
            width: copiedCode ? "auto" : 38, gap: 4,
            transition: "all .2s", fontSize: 12, fontWeight: 700,
          }}>
            {copiedCode ? <><IconCheck size={14} stroke={3}/> {t('arrival.copied')}</> : <IconCopy size={16} stroke={2.2} />}
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-12 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{t('arrival.stepsDetail')}</div>
      </div>

      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {steps.map((_, k) =>
            <div key={k} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: k <= i ? "var(--accent)" : "rgba(26,25,22,0.1)"
            }} />
          )}
        </div>

        {photo
          ? <img src={photo} alt={s.t} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 20, marginBottom: 18, display: "block" }} />
          : <div className="img-placeholder" style={{ height: 200, borderRadius: 20, marginBottom: 18 }}>{s.img}</div>
        }

        <div className="serif" style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 500 }}>
          {s.t}
        </div>
        <div className="t-15 muted-2" style={{ marginTop: 10, lineHeight: 1.55 }}>
          {s.d}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", gap: 10 }}>
        {i > 0 &&
          <button onClick={() => setI(i - 1)} className="btn btn-ghost btn-lg" style={{ flexShrink: 0, width: 50 }}>
            <IconChevronL size={18} stroke={2.5} />
          </button>
        }
        {i < steps.length - 1 ?
          <button onClick={() => setI(i + 1)} className="btn btn-accent btn-lg grow">
            {t('arrival.next')} <IconChevronR size={16} stroke={2.5} />
          </button> :
          <button onClick={back} className="btn btn-accent btn-lg grow">
            <IconCheck size={18} stroke={2.5} /> {t('arrival.done')}
          </button>
        }
      </div>
    </div>
  )
}

export function TransportDetail({ back, mode }) {
  const { t, lang } = useLang()
  const localData = DATA_TRANSLATIONS.transportData[lang] || DATA_TRANSLATIONS.transportData.it

  const itData = {
    train: {
      icon: "🚆", title: "Arrivo in treno",
      sub: "Dalla stazione di Padova al loft sono 5 minuti a piedi",
      intro: "La stazione ferroviaria di Padova è una delle meglio collegate del nord Italia: Frecciarossa, Italo, e regionali per Venezia (25 min), Verona (50 min), Bologna (1h).",
      sections: [
        { t: "A piedi (5 min)", d: "Uscita principale → gira a destra in Via Trieste. Civico 25 è sul lato destro. Non puoi sbagliare." },
        { t: "Taxi (3 min)", d: "Stazione taxi davanti all'uscita principale. Costo circa €8. Niente fila di solito." },
        { t: "Bagagli pesanti?", d: "Davanti alla stazione ci sono carrelli portabagagli gratuiti." },
      ],
      cta: { label: "Orari treni Trenitalia", url: "https://www.trenitalia.com" },
      cta2: { label: "Percorso a piedi su Maps", url: "https://www.google.com/maps/dir/?api=1&origin=Stazione+Padova&destination=Via+Trieste+25+Padova&travelmode=walking" },
    },
    car: {
      icon: "🚗", title: "Arrivo in auto",
      sub: "Uscita autostradale Padova Est, poi 12 minuti al loft",
      intro: "Da nord/sud (A13): uscita Padova Est. Da est/ovest (A4): uscita Padova Ovest. Il quartiere è ZTL ma Via Trieste è libera per residenti.",
      sections: [
        { t: "Parcheggio in strada (gratuito)", d: "In Via Trieste e laterali (Via Belzoni, Via Beato Pellegrino) trovi posti gratuiti — di solito sul lato destro andando verso il loft." },
        { t: "Parcheggio coperto (consigliato)", d: "Park Antenore, €15/giorno, 4 min a piedi. Convenzionato per i nostri ospiti." },
        { t: "Attenzione alla ZTL", d: "Il centro storico è ZTL. Se vai oltre il loft, telecamere attive 7:30-20:00." },
      ],
      cta: { label: "Apri navigazione su Maps", url: "https://www.google.com/maps/dir/?api=1&destination=Via+Trieste+25+Padova&travelmode=driving" },
      cta2: { label: "Convenzione Park Antenore", url: "https://www.parkantenore.it" },
    },
    bus: {
      icon: "🚌", title: "Bus & tram",
      sub: "Rete BusItalia Veneto · biglietto €1.50",
      intro: "La fermata Trieste è a 100 metri dal loft. Il tram T1 e diverse linee bus collegano il centro storico, la stazione e i quartieri.",
      sections: [
        { t: "Dal centro storico", d: "Tram T1 fermata Eremitani → Trieste (4 min, ogni 7 min)" },
        { t: "Dalla stazione", d: "Tram T1 verso sud, fermata Trieste (2 min)" },
        { t: "App mobile", d: "Compra il biglietto con l'app DropTicket. Valido 75 min." },
        { t: "Biglietto giornaliero", d: "€4 per tutta la giornata — conviene se prevedi di muoverti molto." },
      ],
      cta: { label: "Orari BusItalia", url: "https://www.fsbusitalia.it/content/fsbusitalia/it/veneto" },
      cta2: { label: "Scarica DropTicket", url: "https://www.dropticket.it" },
    },
  }

  const data = localData || itData
  const d = (data[mode] || data.train)

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('transport.title')} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 12 }}>{d.icon}</div>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500, letterSpacing: -0.02 }}>
          {d.title}
        </div>
        <div className="t-14 muted-2" style={{ marginTop: 10, lineHeight: 1.55 }}>{d.sub}</div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-15" style={{ lineHeight: 1.6, color: "var(--ink-2)" }}>{d.intro}</div>
      </div>

      <div style={{ padding: "24px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {d.sections.map((s, idx) =>
          <div key={idx} className="card" style={{ padding: 16 }}>
            <div className="t-15 w-600">{s.t}</div>
            <div className="t-13 muted-2" style={{ marginTop: 6, lineHeight: 1.55 }}>{s.d}</div>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <a href={d.cta.url} target="_blank" rel="noreferrer" className="btn btn-accent btn-lg btn-full">
          {d.cta.label} →
        </a>
        <a href={d.cta2.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg btn-full">
          {d.cta2.label}
        </a>
      </div>
    </div>
  )
}

export function Checkin({ back }) {
  const { t, tData } = useLang()
  const localSteps = tData('checkinSteps')
  const steps = localSteps || CHECKIN_STEPS
  const [i, setI] = React.useState(0)
  const s = steps[i]
  const photo = s.photo || (CHECKIN_STEPS[i] && CHECKIN_STEPS[i].photo)

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 30 }}>
      <NavBar back={back} title={`${t('arrival.step')} ${i + 1} ${t('arrival.of')} ${steps.length}`} />

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {steps.map((_, k) =>
            <div key={k} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: k <= i ? "var(--accent)" : "rgba(26,25,22,0.1)"
            }} />
          )}
        </div>

        {photo
          ? <img src={photo} alt={s.t} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 20, marginBottom: 20, display: "block" }} />
          : <div className="img-placeholder" style={{ height: 220, borderRadius: 20, marginBottom: 20 }}>{s.img}</div>
        }

        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500, letterSpacing: -0.02 }}>
          {s.t}
        </div>
        <div className="t-15 muted-2" style={{ marginTop: 14, lineHeight: 1.55 }}>
          {s.d}
        </div>
      </div>

      <div style={{ padding: "32px 16px 0", display: "flex", gap: 10 }}>
        {i > 0 &&
          <button onClick={() => setI(i - 1)} className="btn btn-ghost btn-lg" style={{ flexShrink: 0, width: 50 }}>
            <IconChevronL size={18} stroke={2.5} />
          </button>
        }
        {i < steps.length - 1 ?
          <button onClick={() => setI(i + 1)} className="btn btn-accent btn-lg grow">
            {t('arrival.next')} <IconChevronR size={16} stroke={2.5} />
          </button> :
          <button onClick={back} className="btn btn-accent btn-lg grow">
            <IconCheck size={18} stroke={2.5} /> {t('arrival.done')}
          </button>
        }
      </div>
    </div>
  )
}
