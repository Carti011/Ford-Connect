import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { colors } from '../constants/colors';

function NavigationGuard() {
  const { estaAutenticado, carregando } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (carregando) return;

    const estaNasAbas = segments[0] === '(tabs)';

    if (!estaAutenticado && estaNasAbas) {
      router.replace('/login');
    } else if (estaAutenticado && !estaNasAbas) {
      router.replace('/(tabs)');
    }
  }, [estaAutenticado, carregando, segments]);

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsCarregadas] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsCarregadas) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <AuthProvider>
      <NavigationGuard />
    </AuthProvider>
  );
}
