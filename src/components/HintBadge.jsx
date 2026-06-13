import { useEffect, useState } from "react"
import { useGraph } from "../hooks/useGraph"

export default function HintBadge({ node, screenX, screenY, zoom }) {
  const { nodes } = useGraph()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem("rhizopedia_first_expand")
    if (!done) setVisible(true)
  }, [])

  // esconder cuando el grafo tiene más de 1 nodo (primer expand exitoso)
  useEffect(() => {
    if (nodes.length > 1) {
      setVisible(false)
      localStorage.setItem("rhizopedia_first_expand", "1")
    }
  }, [nodes.length])

  if (!visible || zoom < 0.5) return null

  return (
    <div style={{
      position: "absolute",
      left: screenX,
      top: screenY + 32,
      transform: "translateX(-50%)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      pointerEvents: "none",
    }}>
      <div style={{
        width: "1px",
        height: "12px",
        background: "#a2a9b1",
      }} />
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: "10px",
        color: "#54595d",
        background: "#fff",
        border: "1px solid #a2a9b1",
        padding: "2px 8px",
        letterSpacing: "0.05em",
        animation: "pulse-hint 1.5s ease-in-out infinite",
      }}>
        hold to expand
      </div>
      <style>{`
        @keyframes pulse-hint {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
