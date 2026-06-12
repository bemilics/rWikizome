import { useRef, useState, useEffect } from "react"
import { useGraph } from "../hooks/useGraph"
import Node from "./Node"
import Edge from "./Edge"

const MIN_ZOOM = 0.3
const MAX_ZOOM = 1.0
const ZOOM_STEP = 0.15

export default function Canvas() {
  const { nodes, edges, init } = useGraph()
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const isPanning = useRef(false)
  const lastPointer = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => { init() }, [])

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  // zoom con scroll de mouse
  const onWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((z) => clampZoom(z + delta))
  }

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const onMouseDown = (e) => {
    if (e.target.closest("[data-node]")) return
    isPanning.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = (e) => {
    if (!isPanning.current || !lastPointer.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    lastPointer.current = { x: e.clientX, y: e.clientY }
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
  }

  const onMouseUp = () => {
    isPanning.current = false
    lastPointer.current = null
  }

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return
    if (e.target.closest("[data-node]")) return
    isPanning.current = true
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchMove = (e) => {
    if (!isPanning.current || e.touches.length !== 1 || !lastPointer.current) return
    const dx = e.touches[0].clientX - lastPointer.current.x
    const dy = e.touches[0].clientY - lastPointer.current.y
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
  }

  const onTouchEnd = () => {
    isPanning.current = false
    lastPointer.current = null
  }

  const screenCenterX = window.innerWidth / 2
  const screenCenterY = window.innerHeight / 2

  const toScreen = (pos) => ({
    x: screenCenterX + (pos.x + pan.x) * zoom,
    y: screenCenterY + (pos.y + pan.y) * zoom,
  })

  return (
    <div
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", cursor: "grab" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* botones de zoom */}
      <div style={{ position: "fixed", bottom: "16px", right: "16px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 150 }}>
        <button
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          disabled={zoom >= MAX_ZOOM}
          style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#222", border: "1px solid #444", color: "#eee", fontSize: "18px", cursor: zoom >= MAX_ZOOM ? "not-allowed" : "pointer", opacity: zoom >= MAX_ZOOM ? 0.4 : 1 }}
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          disabled={zoom <= MIN_ZOOM}
          style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#222", border: "1px solid #444", color: "#eee", fontSize: "18px", cursor: zoom <= MIN_ZOOM ? "not-allowed" : "pointer", opacity: zoom <= MIN_ZOOM ? 0.4 : 1 }}
        >
          −
        </button>
      </div>

      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          const a = toScreen(from.position)
          const b = toScreen(to.position)
          return <Edge key={`${edge.from}-${edge.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        })}
      </svg>

      {nodes.map((node) => {
        const pos = toScreen(node.position)
        return (
          <Node
            key={node.id}
            node={node}
            zoom={zoom}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          />
        )
      })}
    </div>
  )
}
