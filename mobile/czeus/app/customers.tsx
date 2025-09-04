import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/hooks/useCustomers';
import { Customer } from '@/lib/customers';
import EditCustomerModal from '@/components/modals/EditCustomerModal';
import AddCustomerModal from '@/components/modals/AddCustomerModal';

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Use real data from Supabase
  const { data: customers = [], isLoading, refetch } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'active':
        return '#dcfce7';
      case 'inactive':
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  };

  const handleAddCustomer = () => {
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomerMutation.mutateAsync(customer.id);
              Alert.alert('Success', 'Customer deleted successfully');
            } catch (error) {
              console.error('Failed to delete customer:', error);
              Alert.alert('Error', 'Failed to delete customer');
            }
          },
        },
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2362c7" />
        <ThemedText style={{ marginTop: 16 }}>Loading customers...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol size={20} name="magnifyingglass" color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <IconSymbol size={16} name="xmark.circle.fill" color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor="#2362c7"
          />
        }
      >
        <ThemedView style={styles.content}>
          {filteredCustomers.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol size={64} name="person.fill" color="#9ca3af" />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                {searchQuery ? 'No customers found' : 'No customers yet'}
              </ThemedText>
              <ThemedText style={styles.emptyDescription}>
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Add your first customer to get started'}
              </ThemedText>
            </View>
          ) : (
            filteredCustomers.map((customer) => (
              <TouchableOpacity
                key={customer.id}
                style={styles.customerItem}
                onPress={() => handleEditCustomer(customer)}
                onLongPress={() => handleDeleteCustomer(customer)}
              >
                <View style={styles.customerAvatar}>
                  <IconSymbol size={24} name="person.fill" color="#fff" />
                </View>
                <View style={styles.customerInfo}>
                  <View style={styles.customerHeader}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.customerName}
                    >
                      {customer.firstName} {customer.lastName}
                    </ThemedText>
                    <View style={styles.badges}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusBackground(
                              customer.status
                            ),
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.statusText,
                            { color: getStatusColor(customer.status) },
                          ]}
                        >
                          {customer.status.toUpperCase()}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactItem}>
                      <IconSymbol size={14} name="envelope" color="#9ca3af" />
                      <ThemedText style={styles.contactText}>
                        {customer.email}
                      </ThemedText>
                    </View>
                    {customer.phone && (
                      <View style={styles.contactItem}>
                        <IconSymbol size={14} name="phone" color="#9ca3af" />
                        <ThemedText style={styles.contactText}>
                          {customer.phone}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <View style={styles.statsInfo}>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statValue}>
                        {customer.totalPoints}
                      </ThemedText>
                      <ThemedText style={styles.statLabel}>Points</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statValue}>
                        {customer.totalOrders}
                      </ThemedText>
                      <ThemedText style={styles.statLabel}>Orders</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statValue}>
                        {customer.joinDate}
                      </ThemedText>
                      <ThemedText style={styles.statLabel}>Joined</ThemedText>
                    </View>
                  </View>
                </View>
                <IconSymbol size={20} name="chevron.right" color="#9ca3af" />
              </TouchableOpacity>
            ))
          )}
        </ThemedView>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCustomer}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>

      {/* Add Customer Modal */}
      <AddCustomerModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={createCustomerMutation.mutateAsync}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        visible={editModalVisible}
        customer={selectedCustomer}
        onClose={handleCloseEditModal}
        onUpdate={updateCustomerMutation.mutateAsync}
        onDelete={deleteCustomerMutation.mutateAsync}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#6b7280',
  },
  customerItem: {
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
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contactInfo: {
    gap: 4,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2362c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
