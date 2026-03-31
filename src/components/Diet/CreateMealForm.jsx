import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { sanitizeInput, validateName } from "../../utils/validation";
import { useDietStore } from "../../store/useDietStore";
import { Loader2 } from "lucide-react";

const CreateMealForm = () => {
  const { dietId } = useParams();
  const navigate = useNavigate();
  const { fetchMeals } = useDietStore();

  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await apiClient.post(`/diet/${dietId}/meal`, { name: cleanName });
      fetchMeals(dietId);
      navigate(`/diet/${dietId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create meal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="meal-card"
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "8px",
      }}
    >
      <h2>Add a New Meal</h2>
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
          <label>Meal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Breakfast, Post-Workout Snack"
            style={{ borderColor: error ? "var(--danger-color)" : "" }}
          />
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
              "Create Meal"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/diet/${dietId}`)}
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

export default CreateMealForm;
