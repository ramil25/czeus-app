/**
 * Validation utilities for user input
 */

// Email validation regex - more comprehensive than basic checks
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Name validation - letters, spaces, hyphens, apostrophes
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Trim whitespace
  email = email.trim();
  
  // Check length constraints
  if (email.length < 5 || email.length > 254) {
    return false;
  }
  
  // Check regex pattern
  if (!EMAIL_REGEX.test(email)) {
    return false;
  }
  
  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }
  
  const [localPart, domain] = parts;
  
  // Local part should not exceed 64 characters
  if (localPart.length > 64) {
    return false;
  }
  
  // Domain should have at least one dot and valid format
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }
  
  return true;
}

/**
 * Validates name format (first name, last name, etc.)
 * @param name - Name to validate
 * @returns boolean indicating if name is valid
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  // Trim whitespace
  name = name.trim();
  
  // Check length constraints (1-50 characters)
  if (name.length < 1 || name.length > 50) {
    return false;
  }
  
  // Check pattern - only letters, spaces, hyphens, apostrophes
  return NAME_REGEX.test(name);
}

/**
 * Validates phone number format (optional field)
 * @param phone - Phone number to validate
 * @returns boolean indicating if phone is valid or empty
 */
export function isValidPhone(phone?: string): boolean {
  if (!phone || phone.trim() === '') {
    return true; // Optional field
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Should have 10-15 digits
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validates user form data comprehensively
 * @param userData - User data to validate
 * @returns object with validation results
 */
export function validateUserData(userData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  middle_name?: string;
}) {
  const errors: Record<string, string> = {};
  
  // Validate required fields
  if (!isValidName(userData.first_name)) {
    errors.first_name = 'First name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes';
  }
  
  if (!isValidName(userData.last_name)) {
    errors.last_name = 'Last name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes';
  }
  
  if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate optional fields
  if (userData.middle_name && !isValidName(userData.middle_name)) {
    errors.middle_name = 'Middle name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes';
  }
  
  if (!isValidPhone(userData.phone)) {
    errors.phone = 'Phone number must be 10-15 digits';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}