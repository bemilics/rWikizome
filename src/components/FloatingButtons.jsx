import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"
import InfoPopup from "./InfoPopup"
import SearchBar from "./SearchBar"
import ShareCard from "./ShareCard"
import MapShareCard from "./MapShareCard"

export default function FloatingButtons() {
  const { init, getSessionStats } = useGraph()
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSessionShare, setShowSessionShare] = useState(false)
  const [showMapShare, setShowMapShare] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef(null)

  useEffect(() => {
    const visited = localStorage.getItem("rhizopedia_visited")
    if (!visited) setShowInfo(true)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("touchstart", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("touchstart", handleClick)
    }
  }, [])

  const handleInfoClose = () => {
    localStorage.setItem("rhizopedia_visited", "1")
    setShowInfo(false)
    setShowSearch(true)
  }

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
    whiteSpace: "nowrap",
  }

  const menuItemStyle = {
    display: "block",
    width: "100%",
    padding: "5px 12px",
    background: "#fff",
    border: "none",
    borderBottom: "1px solid #eaecf0",
    color: "#0645ad",
    fontSize: "11px",
    fontFamily: "Georgia, serif",
    textDecoration: "underline",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
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
        <button style={btnStyle} onClick={() => { Analytics.graphRandom(); init() }}>Random</button>

        <div ref={shareMenuRef} style={{ position: "relative" }}>
          <button
            style={btnStyle}
            onClick={() => setShowShareMenu(v => !v)}
          >
            Share {showShareMenu ? "▴" : "▾"}
          </button>
          {showShareMenu && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "#fff",
              border: "1px solid #a2a9b1",
              zIndex: 160,
              minWidth: "140px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}>
              <button style={menuItemStyle} onClick={() => { setShowShareMenu(false); setShowSessionShare(true) }}>
                Share session
              </button>
              <button style={{ ...menuItemStyle, borderBottom: "none" }} onClick={() => { setShowShareMenu(false); setShowMapShare(true) }}>
                Share map
              </button>
            </div>
          )}
        </div>

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

      {showMapShare && (
        <MapShareCard onClose={() => setShowMapShare(false)} />
      )}

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
        <InfoPopup onClose={handleInfoClose} />,
        document.body
      )}
    </>
  )
}
