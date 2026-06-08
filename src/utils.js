// Stage computation (centralised — also used in Login and Settings)
export function computeStage(checkin, checkout) {
  if (!checkin || !checkout) return 'stay'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d1 = new Date(checkin); d1.setHours(0, 0, 0, 0)
  const d2 = new Date(checkout); d2.setHours(0, 0, 0, 0)
  if (today < d1) return 'pre'
  if (today >= d2) return 'out'
  return 'stay'
}

// Context within a stay — tells components where we are in the trip
export function stayContext(checkin, checkout) {
  if (!checkin || !checkout) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d1 = new Date(checkin); d1.setHours(0, 0, 0, 0)
  const d2 = new Date(checkout); d2.setHours(0, 0, 0, 0)
  return {
    isFirstDay:      today.getTime() === d1.getTime(),
    isCheckoutDay:   today.getTime() === d2.getTime(),
    daysToCheckout:  Math.round((d2 - today) / 86400000),
    totalNights:     Math.max(1, Math.round((d2 - d1) / 86400000)),
  }
}

// Favorites helpers
const FAV_STORAGE = "elegant-loft-favorites"
export function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_STORAGE) || "[]") } catch { return [] }
}
export function toggleFavorite(id) {
  const favs = loadFavorites()
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
  try { localStorage.setItem(FAV_STORAGE, JSON.stringify(next)) } catch {}
  return next
}

// Itinerary helpers
const ITIN_STORAGE = "elegant-loft-itineraries"
export function loadItineraries() {
  try { return JSON.parse(localStorage.getItem(ITIN_STORAGE) || "[]") } catch { return [] }
}
export function saveItinerary(itin) {
  const list = loadItineraries()
  list.unshift({ ...itin, id: Date.now().toString(), savedAt: new Date().toISOString() })
  try { localStorage.setItem(ITIN_STORAGE, JSON.stringify(list.slice(0, 30))) } catch {}
  return list
}
export function deleteItinerary(id) {
  const list = loadItineraries().filter(i => i.id !== id)
  try { localStorage.setItem(ITIN_STORAGE, JSON.stringify(list)) } catch {}
  return list
}

// Canvas helpers for coupon image generation
export function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = String(text).split(" ")
  let line = ""
  let yy = y
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " "
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, yy)
      line = words[i] + " "
      yy += lineH
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, yy)
}
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
