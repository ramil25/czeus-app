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

// Get all non-deleted inventory items
export async function getInventoryItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventories')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch inventory items: ${error.message}`);
  }

  return data || [];
}

// Create a new inventory item
export async function createInventoryItem(item: InventoryFormData): Promise<InventoryItem> {
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
}

// Update an existing inventory item
export async function updateInventoryItem(id: number, item: InventoryFormData): Promise<InventoryItem> {
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
}

// Soft delete an inventory item
export async function deleteInventoryItem(id: number): Promise<void> {
  const { error } = await supabase
    .from('inventories')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete inventory item: ${error.message}`);
  }
}