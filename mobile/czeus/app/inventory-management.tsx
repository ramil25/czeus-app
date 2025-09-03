import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem } from '@/lib/inventory';
import AddInventoryModal from '@/components/modals/AddInventoryModal';
import EditInventoryModal from '@/components/modals/EditInventoryModal';
import { router } from 'expo-router';

export default function InventoryManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const {
    inventoryItems,
    loading,
    error,
    refreshInventory,
    createNewInventoryItem,
    updateExistingInventoryItem,
    deleteExistingInventoryItem,
  } = useInventory();

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit_measure.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    setAddModalVisible(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedItem(null);
  };

  const getCategoryIcon = (category: string) => {
    const lowercaseName = category.toLowerCase();
    
    if (lowercaseName.includes('coffee')) {
      return 'cup.and.saucer.fill';
    } else if (lowercaseName.includes('tea')) {
      return 'leaf.fill';
    } else if (lowercaseName.includes('dairy') || lowercaseName.includes('milk')) {
      return 'waterbottle';
    } else if (lowercaseName.includes('condiment') || lowercaseName.includes('sugar') || lowercaseName.includes('spice')) {
      return 'bag.fill';
    } else if (lowercaseName.includes('meat') || lowercaseName.includes('protein')) {
      return 'takeoutbag.and.cup.and.straw.fill';
    } else if (lowercaseName.includes('vegetable') || lowercaseName.includes('produce')) {
      return 'carrot.fill';
    } else if (lowercaseName.includes('grain') || lowercaseName.includes('flour')) {
      return 'bag';
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
    } else if (lowercaseName.includes('dairy') || lowercaseName.includes('milk')) {
      return '#3b82f6';
    } else if (lowercaseName.includes('condiment') || lowercaseName.includes('sugar') || lowercaseName.includes('spice')) {
      return '#f59e0b';
    } else if (lowercaseName.includes('meat') || lowercaseName.includes('protein')) {
      return '#ef4444';
    } else if (lowercaseName.includes('vegetable') || lowercaseName.includes('produce')) {
      return '#22c55e';
    } else if (lowercaseName.includes('grain') || lowercaseName.includes('flour')) {
      return '#a855f7';
    } else {
      return '#6b7280';
    }
  };

  const getCategoryBackgroundColor = (category: string) => {
    return getCategoryColor(category) + '20';
  };

  const getStockStatusColor = (qty: number) => {
    if (qty === 0) return '#ef4444'; // Red for out of stock
    if (qty <= 10) return '#f59e0b'; // Orange for low stock
    return '#10b981'; // Green for good stock
  };

  const getStockStatusText = (qty: number) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol size={24} name="chevron.left" color="#374151" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Inventory Management
        </ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search inventory items..."
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
              onPress={refreshInventory}
              style={styles.retryButton}
            >
              <ThemedText style={styles.retryText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.itemsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshInventory}
              colors={['#f59e0b']}
              tintColor="#f59e0b"
            />
          }
        >
          {loading && inventoryItems.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <ThemedText style={styles.loadingText}>
                Loading inventory items...
              </ThemedText>
            </View>
          ) : (
            <>
              {filteredItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.inventoryItem}
                  onPress={() => handleEditItem(item)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.itemIcon,
                      { backgroundColor: getCategoryBackgroundColor(item.item_category) },
                    ]}
                  >
                    <IconSymbol
                      size={24}
                      name={getCategoryIcon(item.item_category) as any}
                      color={getCategoryColor(item.item_category)}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.itemName}
                    >
                      {item.item_name}
                    </ThemedText>
                    <ThemedText style={styles.itemDescription}>
                      {item.item_category} • {item.item_qty} {item.unit_measure}
                    </ThemedText>
                    <ThemedText style={[
                      styles.itemStatus,
                      { color: getStockStatusColor(item.item_qty) }
                    ]}>
                      {getStockStatusText(item.item_qty)}
                    </ThemedText>
                  </View>
                  <IconSymbol size={16} name="chevron.right" color="#6b7280" />
                </TouchableOpacity>
              ))}

              {filteredItems.length === 0 && !loading && (
                <View style={styles.emptyState}>
                  <IconSymbol
                    size={48}
                    name="shippingbox.fill"
                    color="#d1d5db"
                  />
                  <ThemedText style={styles.emptyText}>
                    {searchQuery
                      ? 'No inventory items found'
                      : 'No inventory items available'}
                  </ThemedText>
                  <ThemedText style={styles.emptySubtext}>
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'Add your first inventory item to get started'}
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
        onPress={handleAddItem}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <AddInventoryModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={createNewInventoryItem}
      />

      <EditInventoryModal
        visible={editModalVisible}
        item={selectedItem}
        onClose={handleCloseEditModal}
        onUpdate={updateExistingInventoryItem}
        onDelete={deleteExistingInventoryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
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
  itemsList: {
    flex: 1,
  },
  inventoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: '#f59e0b',
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