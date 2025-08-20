import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { getTabsForRole } from '@/utils/navigation';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Helper function to check if a tab should be visible for the current user role
  const isTabVisible = (tabName: string) => {
    if (!user?.role) return false;
    
    const allowedTabs = getTabsForRole(user.role);
    return allowedTabs.includes(tabName);
  };

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
      {/* Dashboard - Admin only */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
          href: isTabVisible('index') ? '/' : null,
        }}
      />
      
      {/* Users - Admin only */}
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
          href: isTabVisible('users') ? '/users' : null,
        }}
      />
      
      {/* POS Setup - Admin only */}
      <Tabs.Screen
        name="pos-setup"
        options={{
          title: 'POS Setup',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
          href: isTabVisible('pos-setup') ? '/pos-setup' : null,
        }}
      />
      
      {/* More - Admin only */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="ellipsis.circle.fill" color={color} />,
          href: isTabVisible('explore') ? '/explore' : null,
        }}
      />
      
      {/* POS - Staff only */}
      <Tabs.Screen
        name="pos"
        options={{
          title: 'POS',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
          href: isTabVisible('pos') ? '/pos' : null,
        }}
      />
      
      {/* Foods - Customer only */}
      <Tabs.Screen
        name="foods"
        options={{
          title: 'Foods',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cup.and.saucer.fill" color={color} />,
          href: isTabVisible('foods') ? '/foods' : null,
        }}
      />
      
      {/* Points - Customer only */}
      <Tabs.Screen
        name="points"
        options={{
          title: 'Points',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
          href: isTabVisible('points') ? '/points' : null,
        }}
      />
      
      {/* Profile - Staff & Customer */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          href: isTabVisible('profile') ? '/profile' : null,
        }}
      />
      
      {/* Hide other tabs that aren't part of the role-based navigation */}
      <Tabs.Screen
        name="products"
        options={{
          href: null, // Hide this tab
        }}
      />
      
      <Tabs.Screen
        name="sales"
        options={{
          href: null, // Hide this tab
        }}
      />
      
      <Tabs.Screen
        name="inventory"
        options={{
          href: null, // Hide this tab
        }}
      />
    </Tabs>
  );
}
