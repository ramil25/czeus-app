import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function POSSetupScreen() {
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
        <ThemedText type="title" style={styles.title}>POS Setup</ThemedText>
        <ThemedText style={styles.subtitle}>Configure categories, discounts, and staff settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Categories</ThemedText>
          <View style={styles.categoryList}>
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#f59e0b20' }]}>
                <IconSymbol size={20} name="cup.and.saucer.fill" color="#f59e0b" />
              </View>
              <View style={styles.categoryContent}>
                <ThemedText type="defaultSemiBold">Coffee</ThemedText>
                <ThemedText style={styles.categoryCount}>12 items</ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
            
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#10b98120' }]}>
                <IconSymbol size={20} name="birthday.cake.fill" color="#10b981" />
              </View>
              <View style={styles.categoryContent}>
                <ThemedText type="defaultSemiBold">Pastries</ThemedText>
                <ThemedText style={styles.categoryCount}>8 items</ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>

            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#8b5cf620' }]}>
                <IconSymbol size={20} name="leaf.fill" color="#8b5cf6" />
              </View>
              <View style={styles.categoryContent}>
                <ThemedText type="defaultSemiBold">Tea</ThemedText>
                <ThemedText style={styles.categoryCount}>6 items</ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Setup Options</ThemedText>
          <View style={styles.setupGrid}>
            <View style={styles.setupItem}>
              <IconSymbol size={28} name="tag.fill" color="#ef4444" />
              <ThemedText style={styles.setupTitle}>Discounts</ThemedText>
              <ThemedText style={styles.setupDescription}>Manage promotional offers</ThemedText>
            </View>
            
            <View style={styles.setupItem}>
              <IconSymbol size={28} name="person.2.fill" color="#2362c7" />
              <ThemedText style={styles.setupTitle}>Staff Settings</ThemedText>
              <ThemedText style={styles.setupDescription}>Configure staff permissions</ThemedText>
            </View>
            
            <View style={styles.setupItem}>
              <IconSymbol size={28} name="printer.fill" color="#6b7280" />
              <ThemedText style={styles.setupTitle}>Receipts</ThemedText>
              <ThemedText style={styles.setupDescription}>Receipt templates</ThemedText>
            </View>
            
            <View style={styles.setupItem}>
              <IconSymbol size={28} name="creditcard.fill" color="#10b981" />
              <ThemedText style={styles.setupTitle}>Payment</ThemedText>
              <ThemedText style={styles.setupDescription}>Payment methods</ThemedText>
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
  categoryList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  setupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  setupItem: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  setupTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  setupDescription: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});