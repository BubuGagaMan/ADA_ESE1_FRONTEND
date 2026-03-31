import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
        gap: "12px",
      }}
    >
      <Loader2
        size={40}
        className="animate-spin"
        style={{
          color: "var(--primary-color)",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        {message}
      </p>

      {/* Inline style tag for the spin animation if not in your CSS file */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
