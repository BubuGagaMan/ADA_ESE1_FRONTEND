import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SuspendUserModal = ({ user, onClose, onConfirm }) => {
  const [message, setMessage] = useState("");

  // Reset the message field whenever the modal is opened/closed
  useEffect(() => {
    setMessage("");
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("You must provide a reason/message for the user.");
      return;
    }
    onConfirm(user.id, message);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--surface-color)",
          padding: "25px",
          borderRadius: "8px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          border: "1px solid var(--border-color)",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {user.suspended ? "Remove Suspension" : "Suspend User"}
        </h3>
        <p style={{ margin: 0, fontSize: "0.9em", color: "var(--text-muted)" }}>
          User: <strong>{user.username}</strong>
        </p>

        <div>
          <label>Email Message / Reason</label>
          <textarea
            rows="4"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="This message will be sent to the user's email..."
            style={{ padding: "10px", width: "100%", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              backgroundColor: user.suspended
                ? "var(--success-color)"
                : "var(--danger-color)",
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: "var(--surface-hover)",
              color: "var(--text-main)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuspendUserModal;
