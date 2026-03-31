const formatMacro = (val) => Number(((val || 0) / 10).toFixed(1));

const MealFoodList = ({ foods, onRemoveFood }) => {
  if (foods.length === 0) {
    return <p className="text-muted">No foods added yet.</p>;
  }

  return (
    <ul style={{ listStyleType: "none", padding: 0, margin: "0 0 15px 0" }}>
      {foods.map((f) => {
        const realWeight = formatMacro(f.weight);
        const realBaseWeight = formatMacro(f.food.weight);
        const realBaseCals = formatMacro(f.food.calories);
        const actualCals =
          realBaseWeight > 0 ? (realBaseCals / realBaseWeight) * realWeight : 0;

        return (
          <li
            key={f.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              background: "var(--background-color)",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
            }}
          >
            <span>
              {f.food.name}
              <span className="text-muted" style={{ marginLeft: "5px" }}>
                ({realWeight}g - {Math.round(actualCals)} kcal)
              </span>
            </span>
            <button
              onClick={() => onRemoveFood(f.id)}
              style={{
                backgroundColor: "var(--danger-color)",
                padding: "4px 8px",
                fontSize: "0.85em",
              }}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default MealFoodList;
