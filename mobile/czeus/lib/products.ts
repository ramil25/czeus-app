// Mobile-optimized product data layer
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'Available' | 'Out of Stock';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  image?: string;
}

// Sample data for demo
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Cappuccino',
    price: 120,
    stock: 45,
    category: 'Coffee',
    status: 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Latte',
    price: 130,
    stock: 32,
    category: 'Coffee',
    status: 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Green Tea',
    price: 110,
    stock: 8,
    category: 'Tea',
    status: 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Blueberry Muffin',
    price: 70,
    stock: 0,
    category: 'Pastries',
    status: 'Out of Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Ham Sandwich',
    price: 180,
    stock: 15,
    category: 'Sandwiches',
    status: 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Local storage for demo
let productsStore = [...sampleProducts];
let nextId = 6;

// Get all products
export async function fetchProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return productsStore.filter(p => p.status !== 'Deleted');
}

// Create a new product
export async function createProduct(input: CreateProductInput): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newProduct: Product = {
    id: nextId++,
    name: input.name,
    price: input.price,
    stock: input.stock,
    category: input.category,
    status: input.stock > 0 ? 'Available' : 'Out of Stock',
    image: input.image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  productsStore.push(newProduct);
  return newProduct;
}

// Update a product
export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  const updated = {
    ...productsStore[index],
    ...input,
    status: (input.stock !== undefined ? input.stock : productsStore[index].stock) > 0 
      ? 'Available' as const 
      : 'Out of Stock' as const,
    updatedAt: new Date().toISOString(),
  };
  
  productsStore[index] = updated;
  return updated;
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  productsStore[index] = {
    ...productsStore[index],
    status: 'Deleted' as any,
    updatedAt: new Date().toISOString(),
  };
}

// Get categories
export async function getCategories(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const categories = [...new Set(productsStore.map(p => p.category))];
  return categories.filter(Boolean);
}