import { UserRole } from '@/types/auth';

/**
 * Get the initial route for a user based on their role
 * Admin -> Dashboard (index)
 * Staff -> POS (first available tab)  
 * Customer -> Foods (first available tab)
 */
export function getInitialRouteForRole(role: UserRole | undefined): string {
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

/**
 * Get the tabs available for a user role
 */
export function getTabsForRole(role: UserRole | undefined): string[] {
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