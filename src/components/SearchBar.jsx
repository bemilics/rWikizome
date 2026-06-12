import { useState } from "react"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"

const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }

export default function SearchBar({ onClose }) {
  const { initWithTitle, init } = useGraph()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async (q) => {
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=5&namespace=0&format=json&origin=*`)
      const data = await res.json()
      setResults(data[1] ?? [])
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  const pick = (title) => {
    Analytics.graphSearch(title)
    initWithTitle(title)
    onClose()
  }

  const handleCancel = () => {
    init()
    onClose()
  }

  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 200, padding: "60px 24px 24px" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", border: "1px solid #a2a9b1", width: "100%", maxWidth: "420px" }}>
        <div style={{ background: "#f8f9fa", borderBottom: "1px solid #a2a9b1", padding: "6px 12px" }}>
          <span style={{ ...wp, fontSize: "13px", fontWeight: "bold", color: "#202122" }}>Search Wikipedia</span>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search a concept..."
            style={{ ...wp, width: "100%", border: "1px solid #a2a9b1", padding: "4px 8px", fontSize: "13px", color: "#202122", outline: "none", background: "#fff" }}
          />
          {loading && <p style={{ ...wp, fontSize: "12px", color: "#54595d", padding: "4px 0" }}>Searching...</p>}
          {results.map((title) => (
            <div
              key={title}
              onClick={() => pick(title)}
              style={{ ...wp, fontSize: "13px", color: "#0645ad", textDecoration: "underline", padding: "5px 4px", cursor: "pointer", borderTop: "1px solid #eaecf0" }}
            >
              {title}
            </div>
          ))}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p style={{ ...wp, fontSize: "12px", color: "#54595d", padding: "4px 0" }}>No results found.</p>
          )}
        </div>
        <div style={{ borderTop: "1px solid #a2a9b1", padding: "6px 12px", background: "#f8f9fa", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleCancel} style={{ ...wp, fontSize: "11px", background: "#f8f9fa", border: "1px solid #a2a9b1", padding: "2px 10px", color: "#202122", cursor: "pointer" }}>Random article</button>
        </div>
      </div>
    </div>
  )
}
