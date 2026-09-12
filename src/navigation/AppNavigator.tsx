import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../hooks/useTheme';
import {
  IoImagesOutline,
  IoImages,
  IoHeartOutline,
  IoHeart,
  IoDownloadOutline,
  IoDownload,
  IoPersonOutline,
  IoPerson,
} from '../icons';

const Tab = createBottomTabNavigator<AppTabParamList>();

const TabItem: React.FC<{
  renderIcon: (props: { size: number; color: string }) => React.ReactNode;
  label: string;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
  activeBg: string;
}> = ({ renderIcon, label, focused, activeColor, inactiveColor, activeBg }) => {
  return (
    <View style={styles.tabItemContainer}>
      <View
        style={[
          styles.iconPill,
          focused && [styles.iconPillActive, { backgroundColor: activeBg }],
        ]}
      >
        {renderIcon({
          size: 22,
          color: focused ? activeColor : inactiveColor,
        })}
      </View>
      <Text
        style={[
          styles.tabLabel,
          {
            color: focused ? activeColor : inactiveColor,
            fontWeight: focused ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 12);
  const tabHeight = 62 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.glassBackground,
          borderTopColor: colors.glassBorder,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomInset - 4,
          paddingTop: 8,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        },
      }}
    >
      <Tab.Screen
        name="Gallery"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              renderIcon={({ size, color }) =>
                focused ? <IoImages size={size} color={color} /> : <IoImagesOutline size={size} color={color} />
              }
              label="Gallery"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={colors.onSurfaceVariant}
              activeBg={colors.glassHighlight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              renderIcon={({ size, color }) =>
                focused ? <IoHeart size={size} color={color} /> : <IoHeartOutline size={size} color={color} />
              }
              label="Favorites"
              focused={focused}
              activeColor={colors.secondary}
              inactiveColor={colors.onSurfaceVariant}
              activeBg="rgba(255, 158, 158, 0.18)"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Downloads"
        component={DownloadsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              renderIcon={({ size, color }) =>
                focused ? <IoDownload size={size} color={color} /> : <IoDownloadOutline size={size} color={color} />
              }
              label="Downloads"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={colors.onSurfaceVariant}
              activeBg="rgba(126, 75, 255, 0.18)"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              renderIcon={({ size, color }) =>
                focused ? <IoPerson size={size} color={color} /> : <IoPersonOutline size={size} color={color} />
              }
              label="Profile"
              focused={focused}
              activeColor={colors.tertiary}
              inactiveColor={colors.onSurfaceVariant}
              activeBg="rgba(123, 208, 255, 0.18)"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  iconPill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});

