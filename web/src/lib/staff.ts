import { createUser, getUsers, updateUser, deleteUser, UserFormData, User } from './users';

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
  createdAt: string;
};

// Helper function to convert User to Staff
function userToStaff(user: User): Staff {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone || '',
    position: user.position || '',
    address: user.address || '',
    createdAt: user.created_at,
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