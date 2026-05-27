import React from 'react'
import { PLACES } from '../data'
import { IconMap, IconChevronR } from './Icons'

// padova.jsx — Map-first Padova tab with draggable bottom sheet

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
              background: "var(--accent)", color: "#fff",
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              transform: "translateY(15px)",
            }}>{i + 1}</div>
          ) : (
            <>
              <div style={{
                padding: "5px 10px", borderRadius: 999,
                background: selected === p.id ? "var(--accent)" : "#fff",
                color: selected === p.id ? "#fff" : "var(--ink)",
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all .2s",
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
  );
}

export default function Padova({ go }) {
  const [selected, setSelected] = React.useState(null);

  // Three snap points: peeking, mid (default), expanded
  const SNAP_PEEK = 110;
  const SNAP_MID  = 260;
  const SNAP_FULL = Math.round(window.innerHeight * 0.72);
  const SNAPS = [SNAP_PEEK, SNAP_MID, SNAP_FULL];

  const [sheetH, setSheetH] = React.useState(SNAP_MID);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef({ startY: 0, startH: 0 });

  const snapTo = (h) => {
    const closest = SNAPS.reduce((a, b) => Math.abs(b - h) < Math.abs(a - h) ? b : a);
    setSheetH(closest);
  };

  const onTouchStart = (e) => {
    drag.current = { startY: e.touches[0].clientY, startH: sheetH };
    setDragging(true);
  };

  const onTouchMove = (e) => {
    const dy = drag.current.startY - e.touches[0].clientY;
    const next = Math.max(SNAP_PEEK - 20, Math.min(drag.current.startH + dy, SNAP_FULL + 20));
    setSheetH(next);
  };

  const onTouchEnd = () => {
    setDragging(false);
    snapTo(sheetH);
  };

  // Tap on handle cycles through snap points
  const onHandleTap = () => {
    if (sheetH <= SNAP_PEEK + 20) snapTo(SNAP_MID);
    else if (sheetH <= SNAP_MID + 20) snapTo(SNAP_FULL);
    else snapTo(SNAP_PEEK);
  };

  const pins = [
    { id: "scrovegni", top: "26%", left: "32%", name: "Scrovegni",    tag: "Arte",    dist: "12 min" },
    { id: "prato",     top: "60%", left: "30%", name: "Prato",        tag: "Iconico", dist: "8 min" },
    { id: "pedrocchi", top: "42%", left: "55%", name: "Pedrocchi",    tag: "Caffè",   dist: "7 min" },
    { id: "orto",      top: "70%", left: "60%", name: "Orto Botanico", tag: "Verde",  dist: "10 min" },
    { id: "basilica",  top: "78%", left: "44%", name: "Sant'Antonio", tag: "Storia",  dist: "15 min" },
    { id: "ragione",   top: "48%", left: "42%", name: "Ragione",      tag: "Storia",  dist: "9 min" },
  ];

  const sel = pins.find(p => p.id === selected);

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {/* Map */}
      <MapBg pins={pins} selected={selected} onPin={setSelected} userPin={{ top: "50%", left: "45%" }} />

      {/* Top floating pill */}
      <div style={{
        position: "absolute", top: 60, left: 16, right: 16, zIndex: 5,
        padding: "12px 18px", borderRadius: 22,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, flexShrink: 0,
          background: "var(--accent-soft)", color: "var(--accent-deep)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconMap size={18} stroke={2}/>
        </div>
        <div className="grow">
          <div className="t-11 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>Esplora</div>
          <div className="t-15 w-600">Padova centro storico</div>
        </div>
      </div>

      {/* Bottom sheet — draggable */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        bottom: 0, zIndex: 5,
        background: "#fff",
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
        height: sheetH,
        transition: dragging ? "none" : "height .32s cubic-bezier(.2,.8,.2,1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Drag handle — touch target */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onHandleTap}
          style={{
            padding: "14px 0 10px",
            cursor: "grab",
            flexShrink: 0,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <div style={{
            width: 40, height: 5, background: "#E5E0D7", borderRadius: 3, margin: "0 auto",
            transition: dragging ? "none" : "background .2s",
          }}/>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90 }}>
          {sel ? (
            <div style={{ padding: "0 20px 16px" }}>
              <div className="chip" style={{ marginBottom: 8 }}>{sel.tag}</div>
              <div className="serif" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.15 }}>{sel.name}</div>
              <div className="t-13 muted" style={{ marginTop: 4 }}>{sel.dist} a piedi dal loft</div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={() => go("place", PLACES.find(p => p.id === sel.id) || sel)}
                  className="btn btn-accent grow">Scopri di più</button>
                <button
                  className="btn btn-ghost"
                  style={{ width: 50 }}
                  onClick={() => {
                    const place = PLACES.find(p => p.id === sel.id);
                    const url = place?.maps_url || `https://maps.google.com/?q=${encodeURIComponent(sel.name + ', Padova')}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <IconMap size={18} stroke={2}/>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "0 20px 16px" }}>
              <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Vicino a te</div>
              <div className="t-13 muted" style={{ marginTop: 2 }}>Tocca un pin sulla mappa, o scorri qui sotto</div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", marginTop: 14, paddingBottom: 4 }}>
                {PLACES.map(p => (
                  <div key={p.id} onClick={() => go("place", p)} style={{ minWidth: 140, cursor: "pointer" }}>
                    <div style={{
                      height: 80, borderRadius: 14,
                      backgroundImage: "repeating-linear-gradient(135deg, #e5e0d7 0 8px, #efebe3 8px 16px)",
                      display: "flex", alignItems: "flex-end", padding: 8, color: "#fff",
                      fontSize: 10, fontFamily: "ui-monospace, monospace",
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
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
  );
}
