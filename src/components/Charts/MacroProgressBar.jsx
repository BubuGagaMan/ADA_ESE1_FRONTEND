import React from 'react';
import { motion } from 'framer-motion';

const MacroProgressBar = ({ title, current, target, lower, upper, type, unit }) => {
  let color = '#4caf50'; // Default green
  let maxScale = 1;

  if (type === 'calorie') {
    const lowerBound = target * 0.98;
    const upperBound = target * 1.02;
    color = (current >= lowerBound && current <= upperBound) ? '#4caf50' : '#f44336';
    maxScale = target * 1.2; // Visual scale ceiling
  } else if (type === 'macro') {
    color = (current >= lower && current <= upper) ? '#4caf50' : '#f44336';
    maxScale = upper * 1.2;
  } else if (type === 'gl') {
    color = current > 20 ? '#f44336' : '#4caf50';
    maxScale = 40; // Arbitrary ceiling for Glycemic Load visual
  }

  // Cap width at 100% so it doesn't break the container
  const widthPercentage = Math.min((current / (maxScale || 1)) * 100, 100);

  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <strong>{title}</strong>
        <span>
          {current} {unit} 
          {type === 'calorie' && ` / Target: ${target}`}
          {type === 'macro' && ` / Range: ${lower} - ${upper}`} 
          {' ' + unit}
        </span>
      </div>
      <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%`, backgroundColor: color }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default MacroProgressBar;