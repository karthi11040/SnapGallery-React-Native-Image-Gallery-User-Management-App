import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PrimaryButton } from './PrimaryButton';
import { IoImagesOutline } from '../icons';

interface EmptyStateProps {
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.glassHighlight, borderColor: colors.glassBorder, borderWidth: 1 }]}>
        <IoImagesOutline size={30} color={colors.primary} />
      </View>
      <Text style={[styles.title, typography.headlineSm, { color: colors.onSurface }]}>
        {title}
      </Text>
      <Text style={[styles.message, typography.bodyMd, { color: colors.onSurfaceVariant }]}>
        {message}
      </Text>
      {actionTitle && onAction && (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.spaceXl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.spaceMd,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    marginBottom: spacing.spaceXs,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.spaceLg,
    maxWidth: 260,
  },
  button: {
    minWidth: 140,
  },
});
