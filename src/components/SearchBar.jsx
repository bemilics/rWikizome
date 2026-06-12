import { useState } from "react"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"

export default function SearchBar({ onClose }) {
  const { initWithTitle } = useGraph()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async (q) => {
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=5&namespace=0&format=json&origin=*`
      )
      const data = await res.json()
      setResults(data[1] ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const pick = (title) => {
    Analytics.graphReset()
    initWithTitle(title)
    onClose()
  }

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 200, padding: "60px 24px 24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a1a", border: "1px solid #444",
          borderRadius: "12px", padding: "16px",
          width: "100%", maxWidth: "400px",
          display: "flex", flexDirection: "column", gap: "8px",
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="Search a concept..."
          style={{
            background: "#111", border: "1px solid #555",
            borderRadius: "8px", padding: "10px 12px",
            color: "#eee", fontSize: "14px", outline: "none",
            width: "100%",
          }}
        />
        {loading && (
          <p style={{ fontSize: "12px", color: "#666", padding: "4px 2px" }}>Searching...</p>
        )}
        {results.map((title) => (
          <button
            key={title}
            onClick={() => pick(title)}
            style={{
              background: "#222", border: "1px solid #444",
              borderRadius: "8px", padding: "10px 12px",
              color: "#eee", fontSize: "13px",
              textAlign: "left", cursor: "pointer",
            }}
          >
            {title}
          </button>
        ))}
        {!loading && query.length >= 2 && results.length === 0 && (
          <p style={{ fontSize: "12px", color: "#666", padding: "4px 2px" }}>No results found.</p>
        )}
      </div>
    </div>
  )
}
