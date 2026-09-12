import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
  textStyle,
  testID,
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled && !loading) return colors.surfaceContainerHigh;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.surfaceContainerHigh;
      case 'outline':
        return 'transparent';
      case 'danger':
        return colors.errorContainer;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled && !loading) return colors.outline;
    switch (variant) {
      case 'primary':
        return colors.onPrimary;
      case 'secondary':
        return colors.onSurface;
      case 'outline':
        return colors.primary;
      case 'danger':
        return colors.error;
      default:
        return colors.onPrimary;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: variant === 'outline' ? colors.outline : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    opacity: disabled && !loading ? 0.6 : 1,
  };

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, buttonStyle, style]}
    >
      {loading ? (
        <View style={styles.contentRow}>
          <ActivityIndicator size="small" color={getTextColor()} />
          <Text style={[styles.text, typography.labelLg, { color: getTextColor() }, textStyle]}>
            {' '}Processing...
          </Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, typography.labelLg, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: spacing.borderRadiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.spaceLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.spaceSm,
  },
  text: {
    fontWeight: '600',
  },
});
