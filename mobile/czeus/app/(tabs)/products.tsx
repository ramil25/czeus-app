import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductsScreen() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Sample Product", price: 100, stock: 50, category: "General" }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

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
                <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
                <ThemedText style={styles.productCategory}>{product.category}</ThemedText>
                <View style={styles.productDetails}>
                  <ThemedText style={styles.productPrice}>₱{product.price.toFixed(2)}</ThemedText>
                  <ThemedText style={styles.productStock}>Stock: {product.stock}</ThemedText>
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  productDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  productPrice: {
    fontWeight: '600',
    color: '#10b981',
  },
  productStock: {
    fontSize: 14,
    color: '#6b7280',
  },
  editButton: {
    padding: 8,
  },
});