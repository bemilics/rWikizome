export default function PopupCard({ node, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
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
          padding: "20px",
          maxWidth: "400px",
          width: "100%",
          maxHeight: "70vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>{node.title}</h2>
        <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#ccc" }}>
          {node.summary ?? "Loading..."}
        </p>
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "8px",
              background: "#2a2a2a",
              border: "1px solid #555",
              borderRadius: "8px",
              color: "#eee",
              textDecoration: "none",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            Open in Wikipedia
          </a>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #555",
              borderRadius: "8px",
              color: "#aaa",
              fontSize: "13px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
