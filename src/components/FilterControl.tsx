import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterType } from '../types/image';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface FilterOption {
  type: FilterType;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const FILTER_OPTIONS: FilterOption[] = [
  { type: 'all', label: 'All Photos', iconName: 'grid-outline' },
  { type: 'am', label: 'Author A–M', iconName: 'person-outline' },
  { type: 'nz', label: 'Author N–Z', iconName: 'people-outline' },
  { type: 'curated', label: 'Curated', iconName: 'sparkles' },
];

interface FilterControlProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  style?: ViewStyle;
}

export const FilterControl: React.FC<FilterControlProps> = ({
  activeFilter,
  onSelectFilter,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {FILTER_OPTIONS.map((item) => {
        const isSelected = activeFilter === item.type;
        return (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.glassCard,
                borderColor: isSelected ? colors.primary : colors.glassBorder,
              },
            ]}
            onPress={() => onSelectFilter(item.type)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={item.iconName}
              size={13}
              color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                typography.labelMd,
                {
                  color: isSelected ? colors.onPrimary : colors.onSurfaceVariant,
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: 12,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.spaceXs,
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
