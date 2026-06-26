import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store/AppContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="thread/[id]" />
            <Stack.Screen name="category/[id]" />
            <Stack.Screen name="alumni/[id]" />
            <Stack.Screen name="meeting/[id]" options={{ animation: 'fade' }} />
            <Stack.Screen name="meetings" />
            <Stack.Screen name="voting" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="resources/index" />
            <Stack.Screen name="resources/[category]" />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
