import React from 'react'
import { IconCheck, IconHeart } from '../Icons'
import { APARTMENT as AP, CHECKOUT_STEPS } from '../../data'
import { NavBar } from './NavBar'
import { useLang } from '../../i18n'

export function Checkout({ back, go }) {
  const { t, tData } = useLang()
  const localSteps = tData('checkoutSteps')
  const steps = localSteps || CHECKOUT_STEPS
  const [done, setDone] = React.useState(() => steps.map(() => false))
  const toggle = (i) => setDone((d) => d.map((v, k) => k === i ? !v : v))
  const allDone = done.every(Boolean)
  const completedCount = done.filter(Boolean).length

  React.useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => go("goodbye"), 800)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  const subText = t('checkout.sub').replace('{time}', AP.checkout.until)

  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('checkout.title')} />
      <div style={{ padding: "0 20px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{t('checkout.heading')}</em>.
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          {subText}
        </div>
      </div>

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

      <div style={{ padding: "28px 16px 0" }}>
        <button onClick={() => go("goodbye")} disabled={!allDone} className="btn btn-accent btn-lg btn-full"
          style={{ opacity: allDone ? 1 : 0.4, transition: "opacity .3s" }}>
          {allDone
            ? <><IconHeart size={18} stroke={2.2}/> {t('checkout.allDone')}</>
            : t('checkout.progress').replace('{done}', completedCount).replace('{total}', steps.length)}
        </button>
      </div>
    </div>
  )
}
