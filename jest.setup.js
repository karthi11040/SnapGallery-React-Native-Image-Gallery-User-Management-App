/* eslint-env jest */
const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key, value) => {
    mockStorage.set(key, String(value));
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    const val = mockStorage.get(key);
    return Promise.resolve(val !== undefined ? val : null);
  }),
  removeItem: jest.fn((key) => {
    mockStorage.delete(key);
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    mockStorage.clear();
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Array.from(mockStorage.keys()))),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: jest.fn(() => [true, null]),
  Inter_400Regular: 'Inter_400Regular',
  Inter_500Medium: 'Inter_500Medium',
  Inter_600SemiBold: 'Inter_600SemiBold',
  Inter_700Bold: 'Inter_700Bold',
  Inter_800ExtraBold: 'Inter_800ExtraBold',
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style, ...props }) => React.createElement(View, { style, ...props }, children),
  };
});

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
    fromModule: jest.fn(() => ({ downloadAsync: jest.fn(() => Promise.resolve()) })),
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const createMockIcon = (name) => (props) => {
    return React.createElement(Text, props, props.name || name);
  };
  return {
    Ionicons: createMockIcon('Ionicons'),
    Feather: createMockIcon('Feather'),
    MaterialIcons: createMockIcon('MaterialIcons'),
    MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
    AntDesign: createMockIcon('AntDesign'),
    FontAwesome: createMockIcon('FontAwesome'),
    Octicons: createMockIcon('Octicons'),
  };
});

jest.mock('expo-media-library', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  createAssetAsync: jest.fn((uri) => Promise.resolve({ uri })),
  saveToLibraryAsync: jest.fn(() => Promise.resolve()),
  getAlbumAsync: jest.fn(() => Promise.resolve(null)),
  createAlbumAsync: jest.fn(() => Promise.resolve(true)),
  addAssetsToAlbumAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('expo-media-library/legacy', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  createAssetAsync: jest.fn((uri) => Promise.resolve({ uri })),
  saveToLibraryAsync: jest.fn(() => Promise.resolve()),
  getAlbumAsync: jest.fn(() => Promise.resolve(null)),
  createAlbumAsync: jest.fn(() => Promise.resolve(true)),
  addAssetsToAlbumAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///cache/',
  downloadAsync: jest.fn(() => Promise.resolve({ status: 200, uri: 'file:///cache/image.jpg' })),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => true),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    ScreenStackHeaderConfig: Object.assign(View, {
      HeaderConfig: View,
    }),
    ScreenStackHeaderSubview: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderTitleView: View,
    ScreenStackHeaderCenterView: View,
    SearchBar: View,
    compatibilityFlags: {
      usesNewAndroidHeaderHeightImplementation: false,
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: typeof insets) => React.ReactNode }) => children(insets),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets, frame },
  };
});
