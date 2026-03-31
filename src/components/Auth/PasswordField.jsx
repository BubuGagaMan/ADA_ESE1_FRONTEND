import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  value,
  onChange,
  name = "password",
  placeholder = "Password",
  error,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const eyeBtnStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
    color: "var(--text-muted)",
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required
        style={{
          width: "100%",
          paddingRight: "40px",
          borderColor: error ? "var(--danger-color)" : "var(--border-color)",
          marginBottom: 0,
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={eyeBtnStyle}
        tabIndex="-1"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordField;
