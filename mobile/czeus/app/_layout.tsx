import {
  Theme as NavTheme,
  DefaultTheme as RNNDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BasketProvider } from '@/contexts/BasketContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getInitialRouteForRole } from '@/utils/navigation';
import React from 'react';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function AppNavigator() {
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    if (initialized) {
      if (user) {
        // User is authenticated, redirect based on role
        const initialRoute = getInitialRouteForRole(user.role);
        router.replace(initialRoute as any);
      } else {
        // User is not authenticated, redirect to login
        router.replace('/(auth)/login');
      }
    }
  }, [user, initialized]);

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2362c7" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="products"
        options={{
          title: 'Products',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="sizes"
        options={{
          title: 'Sizes',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="tables"
        options={{
          title: 'Tables',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="discounts"
        options={{
          title: 'Discounts',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="staff"
        options={{
          title: 'Staff',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="add-user"
        options={{
          title: 'Add User',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="edit-user"
        options={{
          title: 'Edit User',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="inventory-management"
        options={{
          title: 'Inventory Management',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#374151',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// Custom light theme overriding defaults for a brighter UI
const LightNavigationTheme: NavTheme = {
  ...RNNDefaultTheme,
  colors: {
    ...RNNDefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: '#FFFFFF',
    text: Colors.light.text,
    border: '#E5E7EB', // Gray 200
    notification: Colors.light.tint,
  },
};

export default function RootLayout() {
  // We still read the system scheme in case we later want to allow toggling
  useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BasketProvider>
          <ThemeProvider value={LightNavigationTheme}>
            <AppNavigator />
            <StatusBar style="dark" />
          </ThemeProvider>
        </BasketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
