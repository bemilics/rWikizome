import { useRef } from "react"
import { createPortal } from "react-dom"
import html2canvas from "html2canvas"

const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }
const border = "1px solid #a2a9b1"

function PathCard({ path, cardRef }) {
  const origin = path[0]
  const destination = path[path.length - 1]
  const middle = path.slice(1, -1)

  // distribuir conceptos con ... intercalados si hay muchos
  const buildProse = (nodes) => {
    if (nodes.length === 0) return ''
    if (nodes.length <= 6) return nodes.map(n => n.title).join(' → ')
    // tomar primeros 2, ... del medio, últimos 2
    const first = nodes.slice(0, 2).map(n => n.title)
    const last = nodes.slice(-2).map(n => n.title)
    const midCount = nodes.length - 4
    return [...first, `... (${midCount} more) ...`, ...last].join(' → ')
  }
  const prose = buildProse(middle)

  return (
    <div ref={cardRef} style={{ background: "#fff", width: "300px", border, padding: "0" }}>
      <div style={{ background: "#f8f9fa", borderBottom: border, padding: "6px 12px" }}>
        <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>Rhizopedia — Knowledge Trail</span>
      </div>
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <p style={{ ...wp, fontSize: "10px", color: "#a2a9b1", letterSpacing: "0.08em" }}>STARTED EXPLORING...</p>

        <p style={{ ...wp, fontSize: "22px", fontWeight: "bold", color: "#202122", textAlign: "center", lineHeight: 1.2 }}>
          {origin.title}
        </p>

        {middle.length > 0 && (
          <p style={{
            ...wp,
            fontSize: "13px",
            fontWeight: "bold",
            color: "#a2a9b1",
            textAlign: "center",
            lineHeight: 2,
            padding: "8px 8px",
            borderTop: "1px solid #eaecf0",
            borderBottom: "1px solid #eaecf0",
            width: "100%",
            wordBreak: "break-word",
          }}>
            {prose}
          </p>
        )}

        <p style={{ ...wp, fontSize: "10px", color: "#a2a9b1", letterSpacing: "0.08em" }}>...AND ENDED UP AT</p>

        <p style={{ ...wp, fontSize: "22px", fontWeight: "bold", color: "#0645ad", textAlign: "center", lineHeight: 1.2 }}>
          {destination.title}
        </p>

        <p style={{ ...wp, fontSize: "11px", color: "#54595d" }}>
          {path.length - 1} {path.length - 1 === 1 ? "step" : "steps"} down the rabbit hole
        </p>
      </div>
      <div style={{ borderTop: border, padding: "5px 12px", background: "#f8f9fa" }}>
        <p style={{ ...wp, fontSize: "10px", color: "#a2a9b1", textAlign: "center", letterSpacing: "0.05em" }}>rhizopedia.vercel.app</p>
      </div>
    </div>
  )
}

function SessionCard({ stats, cardRef }) {
  return (
    <div ref={cardRef} style={{ background: "#fff", width: "320px", border }}>
      <div style={{ background: "#f8f9fa", borderBottom: border, padding: "6px 12px" }}>
        <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>Rhizopedia — Session Summary</span>
      </div>
      <div style={{ padding: "16px" }}>
        <p style={{ ...wp, fontSize: "13px", color: "#54595d", marginBottom: "4px" }}>Started at</p>
        <p style={{ ...wp, fontSize: "18px", fontWeight: "bold", color: "#202122", marginBottom: "14px" }}>{stats.root.title}</p>
        <div style={{ borderTop: border, paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
          {[
            ["Concepts explored", stats.totalNodes],
            ["Branches", stats.branches],
            ["Deepest path", `${stats.maxDepth} steps`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...wp, fontSize: "12px", color: "#54595d" }}>{label}</span>
              <span style={{ ...wp, fontSize: "12px", color: "#202122", fontWeight: "bold" }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: border, paddingTop: "10px" }}>
          <p style={{ ...wp, fontSize: "11px", color: "#54595d", marginBottom: "6px", letterSpacing: "0.05em" }}>WTF MOMENT</p>
          <p style={{ ...wp, fontSize: "12px", color: "#202122" }}>{stats.wtfStart.title}</p>
          <p style={{ ...wp, fontSize: "11px", color: "#a2a9b1", margin: "3px 0" }}>↓ {stats.wtfSteps} steps ↓</p>
          <p style={{ ...wp, fontSize: "14px", fontWeight: "bold", color: "#0645ad" }}>{stats.wtfEnd.title}</p>
        </div>
      </div>
      <div style={{ borderTop: border, padding: "5px 12px", background: "#f8f9fa" }}>
        <p style={{ ...wp, fontSize: "10px", color: "#a2a9b1", textAlign: "center", letterSpacing: "0.05em" }}>rhizopedia.vercel.app</p>
      </div>
    </div>
  )
}

export default function ShareCard({ mode, path, stats, onClose }) {
  const cardRef = useRef(null)

  const download = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#fff", scale: 2 })
    const link = document.createElement("a")
    link.download = "rhizopedia.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return createPortal(
    <div
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 300, gap: "12px", padding: "24px" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {mode === "path" && <PathCard path={path} cardRef={cardRef} />}
        {mode === "session" && <SessionCard stats={stats} cardRef={cardRef} />}
      </div>
      <div style={{ display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={download} style={{ ...wp, fontSize: "11px", background: "#f8f9fa", border, padding: "3px 12px", color: "#202122", cursor: "pointer" }}>Download image</button>
        <button onClick={onClose} style={{ ...wp, fontSize: "11px", background: "#f8f9fa", border, padding: "3px 12px", color: "#54595d", cursor: "pointer" }}>Close</button>
      </div>
    </div>,
    document.body
  )
}
