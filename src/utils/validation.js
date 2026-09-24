// ============================================================
// Validation Utilities
// ============================================================

export function validatePhone(value) {
  if (!value) return false;
  const cleaned = value.replace(/[\s\-().]/g, '');
  const pattern = /^\+?[0-9]{10,15}$/;
  return pattern.test(cleaned);
}

export function validateName(value) {
  return value.trim().length >= 2;
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function getFieldError(field, value) {
  switch (field) {
    case 'name':
      if (!validateRequired(value)) return 'Name is required';
      if (!validateName(value)) return 'Name must be at least 2 characters';
      return null;
    case 'contact':
      if (!validateRequired(value)) return 'Contact number is required';
      if (!validatePhone(value)) return 'Please enter a valid phone number';
      return null;
    default:
      return null;
  }
}
