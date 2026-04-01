const AuthSuspendedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface-color)",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "400px",
          textAlign: "center",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 style={{ color: "var(--danger-color)", margin: "0 0 15px 0" }}>
          Account Suspended
        </h2>
        <p style={{ color: "var(--text-main)", marginBottom: "20px" }}>
          Your account has been suspended by an administrator. Please check your
          registered email address for more details regarding this decision.
        </p>
        <button
          onClick={onClose}
          style={{ width: "100%", backgroundColor: "var(--primary-color)" }}
        >
          Understand
        </button>
      </div>
    </div>
  );
};

export default AuthSuspendedModal;
