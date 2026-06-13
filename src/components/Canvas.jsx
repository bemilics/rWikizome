import { useRef, useState, useEffect } from "react"
import { useGraph } from "../hooks/useGraph"
import Node from "./Node"
import Edge from "./Edge"
import HintBadge from "./HintBadge"

const MIN_ZOOM = 0.05
const MAX_ZOOM = 1.0
const ZOOM_STEP = 0.1

export default function Canvas() {
  const { nodes, edges, init, setResetViewCallback, loadFromStorage } = useGraph()
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const isPanning = useRef(false)
  const lastPointer = useRef(null)
  const lastPinchDist = useRef(null)
  const canvasRef = useRef(null)

  const resetViewRef = useRef(null)
  resetViewRef.current = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  useEffect(() => {
    setResetViewCallback(() => resetViewRef.current())
    const restored = loadFromStorage()
    if (!restored) init()
  }, [])

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const onWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((z) => clampZoom(z + delta))
  }

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    const blockPinch = (e) => { if (e.touches.length > 1) e.preventDefault() }
    el.addEventListener("touchmove", blockPinch, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("touchmove", blockPinch)
    }
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
    setPan((p) => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }))
  }

  const onMouseUp = () => {
    isPanning.current = false
    lastPointer.current = null
  }

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      isPanning.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy)
      return
    }
    if (e.touches.length !== 1) return
    if (e.target.closest("[data-node]")) return
    isPanning.current = true
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (lastPinchDist.current !== null) {
        const delta = (dist - lastPinchDist.current) * 0.005
        setZoom((z) => clampZoom(z + delta))
      }
      lastPinchDist.current = dist
      return
    }
    if (!isPanning.current || e.touches.length !== 1 || !lastPointer.current) return
    const dx = e.touches[0].clientX - lastPointer.current.x
    const dy = e.touches[0].clientY - lastPointer.current.y
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setPan((p) => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }))
  }

  const onTouchEnd = () => {
    isPanning.current = false
    lastPointer.current = null
    lastPinchDist.current = null
  }

  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2

  return (
    <div
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", cursor: "grab", background: "#f8f9fa" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* SVG de edges — cubre toda la pantalla, coordenadas de pantalla */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          const x1 = cx + (from.position.x + pan.x) * zoom
          const y1 = cy + (from.position.y + pan.y) * zoom
          const x2 = cx + (to.position.x + pan.x) * zoom
          const y2 = cy + (to.position.y + pan.y) * zoom
          return <Edge key={`${edge.from}-${edge.to}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>

      {/* nodos — posición calculada en coordenadas de pantalla, sin scale */}
      {nodes.length > 0 && (() => {
        const root = nodes[0]
        const rx = cx + (root.position.x + pan.x) * zoom
        const ry = cy + (root.position.y + pan.y) * zoom
        return <HintBadge node={root} screenX={rx} screenY={ry} zoom={zoom} />
      })()}

      {nodes.map((node) => {
        const x = cx + (node.position.x + pan.x) * zoom
        const y = cy + (node.position.y + pan.y) * zoom
        return (
          <Node
            key={node.id}
            node={node}
            zoom={zoom}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          />
        )
      })}

      {/* botones de zoom */}
      <div style={{ position: "fixed", bottom: "16px", right: "16px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 150 }}>
        <button onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))} disabled={zoom >= MAX_ZOOM}
          style={{ width: "28px", height: "24px", background: "#fff", border: "1px solid #a2a9b1", color: "#54595d", fontSize: "16px", fontFamily: "Georgia, serif", cursor: zoom >= MAX_ZOOM ? "not-allowed" : "pointer", opacity: zoom >= MAX_ZOOM ? 0.4 : 1, lineHeight: 1 }}
        >+</button>
        <button onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))} disabled={zoom <= MIN_ZOOM}
          style={{ width: "28px", height: "24px", background: "#fff", border: "1px solid #a2a9b1", color: "#54595d", fontSize: "16px", fontFamily: "Georgia, serif", cursor: zoom <= MIN_ZOOM ? "not-allowed" : "pointer", opacity: zoom <= MIN_ZOOM ? 0.4 : 1, lineHeight: 1 }}
        >−</button>
      </div>
    </div>
  )
}
