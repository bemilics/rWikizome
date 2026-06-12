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
    const visited = localStorage.getItem("rhizopedia_visited")
    if (!visited) {
      setShowInfo(true)
      localStorage.setItem("rhizopedia_visited", "1")
    }
  }, [])

  const btnStyle = {
    padding: "2px 10px",
    background: "#f8f9fa",
    border: "1px solid #a2a9b1",
    borderBottom: "none",
    color: "#0645ad",
    fontSize: "11px",
    fontFamily: "Georgia, serif",
    textDecoration: "underline",
    cursor: "pointer",
    borderRadius: "3px 3px 0 0",
  }

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        right: "16px",
        display: "flex",
        gap: "2px",
        zIndex: 150,
        alignItems: "flex-end",
      }}>
        <button style={btnStyle} onClick={() => { Analytics.graphReset(); init() }}>Reset</button>
        <button style={btnStyle} onClick={() => setShowSessionShare(true)}>Share session</button>
        <button style={btnStyle} onClick={() => setShowSearch(true)}>Search</button>
        <button style={btnStyle} onClick={() => setShowInfo(true)}>Help</button>
      </div>

      <div style={{
        position: "fixed",
        top: "25px",
        left: 0,
        right: 0,
        height: "1px",
        background: "#a2a9b1",
        zIndex: 149,
      }} />

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
