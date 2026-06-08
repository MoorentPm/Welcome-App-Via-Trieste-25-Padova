import React from 'react'
import { IconCheck, IconChevronL, IconChevronR, IconStar } from '../Icons'
import { APARTMENT as AP, COUPONS_RICH } from '../../data'
import { wrapText, roundRect } from '../../utils'
import { NavBar } from './NavBar'
import { useLang } from '../../i18n'

export function Coupons({ back, go }) {
  const { lang, t } = useLang()
  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <NavBar back={back} title={t('coupons.title')} />
      <div style={{ padding: "0 20px 8px" }}>
        <div className="serif" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 500 }}>
          {t('coupons.heading')}
        </div>
        <div className="t-14 muted" style={{ marginTop: 10, lineHeight: 1.5 }}>
          {t('coupons.sub')}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {COUPONS_RICH.map((c) =>
          <button key={c.id} onClick={() => go("coupon", c)} className="card" style={{
            display: "flex", alignItems: "center", gap: 14, padding: 14, border: "none",
            background: "var(--surface)", cursor: "pointer", textAlign: "left", width: "100%"
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14, flexShrink: 0,
              background: c.tint, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <IconStar size={28} stroke={2} style={{ fill: "#fff" }} />
            </div>
            <div className="grow">
              <div className="t-15 w-600">{c.shop}</div>
              <div className="t-13 w-600" style={{ color: "var(--accent-deep)", marginTop: 2 }}>
                {c.deal[lang] || c.deal.it}
              </div>
              <div className="t-11 muted" style={{ marginTop: 4 }}>
                {c.meta[lang] || c.meta.it}
              </div>
            </div>
            <IconChevronR size={16} stroke={2.2} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
          </button>
        )}
      </div>
    </div>
  )
}

export function CouponDetail({ back, item }) {
  const { lang, t } = useLang()
  const c = item || COUPONS_RICH[0]
  const [downloaded, setDownloaded] = React.useState(false)

  const download = () => {
    const canvas = document.createElement("canvas")
    const W = 900, H = 1400
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext("2d")

    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, "#1A1916")
    bg.addColorStop(1, "#2F2A24")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    const blob = ctx.createRadialGradient(W - 80, 100, 0, W - 80, 100, 360)
    blob.addColorStop(0, c.tint)
    blob.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = blob
    ctx.globalAlpha = 0.55
    ctx.fillRect(0, 0, W, 600)
    ctx.globalAlpha = 1

    ctx.fillStyle = "#f3dfd9"
    ctx.font = "600 28px 'Segoe UI', system-ui, sans-serif"
    ctx.fillText("ELEGANT LOFT · " + (AP.pmName || "MOORENT").toUpperCase(), 60, 100)

    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif"
    ctx.fillText("COUPON · " + (c.meta[lang] || c.meta.it).toUpperCase(), 60, 160)

    ctx.fillStyle = "#FFFFFF"
    ctx.font = "500 64px Georgia, 'Times New Roman', serif"
    wrapText(ctx, c.shop, 60, 250, W - 120, 70)

    ctx.fillStyle = c.tint
    ctx.font = "700 120px Georgia, 'Times New Roman', serif"
    ctx.fillText(c.deal[lang] || c.deal.it, 60, 480)

    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.font = "400 28px 'Segoe UI', system-ui, sans-serif"
    wrapText(ctx, c.desc[lang] || c.desc.it, 60, 580, W - 120, 42)

    const codeY = 880
    ctx.fillStyle = "rgba(255,255,255,0.08)"
    roundRect(ctx, 60, codeY, W - 120, 220, 28)
    ctx.fill()
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif"
    ctx.fillText({ it: "CODICE COUPON", en: "COUPON CODE", de: "COUPON-CODE", fr: "CODE COUPON" }[lang] || "CODICE COUPON", 90, codeY + 60)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "800 84px 'Courier New', monospace"
    ctx.fillText(c.code, 90, codeY + 160)

    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.font = "500 24px 'Segoe UI', system-ui, sans-serif"
    ctx.fillText("📍 " + c.address, 60, 1180)

    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.font = "500 20px 'Segoe UI', system-ui, sans-serif"
    ctx.fillText({
      it: "Mostra questo coupon in cassa · elegantloft.it",
      en: "Show this coupon at the till · elegantloft.it",
      de: "Zeige diesen Coupon an der Kasse · elegantloft.it",
      fr: "Présente ce coupon en caisse · elegantloft.it"
    }[lang] || "", 60, 1340)

    canvas.toBlob((blobObj) => {
      const url = URL.createObjectURL(blobObj)
      const a = document.createElement("a")
      a.href = url
      a.download = `coupon-${c.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, "image/png")

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }


  return (
    <div className="screen-scroll page-enter" style={{ paddingBottom: 110 }}>
      <div style={{ position: "relative" }}>
        <div style={{
          height: 220,
          position: "relative", overflow: "hidden",
          background: c.photo
            ? `url(${c.photo}) center/cover no-repeat`
            : `linear-gradient(160deg, ${c.tint} 0%, ${c.tint}DD 70%, #1A1916 130%)`,
          display: "flex", alignItems: "flex-end", padding: "20px 20px 24px"
        }}>
          {c.photo && (
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(160deg, ${c.tint}99 0%, rgba(0,0,0,0.55) 100%)`
            }} />
          )}
          <button onClick={back} className="nav-btn" style={{
            position: "absolute", top: 56, left: 12,
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)"
          }}>
            <IconChevronL size={18} stroke={2.5} />
          </button>
          <div style={{ color: "#fff", position: "relative" }}>
            <div className="t-11 w-600" style={{ opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.5 }}>{t('coupon.useAt')}</div>
            <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 500, marginTop: 6 }}>{c.shop}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600" style={{ color: "var(--accent-deep)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {c.meta[lang] || c.meta.it}
        </div>
        <div className="serif" style={{ fontSize: 40, lineHeight: 1, fontWeight: 500, marginTop: 8 }}>
          {c.deal[lang] || c.deal.it}
        </div>
        <div className="t-15" style={{ marginTop: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
          {c.desc[lang] || c.desc.it}
        </div>
        <div className="t-12 muted" style={{ marginTop: 12 }}>📍 {c.address}</div>
      </div>

      <div style={{ padding: "24px 16px 0" }}>
        <div style={{
          borderRadius: 20, padding: "20px 18px",
          background: "linear-gradient(135deg, #1A1916 0%, #2F2A24 100%)",
          color: "#fff", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 180, height: 180,
            borderRadius: 999, background: `radial-gradient(circle, ${c.tint} 0%, transparent 70%)`,
            opacity: 0.5
          }} />
          <div className="t-11 w-600" style={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5, position: "relative" }}>
            {t('coupon.code_label')}
          </div>
          <div style={{
            fontFamily: "ui-monospace, monospace", fontSize: 28, fontWeight: 700,
            letterSpacing: 3, marginTop: 8, position: "relative"
          }}>
            {c.code}
          </div>
          <button onClick={download} style={{
            marginTop: 14, padding: "12px 18px", borderRadius: 12,
            background: downloaded ? "var(--ok)" : "var(--accent)", color: "#fff",
            border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8, position: "relative"
          }}>
            {downloaded
              ? <><IconCheck size={14} stroke={3} /> {t('coupon.downloaded')}</>
              : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14M5 12l7 7 7-7M5 21h14"/></svg> {t('coupon.download')}</>
            }
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{t('coupon.howUse')}</div>
        <div className="t-14" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--ink-2)" }}>{t('coupon.howUseDesc')}</div>
      </div>
    </div>
  )
}
