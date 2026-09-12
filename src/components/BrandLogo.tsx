import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { IoAperture } from '../icons';

interface BrandLogoProps {
  size?: number;
  style?: ViewStyle;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 44, style }) => {
  const { colors } = useTheme();
  const iconSize = Math.round(size * 0.58);
  const borderRadius = Math.round(size * 0.28);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      <IoAperture size={iconSize} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
