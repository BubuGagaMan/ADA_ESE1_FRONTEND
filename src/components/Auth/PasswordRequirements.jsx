import { CheckCircle2, Circle } from "lucide-react";

const Requirement = ({ met, text }) => (
  <div
    style={{
      color: met ? "var(--success-color)" : "var(--text-muted)",
      fontSize: "0.85rem",
      margin: "6px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    }}
  >
    {met ? <CheckCircle2 size={16} /> : <Circle size={16} />}
    <span style={{ fontWeight: met ? "500" : "400" }}>{text}</span>
  </div>
);

const PasswordRequirements = ({ checks, score }) => {
  const getStrengthColor = () => {
    if (score <= 2) return "var(--danger-color)";
    if (score <= 4) return "#f59e0b";
    return "var(--success-color)";
  };

  return (
    <div
      style={{
        padding: "12px",
        background: "var(--background-color)",
        marginTop: "8px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
      }}
    >
      <Requirement met={checks.length} text="At least 8 characters" />
      <Requirement met={checks.upper} text="One uppercase letter" />
      <Requirement met={checks.lower} text="One lowercase letter" />
      <Requirement met={checks.number} text="One number" />
      <Requirement met={checks.special} text="One special character" />
      <Requirement met={checks.match} text="Passwords match" />

      <div
        style={{
          height: "4px",
          width: "100%",
          backgroundColor: "var(--border-color)",
          borderRadius: "2px",
          marginTop: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(score / 5) * 100}%`,
            backgroundColor: getStrengthColor(),
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export { Requirement, PasswordRequirements };
