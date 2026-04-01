import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../api/apiClient";
import { useDietStore } from "../../store/useDietStore";
import MealHeader from "./MealHeader";
import MealFoodList from "./MealFoodList";
import AddFoodSection from "./AddFoodSection";

const MealCard = ({ meal, onMealUpdated }) => {
  const { deleteMeal } = useDietStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [foods, setFoods] = useState([]);

  const fetchMealFoods = useCallback(async () => {
    if (!meal?.id) return;
    try {
      const response = await apiClient.get(`/meal/${meal.id}/meal-food`);
      setFoods(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch foods for meal", err);
    }
  }, [meal?.id]);

  useEffect(() => {
    if (isExpanded) fetchMealFoods();
  }, [isExpanded, fetchMealFoods]);

  const handleRemoveFood = async (mealFoodId) => {
    try {
      await apiClient.delete(`/meal/${meal.id}/meal-food/${mealFoodId}`);
      setFoods((prev) => prev.filter((f) => f.id !== mealFoodId));
      onMealUpdated();
    } catch (err) {
      console.error("Failed to remove food", err);
    }
  };

  const handleDeleteMeal = () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${meal?.name}"? All foods inside will be removed.`,
      )
    )
      return;
    deleteMeal(meal.id);
  };

  if (!meal || !meal.name) return null;

  return (
    <div
      className="meal-card"
      style={{ padding: "15px", borderRadius: "8px", marginBottom: "15px" }}
    >
      <MealHeader
        meal={meal}
        onMealUpdated={onMealUpdated}
        onDeleteMeal={handleDeleteMeal}
        isExpanded={isExpanded}
        toggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div
          style={{
            marginTop: "15px",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "15px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Foods in Meal</h4>

          <MealFoodList foods={foods} onRemoveFood={handleRemoveFood} />

          <AddFoodSection
            mealId={meal.id}
            onFoodAdded={() => {
              fetchMealFoods();
              onMealUpdated();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MealCard;
