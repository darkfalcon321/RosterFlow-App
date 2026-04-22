                

import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { useColorScheme } from '@/hooks/useColorScheme';
import { View ,StyleSheet, Button, SafeAreaView} from 'react-native';
import React from 'react';
import AdminPage from '@/app/Admin';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
        <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
          <Stack.Screen
            name="Admin"
            options={{
              headerTitle: 'Admin', // Title of the top bar
              headerStyle: { backgroundColor: 'lightblue' }, // Background color
              headerTintColor: 'white', // Color of text and icons
              // Add custom components to the header
            }}
          />
          {/* Other screens */}
          </Stack>
          </SafeAreaView>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


