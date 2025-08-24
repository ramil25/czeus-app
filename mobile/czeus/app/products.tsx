import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  isActive: boolean;
  description: string;
  image?: string;
}

export default function ProductsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for products
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Espresso',
      category: 'Coffee',
      price: 2.50,
      cost: 0.75,
      stock: 50,
      sku: 'ESP001',
      isActive: true,
      description: 'Rich, bold espresso shot'
    },
    {
      id: 2,
      name: 'Cappuccino',
      category: 'Coffee',
      price: 4.00,
      cost: 1.20,
      stock: 30,
      sku: 'CAP001',
      isActive: true,
      description: 'Espresso with steamed milk and foam'
    },
    {
      id: 3,
      name: 'Croissant',
      category: 'Pastries',
      price: 3.50,
      cost: 1.00,
      stock: 20,
      sku: 'CRO001',
      isActive: true,
      description: 'Buttery, flaky pastry'
    },
    {
      id: 4,
      name: 'Chocolate Muffin',
      category: 'Pastries',
      price: 4.25,
      cost: 1.50,
      stock: 15,
      sku: 'MUF001',
      isActive: true,
      description: 'Rich chocolate chip muffin'
    },
    {
      id: 5,
      name: 'Green Tea',
      category: 'Tea',
      price: 3.00,
      cost: 0.80,
      stock: 40,
      sku: 'TEA001',
      isActive: true,
      description: 'Premium green tea blend'
    },
    {
      id: 6,
      name: 'Club Sandwich',
      category: 'Sandwiches',
      price: 8.50,
      cost: 3.00,
      stock: 10,
      sku: 'SAN001',
      isActive: true,
      description: 'Triple-layer club sandwich'
    },
    {
      id: 7,
      name: 'Caesar Salad',
      category: 'Salads',
      price: 7.75,
      cost: 2.50,
      stock: 12,
      sku: 'SAL001',
      isActive: true,
      description: 'Fresh romaine with caesar dressing'
    },
    {
      id: 8,
      name: 'Orange Juice',
      category: 'Beverages',
      price: 3.75,
      cost: 1.25,
      stock: 25,
      sku: 'BEV001',
      isActive: false,
      description: 'Freshly squeezed orange juice'
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Add new product functionality would be implemented here');
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coffee': return 'cup.and.saucer.fill';
      case 'pastries': return 'birthday.cake.fill';
      case 'tea': return 'leaf.fill';
      case 'sandwiches': return 'takeoutbag.and.cup.and.straw.fill';
      case 'salads': return 'carrot.fill';
      case 'beverages': return 'wineglass.fill';
      default: return 'shippingbox.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coffee': return '#8b5a3c';
      case 'pastries': return '#f59e0b';
      case 'tea': return '#10b981';
      case 'sandwiches': return '#ef4444';
      case 'salads': return '#22c55e';
      case 'beverages': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getCategoryBackgroundColor = (category: string) => {
    return getCategoryColor(category) + '20';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (stock <= 10) return { label: 'Low Stock', color: '#f59e0b' };
    return { label: 'In Stock', color: '#10b981' };
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol size={24} name="chevron.left" color="#3b82f6" />
            <ThemedText style={styles.backText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={styles.title}>Product Management</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your menu items, pricing, and inventory</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.productsList}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="shippingbox.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>No products found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first product to get started'}
              </ThemedText>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <View key={product.id} style={styles.productCard}>
                  <View style={[styles.productIcon, { backgroundColor: getCategoryBackgroundColor(product.category) }]}>
                    <IconSymbol size={24} name={getCategoryIcon(product.category) as any} color={getCategoryColor(product.category)} />
                  </View>
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <ThemedText type="defaultSemiBold" style={styles.productName}>
                        {product.name}
                      </ThemedText>
                      <View style={styles.priceContainer}>
                        <ThemedText style={styles.productPrice}>
                          ${product.price.toFixed(2)}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.productMeta}>
                      <View style={styles.categoryBadge}>
                        <ThemedText style={styles.categoryText}>
                          {product.category}
                        </ThemedText>
                      </View>
                      <View style={styles.skuContainer}>
                        <ThemedText style={styles.skuText}>
                          SKU: {product.sku}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.productDescription}>
                      {product.description}
                    </ThemedText>
                    <View style={styles.productDetails}>
                      <View style={styles.stockContainer}>
                        <IconSymbol size={14} name="cube.box.fill" color={stockStatus.color} />
                        <ThemedText style={[styles.stockText, { color: stockStatus.color }]}>
                          {stockStatus.label} ({product.stock})
                        </ThemedText>
                      </View>
                      <View style={styles.statusContainer}>
                        <View style={[
                          styles.statusBadge, 
                          { backgroundColor: product.isActive ? '#10b98120' : '#6b728020' }
                        ]}>
                          <ThemedText style={[
                            styles.statusText,
                            { color: product.isActive ? '#10b981' : '#6b7280' }
                          ]}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <View style={styles.profitContainer}>
                      <ThemedText style={styles.profitText}>
                        Cost: ${product.cost.toFixed(2)} • Profit: ${(product.price - product.cost).toFixed(2)}
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol size={20} name="chevron.right" color="#d1d5db" />
                </View>
              );
            })
          )}
        </View>
      </ThemedView>

      <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  skuContainer: {
    flex: 1,
  },
  skuText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  profitContainer: {
    marginTop: 4,
  },
  profitText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});