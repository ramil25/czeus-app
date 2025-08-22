/**
 * Tests for validation utilities
 * Run with: node test-validation.js
 */

// Inline validation functions for testing (copied from validation.ts)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  email = email.trim();
  
  if (email.length < 5 || email.length > 254) {
    return false;
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return false;
  }
  
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }
  
  const [localPart, domain] = parts;
  
  if (localPart.length > 64) {
    return false;
  }
  
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }
  
  return true;
}

function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  name = name.trim();
  
  if (name.length < 1 || name.length > 50) {
    return false;
  }
  
  return NAME_REGEX.test(name);
}

function isValidPhone(phone) {
  if (!phone || phone.trim() === '') {
    return true; // Optional field
  }
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function validateUserData(userData) {
  const errors = {};
  
  if (!isValidName(userData.first_name)) {
    errors.first_name = 'First name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes';
  }
  
  if (!isValidName(userData.last_name)) {
    errors.last_name = 'Last name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes';
  }
  
  if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
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

// Test email validation
console.log('Testing email validation...');

// Valid emails
const validEmails = [
  'test@example.com',
  'user.name@domain.co.uk',
  'first+last@company.org',
  'nina@gmail.com',
  'admin@czeus.com'
];

validEmails.forEach(email => {
  const result = isValidEmail(email);
  console.log(`${email}: ${result ? '✓ VALID' : '✗ INVALID'}`);
  if (!result) {
    console.error(`Expected ${email} to be valid!`);
  }
});

// Invalid emails
const invalidEmails = [
  'invalid-email',
  '@domain.com',
  'user@',
  'user..name@domain.com',
  'user@domain',
  '',
  'a'.repeat(250) + '@domain.com' // Too long
];

invalidEmails.forEach(email => {
  const result = isValidEmail(email);
  console.log(`${email}: ${result ? '✗ INVALID (should be invalid)' : '✓ INVALID'}`);
  if (result) {
    console.error(`Expected ${email} to be invalid!`);
  }
});

// Test name validation
console.log('\nTesting name validation...');

const validNames = [
  'John',
  'Mary-Jane',
  "O'Connor",
  'Jean-Luc',
  'Anna Maria'
];

validNames.forEach(name => {
  const result = isValidName(name);
  console.log(`${name}: ${result ? '✓ VALID' : '✗ INVALID'}`);
  if (!result) {
    console.error(`Expected ${name} to be valid!`);
  }
});

const invalidNames = [
  '',
  '123',
  'John@',
  'a'.repeat(51), // Too long
  'Name with numbers 123'
];

invalidNames.forEach(name => {
  const result = isValidName(name);
  console.log(`${name}: ${result ? '✗ INVALID (should be invalid)' : '✓ INVALID'}`);
  if (result) {
    console.error(`Expected ${name} to be invalid!`);
  }
});

// Test phone validation
console.log('\nTesting phone validation...');

const validPhones = [
  '1234567890',
  '+1 (555) 123-4567',
  '555-123-4567',
  '(555) 123-4567',
  '', // Optional field
  undefined // Optional field
];

validPhones.forEach(phone => {
  const result = isValidPhone(phone);
  console.log(`${phone}: ${result ? '✓ VALID' : '✗ INVALID'}`);
  if (!result) {
    console.error(`Expected ${phone} to be valid!`);
  }
});

const invalidPhones = [
  '123', // Too short
  '12345678901234567890', // Too long
  'not-a-phone'
];

invalidPhones.forEach(phone => {
  const result = isValidPhone(phone);
  console.log(`${phone}: ${result ? '✗ INVALID (should be invalid)' : '✓ INVALID'}`);
  if (result) {
    console.error(`Expected ${phone} to be invalid!`);
  }
});

// Test comprehensive validation
console.log('\nTesting comprehensive user data validation...');

const validUserData = {
  first_name: 'Nina',
  last_name: 'Smith',
  email: 'nina@gmail.com',
  phone: '555-123-4567'
};

const validation = validateUserData(validUserData);
console.log('Valid user data validation:', validation.isValid ? '✓ VALID' : '✗ INVALID');
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}

const invalidUserData = {
  first_name: '',
  last_name: 'Smith123',
  email: 'invalid-email',
  phone: '123'
};

const invalidValidation = validateUserData(invalidUserData);
console.log('Invalid user data validation:', invalidValidation.isValid ? '✗ SHOULD BE INVALID' : '✓ CORRECTLY INVALID');
console.log('Expected validation errors:', invalidValidation.errors);

console.log('\n✅ Validation tests completed!');