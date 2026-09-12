import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useDownloadStore } from '../store/downloadStore';
import { useTheme } from '../hooks/useTheme';
import { ImageCard } from '../components/ImageCard';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { ImageItem } from '../types/image';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { IoDownloadOutline, IoTrashOutline } from '../icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DownloadsScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const downloadedImages = useDownloadStore((state) => state.downloadedImages);
  const hydrateDownloads = useDownloadStore((state) => state.hydrateDownloads);
  const clearAllDownloads = useDownloadStore((state) => state.clearAllDownloads);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    hydrateDownloads();
  }, [hydrateDownloads]);

  const handleImagePress = (item: ImageItem) => {
    navigation.navigate('ImageDetails', { image: item });
  };

  const handleClearAll = () => {
    if (downloadedImages.length === 0) return;
    Alert.alert(
      'Clear Downloads',
      'Are you sure you want to clear your saved download list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllDownloads },
      ]
    );
  };

  const filteredDownloads = downloadedImages.filter((img) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      img.author.toLowerCase().includes(q) ||
      img.id.includes(q)
    );
  });

  const estimatedStorageMb = (downloadedImages.length * 2.4).toFixed(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.glassBorder }]}>
        <View style={styles.headerTitleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(126, 75, 255, 0.15)' }]}>
              <IoDownloadOutline size={20} color={colors.primary} />
            </View>
            <Text style={[typography.headlineMedium, { color: colors.onSurface, fontWeight: '800' }]}>
              Downloads
            </Text>
          </View>

          {downloadedImages.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={[styles.clearBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IoTrashOutline size={16} color={colors.error} />
              <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{downloadedImages.length}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Saved Photos</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
            <Text style={[styles.statValue, { color: colors.tertiary }]}>{estimatedStorageMb} MB</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Storage Used</Text>
          </View>
        </View>

        {/* Search */}
        {downloadedImages.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search downloaded photos..."
            />
          </View>
        )}
      </View>

      {/* Grid */}
      <FlatList
        data={filteredDownloads}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          filteredDownloads.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => handleImagePress(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'No Matching Downloads' : 'No Downloaded Photos Yet'}
            message={
              searchQuery
                ? `No downloads match "${searchQuery}".`
                : 'Photos you download will appear here for quick access.'
            }
            actionTitle={searchQuery ? 'Clear Search' : 'Explore Gallery'}
            onAction={() => {
              if (searchQuery) {
                setSearchQuery('');
              } else {
                navigation.navigate('Main', { screen: 'Gallery' });
              }
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.margin,
    paddingVertical: spacing.spaceMd,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  clearText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statPill: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.margin,
    paddingBottom: 90,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
