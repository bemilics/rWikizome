const wp = { fontFamily: "Georgia, 'Times New Roman', serif" }

export default function InfoPopup({ onClose }) {
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", border: "1px solid #a2a9b1", width: "100%", maxWidth: "400px" }}
      >
        <div style={{ background: "#f8f9fa", borderBottom: "1px solid #a2a9b1", padding: "6px 12px" }}>
          <span style={{ ...wp, fontSize: "13px", fontWeight: "bold", color: "#202122" }}>Rhizopedia — Help</span>
        </div>
        <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ ...wp, fontSize: "12px", color: "#54595d", lineHeight: 1.6 }}>Explore Wikipedia as an infinite rhizome. Each concept connects to others.</p>
          {[
            ["Tap", "a node to read its Wikipedia introduction."],
            ["Hold", "a node to expand it and discover 3 related concepts."],
            ["Drag", "the background to pan around the canvas."],
            ["Scroll", "or use the buttons to zoom in and out."],
          ].map(([action, desc]) => (
            <div key={action} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
              <span style={{ ...wp, fontSize: "12px", fontWeight: "bold", color: "#202122", minWidth: "36px" }}>{action}</span>
              <span style={{ ...wp, fontSize: "12px", color: "#54595d", lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #a2a9b1", padding: "6px 12px", background: "#f8f9fa", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...wp, fontSize: "11px", background: "#f8f9fa", border: "1px solid #a2a9b1", padding: "2px 10px", color: "#202122", cursor: "pointer" }}>Got it</button>
        </div>
      </div>
    </div>
  )
}
