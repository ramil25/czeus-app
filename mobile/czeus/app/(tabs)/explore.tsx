import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MenuOption {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function MoreScreen() {
  const menuOptions: MenuOption[] = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: 'person.3.fill',
      color: '#3b82f6',
      onPress: () => console.log('User Management'),
    },
    {
      title: 'Points Management',
      description: 'Customer loyalty points',
      icon: 'star.fill',
      color: '#f59e0b',
      onPress: () => console.log('Points Management'),
    },
    {
      title: 'POS Setup',
      description: 'Categories, discounts, staff',
      icon: 'gearshape.fill',
      color: '#8b5cf6',
      onPress: () => console.log('POS Setup'),
    },
    {
      title: 'Table Management',
      description: 'Restaurant table management',
      icon: 'table.furniture.fill',
      color: '#10b981',
      onPress: () => console.log('Table Management'),
    },
    {
      title: 'Reports',
      description: 'Sales and analytics reports',
      icon: 'chart.bar.fill',
      color: '#ef4444',
      onPress: () => console.log('Reports'),
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
              <IconSymbol size={24} name={option.icon} color="#fff" />
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
