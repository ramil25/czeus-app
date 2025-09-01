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
import { router } from 'expo-router';
import { useStaff, useDeleteStaff } from '@/hooks/useStaff';
import { Staff } from '@/lib/staff';

export default function StaffScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use real data from Supabase
  const { data: staff = [], isLoading, refetch } = useStaff();
  const deleteStaffMutation = useDeleteStaff();

  const filteredStaff = staff.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return '#8b5cf6';
      case 'cashier':
        return '#3b82f6';
      case 'barista':
        return '#8b5a3c';
      case 'server':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getRoleBackground = (role: string) => {
    switch (role) {
      case 'manager':
        return '#8b5cf620';
      case 'cashier':
        return '#3b82f620';
      case 'barista':
        return '#8b5a3c20';
      case 'server':
        return '#10b98120';
      default:
        return '#6b728020';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'on-break':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b98120';
      case 'inactive':
        return '#6b728020';
      case 'on-break':
        return '#f59e0b20';
      default:
        return '#6b728020';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return 'checkmark.circle.fill';
      case 'inactive':
        return 'xmark.circle.fill';
      case 'on-break':
        return 'pause.circle.fill';
      default:
        return 'questionmark.circle.fill';
    }
  };

  const handleAddStaff = () => {
    router.push('/add-user?role=staff');
  };

  const handleEditStaff = (staffId: number) => {
    router.push(`/edit-user?userId=${staffId}`);
  };

  const handleDeleteStaff = (staff: Staff) => {
    Alert.alert(
      'Delete Staff Member',
      `Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStaffMutation.mutateAsync(staff.id);
              Alert.alert('Success', 'Staff member deleted successfully');
            } catch (error) {
              console.error('Failed to delete staff:', error);
              Alert.alert('Error', 'Failed to delete staff member');
            }
          }
        },
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10b981" />
        <ThemedText style={styles.loadingText}>Loading staff...</ThemedText>
      </View>
    );
  }

  // Show error state
  if (!staff && !isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <IconSymbol size={48} name="exclamationmark.triangle" color="#ef4444" />
        <ThemedText style={styles.errorText}>Failed to load staff</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </TouchableOpacity>
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
              placeholder="Search staff..."
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
          style={styles.staffList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#10b981']}
            />
          }
        >
          {filteredStaff.map((member) => (
            <TouchableOpacity 
              key={member.id} 
              style={styles.staffItem}
              onPress={() => handleEditStaff(member.id)}
              onLongPress={() => handleDeleteStaff(member)}
            >
              <View style={styles.staffAvatar}>
                <IconSymbol size={24} name="person.fill" color="#fff" />
              </View>
              <View style={styles.staffInfo}>
                <View style={styles.staffHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.staffName}>
                    {member.firstName} {member.lastName}
                  </ThemedText>
                  <View style={styles.badges}>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleBackground(member.role) },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.roleText,
                          { color: getRoleColor(member.role) },
                        ]}
                      >
                        {member.role.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <IconSymbol size={14} name="envelope" color="#6b7280" />
                    <ThemedText style={styles.contactText}>
                      {member.email}
                    </ThemedText>
                  </View>
                  <View style={styles.contactItem}>
                    <IconSymbol size={14} name="phone" color="#6b7280" />
                    <ThemedText style={styles.contactText}>
                      {member.phone}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <View style={styles.statusContainer}>
                    <IconSymbol
                      size={16}
                      name={getStatusIcon(member.status) as any}
                      color={getStatusColor(member.status)}
                    />
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBackground(member.status) },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          { color: getStatusColor(member.status) },
                        ]}
                      >
                        {member.status.replace('-', ' ').toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.joinDate}>
                    Joined {member.joinDate}
                  </ThemedText>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </TouchableOpacity>
          ))}

          {filteredStaff.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="person.2.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'No staff found' : 'No staff members'}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add your first staff member to get started'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddStaff}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>
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
  staffList: {
    flex: 1,
  },
  staffItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  staffInfo: {
    flex: 1,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  staffName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
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
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  joinDate: {
    fontSize: 12,
    color: '#9ca3af',
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
    backgroundColor: '#10b981',
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
