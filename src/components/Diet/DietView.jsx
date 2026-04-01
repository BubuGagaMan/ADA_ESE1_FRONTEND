import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { useDietStore } from "../../store/useDietStore";
import MealCard from "../Meal/MealCard";
import DietHeader from "./DietHeader";
import DietMacroProgress from "./DietMacroProgress";

const DietView = () => {
  const { dietId } = useParams();
  const navigate = useNavigate();

  const { diets, meals, fetchDiets, fetchMeals, deleteDiet } = useDietStore();
  const [userMetrics, setUserMetrics] = useState(null);

  const diet = diets.find((d) => d.id === dietId);

  useEffect(() => {
    if (diets.length === 0) fetchDiets();
    fetchMeals(dietId);
    apiClient
      .get("/user-metrics")
      .then((res) => setUserMetrics(res.data.data.userMetrics));
  }, [dietId, diets.length, fetchDiets, fetchMeals]);

  if (!diet) return <div style={{ padding: "20px" }}>Loading diet...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "20px",
          backgroundColor: "var(--surface-hover)",
          color: "var(--text-main)",
        }}
      >
        &larr; Back to Dashboard
      </button>

      <DietHeader
        diet={diet}
        userMetrics={userMetrics}
        fetchDiets={fetchDiets}
        deleteDiet={deleteDiet}
      />

      <DietMacroProgress diet={diet} meals={meals} />

      <div>
        <h2>Meals</h2>
        {meals.length === 0 ? (
          <div>
            <p className="text-muted">No meals yet.</p>
            <button
              onClick={() => navigate(`/diet/${dietId}/create-meal`)}
              style={{ marginTop: "10px" }}
            >
              Create Meal
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onMealUpdated={() => {
                  fetchMeals(dietId);
                  fetchDiets();
                }}
              />
            ))}
            <button
              style={{
                marginTop: "15px",
                backgroundColor: "var(--surface-hover)",
                color: "var(--text-main)",
              }}
              onClick={() => navigate(`/diet/${dietId}/create-meal`)}
            >
              + Create Another Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietView;
