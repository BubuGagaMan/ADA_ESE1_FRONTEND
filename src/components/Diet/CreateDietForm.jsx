import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { sanitizeInput, validateName } from "../../utils/validation";
import { useDietStore } from "../../store/useDietStore";
import { Loader2 } from "lucide-react";

const WEIGHT_GOALS = [
  { label: "Loss 1000g/week", value: -4 },
  { label: "Loss 750g/week", value: -3 },
  { label: "Loss 500g/week", value: -2 },
  { label: "Loss 250g/week", value: -1 },
  { label: "Maintenance", value: 0 },
  { label: "Gain 250g/week", value: 1 },
  { label: "Gain 500g/week", value: 2 },
  { label: "Gain 750g/week", value: 3 },
  { label: "Gain 1000g/week", value: 4 },
];

const CreateDietForm = () => {
  const [name, setName] = useState("");
  const [weightGoal, setWeightGoal] = useState(0);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { fetchDiets } = useDietStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanName = sanitizeInput(name);
    const nameError = validateName(cleanName);

    if (nameError) {
      setError(nameError);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/diet", {
        name: cleanName,
        weightGoal: Number(weightGoal),
      });

      fetchDiets();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create diet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="diet-card"
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "8px",
      }}
    >
      <h2>Create a New Diet</h2>
      {error && (
        <p style={{ color: "var(--danger-color)", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>Diet Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Summer Cut, Bulking Phase"
            style={{ borderColor: error ? "var(--danger-color)" : "" }}
          />
        </div>

        <div>
          <label>Weight Goal</label>
          <select
            value={weightGoal}
            onChange={(e) => setWeightGoal(e.target.value)}
          >
            {WEIGHT_GOALS.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ flex: 1, backgroundColor: "var(--success-color)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    animation: "spin 1s linear infinite",
                    marginRight: "8px",
                  }}
                />{" "}
                Creating...
              </>
            ) : (
              "Create Diet"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
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

export default CreateDietForm;
