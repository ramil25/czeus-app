import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUser, useDeleteUser } from '@/hooks/useUsers';

export default function UserDetailsScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data: user, isLoading, error } = useUser(parseInt(userId || '0'));
  const deleteUserMutation = useDeleteUser();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (user) {
      router.push({
        pathname: '/edit-user',
        params: { userId: user.id.toString() },
      });
    }
  };

  const handleDelete = () => {
    if (!user) return;

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserMutation.mutateAsync(user.id);
              Alert.alert('Success', 'User deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to delete user'
              );
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#ef4444';
      case 'staff':
        return '#2362c7';
      case 'customer':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        {/* <ThemedView style={styles.header}>
        </ThemedView> */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2362c7" />
          <ThemedText style={styles.loadingText}>
            Loading user details...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <IconSymbol size={24} name="chevron.left" color="#2362c7" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>
              User Details
            </ThemedText>
            <View style={styles.placeholder} />
          </View>
        </ThemedView>
        <View style={styles.errorContainer}>
          <IconSymbol
            size={48}
            name="exclamationmark.triangle"
            color="#ef4444"
          />
          <ThemedText style={styles.errorText}>User not found</ThemedText>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <ThemedText style={styles.errorButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <ThemedView style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={40} name="person.fill" color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="title" style={styles.profileName}>
                {user.name}
              </ThemedText>
              <View style={styles.roleContainer}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(user.role) },
                  ]}
                >
                  <ThemedText style={styles.roleText}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Details Section */}
        <ThemedView style={styles.detailsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Contact Information
          </ThemedText>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="envelope.fill" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Email</ThemedText>
              <ThemedText style={styles.detailValue}>{user.email}</ThemedText>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="phone.fill" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Phone</ThemedText>
              <ThemedText style={styles.detailValue}>
                {user.phone || 'Not provided'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="location.fill" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Address</ThemedText>
              <ThemedText style={styles.detailValue}>
                {user.address || 'Not provided'}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Additional Information */}
        <ThemedView style={styles.detailsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Additional Information
          </ThemedText>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="briefcase.fill" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Position</ThemedText>
              <ThemedText style={styles.detailValue}>
                {user.position || 'Not provided'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="calendar" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Birth Date</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatDate(user.birth_day || undefined)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <IconSymbol size={20} name="clock.fill" color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Created</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatDate(user.created_at || undefined)}
              </ThemedText>
            </View>
          </View>

          {user.updated_at && (
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <IconSymbol size={20} name="clock.fill" color="#6b7280" />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Last Updated</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatDate(user.updated_at || undefined)}
                </ThemedText>
              </View>
            </View>
          )}
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={styles.actionsSection}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <IconSymbol size={20} name="pencil" color="#fff" />
            <ThemedText style={styles.editButtonText}>Edit User</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              deleteUserMutation.isPending && styles.deleteButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={deleteUserMutation.isPending}
          >
            <IconSymbol size={20} name="trash" color="#fff" />
            <ThemedText style={styles.deleteButtonText}>
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#2362c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2362c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
    backgroundColor: '#fff',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2362c7',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
