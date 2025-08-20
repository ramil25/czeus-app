/**
 * Test script to validate navigation logic
 * This can be run with: npx ts-node test-navigation.ts
 */

import { getInitialRouteForRole, getTabsForRole } from '../utils/navigation';
import { UserRole } from '../types/auth';

function testNavigation() {
  console.log('Testing navigation utilities...\n');

  // Test getInitialRouteForRole
  console.log('=== Initial Route Testing ===');
  const roles: (UserRole | undefined)[] = ['admin', 'staff', 'customer', undefined];
  
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
}

if (require.main === module) {
  testNavigation();
}

export { testNavigation };