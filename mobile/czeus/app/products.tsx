import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/products';
import AddProductModal from '@/components/modals/AddProductModal';
import EditProductModal from '@/components/modals/EditProductModal';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    products,
    loading,
    error,
    refreshProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
  } = useProducts();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.size.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setAddModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  const getCategoryIcon = (category: string) => {
    const lowercaseName = category.toLowerCase();
    
    if (lowercaseName.includes('coffee')) {
      return 'cup.and.saucer.fill';
    } else if (lowercaseName.includes('tea')) {
      return 'leaf.fill';
    } else if (lowercaseName.includes('pastries') || lowercaseName.includes('pastry')) {
      return 'birthday.cake.fill';
    } else if (lowercaseName.includes('sandwich')) {
      return 'takeoutbag.and.cup.and.straw.fill';
    } else if (lowercaseName.includes('salad')) {
      return 'carrot.fill';
    } else if (lowercaseName.includes('beverage')) {
      return 'wineglass.fill';
    } else {
      return 'shippingbox.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    const lowercaseName = category.toLowerCase();
    
    if (lowercaseName.includes('coffee')) {
      return '#8b5a3c';
    } else if (lowercaseName.includes('tea')) {
      return '#10b981';
    } else if (lowercaseName.includes('pastries') || lowercaseName.includes('pastry')) {
      return '#f59e0b';
    } else if (lowercaseName.includes('sandwich')) {
      return '#ef4444';
    } else if (lowercaseName.includes('salad')) {
      return '#22c55e';
    } else if (lowercaseName.includes('beverage')) {
      return '#3b82f6';
    } else {
      return '#6b7280';
    }
  };

  const getCategoryBackgroundColor = (category: string) => {
    return getCategoryColor(category) + '20';
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol
                  size={20}
                  name="xmark.circle.fill"
                  color="#6b7280"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <IconSymbol
              size={20}
              name="exclamationmark.triangle"
              color="#ef4444"
            />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
              onPress={refreshProducts}
              style={styles.retryButton}
            >
              <ThemedText style={styles.retryText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshProducts}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          {loading && products.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <ThemedText style={styles.loadingText}>
                Loading products...
              </ThemedText>
            </View>
          ) : (
            <>
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productItem}
                  onPress={() => handleEditProduct(product)}
                  activeOpacity={0.7}
                >
                  {/* Product Image or Icon */}
                  <View style={styles.productImageContainer}>
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                    ) : (
                      <View
                        style={[
                          styles.productIcon,
                          { backgroundColor: getCategoryBackgroundColor(product.category) },
                        ]}
                      >
                        <IconSymbol
                          size={24}
                          name={getCategoryIcon(product.category) as any}
                          color={getCategoryColor(product.category)}
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.productName}
                      >
                        {product.name}
                      </ThemedText>
                      <View style={styles.priceContainer}>
                        <ThemedText style={styles.productPrice}>
                          ₱{product.price.toFixed(2)}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.productMeta}>
                      <View style={styles.categoryBadge}>
                        <ThemedText style={styles.categoryText}>
                          {product.category}
                        </ThemedText>
                      </View>
                      <View style={styles.sizeBadge}>
                        <ThemedText style={styles.sizeText}>
                          {product.size}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: product.status === 'Available' ? '#10b98120' : '#ef444420' }
                      ]}>
                        <ThemedText style={[
                          styles.statusText,
                          { color: product.status === 'Available' ? '#10b981' : '#ef4444' }
                        ]}>
                          {product.status}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <IconSymbol size={16} name="chevron.right" color="#6b7280" />
                </TouchableOpacity>
              ))}

              {filteredProducts.length === 0 && !loading && (
                <View style={styles.emptyState}>
                  <IconSymbol
                    size={48}
                    name="shippingbox.fill"
                    color="#d1d5db"
                  />
                  <ThemedText style={styles.emptyText}>
                    {searchQuery
                      ? 'No products found'
                      : 'No products available'}
                  </ThemedText>
                  <ThemedText style={styles.emptySubtext}>
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'Add your first product to get started'}
                  </ThemedText>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddProduct}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <AddProductModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={createNewProduct}
      />

      <EditProductModal
        visible={editModalVisible}
        product={selectedProduct}
        onClose={handleCloseEditModal}
        onUpdate={updateExistingProduct}
        onDelete={deleteExistingProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  productsList: {
    flex: 1,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sizeBadge: {
    backgroundColor: '#ddd6fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sizeText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc2626',
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});