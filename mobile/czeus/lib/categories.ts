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

// Frontend type that matches existing mobile component expectations
export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  itemCount: number;
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

// Default icon mapping for categories
const getDefaultCategoryIcon = (name: string): { icon: string; color: string; backgroundColor: string } => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('coffee')) {
    return { icon: 'cup.and.saucer.fill', color: '#8b5a3c', backgroundColor: '#8b5a3c20' };
  } else if (lowercaseName.includes('tea')) {
    return { icon: 'leaf.fill', color: '#10b981', backgroundColor: '#10b98120' };
  } else if (lowercaseName.includes('pastry') || lowercaseName.includes('pastries') || lowercaseName.includes('dessert')) {
    return { icon: 'birthday.cake.fill', color: '#f59e0b', backgroundColor: '#f59e0b20' };
  } else if (lowercaseName.includes('sandwich') || lowercaseName.includes('food')) {
    return { icon: 'takeoutbag.and.cup.and.straw', color: '#ef4444', backgroundColor: '#ef444420' };
  } else if (lowercaseName.includes('salad') || lowercaseName.includes('healthy')) {
    return { icon: 'carrot', color: '#22c55e', backgroundColor: '#22c55e20' };
  } else if (lowercaseName.includes('beverage') || lowercaseName.includes('drink') || lowercaseName.includes('juice')) {
    return { icon: 'waterbottle', color: '#3b82f6', backgroundColor: '#3b82f620' };
  } else if (lowercaseName.includes('snack')) {
    return { icon: 'bag.fill', color: '#8b5cf6', backgroundColor: '#8b5cf620' };
  } else if (lowercaseName.includes('breakfast')) {
    return { icon: 'sun.max.fill', color: '#f97316', backgroundColor: '#f9731620' };
  } else if (lowercaseName.includes('smoothie')) {
    return { icon: 'drop.fill', color: '#06b6d4', backgroundColor: '#06b6d420' };
  }
  
  // Default fallback
  return { icon: 'square.grid.2x2', color: '#6b7280', backgroundColor: '#6b728020' };
};

// Convert database record to frontend type
function posCategoryToCategory(posCategory: PosCategory): Category {
  const iconData = getDefaultCategoryIcon(posCategory.category_name);
  
  return {
    id: posCategory.id,
    name: posCategory.category_name,
    description: posCategory.category_description,
    icon: iconData.icon,
    color: iconData.color,
    backgroundColor: iconData.backgroundColor,
    itemCount: 0, // TODO: This could be calculated from products table in the future
  };
}

// Get all non-deleted categories
export async function fetchCategories(): Promise<Category[]> {
  try {
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
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Create a new category
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  try {
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
    console.error('Error creating category:', error);
    throw error;
  }
}

// Update an existing category
export async function updateCategory(
  id: number,
  input: UpdateCategoryInput
): Promise<Category> {
  try {
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
    console.error('Error updating category:', error);
    throw error;
  }
}

// Soft delete a category
export async function deleteCategory(id: number): Promise<void> {
  try {
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
    console.error('Error deleting category:', error);
    throw error;
  }
}