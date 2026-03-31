import { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { sanitizeInput, validateName } from "../../utils/validation";

const formatMacro = (val) => Number(((val || 0) / 10).toFixed(1));

const MealHeader = ({
  meal,
  onMealUpdated,
  onDeleteMeal,
  isExpanded,
  toggleExpand,
}) => {
  const [isEditingMeal, setIsEditingMeal] = useState(false);
  const [editMealName, setEditMealName] = useState(meal?.name || "");

  const handleUpdateMeal = async () => {
    const cleanName = sanitizeInput(editMealName);
    const nameError = validateName(cleanName);

    if (nameError) {
      alert(nameError);
      return;
    }

    try {
      await apiClient.put(`/meal/${meal.id}`, { name: cleanName });
      setIsEditingMeal(false);
      onMealUpdated();
    } catch (err) {
      alert("Failed to update meal. Please try again.");
    }
  };

  const glValue = meal.glycemic_load / 100;
  const glColor = glValue > 20 ? "var(--danger-color)" : "var(--success-color)";

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditingMeal ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flex: 1,
              marginRight: "15px",
            }}
          >
            <input
              type="text"
              value={editMealName}
              onChange={(e) => setEditMealName(e.target.value)}
              style={{ padding: "6px", fontSize: "1em" }}
            />
            <button
              onClick={handleUpdateMeal}
              style={{
                backgroundColor: "var(--success-color)",
                padding: "6px 12px",
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditingMeal(false);
                setEditMealName(meal.name);
              }}
              style={{
                backgroundColor: "var(--surface-hover)",
                padding: "6px 12px",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h3 style={{ margin: 0 }}>{meal.name}</h3>
            <span
              onClick={() => setIsEditingMeal(true)}
              style={{
                fontSize: "0.85em",
                color: "var(--primary-color)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Edit
            </span>
            <span
              onClick={onDeleteMeal}
              style={{
                fontSize: "0.85em",
                color: "var(--danger-color)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Delete
            </span>
          </div>
        )}

        {!isEditingMeal && (
          <button
            onClick={toggleExpand}
            style={{
              backgroundColor: "var(--surface-hover)",
              color: "var(--text-main)",
            }}
          >
            {isExpanded ? "Hide Foods" : "Show Foods"}
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "0.9em",
          color: "var(--text-main)",
        }}
      >
        Calories: <strong>{Math.round(formatMacro(meal.calories))}</strong> |
        Protein: <strong>{formatMacro(meal.proteins)}g</strong> | Carbs:{" "}
        <strong>{formatMacro(meal.carbohydrates)}g</strong> | Fats:{" "}
        <strong>{formatMacro(meal.fats)}g</strong>
        <div style={{ marginTop: "5px" }}>
          Glycemic Load:{" "}
          <span style={{ color: glColor, fontWeight: "bold" }}>{glValue}</span>
        </div>
      </div>
    </>
  );
};

export default MealHeader;
