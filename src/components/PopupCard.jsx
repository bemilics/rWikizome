import { useState } from "react"
import { Analytics } from "../utils/analytics"
import { useGraph } from "../hooks/useGraph"
import ShareCard from "./ShareCard"

const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }

export default function PopupCard({ node, onClose }) {
  const { getPath } = useGraph()
  const [showShare, setShowShare] = useState(false)
  const path = getPath(node.id)

  return (
    <>
      <div
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "24px",
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            border: "1px solid #a2a9b1",
            width: "100%",
            maxWidth: "420px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div style={{
            background: "#f8f9fa",
            borderBottom: "1px solid #a2a9b1",
            padding: "6px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ ...wp, fontSize: "13px", fontWeight: "bold", color: "#202122" }}>{node.title}</span>
            <span style={{ ...wp, fontSize: "11px", color: "#54595d" }}>Wikipedia article summary</span>
          </div>

          <div style={{ padding: "12px 14px" }}>
            <p style={{ ...wp, fontSize: "13px", lineHeight: "1.7", color: "#202122" }}>
              {node.summary ?? "Loading..."}
            </p>
          </div>

          <div style={{
            borderTop: "1px solid #a2a9b1",
            padding: "6px 12px",
            background: "#f8f9fa",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
          }}>
            {path.length > 1 && (
              <span
                onClick={() => setShowShare(true)}
                style={{ ...wp, fontSize: "11px", color: "#0645ad", textDecoration: "underline", cursor: "pointer" }}
              >
                Share path
              </span>
            )}
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => Analytics.wikipediaOpened(node.title)}
              style={{ ...wp, fontSize: "11px", color: "#0645ad", textDecoration: "underline" }}
            >
              Open in Wikipedia
            </a>
            <button
              onClick={onClose}
              style={{
                ...wp,
                fontSize: "11px",
                background: "#f8f9fa",
                border: "1px solid #a2a9b1",
                padding: "2px 10px",
                color: "#202122",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareCard mode="path" path={path} onClose={() => setShowShare(false)} />
      )}
    </>
  )
}
