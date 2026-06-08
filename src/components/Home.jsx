import React from 'react'
import { APARTMENT, TODAY_PICKS } from '../data'
import { IconChevronR, IconWifi, IconKey, IconBook, IconStar, IconHeart } from './Icons'
import { useLang } from '../i18n'

export function QuickTile({ icon, label, sub, onClick }) {
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

export default function HomeChiavi({ go, stage, guest }) {
  const A = APARTMENT;
  const { t, tData } = useLang();
  const tPicks = tData('todayPicks') || [];
  const tPick = (p) => tPicks.find(x => x.id === p.id) || {};
  const name = guest?.firstName || A.guest.firstName;
  const nights = guest?.nights || A.guest.nights;
  const nightsLabel = nights === 1 ? t('home.nights_one') : t('home.nights_many');

  const heroByStage = {
    pre:  { tag: t('home.pre.tag'),  title: t('home.pre.title'), sub: t('home.pre.sub'), cta: t('home.pre.cta'), action: () => go("arrival_checkin") },
    stay: { tag: guest?.demo ? t('home.demo.tag') : t('home.stay.tag'),
            title: guest?.demo ? t('home.demo.title') : t('home.stay.title'),
            sub: guest?.demo ? t('home.demo.sub') : t('home.stay.sub'),
            cta: guest?.demo ? t('home.demo.cta') : t('home.stay.cta'),
            action: () => go(guest?.demo ? "house" : "tip") },
    out:  { tag: t('home.out.tag'), title: t('home.out.title'), sub: t('home.out.sub'), cta: t('home.out.cta'), action: () => go("checkout") },
  };
  const hero = heroByStage[stage] || heroByStage.stay;

  return (
    <div className="screen-scroll" style={{ paddingBottom: 110 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "max(44px, calc(env(safe-area-inset-top, 0px) + 12px)) 20px 0" }}>
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
      <div style={{ padding: "12px 20px 0" }}>
        {!guest?.demo && (
          <div className="t-13 w-600 muted" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t('home.city')} · {nights} {nightsLabel}
          </div>
        )}
        <div className="serif" style={{ fontSize: 38, lineHeight: 1, marginTop: guest?.demo ? 0 : 10, letterSpacing: -0.03 }}>
          {t('home.greeting')} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{name}</em>.
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

      {/* Quick commands — 2x2 grid */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <QuickTile icon={<IconWifi size={22}/>}  label={t('home.tile.wifi.label')}    sub={t('home.tile.wifi.sub')}    onClick={() => go("wifi")} />
          <QuickTile icon={<IconKey size={22}/>}    label={t('home.tile.arrival.label')} sub={t('home.tile.arrival.sub')} onClick={() => go("arrival_checkin")} />
          <QuickTile icon={<IconBook size={22}/>}   label={t('home.tile.house.label')}   sub={t('home.tile.house.sub')}   onClick={() => go("house")} />
          <QuickTile
            icon={stage === "out" ? <IconHeart size={22}/> : <IconStar size={22}/>}
            label={stage === "out" ? t('home.tile.goodbye.label') : t('home.tile.coupons.label')}
            sub={stage === "out" ? t('home.tile.goodbye.sub') : t('home.tile.coupons.sub')}
            onClick={() => go(stage === "out" ? "goodbye" : "coupons")} />
        </div>
      </div>

      {/* Today in the city */}
      <div style={{ padding: "26px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{t('home.today')}</div>
        <button onClick={() => go("places")} className="t-13 w-600" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
          {t('home.all')}
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4, scrollSnapType: "x mandatory", scrollPaddingLeft: 20 }}>
        {TODAY_PICKS.map(p => {
          const tp = tPick(p)
          return (
            <div key={p.id} onClick={() => go("place", p)}
              style={{
                minWidth: 220, scrollSnapAlign: "start",
                borderRadius: 22, overflow: "hidden", background: "var(--surface)",
                boxShadow: "0 8px 24px rgba(26,25,22,0.06)", cursor: "pointer",
              }}>
              <div style={{
                height: 120, position: "relative", overflow: "hidden",
                background: p.tint,
                ...(p.photo && { backgroundImage: `url(${p.photo})`, backgroundSize: "cover", backgroundPosition: "center" }),
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55))",
                }}/>
              </div>
              <div style={{ padding: 14 }}>
                <div className="t-11 w-600" style={{ color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{tp.tag || p.tag}</div>
                <div className="t-15 w-600" style={{ lineHeight: 1.3 }}>{tp.title || p.title}</div>
                <div className="t-12 muted" style={{ marginTop: 4, lineHeight: 1.4 }}>{tp.sub || p.sub}</div>
                <div className="t-11 muted" style={{ marginTop: 8 }}>{tp.meta || p.meta}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Moorent sponsor banner */}
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
              {t('home.moorent.sub')}
            </div>
            <div className="t-15 w-600" style={{ marginTop: 3, lineHeight: 1.3 }}>
              {t('home.moorent.discover')} <span style={{ color: "#f3dfd9" }}>{A.pmName}</span>
            </div>
          </div>
          <IconChevronR size={18} stroke={2.5} style={{ position: "relative", opacity: 0.7, flexShrink: 0 }}/>
        </button>
      </div>
    </div>
  );
}
