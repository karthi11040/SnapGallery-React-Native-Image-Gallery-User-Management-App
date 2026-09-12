import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PrimaryButton } from './PrimaryButton';
import { IoAlertCircleOutline } from '../icons';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: ViewStyle;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  onRetry,
  retryTitle = 'Try Again',
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.errorContainer, borderColor: colors.error, borderWidth: 1 }]}>
        <IoAlertCircleOutline size={32} color={colors.onErrorContainer} />
      </View>
      <Text style={[styles.title, typography.headlineSm, { color: colors.onSurface }]}>
        Something went wrong
      </Text>
      <Text style={[styles.message, typography.bodyMd, { color: colors.onSurfaceVariant }]}>
        {message}
      </Text>
      {onRetry && (
        <PrimaryButton
          title={retryTitle}
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.spaceXl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.spaceLg,
  },
  exclamation: {
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    marginBottom: spacing.spaceSm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.spaceXl,
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
  },
});
