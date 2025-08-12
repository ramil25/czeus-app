import { Customer, CreateCustomerData, UpdateCustomerPointsData } from './customerService';

// Mock data for fallback when Supabase is not configured
const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', points: 120 },
  { id: 2, name: 'Bob Smith', email: 'bob@email.com', points: 85 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', points: 200 },
  { id: 4, name: 'Diana Prince', email: 'diana@email.com', points: 150 },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@email.com', points: 95 },
  { id: 6, name: 'Fiona Glenanne', email: 'fiona@email.com', points: 180 },
  { id: 7, name: 'George Miller', email: 'george@email.com', points: 60 },
  { id: 8, name: 'Hannah Lee', email: 'hannah@email.com', points: 210 },
  { id: 9, name: 'Ivan Petrov', email: 'ivan@email.com', points: 75 },
  { id: 10, name: 'Julia Roberts', email: 'julia@email.com', points: 130 },
  { id: 11, name: 'Kevin Durant', email: 'kevin@email.com', points: 110 },
  { id: 12, name: 'Linda Carter', email: 'linda@email.com', points: 170 },
  { id: 13, name: 'Mike Ross', email: 'mike@email.com', points: 140 },
  { id: 14, name: 'Nina Simone', email: 'nina@email.com', points: 155 },
  { id: 15, name: 'Oscar Wilde', email: 'oscar@email.com', points: 90 },
];

let customers: Customer[] = [...mockCustomers];

// Simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCustomers(): Promise<Customer[]> {
  await delay(500); // Simulate network delay
  return [...customers];
}

export async function createCustomer(customerData: CreateCustomerData): Promise<Customer> {
  await delay(300);
  const newCustomer: Customer = {
    id: Math.max(...customers.map(c => c.id)) + 1,
    name: customerData.name,
    email: customerData.email,
    points: customerData.points || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  customers.push(newCustomer);
  return newCustomer;
}

export async function addPointsToCustomer({ id, pointsToAdd }: UpdateCustomerPointsData): Promise<Customer> {
  await delay(300);
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }
  
  customers[customerIndex] = {
    ...customers[customerIndex],
    points: customers[customerIndex].points + pointsToAdd,
    updated_at: new Date().toISOString(),
  };
  
  return customers[customerIndex];
}

export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  await delay(300);
  const term = searchTerm.toLowerCase();
  return customers.filter(c => 
    c.name.toLowerCase().includes(term) || 
    c.email.toLowerCase().includes(term)
  );
}

export async function initializeSampleData(): Promise<void> {
  // Mock service already has sample data initialized
  return;
}