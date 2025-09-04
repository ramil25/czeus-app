import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  UserFormData,
  UserProfile,
} from './users';

// Convert CustomerForm to UserFormData for database operations
export type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  birthDay?: string;
};

// Convert User to Customer format for display
export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDay: string | null;
  joinDate: string;
  status: 'active' | 'inactive';
  totalPoints: number;
  totalOrders: number;
};

// Helper function to convert UserProfile to Customer
function userToCustomer(user: UserProfile): Customer {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    birthDay: user.birth_day || null,
    joinDate: new Date(user.created_at).toISOString().split('T')[0],
    status: 'active', // Default status - could be extended to track actual status
    totalPoints: 0, // TODO: Could be extended to calculate from points table
    totalOrders: 0, // TODO: Could be extended to calculate from orders table
  };
}

// Helper function to convert CustomerFormData to UserFormData
function customerFormToUserForm(customerForm: CustomerFormData): UserFormData {
  return {
    first_name: customerForm.firstName,
    last_name: customerForm.lastName,
    email: customerForm.email,
    role: 'customer', // Default role for customers
    phone: customerForm.phone,
    address: customerForm.address,
    birth_day: customerForm.birthDay,
  };
}

// Get all customers (users with role 'customer')
export async function getCustomers(): Promise<Customer[]> {
  try {
    const users = await getUsers();
    // Filter only customers and convert to Customer format
    return users.filter((user) => user.role === 'customer').map(userToCustomer);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Create a new customer with auto-verified auth signup
export async function createCustomer(
  customerData: CustomerFormData
): Promise<Customer> {
  try {
    const userFormData = customerFormToUserForm(customerData);
    const newUser = await createUser(userFormData);
    return userToCustomer(newUser);
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

// Update an existing customer (email and role are not editable)
export async function updateCustomer(
  id: number,
  customerData: Omit<CustomerFormData, 'email'>
): Promise<Customer> {
  try {
    // Get current user data to preserve email and role
    const users = await getUsers();
    const existingUser = users.find((user) => user.id === id);

    if (!existingUser) {
      throw new Error('Customer not found');
    }

    const userFormData: UserFormData = {
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      email: existingUser.email, // Preserve existing email
      role: existingUser.role, // Preserve existing role
      phone: customerData.phone,
      address: customerData.address,
      birth_day: customerData.birthDay,
    };

    const updatedUser = await updateUser(id, userFormData);
    return userToCustomer(updatedUser);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

// Delete a customer (soft delete)
export async function deleteCustomer(id: number): Promise<void> {
  try {
    await deleteUser(id);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
