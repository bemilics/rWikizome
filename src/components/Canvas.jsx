import { useRef, useState, useEffect } from 'react'
import { useGraph } from '../hooks/useGraph'
import Node from './Node'
import Edge from './Edge'

export default function Canvas() {
  const { nodes, edges, init } = useGraph()

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const lastPointer = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    init()
  }, [])

  const onMouseDown = (e) => {
    if (e.target.closest('[data-node]')) return
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
    if (e.target.closest('[data-node]')) return
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

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'grab',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          return (
            <Edge
              key={`${edge.from}-${edge.to}`}
              x1={screenCenterX + from.position.x + pan.x}
              y1={screenCenterY + from.position.y + pan.y}
              x2={screenCenterX + to.position.x + pan.x}
              y2={screenCenterY + to.position.y + pan.y}
            />
          )
        })}
      </svg>

      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          style={{
            position: 'absolute',
            left: screenCenterX + node.position.x + pan.x,
            top: screenCenterY + node.position.y + pan.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}