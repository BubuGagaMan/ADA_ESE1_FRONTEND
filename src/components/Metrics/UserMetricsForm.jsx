import React, { useState } from 'react';
import { apiClient } from '../../api/apiClient';

const UserMetricsForm = ({ onMetricsAdded }) => {
  const [formData, setFormData] = useState({
    dob: '',
    weight: '',
    sex: 0,
    height: '',
    activityLevel: 1.2 
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sex' || name === 'activityLevel' || name === 'weight' || name === 'height' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Scale numbers UP for the integer-only backend
      const payload = {
        ...formData,
        activity_level: formData.activityLevel,
        weight: Math.round(formData.weight * 10),
        height: Math.round(formData.height * 10), 
        // activityLevel: Math.round(formData.activityLevel * 1000) 
      };

      await apiClient.post('/user-metrics', payload);
      onMetricsAdded(); 
    } catch (err) {
      console.error(err);
      setError('Failed to save user metrics. Please try again.');
    }
  };

  return (
    <div className="metrics-form-container">
      <h2>Welcome! Let's get your metrics setup.</h2>
      <p>We need this to calculate your macros and calorie needs.</p>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

        <label>Weight (kg)</label>
        <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} required />

        <label>Height (cm)</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} required />

        <label>Sex</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value={0}>Male</option>
          <option value={1}>Female</option>
        </select>

        <label>Activity Level</label>
        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
          <option value={1.2}>Sedentary</option>
          <option value={1.375}>Lightly Active</option>
          <option value={1.55}>Moderately Active</option>
          <option value={1.725}>Very Active</option>
          <option value={1.9}>Extra Active</option>
        </select>

        <button type="submit">Save Metrics</button>
      </form>
    </div>
  );
};

export default UserMetricsForm;