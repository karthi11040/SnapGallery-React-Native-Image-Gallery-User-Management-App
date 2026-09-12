import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors } from '../theme/colors';
import { ThemeColors, ThemeMode } from '../types/theme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode, isHydrated } = useThemeStore();

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const colors: ThemeColors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  return {
    themeMode,
    isDark,
    colors,
    setThemeMode,
    toggleTheme,
    isHydrated,
  };
}
