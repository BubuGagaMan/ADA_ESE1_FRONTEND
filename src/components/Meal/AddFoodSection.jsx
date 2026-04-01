import { useState, useEffect } from "react";
import { apiClient } from "../../api/apiClient";

const formatMacro = (val) => Number(((val || 0) / 10).toFixed(1));

const AddFoodSection = ({ mealId, onFoodAdded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [availableFoods, setAvailableFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedFoodForAdd, setSelectedFoodForAdd] = useState(null);
  const [foodWeight, setFoodWeight] = useState(100);

  useEffect(() => {
    if (!isAdding || selectedFoodForAdd) return;

    const fetchAvailableFoods = async () => {
      setIsSearching(true);
      try {
        const response = await apiClient.get("/food", {
          params: { search: searchQuery, page: currentPage, limit: 5 },
        });
        setAvailableFoods(response.data.data || []);
        setTotalPages(response.data.meta?.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch all foods", err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchAvailableFoods(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage, isAdding, selectedFoodForAdd]);

  const handleAddFoodClick = () => {
    setIsAdding(true);
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedFoodForAdd(null);
  };

  const handleSelectFood = (food) => {
    setSelectedFoodForAdd(food);
    setFoodWeight(food.weight / 10 || 100);
  };

  const submitAddFood = async () => {
    if (!selectedFoodForAdd) return;
    try {
      await apiClient.post(`/meal/${mealId}/food/${selectedFoodForAdd.id}`, {
        weight: Math.round(foodWeight * 10),
      });
      setIsAdding(false);
      setSelectedFoodForAdd(null);
      onFoodAdded();
    } catch (err) {
      console.error("Failed to add food", err);
    }
  };

  const calculateNutrient = (baseNutrient, baseWeight) => {
    const realBaseNutrient = formatMacro(baseNutrient);
    const realBaseWeight = formatMacro(baseWeight);
    if (!realBaseNutrient || !realBaseWeight || !foodWeight) return 0;
    const value = (realBaseNutrient / realBaseWeight) * foodWeight;
    return Number(value.toFixed(1));
  };

  if (!isAdding) {
    return (
      <div
        style={{
          marginTop: "10px",
          padding: "15px",
          backgroundColor: "var(--background-color)",
          borderRadius: "6px",
        }}
      >
        <button
          onClick={handleAddFoodClick}
          style={{ backgroundColor: "var(--success-color)" }}
        >
          + Add Food
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "var(--background-color)",
        borderRadius: "6px",
      }}
    >
      {selectedFoodForAdd ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h4 style={{ margin: 0, color: "var(--text-main)" }}>
            Add {selectedFoodForAdd.name}
          </h4>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Weight (grams)
            </label>
            <input
              type="number"
              min="1"
              value={foodWeight}
              onChange={(e) => setFoodWeight(e.target.value)}
            />
          </div>
          <div
            style={{
              backgroundColor: "var(--surface-color)",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
              fontSize: "0.9em",
            }}
          >
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Calculated Nutrients:</strong>
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                Calories:{" "}
                {Math.round(
                  calculateNutrient(
                    selectedFoodForAdd.calories,
                    selectedFoodForAdd.weight,
                  ),
                )}{" "}
                kcal
              </span>
              <span>
                Protein:{" "}
                {calculateNutrient(
                  selectedFoodForAdd.proteins,
                  selectedFoodForAdd.weight,
                )}
                g
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <span>
                Carbs:{" "}
                {calculateNutrient(
                  selectedFoodForAdd.carbohydrates,
                  selectedFoodForAdd.weight,
                )}
                g
              </span>
              <span>
                Fats:{" "}
                {calculateNutrient(
                  selectedFoodForAdd.fats,
                  selectedFoodForAdd.weight,
                )}
                g
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={submitAddFood}
              style={{ flex: 1, backgroundColor: "var(--success-color)" }}
            >
              Confirm Add
            </button>
            <button
              onClick={() => setSelectedFoodForAdd(null)}
              style={{
                flex: 1,
                backgroundColor: "var(--surface-hover)",
                color: "var(--text-main)",
              }}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0 }}>Search Foods</h4>
            <button
              onClick={() => setIsAdding(false)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by food name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {isSearching ? (
            <p className="text-muted">Searching...</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {availableFoods.length === 0 ? (
                <li className="text-muted" style={{ padding: "8px" }}>
                  No foods found.
                </li>
              ) : (
                availableFoods.map((af) => (
                  <li
                    key={af.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span>
                      {af.name}{" "}
                      <small className="text-muted">
                        ({Math.round(formatMacro(af.calories))} kcal /{" "}
                        {formatMacro(af.weight)}g)
                      </small>
                    </span>
                    <button
                      onClick={() => handleSelectFood(af)}
                      style={{ padding: "4px 10px" }}
                    >
                      Select
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                fontSize: "0.9em",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  padding: "4px 8px",
                  backgroundColor:
                    currentPage === 1
                      ? "var(--border-color)"
                      : "var(--primary-color)",
                }}
              >
                &larr; Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  padding: "4px 8px",
                  backgroundColor:
                    currentPage === totalPages
                      ? "var(--border-color)"
                      : "var(--primary-color)",
                }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFoodSection;
