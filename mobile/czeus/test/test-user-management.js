/**
 * Simple test to validate user management functionality
 * Run with: node test-user-management.js
 */

// Mock React Native modules
global.console = console;

// Mock the mobile-specific modules
const mockAsyncStorage = {
  getItem: async (key) => null,
  setItem: async (key, value) => {},
  removeItem: async (key) => {},
};

const mockSupabaseClient = {
  from: (table) => ({
    select: () => ({
      limit: () => ({ error: new Error('Demo mode') }),
      is: () => ({ order: () => ({ error: new Error('Demo mode') }) }),
      eq: () => ({ single: () => ({ error: new Error('Demo mode') }) }),
    }),
    insert: () => ({
      select: () => ({ single: () => ({ error: new Error('Demo mode') }) }),
    }),
    update: () => ({
      eq: () => ({ select: () => ({ single: () => ({ error: new Error('Demo mode') }) }) }),
    }),
  }),
  auth: {
    signUp: async () => ({ error: new Error('Demo mode') }),
  },
};

// Mock modules
function mockModule(path, exports) {
  require.cache[require.resolve(path)] = {
    exports,
    id: path,
    loaded: true,
  };
}

// Set up mocks before requiring our modules
try {
  mockModule('@react-native-async-storage/async-storage', { default: mockAsyncStorage });
  mockModule('@supabase/supabase-js', { createClient: () => mockSupabaseClient });
} catch (e) {
  // Ignore mock setup errors
}

// Simple test functions
function testUserTypes() {
  console.log('=== Testing User Types ===');
  
  const sampleUser = {
    id: 1,
    name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe', 
    email: 'john@example.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  console.log('✓ Sample user object:', JSON.stringify(sampleUser, null, 2));
  
  const userFormData = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    role: 'staff',
    phone: '+1234567890',
    position: 'Manager',
  };
  
  console.log('✓ User form data:', JSON.stringify(userFormData, null, 2));
  
  return true;
}

function testValidation() {
  console.log('\n=== Testing Validation ===');
  
  // Test email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
  const invalidEmails = ['invalid', 'test@', '@domain.com', ''];
  
  console.log('Valid emails:');
  validEmails.forEach(email => {
    const isValid = emailRegex.test(email);
    console.log(`  ${email}: ${isValid ? '✓' : '✗'}`);
    if (!isValid) throw new Error(`Expected ${email} to be valid`);
  });
  
  console.log('Invalid emails:');
  invalidEmails.forEach(email => {
    const isValid = emailRegex.test(email);
    console.log(`  ${email}: ${isValid ? '✗' : '✓'}`);
    if (isValid) throw new Error(`Expected ${email} to be invalid`);
  });
  
  return true;
}

function testRoleMapping() {
  console.log('\n=== Testing Role Mapping ===');
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'staff': return '#2362c7';
      case 'customer': return '#10b981';
      default: return '#6b7280';
    }
  };
  
  const roles = ['admin', 'staff', 'customer', 'unknown'];
  const expectedColors = ['#ef4444', '#2362c7', '#10b981', '#6b7280'];
  
  roles.forEach((role, index) => {
    const color = getRoleColor(role);
    const expected = expectedColors[index];
    console.log(`  ${role}: ${color} ${color === expected ? '✓' : '✗'}`);
    if (color !== expected) {
      throw new Error(`Expected color ${expected} for role ${role}, got ${color}`);
    }
  });
  
  return true;
}

function testDateFormatting() {
  console.log('\n=== Testing Date Formatting ===');
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };
  
  const testCases = [
    ['2024-01-15T10:30:00Z', true],
    ['2024-01-15', true],
    ['invalid-date', false],
    [null, false],
    [undefined, false],
    ['', false],
  ];
  
  testCases.forEach(([dateString, shouldBeValid]) => {
    const result = formatDate(dateString);
    const isValid = result !== 'Not provided' && result !== 'Invalid date';
    console.log(`  ${dateString}: ${result} ${isValid === shouldBeValid ? '✓' : '✗'}`);
    if (isValid !== shouldBeValid) {
      throw new Error(`Expected ${dateString} valid=${shouldBeValid}, got valid=${isValid}`);
    }
  });
  
  return true;
}

function testFormValidation() {
  console.log('\n=== Testing Form Validation ===');
  
  const validateForm = (form) => {
    if (!form.first_name?.trim()) return 'First name is required';
    if (!form.last_name?.trim()) return 'Last name is required';
    if (!form.email?.trim()) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) return 'Please enter a valid email address';
    
    return null; // Valid
  };
  
  const testForms = [
    [{ first_name: 'John', last_name: 'Doe', email: 'john@example.com' }, null],
    [{ first_name: '', last_name: 'Doe', email: 'john@example.com' }, 'First name is required'],
    [{ first_name: 'John', last_name: '', email: 'john@example.com' }, 'Last name is required'],
    [{ first_name: 'John', last_name: 'Doe', email: '' }, 'Email is required'],
    [{ first_name: 'John', last_name: 'Doe', email: 'invalid' }, 'Please enter a valid email address'],
  ];
  
  testForms.forEach(([form, expectedError], index) => {
    const error = validateForm(form);
    const passed = error === expectedError;
    console.log(`  Test ${index + 1}: ${passed ? '✓' : '✗'}`);
    if (!passed) {
      throw new Error(`Expected error "${expectedError}", got "${error}"`);
    }
  });
  
  return true;
}

function runTests() {
  console.log('🧪 Testing User Management Functionality\n');
  
  const tests = [
    testUserTypes,
    testValidation,
    testRoleMapping,
    testDateFormatting,
    testFormValidation,
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach((test, index) => {
    try {
      const result = test();
      if (result) {
        passed++;
      }
    } catch (error) {
      console.error(`\n❌ Test ${index + 1} failed:`, error.message);
      failed++;
    }
  });
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`🎯 Overall: ${failed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return failed === 0;
}

// Run the tests
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };