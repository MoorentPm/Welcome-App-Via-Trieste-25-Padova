import React from 'react'
import { IconChevronL } from '../Icons'

export function NavBar({ back, title, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "max(44px, calc(env(safe-area-inset-top, 0px) + 12px)) 12px 12px",
      position: "sticky", top: 0, zIndex: 10,
      background: "linear-gradient(180deg, var(--bg) 75%, rgba(242,239,234,0) 100%)"
    }}>
      <button onClick={back} className="nav-btn" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}>
        <IconChevronL size={18} stroke={2.5} />
      </button>
      <div className="nav-title">{title}</div>
      <div style={{ width: 36 }}>{right}</div>
    </div>
  )
}
