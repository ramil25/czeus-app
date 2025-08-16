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

// Frontend type that matches existing component expectations
export interface Size {
  id: number;
  sizeName: string;
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

// Extended size type with category details for frontend display
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
    sizeName: sizeWithCategory.size_name,
    categoryId: sizeWithCategory.category_id,
    categoryName: sizeWithCategory.pos_categories?.category_name || 'Unknown',
    createdAt: sizeWithCategory.created_at,
    updatedAt: sizeWithCategory.updated_at,
  };
}

// Sample data for fallback when database is not available
const sampleSizes: SizeWithCategory[] = [
  {
    id: 1,
    size_name: 'Small',
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
  },
  {
    id: 2,
    size_name: 'Medium',
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
  },
  {
    id: 3,
    size_name: 'Large',
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
  },
  {
    id: 4,
    size_name: 'Regular',
    category_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
  },
  {
    id: 5,
    size_name: 'Large',
    category_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
  },
  {
    id: 6,
    size_name: 'Slice',
    category_id: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
  },
  {
    id: 7,
    size_name: 'Whole',
    category_id: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
  },
  {
    id: 8,
    size_name: 'Single',
    category_id: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
  },
  {
    id: 9,
    size_name: 'Double',
    category_id: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
  },
  {
    id: 10,
    size_name: 'Bowl',
    category_id: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
  },
];

const localSizesStore = [...sampleSizes];
let nextId = 11;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('pos_sizes').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted sizes with category information
export async function fetchSizes(): Promise<Size[]> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      console.log('Using demo mode - Supabase not accessible');
      return localSizesStore
        .filter(size => !size.deleted_at)
        .map(posSizeToSize);
    }

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
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    return localSizesStore
      .filter(size => !size.deleted_at)
      .map(posSizeToSize);
  }
}

// Create a new size
export async function createSize(input: CreateSizeInput): Promise<Size> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      // Find the category for demo display
      const categoryMap = {
        1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
        2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
        3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
        4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
        5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
      };
      
      const newSize: SizeWithCategory = {
        id: nextId++,
        size_name: input.size_name,
        category_id: input.category_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pos_categories: categoryMap[input.category_id as keyof typeof categoryMap] || 
          { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' },
      };
      localSizesStore.push(newSize);
      return posSizeToSize(newSize);
    }

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
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const categoryMap = {
      1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
      2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
      3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
      4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
      5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
    };
    
    const newSize: SizeWithCategory = {
      id: nextId++,
      size_name: input.size_name,
      category_id: input.category_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pos_categories: categoryMap[input.category_id as keyof typeof categoryMap] || 
        { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' },
    };
    localSizesStore.push(newSize);
    return posSizeToSize(newSize);
  }
}

// Update an existing size
export async function updateSize(
  id: number,
  input: UpdateSizeInput
): Promise<Size> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localSizesStore.findIndex(s => s.id === id && !s.deleted_at);
      if (index === -1) {
        throw new Error('Size not found');
      }
      
      localSizesStore[index] = {
        ...localSizesStore[index],
        size_name: input.size_name || localSizesStore[index].size_name,
        category_id: input.category_id || localSizesStore[index].category_id,
        updated_at: new Date().toISOString(),
      };
      
      // Update category info if category_id changed
      if (input.category_id) {
        const categoryMap = {
          1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
          2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
          3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
          4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
          5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
        };
        localSizesStore[index].pos_categories = categoryMap[input.category_id as keyof typeof categoryMap] || 
          { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' };
      }
      
      return posSizeToSize(localSizesStore[index]);
    }

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
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localSizesStore.findIndex(s => s.id === id && !s.deleted_at);
    if (index === -1) {
      throw new Error('Size not found');
    }
    
    localSizesStore[index] = {
      ...localSizesStore[index],
      size_name: input.size_name || localSizesStore[index].size_name,
      category_id: input.category_id || localSizesStore[index].category_id,
      updated_at: new Date().toISOString(),
    };
    
    // Update category info if category_id changed
    if (input.category_id) {
      const categoryMap = {
        1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
        2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
        3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
        4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
        5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
      };
      localSizesStore[index].pos_categories = categoryMap[input.category_id as keyof typeof categoryMap] || 
        { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' };
    }
    
    return posSizeToSize(localSizesStore[index]);
  }
}

// Soft delete a size
export async function deleteSize(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localSizesStore.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('Size not found');
      }
      
      localSizesStore[index] = {
        ...localSizesStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

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
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localSizesStore.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Size not found');
    }
    
    localSizesStore[index] = {
      ...localSizesStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}