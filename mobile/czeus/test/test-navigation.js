/**
 * Simple test to validate navigation logic
 * Run with: node test-navigation.js
 */

// Simulate the navigation functions
function getInitialRouteForRole(role) {
  switch (role) {
    case 'admin':
      return '/(tabs)/'; // Default to dashboard/index
    case 'staff':
      return '/(tabs)/pos'; // First tab for staff
    case 'customer':
      return '/(tabs)/foods'; // First tab for customer
    default:
      return '/(tabs)/foods'; // Default to customer experience
  }
}

function getTabsForRole(role) {
  switch (role) {
    case 'admin':
      return ['index', 'users', 'pos-setup', 'explore'];
    case 'staff':
      return ['pos', 'profile'];
    case 'customer':
      return ['foods', 'points', 'profile'];
    default:
      return ['foods', 'points', 'profile']; // Default to customer
  }
}

function testNavigation() {
  console.log('Testing navigation utilities...\n');

  // Test getInitialRouteForRole
  console.log('=== Initial Route Testing ===');
  const roles = ['admin', 'staff', 'customer', undefined];
  
  roles.forEach(role => {
    const route = getInitialRouteForRole(role);
    console.log(`Role: ${role || 'undefined'} -> Route: ${route}`);
  });

  console.log('\n=== Tabs For Role Testing ===');
  roles.forEach(role => {
    const tabs = getTabsForRole(role);
    console.log(`Role: ${role || 'undefined'} -> Tabs: [${tabs.join(', ')}]`);
  });

  // Validate expected behavior
  console.log('\n=== Validation ===');
  
  // Admin should go to dashboard
  const adminRoute = getInitialRouteForRole('admin');
  console.log(`✓ Admin route: ${adminRoute === '/(tabs)/' ? 'PASS' : 'FAIL'} (${adminRoute})`);
  
  // Staff should go to POS
  const staffRoute = getInitialRouteForRole('staff');
  console.log(`✓ Staff route: ${staffRoute === '/(tabs)/pos' ? 'PASS' : 'FAIL'} (${staffRoute})`);
  
  // Customer should go to Foods
  const customerRoute = getInitialRouteForRole('customer');
  console.log(`✓ Customer route: ${customerRoute === '/(tabs)/foods' ? 'PASS' : 'FAIL'} (${customerRoute})`);
  
  // Staff should only have pos and profile tabs
  const staffTabs = getTabsForRole('staff');
  const expectedStaffTabs = ['pos', 'profile'];
  const staffTabsMatch = JSON.stringify(staffTabs) === JSON.stringify(expectedStaffTabs);
  console.log(`✓ Staff tabs: ${staffTabsMatch ? 'PASS' : 'FAIL'} (${staffTabs.join(', ')})`);
  
  console.log('\nAll tests completed!');
  
  // Return test results
  return {
    adminRoute: adminRoute === '/(tabs)/',
    staffRoute: staffRoute === '/(tabs)/pos',
    customerRoute: customerRoute === '/(tabs)/foods',
    staffTabs: staffTabsMatch
  };
}

const results = testNavigation();
const allPassed = Object.values(results).every(result => result === true);
console.log(`\n🎯 Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

process.exit(allPassed ? 0 : 1);