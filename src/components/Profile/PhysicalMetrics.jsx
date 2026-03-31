import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/apiClient";
import { toast } from "react-toastify";

const PhysicalMetrics = ({ initialData }) => {
  const [metricsData, setMetricsData] = useState({
    dob: "",
    weight: "",
    sex: 0,
    height: "",
    activityLevel: 1.2,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMetricsData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetricsData((prev) => ({
      ...prev,
      [name]: ["sex", "activityLevel", "weight", "height"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...metricsData,
        weight: Math.round(metricsData.weight * 10),
        height: Math.round(metricsData.height * 10),
        activity_level: metricsData.activityLevel,
      };
      await apiClient.put("/user-metrics", payload);
      toast.success("Metrics updated successfully!");
    } catch (err) {
      toast.error("Failed to update metrics.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={submitUpdate}
      style={{ display: "flex", flexDirection: "column", gap: "15px" }}
    >
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={metricsData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ flex: 1 }}>
          <label>Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            name="weight"
            value={metricsData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Height (cm)</label>
          <input
            type="number"
            name="height"
            value={metricsData.height}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ flex: 1 }}>
          <label>Sex</label>
          <select name="sex" value={metricsData.sex} onChange={handleChange}>
            <option value={0}>Male</option>
            <option value={1}>Female</option>
          </select>
        </div>
        <div style={{ flex: 2 }}>
          <label>Activity Level</label>
          <select
            name="activityLevel"
            value={metricsData.activityLevel}
            onChange={handleChange}
          >
            <option value={1.2}>Sedentary</option>
            <option value={1.375}>Lightly Active</option>
            <option value={1.55}>Moderately Active</option>
            <option value={1.725}>Very Active</option>
            <option value={1.9}>Extra Active</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={isSaving} style={{ marginTop: "10px" }}>
        {isSaving ? "Saving..." : "Update Metrics"}
      </button>
    </form>
  );
};

export default PhysicalMetrics;
