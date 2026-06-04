import React from 'react'
import { IconChevronL, IconHeart, IconMap } from '../Icons'
import { PLACES } from '../../data'
import { loadFavorites, toggleFavorite } from '../../utils'
import { NavBar } from './NavBar'

export function Places({ back, go }) {
  const [favs, setFavs] = React.useState(() => loadFavorites())
  const sorted = [...PLACES].sort((a, b) => {
    const af = favs.includes(a.id) ? 0 : 1
    const bf = favs.includes(b.id) ? 0 : 1
    return af - bf
  })
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
        {sorted.map((p) => {
          const isFav = favs.includes(p.id)
          return (
            <div key={p.id} onClick={() => go("place", p)} className="card-tight" style={{ cursor: "pointer", position: "relative" }}>
              {isFav && (
                <div style={{
                  position: "absolute", top: 10, right: 10, zIndex: 2,
                  width: 28, height: 28, borderRadius: 999,
                  background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                  <IconHeart size={14} stroke={2} style={{ fill: "#fff", color: "#fff" }} />
                </div>
              )}
              {p.photo
                ? <img src={p.photo} alt={p.name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
                : <div className="img-placeholder" style={{ height: 150 }}>📸 {p.name}</div>
              }
              <div style={{ padding: 16 }}>
                <div className="t-11 w-600" style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4 }}>{p.tag}</div>
                <div className="t-17 w-600" style={{ marginTop: 4 }}>{p.name}</div>
                <div className="t-13 muted" style={{ marginTop: 4 }}>{p.sub}</div>
                <div className="t-12 muted" style={{ marginTop: 8 }}>{p.dist}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PlaceDetail({ back, place }) {
  const p = place || PLACES[0]
  const [favs, setFavs] = React.useState(() => loadFavorites())
  const isFav = favs.includes(p.id)
  const handleFav = () => setFavs(toggleFavorite(p.id))
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <div style={{ position: "relative" }}>
        {p.photo
          ? <img src={p.photo} alt={p.name} style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
          : <div className="img-placeholder" style={{ height: 300, borderRadius: 0 }}>📸 {p.name}</div>
        }
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
        <button onClick={handleFav} className="btn btn-ghost btn-lg" style={{
          flexShrink: 0, width: 56,
          background: isFav ? "var(--accent-soft)" : undefined,
          color: isFav ? "var(--accent)" : undefined,
        }}>
          <IconHeart size={20} stroke={2} style={{ fill: isFav ? "var(--accent)" : "none" }} />
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>Perché vale</div>
        <div className="t-15" style={{ marginTop: 10, lineHeight: 1.6, color: "var(--ink-2)" }}>
          Un consiglio del cuore: vai presto, prima delle 10. La luce della mattina qui è un'altra cosa, e non c'è ancora la fila turistica.
        </div>
      </div>
    </div>
  )
}
