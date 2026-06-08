import { Analytics } from '../utils/analytics'
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useGraph } from "../hooks/useGraph"
import InfoPopup from "./InfoPopup"

export default function FloatingButtons() {
  const { init } = useGraph()
  const [showInfo, setShowInfo] = useState(false)

  // mostrar en la primera visita
  useEffect(() => {
    const visited = localStorage.getItem("rwikizome_visited")
    if (!visited) {
      setShowInfo(true)
      localStorage.setItem("rwikizome_visited", "1")
    }
  }, [])

  const btnStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#222",
    border: "1px solid #444",
    color: "#eee",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }

  return (
    <>
      <div style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        display: "flex",
        gap: "8px",
        zIndex: 150,
      }}>
        <button
          style={btnStyle}
          onClick={() => init()}
          title="Reset"
          onClick={() => { Analytics.graphReset(); init() }}
        >
          ↺
        </button>
        <button
          style={btnStyle}
          onClick={() => setShowInfo(true)}
          title="Info"
          InfoPopup onClose={() => { Analytics.infoPopupClosed(); setShowInfo(false) }}
        >
          i
        </button>
      </div>

      {showInfo && createPortal(
        <InfoPopup onClose={() => setShowInfo(false)} />,
        document.body
      )}
    </>
  )
}
