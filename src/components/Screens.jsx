import React from 'react'
import {
  IconCheck, IconChevronL, IconChevronR, IconChevronD,
  IconCopy, IconHeart, IconKey, IconMap, IconPhone,
  IconSparkle, IconStar, IconX,
} from './Icons'
import { MapBg } from './Padova'
import {
  APARTMENT as AP, CHECKIN_STEPS, CHECKOUT_STEPS,
  HOUSE_RULES, APPLIANCES, FAQ, MOODS, PLACES, EMERGENCY,
} from '../data'





// Canvas helpers for coupon image generation
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = String(text).split(" ");
  let line = "";
  let yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[i] + " ";
      yy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, yy);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Saved itineraries helpers
const ITIN_STORAGE = "elegant-loft-itineraries";
function loadItineraries() {
  try { return JSON.parse(localStorage.getItem(ITIN_STORAGE) || "[]"); } catch { return []; }
};
function saveItinerary(itin) {
  const list = loadItineraries();
  list.unshift({ ...itin, id: Date.now().toString(), savedAt: new Date().toISOString() });
  try { localStorage.setItem(ITIN_STORAGE, JSON.stringify(list.slice(0, 30))); } catch {}
  return list;
};
function deleteItinerary(id) {
  const list = loadItineraries().filter(i => i.id !== id);
  try { localStorage.setItem(ITIN_STORAGE, JSON.stringify(list)); } catch {}
  return list;
};

function SavedItineraries({ onOpen }) {
  const [items, setItems] = React.useState(() => loadItineraries());
  const [confirmDel, setConfirmDel] = React.useState(null);
  const del = (id, e) => { e?.stopPropagation(); setItems(deleteItinerary(id)); setConfirmDel(null); };
  if (items.length === 0) return null;
  return (
    <div style={{ padding: "32px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
          I tuoi <em style={{ fontStyle: "italic", color: "var(--accent)" }}>itinerari</em>
        </div>
        <div className="t-12 muted">{items.length} salvati</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => {
          const dateStr = new Date(it.savedAt).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
          return (
            <div key={it.id} style={{
              background: "var(--surface)", borderRadius: 18, padding: "12px 14px",
              boxShadow: "0 2px 10px rgba(26,25,22,0.05)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <button onClick={() => onOpen(it)} style={{
                background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: "var(--accent-soft)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{it.mood?.emoji || "✨"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-15 w-600" style={{ lineHeight: 1.25 }}>
                    {it.mood?.label || "Itinerario"} · {it.days} {it.days === 1 ? "giorno" : "giorni"}
                  </div>
                  <div className="t-12 muted" style={{ marginTop: 3 }}>Salvato il {dateStr}</div>
                </div>
              </button>
              <button onClick={(e) => confirmDel === it.id ? del(it.id, e) : (e.stopPropagation(), setConfirmDel(it.id))} style={{
                width: 32, height: 32, borderRadius: 999, border: "none",
                background: confirmDel === it.id ? "var(--accent)" : "rgba(26,25,22,0.05)",
                color: confirmDel === it.id ? "#fff" : "var(--ink-3)",
                cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {confirmDel === it.id ? <IconCheck size={14} stroke={3}/> : <IconX size={14} stroke={2.5}/>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// ITINERARY — the crown jewel. No form. Swipe moods → get a ready plan.
// ─────────────────────────────────────────────────────
export function Itinerary({ back, go }) {
  const [step, setStep] = React.useState("pick"); // pick → duration → result
  const [mood, setMood] = React.useState(null);
  const [days, setDays] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [reopen, setReopen] = React.useState(null);

  const pick = (m) => {setMood(m);setStep("duration");};
  const gen = (d) => {
    setDays(d);setLoading(true);
    setTimeout(() => {setLoading(false);setStep("result");}, 900);
  };
  const openSaved = (it) => {
    setMood(it.mood); setDays(it.days); setReopen(it); setStep("result");
  };

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 90 }}>
      <NavBar back={back} title="Itinerario" />

      {step === "pick" &&
      <div>
          <div style={{ padding: "4px 20px 8px" }}>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
              Che giornata <em style={{ fontStyle: "italic", color: "var(--accent)" }}>vorresti</em>?
            </div>
            <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
              Scegli un'atmosfera. Non serve altro — il resto lo penso io.
            </div>
          </div>

          <div style={{ padding: "20px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {MOODS.map((m) =>
          <button key={m.id} onClick={() => pick(m)} style={{
            background: "var(--surface)", border: "none", borderRadius: 22,
            padding: "20px 16px", textAlign: "left", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,25,22,0.06)",
            display: "flex", flexDirection: "column", gap: 4, minHeight: 130
          }}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{m.emoji}</div>
                <div className="t-17 w-600" style={{ marginTop: 10 }}>{m.label}</div>
                <div className="t-12 muted" style={{ lineHeight: 1.4 }}>{m.sub}</div>
              </button>
          )}
          </div>

          {/* Saved itineraries */}
          <SavedItineraries onOpen={(it) => { setMood(it.mood); setDays(it.days); setReopen(it); setStep("result"); }} />
        </div>
      }

      {step === "duration" && mood &&
      <div style={{ padding: "8px 20px 0" }}>
          <div className="chip" style={{ background: "rgba(26,25,22,0.05)", color: "var(--ink-2)" }}>
            {mood.emoji} {mood.label}
          </div>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, marginTop: 16, fontWeight: 500 }}>
            Quanti <em style={{ color: "var(--accent)", fontStyle: "italic" }}>giorni</em> hai?
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
          { d: 1, label: "1 giorno", sub: "Le cose essenziali" },
          { d: 2, label: "2 giorni", sub: "Padova con calma" },
          { d: 3, label: "3 giorni", sub: "Anche i dintorni" },
          { d: 4, label: "4+ giorni", sub: "Vivi come un padovano" }].
          map((o) =>
          <button key={o.d} onClick={() => gen(o.d)} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--surface)", border: "none", borderRadius: 18,
            padding: "18px 18px", textAlign: "left", cursor: "pointer",
            boxShadow: "0 2px 10px rgba(26,25,22,0.05)"
          }}>
                <div className="grow">
                  <div className="t-17 w-600">{o.label}</div>
                  <div className="t-13 muted" style={{ marginTop: 2 }}>{o.sub}</div>
                </div>
                <IconChevronR size={18} stroke={2.2} style={{ color: "var(--ink-4)" }} />
              </button>
          )}
          </div>
        </div>
      }

      {step === "result" &&
      <ItineraryResult mood={mood} days={days} loading={loading} back={() => { setReopen(null); setStep("pick"); }} go={go} reopen={reopen} />
      }
    </div>);

}

export function ItineraryResult({ mood, days, loading, back, go, reopen }) {
  // Curated plans per mood — extended to support multi-day
  const day1 = {
    slow: [
    { t: "09:30", title: "Colazione al Pedrocchi", sub: "Caffè alla menta, 15 minuti di pace", tag: "Caffè", tint: "#CFB487" },
    { t: "11:00", title: "Passeggiata in Piazza delle Erbe", sub: "Mercato del mattino, atmosfera vera", tag: "Piazza", tint: "#E2B670" },
    { t: "13:00", title: "Pranzo da Dalla Zita", sub: "Tramezzini leggendari — 2 bastano", tag: "Pranzo", tint: "#9B7A55" },
    { t: "15:30", title: "Orto Botanico", sub: "Mezz'ora di calma tra le piante rare", tag: "Verde", tint: "#7A9D6E" }],

    art: [
    { t: "10:00", title: "Cappella degli Scrovegni", sub: "Giotto. Prenota il turno delle 10.", tag: "Must", tint: "#7E6CE8" },
    { t: "11:30", title: "Musei Civici Eremitani", sub: "Nella stessa area, continua il tema", tag: "Museo", tint: "#5C5099" },
    { t: "13:30", title: "Pranzo all'Osteria dei Fabbri", sub: "Risotto al radicchio", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "16:00", title: "Palazzo della Ragione", sub: "Mercato storico + affreschi", tag: "Storia", tint: "#A88560" }],

    food: [
    { t: "11:00", title: "Tramezzino da Dalla Zita", sub: "Uno leggero, per aprire lo stomaco", tag: "Snack", tint: "#C99E6E" },
    { t: "13:00", title: "Pranzo dei Fabbri", sub: "Menu del giorno, prodotti veneti", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "17:30", title: "Spritz al Bar Nazionale", sub: "Piazza delle Erbe al tramonto", tag: "Aperitivo", tint: "#E08762" },
    { t: "20:00", title: "Cena alla Folperia", sub: "Street food veneto, tavoli in strada", tag: "Cena", tint: "#5A4434" }],

    green: [
    { t: "10:00", title: "Orto Botanico", sub: "Patrimonio UNESCO. Due ore belle.", tag: "Verde", tint: "#7A9D6E" },
    { t: "12:30", title: "Pranzo in Prato della Valle", sub: "Panini di Mauri + erba", tag: "Picnic", tint: "#A8B97A" },
    { t: "15:30", title: "Giro in bici sul Piovego", sub: "Sconto 20% con la app", tag: "Attività", tint: "#4A7C5A" }],

    night: [
    { t: "18:30", title: "Spritz in piazza", sub: "Delle Erbe o dei Signori, tu scegli", tag: "Aperitivo", tint: "#E08762" },
    { t: "20:30", title: "Cena alla Folperia", sub: "Cicchetti veneti", tag: "Cena", tint: "#5A4434" },
    { t: "22:30", title: "Drink in Via del Santo", sub: "Locali piccoli, zero turisti", tag: "Dopo cena", tint: "#2C2740" }],

    rain: [
    { t: "10:00", title: "Scrovegni al coperto", sub: "Quasi nessuna coda quando piove", tag: "Museo", tint: "#7E6CE8" },
    { t: "12:30", title: "Pedrocchi, piano nobile", sub: "Caffè lungo, vista sulla piazza", tag: "Caffè", tint: "#CFB487" },
    { t: "14:30", title: "Palazzo della Ragione", sub: "Enorme, ore di esplorazione", tag: "Storia", tint: "#A88560" }]

  };

  // Day 2+: deeper cuts
  const day2 = {
    slow: [
    { t: "09:30", title: "Caffè al Caffè dell'Argine", sub: "Sui Navigli padovani, meno turisti", tag: "Caffè", tint: "#CFB487" },
    { t: "11:00", title: "Basilica di Sant'Antonio", sub: "Il Santo, anche se non sei religioso", tag: "Sacro", tint: "#A88560" },
    { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "16:00", title: "Prato della Valle al tramonto", sub: "La piazza più grande d'Europa, vibe magica", tag: "Iconico", tint: "#E08762" }],

    art: [
    { t: "10:00", title: "Palazzo Zuckermann", sub: "Arti applicate, sempre vuoto", tag: "Museo", tint: "#5C5099" },
    { t: "12:00", title: "Oratorio di San Giorgio", sub: "Affreschi di Altichiero, gioiello nascosto", tag: "Tesoro", tint: "#7E6CE8" },
    { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "15:30", title: "Battistero del Duomo", sub: "Cupola affrescata dal Menabuoi", tag: "Sacro", tint: "#A88560" }],

    food: [
    { t: "10:30", title: "Pasticceria Graziati", sub: "Sfogliatina + caffè, sconto 10%", tag: "Dolce", tint: "#C99E6E" },
    { t: "12:30", title: "Trattoria al Sasso", sub: "Vera cucina padovana, lontana dai turisti", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "17:00", title: "Birrificio Padova", sub: "Birre locali, tagliere veneto", tag: "Aperitivo", tint: "#5C7A5A" },
    { t: "20:30", title: "Cena al Calandre", sub: "Stella Michelin (in zona, prenota)", tag: "Cena", tint: "#2C2740" }],

    green: [
    { t: "09:30", title: "Mercato di Piazza delle Erbe", sub: "Frutta e verdura, vivace ogni mattina", tag: "Mercato", tint: "#A8B97A" },
    { t: "11:30", title: "Giardini dell'Arena", sub: "Parco urbano accanto agli Scrovegni", tag: "Verde", tint: "#7A9D6E" },
    { t: "14:00", title: "Bici verso Abano Terme", sub: "20 km su pista, terme alla fine", tag: "Attività", tint: "#4A7C5A" }],

    night: [
    { t: "19:00", title: "Aperitivo a Piazzetta Pedrocchi", sub: "Locali studenteschi, vivace", tag: "Aperitivo", tint: "#E08762" },
    { t: "21:00", title: "Cena alla Birreria Padovanelle", sub: "Veneto rustico, porzioni vere", tag: "Cena", tint: "#5A4434" },
    { t: "23:00", title: "Live music al Banale", sub: "Jazz e blues, atmosfera intima", tag: "Musica", tint: "#2C2740" }],

    rain: [
    { t: "10:30", title: "Musei Civici agli Eremitani", sub: "3 ore tranquille al coperto", tag: "Museo", tint: "#5C5099" },
    { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
    { t: "16:00", title: "Caffè & shopping Galleria Borromeo", sub: "Boutiques sotto i portici", tag: "Shopping", tint: "#C99E6E" }]

  };

  // Day 3+: even deeper
  const day3 = {
    slow: day2.slow, art: day2.art, food: day2.food,
    green: day2.green, night: day2.night, rain: day2.rain
  };

  const allDays = [day1, day2, day3, day3]; // up to 4 days
  const plans = allDays.slice(0, days).map((d) => mood ? d[mood.id] || d.slow : d.slow);

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999, border: "3px solid var(--ink-4)",
          borderTopColor: "var(--accent)", animation: "sp 0.9s linear infinite", margin: "0 auto"
        }} />
        <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
        <div className="t-14 muted" style={{ marginTop: 16 }}>
          Sto preparando qualcosa su misura…
        </div>
      </div>);

  }

  return <ItineraryDays mood={mood} plans={plans} days={days} back={back} go={go} reopen={reopen} />;
}

// Multi-day swipeable result view
export function ItineraryDays({ mood, plans, days, back, go, reopen }) {
  const [dayIdx, setDayIdx] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(null);
  const [saved, setSaved] = React.useState(!!reopen);
  const plan = plans[dayIdx];

  const onSave = () => {
    if (saved) return;
    saveItinerary({ mood, days });
    setSaved(true);
  };

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && dayIdx < plans.length - 1) setDayIdx(dayIdx + 1);else
      if (dx > 0 && dayIdx > 0) setDayIdx(dayIdx - 1);
    }
    setTouchStart(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "8px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="chip">{mood?.emoji} {mood?.label}</div>
        <button onClick={back} className="t-13 w-600" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
          Cambia
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 500 }}>
          {plans.length === 1 ? "La tua " : `Giorno ${dayIdx + 1} di ${plans.length} — la tua `}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>giornata</em>.
        </div>
        <div className="t-13 muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
          {plan.length} tappe.{plans.length > 1 ? " Scorri ← → per gli altri giorni." : ""}
        </div>
      </div>

      {/* Day tabs (clickable + visual) */}
      {plans.length > 1 &&
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 6 }}>
          {plans.map((_, i) =>
        <button key={i} onClick={() => setDayIdx(i)} style={{
          flex: 1, padding: "10px 6px", borderRadius: 12, border: "none", cursor: "pointer",
          background: dayIdx === i ? "var(--accent)" : "rgba(26,25,22,0.06)",
          color: dayIdx === i ? "#fff" : "var(--ink-2)",
          fontSize: 12, fontWeight: 700
        }}>Giorno {i + 1}</button>
        )}
        </div>
      }

      {/* Map FIRST */}
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ position: "relative", height: 240, borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 24px rgba(26,25,22,0.08)" }}>
          <ItineraryMap plan={plan} />
        </div>
      </div>

      {/* Swipeable plan cards */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ padding: "24px 16px 8px" }}>
        {plan.map((step, i) =>
        <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
            <div style={{ flexShrink: 0, width: 50, textAlign: "right", paddingTop: 18 }}>
              <div className="t-13 w-600" style={{ color: "var(--accent-deep)" }}>{step.t}</div>
            </div>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
              width: 26, height: 26, borderRadius: 999, background: "var(--accent)", color: "#fff",
              margin: "16px 2px 0", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, boxShadow: "0 0 0 4px var(--bg)"
            }}>{i + 1}</div>
              {i < plan.length - 1 &&
            <div style={{
              position: "absolute", top: 44, left: 13, bottom: -8, width: 2,
              background: "var(--ink-4)", opacity: 0.3
            }} />
            }
            </div>
            <div className="grow" style={{ paddingBottom: 14 }}>
              <div style={{
              background: "var(--surface)", borderRadius: 18, overflow: "hidden",
              boxShadow: "0 4px 14px rgba(26,25,22,0.06)"
            }}>
                {/* Photo placeholder strip */}
                <div style={{
                height: 110,
                background: `linear-gradient(135deg, ${step.tint} 0%, ${step.tint}AA 70%, ${step.tint}66 100%)`,
                position: "relative", overflow: "hidden"
              }}>
                  <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 14px)"
                }} />
                  <div style={{
                  position: "absolute", bottom: 10, left: 14, color: "#fff",
                  fontSize: 10, opacity: 0.75, fontFamily: "ui-monospace, monospace"
                }}>📸 {step.title}</div>
                  <div style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "4px 10px", borderRadius: 999,
                  background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
                  color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5
                }}>{step.tag}</div>
                </div>
                <div style={{ padding: "14px 16px 16px" }}>
                  <div className="t-15 w-600" style={{ lineHeight: 1.3 }}>{step.title}</div>
                  <div className="t-13 muted" style={{ marginTop: 4, lineHeight: 1.45 }}>{step.sub}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(step.title + ', Padova')}`}
                      target="_blank" rel="noreferrer"
                      className="chip-ghost chip" style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <IconMap size={12} stroke={2.5} /> Indicazioni
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px 20px", display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={saved} className="btn btn-ghost grow" style={{
          opacity: saved ? 0.6 : 1,
          background: saved ? "var(--accent-soft)" : undefined,
          color: saved ? "var(--accent-deep)" : undefined,
        }}>
          {saved ? <><IconCheck size={16} stroke={3}/> Salvato</> : "Salva"}
        </button>
        <a
          href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plan[plan.length - 1]?.title + ', Padova')}&waypoints=${plan.slice(0, -1).map(s => encodeURIComponent(s.title + ', Padova')).join('|')}`}
          target="_blank" rel="noreferrer"
          className="btn btn-accent grow" style={{ textDecoration: "none" }}
        >
          <IconMap size={18} stroke={2} /> Apri navigazione
        </a>
      </div>
    </div>);

}

export function ItineraryMap({ plan }) {
  // Distribute pins along a route
  const positions = [
  { top: "30%", left: "30%" },
  { top: "55%", left: "50%" },
  { top: "40%", left: "68%" },
  { top: "70%", left: "40%" }];

  const pins = plan.slice(0, 4).map((p, i) => ({
    id: "p" + i, ...positions[i % positions.length], name: p.title
  }));
  // Build a dashed path through them
  const coords = pins.map((p, i) => {
    const x = parseFloat(p.left) * 4;
    const y = parseFloat(p.top) * 8;
    return `${i === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ");
  return (
    <MapBg pins={pins} path={{ d: coords }} numbered={true}
    userPin={{ top: "50%", left: "15%" }} />);

}

// ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────
// ARRIVAL + CHECKIN — combined: how to get here, then how to enter
// ─────────────────────────────────────────────────────
export function ArrivalCheckin({ back, go }) {
  const steps = CHECKIN_STEPS;
  const [i, setI] = React.useState(0);
  const s = steps[i];
  const checkinRef = React.useRef(null);

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Arrivo & casa" />

      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          Ti aspettiamo <em style={{ fontStyle: "italic", color: "var(--accent)" }}>qui</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10 }}>{AP.address}</div>
      </div>

      {/* Map */}
      <div style={{ padding: "20px 16px 0" }}>
        <div className="img-placeholder" style={{ height: 180, borderRadius: 20 }}>
          🗺️ Mappa — Via Trieste 25, Padova
        </div>
        <a href="https://maps.google.com/?q=Via+Trieste+25+Padova" target="_blank" rel="noreferrer"
        className="btn btn-ghost btn-full" style={{ marginTop: 10 }}>
          <IconMap size={18} stroke={2} /> Apri navigazione
        </a>
      </div>

      {/* How to reach */}
      <div style={{ padding: "26px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>
          Come arrivare
        </div>
        <div className="card-tight">
          {[
          { id: "train", icon: "🚆", t: "In treno", sub: "5 min a piedi dalla stazione" },
          { id: "car", icon: "🚗", t: "In auto", sub: "Parcheggi gratuiti vicini" },
          { id: "bus", icon: "🚌", t: "Bus & tram", sub: "Fermata Trieste a 100 metri" }].
          map((r) =>
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

      {/* CTA: jump to check-in steps */}
      <div style={{ padding: "20px 16px 0" }}>
        <button onClick={() => checkinRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="btn btn-accent btn-lg btn-full">
          Sono in via Trieste → procedura check-in
        </button>
      </div>

      {/* CHECK-IN walkthrough */}
      <div ref={checkinRef} style={{ padding: "36px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Una volta qui</div>
        <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, fontWeight: 500, marginTop: 6 }}>
          Procedura check-in
        </div>
        <div className="t-13 muted" style={{ marginTop: 6 }}>Passo {i + 1} di {steps.length}</div>
      </div>

      {/* Hero CTAs: video tutorial + cassetta code */}
      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Video tutorial CTA */}
        <button style={{
          position: "relative", overflow: "hidden", borderRadius: 22, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", padding: "18px 18px", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 24px rgba(26,25,22,0.18)"
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
              Video tutorial · 1:20
            </div>
            <div className="t-15 w-600" style={{ marginTop: 4, lineHeight: 1.3 }}>
              Guarda come entrare nel loft
            </div>
          </div>
          <IconChevronR size={18} stroke={2.5} style={{ position: "relative", opacity: 0.6, flexShrink: 0 }} />
        </button>

        {/* Cassetta code CTA */}
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
              Cassetta n° 5
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <div style={{
                fontFamily: "ui-monospace, monospace", fontSize: 26, fontWeight: 800,
                letterSpacing: 4, color: "var(--ink)"
              }}>0425</div>
              <div className="t-11 muted">codice apertura</div>
            </div>
          </div>
          <button onClick={() => {try {navigator.clipboard?.writeText("0425");} catch {}}} style={{
            width: 38, height: 38, borderRadius: 10, border: "none",
            background: "rgba(26,25,22,0.06)", color: "var(--ink)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <IconCopy size={16} stroke={2.2} />
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-12 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>I passaggi nel dettaglio</div>
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

        <div className="img-placeholder" style={{ height: 200, borderRadius: 20, marginBottom: 18 }}>
          {s.img}
        </div>

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
            Fatto, avanti <IconChevronR size={16} stroke={2.5} />
          </button> :

        <button onClick={back} className="btn btn-accent btn-lg grow">
            <IconCheck size={18} stroke={2.5} /> Sono dentro!
          </button>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// TRANSPORT DETAIL — train, car, bus
// ─────────────────────────────────────────────────────
export function TransportDetail({ back, mode }) {
  const data = {
    train: {
      icon: "🚆", title: "Arrivo in treno",
      sub: "Dalla stazione di Padova al loft sono 5 minuti a piedi",
      intro: "La stazione ferroviaria di Padova è una delle meglio collegate del nord Italia: Frecciarossa, Italo, e regionali per Venezia (25 min), Verona (50 min), Bologna (1h).",
      sections: [
      { t: "A piedi (5 min)", d: "Uscita principale → gira a destra in Via Trieste. Civico 25 è sul lato destro. Non puoi sbagliare." },
      { t: "Taxi (3 min)", d: "Stazione taxi davanti all'uscita principale. Costo circa €8. Niente fila di solito." },
      { t: "Bagagli pesanti?", d: "Davanti alla stazione ci sono carrelli portabagagli gratuiti." }],

      cta: { label: "Orari treni Trenitalia", url: "https://www.trenitalia.com" },
      cta2: { label: "Percorso a piedi su Maps", url: "https://www.google.com/maps/dir/?api=1&origin=Stazione+Padova&destination=Via+Trieste+25+Padova&travelmode=walking" }
    },
    car: {
      icon: "🚗", title: "Arrivo in auto",
      sub: "Uscita autostradale Padova Est, poi 12 minuti al loft",
      intro: "Da nord/sud (A13): uscita Padova Est. Da est/ovest (A4): uscita Padova Ovest. Il quartiere è ZTL ma Via Trieste è libera per residenti.",
      sections: [
      { t: "Parcheggio in strada (gratuito)", d: "In Via Trieste e laterali (Via Belzoni, Via Beato Pellegrino) trovi posti gratuiti — di solito sul lato destro andando verso il loft." },
      { t: "Parcheggio coperto (consigliato)", d: "Park Antenore, €15/giorno, 4 min a piedi. Convenzionato per i nostri ospiti." },
      { t: "Attenzione alla ZTL", d: "Il centro storico è ZTL. Se vai oltre il loft, telecamere attive 7:30-20:00." }],

      cta: { label: "Apri navigazione su Maps", url: "https://www.google.com/maps/dir/?api=1&destination=Via+Trieste+25+Padova&travelmode=driving" },
      cta2: { label: "Convenzione Park Antenore", url: "https://www.parkantenore.it" }
    },
    bus: {
      icon: "🚌", title: "Bus & tram",
      sub: "Rete BusItalia Veneto · biglietto €1.50",
      intro: "La fermata Trieste è a 100 metri dal loft. Il tram T1 e diverse linee bus collegano il centro storico, la stazione e i quartieri.",
      sections: [
      { t: "Dal centro storico", d: "Tram T1 fermata Eremitani → Trieste (4 min, ogni 7 min)" },
      { t: "Dalla stazione", d: "Tram T1 verso sud, fermata Trieste (2 min)" },
      { t: "App mobile", d: "Compra il biglietto con l'app DropTicket. Valido 75 min." },
      { t: "Biglietto giornaliero", d: "€4 per tutta la giornata — conviene se prevedi di muoverti molto." }],

      cta: { label: "Orari BusItalia", url: "https://www.fsbusitalia.it/content/fsbusitalia/it/veneto" },
      cta2: { label: "Scarica DropTicket", url: "https://www.dropticket.it" }
    }
  };
  const d = data[mode] || data.train;
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Come arrivare" />
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
        {d.sections.map((s, i) =>
        <div key={i} className="card" style={{ padding: 16 }}>
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
    </div>);

}
// ─────────────────────────────────────────────────────
export function NavBar({ back, title, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "56px 12px 12px", position: "sticky", top: 0, zIndex: 10,
      background: "linear-gradient(180deg, var(--bg) 75%, rgba(242,239,234,0) 100%)"
    }}>
      <button onClick={back} className="nav-btn" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}>
        <IconChevronL size={18} stroke={2.5} />
      </button>
      <div className="nav-title">{title}</div>
      <div style={{ width: 36 }}>{right}</div>
    </div>);

}

// ─────────────────────────────────────────────────────
// CHECKIN — one step at a time, big and clear
// ─────────────────────────────────────────────────────
export function Checkin({ back }) {
  const steps = CHECKIN_STEPS;
  const [i, setI] = React.useState(0);
  const s = steps[i];

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 30 }}>
      <NavBar back={back} title={`Passo ${i + 1} di ${steps.length}`} />

      <div style={{ padding: "0 20px" }}>
        {/* progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {steps.map((_, k) =>
          <div key={k} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: k <= i ? "var(--accent)" : "rgba(26,25,22,0.1)"
          }} />
          )}
        </div>

        <div className="img-placeholder" style={{ height: 220, borderRadius: 20, marginBottom: 20 }}>
          {s.img}
        </div>

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
            Fatto, avanti <IconChevronR size={16} stroke={2.5} />
          </button> :

        <button onClick={back} className="btn btn-accent btn-lg grow">
            <IconCheck size={18} stroke={2.5} /> Sono dentro!
          </button>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// WIFI — tap to copy, big and obvious
// ─────────────────────────────────────────────────────
export function Wifi({ back }) {
  const [copied, setCopied] = React.useState(null);
  const copy = (what, value) => {
    try { navigator.clipboard?.writeText(value); } catch (e) {}
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Wi-Fi" />
      <div style={{ padding: "8px 20px 0" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, fontWeight: 500 }}>
          Collegati in <em style={{ fontStyle: "italic", color: "var(--accent)" }}>un tocco</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          Wi-Fi gratuito, veloce, sempre attivo. Copre tutto l'appartamento.
        </div>
      </div>

      {/* Visual Wi-Fi card */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{
          position: "relative", overflow: "hidden",
          borderRadius: 26, padding: "26px 22px 22px",
          background: "linear-gradient(160deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff",
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 200, height: 200,
            borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
            opacity: 0.4, pointerEvents: "none",
          }}/>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "relative", marginBottom: 14, opacity: 0.95 }}>
            <path d="M2 8.82a15 15 0 0 1 20 0"/>
            <path d="M5 12.86a10 10 0 0 1 14 0"/>
            <path d="M8.5 16.9a5 5 0 0 1 7 0"/>
            <circle cx="12" cy="20" r="1" fill="#fff"/>
          </svg>

          <div className="t-11 w-600" style={{ opacity: 0.65, letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>Rete</div>
          <div style={{
            marginTop: 6, position: "relative",
            color: "#fff", fontFamily: "ui-monospace, monospace", fontSize: 20, fontWeight: 700,
          }}>
            {AP.wifi.ssid}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "18px 0", position: "relative" }}/>

          <div className="t-11 w-600" style={{ opacity: 0.65, letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>Password</div>
          <button onClick={() => copy("pwd", AP.wifi.password)} style={{
            background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left",
            width: "100%", marginTop: 6, position: "relative",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            color: "#fff",
          }}>
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
              {AP.wifi.password}
            </span>
            <span style={{
              padding: "5px 12px", borderRadius: 999,
              background: copied === "pwd" ? "var(--ok)" : "var(--accent)",
              fontSize: 11, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              {copied === "pwd" ? <><IconCheck size={12} stroke={3}/> Copiata</> : <><IconCopy size={12} stroke={2.5}/> Copia</>}
            </span>
          </button>
        </div>
      </div>

      {/* Troubleshooting */}
      <div style={{ padding: "26px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>
          Se non funziona
        </div>
        <div className="card-tight">
          {[
            { icon: "🔁", t: "Si è disconnesso?",    d: "Vai nelle impostazioni Wi-Fi del telefono, dimentica la rete, poi riconnettiti." },
            { icon: "🔌", t: "Niente segnale?",      d: "Il router è dietro la TV. Stacca la spina per 10 secondi e riattacca. Aspetta 2 minuti." },
            { icon: "📍", t: "Lento in una stanza?", d: "Avvicinati al router o usa la rete '5GHz' che è più veloce nel raggio breve." },
          ].map((r, i) => (
            <div key={i} className="row">
              <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: "center" }}>{r.icon}</div>
              <div className="grow">
                <div className="t-14 w-600">{r.t}</div>
                <div className="t-12 muted" style={{ marginTop: 2, lineHeight: 1.45 }}>{r.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-12 muted" style={{ lineHeight: 1.5 }}>
          La rete è privata e protetta. Solo gli ospiti del Loft possono accedervi.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// HOUSE GUIDE — rules visible + collapsible sections for checkout and appliances
// ─────────────────────────────────────────────────────
export function House({ back, go }) {
  const [open, setOpen] = React.useState({}); // all closed by default
  const [openFaq, setOpenFaq] = React.useState(null);
  const [doneCO, setDoneCO] = React.useState({});
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const toggleCO = (i) => setDoneCO((d) => ({ ...d, [i]: !d[i] }));

  // Auto-redirect to goodbye when all checkout bullets completed
  const coTotal = CHECKOUT_STEPS.length;
  const coDone = Object.values(doneCO).filter(Boolean).length;
  React.useEffect(() => {
    if (coDone === coTotal && coTotal > 0) {
      const t = setTimeout(() => go("goodbye"), 700);
      return () => clearTimeout(t);
    }
  }, [coDone, coTotal]);

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Casa" />
      <div style={{ padding: "0 20px 8px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          La casa, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>istruzioni per l'uso</em>.
        </div>
      </div>

      {/* Rules — collapsible too */}
      <CollapsibleSection title="Regole della casa" sub={`${HOUSE_RULES.length} regole · da leggere all'arrivo`}
      icon="📜" open={!!open.rules} onToggle={() => toggle("rules")}>
        <div className="card-tight" style={{ background: "transparent", boxShadow: "none" }}>
          {HOUSE_RULES.map((r, i) =>
          <div key={i} className="row">
              <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: "center" }}>{r.icon}</div>
              <div className="grow">
                <div className="t-15 w-600">{r.t}</div>
                <div className="t-12 muted" style={{ marginTop: 2, lineHeight: 1.4 }}>{r.d}</div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Checkout — collapsible */}
      <CollapsibleSection title="Regole di check-out" sub={`${CHECKOUT_STEPS.length} passaggi · prima di andare`}
      icon="🧳" open={!!open.checkout} onToggle={() => toggle("checkout")}>
        <div style={{ padding: "0 6px 12px" }}>
          <div className="t-13 muted" style={{ lineHeight: 1.5, padding: "0 10px 10px" }}>
            Entro le <strong style={{ color: "var(--ink)" }}>{AP.checkout.until}</strong>. Spunta man mano che li fai — niente di che, ci mettiamo 5 minuti.
          </div>
          {CHECKOUT_STEPS.map((s, i) =>
          <button key={i} onClick={() => toggleCO(i)} style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            padding: "10px 12px", background: "none", border: "none", cursor: "pointer",
            textAlign: "left"
          }}>
              <div style={{
              width: 26, height: 26, borderRadius: 999, flexShrink: 0,
              border: doneCO[i] ? "none" : "2px solid var(--ink-4)",
              background: doneCO[i] ? "var(--accent)" : "transparent",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{doneCO[i] && <IconCheck size={14} stroke={3} />}</div>
              <div className="grow">
                <div className="t-15 w-600" style={{ textDecoration: doneCO[i] ? "line-through" : "none", opacity: doneCO[i] ? 0.5 : 1 }}>
                  {s.t}
                </div>
                <div className="t-12 muted" style={{ marginTop: 1, lineHeight: 1.4 }}>{s.d}</div>
              </div>
            </button>
          )}
          <div style={{ padding: "14px 4px 0" }}>
            <div style={{
              borderRadius: 16, padding: "16px 16px",
              background: coDone === coTotal
                ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)"
                : "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
              color: "#fff", position: "relative", overflow: "hidden",
              transition: "background .4s",
            }}>
              <div style={{
                position: "absolute", right: -20, top: -20, width: 120, height: 120,
                borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                opacity: coDone === coTotal ? 0 : 0.5, transition: "opacity .4s",
              }}/>
              <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                <div style={{
                  fontSize: 24, lineHeight: 1, flexShrink: 0,
                }}>{coDone === coTotal ? "🎁" : "🔒"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-11 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {coDone === coTotal ? "Tutto fatto" : "Sorpresa in arrivo"}
                  </div>
                  <div className="t-14 w-600" style={{ marginTop: 3, lineHeight: 1.3 }}>
                    {coDone === coTotal
                      ? "Ti porto al tuo regalo…"
                      : coDone === 0
                        ? "Completa i passaggi per scoprirla"
                        : `Manca poco — ${coTotal - coDone} su ${coTotal}`}
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: 12, height: 4, borderRadius: 2,
                background: "rgba(255,255,255,0.15)", overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  height: "100%", width: `${(coDone / coTotal) * 100}%`,
                  background: "#fff", transition: "width .3s ease",
                }}/>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Appliances — collapsible */}
      <CollapsibleSection title="Aiuto elettrodomestici" sub="Wi-Fi, lavatrice, termostato e altro"
      icon="🔧" open={!!open.appliances} onToggle={() => toggle("appliances")}>
        <div className="card-tight" style={{ background: "transparent", boxShadow: "none" }}>
          {APPLIANCES.map((a, i) =>
          <button key={a.id} onClick={() => go("appliance", a)} className="row" style={{
            border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left"
          }}>
              <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: "center" }}>{a.icon}</div>
              <div className="grow">
                <div className="t-15 w-600">{a.t}</div>
                <div className="t-12 muted" style={{ marginTop: 2 }}>{a.sub}</div>
              </div>
              <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)" }} />
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* FAQ */}
      <div style={{ padding: "24px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>Domande frequenti</div>
        <div className="card-tight">
          {FAQ.map((f, i) =>
          <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "16px", background: "none", border: "none", cursor: "pointer",
              textAlign: "left", borderTop: i > 0 ? "0.5px solid var(--hairline)" : "none"
            }}>
                <div className="grow t-15 w-600" style={{ lineHeight: 1.3 }}>{f.q}</div>
                <IconChevronD size={16} stroke={2.2} style={{
                color: "var(--ink-3)",
                transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                transition: "transform .2s"
              }} />
              </button>
              {openFaq === i &&
            <div style={{ padding: "0 16px 16px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>
                  {f.a}
                </div>
            }
            </div>
          )}
        </div>
      </div>

      {/* Emergency */}
      <div style={{ padding: "24px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>Se succede qualcosa</div>
        <div className="card-tight">
          {EMERGENCY.map((e, i) =>
          <a key={i} href={`tel:${e.value}`} className="row" style={{ textDecoration: "none" }}>
              <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "var(--accent-soft)", color: "var(--accent-deep)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <IconPhone size={18} stroke={2} />
              </div>
              <div className="grow">
                <div className="t-15 w-600">{e.label}</div>
                <div className="t-12 muted" style={{ marginTop: 2 }}>{e.value}</div>
              </div>
              <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)" }} />
            </a>
          )}
        </div>
      </div>

      {/* PM disclaimer */}
      <div style={{ padding: "24px 20px 0" }}>
        <button onClick={() => go("about")} style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          padding: "12px 4px", cursor: "pointer"
        }}>
          <div className="t-11 muted" style={{ lineHeight: 1.5 }}>
            Casa gestita da <strong style={{ color: "var(--accent)" }}>{AP.pmName}</strong> · Scopri chi siamo
          </div>
        </button>
      </div>
    </div>);

}

function CollapsibleSection({ title, sub, icon, open, onToggle, children }) {
  return (
    <div style={{ padding: "20px 16px 0" }}>
      <button onClick={onToggle} className="card" style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        border: "none", cursor: "pointer", textAlign: "left", padding: 16
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "var(--accent-soft)", color: "var(--accent-deep)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
        }}>{icon}</div>
        <div className="grow">
          <div className="t-15 w-600">{title}</div>
          <div className="t-12 muted" style={{ marginTop: 2 }}>{sub}</div>
        </div>
        <IconChevronD size={18} stroke={2.2} style={{
          color: "var(--ink-3)",
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform .25s"
        }} />
      </button>
      <div style={{
        maxHeight: open ? 2000 : 0, overflow: "hidden",
        transition: "max-height .35s ease"
      }}>
        <div style={{ paddingTop: 10 }}>{children}</div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// APPLIANCE detail — video + description + steps
// ─────────────────────────────────────────────────────
export function Appliance({ back, item }) {
  const a = item || APPLIANCES[0];
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Aiuto" />

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--accent-soft)", color: "var(--accent-deep)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
          }}>{a.icon}</div>
          <div className="grow">
            <div className="t-12 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{a.sub}</div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.15, marginTop: 2 }}>{a.t}</div>
          </div>
        </div>
      </div>

      {/* Video placeholder */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{
          position: "relative", height: 200, borderRadius: 22, overflow: "hidden",
          background: "linear-gradient(135deg, #1A1916 0%, #3A3633 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 4px, transparent 4px 12px)"
          }} />
          <div style={{
            width: 72, height: 72, borderRadius: 999, background: "rgba(255,255,255,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--ink)">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          </div>
          <div style={{
            position: "absolute", bottom: 12, left: 16, color: "#fff",
            fontSize: 12, fontWeight: 600, opacity: 0.9
          }}>Video tutorial · 0:45</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>In breve</div>
        <div className="t-15" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--ink-2)" }}>
          {a.desc}
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "20px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 4px 10px" }}>Passo per passo</div>
        <div className="card">
          {a.steps.map((s, i) =>
          <div key={i} style={{ display: "flex", gap: 14, padding: "8px 0", alignItems: "flex-start" }}>
              <div style={{
              width: 26, height: 26, borderRadius: 999, flexShrink: 0,
              background: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, marginTop: 1
            }}>{i + 1}</div>
              <div className="t-15" style={{ lineHeight: 1.5, color: "var(--ink-2)" }}>{s}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 muted" style={{ lineHeight: 1.5 }}>
          Non funziona? <button onClick={() => null} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", padding: 0 }}>Scrivi al Concierge</button>
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// PLACES (full list)
// ─────────────────────────────────────────────────────
export function Places({ back, go }) {
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Padova" />
      <div style={{ padding: "0 20px 16px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          Da non <em style={{ fontStyle: "italic", color: "var(--accent)" }}>perdere</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          Solo le cose che consigliamo davvero — i nostri preferiti.
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {PLACES.map((p) =>
        <div key={p.id} onClick={() => go("place", p)} className="card-tight" style={{ cursor: "pointer" }}>
            <div className="img-placeholder" style={{ height: 150 }}>📸 {p.name}</div>
            <div style={{ padding: 16 }}>
              <div className="t-11 w-600" style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4 }}>{p.tag}</div>
              <div className="t-17 w-600" style={{ marginTop: 4 }}>{p.name}</div>
              <div className="t-13 muted" style={{ marginTop: 4 }}>{p.sub}</div>
              <div className="t-12 muted" style={{ marginTop: 8 }}>{p.dist}</div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────────────
export function Checkout({ back, go }) {
  const steps = CHECKOUT_STEPS;
  const [done, setDone] = React.useState(() => steps.map(() => false));
  const toggle = (i) => setDone((d) => d.map((v, k) => k === i ? !v : v));
  const allDone = done.every(Boolean);
  const completedCount = done.filter(Boolean).length;

  // Auto-redirect when complete
  React.useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => go("goodbye"), 800);
      return () => clearTimeout(t);
    }
  }, [allDone]);

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 30 }}>
      <NavBar back={back} title="Check-out" />
      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Prima di andare</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          Entro le <strong style={{ color: "var(--ink)" }}>{AP.checkout.until}</strong>. Spunta man mano — niente di che, sono 5 minuti. Non devi pulire né rifare il letto.
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(26,25,22,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(completedCount / steps.length) * 100}%`,
            background: "var(--accent)", transition: "width .3s ease",
          }}/>
        </div>
        <div className="t-12 w-600" style={{ color: "var(--accent-deep)" }}>{completedCount}/{steps.length}</div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) =>
        <button key={i} onClick={() => toggle(i)} className="card" style={{
          display: "flex", alignItems: "center", gap: 14, textAlign: "left",
          border: "none", cursor: "pointer", padding: 16,
        }}>
            <div style={{
            width: 28, height: 28, borderRadius: 999, flexShrink: 0,
            border: done[i] ? "none" : "2px solid var(--ink-4)",
            background: done[i] ? "var(--accent)" : "transparent",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}>
              {done[i] && <IconCheck size={14} stroke={3} />}
            </div>
            <div className="grow">
              <div className="t-15 w-600" style={{ textDecoration: done[i] ? "line-through" : "none", opacity: done[i] ? 0.5 : 1 }}>
                {s.t}
              </div>
              <div className="t-12 muted" style={{ marginTop: 2, lineHeight: 1.45 }}>{s.d}</div>
            </div>
          </button>
        )}
      </div>

      {/* CTA: appears when all done */}
      <div style={{ padding: "28px 16px 0" }}>
        <button onClick={() => go("goodbye")} disabled={!allDone} className="btn btn-accent btn-lg btn-full"
          style={{ opacity: allDone ? 1 : 0.4, transition: "opacity .3s" }}>
          {allDone ? <><IconHeart size={18} stroke={2.2}/> Lascia un saluto</> : `Completa per continuare (${completedCount}/${steps.length})`}
        </button>
      </div>
    </div>);
}

// ─────────────────────────────────────────────────────
// GOODBYE / REVIEW — thank-you + delicate nudge for max-star + coupon
// ─────────────────────────────────────────────────────
export function Review({ back, guest, go }) {
  const name = guest?.firstName || AP.guest.firstName;
  const [stage, setStage] = React.useState("rate"); // rate → coupon (skip hello)
  const [stars, setStars] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");

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
      </div>);

  }

  if (stage === "rate") {
    const isHigh = stars >= 4;
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
          placeholder={stars >= 4 ?
          "Cosa ti è piaciuto di più? (facoltativo)" :
          "Cosa avremmo potuto fare meglio? Davvero, ci serve"}
          style={{
            width: "100%", minHeight: 110, padding: 16, borderRadius: 18,
            background: "var(--surface)", border: "none", fontFamily: "inherit",
            fontSize: 15, color: "var(--ink)", resize: "none", boxSizing: "border-box",
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
      </div>);

  }

  const isHigh = stars >= 4;
  const code = isHigh ? "GRAZIE" + (10 + stars * 2) : "GRAZIE5";
  const discount = isHigh ? `-${10 + stars * 2}%` : "-5%";
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
          {isHigh ?
          "Lo apprezziamo davvero. Ecco il tuo codice sconto per la prossima volta che vieni a Padova." :
          "Ne facciamo tesoro. Tieni questo codice: vale per la tua prossima prenotazione."}
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
            <button onClick={() => navigator.clipboard?.writeText(code)} style={{
              background: "var(--accent)", color: "#fff", border: "none", borderRadius: 999,
              padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>Copia</button>
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
    </div>);

}

// ─────────────────────────────────────────────────────
// DAILY TIP — AI-powered "cosa fare oggi a Padova"
// ─────────────────────────────────────────────────────
export function DailyTip({ back, go }) {
  const [tip, setTip] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(false);

  const STATIC_TIPS = [
    { title: "Caffè al Pedrocchi", subtitle: "Il caffè 'senza porte' dal 1831 · 7 min a piedi", body: "Ordina un caffè alla menta — è la loro specialità storica. Non è sul menu standard, chiedi al banco. L'atmosfera è quella di sempre, immutabile.", tag: "Iconico", emoji: "☕" },
    { title: "Prato della Valle", subtitle: "La piazza più grande d'Europa · 8 min a piedi", body: "82 statue, un'isola verde al centro, e tantissimi padovani in giro. Perfetto in qualsiasi ora. Portati qualcosa da mangiare e siediti sull'erba.", tag: "Piazza", emoji: "🌿" },
    { title: "Cappella degli Scrovegni", subtitle: "Prenota online · 12 min a piedi", body: "Giotto. 20 minuti là dentro cambiano il modo in cui guardi un muro. Prenotazione obbligatoria — falla ora sul sito del museo.", tag: "Arte", emoji: "🎨" },
    { title: "Mercato di Piazza delle Erbe", subtitle: "Aperto la mattina · 9 min a piedi", body: "Il mercato più vivo della città. Frutta, verdura, formaggi, e i padovani che litigano sui prezzi. Meglio di qualsiasi museo.", tag: "Mercato", emoji: "🛒" },
    { title: "Spritz al tramonto", subtitle: "Piazza delle Erbe, dalle 18 · 9 min a piedi", body: "Trova un tavolino all'aperto nella piazza, ordina uno spritz Aperol, e guarda la città rallentare. Questo è il momento.", tag: "Aperitivo", emoji: "🥂" },
    { title: "Orto Botanico", subtitle: "Patrimonio UNESCO · 10 min a piedi", body: "Il più antico orto botanico universitario del mondo, dal 1545. Piccolo, tranquillo, bellissimo. Ci vuole un'ora e ci si dimentica di tutto.", tag: "Verde", emoji: "🌱" },
  ];

  const fetchTip = async () => {
    setLoading(true); setErr(false);
    try {
      if (!window.claude?.complete) {
        const now = new Date();
        const idx = (now.getHours() + now.getDay()) % STATIC_TIPS.length;
        await new Promise(r => setTimeout(r, 600));
        setTip(STATIC_TIPS[idx]);
        return;
      }
      const now = new Date();
      const hh = now.getHours();
      const timeContext = hh < 11 ? "mattina presto" : hh < 14 ? "mezzogiorno" : hh < 18 ? "pomeriggio" : hh < 21 ? "ora di aperitivo" : "sera";
      const dayName = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][now.getDay()];
      const month = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"][now.getMonth()];

      const reply = await window.claude.complete({
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
        }]
      });

      const match = reply.match(/\{[\s\S]*\}/);
      if (match) {
        const data = JSON.parse(match[0]);
        setTip(data);
      } else {
        setTip({ title: "Un giro per il centro", subtitle: "Adesso è un buon momento", body: reply, tag: "Padova", emoji: "✨" });
      }
    } catch (e) {
      const now = new Date();
      const idx = (now.getHours() + now.getDay()) % STATIC_TIPS.length;
      setTip(STATIC_TIPS[idx]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchTip(); }, []);

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Cosa fare oggi" />

      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          Il consiglio <em style={{ fontStyle: "italic", color: "var(--accent)" }}>di oggi</em>.
        </div>
        <div className="t-13 muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
          Pensato per quest'ora, qui e ora — tocca per averne un altro.
        </div>
      </div>

      {loading && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999, border: "3px solid var(--ink-4)",
            borderTopColor: "var(--accent)", animation: "sp 0.9s linear infinite", margin: "0 auto",
          }}/>
          <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
          <div className="t-14 muted" style={{ marginTop: 16 }}>Sto pensando…</div>
        </div>
      )}

      {!loading && tip && (
        <>
          {/* Big tip card */}
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

          {/* Another tip */}
          <div style={{ padding: "16px 16px 0" }}>
            <button onClick={fetchTip} className="btn btn-ghost btn-lg btn-full">
              <IconSparkle size={18} stroke={2}/> Dammene un altro
            </button>
          </div>

          {/* Or build a full itinerary */}
          <div style={{ padding: "26px 20px 0" }}>
            <div className="t-13 muted" style={{ lineHeight: 1.5, marginBottom: 14 }}>
              Vuoi un programma completo della giornata?
            </div>
            <button onClick={() => go("itinerary")} className="btn btn-primary btn-lg btn-full">
              Crea un itinerario su misura →
            </button>
          </div>
        </>
      )}

      {err && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div className="t-14 muted" style={{ lineHeight: 1.5 }}>
            Non riesco a connettermi al momento.<br/>Riprova o crea un itinerario.
          </div>
          <button onClick={fetchTip} className="btn btn-ghost btn-lg" style={{ marginTop: 20 }}>
            Riprova
          </button>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────
export function Host({ back, guest }) {
  const name = guest?.firstName || AP.guest.firstName;
  const [msgs, setMsgs] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("elegant-loft-chat") || "null");
      if (saved && saved.length) return saved;
    } catch {}
    return [
    { from: "ai", text: `Ciao ${name}! Sono il Concierge del Loft ✨ Posso suggerirti dove mangiare, come arrivare ovunque, o aiutarti con la casa. Cosa ti serve?` }];

  });
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    try {localStorage.setItem("elegant-loft-chat", JSON.stringify(msgs));} catch {}
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const systemContext = () => {
    const rules = HOUSE_RULES.map((r) => `• ${r.t}: ${r.d}`).join("\n");
    const appliances = APPLIANCES.map((a) => `• ${a.t}: ${a.desc}`).join("\n");
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

Luoghi consigliati: Cappella degli Scrovegni, Prato della Valle, Orto Botanico, Caffè Pedrocchi, Basilica di Sant'Antonio, Palazzo della Ragione.`;
  };

  const send = async (textOverride) => {
    const text = (textOverride ?? draft).trim();
    if (!text || typing) return;
    const newMsgs = [...msgs, { from: "me", text }];
    setMsgs(newMsgs);
    setDraft("");
    setTyping(true);

    try {
      if (!window.claude?.complete) {
        await new Promise(r => setTimeout(r, 800));
        setMsgs((m) => [...m, { from: "ai", text: `Scusa, il Concierge AI non è disponibile in questo momento. Per qualsiasi necessità scrivi direttamente a Mattia al +39 351 988 6489 — risponde sempre. 🙏` }]);
        return;
      }
      const conversation = newMsgs.slice(-10).map((m) => ({
        role: m.from === "me" ? "user" : "assistant",
        content: m.text
      }));
      const reply = await window.claude.complete({
        messages: [
        { role: "user", content: systemContext() + "\n\n---\n\nRispondi al prossimo messaggio dell'utente con tono breve e diretto." },
        ...conversation]
      });
      setMsgs((m) => [...m, { from: "ai", text: (reply || "Scusa, riprova tra un attimo 🙏").trim() }]);
    } catch (e) {
      setMsgs((m) => [...m, { from: "ai", text: "Ops, problema di connessione. Riprova, o scrivi a Mattia al +39 351 988 6489." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="page-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
      {/* Compact header bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "56px 16px 12px",
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
          <div className="t-15 w-600" style={{ lineHeight: 1.2 }}>Concierge AI</div>
          <div className="t-11 muted" style={{ marginTop: 2, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--ok)" }} />
            Online · conosce la casa
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
          {["Dove mangio stasera?", "Come arrivo a Venezia?", "La lavatrice come va?", "Piove, che faccio?"].map((s) =>
        <button key={s} onClick={() => send(s)} className="chip chip-ghost"
        style={{ whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, fontWeight: 600 }}>
              {s}
            </button>
        )}
        </div>
      }

      <div style={{ padding: "10px 12px 90px", display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Chiedi qualunque cosa…"
        style={{
          flex: 1, padding: "14px 16px", borderRadius: 22, border: "none",
          background: "var(--surface)", fontSize: 15, fontFamily: "inherit",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)", outline: "none"
        }} />
        <button onClick={() => send()} disabled={typing} className="nav-btn" style={{
          width: 46, height: 46, background: "var(--accent)", color: "#fff",
          opacity: typing ? 0.5 : 1
        }}>
          <IconChevronR size={20} stroke={2.5} />
        </button>
      </div>
    </div>);

}

// COUPONS data — multi-language, rich
const COUPONS_RICH = [
{
  id: "graziati",
  shop: "Pasticceria Graziati",
  deal: { it: "-10% su tutto", en: "-10% on everything", de: "-10% auf alles", fr: "-10% sur tout" },
  meta: { it: "Mostra l'app in cassa", en: "Show the app at the till", de: "App an der Kasse zeigen", fr: "Présente l'app en caisse" },
  address: "Piazza della Frutta, 39 — Padova",
  desc: {
    it: "Storica pasticceria padovana dal 1919. Cinque generazioni di dolciumi, caffè e cioccolato fatto a mano. La sfogliatina è leggendaria.",
    en: "Historic Padovan pâtisserie since 1919. Five generations of pastries, coffee and hand-made chocolate. The 'sfogliatina' is legendary.",
    de: "Historische Konditorei in Padua seit 1919. Fünf Generationen handgemachtes Gebäck. Die 'sfogliatina' ist legendär.",
    fr: "Pâtisserie historique de Padoue depuis 1919. Cinq générations de pâtisseries faites main. La 'sfogliatina' est légendaire."
  },
  code: "ELEGANT10",
  tint: "#C99E6E"
},
{
  id: "fabbri",
  shop: "Osteria dei Fabbri",
  deal: { it: "Calice di vino omaggio", en: "Free glass of wine", de: "Glas Wein gratis", fr: "Verre de vin offert" },
  meta: { it: "Con menu degustazione", en: "With tasting menu", de: "Mit Degustationsmenü", fr: "Avec menu dégustation" },
  address: "Via dei Fabbri, 13 — Padova",
  desc: {
    it: "Trattoria veneta autentica. Bigoli all'anatra, baccalà, vini della zona. Atmosfera familiare.",
    en: "Authentic Venetian trattoria. Duck bigoli, cod, local wines. Family atmosphere.",
    de: "Authentische venezianische Trattoria. Familiäre Atmosphäre.",
    fr: "Trattoria vénitienne authentique. Atmosphère familiale."
  },
  code: "FABBRI-LOFT",
  tint: "#7A5A3F"
},
{
  id: "bike",
  shop: "Bike Rental Padova",
  deal: { it: "-20% sul noleggio", en: "-20% on rental", de: "-20% beim Mieten", fr: "-20% sur la location" },
  meta: { it: "Solo giorni feriali", en: "Weekdays only", de: "Nur Werktage", fr: "Uniquement en semaine" },
  address: "Via Niccolò Tommaseo — Padova",
  desc: {
    it: "Bici di città, e-bike, mountain bike. Padova è piattissima e ha 150 km di piste ciclabili.",
    en: "City bikes, e-bikes, mountain bikes. Padua is flat with 150 km of bike paths.",
    de: "Citybikes, E-Bikes, Mountainbikes. Padua ist flach mit 150 km Radwegen.",
    fr: "Vélos de ville, électriques, VTT. Padoue est plate avec 150 km de pistes cyclables."
  },
  code: "LOFT-BIKE-20",
  tint: "#4A7C5A"
}];


// ─────────────────────────────────────────────────────
// COUPONS / Vantaggi — list with clickable cards
// ─────────────────────────────────────────────────────
export function Coupons({ back, go, guest }) {
  const lang = guest?.lang || "it";
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Vantaggi" />
      <div style={{ padding: "0 20px 8px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          Sconti e <em style={{ fontStyle: "italic", color: "var(--accent)" }}>vantaggi</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          Tocca un partner per vedere il coupon dedicato.
        </div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {COUPONS_RICH.map((c) =>
        <button key={c.id} onClick={() => go("coupon", c)} className="card" style={{
          display: "flex", alignItems: "center", gap: 14, padding: 14, border: "none",
          background: "var(--surface)", cursor: "pointer", textAlign: "left", width: "100%"
        }}>
            <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: c.tint, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
              <IconStar size={28} stroke={2} style={{ fill: "#fff" }} />
            </div>
            <div className="grow">
              <div className="t-15 w-600">{c.shop}</div>
              <div className="t-13 w-600" style={{ color: "var(--accent-deep)", marginTop: 2 }}>
                {c.deal[lang] || c.deal.it}
              </div>
              <div className="t-11 muted" style={{ marginTop: 4 }}>
                {c.meta[lang] || c.meta.it}
              </div>
            </div>
            <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
          </button>
        )}
      </div>

    </div>);

}

// ─────────────────────────────────────────────────────
// COUPON DETAIL — large code, copy, multilingua
// ─────────────────────────────────────────────────────
export function CouponDetail({ back, item, guest }) {
  const c = item || COUPONS_RICH[0];
  const lang = guest?.lang || "it";
  const [downloaded, setDownloaded] = React.useState(false);

  const download = () => {
    const canvas = document.createElement("canvas");
    const W = 900, H = 1400;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Background — dark gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1A1916");
    bg.addColorStop(1, "#2F2A24");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Tint blob top-right
    const blob = ctx.createRadialGradient(W - 80, 100, 0, W - 80, 100, 360);
    blob.addColorStop(0, c.tint);
    blob.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = blob;
    ctx.globalAlpha = 0.55;
    ctx.fillRect(0, 0, W, 600);
    ctx.globalAlpha = 1;

    // Brand mark
    ctx.fillStyle = "#f3dfd9";
    ctx.font = "600 28px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("ELEGANT LOFT · " + (AP.pmName || "MOORENT").toUpperCase(), 60, 100);

    // "COUPON" label
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("COUPON · " + (c.meta[lang] || c.meta.it).toUpperCase(), 60, 160);

    // Shop name (serif-ish)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 64px Georgia, 'Times New Roman', serif";
    wrapText(ctx, c.shop, 60, 250, W - 120, 70);

    // Deal (big accent)
    ctx.fillStyle = c.tint;
    ctx.font = "700 120px Georgia, 'Times New Roman', serif";
    ctx.fillText(c.deal[lang] || c.deal.it, 60, 480);

    // Description
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "400 28px 'Segoe UI', system-ui, sans-serif";
    wrapText(ctx, c.desc[lang] || c.desc.it, 60, 580, W - 120, 42);

    // Code card
    const codeY = 880;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, 60, codeY, W - 120, 220, 28);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText({ it: "CODICE COUPON", en: "COUPON CODE", de: "COUPON-CODE", fr: "CODE COUPON" }[lang] || "CODICE COUPON", 90, codeY + 60);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 84px 'Courier New', monospace";
    ctx.fillText(c.code, 90, codeY + 160);

    // Address
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 24px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("📍 " + c.address, 60, 1180);

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "500 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText({
      it: "Mostra questo coupon in cassa · elegantloft.it",
      en: "Show this coupon at the till · elegantloft.it",
      de: "Zeige diesen Coupon an der Kasse · elegantloft.it",
      fr: "Présente ce coupon en caisse · elegantloft.it"
    }[lang] || "", 60, 1340);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `coupon-${c.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };
  const L = {
    it: { useAt: "Usa qui", howUse: "Come usarlo", howUseDesc: "Mostra il coupon scaricato in cassa con il codice ben visibile. Il commerciante lo verifica con un tocco.", download: "Scarica coupon", downloaded: "Scaricato!" },
    en: { useAt: "Use at", howUse: "How to use", howUseDesc: "Show the downloaded coupon at the till with the code clearly visible.", download: "Download coupon", downloaded: "Downloaded!" },
    de: { useAt: "Gültig in", howUse: "Verwendung", howUseDesc: "Zeige den heruntergeladenen Coupon an der Kasse mit gut sichtbarem Code.", download: "Coupon herunterladen", downloaded: "Heruntergeladen!" },
    fr: { useAt: "À utiliser à", howUse: "Comment l'utiliser", howUseDesc: "Présente le coupon téléchargé en caisse avec le code bien visible.", download: "Télécharger", downloaded: "Téléchargé !" }
  }[lang] || {};

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      {/* Hero */}
      <div style={{ position: "relative" }}>
        <div style={{
          height: 200,
          background: `linear-gradient(160deg, ${c.tint} 0%, ${c.tint}DD 70%, #1A1916 130%)`,
          display: "flex", alignItems: "flex-end", padding: "20px 20px 24px"
        }}>
          <button onClick={back} className="nav-btn" style={{
            position: "absolute", top: 56, left: 12,
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)"
          }}>
            <IconChevronL size={18} stroke={2.5} />
          </button>
          <div style={{ color: "#fff" }}>
            <div className="t-11 w-600" style={{ opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.5 }}>{L.useAt}</div>
            <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 500, marginTop: 6 }}>{c.shop}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600" style={{ color: "var(--accent-deep)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {c.meta[lang] || c.meta.it}
        </div>
        <div className="serif" style={{ fontSize: 40, lineHeight: 1, fontWeight: 500, marginTop: 8 }}>
          {c.deal[lang] || c.deal.it}
        </div>
        <div className="t-15" style={{ marginTop: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
          {c.desc[lang] || c.desc.it}
        </div>
        <div className="t-12 muted" style={{ marginTop: 12 }}>📍 {c.address}</div>
      </div>

      {/* Code card */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{
          borderRadius: 20, padding: "20px 18px",
          background: "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 180, height: 180,
            borderRadius: 999, background: `radial-gradient(circle, ${c.tint} 0%, transparent 70%)`,
            opacity: 0.5
          }} />
          <div className="t-11 w-600" style={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5, position: "relative" }}>
            Codice coupon
          </div>
          <div style={{
            fontFamily: "ui-monospace, monospace", fontSize: 28, fontWeight: 700,
            letterSpacing: 3, marginTop: 8, position: "relative"
          }}>
            {c.code}
          </div>
          <button onClick={download} style={{
            marginTop: 14, padding: "12px 18px", borderRadius: 12,
            background: downloaded ? "var(--ok)" : "var(--accent)", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8, position: "relative"
          }}>
            {downloaded ? <><IconCheck size={14} stroke={3} /> {L.downloaded}</> : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14M5 12l7 7 7-7M5 21h14"/></svg> {L.download}</>}
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{L.howUse}</div>
        <div className="t-14" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--ink-2)" }}>{L.howUseDesc}</div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// ABOUT — MoorRent landing page. Dramatic visual break.
// Brand: #232323 black, #f3dfd9 salmon, #aca5a5 warm gray, Segoe UI font
// ─────────────────────────────────────────────────────
export function About({ back }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

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
        {/* Hero — black with salmon accent */}
        <div style={{
          position: "relative",
          background: "#232323", color: "#FFFFFF",
          padding: "0 0 60px",
          borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
          overflow: "hidden"
        }}>
          {/* Decorative salmon blob */}
          <div style={{
            position: "absolute", right: -60, top: 100, width: 240, height: 240,
            borderRadius: 999, background: "#f3dfd9", opacity: 0.15,
            animation: visible ? "moo-pulse 4s ease-in-out infinite" : "none"
          }} />
          <div style={{
            position: "absolute", left: -80, top: 280, width: 200, height: 200,
            borderRadius: 999, background: "#f3dfd9", opacity: 0.08
          }} />

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", padding: "56px 16px 0", position: "relative" }}>
            <button onClick={back} style={{
              width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)", color: "#FFFFFF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)"
            }}>
              <IconChevronL size={18} stroke={2.5} />
            </button>
          </div>

          {/* Brand mark */}
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

          {/* Main headline */}
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

          {/* Subhead */}
          <div className="moo-anim" style={{ padding: "20px 24px 0", position: "relative", animationDelay: "0.3s" }}>
            <p style={{
              fontSize: 15, lineHeight: 1.6, margin: 0,
              color: "rgba(255,255,255,0.75)", maxWidth: 320
            }}>
              Padova e provincia. Gestione completa per chi ha una casa e vuole metterla a reddito senza pensieri.
            </p>
          </div>

          {/* Stats strip */}
          <div className="moo-anim" style={{ padding: "36px 16px 0", position: "relative", animationDelay: "0.45s" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
              background: "rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden"
            }}>
              {[
              { n: "40+", l: "Appartamenti" },
              { n: "4.9", l: "Su 5 stelle" },
              { n: "98%", l: "Occupazione" }].
              map((s) =>
              <div key={s.l} style={{
                padding: "16px 8px", textAlign: "center", background: "#232323"
              }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#f3dfd9", letterSpacing: -0.5 }}>{s.n}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#aca5a5", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{s.l}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What we do */}
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
          { n: "04", t: "Concierge & assistenza", d: "I tuoi ospiti hanno questa app + chat AI + un host umano reperibile. Soddisfazione garantita." }].
          map((s, i) =>
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

        {/* Quote */}
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

        {/* CTA */}
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
          <a href="mailto:info@moorent.it" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#f3dfd9", color: "#232323", padding: "16px 22px",
            borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none"
          }}>Scrivici a hello@moorentpm.it

          </a>
        </div>

        {/* Footer micro */}
        <div style={{ padding: "36px 24px 24px", borderTop: "1px solid #f8f8f8", marginTop: 36 }}>
          <div style={{ fontSize: 11, color: "#aca5a5", lineHeight: 1.6 }}>
            {AP.pmName} · Padova, Italia<br />
            Per privacy e dati: privacy@moorent.it
          </div>
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// ARRIVAL (come arrivare)
// ─────────────────────────────────────────────────────
function Arrival({ back }) {
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Come arrivare" />
      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          Ci trovi <em style={{ fontStyle: "italic", color: "var(--accent)" }}>qui</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10 }}>{AP.address}</div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <div className="img-placeholder" style={{ height: 180, borderRadius: 20 }}>
          🗺️ Mappa — Via Trieste 25, Padova
        </div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
        { icon: "🚆", t: "In treno", sub: "5 min a piedi dalla stazione", cta: "Percorso pedonale" },
        { icon: "🚗", t: "In auto", sub: "Parcheggio libero in via laterale", cta: "Parcheggi vicini" },
        { icon: "🚌", t: "Bus & tram", sub: "Fermata Trieste a 100 metri", cta: "Orari" }].
        map((r) =>
        <div key={r.t} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 30 }}>{r.icon}</div>
            <div className="grow">
              <div className="t-17 w-600">{r.t}</div>
              <div className="t-13 muted" style={{ marginTop: 2 }}>{r.sub}</div>
            </div>
            <button className="chip">{r.cta}</button>
          </div>
        )}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// Place detail (sheet-like)
// ─────────────────────────────────────────────────────
export function PlaceDetail({ back, place }) {
  const p = place || PLACES[0];
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <div style={{ position: "relative" }}>
        <div className="img-placeholder" style={{ height: 300, borderRadius: 0 }}>
          📸 {p.name}
        </div>
        <button onClick={back} className="nav-btn" style={{
          position: "absolute", top: 56, left: 12, background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)"
        }}>
          <IconChevronL size={18} stroke={2.5} />
        </button>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <div className="chip">{p.tag}</div>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500, marginTop: 10 }}>
          {p.name}
        </div>
        <div className="t-14 muted-2" style={{ marginTop: 12, lineHeight: 1.6 }}>
          {p.sub}. {p.dist} dal Loft.
        </div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", gap: 10 }}>
        <a
          href={p.maps_url || `https://maps.google.com/?q=${encodeURIComponent(p.name + ', Padova')}`}
          target="_blank" rel="noreferrer"
          className="btn btn-accent btn-lg grow" style={{ textDecoration: "none" }}
        >
          <IconMap size={18} stroke={2} /> Indicazioni
        </a>
        <button className="btn btn-ghost btn-lg" style={{ flexShrink: 0, width: 56 }}>
          <IconHeart size={20} stroke={2} />
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Perché vale</div>
        <div className="t-15" style={{ marginTop: 10, lineHeight: 1.6, color: "var(--ink-2)" }}>
          Un consiglio del cuore: vai presto, prima delle 10. La luce della mattina qui è un'altra cosa, e non c'è ancora la fila turistica.
        </div>
      </div>
    </div>);

}

