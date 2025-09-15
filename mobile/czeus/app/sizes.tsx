import AddSizeModal from '@/components/modals/AddSizeModal';
import EditSizeModal from '@/components/modals/EditSizeModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSizes } from '@/hooks/useSizes';
import { Size } from '@/lib/sizes';
import React from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SizesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const {
    sizes,
    loading,
    error,
    refreshSizes,
    createNewSize,
    updateExistingSize,
    deleteExistingSize,
  } = useSizes();

  const filteredSizes = sizes.filter(
    (size) =>
      size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      size.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSize = () => {
    setAddModalVisible(true);
  };

  const handleSizePress = (size: Size) => {
    setSelectedSize(size);
    setEditModalVisible(true);
  };

  const handleRefresh = async () => {
    try {
      await refreshSizes();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to refresh sizes', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        <ThemedView style={styles.content}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search sizes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol
                size={24}
                name="exclamationmark.triangle"
                color="#ef4444"
              />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {loading && !error && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <ThemedText style={styles.loadingText}>
                Loading sizes...
              </ThemedText>
            </View>
          )}

          <View style={styles.sizesList}>
            {!loading && !error && filteredSizes.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol size={48} name="ruler.fill" color="#d1d5db" />
                <ThemedText style={styles.emptyText}>No sizes found</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Add your first size to get started'}
                </ThemedText>
              </View>
            ) : (
              filteredSizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={styles.sizeCard}
                  onPress={() => handleSizePress(size)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sizeIcon}>
                    <IconSymbol size={24} name="ruler.fill" color="#3b82f6" />
                  </View>
                  <View style={styles.sizeInfo}>
                    <View style={styles.sizeHeader}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.sizeName}
                      >
                        {size.name}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.categoryText}>
                      {size.categoryName}
                    </ThemedText>
                    <ThemedText style={styles.dateText}>
                      Created: {new Date(size.createdAt).toLocaleDateString()}
                    </ThemedText>
                  </View>
                  <IconSymbol size={20} name="chevron.right" color="#d1d5db" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ThemedView>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddSize}
        activeOpacity={0.85}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>

      <AddSizeModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={createNewSize}
      />

      <EditSizeModal
        visible={editModalVisible}
        size={selectedSize}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedSize(null);
        }}
        onUpdate={updateExistingSize}
        onDelete={deleteExistingSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
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
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#dc2626',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  sizesList: {
    gap: 12,
  },
  sizeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sizeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#eff6ff',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sizeName: {
    fontSize: 16,
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
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
