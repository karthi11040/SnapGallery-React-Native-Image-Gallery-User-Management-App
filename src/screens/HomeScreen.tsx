import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/types';
import { useImages } from '../hooks/useImages';
import { usePagination } from '../hooks/usePagination';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useFavoriteStore } from '../store/favoriteStore';
import { useDownloadStore } from '../store/downloadStore';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ImageCard } from '../components/ImageCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';
import { EmptyState } from '../components/EmptyState';
import { getAuthorInitials } from '../utils/filters';
import { ImageItem } from '../types/image';
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoNotificationsOutline,
  IoImagesOutline,
  IoHeart,
  IoDownloadOutline,
  IoGridOutline,
  IoLeafOutline,
  IoBusinessOutline,
  IoPeopleOutline,
  IoChevronForward,
  IoFlame,
  IoFilterOutline,
} from '../icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HERO_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=90';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: IoGridOutline },
  { id: 'nature', label: 'Nature', icon: IoLeafOutline },
  { id: 'cities', label: 'Cities', icon: IoBusinessOutline },
  { id: 'people', label: 'People', icon: IoPeopleOutline },
];

const RECOMMENDED_COLLECTIONS = [
  {
    id: 'c1',
    title: 'Nature',
    count: '320+ photos',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'c2',
    title: 'Cities',
    count: '280+ photos',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'c3',
    title: 'People',
    count: '150+ photos',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
];

export const HomeScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const favoritesCount = useFavoriteStore((state) => state.favoriteIds.length);
  const downloadsCount = useDownloadStore((state) => state.downloadedImages.length);

  const {
    images,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    filterType,
    fetchInitialImages,
    refreshImages,
    setSearchQuery,
    setFilterType,
  } = useImages();

  const { onEndReached, onEndReachedThreshold, isLoadingMore, hasMore } = usePagination();

  const userName = user?.fullName || 'Karthi';
  const firstName = userName.split(' ')[0];
  const userInitials = getAuthorInitials(userName);

  const handleImagePress = (item: ImageItem) => {
    navigation.navigate('ImageDetails', { image: item });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>
            <Text style={[styles.brandSnap, { color: colors.onSurface }]}>Snap</Text>
            <Text style={styles.brandGallery}>Gallery</Text>
          </Text>
          <Text style={[styles.tagline, { color: colors.outline }]}>
            C A P T U R E　 E X P L O R E　 S A V E
          </Text>
        </View>

        <View style={styles.topActions}>
          {/* Saved Credits Badge */}
          <View
            style={[
              styles.creditsBadge,
              { backgroundColor: 'rgba(126, 75, 255, 0.12)', borderColor: 'rgba(126, 75, 255, 0.3)' },
            ]}
          >
            <Text style={styles.creditsBolt}>⚡</Text>
            <Text style={[styles.creditsText, { color: colors.primary }]}>
              {user?.credits ?? 100} Credits
            </Text>
          </View>

          {/* Theme Toggle Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
            ]}
            activeOpacity={0.8}
          >
            {isDark ? (
              <IoSunnyOutline size={20} color="#FFD700" />
            ) : (
              <IoMoonOutline size={20} color="#7E4BFF" />
            )}
          </TouchableOpacity>

          {/* Notification Bell */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
            ]}
            activeOpacity={0.8}
          >
            <IoNotificationsOutline size={20} color={colors.onSurface} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          {/* User Avatar */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
            style={[
              styles.avatarBtn,
              { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
            ]}
            activeOpacity={0.8}
          >
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarBtnImage} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.onPrimaryContainer }]}>
                {userInitials}
              </Text>
            )}
            <View style={styles.avatarStatus} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting Banner */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greetingTitle, { color: colors.onSurface }]}>
          Hi {firstName},
        </Text>
        <Text style={[styles.greetingSubtitle, { color: colors.onSurfaceVariant }]}>
          Let&apos;s explore something beautiful today!
        </Text>
      </View>

      {/* Quick Dashboard Stats Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[
            styles.statCard,
            { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
          ]}
          activeOpacity={0.8}
          onPress={() => setFilterType('all')}
        >
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(126, 75, 255, 0.15)' }]}>
            <IoImagesOutline size={16} color={colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              1.2K
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              Photos
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Main', { screen: 'Favorites' })}
        >
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 98, 208, 0.15)' }]}>
            <IoHeart size={16} color="#FF62D0" />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {favoritesCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              Favorites
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            { backgroundColor: colors.glassCard, borderColor: colors.glassBorder },
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Main', { screen: 'Downloads' })}
        >
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(123, 208, 255, 0.15)' }]}>
            <IoDownloadOutline size={16} color="#009BD1" />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {downloadsCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
              Downloads
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Category Horizontal Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected =
            (cat.id === 'all' && filterType === 'all') ||
            (cat.id !== 'all' && filterType.toLowerCase() === cat.id);
          const IconComp = cat.icon;

          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setFilterType(cat.id as any)}
              style={styles.categoryTouch}
              activeOpacity={0.85}
            >
              {isSelected ? (
                <LinearGradient
                  colors={['#7E4BFF', '#A862FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryPillActive}
                >
                  <IconComp size={16} color="#FFFFFF" />
                  <Text style={styles.categoryTextActive}>{cat.label}</Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.categoryPillInactive,
                    {
                      backgroundColor: colors.glassCard,
                      borderColor: colors.glassBorder,
                    },
                  ]}
                >
                  <IconComp size={16} color={colors.onSurfaceVariant} />
                  <Text style={[styles.categoryTextInactive, { color: colors.onSurfaceVariant }]}>
                    {cat.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Inspiration Hero Carousel Banner */}
      <View style={styles.heroCard}>
        <Image
          source={{ uri: HERO_BANNER_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(15, 17, 30, 0.25)', 'rgba(15, 17, 30, 0.90)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>
            Find Inspiration <Text style={styles.heroTitleAccent}>Everyday</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Beautiful photos. Amazing creators. All in one place.
          </Text>

          <View style={styles.carouselDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </LinearGradient>
      </View>

      {/* Recommended Collections Horizontal List */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Recommended for you
        </Text>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => setFilterType('all')}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
          <IoChevronForward size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendScroll}
      >
        {RECOMMENDED_COLLECTIONS.map((rec) => {
          const catKey = rec.id === 'c1' ? 'nature' : rec.id === 'c2' ? 'cities' : 'people';
          const isSelected = filterType.toLowerCase() === catKey;

          return (
            <TouchableOpacity
              key={rec.id}
              style={[
                styles.recCard,
                isSelected && { borderWidth: 2, borderColor: colors.primary },
              ]}
              activeOpacity={0.88}
              onPress={() => setFilterType(catKey)}
            >
              <Image source={{ uri: rec.image }} style={styles.recImage} />
              <LinearGradient
                colors={['transparent', 'rgba(17, 19, 31, 0.88)']}
                style={styles.recOverlay}
              >
                <View>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recCount}>{rec.count}</Text>
                </View>
                <View style={[styles.recArrowBox, isSelected && { backgroundColor: colors.primary }]}>
                  <IoChevronForward size={14} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Trending Section Header */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <IoFlame size={18} color="#FF623E" />
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Trending Photos
          </Text>
        </View>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
          <IoChevronForward size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 6 }]}>
            Loading more photos...
          </Text>
        </View>
      );
    }
    if (!hasMore && images.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text style={[typography.labelCaps, { color: colors.outline }]}>
            End of Gallery
          </Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading && !isRefreshing) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <LoadingView fullscreen message="Curating darkroom photos from SnapGallery..." />
      </View>
    );
  }

  if (error && images.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ErrorView message={error} onRetry={fetchInitialImages} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => handleImagePress(item)}
            style={styles.cardItem}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshImages}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListEmptyComponent={
          <EmptyState
            title="No photos found"
            message="We couldn't find matches for this filter. Try clearing or searching another author."
            actionTitle="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setFilterType('all');
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
  listContent: {
    paddingHorizontal: 18,
  },
  headerContainer: {
    paddingTop: 10,
  },

  /* Top Bar */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'column',
  },
  brandText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 26,
    letterSpacing: -0.8,
  },
  brandSnap: {},
  brandGallery: {
    color: '#B05CFF',
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 1,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF3B30',
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarBtnImage: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  avatarStatus: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CD964',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    marginRight: 4,
  },
  creditsBolt: {
    fontSize: 12,
  },
  creditsText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  /* Greeting */
  greetingSection: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    marginTop: 2,
  },

  /* Quick Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },

  /* Search */
  searchBar: {
    marginBottom: 14,
  },

  /* Categories */
  categoryScroll: {
    gap: 10,
    paddingBottom: 16,
  },
  categoryTouch: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  categoryPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  categoryPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  categoryTextInactive: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  /* Hero Banner */
  heroCard: {
    height: 170,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 22,
    letterSpacing: -0.4,
  },
  heroTitleAccent: {
    color: '#7BD0FF',
  },
  heroSubtitle: {
    color: '#E0E3F5',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4,
    maxWidth: 240,
  },
  carouselDots: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },

  /* Sections */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },

  /* Recommended Cards */
  recommendScroll: {
    gap: 12,
    paddingBottom: 20,
  },
  recCard: {
    width: 140,
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
  },
  recImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  recOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
  },
  recTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  recCount: {
    color: '#D0D4EA',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  recArrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Grid Layout */
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardItem: {
    flex: 0.485,
    marginBottom: 14,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
