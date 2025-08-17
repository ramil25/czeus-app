import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface InventoryItem {
  id: number;
  name: string;
  currentStock: number;
  minStock: number;
  category: string;
  lastUpdated: string;
}

export default function InventoryScreen() {
  const [inventory] = useState<InventoryItem[]>([
    { 
      id: 1, 
      name: "Sample Product", 
      currentStock: 50, 
      minStock: 10, 
      category: "General",
      lastUpdated: new Date().toLocaleDateString()
    }
  ]);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Inventory</ThemedText>
        <TouchableOpacity style={styles.updateButton}>
          <IconSymbol size={20} name="arrow.clockwise" color="#fff" />
          <Text style={styles.updateButtonText}>Update Stock</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              {totalItems}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Items</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              {inventory.length}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Product Types</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={[styles.summaryValue, lowStockItems.length > 0 && styles.lowStockWarning]}>
              {lowStockItems.length}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Low Stock</ThemedText>
          </View>
        </View>
      </ThemedView>

      {lowStockItems.length > 0 && (
        <ThemedView style={styles.alertContainer}>
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#f59e0b" />
              <ThemedText type="defaultSemiBold" style={styles.alertTitle}>
                Low Stock Alert
              </ThemedText>
            </View>
            <ThemedText style={styles.alertText}>
              {lowStockItems.length} item(s) are running low on stock
            </ThemedText>
          </View>
        </ThemedView>
      )}

      <ThemedView style={styles.inventoryList}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Inventory Items
        </ThemedText>
        
        {inventory.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol size={64} name="archivebox" color="#9ca3af" />
            <ThemedText style={styles.emptyText}>No inventory items</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Add products to start tracking inventory
            </ThemedText>
          </ThemedView>
        ) : (
          inventory.map((item) => (
            <View key={item.id} style={styles.inventoryCard}>
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  {item.currentStock <= item.minStock && (
                    <View style={styles.lowStockBadge}>
                      <Text style={styles.lowStockText}>Low Stock</Text>
                    </View>
                  )}
                </View>
                <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
                <View style={styles.stockInfo}>
                  <View style={styles.stockItem}>
                    <ThemedText style={styles.stockLabel}>Current:</ThemedText>
                    <ThemedText style={[
                      styles.stockValue,
                      item.currentStock <= item.minStock && styles.lowStockValue
                    ]}>
                      {item.currentStock}
                    </ThemedText>
                  </View>
                  <View style={styles.stockItem}>
                    <ThemedText style={styles.stockLabel}>Min:</ThemedText>
                    <ThemedText style={styles.stockValue}>{item.minStock}</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.lastUpdated}>
                  Updated: {item.lastUpdated}
                </ThemedText>
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
  updateButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#3b82f6',
    fontSize: 20,
  },
  lowStockWarning: {
    color: '#ef4444',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  alertContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    color: '#92400e',
  },
  alertText: {
    color: '#92400e',
    fontSize: 14,
  },
  inventoryList: {
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
  inventoryCard: {
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
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  lowStockBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  lowStockValue: {
    color: '#dc2626',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editButton: {
    padding: 8,
  },
});