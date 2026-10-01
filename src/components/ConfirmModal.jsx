import { createPortal } from "react-dom";

const ConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "Do you want to proceed with this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
}) => {
  if (!open) return null;

  return createPortal(
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7, 29, 46, 0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 20px 60px rgba(7, 29, 46, 0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isConfirming}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#9ca3af",
            fontSize: "1.1rem",
            lineHeight: 1,
            cursor: isConfirming ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { if (!isConfirming) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Circular logo */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#074568",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            boxShadow: "0 4px 16px rgba(7, 69, 104, 0.25)",
            flexShrink: 0,
          }}
        >
          <img
            src="/logos/PrepHQ-03.png"
            alt="PrepHQ"
            style={{ width: 48, height: 48, objectFit: "contain" }}
          />
        </div>

        <h5
          style={{
            color: "#074568",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: 10,
          }}
        >
          {title}
        </h5>

        <p
          style={{
            color: "#6b7280",
            fontSize: "0.88rem",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <button
            onClick={onCancel}
            disabled={isConfirming}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: "1.5px solid #074568",
              background: "transparent",
              color: "#074568",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: isConfirming ? "not-allowed" : "pointer",
              opacity: isConfirming ? 0.5 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (!isConfirming) e.currentTarget.style.background = "#f0f4f7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={isConfirming}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: "none",
              background: "#37AB79",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: isConfirming ? "not-allowed" : "pointer",
              opacity: isConfirming ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (!isConfirming) e.currentTarget.style.background = "#2e9467"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#37AB79"; }}
          >
            {isConfirming && (
              <span
                style={{
                  width: 13,
                  height: 13,
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "ws-spin 0.65s linear infinite",
                  flexShrink: 0,
                }}
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
