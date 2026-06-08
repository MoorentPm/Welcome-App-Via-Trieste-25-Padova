import React from 'react'
import {
  IconCheck, IconChevronD, IconChevronR,
  IconCopy, IconPhone,
} from '../Icons'
import {
  APARTMENT as AP, CHECKOUT_STEPS, HOUSE_RULES,
  APPLIANCES, FAQ, EMERGENCY,
} from '../../data'
import { NavBar } from './NavBar'
import { useLang } from '../../i18n'

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
    </div>
  )
}

export function Wifi({ back }) {
  const { t, tData } = useLang()
  const [copied, setCopied] = React.useState(null)
  const copy = (what, value) => {
    try { navigator.clipboard?.writeText(value) } catch {}
    setCopied(what)
    setTimeout(() => setCopied(null), 2000)
  }

  const troubleshootItems = tData('wifiTroubleshoot') || [
    { icon: "🔁", t: "Si è disconnesso?", d: "Vai nelle impostazioni Wi-Fi del telefono, dimentica la rete, poi riconnettiti." },
    { icon: "🔌", t: "Niente segnale?", d: "Il router è dietro la TV. Stacca la spina per 10 secondi e riattacca. Aspetta 2 minuti." },
    { icon: "📍", t: "Lento in una stanza?", d: "Avvicinati al router o usa la rete '5GHz' che è più veloce nel raggio breve." },
  ]

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('wifi.title')} />
      <div style={{ padding: "8px 20px 0" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, fontWeight: 500 }}>
          {t('wifi.heading').split(' ').slice(0, -1).join(' ')} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t('wifi.heading').split(' ').slice(-1)[0]}</em>
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          {t('wifi.sub')}
        </div>
      </div>

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

          <div className="t-11 w-600" style={{ opacity: 0.65, letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>{t('wifi.network')}</div>
          <div style={{
            marginTop: 6, position: "relative",
            color: "#fff", fontFamily: "ui-monospace, monospace", fontSize: 20, fontWeight: 700,
          }}>
            {AP.wifi.ssid}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "18px 0", position: "relative" }}/>

          <div className="t-11 w-600" style={{ opacity: 0.65, letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>{t('wifi.password')}</div>
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
              {copied === "pwd" ? <><IconCheck size={12} stroke={3}/> {t('wifi.copied')}</> : <><IconCopy size={12} stroke={2.5}/> {t('wifi.copy')}</>}
            </span>
          </button>
        </div>
      </div>

      <div style={{ padding: "26px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>
          {t('wifi.troubleshoot')}
        </div>
        <div className="card-tight">
          {troubleshootItems.map((r, i) => (
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
          {t('wifi.private')}
        </div>
      </div>
    </div>
  )
}

export function Appliance({ back, item, go }) {
  const { t, tData } = useLang()
  const localAppliances = tData('appliances')
  const getAppliance = (it) => {
    if (!localAppliances) return it
    return localAppliances.find(a => a.id === it.id) || it
  }
  const a = getAppliance(item || APPLIANCES[0])

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('appliance.title')} />

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
          }}>{t('appliance.videoLabel')}</div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{t('appliance.brief')}</div>
        <div className="t-15" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--ink-2)" }}>
          {a.desc}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 4px 10px" }}>{t('appliance.steps')}</div>
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
          {t('appliance.help')} <button onClick={() => go?.("host")} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", padding: 0 }}>{t('appliance.concierge')}</button>
        </div>
      </div>
    </div>
  )
}

export function House({ back, go }) {
  const { t, tData } = useLang()
  const [open, setOpen] = React.useState({})
  const [openFaq, setOpenFaq] = React.useState(null)
  const [doneCO, setDoneCO] = React.useState({})
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const toggleCO = (i) => setDoneCO((d) => ({ ...d, [i]: !d[i] }))

  const localRules = tData('houseRules') || HOUSE_RULES
  const localCheckoutSteps = tData('checkoutSteps') || CHECKOUT_STEPS
  const localFaq = tData('faq') || FAQ
  const localAppliances = tData('appliances') || APPLIANCES

  const coTotal = localCheckoutSteps.length
  const coDone = Object.values(doneCO).filter(Boolean).length
  React.useEffect(() => {
    if (coDone === coTotal && coTotal > 0) {
      const timer = setTimeout(() => go("goodbye"), 700)
      return () => clearTimeout(timer)
    }
  }, [coDone, coTotal])

  const coTimeNote = t('house.checkout.timeNote').replace('{time}', AP.checkout.until)

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('house.title')} />
      <div style={{ padding: "0 20px 8px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          {t('house.heading')}
        </div>
      </div>

      <CollapsibleSection
        title={t('house.rules.title')}
        sub={`${localRules.length} ${t('house.rules.sub')}`}
        icon="📜" open={!!open.rules} onToggle={() => toggle("rules")}>
        <div className="card-tight" style={{ background: "transparent", boxShadow: "none" }}>
          {localRules.map((r, i) =>
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

      <CollapsibleSection
        title={t('house.checkout.title')}
        sub={`${localCheckoutSteps.length} ${t('house.checkout.sub')}`}
        icon="🧳" open={!!open.checkout} onToggle={() => toggle("checkout")}>
        <div style={{ padding: "0 6px 12px" }}>
          <div className="t-13 muted" style={{ lineHeight: 1.5, padding: "0 10px 10px" }}>
            {coTimeNote}
          </div>
          {localCheckoutSteps.map((s, i) =>
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
                <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
                  {coDone === coTotal ? "🎁" : "🔒"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-11 w-600" style={{ opacity: 0.7, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {coDone === coTotal ? t('house.checkout.allDoneTitle') : t('house.checkout.unlockTitle')}
                  </div>
                  <div className="t-14 w-600" style={{ marginTop: 3, lineHeight: 1.3 }}>
                    {coDone === coTotal
                      ? t('house.checkout.allDoneSub')
                      : coDone === 0
                        ? t('house.checkout.unlockSub')
                        : t('house.checkout.almostSub').replace('{remaining}', coTotal - coDone).replace('{total}', coTotal)}
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

      <CollapsibleSection
        title={t('house.appliances.title')}
        sub={t('house.appliances.sub')}
        icon="🔧" open={!!open.appliances} onToggle={() => toggle("appliances")}>
        <div className="card-tight" style={{ background: "transparent", boxShadow: "none" }}>
          {APPLIANCES.map((a) => {
            const locA = localAppliances.find(la => la.id === a.id) || a
            return (
              <button key={a.id} onClick={() => go("appliance", a)} className="row" style={{
                border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left"
              }}>
                <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: "center" }}>{a.icon}</div>
                <div className="grow">
                  <div className="t-15 w-600">{locA.t}</div>
                  <div className="t-12 muted" style={{ marginTop: 2 }}>{locA.sub}</div>
                </div>
                <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)" }} />
              </button>
            )
          })}
        </div>
      </CollapsibleSection>

      <div style={{ padding: "24px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>{t('house.faq.title')}</div>
        <div className="card-tight">
          {localFaq.map((f, i) =>
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

      <div style={{ padding: "24px 16px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 10px" }}>{t('house.emergency.title')}</div>
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

      <div style={{ padding: "24px 20px 0" }}>
        <button onClick={() => go("about")} style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          padding: "12px 4px", cursor: "pointer"
        }}>
          <div className="t-11 muted" style={{ lineHeight: 1.5 }}>
            {t('house.managedBy')} <strong style={{ color: "var(--accent)" }}>{AP.pmName}</strong> · {t('house.discoverUs')}
          </div>
        </button>
      </div>
    </div>
  )
}
