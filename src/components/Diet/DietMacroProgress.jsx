import MacroProgressBar from "../Charts/MacroProgressBar";

const DietMacroProgress = ({ diet, meals }) => {
  const currentProtein = meals.reduce(
    (sum, meal) => sum + (meal.proteins || meal.protein || 0),
    0,
  );
  const currentCarbs = meals.reduce(
    (sum, meal) => sum + (meal.carbohydrates || 0),
    0,
  );
  const currentFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  const currentCalories = diet.calories / 10;

  return (
    <div
      className="diet-card"
      style={{ padding: "20px", borderRadius: "8px", marginBottom: "30px" }}
    >
      <h3>Diet Progress</h3>
      <MacroProgressBar
        title="Calories"
        type="calorie"
        current={Math.round(currentCalories)}
        target={(diet.daily_calorie_target || 0) / 10}
        unit={"kcal"}
      />
      <MacroProgressBar
        title="Protein"
        type="macro"
        current={currentProtein / 10}
        lower={(diet.protein_lower_range || 0) / 10}
        upper={(diet.protein_upper_range || 0) / 10}
        unit={"g"}
      />
      <MacroProgressBar
        title="Carbohydrates"
        type="macro"
        current={currentCarbs / 10}
        lower={(diet.carbohydrate_lower_range || 0) / 10}
        upper={(diet.carbohydrate_upper_range || 0) / 10}
        unit={"g"}
      />
      <MacroProgressBar
        title="Fats"
        type="macro"
        current={currentFats / 10}
        lower={(diet.fat_lower_range || 0) / 10}
        upper={(diet.fat_upper_range || 0) / 10}
        unit={"g"}
      />
    </div>
  );
};

export default DietMacroProgress;
