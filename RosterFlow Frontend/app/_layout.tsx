
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Stack } from "expo-router";
import Login from "./(login)/login";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(); 


export default function RootLayout() {
    return(
        <>
        <GestureHandlerRootView>
        <Stack screenOptions={{headerShown : false}}>
            <Stack.Screen
            name="(login)"
            options={{
              headerTitle: 'Admin', // Title of the top bar
              headerStyle: { backgroundColor: 'lightblue' }, // Background color
              headerTintColor: 'white', // Color of text and icons
              // Add custom components to the header
            }}
          />
          {/* Other screens */}
          </Stack>
          </GestureHandlerRootView>
        </>
    );
}