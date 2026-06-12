import { useRef } from "react"
import { createPortal } from "react-dom"
import html2canvas from "html2canvas"

function PathCard({ path, cardRef }) {
  const origin = path[0]
  const destination = path[path.length - 1]
  const middle = path.slice(1, -1)

  return (
    <div
      ref={cardRef}
      style={{
        background: "#111",
        width: "320px",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ fontSize: "11px", color: "#555", letterSpacing: "0.15em", marginBottom: "8px" }}>RWIKIZOME</p>

      <p style={{
        fontSize: "22px", fontWeight: 700,
        color: "#eee", textAlign: "center",
        lineHeight: 1.2,
      }}>
        {origin.title}
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", margin: "8px 0" }}>
        {middle.map((node, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <p style={{ fontSize: "11px", color: "#444", textAlign: "center" }}>↓</p>
            <p style={{ fontSize: "11px", color: "#555", textAlign: "center" }}>{node.title}</p>
          </div>
        ))}
        <p style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>↓</p>
      </div>

      <p style={{
        fontSize: "22px", fontWeight: 700,
        color: "#4a8ab5", textAlign: "center",
        lineHeight: 1.2,
      }}>
        {destination.title}
      </p>

      <p style={{ fontSize: "12px", color: "#555", marginTop: "12px" }}>
        {path.length - 1} {path.length - 1 === 1 ? "step" : "steps"} apart
      </p>

      <p style={{ fontSize: "10px", color: "#333", marginTop: "4px", letterSpacing: "0.1em" }}>
        rwikizome.vercel.app
      </p>
    </div>
  )
}

function SessionCard({ stats, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        background: "#111",
        width: "320px",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ fontSize: "11px", color: "#555", letterSpacing: "0.15em" }}>RWIKIZOME</p>
      <p style={{ fontSize: "13px", color: "#666", letterSpacing: "0.1em" }}>MY RABBIT HOLE</p>

      <p style={{ fontSize: "22px", fontWeight: 700, color: "#eee", textAlign: "center", lineHeight: 1.2, marginTop: "4px" }}>
        {stats.root.title}
      </p>

      <div style={{ width: "100%", borderTop: "1px solid #222", margin: "4px 0" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "#555" }}>Concepts explored</p>
          <p style={{ fontSize: "12px", color: "#eee", fontWeight: 600 }}>{stats.totalNodes}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "#555" }}>Branches</p>
          <p style={{ fontSize: "12px", color: "#eee", fontWeight: 600 }}>{stats.branches}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "#555" }}>Deepest path</p>
          <p style={{ fontSize: "12px", color: "#eee", fontWeight: 600 }}>{stats.maxDepth} steps</p>
        </div>
      </div>

      <div style={{ width: "100%", borderTop: "1px solid #222", margin: "4px 0" }} />

      <p style={{ fontSize: "11px", color: "#555", letterSpacing: "0.08em" }}>WTF MOMENT</p>
      <p style={{ fontSize: "13px", color: "#888", textAlign: "center" }}>{stats.wtfStart.title}</p>
      <p style={{ fontSize: "11px", color: "#444" }}>↓ {stats.wtfSteps} steps ↓</p>
      <p style={{ fontSize: "16px", fontWeight: 700, color: "#4a8ab5", textAlign: "center" }}>{stats.wtfEnd.title}</p>

      <div style={{ width: "100%", borderTop: "1px solid #222", margin: "4px 0" }} />

      <p style={{ fontSize: "10px", color: "#333", letterSpacing: "0.1em" }}>rwikizome.vercel.app</p>
    </div>
  )
}

export default function ShareCard({ mode, path, stats, onClose }) {
  const cardRef = useRef(null)

  const download = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#111",
      scale: 2,
    })
    const link = document.createElement("a")
    link.download = "rwikizome.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return createPortal(
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.8)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 300, gap: "16px", padding: "24px",
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {mode === "path" && <PathCard path={path} cardRef={cardRef} />}
        {mode === "session" && <SessionCard stats={stats} cardRef={cardRef} />}
      </div>

      <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={download}
          style={{
            padding: "10px 20px", background: "#eee",
            border: "none", borderRadius: "8px",
            color: "#111", fontSize: "13px",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          Download image
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px", background: "transparent",
            border: "1px solid #555", borderRadius: "8px",
            color: "#aaa", fontSize: "13px", cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
