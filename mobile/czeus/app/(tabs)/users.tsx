import { StyleSheet, ScrollView, View, Alert, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { UserProfile } from '@/lib/users';

export default function UsersScreen() {
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading, error, refetch } = useUsers();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (signOutError) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              console.error('Sign out error:', signOutError);
            }
          }
        }
      ]
    );
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    router.push('/add-user');
  };

  const handleUserPress = (selectedUser: UserProfile) => {
    router.push({
      pathname: '/user-details',
      params: { userId: selectedUser.id.toString() }
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'staff': return '#2362c7';
      case 'customer': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={32} name="person.fill" color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText type="defaultSemiBold" style={styles.userName}>
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'Admin' : 'Admin'}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email}
              </ThemedText>
            </View>
          </View>
          <View style={styles.logoutButton}>
            <IconSymbol 
              size={24} 
              name="arrow.right.square" 
              color="#ef4444"
              onPress={handleSignOut}
            />
          </View>
        </View>
        <ThemedText type="title" style={styles.title}>User Management</ThemedText>
        <ThemedText style={styles.subtitle}>Manage staff and customer accounts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Search and Add Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <IconSymbol size={20} name="xmark.circle.fill" color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
            <IconSymbol size={20} name="plus" color="#fff" />
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Users List */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Users ({filteredUsers.length})
          </ThemedText>
          
          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol size={24} name="exclamationmark.triangle" color="#ef4444" />
              <ThemedText style={styles.errorText}>
                Failed to load users. Pull to refresh.
              </ThemedText>
            </View>
          )}
          
          {isLoading && users.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2362c7" />
              <ThemedText style={styles.loadingText}>Loading users...</ThemedText>
            </View>
          ) : (
            <View style={styles.userList}>
              {filteredUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <IconSymbol size={48} name="person.2.fill" color="#d1d5db" />
                  <ThemedText style={styles.emptyText}>
                    {search ? 'No users found matching your search' : 'No users found'}
                  </ThemedText>
                  {!search && (
                    <TouchableOpacity style={styles.emptyButton} onPress={handleAddUser}>
                      <ThemedText style={styles.emptyButtonText}>Add your first user</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                filteredUsers.map((userItem, index) => (
                  <TouchableOpacity
                    key={userItem.id}
                    style={[
                      styles.userItem,
                      index === filteredUsers.length - 1 && styles.userItemLast
                    ]}
                    onPress={() => handleUserPress(userItem)}
                  >
                    <View style={styles.userItemIcon}>
                      <IconSymbol size={20} name="person.fill" color={getRoleColor(userItem.role)} />
                    </View>
                    <View style={styles.userItemContent}>
                      <ThemedText type="defaultSemiBold" style={styles.userItemName}>
                        {userItem.name}
                      </ThemedText>
                      <View style={styles.userItemMeta}>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(userItem.role) }]}>
                          <ThemedText style={styles.roleText}>
                            {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.userEmail}>{userItem.email}</ThemedText>
                      </View>
                    </View>
                    <IconSymbol size={16} name="chevron.right" color="#6b7280" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2362c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
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
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2362c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    gap: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  userList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userItemLast: {
    borderBottomWidth: 0,
  },
  userItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userItemContent: {
    flex: 1,
  },
  userItemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  userItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#2362c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});