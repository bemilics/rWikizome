export default function Edge({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(255,255,255,0.3)"
      strokeWidth={1}
    />
  )
}
