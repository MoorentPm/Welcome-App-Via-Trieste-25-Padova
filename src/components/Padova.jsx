import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PLACES } from '../data'
import { IconMap } from './Icons'

// ─── MapBg — SVG decorativo (usato negli itinerari in Screens.jsx) ───
export function MapBg({ pins = [], path = null, selected, onPin, userPin, numbered = false }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 50% 40%, #E8E2D5 0%, #D5CDBC 100%)",
      overflow: "hidden",
    }}>
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", opacity: 0.55 }}>
        <g stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M0 200 Q200 220 400 180"/>
          <path d="M0 380 L400 360"/>
          <path d="M0 540 Q200 520 400 580"/>
          <path d="M120 0 Q140 400 100 800"/>
          <path d="M280 0 Q260 400 300 800"/>
        </g>
        <g stroke="#fff" strokeWidth="3" fill="none" opacity="0.5">
          <path d="M0 280 L400 290"/>
          <path d="M0 460 L400 440"/>
          <path d="M200 0 L210 800"/>
          <path d="M50 100 L380 700"/>
        </g>
        <rect x="40" y="440" width="80" height="80" rx="8" fill="#B8C9A8" opacity="0.6"/>
        <circle cx="310" cy="250" r="40" fill="#B8C9A8" opacity="0.6"/>
        <rect x="240" y="540" width="100" height="60" rx="10" fill="#A8C0CC" opacity="0.5"/>
      </svg>
      {path && (
        <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d={path.d} stroke="var(--accent)" strokeWidth="4" fill="none"
            strokeDasharray="2 8" strokeLinecap="round" opacity="0.85"/>
        </svg>
      )}
      {userPin && (
        <div style={{ position: "absolute", left: userPin.left, top: userPin.top, transform: "translate(-50%,-50%)" }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: "var(--accent)", border: "4px solid #fff", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}/>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--accent)", opacity: 0.2, position: "absolute", top: -19, left: -19, animation: "ping 2s infinite" }}/>
        </div>
      )}
      {pins.map((p, i) => (
        <div key={p.id || i} onClick={() => onPin?.(p.id)}
          style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%,-100%)", cursor: onPin ? "pointer" : "default" }}>
          {numbered ? (
            <div style={{
              width: 30, height: 30, borderRadius: 999,
              background: "var(--accent)", color: "#fff", border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, transform: "translateY(15px)",
            }}>{i + 1}</div>
          ) : (
            <>
              <div style={{
                padding: "5px 10px", borderRadius: 999,
                background: selected === p.id ? "var(--accent)" : "#fff",
                color: selected === p.id ? "#fff" : "var(--ink)",
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "all .2s",
              }}>{p.name}</div>
              <div style={{
                width: 0, height: 0,
                borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                borderTop: `6px solid ${selected === p.id ? "var(--accent)" : "#fff"}`,
                margin: "0 auto",
              }}/>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Coordinate reali Padova ───
const APT = [45.4064, 11.8768] // Via Trieste 25

const POI = [
  { id: "scrovegni", name: "Scrovegni",    coord: [45.4126, 11.8798], tag: "Arte",    dist: "12 min" },
  { id: "prato",     name: "Prato",         coord: [45.3978, 11.8742], tag: "Iconico", dist: "8 min"  },
  { id: "pedrocchi", name: "Pedrocchi",     coord: [45.4081, 11.8770], tag: "Caffè",   dist: "7 min"  },
  { id: "orto",      name: "Orto Botanico", coord: [45.3991, 11.8803], tag: "Verde",   dist: "10 min" },
  { id: "basilica",  name: "Sant'Antonio",  coord: [45.3983, 11.8762], tag: "Storia",  dist: "15 min" },
  { id: "ragione",   name: "Ragione",       coord: [45.4075, 11.8752], tag: "Storia",  dist: "9 min"  },
]

// Snap points del bottom sheet (px dall'alto in basso)
const SNAP_PEEK = 108
const SNAP_MID  = 260
const getSnapFull = () => Math.round(window.innerHeight * 0.72)

function makePinIcon(name, isSelected) {
  const bg    = isSelected ? 'var(--accent,#C27248)' : '#fff'
  const color = isSelected ? '#fff' : '#1A1916'
  const arrow = isSelected ? 'var(--accent,#C27248)' : '#fff'
  return L.divIcon({
    html: `<div style="transform:translateX(-50%);display:inline-flex;flex-direction:column;align-items:center;pointer-events:none;">
      <div style="padding:5px 10px;border-radius:999px;background:${bg};color:${color};font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.2);font-family:-apple-system,BlinkMacSystemFont,sans-serif;">${name}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${arrow};"></div>
    </div>`,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function makeAptIcon() {
  return L.divIcon({
    html: `<div style="transform:translate(-50%,-50%);width:44px;height:44px;position:relative;">
      <div style="position:absolute;inset:0;border-radius:999px;background:var(--accent,#C27248);opacity:.18;animation:ping 2s infinite;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:999px;background:var(--accent,#C27248);border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.3);"></div>
    </div>`,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// ─── Componente mappa Leaflet (non si re-inizializza al drag dello sheet) ───
const PadovaLeafletMap = React.memo(function PadovaLeafletMap({ selected, onPin }) {
  const containerRef = React.useRef(null)
  const mapRef       = React.useRef(null)
  const markersRef   = React.useRef({})

  React.useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // Padova centro bounds: N 45.43 / S 45.38 / W 11.84 / E 11.92
    const PADOVA_BOUNDS = L.latLngBounds([45.38, 11.84], [45.43, 11.92])

    const map = L.map(containerRef.current, {
      center: [45.403, 11.877],
      zoom: 14,
      minZoom: 13,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true,
      maxBounds: PADOVA_BOUNDS,
      maxBoundsViscosity: 1.0,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://osm.org/copyright" style="color:inherit">OSM</a>',
      maxZoom: 19,
    }).addTo(map)

    // Marker appartamento
    L.marker(APT, { icon: makeAptIcon(), interactive: false }).addTo(map)

    // Marker POI
    POI.forEach(p => {
      const m = L.marker(p.coord, { icon: makePinIcon(p.name, false) }).addTo(map)
      m.on('click', () => onPin(p.id))
      markersRef.current[p.id] = m
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Aggiorna icone al cambio di selezione (senza re-init)
  React.useEffect(() => {
    POI.forEach(p => {
      markersRef.current[p.id]?.setIcon(makePinIcon(p.name, p.id === selected))
    })
  }, [selected])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        // isolation: isolate keeps Leaflet's z-index stack from leaking outside
        isolation: 'isolate',
        overflow: 'hidden',
      }}
    />
  )
})

// ─── Schermata principale Padova ───
export default function Padova({ go }) {
  const [selected, setSelected] = React.useState(null)
  const [sheetH, setSheetH]     = React.useState(SNAP_MID)
  const [dragging, setDragging] = React.useState(false)
  const drag = React.useRef({ startY: 0, startH: 0, lastY: 0, lastTime: 0, velocity: 0 })

  const SNAP_FULL = getSnapFull()
  const SNAPS = [SNAP_PEEK, SNAP_MID, SNAP_FULL]

  const snapTo = React.useCallback((target) => {
    const best = SNAPS.reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a)
    setSheetH(best)
  }, [SNAP_FULL]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Touch handlers con momentum ──
  const onTouchStart = (e) => {
    const y = e.touches[0].clientY
    drag.current = { startY: y, startH: sheetH, lastY: y, lastTime: Date.now(), velocity: 0 }
    setDragging(true)
  }

  const onTouchMove = (e) => {
    const y   = e.touches[0].clientY
    const now = Date.now()
    const dt  = now - drag.current.lastTime
    // calcola velocità istantanea (px/ms, positivo = trascini su)
    if (dt > 0) drag.current.velocity = (drag.current.lastY - y) / dt
    drag.current.lastY   = y
    drag.current.lastTime = now
    const dy = drag.current.startY - y
    const next = Math.max(SNAP_PEEK - 40, Math.min(drag.current.startH + dy, SNAP_FULL + 40))
    setSheetH(next)
  }

  const onTouchEnd = () => {
    setDragging(false)
    const v = drag.current.velocity
    // proietta la posizione 200ms avanti con la velocità di rilascio
    setSheetH(h => {
      const projected = h + v * 200
      return SNAPS.reduce((a, b) => Math.abs(b - projected) < Math.abs(a - projected) ? b : a)
    })
  }

  const onHandleTap = () => {
    setSheetH(h => {
      if (h <= SNAP_PEEK + 30) return SNAP_MID
      if (h <= SNAP_MID  + 30) return SNAP_FULL
      return SNAP_PEEK
    })
  }

  // ── Selezione pin: auto-raise se lo sheet è nascosto ──
  const handlePinSelect = React.useCallback((id) => {
    setSelected(id)
    setSheetH(h => h < SNAP_MID ? SNAP_MID : h)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sel = POI.find(p => p.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>

      {/* Mappa Leaflet reale */}
      <PadovaLeafletMap selected={selected} onPin={handlePinSelect} />

      {/* Pill in cima */}
      <div style={{
        position: 'absolute', top: 60, left: 16, right: 16, zIndex: 5,
        padding: '12px 18px', borderRadius: 22,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, flexShrink: 0,
          background: 'var(--accent-soft)', color: 'var(--accent-deep)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconMap size={18} stroke={2}/>
        </div>
        <div className="grow">
          <div className="t-11 w-600 muted" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>Esplora</div>
          <div className="t-15 w-600">Padova centro storico</div>
        </div>
      </div>

      {/* Bottom sheet draggabile */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
        background: '#fff',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        height: sheetH,
        // easing Apple-style durante snap; nessuna transizione durante il drag
        transition: dragging ? 'none' : 'height .38s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── ZONA DRAG — pill + header: tutto questo blocco risponde al trascinamento ── */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onHandleTap}
          style={{ flexShrink: 0, touchAction: 'none', userSelect: 'none', cursor: 'grab' }}
        >
          {/* Pill */}
          <div style={{ padding: '14px 0 10px' }}>
            <div style={{
              width: 40, height: 5, borderRadius: 3, margin: '0 auto',
              background: dragging ? 'var(--accent-soft)' : '#E5E0D7',
              transition: 'background .15s',
            }}/>
          </div>

          {/* Header — titolo visibile sempre, anche a sheet peeking */}
          <div style={{ padding: '0 20px 10px' }}>
            {sel ? (
              <>
                <div className="chip" style={{ marginBottom: 6 }}>{sel.tag}</div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.15 }}>{sel.name}</div>
                <div className="t-13 muted" style={{ marginTop: 3 }}>{sel.dist} a piedi dal loft</div>
              </>
            ) : (
              <>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Vicino a te</div>
                <div className="t-13 muted" style={{ marginTop: 2 }}>Tocca un pin sulla mappa, o scorri qui sotto</div>
              </>
            )}
          </div>
        </div>

        {/* ── ZONA SCROLL — bottoni e card, non interferisce col drag ── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
          {sel ? (
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => go('place', PLACES.find(p => p.id === sel.id) || sel)}
                  className="btn btn-accent grow"
                >Scopri di più</button>
                <button
                  className="btn btn-ghost"
                  style={{ width: 50 }}
                  onClick={() => {
                    const place = PLACES.find(p => p.id === sel.id)
                    const url = place?.maps_url || `https://maps.google.com/?q=${encodeURIComponent(sel.name + ', Padova')}`
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <IconMap size={18} stroke={2}/>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 10, paddingBottom: 4 }}>
                {PLACES.map(p => (
                  <div key={p.id} onClick={() => go('place', p)} style={{ minWidth: 140, cursor: 'pointer' }}>
                    <div style={{
                      height: 80, borderRadius: 14,
                      backgroundImage: 'repeating-linear-gradient(135deg, #e5e0d7 0 8px, #efebe3 8px 16px)',
                      display: 'flex', alignItems: 'flex-end', padding: 8,
                      fontSize: 10, fontFamily: 'ui-monospace, monospace',
                    }}>📸</div>
                    <div className="t-13 w-600" style={{ marginTop: 6, lineHeight: 1.25 }}>{p.name}</div>
                    <div className="t-11 muted">{p.dist}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
