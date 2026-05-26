// home.jsx — Now just Chiavi (enriched) — main dashboard

function HomeChiavi({ go, stage, guest }) {
  const A = window.APARTMENT;
  const name = guest?.firstName || A.guest.firstName;

  const heroByStage = {
    pre:  { tag: "Pre-arrivo",  title: "Check-in dalle 15:00",     sub: "Tieni il telefono pronto: ti guido passo-passo appena sei in via Trieste.", cta: "Come arrivare", action: () => go("arrival_checkin") },
    stay: { tag: guest?.demo ? "Modalità demo" : "Sei nel loft",
            title: guest?.demo ? "Esplora l'app del Loft" : "Tutto pronto, Padova ti aspetta.",
            sub: guest?.demo ? "Naviga liberamente: tutte le sezioni sono attive in modalità anteprima." : "Wi-Fi attivo. Caffè in cucina. Lascia che ti suggerisca cosa fare oggi.",
            cta: guest?.demo ? "Scopri le sezioni" : "Cosa fare oggi a Padova",
            action: () => go(guest?.demo ? "house" : "tip") },
    out:  { tag: "Ultimo giorno", title: "Check-out alle 10:00",    sub: "Bastano 3 passaggi. Ti accompagno io.",                                                cta: "Procedura check-out", action: () => go("checkout") },
  };
  const hero = heroByStage[stage] || heroByStage.stay;

  return (
    <div className="screen-scroll" style={{ paddingBottom: 110 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "54px 20px 0" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.02 }}>
          Elegant<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <button onClick={() => go("settings")} style={{
          width: 36, height: 36, borderRadius: 999, background: "var(--accent)",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
        }}>{name[0]}</button>
      </div>

      {/* Greeting */}
      <div style={{ padding: "18px 20px 0" }}>
        {!guest?.demo && (
          <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
            Padova · {guest?.nights || A.guest.nights} notti
          </div>
        )}
        <div className="serif" style={{ fontSize: 38, lineHeight: 1, marginTop: guest?.demo ? 0 : 10, letterSpacing: -0.03 }}>
          Ciao, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{name}</em>.
        </div>
      </div>

      {/* Hero key card */}
      <div style={{ padding: "20px 16px 8px" }}>
        <div onClick={hero.action} style={{
          borderRadius: 28, padding: "26px 24px",
          background: "linear-gradient(160deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", cursor: "pointer", position: "relative", overflow: "hidden",
          minHeight: 230,
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 200, height: 200,
            borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.4,
          }}/>
          <div className="t-12 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>
            {hero.tag}
          </div>
          <div className="serif" style={{ fontSize: 28, lineHeight: 1.1, marginTop: 12, fontWeight: 500, position: "relative" }}>
            {hero.title}
          </div>
          <div className="t-14" style={{ opacity: 0.75, marginTop: 10, lineHeight: 1.5, position: "relative", maxWidth: 280 }}>
            {hero.sub}
          </div>
          <div style={{
            position: "absolute", right: 22, bottom: 22,
            width: 50, height: 50, borderRadius: 999, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconChevronR size={22} stroke={2.5}/>
          </div>
        </div>
      </div>

      {/* Quick commands — restored 2x2 grid, with combined Arrivo+checkin */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <QuickTile icon={<IconWifi size={22}/>}  label="Wi-Fi"           sub="1 tap per copiarla"   onClick={() => go("wifi")} />
          <QuickTile icon={<IconKey size={22}/>}    label="Arrivo & casa"   sub="Come arrivare + check-in" onClick={() => go("arrival_checkin")} />
          <QuickTile icon={<IconBook size={22}/>}   label="Casa & regole"   sub="Wi-Fi, FAQ, aiuto"     onClick={() => go("house")} />
          <QuickTile
            icon={stage === "out" ? <IconHeart size={22}/> : <IconStar size={22}/>}
            label={stage === "out" ? "Lascia un saluto" : "Coupon & sconti"}
            sub={stage === "out" ? "Recensione + sconto" : "Vantaggi per te"}
            onClick={() => go(stage === "out" ? "goodbye" : "coupons")} />
        </div>
      </div>

      {/* Oggi in città */}
      <div style={{ padding: "26px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Oggi in città</div>
        <button onClick={() => go("places")} className="t-13 w-600" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
          Tutto
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4, scrollSnapType: "x mandatory", scrollPaddingLeft: 20 }}>
        {window.TODAY_PICKS.map(p => (
          <div key={p.id} onClick={() => go("place", p)}
            style={{
              minWidth: 220, scrollSnapAlign: "start",
              borderRadius: 22, overflow: "hidden", background: "var(--surface)",
              boxShadow: "0 8px 24px rgba(26,25,22,0.06)", cursor: "pointer",
            }}>
            <div style={{ height: 120, background: p.tint, position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4))",
              }}/>
              <div style={{ position: "absolute", bottom: 10, left: 12, color: "#fff", fontSize: 11, opacity: 0.85, fontFamily: "ui-monospace, monospace" }}>
                📸 {p.title}
              </div>
            </div>
            <div style={{ padding: 14 }}>
              <div className="t-11 w-600" style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{p.tag}</div>
              <div className="t-15 w-600" style={{ lineHeight: 1.3 }}>{p.title}</div>
              <div className="t-12 muted" style={{ marginTop: 4, lineHeight: 1.4 }}>{p.sub}</div>
              <div className="t-11 muted" style={{ marginTop: 8 }}>{p.meta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Moorent sponsor banner — dark, accent gradient, matches hero theme */}
      <div style={{ padding: "26px 16px 0" }}>
        <button onClick={() => go("about")} style={{
          width: "100%", border: "none", cursor: "pointer", padding: "16px 18px",
          borderRadius: 20, textAlign: "left",
          background: "linear-gradient(110deg, #1A1916 0%, #2F2A24 60%, #3A2E26 100%)",
          color: "#fff", position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 20px rgba(26,25,22,0.18)",
        }}>
          <div style={{
            position: "absolute", right: -40, top: -40, width: 160, height: 160,
            borderRadius: 999, background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.45,
          }}/>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: "rgba(243,223,217,0.15)", border: "1px solid rgba(243,223,217,0.3)",
            color: "#f3dfd9", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 18, position: "relative",
          }}>M</div>
          <div className="grow" style={{ position: "relative" }}>
            <div className="t-11 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Gestione affitti brevi
            </div>
            <div className="t-15 w-600" style={{ marginTop: 3, lineHeight: 1.3 }}>
              Scopri <span style={{ color: "#f3dfd9" }}>{A.pmName}</span>
            </div>
          </div>
          <IconChevronR size={18} stroke={2.5} style={{ position: "relative", opacity: 0.7, flexShrink: 0 }}/>
        </button>
      </div>
    </div>
  );
}

function QuickTile({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "var(--surface)", border: "none", borderRadius: 20,
      padding: "14px", textAlign: "left", cursor: "pointer",
      boxShadow: "0 4px 12px rgba(26,25,22,0.04)",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: "var(--accent-soft)", color: "var(--accent-deep)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div className="t-15 w-600" style={{ marginTop: 4 }}>{label}</div>
      <div className="t-12 muted">{sub}</div>
    </button>
  );
}

// New compact action row — 3 small button-like tiles
function ActionRow({ stage, go }) {
  const items = [
    { id: "wifi",    icon: <IconWifi size={20} stroke={2.2}/>,  label: "Wi-Fi",      go: () => go("wifi") },
    { id: "arrival", icon: <IconKey  size={20} stroke={2.2}/>,  label: "Arrivo & casa", go: () => go("arrival_checkin") },
    stage === "out"
      ? { id: "bye", icon: <IconHeart size={20} stroke={2.2}/>, label: "Lascia un saluto", go: () => go("goodbye") }
      : { id: "help", icon: <IconBook  size={20} stroke={2.2}/>, label: "Aiuto rapido",    go: () => go("house") },
  ];
  return (
    <div style={{ padding: "22px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {items.map(it => (
        <button key={it.id} onClick={it.go} className="action-pill">
          <div className="action-pill__icon">{it.icon}</div>
          <div className="action-pill__label">{it.label}</div>
        </button>
      ))}
      <style>{`
        .action-pill {
          background: var(--ink);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 12px 8px 11px;
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px; min-height: 78px;
          box-shadow: 0 6px 16px rgba(26,25,22,0.18);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .action-pill:active {
          transform: scale(0.96);
          box-shadow: 0 2px 8px rgba(26,25,22,0.18);
        }
        .action-pill__icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: var(--accent-soft);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-deep);
        }
        .action-pill__label {
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.1px;
          line-height: 1.15;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { HomeChiavi });
