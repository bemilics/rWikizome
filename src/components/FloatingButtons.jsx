import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"
import InfoPopup from "./InfoPopup"
import SearchBar from "./SearchBar"
import ShareCard from "./ShareCard"

export default function FloatingButtons() {
  const { init, getSessionStats } = useGraph()
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSessionShare, setShowSessionShare] = useState(false)

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
        position: "fixed", top: "16px", right: "16px",
        display: "flex", gap: "8px", zIndex: 150,
      }}>
        <button style={btnStyle} onClick={() => { Analytics.graphReset(); init() }} title="Reset">↺</button>
        <button style={btnStyle} onClick={() => setShowSessionShare(true)} title="Share session">↗</button>
        <button style={btnStyle} onClick={() => setShowSearch(true)} title="Search">⌕</button>
        <button style={btnStyle} onClick={() => setShowInfo(true)} title="Info">i</button>
      </div>

      {showSessionShare && (
        <ShareCard
          mode="session"
          stats={getSessionStats()}
          onClose={() => setShowSessionShare(false)}
        />
      )}

      {showSearch && createPortal(
        <SearchBar onClose={() => setShowSearch(false)} />,
        document.body
      )}

      {showInfo && createPortal(
        <InfoPopup onClose={() => { Analytics.infoPopupClosed(); setShowInfo(false) }} />,
        document.body
      )}
    </>
  )
}
