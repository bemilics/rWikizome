import { Analytics } from '../utils/analytics'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGraph } from '../hooks/useGraph'
import PopupCard from './PopupCard'

const HOLD_DURATION = 500

export default function Node({ node, style }) {
  const { expandNode, loadSummary, moveNode, expandingId } = useGraph()
  const [showPopup, setShowPopup] = useState(false)

  const holdTimer = useRef(null)
  const didHold = useRef(false)
  const isDragging = useRef(false)
  const isPressed = useRef(false)
  const lastPointer = useRef(null)
  const totalDelta = useRef(0)

  const isExpanding = expandingId === node.id

  const onPressStart = (clientX, clientY) => {
    isPressed.current = true
    didHold.current = false
    isDragging.current = false
    totalDelta.current = 0
    lastPointer.current = { x: clientX, y: clientY }

    holdTimer.current = setTimeout(async () => {
  if (!isDragging.current) {
    didHold.current = true
    Analytics.nodeHold(node.title)
    await loadSummary(node.id)
    setShowPopup(true)
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
      moveNode(node.id, dx, dy)
    }

    lastPointer.current = { x: clientX, y: clientY }
  }

  const onPressEnd = () => {
    if (!isPressed.current) return
    clearTimeout(holdTimer.current)

    if (!isDragging.current && !didHold.current) {
  Analytics.nodeExpanded(node.title)
  expandNode(node.id)
}

    // reset completo
    isPressed.current = false
    isDragging.current = false
    didHold.current = false
    lastPointer.current = null
    totalDelta.current = 0
  }

  const onMouseDown = (e) => {
    e.stopPropagation()
    onPressStart(e.clientX, e.clientY)
  }

  const onMouseMove = (e) => {
    if (!isPressed.current) return
    onPressMove(e.clientX, e.clientY)
  }

  const onMouseUp = (e) => {
    e.stopPropagation()
    onPressEnd()
  }

  const onMouseLeave = () => {
    // si estaba arrastrando, terminar el press al salir
    if (isPressed.current && isDragging.current) {
      onPressEnd()
    }
  }

  const onTouchStart = (e) => {
    e.stopPropagation()
    const t = e.touches[0]
    onPressStart(t.clientX, t.clientY)
  }

  const onTouchMove = (e) => {
    const t = e.touches[0]
    onPressMove(t.clientX, t.clientY)
  }

  const onTouchEnd = (e) => {
    e.stopPropagation()
    onPressEnd()
  }

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
          padding: '8px 12px',
          background: node.expanded ? '#333' : '#222',
          border: node.expanded ? '1px solid #888' : '1px solid #444',
          borderRadius: '8px',
          cursor: isExpanding ? 'wait' : 'pointer',
          userSelect: 'none',
          maxWidth: '140px',
          textAlign: 'center',
          fontSize: '12px',
          lineHeight: '1.3',
          opacity: isExpanding ? 0.6 : 1,
          transition: 'opacity 0.2s, background 0.2s',
        }}
      >
        {isExpanding ? '...' : node.title}
      </div>

      {showPopup && createPortal(
        <PopupCard node={node} onClose={() => setShowPopup(false)} />,
        document.body
      )}
    </>
  )
}