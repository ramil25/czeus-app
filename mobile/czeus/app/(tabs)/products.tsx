import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsScreen() {
  const { products, loading, error } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2362c7" />
        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol size={64} name="exclamationmark.triangle" color="#ef4444" />
        <ThemedText style={styles.errorText}>Failed to load products</ThemedText>
        <ThemedText style={styles.errorSubtext}>Please try again later</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Products</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <IconSymbol size={20} name="plus" color="#fff" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </ThemedView>

      {showAddForm && (
        <ThemedView style={styles.addForm}>
          <ThemedText type="subtitle">Add New Product</ThemedText>
          <View style={styles.formActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      )}

      <ThemedView style={styles.productsList}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Products ({products.length})
        </ThemedText>
        
        {products.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol size={64} name="cube.box" color="#9ca3af" />
            <ThemedText style={styles.emptyText}>No products yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Add your first product to get started
            </ThemedText>
          </ThemedView>
        ) : (
          products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
                  <View style={[
                    styles.statusBadge,
                    product.status === 'Available' ? styles.availableBadge : styles.outOfStockBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      product.status === 'Available' ? styles.availableText : styles.outOfStockText
                    ]}>
                      {product.status}
                    </Text>
                  </View>
                </View>
                <ThemedText style={styles.productCategory}>{product.category}</ThemedText>
                <View style={styles.productDetails}>
                  <ThemedText style={styles.productPrice}>₱{product.price.toFixed(2)}</ThemedText>
                  <ThemedText style={[
                    styles.productStock,
                    product.status === 'Not Available' && styles.outOfStock
                  ]}>
                    Status: {product.status}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <IconSymbol size={20} name="pencil" color="#6b7280" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2362c7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addForm: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#6b7280',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2362c7',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#dcfce7',
  },
  outOfStockBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#16a34a',
  },
  outOfStockText: {
    color: '#dc2626',
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  productPrice: {
    fontWeight: '600',
    color: '#10b981',
  },
  productStock: {
    fontSize: 14,
    color: '#6b7280',
  },
  lowStock: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  outOfStock: {
    color: '#dc2626',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
});