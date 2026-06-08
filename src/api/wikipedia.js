const WP_REST = 'https://en.wikipedia.org/api/rest_v1'
const WP_API = 'https://en.wikipedia.org/w/api.php'
const PAGEVIEWS = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents'

// fechas fijas del mes pasado para evitar bugs de formato
function getLastMonthDates() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() // 0-indexed
  // primer y último día del mes anterior
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 0) // último día del mes anterior
  const fmt = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return { start: fmt(start), end: fmt(end) }
}

export async function getRandomArticle() {
  const res = await fetch(`${WP_REST}/page/random/summary`)
  const data = await res.json()
  return {
    id: data.title,
    title: data.title,
    summary: data.extract,
    url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
  }
}

export async function getArticleSummary(title) {
  const res = await fetch(`${WP_REST}/page/summary/${encodeURIComponent(title)}`)
  const data = await res.json()
  return {
    id: data.title,
    title: data.title,
    summary: data.extract,
    url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
  }
}

export async function getArticleLinks(title, limit = 10) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'links',
    titles: title,
    pllimit: limit,
    plnamespace: 0,
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`${WP_API}?${params}`)
  if (!res.ok) throw new Error(`Links fetch failed: ${res.status}`)
  const data = await res.json()
  const pages = Object.values(data.query.pages)
  const links = pages[0]?.links ?? []
  return links.map((l) => l.title)
}

export async function getChildNodes(parentTitle) {
  const links = await getArticleLinks(parentTitle, 10)
  if (links.length < 3) {
    return links.slice(0, 3).map((title) => ({ id: title, title }))
  }
  // primero, medio y último — sin pageviews, instantáneo
  const first = links[0]
  const mid = links[Math.floor((links.length - 1) / 2)]
  const last = links[links.length - 1]
  const chosen = [...new Map([[first, first], [mid, mid], [last, last]]).keys()]
  return chosen.slice(0, 3).map((title) => ({ id: title, title }))
}