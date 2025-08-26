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
import { useDiscounts } from '@/hooks/useDiscounts';
import { Discount, formatDiscountValue, getDiscountTypeDisplayName } from '@/lib/discounts';
import AddDiscountModal from '@/components/modals/AddDiscountModal';
import EditDiscountModal from '@/components/modals/EditDiscountModal';

export default function DiscountsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  const {
    discounts,
    loading,
    error,
    refreshDiscounts,
    createNewDiscount,
    updateExistingDiscount,
    deleteExistingDiscount,
  } = useDiscounts();

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDiscountTypeDisplayName(discount.type).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDiscount = () => {
    setAddModalVisible(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setEditModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedDiscount(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return '#3b82f6';
      case 'actual':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'percentage':
        return '#3b82f620';
      case 'actual':
        return '#10b98120';
      default:
        return '#6b728020';
    }
  };

  if (error && !loading) {
    return (
      <View style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.errorContainer}>
            <IconSymbol size={48} name="exclamationmark.triangle" color="#ef4444" />
            <ThemedText style={styles.errorText}>Error loading discounts</ThemedText>
            <ThemedText style={styles.errorSubtext}>{error}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={refreshDiscounts}>
              <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search discounts..."
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

        <ScrollView
          style={styles.discountsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshDiscounts}
              colors={['#ef4444']}
              tintColor="#ef4444"
            />
          }
        >
          {loading && discounts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ef4444" />
              <ThemedText style={styles.loadingText}>Loading discounts...</ThemedText>
            </View>
          ) : (
            filteredDiscounts.map((discount) => (
              <TouchableOpacity
                key={discount.id}
                style={styles.discountItem}
                onPress={() => handleEditDiscount(discount)}
                activeOpacity={0.7}
              >
                <View style={styles.discountInfo}>
                  <View style={styles.discountHeader}>
                    <View style={styles.discountTitleRow}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.discountName}
                      >
                        {discount.name}
                      </ThemedText>
                      <View style={styles.badges}>
                        <View
                          style={[
                            styles.typeBadge,
                            { backgroundColor: getTypeBackground(discount.type) },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.typeText,
                              { color: getTypeColor(discount.type) },
                            ]}
                          >
                            {getDiscountTypeDisplayName(discount.type).toUpperCase()}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <View style={styles.valueContainer}>
                      <ThemedText style={styles.discountValue}>
                        {formatDiscountValue(discount)} OFF
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.discountDetails}>
                    <View style={styles.detailItem}>
                      <IconSymbol size={14} name="calendar" color="#6b7280" />
                      <ThemedText style={styles.detailText}>
                        Created {new Date(discount.created_at).toLocaleDateString()}
                      </ThemedText>
                    </View>
                    {discount.updated_at && (
                      <View style={styles.detailItem}>
                        <IconSymbol size={14} name="pencil" color="#6b7280" />
                        <ThemedText style={styles.detailText}>
                          Updated {new Date(discount.updated_at).toLocaleDateString()}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#6b7280" />
              </TouchableOpacity>
            ))
          )}

          {filteredDiscounts.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="tag.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'No discounts found' : 'No discounts available'}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add your first discount to get started'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddDiscount}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>

      {/* Add Discount Modal */}
      <AddDiscountModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={createNewDiscount}
      />

      {/* Edit Discount Modal */}
      <EditDiscountModal
        visible={editModalVisible}
        discount={selectedDiscount}
        onClose={handleCloseEditModal}
        onUpdate={updateExistingDiscount}
        onDelete={deleteExistingDiscount}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
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
  discountsList: {
    flex: 1,
  },
  discountItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountInfo: {
    flex: 1,
  },
  discountHeader: {
    marginBottom: 8,
  },
  discountTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  discountName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  valueContainer: {
    alignSelf: 'flex-start',
  },
  discountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  discountDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
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
    backgroundColor: '#ef4444',
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
