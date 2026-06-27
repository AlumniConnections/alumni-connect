import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store/AppContext';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import { colors } from '../src/theme';

function RootNavigator() {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const onLoginScreen = segments[0] === 'login';
    if (status === 'guest' && !onLoginScreen) {
      router.replace('/login');
    } else if (status === 'authed' && onLoginScreen) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
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
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
