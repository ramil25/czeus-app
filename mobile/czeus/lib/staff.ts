import { createUser, getUsers, updateUser, deleteUser, UserFormData, UserProfile } from './users';

// Convert StaffForm to UserFormData for database operations
export type StaffFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  address: string;
};

// Convert User to Staff format for backward compatibility
export type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  address: string;
  role: 'manager' | 'cashier' | 'barista' | 'server';
  status: 'active' | 'inactive' | 'on-break';
  joinDate: string;
  permissions: string[];
};

// Helper function to convert UserProfile to Staff
function userToStaff(user: UserProfile): Staff {
  // Map position to role for display purposes
  const getRole = (position?: string): 'manager' | 'cashier' | 'barista' | 'server' => {
    if (!position) return 'server';
    const pos = position.toLowerCase();
    if (pos.includes('manager')) return 'manager';
    if (pos.includes('cashier')) return 'cashier';
    if (pos.includes('barista')) return 'barista';
    return 'server';
  };

  // Determine permissions based on position
  const getPermissions = (position?: string): string[] => {
    const role = getRole(position);
    switch (role) {
      case 'manager':
        return ['manage_staff', 'view_reports', 'manage_inventory'];
      case 'cashier':
        return ['handle_payments', 'take_orders', 'manage_discounts'];
      case 'barista':
        return ['make_drinks', 'take_orders'];
      case 'server':
        return ['serve_tables', 'take_orders'];
      default:
        return [];
    }
  };

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone || '',
    position: user.position || '',
    address: user.address || '',
    role: getRole(user.position),
    status: 'active', // Default status - could be extended to track actual status
    joinDate: new Date(user.created_at).toISOString().split('T')[0],
    permissions: getPermissions(user.position),
  };
}

// Helper function to convert StaffFormData to UserFormData
function staffFormToUserForm(staffForm: StaffFormData): UserFormData {
  return {
    first_name: staffForm.firstName,
    last_name: staffForm.lastName,
    email: staffForm.email,
    role: 'staff', // Default role for staff
    phone: staffForm.phone,
    position: staffForm.position,
    address: staffForm.address,
  };
}

// Get all staff members (users with role 'staff')
export async function getStaff(): Promise<Staff[]> {
  try {
    const users = await getUsers();
    // Filter only staff members and convert to Staff format
    return users
      .filter(user => user.role === 'staff')
      .map(userToStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
}

// Create a new staff member
export async function createStaff(staffData: StaffFormData): Promise<Staff> {
  try {
    const userFormData = staffFormToUserForm(staffData);
    const newUser = await createUser(userFormData);
    return userToStaff(newUser);
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
}

// Update an existing staff member
export async function updateStaff(id: number, staffData: StaffFormData): Promise<Staff> {
  try {
    const userFormData = staffFormToUserForm(staffData);
    const updatedUser = await updateUser(id, userFormData);
    return userToStaff(updatedUser);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
}

// Delete a staff member (soft delete)
export async function deleteStaff(id: number): Promise<void> {
  try {
    await deleteUser(id);
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
}