import { createUser, getUsers, updateUser, deleteUser, UserFormData, User } from './users';

// Convert CustomerForm to UserFormData for database operations
export type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

// Convert User to Customer format for backward compatibility
export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

// Helper function to convert User to Customer
function userToCustomer(user: User): Customer {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    createdAt: user.created_at,
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
  };
}

// Get all customers (users with role 'customer')
export async function getCustomers(): Promise<Customer[]> {
  try {
    const users = await getUsers();
    // Filter only customers and convert to Customer format
    return users
      .filter(user => user.role === 'customer')
      .map(userToCustomer);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Create a new customer
export async function createCustomer(customerData: CustomerFormData): Promise<Customer> {
  try {
    const userFormData = customerFormToUserForm(customerData);
    const newUser = await createUser(userFormData);
    return userToCustomer(newUser);
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

// Update an existing customer
export async function updateCustomer(id: number, customerData: CustomerFormData): Promise<Customer> {
  try {
    const userFormData = customerFormToUserForm(customerData);
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