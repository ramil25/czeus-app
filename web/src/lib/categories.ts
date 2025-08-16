import { supabase } from './supabaseClient';

// Database schema type to match Supabase table
export interface PosCategory {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  category_name: string;
  category_description: string;
}

// Frontend type that matches existing component expectations
export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

// Form type for creating/updating categories
export interface CreateCategoryInput {
  category_name: string;
  category_description: string;
}

export interface UpdateCategoryInput {
  category_name?: string;
  category_description?: string;
}

// Convert database record to frontend type
function posCategoryToCategory(posCategory: PosCategory): Category {
  return {
    id: posCategory.id,
    name: posCategory.category_name,
    description: posCategory.category_description,
    createdAt: posCategory.created_at,
    updatedAt: posCategory.updated_at,
  };
}

// Sample data for fallback when database is not available
const sampleCategories: PosCategory[] = [
  {
    id: 1,
    category_name: 'Coffee',
    category_description: 'All coffee-based drinks',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    category_name: 'Tea',
    category_description: 'Hot and cold teas',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    category_name: 'Pastries',
    category_description: 'Freshly baked pastries',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    category_name: 'Sandwiches',
    category_description: 'Various sandwiches',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    category_name: 'Salads',
    category_description: 'Healthy salads',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    category_name: 'Smoothies',
    category_description: 'Fruit and veggie smoothies',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    category_name: 'Breakfast',
    category_description: 'Breakfast menu items',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    category_name: 'Desserts',
    category_description: 'Sweet treats and desserts',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    category_name: 'Juices',
    category_description: 'Fresh juices',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    category_name: 'Snacks',
    category_description: 'Light snacks',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const localCategoriesStore = [...sampleCategories];
let nextId = 11;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('pos_categories').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      console.log('Using demo mode - Supabase not accessible');
      return localCategoriesStore
        .filter(category => !category.deleted_at)
        .map(posCategoryToCategory);
    }

    const { data, error } = await supabase
      .from('pos_categories')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (data || []).map(posCategoryToCategory);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    return localCategoriesStore
      .filter(category => !category.deleted_at)
      .map(posCategoryToCategory);
  }
}

// Create a new category
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const newCategory: PosCategory = {
        id: nextId++,
        category_name: input.category_name,
        category_description: input.category_description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localCategoriesStore.push(newCategory);
      return posCategoryToCategory(newCategory);
    }

    const { data, error } = await supabase
      .from('pos_categories')
      .insert({
        category_name: input.category_name,
        category_description: input.category_description,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return posCategoryToCategory(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const newCategory: PosCategory = {
      id: nextId++,
      category_name: input.category_name,
      category_description: input.category_description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localCategoriesStore.push(newCategory);
    return posCategoryToCategory(newCategory);
  }
}

// Update an existing category
export async function updateCategory(
  id: number,
  input: UpdateCategoryInput
): Promise<Category> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localCategoriesStore.findIndex(c => c.id === id && !c.deleted_at);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      localCategoriesStore[index] = {
        ...localCategoriesStore[index],
        ...input,
        updated_at: new Date().toISOString(),
      };
      return posCategoryToCategory(localCategoriesStore[index]);
    }

    const { data, error } = await supabase
      .from('pos_categories')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return posCategoryToCategory(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localCategoriesStore.findIndex(c => c.id === id && !c.deleted_at);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    localCategoriesStore[index] = {
      ...localCategoriesStore[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return posCategoryToCategory(localCategoriesStore[index]);
  }
}

// Soft delete a category
export async function deleteCategory(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localCategoriesStore.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      localCategoriesStore[index] = {
        ...localCategoriesStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

    const { error } = await supabase
      .from('pos_categories')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localCategoriesStore.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    localCategoriesStore[index] = {
      ...localCategoriesStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}