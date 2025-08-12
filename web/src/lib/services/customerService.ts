import { supabase } from '../supbaseClient';
import * as mockService from './mockCustomerService';

export interface Customer {
  id: number;
  name: string;
  email: string;
  points: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  points?: number;
}

export interface UpdateCustomerPointsData {
  id: number;
  pointsToAdd: number;
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    return !!supabase;
  } catch {
    return false;
  }
};

/**
 * Fetch all customers from the database
 */
export async function getCustomers(): Promise<Customer[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock data');
    return mockService.getCustomers();
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData: CreateCustomerData): Promise<Customer> {
  if (!isSupabaseConfigured()) {
    return mockService.createCustomer(customerData);
  }

  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customerData.name,
      email: customerData.email,
      points: customerData.points || 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    throw new Error(`Failed to create customer: ${error.message}`);
  }

  return data;
}

/**
 * Add points to a customer
 */
export async function addPointsToCustomer({ id, pointsToAdd }: UpdateCustomerPointsData): Promise<Customer> {
  if (!isSupabaseConfigured()) {
    return mockService.addPointsToCustomer({ id, pointsToAdd });
  }

  // First get the current customer data
  const { data: currentCustomer, error: fetchError } = await supabase
    .from('customers')
    .select('points')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching customer for points update:', fetchError);
    throw new Error(`Failed to fetch customer: ${fetchError.message}`);
  }

  // Calculate new points total
  const newPoints = currentCustomer.points + pointsToAdd;

  // Update the customer with new points total
  const { data, error } = await supabase
    .from('customers')
    .update({ 
      points: newPoints,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer points:', error);
    throw new Error(`Failed to update customer points: ${error.message}`);
  }

  return data;
}

/**
 * Search customers by name or email
 */
export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  if (!isSupabaseConfigured()) {
    return mockService.searchCustomers(searchTerm);
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .order('name');

  if (error) {
    console.error('Error searching customers:', error);
    throw new Error(`Failed to search customers: ${error.message}`);
  }

  return data || [];
}

/**
 * Initialize the customers table with sample data if it's empty
 */
export async function initializeSampleData(): Promise<void> {
  if (!isSupabaseConfigured()) {
    return mockService.initializeSampleData();
  }

  // Check if customers table has any data
  const { data: existingCustomers, error: checkError } = await supabase
    .from('customers')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('Error checking existing customers:', checkError);
    return;
  }

  // If there are existing customers, don't initialize
  if (existingCustomers && existingCustomers.length > 0) {
    return;
  }

  // Sample data to initialize the table
  const sampleCustomers = [
    { name: 'Alice Johnson', email: 'alice@email.com', points: 120 },
    { name: 'Bob Smith', email: 'bob@email.com', points: 85 },
    { name: 'Charlie Brown', email: 'charlie@email.com', points: 200 },
    { name: 'Diana Prince', email: 'diana@email.com', points: 150 },
    { name: 'Ethan Hunt', email: 'ethan@email.com', points: 95 },
    { name: 'Fiona Glenanne', email: 'fiona@email.com', points: 180 },
    { name: 'George Miller', email: 'george@email.com', points: 60 },
    { name: 'Hannah Lee', email: 'hannah@email.com', points: 210 },
    { name: 'Ivan Petrov', email: 'ivan@email.com', points: 75 },
    { name: 'Julia Roberts', email: 'julia@email.com', points: 130 },
    { name: 'Kevin Durant', email: 'kevin@email.com', points: 110 },
    { name: 'Linda Carter', email: 'linda@email.com', points: 170 },
    { name: 'Mike Ross', email: 'mike@email.com', points: 140 },
    { name: 'Nina Simone', email: 'nina@email.com', points: 155 },
    { name: 'Oscar Wilde', email: 'oscar@email.com', points: 90 },
  ];

  const { error } = await supabase
    .from('customers')
    .insert(sampleCustomers);

  if (error) {
    console.error('Error initializing sample data:', error);
  }
}