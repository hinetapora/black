// utils/validation.ts

export const validateEmail = (email: string): boolean => {
  // Simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string): boolean => {
  // Password must be at least 6 characters
  const re = /^[A-Za-z\d@$!%*?#&]{6,}$/;
  return re.test(password);
};

