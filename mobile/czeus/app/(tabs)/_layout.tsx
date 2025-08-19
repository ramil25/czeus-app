import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Role-based tab configuration
  const getTabsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            name: 'index',
            title: 'Dashboard',
            icon: 'chart.bar.fill' as const,
          },
          {
            name: 'users',
            title: 'Users',
            icon: 'person.3.fill' as const,
          },
          {
            name: 'pos-setup',
            title: 'POS Setup',
            icon: 'gearshape.fill' as const,
          },
          {
            name: 'explore',
            title: 'More',
            icon: 'ellipsis.circle.fill' as const,
          },
        ];
      case 'staff':
        return [
          {
            name: 'pos',
            title: 'POS',
            icon: 'creditcard.fill' as const,
          },
          {
            name: 'profile',
            title: 'Profile',
            icon: 'person.fill' as const,
          },
        ];
      case 'customer':
        return [
          {
            name: 'foods',
            title: 'Foods',
            icon: 'cup.and.saucer.fill' as const,
          },
          {
            name: 'points',
            title: 'Points',
            icon: 'star.fill' as const,
          },
          {
            name: 'profile',
            title: 'Profile',
            icon: 'person.fill' as const,
          },
        ];
      default:
        // Fallback to customer tabs
        return [
          {
            name: 'foods',
            title: 'Foods',
            icon: 'cup.and.saucer.fill' as const,
          },
          {
            name: 'points',
            title: 'Points',
            icon: 'star.fill' as const,
          },
          {
            name: 'profile',
            title: 'Profile',
            icon: 'person.fill' as const,
          },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name={tab.icon} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
