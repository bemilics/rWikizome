export default function InfoPopup({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a1a",
          border: "1px solid #444",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "380px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "0.02em" }}>
          rWikizome 🌿
        </h2>
        <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.5" }}>
          Explore Wikipedia as an infinite rhizome.
        </p>
        <ul style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: 0,
          margin: 0,
        }}>
          <li style={{ fontSize: "13px", lineHeight: "1.5" }}>
            <span style={{ marginRight: "8px" }}>👆</span>
            <strong>Tap</strong> a node to expand it and discover 3 related concepts.
          </li>
          <li style={{ fontSize: "13px", lineHeight: "1.5" }}>
            <span style={{ marginRight: "8px" }}>✋</span>
            <strong>Hold</strong> a node to read its Wikipedia introduction.
          </li>
          <li style={{ fontSize: "13px", lineHeight: "1.5" }}>
            <span style={{ marginRight: "8px" }}>🖐</span>
            <strong>Drag</strong> the background to pan around the canvas.
          </li>
        </ul>
        <button
          onClick={onClose}
          style={{
            padding: "10px",
            background: "#2a2a2a",
            border: "1px solid #555",
            borderRadius: "8px",
            color: "#eee",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
