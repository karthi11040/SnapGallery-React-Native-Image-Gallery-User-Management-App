import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ImageItem } from '../types/image';
import { useTheme } from '../hooks/useTheme';
import { useFavoriteStore } from '../store/favoriteStore';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { getAuthorInitials } from '../utils/filters';
import { IoHeart, IoHeartOutline, IoCameraOutline } from '../icons';

interface ImageCardProps {
  image: ImageItem;
  onPress: () => void;
  style?: ViewStyle;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress, style }) => {
  const { colors } = useTheme();
  const isFav = useFavoriteStore((state) => state.isFavorite(image.id));
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const initials = getAuthorInitials(image.author);
  // Optimized thumbnail size for snappy rendering
  const thumbnailUrl = `https://picsum.photos/id/${image.id}/400/500`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.glassCard,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Image Viewport */}
      <View style={[styles.imageContainer, { backgroundColor: colors.surfaceContainerHighest }]}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top HUD ID Badge */}
        <View style={styles.idBadge}>
          <Text style={[typography.labelCaps, styles.idBadgeText]}>
            #{image.id}
          </Text>
        </View>

        {/* Favorite Action Button */}
        <TouchableOpacity
          style={[
            styles.favBtn,
            isFav
              ? { backgroundColor: 'rgba(255, 75, 75, 0.35)', borderColor: colors.secondary }
              : { backgroundColor: 'rgba(15, 17, 23, 0.65)', borderColor: 'rgba(255, 255, 255, 0.2)' },
          ]}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(image);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isFav ? (
            <IoHeart size={18} color={colors.secondary} />
          ) : (
            <IoHeartOutline size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Card Footer Metas */}
      <View style={[styles.footer, { backgroundColor: colors.glassBackground }]}>
        <View style={styles.authorRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[typography.labelCaps, { color: colors.onPrimaryContainer, fontSize: 10 }]}>
              {initials}
            </Text>
          </View>
          <Text
            style={[styles.authorName, typography.labelMd, { color: colors.onSurface }]}
            numberOfLines={1}
          >
            {image.author}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <IoCameraOutline size={11} color={colors.onSurfaceVariant} />
            <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant, fontSize: 9 }]}>
              {image.width}×{image.height}
            </Text>
          </View>
          <View style={[styles.tagPill, { backgroundColor: colors.glassHighlight }]}>
            <Text style={[typography.labelCaps, { color: colors.tertiary, fontSize: 9, fontWeight: '700' }]}>
              RAW
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.borderRadiusLg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  idBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(12, 14, 20, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  idBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(12, 14, 20, 0.65)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
});
