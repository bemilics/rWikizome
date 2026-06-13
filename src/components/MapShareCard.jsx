import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import html2canvas from "html2canvas"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"

const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }
const border = "1px solid #a2a9b1"

export default function MapShareCard({ onClose }) {
  const { nodes, fitView, getSessionStats } = useGraph()
  const [capturing, setCapturing] = useState(false)
  const [preview, setPreview] = useState(null)
  const stats = getSessionStats()

  const capture = async () => {
    setCapturing(true)
    fitView()
    await new Promise(r => setTimeout(r, 500))

    const canvasEl = document.querySelector("[data-canvas]")
    if (!canvasEl) { setCapturing(false); return }

    const bitmap = await html2canvas(canvasEl, {
      backgroundColor: "#f8f9fa",
      scale: 1.5,
      useCORS: true,
      logging: false,
    })

    const ctx = bitmap.getContext("2d")
    ctx.font = "13px Georgia, serif"
    ctx.fillStyle = "rgba(84,89,93,0.9)"
    ctx.textAlign = "right"
    ctx.fillText("rhizopedia.vercel.app", bitmap.width - 12, bitmap.height - 12)
    ctx.textAlign = "left"
    ctx.fillText(
      stats ? `${stats.totalNodes} concepts · started at ${stats.root.title}` : `${nodes.length} concepts`,
      12,
      bitmap.height - 12
    )

    setPreview(bitmap.toDataURL("image/png"))
    setCapturing(false)
    Analytics.shareSessionDownloaded(nodes.length)
  }

  const download = () => {
    if (!preview) return
    const link = document.createElement("a")
    link.download = "rhizopedia-map.png"
    link.href = preview
    link.click()
  }

  return createPortal(
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100dvh",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: "32px 16px 16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          border,
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100dvh - 80px)",
        }}
      >
        <div style={{
          background: "#f8f9fa", borderBottom: border,
          padding: "6px 12px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ ...wp, fontSize: "13px", fontWeight: "bold", color: "#202122" }}>Share map</span>
          <button onClick={onClose} style={{ ...wp, fontSize: "11px", background: "none", border: "none", color: "#54595d", cursor: "pointer" }}>× close</button>
        </div>

        {stats && (
          <div style={{ padding: "10px 12px", borderBottom: border, display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
              <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>Origin:</span>
              <span style={{ ...wp, fontSize: "12px", fontWeight: "bold", color: "#202122" }}>{stats.root.title}</span>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>{stats.totalNodes} concepts explored</span>
              <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>{stats.branches} branches</span>
              <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>deepest: {stats.maxDepth}</span>
            </div>
          </div>
        )}

        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flexGrow: 1 }}>
          {!preview && !capturing && (
            <p style={{ ...wp, fontSize: "12px", color: "#54595d", lineHeight: 1.6 }}>
              Capture your entire knowledge map. The view will automatically fit to show all explored concepts.
            </p>
          )}
          {capturing && (
            <p style={{ ...wp, fontSize: "12px", color: "#54595d", textAlign: "center", padding: "20px 0" }}>
              Capturing map...
            </p>
          )}
          {preview && (
            <img src={preview} alt="Map preview" style={{ width: "100%", border }} />
          )}
        </div>

        <div style={{
          borderTop: border, padding: "6px 12px",
          background: "#f8f9fa", display: "flex",
          justifyContent: "flex-end", gap: "6px",
          flexShrink: 0,
        }}>
          {preview ? (
            <button
              onClick={download}
              style={{ ...wp, fontSize: "11px", background: "#202122", border: "1px solid #202122", padding: "2px 14px", color: "#fff", cursor: "pointer" }}
            >Download</button>
          ) : (
            <button
              onClick={capture}
              disabled={capturing}
              style={{ ...wp, fontSize: "11px", background: capturing ? "#a2a9b1" : "#202122", border: "1px solid #202122", padding: "2px 14px", color: "#fff", cursor: capturing ? "not-allowed" : "pointer" }}
            >Capture map</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
