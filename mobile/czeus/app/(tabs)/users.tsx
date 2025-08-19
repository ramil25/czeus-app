import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersScreen() {
  const { user, signOut } = useAuth();

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

  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Users</ThemedText>
          <View style={styles.userList}>
            <View style={styles.userItem}>
              <View style={styles.userItemIcon}>
                <IconSymbol size={20} name="person.fill" color="#2362c7" />
              </View>
              <View style={styles.userItemContent}>
                <ThemedText type="defaultSemiBold">John Staff</ThemedText>
                <ThemedText style={styles.userRole}>Staff</ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
            
            <View style={styles.userItem}>
              <View style={styles.userItemIcon}>
                <IconSymbol size={20} name="person.fill" color="#10b981" />
              </View>
              <View style={styles.userItemContent}>
                <ThemedText type="defaultSemiBold">Jane Customer</ThemedText>
                <ThemedText style={styles.userRole}>Customer</ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionGrid}>
            <View style={styles.actionItem}>
              <IconSymbol size={24} name="person.badge.plus" color="#2362c7" />
              <ThemedText style={styles.actionText}>Add Staff</ThemedText>
            </View>
            <View style={styles.actionItem}>
              <IconSymbol size={24} name="person.crop.circle.badge.checkmark" color="#10b981" />
              <ThemedText style={styles.actionText}>Manage Roles</ThemedText>
            </View>
          </View>
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
    fontSize: 14,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  userList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});