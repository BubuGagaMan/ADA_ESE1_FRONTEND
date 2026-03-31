// --- SANITIZATION ---
// Trims whitespace and strips basic dangerous HTML tags (<, >)
// Note: React automatically protects against XSS when rendering, 
// but this stops garbage from reaching your database.
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, ''); 
};

// --- VALIDATION RULES ---
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!re.test(email)) return "Please enter a valid email address.";
  return null; // null means no errors
};

export const validatePassword = (password, isLogin = false) => {
  if (!password) return "Password is required.";
  if (isLogin) return null; // Don't enforce strength rules on login, just existence
  
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
};

export const validateUsername = (username) => {
  if (!username) return "Username is required.";
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (/[^a-zA-Z0-9_]/.test(username)) return "Username can only contain letters, numbers, and underscores.";
  return null;
};

// Helper to run multiple validators at once
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(key => {
    const error = rules[key](data[key]);
    if (error) {
      errors[key] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Validates general text inputs like Diet Names and Meal Names
export const validateName = (name) => {
  if (!name || name.trim().length === 0) return "Name is required.";
  if (name.length > 50) return "Name must be 50 characters or less.";
  return null;
};