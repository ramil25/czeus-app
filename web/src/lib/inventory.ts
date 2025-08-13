import { supabase } from './supbaseClient';

// Database schema type to match Supabase table
export type InventoryItem = {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  item_name: string;
  item_category: string;
  item_qty: number;
  unit_measure: string;
};

// Form type for creating/updating inventory items
export type InventoryFormData = {
  item_name: string;
  item_category: string;
  item_qty: number;
  unit_measure: string;
};

// Sample data for fallback when database is not available
const sampleInventory: InventoryItem[] = [
  {
    id: 1,
    item_name: 'Espresso Beans',
    item_category: 'Coffee',
    item_qty: 50,
    unit_measure: 'kg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    item_name: 'Milk',
    item_category: 'Dairy',
    item_qty: 30,
    unit_measure: 'L',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    item_name: 'Sugar',
    item_category: 'Condiment',
    item_qty: 20,
    unit_measure: 'kg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Local storage for demo mode  
const initialInventory = [...sampleInventory];
// eslint-disable-next-line prefer-const
let localInventoryStore = initialInventory;
let nextId = 4;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('inventories').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted inventory items
export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      console.log('Using demo mode - Supabase not accessible');
      return localInventoryStore.filter(item => !item.deleted_at);
    }

    const { data, error } = await supabase
      .from('inventories')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch inventory items: ${error.message}`);
    }

    return data || [];
  } catch {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error');
    return localInventoryStore.filter(item => !item.deleted_at);
  }
}

// Create a new inventory item
export async function createInventoryItem(item: InventoryFormData): Promise<InventoryItem> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const newItem: InventoryItem = {
        id: nextId++,
        item_name: item.item_name,
        item_category: item.item_category,
        item_qty: item.item_qty,
        unit_measure: item.unit_measure,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localInventoryStore.push(newItem);
      return newItem;
    }

    const { data, error } = await supabase
      .from('inventories')
      .insert({
        item_name: item.item_name,
        item_category: item.item_category,
        item_qty: item.item_qty,
        unit_measure: item.unit_measure,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create inventory item: ${error.message}`);
    }

    return data;
  } catch {
    // Fallback to demo mode if there's any error
    const newItem: InventoryItem = {
      id: nextId++,
      item_name: item.item_name,
      item_category: item.item_category,
      item_qty: item.item_qty,
      unit_measure: item.unit_measure,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localInventoryStore.push(newItem);
    return newItem;
  }
}

// Update an existing inventory item
export async function updateInventoryItem(id: number, item: InventoryFormData): Promise<InventoryItem> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localInventoryStore.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      const updatedItem = {
        ...localInventoryStore[index],
        item_name: item.item_name,
        item_category: item.item_category,
        item_qty: item.item_qty,
        unit_measure: item.unit_measure,
        updated_at: new Date().toISOString(),
      };
      
      localInventoryStore[index] = updatedItem;
      return updatedItem;
    }

    const { data, error } = await supabase
      .from('inventories')
      .update({
        item_name: item.item_name,
        item_category: item.item_category,
        item_qty: item.item_qty,
        unit_measure: item.unit_measure,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update inventory item: ${error.message}`);
    }

    return data;
  } catch {
    // Fallback to demo mode if there's any error
    const index = localInventoryStore.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const updatedItem = {
      ...localInventoryStore[index],
      item_name: item.item_name,
      item_category: item.item_category,
      item_qty: item.item_qty,
      unit_measure: item.unit_measure,
      updated_at: new Date().toISOString(),
    };
    
    localInventoryStore[index] = updatedItem;
    return updatedItem;
  }
}

// Soft delete an inventory item
export async function deleteInventoryItem(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localInventoryStore.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      localInventoryStore[index] = {
        ...localInventoryStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

    const { error } = await supabase
      .from('inventories')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete inventory item: ${error.message}`);
    }
  } catch {
    // Fallback to demo mode if there's any error
    const index = localInventoryStore.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    localInventoryStore[index] = {
      ...localInventoryStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}