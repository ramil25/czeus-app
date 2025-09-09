import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface MenuOption {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function MoreScreen() {
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

  // Check if user has permission to access this screen (admin or staff only)
  const hasAccess = user?.role === 'admin' || user?.role === 'staff';

  // If user doesn't have access, show access denied message
  if (!hasAccess) {
    return (
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Access Denied</ThemedText>
          <ThemedText>This section is only available to admin and staff users.</ThemedText>
        </ThemedView>
      </ScrollView>
    );
  }

  const menuOptions: MenuOption[] = [
    {
      title: 'Inventory Management',
      description: 'Manage products and stock levels',
      icon: 'cube.box.fill',
      color: '#2362c7',
      onPress: () => router.push('/inventory-management'),
    },
    {
      title: 'Customer Lists',
      description: 'View and manage customer database',
      icon: 'person.2.fill',
      color: '#f59e0b',
      onPress: () => router.push('/customers'),
    },
    {
      title: 'Sales Management',
      description: 'Track sales and transactions',
      icon: 'chart.line.uptrend.xyaxis',
      color: '#10b981',
      onPress: () => console.log('Sales Management'),
    },
    {
      title: 'Points Management',
      description: 'Customer loyalty points',
      icon: 'star.fill',
      color: '#8b5cf6',
      onPress: () => router.push('/points-management'),
    },
    {
      title: 'Settings',
      description: 'App preferences and configuration',
      icon: 'gear',
      color: '#6b7280',
      onPress: () => console.log('Settings'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <IconSymbol size={32} name="person.fill" color="#fff" />
          </View>
          <View style={styles.userDetails}>
            <ThemedText type="defaultSemiBold" style={styles.userName}>
              {user ? `${user.first_name} ${user.last_name}`.trim() || 'User' : 'User'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>
              {user?.email}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="title">More</ThemedText>
        <ThemedText>Additional features and settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Features
        </ThemedText>
        
        {menuOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={option.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <IconSymbol size={24} name={option.icon as any} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <ThemedText type="defaultSemiBold">{option.title}</ThemedText>
              <ThemedText style={styles.menuDescription}>
                {option.description}
              </ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#9ca3af" />
          </TouchableOpacity>
        ))}

        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
          Account
        </ThemedText>

        <TouchableOpacity 
          style={[styles.menuItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
            <IconSymbol size={24} name="power" color="#fff" />
          </View>
          <View style={styles.menuContent}>
            <ThemedText type="defaultSemiBold" style={styles.signOutText}>
              Sign Out
            </ThemedText>
            <ThemedText style={styles.menuDescription}>
              Sign out of your account
            </ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#9ca3af" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.aboutContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          About
        </ThemedText>
        
        <View style={styles.aboutCard}>
          <ThemedText type="defaultSemiBold" style={styles.appName}>
            CZEUS POS Mobile
          </ThemedText>
          <ThemedText style={styles.appVersion}>Version 1.0.0</ThemedText>
          <ThemedText style={styles.appDescription}>
            Mobile point-of-sale system for managing products, sales, and inventory on the go.
          </ThemedText>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2362c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  menuContainer: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutItem: {
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutText: {
    color: '#dc2626',
  },
  aboutContainer: {
    padding: 16,
    gap: 12,
  },
  aboutCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appName: {
    fontSize: 18,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
