import { supabase } from './supabaseClient';

// Database schema type to match Supabase table
export interface DbProduct {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  product_name: string;
  category_id: number;
  size_id: number;
  price: number;
  status: 'available' | 'not available';
  image_url?: string;
}

// Extended product type with category and size details
export interface ProductWithDetails extends DbProduct {
  pos_categories?: {
    id: number;
    category_name: string;
    category_description: string;
  };
  pos_sizes?: {
    id: number;
    size_name: string;
    category_id: number;
  };
}

// Frontend type that matches mobile component expectations
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryId: number;
  size: string;
  sizeId: number;
  status: 'Available' | 'Not Available';
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  product_name: string;
  category_id: number;
  size_id: number;
  price: number;
  status: 'available' | 'not available';
  image_url?: string;
}

export interface UpdateProductInput {
  product_name?: string;
  category_id?: number;
  size_id?: number;
  price?: number;
  status?: 'available' | 'not available';
  image_url?: string;
}

// Convert database record to frontend type
function dbProductToProduct(productWithDetails: ProductWithDetails): Product {
  return {
    id: productWithDetails.id,
    name: productWithDetails.product_name,
    price: productWithDetails.price,
    category: productWithDetails.pos_categories?.category_name || 'Unknown',
    categoryId: productWithDetails.category_id,
    size: productWithDetails.pos_sizes?.size_name || 'Unknown',
    sizeId: productWithDetails.size_id,
    status: productWithDetails.status === 'available' ? 'Available' : 'Not Available',
    image: productWithDetails.image_url,
    createdAt: productWithDetails.created_at,
    updatedAt: productWithDetails.updated_at,
  };
}

// Get all non-deleted products with category and size information
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return (data || []).map(dbProductToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Create a new product
export async function createProduct(input: CreateProductInput): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: input.product_name,
        category_id: input.category_id,
        size_id: input.size_id,
        price: input.price,
        status: input.status,
        image_url: input.image_url,
      })
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return dbProductToProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update an existing product
export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
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
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return dbProductToProduct(data);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Soft delete a product
export async function deleteProduct(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}