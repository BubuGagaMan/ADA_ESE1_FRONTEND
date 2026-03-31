import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDietStore } from "../../store/useDietStore";
import LoadingSpinner from "../LoadingSpinner";

const Dashboard = () => {
  const navigate = useNavigate();
  // pull data and actions directly from our global store
  const { diets, fetchDiets, isLoadingDiets } = useDietStore();

  useEffect(() => {
    fetchDiets();
  }, [fetchDiets]);

  if (isLoadingDiets) return <LoadingSpinner message="Fetching dashboard..." />;

  return (
    <div
      className="dashboard-container"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1>Your Diets</h1>

      {diets.length === 0 ? (
        <div className="no-diets" style={{ marginTop: "20px" }}>
          <p>You don't have any diets yet. Start by creating one!</p>
          <button
            onClick={() => navigate("/create-diet")}
            style={{ padding: "10px 15px" }}
          >
            Create a Diet
          </button>
        </div>
      ) : (
        <div
          className="diet-list"
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {diets.map((diet) => (
            <div
              key={diet.id}
              className="diet-card"
              style={{
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                minWidth: "200px",
              }}
              onClick={() => navigate(`/diet/${diet.id}`)}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{diet.name}</h3>
              <p style={{ margin: 0 }}>
                Target: {diet.daily_calorie_target / 10} kcal
              </p>
            </div>
          ))}
          <div style={{ width: "100%", marginTop: "20px" }}>
            <button
              onClick={() => navigate("/create-diet")}
              style={{ padding: "10px 15px" }}
            >
              + Create Another Diet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
