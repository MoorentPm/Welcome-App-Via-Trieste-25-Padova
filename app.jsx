// app.jsx — Login flow + tab nav: Home(Chiavi) / Padova(map) / Itinerario / Concierge

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "stage": "stay",
  "accent": "terracotta",
  "skipLogin": false
}/*EDITMODE-END*/;

const ACCENTS = {
  terracotta: { name: "Terracotta", val: "oklch(0.62 0.12 45)",  soft: "oklch(0.94 0.04 50)",  deep: "oklch(0.48 0.14 40)" },
  olive:      { name: "Oliva",       val: "oklch(0.56 0.09 120)", soft: "oklch(0.94 0.04 120)", deep: "oklch(0.42 0.1 120)" },
  cobalt:     { name: "Cobalto",    val: "oklch(0.55 0.13 240)", soft: "oklch(0.94 0.04 240)", deep: "oklch(0.42 0.14 240)" },
  plum:       { name: "Prugna",      val: "oklch(0.48 0.1 340)",  soft: "oklch(0.94 0.04 340)", deep: "oklch(0.38 0.12 340)" },
};

function applyAccent(key) {
  const a = ACCENTS[key] || ACCENTS.terracotta;
  const r = document.documentElement.style;
  r.setProperty("--accent", a.val);
  r.setProperty("--accent-soft", a.soft);
  r.setProperty("--accent-deep", a.deep);
}

function TabBar({ active, onTab }) {
  const tabs = [
    { id: "home",      icon: IconHome,    label: "Home" },
    { id: "padova",    icon: IconMap,     label: "Padova" },
    { id: "itinerary", icon: IconSparkle, label: "Itinerario" },
    { id: "host",      icon: IconMsg,     label: "Concierge" },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => {
        const I = t.icon;
        const isActive = active === t.id;
        return (
          <button key={t.id} data-active={isActive} onClick={() => onTab(t.id)} className="tabitem">
            <I size={24} stroke={isActive ? 2.2 : 1.8}/>
            <span style={{ marginTop: 2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [guest, setGuest] = React.useState(() => window.loadGuest?.() || null);
  const [route, setRoute] = React.useState({ name: "home", params: null });
  const [history, setHistory] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);

  React.useEffect(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);

  // Re-sync stage from tweaks when guest exists (for demo)
  React.useEffect(() => {
    if (guest && tweaks.stage && guest.stage !== tweaks.stage) {
      const g = { ...guest, stage: tweaks.stage };
      setGuest(g);
      window.saveGuest?.(g);
    }
  }, [tweaks.stage]);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setEditOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setEditOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  React.useEffect(() => {
    if (tweaks.skipLogin && !guest) {
      const g = { code: "DEMO", firstName: "Giulia", nights: 3, stage: tweaks.stage };
      setGuest(g);
      window.saveGuest?.(g);
    }
  }, [tweaks.skipLogin]);

  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  const go = (name, params = null) => {
    setHistory(h => [...h, route]);
    setRoute({ name, params });
  };
  const back = () => {
    setHistory(h => {
      if (h.length === 0) { setRoute({ name: "home", params: null }); return []; }
      const last = h[h.length - 1];
      setRoute(last);
      return h.slice(0, -1);
    });
  };
  const tab = (id) => {
    setHistory([]);
    setRoute({ name: id, params: null });
  };

  // Login gate
  if (!guest) {
    return (
      <div className="app-root" style={{ height: "100%", position: "relative" }}>
        <Login onLogin={g => setGuest({ ...g, stage: g.stage || tweaks.stage })} />
        {editOpen && <TweaksPanel tweaks={tweaks} setTweak={setTweak} close={() => setEditOpen(false)} />}
      </div>
    );
  }

  let screen = null;
  const activeTab = ["home", "padova", "itinerary", "host"].includes(route.name) ? route.name : null;

  switch (route.name) {
    case "home":      screen = <HomeChiavi go={go} stage={guest.stage || tweaks.stage} guest={guest} />; break;
    case "padova":    screen = <Padova go={go} />; break;
    case "itinerary": screen = <Itinerary back={back} go={go} />; break;
    case "host":      screen = <Host back={back} guest={guest} />; break;
    case "checkin":   screen = <Checkin back={back} />; break;
    case "checkout":  screen = <Checkout back={back} go={go} />; break;
    case "wifi":      screen = <Wifi back={back} />; break;
    case "house":     screen = <House back={back} go={go} />; break;
    case "appliance": screen = <Appliance back={back} item={route.params} />; break;
    case "arrival":   screen = <ArrivalCheckin back={back} go={go} />; break;
    case "arrival_checkin": screen = <ArrivalCheckin back={back} go={go} />; break;
    case "transport": screen = <TransportDetail back={back} mode={route.params} />; break;
    case "coupons":   screen = <Coupons back={back} go={go} guest={guest} />; break;
    case "coupon":    screen = <CouponDetail back={back} item={route.params} guest={guest} />; break;
    case "coupon":    screen = <CouponDetail back={back} item={route.params} guest={guest} />; break;
    case "goodbye":   screen = <Review back={back} guest={guest} go={go} />; break;
    case "review":    screen = <Review back={back} guest={guest} go={go} />; break;
    case "place":     screen = <PlaceDetail back={back} place={route.params} />; break;
    case "places":    screen = <Places back={back} go={go} />; break;
    case "tip":       screen = <DailyTip back={back} go={go} />; break;
    case "about":     screen = <About back={back} />; break;
    case "coupons":   screen = <Coupons back={back} />; break;
    case "settings":  screen = <Settings back={back} guest={guest} onLogout={() => { window.clearGuest?.(); setGuest(null); }} onSave={(g) => { setGuest(g); window.saveGuest?.(g); }} />; break;
    default:          screen = <HomeChiavi go={go} stage={guest.stage || tweaks.stage} guest={guest} />;
  }

  return (
    <>
      <div className="app-root" data-screen-label={route.name} style={{ height: "100%", position: "relative" }}>
        {screen}
        <TabBar active={activeTab || "home"} onTab={tab} />
      </div>
      {editOpen && <TweaksPanel tweaks={tweaks} setTweak={setTweak} close={() => setEditOpen(false)} />}
    </>
  );
}

function TweaksPanel({ tweaks, setTweak, close }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      width: 300, background: "rgba(20,20,22,0.95)", color: "#fff",
      borderRadius: 22, padding: 18, backdropFilter: "blur(20px)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      fontFamily: "-apple-system, system-ui, sans-serif",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Tweaks</div>
        <button onClick={close} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 26, height: 26, borderRadius: 999, cursor: "pointer", fontSize: 14 }}>×</button>
      </div>

      <TweakRow label="Stato soggiorno">
        {[
          { v: "pre",  l: "Pre-arrivo" },
          { v: "stay", l: "Soggiorno" },
          { v: "out",  l: "Ultimo dì" },
        ].map(o => (
          <TweakPill key={o.v} active={tweaks.stage === o.v} onClick={() => setTweak("stage", o.v)}>{o.l}</TweakPill>
        ))}
      </TweakRow>

      <TweakRow label="Accent">
        {Object.entries(ACCENTS).map(([k, a]) => (
          <button key={k} onClick={() => setTweak("accent", k)} style={{
            width: 32, height: 32, borderRadius: 999, border: tweaks.accent === k ? "2px solid #fff" : "2px solid transparent",
            background: a.val, cursor: "pointer", boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
          }} title={a.name}/>
        ))}
      </TweakRow>

      <TweakRow label="Login">
        <TweakPill active={!tweaks.skipLogin} onClick={() => setTweak("skipLogin", false)}>Mostra</TweakPill>
        <TweakPill active={tweaks.skipLogin} onClick={() => setTweak("skipLogin", true)}>Salta</TweakPill>
      </TweakRow>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function TweakPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 12px", borderRadius: 999, border: "none",
      background: active ? "#fff" : "rgba(255,255,255,0.1)",
      color: active ? "#000" : "#fff",
      fontSize: 12, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

function Settings({ back, guest, onLogout, onSave }) {
  const [name, setName] = React.useState(guest.firstName || "");
  const [checkin, setCheckin] = React.useState(guest.checkin || "");
  const [checkout, setCheckout] = React.useState(guest.checkout || "");
  const [lang, setLang] = React.useState(guest.lang || "it");
  const [savedNote, setSavedNote] = React.useState(false);

  const dirty = name !== (guest.firstName || "")
    || checkin !== (guest.checkin || "")
    || checkout !== (guest.checkout || "")
    || lang !== (guest.lang || "it");

  const save = () => {
    let nights = guest.nights;
    let stage = guest.stage;
    if (checkin && checkout) {
      const d1 = new Date(checkin), d2 = new Date(checkout);
      nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (today < d1) stage = "pre";
      else if (today >= d2) stage = "out";
      else stage = "stay";
    }
    onSave({
      ...guest,
      firstName: name.trim() || "Ospite",
      checkin, checkout, nights, stage, lang,
    });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 1800);
  };

  return (
    <div className="screen-scroll" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title="Profilo" />
      <div style={{ padding: "0 16px" }}>

        {/* Avatar header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 6px 18px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999, flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
            color: "#fff", display: "flex",
            alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22,
          }}>{(name || "O")[0].toUpperCase()}</div>
          <div className="grow">
            <div className="t-17 w-600">{name || "Ospite"}</div>
            <div className="t-12 muted" style={{ marginTop: 2 }}>
              {guest.nights} {guest.nights === 1 ? "notte" : "notti"} · Padova
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>
          La tua prenotazione
        </div>
        <div className="card-tight" style={{ padding: 6 }}>
          <SettingsField label="Come ti chiamiamo" value={name} onChange={setName} placeholder="Il tuo nome" />
          <div style={{ display: "flex", gap: 0, borderTop: "0.5px solid var(--hairline)" }}>
            <SettingsField label="Check-in"  value={checkin}  onChange={setCheckin}  type="date" border={false} />
            <div style={{ width: "0.5px", background: "var(--hairline)" }}/>
            <SettingsField label="Check-out" value={checkout} onChange={setCheckout} type="date" border={false} />
          </div>
        </div>

        {/* Language */}
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "24px 6px 10px" }}>Lingua</div>
        <div className="card-tight">
          {[
            { k: "it", label: "Italiano" },
            { k: "en", label: "English" },
            { k: "de", label: "Deutsch" },
            { k: "fr", label: "Français" },
          ].map((l) => (
            <button key={l.k} onClick={() => setLang(l.k)} className="row" style={{
              width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <div className="grow t-15">{l.label}</div>
              {lang === l.k && <IconCheck size={18} stroke={2.5} style={{ color: "var(--accent)" }}/>}
            </button>
          ))}
        </div>

        {/* Save sticky-ish bar */}
        <div style={{ padding: "24px 0 0" }}>
          <button onClick={save} disabled={!dirty && !savedNote} className="btn btn-accent btn-lg btn-full"
            style={{ opacity: dirty || savedNote ? 1 : 0.4, transition: "opacity .2s" }}>
            {savedNote ? <><IconCheck size={18} stroke={2.5}/> Salvato</> : "Salva modifiche"}
          </button>
        </div>

        <div style={{ padding: "12px 0 0" }}>
          <button onClick={onLogout} className="btn btn-ghost btn-lg btn-full">Esci</button>
        </div>
      </div>
    </div>
  );
}

function SettingsField({ label, value, onChange, placeholder, type = "text", border = true }) {
  return (
    <label style={{
      display: "block", padding: "10px 14px",
      borderTop: border ? "0.5px solid var(--hairline)" : "none",
      flex: type === "date" ? 1 : undefined,
    }}>
      <div className="t-11 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", border: "none", background: "transparent",
          fontSize: 15, fontFamily: "inherit", color: "var(--ink)",
          outline: "none", padding: "3px 0 0", boxSizing: "border-box",
        }}/>
    </label>
  );
}

Object.assign(window, { App, TabBar, Settings });
