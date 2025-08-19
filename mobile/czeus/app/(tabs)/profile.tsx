import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
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
              <IconSymbol size={48} name="person.fill" color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText type="title" style={styles.userName}>
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'User' : 'User'}
              </ThemedText>
              <ThemedText style={styles.userRole}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <IconSymbol size={24} name="arrow.right.square" color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol size={20} name="envelope.fill" color="#2362c7" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Email</ThemedText>
                <ThemedText type="defaultSemiBold">{user?.email || 'Not provided'}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol size={20} name="person.fill" color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>First Name</ThemedText>
                <ThemedText type="defaultSemiBold">{user?.first_name || 'Not provided'}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol size={20} name="person.fill" color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Last Name</ThemedText>
                <ThemedText type="defaultSemiBold">{user?.last_name || 'Not provided'}</ThemedText>
              </View>
            </View>

            {user?.middle_name && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <IconSymbol size={20} name="person.fill" color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Middle Name</ThemedText>
                  <ThemedText type="defaultSemiBold">{user.middle_name}</ThemedText>
                </View>
              </View>
            )}

            {user?.phone && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <IconSymbol size={20} name="phone.fill" color="#f59e0b" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Phone</ThemedText>
                  <ThemedText type="defaultSemiBold">{user.phone}</ThemedText>
                </View>
              </View>
            )}

            {user?.position && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <IconSymbol size={20} name="briefcase.fill" color="#8b5cf6" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Position</ThemedText>
                  <ThemedText type="defaultSemiBold">{user.position}</ThemedText>
                </View>
              </View>
            )}

            {user?.address && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <IconSymbol size={20} name="location.fill" color="#ef4444" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Address</ThemedText>
                  <ThemedText type="defaultSemiBold">{user.address}</ThemedText>
                </View>
              </View>
            )}

            {user?.birth_day && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <IconSymbol size={20} name="gift.fill" color="#ec4899" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Birthday</ThemedText>
                  <ThemedText type="defaultSemiBold">{new Date(user.birth_day).toLocaleDateString()}</ThemedText>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Account Details</ThemedText>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol size={20} name="calendar" color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
                <ThemedText type="defaultSemiBold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol size={20} name="checkmark.circle.fill" color="#10b981" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Account Status</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statusActive}>Active</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.editButton}>
            <IconSymbol size={20} name="pencil" color="#fff" />
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2362c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  logoutButton: {
    padding: 8,
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  statusActive: {
    color: '#10b981',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2362c7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});