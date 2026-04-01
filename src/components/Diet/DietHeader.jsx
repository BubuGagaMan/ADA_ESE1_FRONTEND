import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { sanitizeInput, validateName } from "../../utils/validation";

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

const DietHeader = ({ diet, userMetrics, fetchDiets, deleteDiet }) => {
  const navigate = useNavigate();
  const [isEditingDiet, setIsEditingDiet] = useState(false);
  const [editDietName, setEditDietName] = useState("");
  const [editWeightGoal, setEditWeightGoal] = useState(0);

  useEffect(() => {
    if (diet && !isEditingDiet) {
      setEditDietName(diet.name);
      setEditWeightGoal(diet.weight_goal || 0);
    }
  }, [diet, isEditingDiet]);

  const handleUpdateDiet = async () => {
    const cleanName = sanitizeInput(editDietName);
    const nameError = validateName(cleanName);

    if (nameError) {
      alert(nameError);
      return;
    }
    if (!userMetrics) return;

    try {
      await apiClient.put(`/diet/${diet.id}`, {
        name: cleanName,
        weightGoal: Number(editWeightGoal),
        userMetrics: {
          height: userMetrics.height,
          weight: userMetrics.weight,
          sex: userMetrics.sex,
          dob: userMetrics.dob,
          activity_level: userMetrics.activity_level,
        },
      });
      setIsEditingDiet(false);
      fetchDiets();
    } catch (err) {
      alert("Failed to update diet.");
    }
  };

  const executeDeleteDiet = () => {
    if (!window.confirm("Are you sure you want to delete this diet?")) return;
    deleteDiet(diet.id);
    navigate("/dashboard", { replace: true });
  };

  if (isEditingDiet) {
    return (
      <div
        className="diet-card"
        style={{ padding: "20px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Edit Diet</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            type="text"
            value={editDietName}
            onChange={(e) => setEditDietName(e.target.value)}
          />
          <select
            value={editWeightGoal}
            onChange={(e) => setEditWeightGoal(e.target.value)}
          >
            {WEIGHT_GOALS.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdateDiet}
            style={{ backgroundColor: "var(--success-color)" }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditingDiet(false)}
            style={{
              backgroundColor: "var(--surface-hover)",
              color: "var(--text-main)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <h1 style={{ margin: 0 }}>{diet.name}</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setIsEditingDiet(true)}
          style={{
            backgroundColor: "var(--surface-hover)",
            color: "var(--text-main)",
          }}
        >
          Edit
        </button>
        <button
          onClick={executeDeleteDiet}
          style={{ backgroundColor: "var(--danger-color)" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DietHeader;
