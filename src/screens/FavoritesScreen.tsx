import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { getAuthorInitials } from '../utils/filters';
import { ImageItem } from '../types/image';
import {
  IoHeart,
  IoInformationCircle,
  IoTrashOutline,
  IoCloudOfflineOutline,
} from '../icons';

export const FavoritesScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favoritesList, removeFavorite, totalFavorites } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoritesList;
    const query = searchQuery.trim().toLowerCase();
    return favoritesList.filter((img) => img.author.toLowerCase().includes(query));
  }, [favoritesList, searchQuery]);

  const handleRemove = (item: ImageItem) => {
    removeFavorite(item.id);
    setToastMessage(`Removed ${item.author}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleItemPress = (item: ImageItem) => {
    navigation.navigate('ImageDetails', { image: item });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Title & Badge */}
      <View style={styles.titleRow}>
        <View>
          <View style={styles.vaultTagRow}>
            <View style={[styles.tagDot, { backgroundColor: colors.secondary }]} />
            <Text style={[typography.labelCaps, { color: colors.secondary, letterSpacing: 0.8, fontWeight: '700' }]}>
              PERSONAL VAULT
            </Text>
          </View>
          <Text style={[typography.displayLgMobile, { color: colors.onSurface, fontWeight: '800' }]}>
            Favorites
          </Text>
        </View>

        <View style={[styles.savedBadge, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          <IoHeart size={15} color={colors.secondary} />
          <Text style={[typography.labelMd, { color: colors.onSurface, marginLeft: 6, fontWeight: '700' }]}>
            {totalFavorites} Saved
          </Text>
        </View>
      </View>

      {/* Search Input */}
      {totalFavorites > 0 && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter saved favorites..."
          style={styles.searchBar}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={[styles.toast, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <IoInformationCircle size={16} color={colors.primary} />
            <Text style={[typography.bodySm, { color: colors.onSurface, fontWeight: '600' }]}>
              {toastMessage}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => {
          const initials = getAuthorInitials(item.author);
          const thumbUrl = `https://picsum.photos/id/${item.id}/500/350`;

          return (
            <TouchableOpacity
              style={[
                styles.favoriteCard,
                {
                  backgroundColor: colors.glassCard,
                  borderColor: colors.glassBorder,
                },
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: thumbUrl }} style={styles.cardImage} resizeMode="cover" />

              <View style={[styles.cardDetails, { backgroundColor: colors.glassBackground }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.authorBadgeRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
                      <Text style={[typography.labelCaps, { color: colors.onPrimaryContainer, fontSize: 10, fontWeight: '700' }]}>
                        {initials}
                      </Text>
                    </View>
                    <Text
                      style={[styles.authorName, typography.headlineSm, { color: colors.onSurface, fontSize: 15 }]}
                      numberOfLines={1}
                    >
                      {item.author}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.removeBtn, { backgroundColor: 'rgba(255, 75, 75, 0.15)' }]}
                    onPress={() => handleRemove(item)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <IoTrashOutline size={15} color={colors.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.metaRow}>
                  <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant, fontSize: 10 }]}>
                    #{item.id} • {item.width}×{item.height}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <IoCloudOfflineOutline size={11} color={colors.tertiary} />
                    <Text style={[typography.labelCaps, { color: colors.tertiary, fontSize: 10, fontWeight: '700' }]}>
                      Offline Ready
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title={totalFavorites === 0 ? 'No favorites yet' : 'No matching favorites'}
            message={
              totalFavorites === 0
                ? 'Tap the heart icon on any photo in the gallery to save it to your offline collection.'
                : 'No saved photos matched your search term.'
            }
            actionTitle={totalFavorites === 0 ? 'Explore Gallery' : 'Clear Search'}
            onAction={() => {
              if (totalFavorites === 0) {
                navigation.navigate('Main', { screen: 'Gallery' });
              } else {
                setSearchQuery('');
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
  headerContainer: {
    paddingVertical: spacing.spaceSm,
    marginBottom: spacing.spaceSm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.spaceMd,
  },
  vaultTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
  },
  searchBar: {
    marginTop: spacing.spaceXs,
  },
  listContent: {
    paddingHorizontal: spacing.margin,
  },
  favoriteCard: {
    flexDirection: 'row',
    borderRadius: spacing.borderRadiusLg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.spaceMd,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 110,
    height: 95,
  },
  cardDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 6,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    flex: 1,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  toast: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
