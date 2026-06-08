import React from 'react'
import {
  IconCheck, IconChevronL, IconChevronR,
  IconHeart, IconMap, IconSparkle, IconX,
} from './Icons'
import { ItineraryLeafletMap } from './Padova'
import { MOODS,
  imgScrovegni, imgPrato, imgOrto, imgBasilica, imgPedrocchi, imgRagione,
  imgPiazzaErbe, imgPalazzoBo, imgEremitani, imgBattistero,
  imgViaDelSanto, imgCalandre, imgColliEuganei, imgAbanoTerme, imgBacchiglione,
  imgPiovego, imgSpritz, imgTramezzino, imgPolpo, imgCraftBeer, imgTrattoria, imgRisotto,
  imgGraziati, imgPiazzaSignori, imgViaAltinate,
} from '../data'
import { loadItineraries, saveItinerary, deleteItinerary } from '../utils'
import { NavBar } from './screens/NavBar'
import { useLang } from '../i18n'

// Coordinate Nominatim/OSM — aggiornate con geocoding verificato
const PLACE_COORDS = {
  "pedrocchi":               [45.40769, 11.87709],
  "piazzetta pedrocchi":     [45.40769, 11.87709],
  "piazza delle erbe":       [45.40693, 11.87527],
  "piazza dei signori":      [45.40766, 11.87346],
  "palazzo della ragione":   [45.40725, 11.87522],
  "scrovegni":               [45.41187, 11.87952],
  "eremitani":               [45.41101, 11.87991],
  "zuckermann":              [45.41151, 11.87816],
  "dell'arena":              [45.41215, 11.87981],
  "orto botanico":           [45.39856, 11.88085],
  "prato della valle":       [45.39872, 11.87618],
  "loggia amulea":           [45.39896, 11.87492],
  "sant'antonio":            [45.40146, 11.88085],
  "basilica":                [45.40146, 11.88085],
  "oratorio di san giorgio": [45.40098, 11.88016],
  "palazzo bo":              [45.40674, 11.87739],
  "teatro anatomico":        [45.40674, 11.87739],
  "battistero":              [45.40679, 11.87180],
  "dei fabbri":              [45.40637, 11.87538],
  "folperia":                [45.40749, 11.87576],
  "graziati":                [45.40693, 11.87520],
  "al pero":                 [45.40720, 11.87680],
  "belle parti":             [45.40876, 11.87421],
  "dalla zita":              [45.40750, 11.87600],
  "zita":                    [45.40750, 11.87600],
  "borromeo":                [45.41000, 11.87514],
  "galleria borromeo":       [45.41000, 11.87514],
  "via del santo":           [45.40200, 11.88200],
  "banale":                  [45.40160, 11.88100],
  "padovanelle":             [45.40660, 11.87620],
  "al sasso":                [45.40690, 11.87520],
  "birrificio":              [45.40900, 11.88100],
  "via altinate":            [45.40749, 11.88528],
  "piovego":                 [45.40700, 11.88500],
  "argine":                  [45.41050, 11.88200],
  "abano terme":             [45.3618,  11.7918],
  "colli euganei":           [45.3850,  11.8100],
  "bacchiglione":            [45.4090,  11.8820],
  "teolo":                   [45.3610,  11.8240],
  "brenta":                  [45.4080,  11.9150],
  "villa pisani":            [45.4100,  11.9510],
}

function lookupCoord(title) {
  const lower = title.toLowerCase()
  for (const [key, coord] of Object.entries(PLACE_COORDS)) {
    if (lower.includes(key)) return coord
  }
  return null
}

const PHOTO_MAP = [
  { keys: ['pedrocchi', 'caffè dell\'argine', 'caffè al'],                              img: imgPedrocchi  },
  { keys: ['scrovegni', 'giardini dell\'arena', 'dell\'arena'],                          img: imgScrovegni  },
  { keys: ['eremitani', 'civici agli', 'musei civici', 'palazzo zuckermann', 'zuckermann'], img: imgEremitani },
  { keys: ['battistero'],                                                                 img: imgBattistero },
  { keys: ['palazzo bo', 'teatro anatomico', 'galleria borromeo', 'borromeo', 'palazzo bo e'], img: imgPalazzoBo },
  { keys: ['orto botanico', 'orto'],                                                     img: imgOrto       },
  { keys: ['prato della valle', 'loggia amulea', 'prato della'],                        img: imgPrato      },
  { keys: ['sant\'antonio', 'basilica di', 'oratorio di san giorgio', 'san giorgio'],   img: imgBasilica   },
  { keys: ['palazzo della ragione', 'ragione'],                                          img: imgRagione    },
  { keys: ['via del santo', 'drink in via'],                                             img: imgViaDelSanto  },
  { keys: ['calandre'],                                                                  img: imgCalandre     },
  { keys: ['colli euganei', 'pista ciclabile'],                                         img: imgColliEuganei },
  { keys: ['abano terme', 'terme preistoriche'],                                        img: imgAbanoTerme   },
  { keys: ['bacchiglione'],                                                              img: imgBacchiglione },
  { keys: ['dalla zita', 'tramezzino'],                                                  img: imgTramezzino   },
  { keys: ['folperia', 'folpo', 'polpo'],                                                img: imgPolpo        },
  { keys: ['spritz', 'bar nazionale'],                                                   img: imgSpritz       },
  { keys: ['piovego'],                                                                   img: imgPiovego      },
  { keys: ['padovanelle', 'birrificio', 'birreria'],                                     img: imgCraftBeer    },
  { keys: ['belle parti'],                                                               img: imgRisotto      },
  { keys: ['al sasso', 'al pero', 'fabbri', 'osteria', 'trattoria'],                    img: imgTrattoria    },
  { keys: ['graziati'],                                                                  img: imgGraziati     },
  { keys: ['piazza dei signori', 'aperitivo in piazza'],                                 img: imgPiazzaSignori},
  { keys: ['via altinate', 'caffè in via', 'passeggiata in via'],                        img: imgViaAltinate  },
  { keys: ['piazza delle erbe', 'piazzetta', 'mercato', 'bici'],                        img: imgPiazzaErbe   },
  { keys: ['teolo', 'brenta', 'ciclovia', 'villa pisani', 'stra'],                     img: imgColliEuganei },
  { keys: ['loggia amulea', 'amulea'],                                                  img: imgPrato        },
]

function lookupPhoto(title) {
  const lower = title.toLowerCase()
  for (const { keys, img } of PHOTO_MAP) {
    if (keys.some(k => lower.includes(k))) return img
  }
  return null
}

function SavedItineraries({ onOpen }) {
  const { t, lang } = useLang()
  const [items, setItems] = React.useState(() => loadItineraries())
  const [confirmDel, setConfirmDel] = React.useState(null)
  const del = (id, e) => { e?.stopPropagation(); setItems(deleteItinerary(id)); setConfirmDel(null) }
  if (items.length === 0) return null
  return (
    <div style={{ padding: "32px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
          {t('itinerary.saved.heading_pre')} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t('itinerary.saved.heading_em')}</em>
        </div>
        <div className="t-12 muted">{t('itinerary.saved.count').replace('{n}', items.length)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => {
          const dateLocale = lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'it-IT'
          const dateStr = new Date(it.savedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short" })
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
                    {it.mood?.label || t('itinerary.title')} · {it.days} {it.days === 1 ? t('days.one') : t('days.many')}
                  </div>
                  <div className="t-12 muted" style={{ marginTop: 3 }}>{t('itinerary.saved.savedOn').replace('{date}', dateStr)}</div>
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
          )
        })}
      </div>
    </div>
  )
}

export function Itinerary({ back, go }) {
  const { t, tData } = useLang()
  const tMoodsArr = tData('moods') || []
  const tMood = (m) => tMoodsArr.find(x => x.id === m.id) || {}
  const [step, setStep] = React.useState("pick") // pick → duration → result
  const [mood, setMood] = React.useState(null)
  const [days, setDays] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [reopen, setReopen] = React.useState(null)

  const pick = (m) => { setMood(m); setStep("duration") }
  const gen = (d) => {
    setDays(d); setLoading(true)
    setTimeout(() => { setLoading(false); setStep("result") }, 900)
  }

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 90 }}>
      <NavBar back={back} title={t('itinerary.title')} />

      {step === "pick" &&
        <div>
          <div style={{ padding: "4px 20px 8px" }}>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
              {t('itinerary.pick.heading')}
            </div>
            <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
              {t('itinerary.pick.sub')}
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
                <div className="t-17 w-600" style={{ marginTop: 10 }}>{tMood(m).label || m.label}</div>
                <div className="t-12 muted" style={{ lineHeight: 1.4 }}>{tMood(m).sub || m.sub}</div>
              </button>
            )}
          </div>

          <SavedItineraries onOpen={(it) => { setMood(it.mood); setDays(it.days); setReopen(it); setStep("result") }} />
        </div>
      }

      {step === "duration" && mood &&
        <div style={{ padding: "8px 20px 0" }}>
          <div className="chip" style={{ background: "rgba(26,25,22,0.05)", color: "var(--ink-2)" }}>
            {mood.emoji} {tMood(mood).label || mood.label}
          </div>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, marginTop: 16, fontWeight: 500 }}>
            {t('itinerary.duration.heading_pre')} <em style={{ color: "var(--accent)", fontStyle: "italic" }}>{t('itinerary.duration.heading_em')}</em> {t('itinerary.duration.heading_post')}
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { d: 1, label: t('itinerary.d1.label'), sub: t('itinerary.d1.sub') },
              { d: 2, label: t('itinerary.d2.label'), sub: t('itinerary.d2.sub') },
              { d: 3, label: t('itinerary.d3.label'), sub: t('itinerary.d3.sub') },
              { d: 4, label: t('itinerary.d4.label'), sub: t('itinerary.d4.sub') },
            ].map((o) =>
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
        <ItineraryResult mood={mood} days={days} loading={loading} back={() => { setReopen(null); setStep("pick") }} go={go} reopen={reopen} />
      }
    </div>
  )
}

export function ItineraryResult({ mood, days, loading, back, go, reopen }) {
  const { t, lang, tData } = useLang()
  const itDays = lang !== 'it' ? tData('itineraryDays') : null

  const day1 = {
    slow: [
      { t: "09:30", title: "Colazione al Pedrocchi", sub: "Caffè alla menta, 15 minuti di pace", tag: "Caffè", tint: "#CFB487" },
      { t: "11:00", title: "Passeggiata in Piazza delle Erbe", sub: "Mercato del mattino, atmosfera vera", tag: "Piazza", tint: "#E2B670" },
      { t: "13:00", title: "Pranzo da Dalla Zita", sub: "Tramezzini leggendari — 2 bastano", tag: "Pranzo", tint: "#9B7A55" },
      { t: "15:30", title: "Orto Botanico", sub: "Mezz'ora di calma tra le piante rare", tag: "Verde", tint: "#7A9D6E" },
    ],
    art: [
      { t: "10:00", title: "Cappella degli Scrovegni", sub: "Giotto. Prenota il turno delle 10.", tag: "Must", tint: "#7E6CE8" },
      { t: "11:30", title: "Musei Civici Eremitani", sub: "Nella stessa area, continua il tema", tag: "Museo", tint: "#5C5099" },
      { t: "13:30", title: "Pranzo all'Osteria dei Fabbri", sub: "Risotto al radicchio", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:00", title: "Palazzo della Ragione", sub: "Mercato storico + affreschi", tag: "Storia", tint: "#A88560" },
    ],
    food: [
      { t: "11:00", title: "Tramezzino da Dalla Zita", sub: "Uno leggero, per aprire lo stomaco", tag: "Snack", tint: "#C99E6E" },
      { t: "13:00", title: "Pranzo dei Fabbri", sub: "Menu del giorno, prodotti veneti", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "17:30", title: "Spritz al Bar Nazionale", sub: "Piazza delle Erbe al tramonto", tag: "Aperitivo", tint: "#E08762" },
      { t: "20:00", title: "Cena alla Folperia", sub: "Street food veneto, tavoli in strada", tag: "Cena", tint: "#5A4434" },
    ],
    green: [
      { t: "10:00", title: "Orto Botanico", sub: "Patrimonio UNESCO. Due ore belle.", tag: "Verde", tint: "#7A9D6E" },
      { t: "12:30", title: "Pranzo in Prato della Valle", sub: "Panini di Mauri + erba", tag: "Picnic", tint: "#A8B97A" },
      { t: "15:30", title: "Giro in bici sul Piovego", sub: "Sconto 20% con la app", tag: "Attività", tint: "#4A7C5A" },
    ],
    night: [
      { t: "18:30", title: "Spritz in piazza", sub: "Delle Erbe o dei Signori, tu scegli", tag: "Aperitivo", tint: "#E08762" },
      { t: "20:30", title: "Cena alla Folperia", sub: "Cicchetti veneti", tag: "Cena", tint: "#5A4434" },
      { t: "22:30", title: "Drink in Via del Santo", sub: "Locali piccoli, zero turisti", tag: "Dopo cena", tint: "#2C2740" },
    ],
    rain: [
      { t: "10:00", title: "Scrovegni al coperto", sub: "Quasi nessuna coda quando piove", tag: "Museo", tint: "#7E6CE8" },
      { t: "12:30", title: "Pedrocchi, piano nobile", sub: "Caffè lungo, vista sulla piazza", tag: "Caffè", tint: "#CFB487" },
      { t: "14:30", title: "Palazzo della Ragione", sub: "Enorme, ore di esplorazione", tag: "Storia", tint: "#A88560" },
    ],
  }

  const day2 = {
    slow: [
      { t: "09:30", title: "Caffè al Caffè dell'Argine", sub: "Sui Navigli padovani, meno turisti", tag: "Caffè", tint: "#CFB487" },
      { t: "11:00", title: "Basilica di Sant'Antonio", sub: "Il Santo, anche se non sei religioso", tag: "Sacro", tint: "#A88560" },
      { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:00", title: "Prato della Valle al tramonto", sub: "La piazza più grande d'Europa, vibe magica", tag: "Iconico", tint: "#E08762" },
    ],
    art: [
      { t: "10:00", title: "Palazzo Zuckermann", sub: "Arti applicate, sempre vuoto", tag: "Museo", tint: "#5C5099" },
      { t: "12:00", title: "Oratorio di San Giorgio", sub: "Affreschi di Altichiero, gioiello nascosto", tag: "Tesoro", tint: "#7E6CE8" },
      { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "15:30", title: "Battistero del Duomo", sub: "Cupola affrescata dal Menabuoi", tag: "Sacro", tint: "#A88560" },
    ],
    food: [
      { t: "10:30", title: "Pasticceria Graziati", sub: "Sfogliatina + caffè, sconto 10%", tag: "Dolce", tint: "#C99E6E" },
      { t: "12:30", title: "Trattoria al Sasso", sub: "Vera cucina padovana, lontana dai turisti", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "17:00", title: "Birrificio Padova", sub: "Birre locali, tagliere veneto", tag: "Aperitivo", tint: "#5C7A5A" },
      { t: "20:30", title: "Cena al Calandre", sub: "Stella Michelin (in zona, prenota)", tag: "Cena", tint: "#2C2740" },
    ],
    green: [
      { t: "09:30", title: "Mercato di Piazza delle Erbe", sub: "Frutta e verdura, vivace ogni mattina", tag: "Mercato", tint: "#A8B97A" },
      { t: "11:30", title: "Giardini dell'Arena", sub: "Parco urbano accanto agli Scrovegni", tag: "Verde", tint: "#7A9D6E" },
      { t: "14:00", title: "Bici verso Abano Terme", sub: "20 km su pista, terme alla fine", tag: "Attività", tint: "#4A7C5A" },
    ],
    night: [
      { t: "19:00", title: "Aperitivo a Piazzetta Pedrocchi", sub: "Locali studenteschi, vivace", tag: "Aperitivo", tint: "#E08762" },
      { t: "21:00", title: "Cena alla Birreria Padovanelle", sub: "Veneto rustico, porzioni vere", tag: "Cena", tint: "#5A4434" },
      { t: "23:00", title: "Drink in Via Altinate", sub: "Bar piccoli tra i portici, musica bassa, niente turisti", tag: "Dopo cena", tint: "#2C2740" },
    ],
    rain: [
      { t: "10:30", title: "Musei Civici agli Eremitani", sub: "3 ore tranquille al coperto", tag: "Museo", tint: "#5C5099" },
      { t: "13:30", title: "Pranzo da Belle Parti", sub: "Cucina veneta moderna", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:00", title: "Caffè & shopping Galleria Borromeo", sub: "Boutiques sotto i portici", tag: "Shopping", tint: "#C99E6E" },
    ],
  }

  const day3 = {
    slow: [
      { t: "09:30", title: "Passeggiata in Via Altinate", sub: "Negozietti, bar e portici — la mattina ha un ritmo tutto suo", tag: "Zona", tint: "#A8B97A" },
      { t: "11:30", title: "Palazzo Bo e Teatro Anatomico", sub: "L'università più antica del mondo. Iscriviti al tour.", tag: "Storia", tint: "#5C5099" },
      { t: "14:00", title: "Pranzo all'Osteria al Pero", sub: "Cucina padovana senza filtri, un tavolo di legno", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:30", title: "Loggia Amulea e Prato della Valle", sub: "La piazza vuota al pomeriggio ha un altro ritmo", tag: "Pausa", tint: "#E08762" },
    ],
    art: [
      { t: "10:00", title: "Teatro Anatomico — Palazzo Bo", sub: "Sala operatoria del 1594, unica al mondo", tag: "Raro", tint: "#5C5099" },
      { t: "12:00", title: "Loggia Amulea — architettura gotica", sub: "Angolo di Prato della Valle spesso ignorato. Bella luce al mattino.", tag: "Architettura", tint: "#7E6CE8" },
      { t: "14:00", title: "Pranzo all'Osteria al Pero", sub: "Classica, niente turisti", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:30", title: "Piazza dei Signori — Torre dell'Orologio", sub: "Orologio astronomico del 1344, uno dei più antichi d'Europa", tag: "Storia", tint: "#A88560" },
    ],
    food: [
      { t: "10:30", title: "Caffè in Via Altinate", sub: "Una zona con bar, negozi e portici — il centro senza turisti", tag: "Zona", tint: "#C99E6E" },
      { t: "12:30", title: "Pranzo alla Birreria Padovanelle", sub: "Menù del giorno con birra artigianale", tag: "Pranzo", tint: "#5C7A5A" },
      { t: "17:00", title: "Aperitivo in Piazza dei Signori", sub: "L'altra piazza — meno turisti dello Spritz classico", tag: "Aperitivo", tint: "#E08762" },
      { t: "20:30", title: "Cena — Osteria al Pero", sub: "Padovano autentico. Prenota.", tag: "Cena", tint: "#5A4434" },
    ],
    green: [
      { t: "09:00", title: "Pista ciclabile verso i Colli Euganei", sub: "20 km su pista dedicata, aria buona", tag: "Attività", tint: "#4A7C5A" },
      { t: "12:30", title: "Sosta a Teolo tra i castagni", sub: "Paesino sui Colli, vista su Padova, trattoria in piazza", tag: "Colli", tint: "#7A9D6E" },
      { t: "16:00", title: "Rientro lungo il Bacchiglione", sub: "Il fiume che attraversa Padova, percorso tranquillo", tag: "Bici", tint: "#A8B97A" },
    ],
    night: [
      { t: "19:00", title: "Aperitivo in Piazza dei Signori", sub: "Meno frequentata di Piazza delle Erbe, uguale atmosfera", tag: "Aperitivo", tint: "#E08762" },
      { t: "21:00", title: "Cena all'Osteria al Pero", sub: "Padovano autentico, pochi coperti, ritmo lento", tag: "Cena", tint: "#5A4434" },
      { t: "23:00", title: "Passeggiata notturna al Prato della Valle", sub: "La piazza di notte, vuota e silenziosa — completamente diversa", tag: "Dopo cena", tint: "#2C2740" },
    ],
    rain: [
      { t: "10:00", title: "Palazzo Bo — tour guidato", sub: "Teatro Anatomico + aula magna, tutto al coperto", tag: "Tour", tint: "#5C5099" },
      { t: "12:30", title: "Pranzo da Dalla Zita", sub: "Tramezzini storici — veloce, economico, buonissimo", tag: "Pranzo", tint: "#C99E6E" },
      { t: "15:00", title: "Battistero del Duomo", sub: "Pochi turisti con la pioggia — goditi gli affreschi", tag: "Arte", tint: "#7E6CE8" },
    ],
  }

  const day4 = {
    slow: [
      { t: "09:30", title: "Giro in bici lungo il Piovego", sub: "Il canale fuori città, niente traffico, aria buona", tag: "Bici", tint: "#4A7C5A" },
      { t: "11:30", title: "Palazzo Zuckermann", sub: "Museo di arti applicate — quasi sempre vuoto", tag: "Museo", tint: "#5C5099" },
      { t: "13:30", title: "Pranzo all'Osteria dei Fabbri", sub: "Bigoli, baccalà, vino locale", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "16:30", title: "Spritz in Piazza dei Signori", sub: "La piazza alternativa — meno turisti delle Erbe", tag: "Aperitivo", tint: "#E08762" },
    ],
    art: [
      { t: "10:00", title: "Basilica di Sant'Antonio", sub: "I bronzi del Donatello e le cappelle votive. Due ore piene.", tag: "Must", tint: "#A88560" },
      { t: "12:00", title: "Piazza dei Signori — Torre dell'Orologio", sub: "Uno degli orologi astronomici più antichi d'Europa", tag: "Storia", tint: "#5C5099" },
      { t: "14:00", title: "Pranzo da Graziati", sub: "Pasticceria storica, tavoli fuori in piazza", tag: "Pranzo", tint: "#C99E6E" },
      { t: "16:00", title: "Prato della Valle — 78 statue", sub: "Il più grande museo a cielo aperto d'Italia — leggi le targhette", tag: "Arte", tint: "#7A9D6E" },
    ],
    food: [
      { t: "10:30", title: "Caffè al Pedrocchi — banco bar", sub: "Ordina al banco come i padovani. Veloce, storico, la metà del prezzo.", tag: "Caffè", tint: "#CFB487" },
      { t: "12:30", title: "Pranzo al mercato di Piazza delle Erbe", sub: "I banchi di salumi e formaggi veneti — nessuna guida turistica te lo dice", tag: "Mercato", tint: "#A8B97A" },
      { t: "17:00", title: "Spritz lungo il Piovego", sub: "I bar del canale, fuori dai circuiti turistici, padovani veri", tag: "Aperitivo", tint: "#E08762" },
      { t: "20:30", title: "Cena a Belle Parti", sub: "Cucina veneta contemporanea, carta dei vini seria", tag: "Cena", tint: "#5A4434" },
    ],
    green: [
      { t: "09:00", title: "Ciclovia del Brenta", sub: "Pista ciclabile verso la Riviera del Brenta, 18 km di pianura", tag: "Bici", tint: "#4A7C5A" },
      { t: "12:00", title: "Villa Pisani a Stra", sub: "Villa UNESCO sul Brenta — il labirinto del giardino è unico", tag: "Villa", tint: "#7A9D6E" },
      { t: "15:30", title: "Rientro lungo il Piovego", sub: "Il canale interno di Padova, ombra e silenzio", tag: "Pausa", tint: "#A8B97A" },
    ],
    night: [
      { t: "18:30", title: "Aperitivo al Birrificio Padova", sub: "Birra artigianale locale, tagliere veneto, zero turisti", tag: "Aperitivo", tint: "#5C7A5A" },
      { t: "20:30", title: "Cena a Belle Parti", sub: "Cucina moderna, porzioni oneste, vino della casa", tag: "Cena", tint: "#5A4434" },
      { t: "23:00", title: "Passeggiata notturna lungo il Piovego", sub: "Il canale illuminato di notte — silenzio, solo padovani", tag: "Dopo cena", tint: "#2C2740" },
    ],
    rain: [
      { t: "10:00", title: "Basilica di Sant'Antonio — sotto la pioggia", sub: "Quando piove le cappelle laterali sono quasi vuote. Cercale.", tag: "Sacro", tint: "#A88560" },
      { t: "12:30", title: "Pranzo alla Trattoria al Sasso", sub: "Piccola, vicino al Duomo, mai nei tour. Menu del giorno.", tag: "Pranzo", tint: "#7A5A3F" },
      { t: "15:00", title: "Oratorio di San Giorgio", sub: "Gli affreschi di Altichiero del 1384 — coperto, sempre vuoto con la pioggia", tag: "Arte", tint: "#7E6CE8" },
    ],
  }

  const overlayDay = (dayObj, dayKey) => {
    if (!itDays || !itDays[dayKey]) return dayObj
    const td = itDays[dayKey]
    const out = {}
    for (const k of Object.keys(dayObj)) {
      out[k] = td[k]
        ? dayObj[k].map((s, i) => td[k][i] ? { ...s, title: td[k][i].title, sub: td[k][i].sub, tag: td[k][i].tag } : s)
        : dayObj[k]
    }
    return out
  }
  const allDays = [day1, day2, day3, day4].map((d, i) => overlayDay(d, ['day1', 'day2', 'day3', 'day4'][i]))
  const plans = allDays.slice(0, days).map((d) => mood ? d[mood.id] || d.slow : d.slow)

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999, border: "3px solid var(--ink-4)",
          borderTopColor: "var(--accent)", animation: "sp 0.9s linear infinite", margin: "0 auto"
        }} />
        <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
        <div className="t-14 muted" style={{ marginTop: 16 }}>
          {t('itinerary.loading')}
        </div>
      </div>
    )
  }

  return <ItineraryDays mood={mood} plans={plans} days={days} back={back} go={go} reopen={reopen} />
}

export function ItineraryDays({ mood, plans, days, back, go, reopen }) {
  const { t, tData } = useLang()
  const tMoodsArr = tData('moods') || []
  const moodLabel = mood ? (tMoodsArr.find(x => x.id === mood.id)?.label || mood.label) : ''
  const [dayIdx, setDayIdx] = React.useState(0)
  const [touchStart, setTouchStart] = React.useState(null)
  const [saved, setSaved] = React.useState(!!reopen)
  const plan = plans[dayIdx]

  const onSave = () => {
    if (saved) return
    saveItinerary({ mood, days })
    setSaved(true)
  }

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchStart === null) return
    const dx = e.changedTouches[0].clientX - touchStart
    if (Math.abs(dx) > 50) {
      if (dx < 0 && dayIdx < plans.length - 1) setDayIdx(dayIdx + 1)
      else if (dx > 0 && dayIdx > 0) setDayIdx(dayIdx - 1)
    }
    setTouchStart(null)
  }

  return (
    <div>
      <div style={{ padding: "8px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="chip">{mood?.emoji} {moodLabel}</div>
        <button onClick={back} className="t-13 w-600" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
          {t('itinerary.result.change')}
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 500 }}>
          {plans.length === 1
            ? t('itinerary.result.heading_pre')
            : t('itinerary.result.heading_multi').replace('{n}', dayIdx + 1).replace('{total}', plans.length)
          }
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t('itinerary.result.heading_em')}</em>.
        </div>
        <div className="t-13 muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
          {t('itinerary.result.steps').replace('{n}', plan.length)}{plans.length > 1 ? ' ' + t('itinerary.result.swipe') : ''}
        </div>
      </div>

      {plans.length > 1 &&
        <div style={{ padding: "16px 16px 0", display: "flex", gap: 6 }}>
          {plans.map((_, i) =>
            <button key={i} onClick={() => setDayIdx(i)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, border: "none", cursor: "pointer",
              background: dayIdx === i ? "var(--accent)" : "rgba(26,25,22,0.06)",
              color: dayIdx === i ? "#fff" : "var(--ink-2)",
              fontSize: 12, fontWeight: 700
            }}>{t('itinerary.result.day_btn').replace('{n}', i + 1)}</button>
          )}
        </div>
      }

      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ position: "relative", height: 240, borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 24px rgba(26,25,22,0.08)" }}>
          <ItineraryMap plan={plan} />
        </div>
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ padding: "24px 16px 8px" }}>
        {plan.map((step, i) => {
          const stepPhoto = lookupPhoto(step.title)
          return (
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
                <div style={{
                  height: 110,
                  position: "relative", overflow: "hidden",
                  ...(stepPhoto
                    ? { backgroundImage: `url(${stepPhoto})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: `linear-gradient(135deg, ${step.tint} 0%, ${step.tint}AA 70%, ${step.tint}66 100%)` }),
                }}>
                  {stepPhoto
                    ? <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.48) 100%)" }} />
                    : <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 14px)" }} />
                  }
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
                      <IconMap size={12} stroke={2.5} /> {t('itinerary.result.directions')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      <div style={{ padding: "16px 20px 20px", display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={saved} className="btn btn-ghost grow" style={{
          opacity: saved ? 0.6 : 1,
          background: saved ? "var(--accent-soft)" : undefined,
          color: saved ? "var(--accent-deep)" : undefined,
        }}>
          {saved ? <><IconCheck size={16} stroke={3}/> {t('itinerary.result.saved')}</> : t('itinerary.result.save')}
        </button>
        <a
          href={`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plan[plan.length - 1]?.title + ', Padova')}&waypoints=${plan.slice(0, -1).map(s => encodeURIComponent(s.title + ', Padova')).join('|')}`}
          target="_blank" rel="noreferrer"
          className="btn btn-accent grow" style={{ textDecoration: "none" }}
        >
          <IconMap size={18} stroke={2} /> {t('itinerary.result.navigate')}
        </a>
      </div>
    </div>
  )
}

export function ItineraryMap({ plan }) {
  const steps = React.useMemo(
    () => plan.map(s => ({ ...s, coord: lookupCoord(s.title) })),
    [plan]
  )
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ItineraryLeafletMap steps={steps} />
    </div>
  )
}
