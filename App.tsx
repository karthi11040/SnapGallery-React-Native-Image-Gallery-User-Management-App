import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTheme } from './src/hooks/useTheme';

function MainApp() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function prepare() {
      try {
        if (Ionicons && Ionicons.font) {
          await Font.loadAsync(Ionicons.font).catch(() => {});
        }
      } catch {
        // Safe fallback in offline/bundled environments
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }
    prepare();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}


