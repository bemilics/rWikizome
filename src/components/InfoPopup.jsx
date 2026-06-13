import { useState } from "react"

const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }

const steps = [
  {
    icon: "✋",
    action: "Hold",
    desc: "Press and hold a node to expand it and discover 3 related concepts.",
  },
  {
    icon: "👆",
    action: "Tap",
    desc: "Tap a node to read its Wikipedia introduction and share your path.",
  },
  {
    icon: "🖐",
    action: "Explore",
    desc: "Drag the background to pan. Scroll or pinch to zoom in and out.",
  },
]

export default function InfoPopup({ onClose }) {
  const [step, setStep] = useState(0)
  const isLast = step === steps.length - 1
  const current = steps[step]

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: "24px",
      }}
    >
      <div style={{ background: "#fff", border: "1px solid #a2a9b1", width: "100%", maxWidth: "360px" }}>
        <div style={{ background: "#f8f9fa", borderBottom: "1px solid #a2a9b1", padding: "6px 12px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ ...wp, fontSize: "13px", fontWeight: "bold", color: "#202122" }}>Rhizopedia</span>
          <span style={{ ...wp, fontSize: "11px", color: "#a2a9b1" }}>{step + 1} / {steps.length}</span>
        </div>

        <div style={{ padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", minHeight: "200px", justifyContent: "center" }}>
          <span style={{ fontSize: "40px" }}>{current.icon}</span>
          <p style={{ ...wp, fontSize: "18px", fontWeight: "bold", color: "#202122" }}>{current.action}</p>
          <p style={{ ...wp, fontSize: "13px", color: "#54595d", textAlign: "center", lineHeight: 1.7 }}>{current.desc}</p>
        </div>

        <div style={{ borderTop: "1px solid #a2a9b1", padding: "6px 12px", background: "#f8f9fa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: i === step ? "#202122" : "#a2a9b1",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ ...wp, fontSize: "11px", background: "#f8f9fa", border: "1px solid #a2a9b1", padding: "2px 10px", color: "#54595d", cursor: "pointer" }}
              >Back</button>
            )}
            <button
              onClick={() => isLast ? onClose() : setStep(s => s + 1)}
              style={{ ...wp, fontSize: "11px", background: isLast ? "#202122" : "#f8f9fa", border: "1px solid #a2a9b1", padding: "2px 10px", color: isLast ? "#fff" : "#202122", cursor: "pointer" }}
            >
              {isLast ? "Start exploring" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
