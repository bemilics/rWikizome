import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useGraph } from "../hooks/useGraph"
import { Analytics } from "../utils/analytics"
import PopupCard from "./PopupCard"

const HOLD_DURATION = 600

export default function Node({ node, style, zoom = 1 }) {
  const { expandNode, loadSummary, moveNode, expandingId } = useGraph()
  const [showPopup, setShowPopup] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0) // 0-1

  const holdTimer = useRef(null)
  const progressTimer = useRef(null)
  const didHold = useRef(false)
  const isDragging = useRef(false)
  const isPressed = useRef(false)
  const lastPointer = useRef(null)
  const totalDelta = useRef(0)
  const pressStart = useRef(0)

  const isExpanding = expandingId === node.id

  const startProgressAnimation = () => {
    pressStart.current = Date.now()
    setHoldProgress(0)

    // vibración inicial al empezar el hold
    if (navigator.vibrate) navigator.vibrate(10)

    const DELAY = 150 // ms antes de que empiece a moverse el anillo
    const tick = () => {
      const elapsed = Math.max(0, Date.now() - pressStart.current - DELAY)
      const progress = Math.min(elapsed / HOLD_DURATION, 1)
      setHoldProgress(progress)

      // haptic feedback progresivo
      if (navigator.vibrate) {
        if (progress > 0.33 && progress < 0.36) navigator.vibrate(15)
        if (progress > 0.66 && progress < 0.69) navigator.vibrate(20)
        if (progress >= 1) navigator.vibrate([30, 20, 60]) // patrón final
      }

      if (progress < 1) {
        progressTimer.current = requestAnimationFrame(tick)
      }
    }
    progressTimer.current = requestAnimationFrame(tick)
  }

  const stopProgressAnimation = () => {
    cancelAnimationFrame(progressTimer.current)
    setHoldProgress(0)
  }

  const onPressStart = (clientX, clientY) => {
    isPressed.current = true
    didHold.current = false
    isDragging.current = false
    totalDelta.current = 0
    lastPointer.current = { x: clientX, y: clientY }
    startProgressAnimation()

    holdTimer.current = setTimeout(async () => {
      if (!isDragging.current) {
        didHold.current = true
        stopProgressAnimation()
        Analytics.nodeExpanded(node.title)
        expandNode(node.id)
      }
    }, HOLD_DURATION)
  }

  const onPressMove = (clientX, clientY) => {
    if (!isPressed.current || !lastPointer.current) return
    const dx = clientX - lastPointer.current.x
    const dy = clientY - lastPointer.current.y
    totalDelta.current += Math.abs(dx) + Math.abs(dy)
    if (totalDelta.current > 5) {
      isDragging.current = true
      clearTimeout(holdTimer.current)
      stopProgressAnimation()
      moveNode(node.id, dx / zoom, dy / zoom)  // zoom compensa la escala del contenedor
    }
    lastPointer.current = { x: clientX, y: clientY }
  }

  const onPressEnd = async () => {
    if (!isPressed.current) return
    clearTimeout(holdTimer.current)
    stopProgressAnimation()

    if (!isDragging.current && !didHold.current) {
      Analytics.nodeHold(node.title)
      await loadSummary(node.id)
      setShowPopup(true)
    }

    isPressed.current = false
    isDragging.current = false
    didHold.current = false
    lastPointer.current = null
    totalDelta.current = 0
  }

  const onMouseDown = (e) => { e.stopPropagation(); onPressStart(e.clientX, e.clientY) }
  const onMouseMove = (e) => { if (!isPressed.current) return; onPressMove(e.clientX, e.clientY) }
  const onMouseUp = (e) => { e.stopPropagation(); onPressEnd() }
  const onMouseLeave = () => { if (isPressed.current && isDragging.current) onPressEnd() }
  const onTouchStart = (e) => { e.stopPropagation(); const t = e.touches[0]; onPressStart(t.clientX, t.clientY) }
  const onTouchMove = (e) => { const t = e.touches[0]; onPressMove(t.clientX, t.clientY) }
  const onTouchEnd = (e) => { e.stopPropagation(); onPressEnd() }

  // SVG circle progress
  const R = 22
  const CIRC = 2 * Math.PI * R
  const strokeDash = holdProgress * CIRC

  return (
    <>
      <div
        data-node
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          ...style,
          padding: zoom > 0.35 ? "5px 10px" : "3px 6px",
          background: node.expanded
            ? "#f0fff0"
            : node.visited
            ? "#eaf3fb"
            : "#ffffff",
          border: node.expanded
            ? "1px solid #72aa72"
            : "1px solid #a2a9b1",
          borderRadius: "0px",
          cursor: isExpanding ? "wait" : "pointer",
          userSelect: "none",
          maxWidth: zoom > 0.35 ? "160px" : "40px",
          minWidth: zoom > 0.15 ? "auto" : "8px",
          minHeight: zoom > 0.15 ? "auto" : "8px",
          textAlign: "center",
          fontSize: "12px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: "1.4",
          color: node.expanded
            ? "#006400"
            : node.visited
            ? "#0b0080"
            : "#0645ad",
          textDecoration: node.expanded || node.visited ? "none" : "underline",
          opacity: isExpanding ? 0.6 : 1,
          transition: "opacity 0.2s, background 0.2s, max-width 0.1s",
          position: "absolute",
          boxShadow: "none",
          overflow: "hidden",
          whiteSpace: zoom > 0.35 ? "normal" : "nowrap",
        }}
      >
        {zoom > 0.35
          ? (isExpanding ? "..." : node.title)
          : null
        }

        {/* progress ring — solo visible mientras se hace hold */}
        {holdProgress > 0 && (
          <svg
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-90deg)",
              pointerEvents: "none",
            }}
            width={R * 2 + 6}
            height={R * 2 + 6}
            viewBox={`0 0 ${R * 2 + 6} ${R * 2 + 6}`}
          >
            <circle
              cx={R + 3}
              cy={R + 3}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
            <circle
              cx={R + 3}
              cy={R + 3}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeDasharray={`${strokeDash} ${CIRC}`}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {showPopup && createPortal(
        <PopupCard node={node} onClose={() => setShowPopup(false)} />,
        document.body
      )}
    </>
  )
}
