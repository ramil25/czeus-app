import { supabase } from './supabaseClient';

// Database schema type to match Supabase table
export interface PosSize {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  size_name: string;
  category_id: number;
}

// Frontend type that matches mobile component expectations
export interface Size {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
}

// Form type for creating/updating sizes
export interface CreateSizeInput {
  size_name: string;
  category_id: number;
}

export interface UpdateSizeInput {
  size_name?: string;
  category_id?: number;
}

// Extended size type with category details for database queries
export interface SizeWithCategory extends PosSize {
  pos_categories?: {
    id: number;
    category_name: string;
    category_description: string;
  };
}

// Convert database record to frontend type
function posSizeToSize(sizeWithCategory: SizeWithCategory): Size {
  return {
    id: sizeWithCategory.id,
    name: sizeWithCategory.size_name,
    categoryId: sizeWithCategory.category_id,
    categoryName: sizeWithCategory.pos_categories?.category_name || 'Unknown',
    createdAt: sizeWithCategory.created_at,
    updatedAt: sizeWithCategory.updated_at,
  };
}

// Get all non-deleted sizes with category information
export async function fetchSizes(): Promise<Size[]> {
  try {
    const { data, error } = await supabase
      .from('pos_sizes')
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch sizes: ${error.message}`);
    }

    return (data || []).map(posSizeToSize);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    throw error;
  }
}

// Create a new size
export async function createSize(input: CreateSizeInput): Promise<Size> {
  try {
    const { data, error } = await supabase
      .from('pos_sizes')
      .insert({
        size_name: input.size_name,
        category_id: input.category_id,
      })
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create size: ${error.message}`);
    }

    return posSizeToSize(data);
  } catch (error) {
    console.error('Error creating size:', error);
    throw error;
  }
}

// Update an existing size
export async function updateSize(
  id: number,
  input: UpdateSizeInput
): Promise<Size> {
  try {
    const { data, error } = await supabase
      .from('pos_sizes')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update size: ${error.message}`);
    }

    return posSizeToSize(data);
  } catch (error) {
    console.error('Error updating size:', error);
    throw error;
  }
}

// Soft delete a size
export async function deleteSize(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('pos_sizes')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete size: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting size:', error);
    throw error;
  }
}