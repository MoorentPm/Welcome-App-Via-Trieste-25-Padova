// login.jsx — Date + optional name, demo skip. localStorage persist.

const STORAGE_KEY = "elegant-loft-guest";

window.loadGuest = function() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
};

window.saveGuest = function(g) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(g)); } catch (e) {}
};

window.clearGuest = function() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
};

function Login({ onLogin }) {
  const [inDate, setInDate] = React.useState("");
  const [outDate, setOutDate] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [lang, setLang] = React.useState("it");

  const T = {
    it: {
      title: ["La tua casa", "a Padova"],
      sub: "Dicci le date del soggiorno e come ti possiamo chiamare.",
      phIn: "Check-in", phOut: "Check-out", phName: "Come ti chiamiamo? (facoltativo)",
      btn: "Entra", demo: "Salta — modalità demo",
      err: "Servono le date di check-in e check-out.",
      privacy: "Salviamo solo questo dispositivo: non ti chiederemo di rifarlo.",
    },
    en: {
      title: ["Your home", "in Padua"],
      sub: "Tell us your check-in and check-out dates, and your name (optional).",
      phIn: "Check-in", phOut: "Check-out", phName: "Your name (optional)",
      btn: "Enter", demo: "Skip — demo mode",
      err: "Check-in and check-out dates are required.",
      privacy: "We store this only on this device: you won't be asked again.",
    },
    de: {
      title: ["Dein Zuhause", "in Padua"],
      sub: "Gib uns deine Daten und deinen Namen (optional).",
      phIn: "Check-in", phOut: "Check-out", phName: "Dein Name (optional)",
      btn: "Eintreten", demo: "Überspringen — Demo",
      err: "Check-in- und Check-out-Daten erforderlich.",
      privacy: "Wir speichern nur auf diesem Gerät — kein erneuter Login nötig.",
    },
    fr: {
      title: ["Ta maison", "à Padoue"],
      sub: "Donne-nous les dates de séjour et ton prénom (facultatif).",
      phIn: "Arrivée", phOut: "Départ", phName: "Ton prénom (facultatif)",
      btn: "Entrer", demo: "Passer — mode démo",
      err: "Les dates d'arrivée et de départ sont obligatoires.",
      privacy: "Stocké uniquement sur cet appareil — pas besoin de recommencer.",
    },
  };
  const t = T[lang] || T.it;

  const submit = () => {
    if (!inDate || !outDate) { setErr(t.err); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      const d1 = new Date(inDate);
      const d2 = new Date(outDate);
      const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
      const today = new Date(); today.setHours(0,0,0,0);
      let stage = "stay";
      if (today < d1) stage = "pre";
      else if (today >= d2) stage = "out";
      const guest = {
        firstName: firstName.trim() || "Ospite",
        nights, stage,
        checkin: inDate, checkout: outDate,
        method: "dates",
        demo: false,
        lang,
      };
      window.saveGuest(guest);
      onLogin(guest);
    }, 700);
  };

  const skipDemo = () => {
    setLoading(true);
    setTimeout(() => {
      const guest = {
        firstName: "Ospite",
        nights: 3,
        stage: "stay",
        checkin: null, checkout: null,
        method: "demo",
        demo: true,
        lang,
      };
      window.saveGuest(guest);
      onLogin(guest);
    }, 500);
  };

  return (
    <div style={{
      height: "100%", position: "relative", overflow: "hidden",
      background: "linear-gradient(170deg, #1A1916 0%, #2F2A24 60%, #4A2A18 100%)",
      color: "#fff",
    }}>
      <div style={{ position: "absolute", right: -80, top: 60, width: 280, height: 280, borderRadius: 999,
        background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)", opacity: 0.45 }}/>
      <div style={{ position: "absolute", left: -120, bottom: 200, width: 320, height: 320, borderRadius: 999,
        background: "radial-gradient(circle, var(--accent-deep) 0%, transparent 65%)", opacity: 0.35 }}/>

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "60px 20px 0", zIndex: 2 }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.02 }}>
          Elegant<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 999, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          {Object.keys(T).map(k => (
            <button key={k} onClick={() => setLang(k)} style={{
              padding: "5px 10px", borderRadius: 999, border: "none",
              background: lang === k ? "rgba(255,255,255,0.95)" : "transparent",
              color: lang === k ? "#1A1916" : "rgba(255,255,255,0.8)",
              fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase",
            }}>{k}</button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", padding: "44px 24px 0", zIndex: 2 }}>
        <div className="t-12 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Benvenuto
        </div>
        <div className="serif" style={{ fontSize: 38, lineHeight: 1, marginTop: 12, letterSpacing: -0.03, fontWeight: 500 }}>
          {t.title[0]}<br/>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t.title[1]}</em>.
        </div>
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 14, lineHeight: 1.55, maxWidth: 320 }}>
          {t.sub}
        </div>
      </div>

      <div style={{ position: "absolute", left: 16, right: 16, bottom: 56, zIndex: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <DateField label={t.phIn}  value={inDate}  onChange={setInDate}  />
            <DateField label={t.phOut} value={outDate} onChange={setOutDate} />
          </div>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={t.phName}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, fontFamily: "inherit",
              outline: "none", boxSizing: "border-box", backdropFilter: "blur(16px)",
            }}/>
          <button onClick={submit} disabled={loading} style={{
            padding: "14px 22px", borderRadius: 16, border: "none",
            background: "var(--accent)", color: "#fff", cursor: "pointer",
            fontSize: 16, fontWeight: 700, marginTop: 4,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading
              ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: 999, animation: "sp 0.8s linear infinite" }}/>
              : <>{t.btn} <IconChevronR size={18} stroke={2.5}/></>}
          </button>
        </div>

        {err && <div style={{ marginTop: 10, fontSize: 13, color: "#FFB59C", padding: "0 4px" }}>{err}</div>}

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button onClick={skipDemo} style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.7)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline",
            textUnderlineOffset: 3, textDecorationColor: "rgba(255,255,255,0.3)",
          }}>{t.demo}</button>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, opacity: 0.5, textAlign: "center", lineHeight: 1.4, padding: "0 10px" }}>
          {t.privacy}
        </div>
      </div>

      <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label style={{
      flex: 1, position: "relative", display: "block",
      background: "rgba(255,255,255,0.08)", borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.15)", padding: "10px 14px 8px",
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", border: "none", background: "transparent",
          color: "#fff", fontSize: 15, fontFamily: "inherit", outline: "none",
          padding: 0, marginTop: 2, colorScheme: "dark",
        }}/>
    </label>
  );
}

Object.assign(window, { Login });
