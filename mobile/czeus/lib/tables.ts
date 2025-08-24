import { supabase } from './supabaseClient';

// Database schema type to match Supabase table
export interface PosTable {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  table_name: string;
  number_of_seats: number;
}

// Mobile UI type that matches existing component expectations
export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  description: string;
}

// Form type for creating/updating tables
export interface CreateTableInput {
  table_name: string;
  number_of_seats: number;
}

export interface UpdateTableInput {
  table_name?: string;
  number_of_seats?: number;
}

// Convert database record to mobile UI type
function posTableToTable(posTable: PosTable): Table {
  return {
    id: posTable.id,
    name: posTable.table_name,
    capacity: posTable.number_of_seats,
    status: 'available', // Default status, can be enhanced later
    description: `Table ${posTable.table_name} for ${posTable.number_of_seats} people`,
  };
}

// Sample data for fallback when database is not available
const sampleTables: PosTable[] = [
  {
    id: 1,
    table_name: 'Table 1',
    number_of_seats: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    table_name: 'Table 2',
    number_of_seats: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    table_name: 'Table 3',
    number_of_seats: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    table_name: 'Table 4',
    number_of_seats: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    table_name: 'Table 5',
    number_of_seats: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    table_name: 'VIP Table',
    number_of_seats: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const localTablesStore = [...sampleTables];
let nextId = 7;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('pos_tables').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted tables
export async function fetchTables(): Promise<Table[]> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      console.log('Tables: Using demo mode - Supabase not accessible');
      return localTablesStore
        .filter(table => !table.deleted_at)
        .map(posTableToTable);
    }

    const { data, error } = await supabase
      .from('pos_tables')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tables: ${error.message}`);
    }

    return (data || []).map(posTableToTable);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Tables: Falling back to demo mode due to error:', error);
    return localTablesStore
      .filter(table => !table.deleted_at)
      .map(posTableToTable);
  }
}

// Create a new table
export async function createTable(input: CreateTableInput): Promise<Table> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const newTable: PosTable = {
        id: nextId++,
        table_name: input.table_name,
        number_of_seats: input.number_of_seats,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localTablesStore.push(newTable);
      return posTableToTable(newTable);
    }

    const { data, error } = await supabase
      .from('pos_tables')
      .insert({
        table_name: input.table_name,
        number_of_seats: input.number_of_seats,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create table: ${error.message}`);
    }

    return posTableToTable(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Tables: Falling back to demo mode due to error:', error);
    const newTable: PosTable = {
      id: nextId++,
      table_name: input.table_name,
      number_of_seats: input.number_of_seats,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localTablesStore.push(newTable);
    return posTableToTable(newTable);
  }
}

// Update an existing table
export async function updateTable(
  id: number,
  input: UpdateTableInput
): Promise<Table> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localTablesStore.findIndex(t => t.id === id && !t.deleted_at);
      if (index === -1) {
        throw new Error('Table not found');
      }
      
      localTablesStore[index] = {
        ...localTablesStore[index],
        ...input,
        updated_at: new Date().toISOString(),
      };
      return posTableToTable(localTablesStore[index]);
    }

    const { data, error } = await supabase
      .from('pos_tables')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update table: ${error.message}`);
    }

    return posTableToTable(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Tables: Falling back to demo mode due to error:', error);
    const index = localTablesStore.findIndex(t => t.id === id && !t.deleted_at);
    if (index === -1) {
      throw new Error('Table not found');
    }
    
    localTablesStore[index] = {
      ...localTablesStore[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return posTableToTable(localTablesStore[index]);
  }
}

// Soft delete a table
export async function deleteTable(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localTablesStore.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Table not found');
      }
      
      localTablesStore[index] = {
        ...localTablesStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

    const { error } = await supabase
      .from('pos_tables')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete table: ${error.message}`);
    }
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Tables: Falling back to demo mode due to error:', error);
    const index = localTablesStore.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Table not found');
    }
    
    localTablesStore[index] = {
      ...localTablesStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}