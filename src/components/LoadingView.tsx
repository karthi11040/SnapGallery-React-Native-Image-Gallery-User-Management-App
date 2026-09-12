import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface LoadingViewProps {
  message?: string;
  fullscreen?: boolean;
  style?: ViewStyle;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading...',
  fullscreen = false,
  style,
}) => {
  const { colors } = useTheme();

  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: fullscreen ? colors.background : 'transparent',
  };

  return (
    <View
      style={[
        styles.container,
        fullscreen && styles.fullscreen,
        dynamicContainerStyle,
        style,
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text style={[styles.message, typography.bodyMd, { color: colors.onSurfaceVariant }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.spaceXl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
  },
  message: {
    marginTop: spacing.spaceMd,
    textAlign: 'center',
  },
});
