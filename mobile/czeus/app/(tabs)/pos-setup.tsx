import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function POSSetupScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

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

  const setupOptions = [
    {
      id: 'tables',
      title: 'Tables',
      description: 'Manage dining tables',
      icon: 'table.furniture.fill',
      color: '#3b82f6',
      backgroundColor: '#3b82f620',
      route: '/tables'
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Product categories',
      icon: 'square.grid.2x2',
      color: '#f59e0b',
      backgroundColor: '#f59e0b20',
      route: '/categories'
    },
    {
      id: 'discounts',
      title: 'Discounts',
      description: 'Promotional offers',
      icon: 'tag.fill',
      color: '#ef4444',
      backgroundColor: '#ef444420',
      route: '/discounts'
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Staff management',
      icon: 'person.2.fill',
      color: '#10b981',
      backgroundColor: '#10b98120',
      route: '/staff'
    }
  ];

  const handleCardPress = (route: string) => {
    router.push(route as any);
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
        <View style={styles.setupGrid}>
          {setupOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.setupCard}
              onPress={() => handleCardPress(option.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: option.backgroundColor }]}>
                <IconSymbol size={32} name={option.icon as any} color={option.color} />
              </View>
              <View style={styles.cardContent}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  {option.title}
                </ThemedText>
                <ThemedText style={styles.cardDescription}>
                  {option.description}
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color="#6b7280" />
            </TouchableOpacity>
          ))}
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
  setupGrid: {
    gap: 16,
  },
  setupCard: {
    backgroundColor: '#fff',
    padding: 20,
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
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});