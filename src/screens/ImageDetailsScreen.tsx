import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../hooks/useTheme';
import { useFavoriteStore } from '../store/favoriteStore';
import { useDownloadStore } from '../store/downloadStore';
import { useImages } from '../hooks/useImages';
import { downloadService } from '../services/downloadService';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PrimaryButton } from '../components/PrimaryButton';
import { getAuthorInitials } from '../utils/filters';
import {
  IoArrowBack,
  IoShareSocialOutline,
  IoScanOutline,
  IoCheckmarkCircle,
  IoCropOutline,
  IoPricetagOutline,
  IoFileTrayFullOutline,
  IoServerOutline,
  IoHeart,
  IoHeartOutline,
  IoAlertCircleOutline,
  IoCloseOutline,
} from '../icons';

import { StoragePermissionModal } from '../components/StoragePermissionModal';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

export const ImageDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { image } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const isFav = useFavoriteStore((state) => state.isFavorite(image.id));
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const highResUrl = image.download_url || `https://picsum.photos/id/${image.id}/1200/1500`;
  const initials = getAuthorInitials(image.author);

  const handleDownloadClick = () => {
    setShowPermissionModal(true);
  };

  const handleConfirmedDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(null);
    setDownloadError(null);

    const result = await downloadService.downloadAndSaveImage(highResUrl, image.id);
    setIsDownloading(false);

    if (result.success) {
      await useDownloadStore.getState().addDownload(image);
      setDownloadSuccess('Saved to Device Gallery!');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } else {
      setDownloadError(result.error || 'Failed to download image.');
      setTimeout(() => setDownloadError(null), 3500);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this photo by ${image.author} on SnapGallery: ${image.url}`,
        url: image.url,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.glassBorder, backgroundColor: colors.glassBackground }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IoArrowBack size={22} color={colors.onSurface} />
        </TouchableOpacity>

        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '700' }]}>
          Photo Detail
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleShare}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IoShareSocialOutline size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Immersive Viewport */}
        <View style={[styles.viewportContainer, { backgroundColor: colors.surfaceContainerLowest }]}>
          <Image source={{ uri: highResUrl }} style={styles.mainImage} resizeMode="cover" />

          {/* HUD Badges */}
          <View style={styles.hudTopRow}>
            <View style={[styles.hudPill, { backgroundColor: 'rgba(12,14,19,0.75)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5 }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.tertiary }]} />
              <Text style={[typography.labelCaps, { color: colors.tertiary, fontWeight: '700' }]}>
                RAW MASTER
              </Text>
            </View>
            <View style={[styles.hudPill, { backgroundColor: 'rgba(12,14,19,0.75)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5 }]}>
              <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant }]}>
                ISO 100 • 24mm • ƒ/2.8
              </Text>
            </View>
          </View>

          {/* Tap to Fullscreen */}
          <TouchableOpacity
            style={[styles.fullscreenBtn, { backgroundColor: 'rgba(20,22,28,0.85)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 }]}
            onPress={() => setIsFullscreen(true)}
            activeOpacity={0.8}
          >
            <IoScanOutline size={17} color={colors.onSurface} />
            <Text style={[typography.labelMd, { color: colors.onSurface, marginLeft: 7 }]}>
              Tap to view full screen
            </Text>
          </TouchableOpacity>
        </View>

        {/* Photographer Card */}
        <View style={[styles.authorCard, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          <View style={styles.authorInfo}>
            <View style={[styles.authorAvatar, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[typography.labelLg, { color: colors.onPrimaryContainer, fontWeight: '700' }]}>
                {initials}
              </Text>
            </View>
            <View style={styles.authorTextGroup}>
              <View style={styles.authorVerifiedRow}>
                <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                  {image.author}
                </Text>
                <IoCheckmarkCircle size={16} color={colors.primary} style={{ marginLeft: 5 }} />
              </View>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                Picsum Verified Photographer
              </Text>
            </View>
          </View>
        </View>

        {/* Technical Specs Capsule Grid */}
        <View style={styles.specsSection}>
          <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant, marginBottom: 8, letterSpacing: 0.8 }]}>
            METADATA & SPECIFICATIONS
          </Text>
          <View style={styles.specsGrid}>
            <View style={[styles.specCapsule, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IoCropOutline size={12} color={colors.onSurfaceVariant} />
                <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant }]}>
                  RESOLUTION
                </Text>
              </View>
              <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '600' }]}>
                {image.width || 4000} × {image.height || 2667} px
              </Text>
            </View>
            <View style={[styles.specCapsule, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IoPricetagOutline size={12} color={colors.tertiary} />
                <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant }]}>
                  CATALOG TOKEN
                </Text>
              </View>
              <Text style={[typography.labelMd, { color: colors.tertiary, fontWeight: '700' }]}>
                #{image.id}
              </Text>
            </View>
            <View style={[styles.specCapsule, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IoFileTrayFullOutline size={12} color={colors.onSurfaceVariant} />
                <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant }]}>
                  COMPRESSION
                </Text>
              </View>
              <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '600' }]}>
                JPEG • 98% Qual
              </Text>
            </View>
            <View style={[styles.specCapsule, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IoServerOutline size={12} color={colors.tertiary} />
                <Text style={[typography.labelCaps, { color: colors.onSurfaceVariant }]}>
                  PIPELINE
                </Text>
              </View>
              <Text style={[typography.labelMd, { color: colors.tertiary, fontWeight: '700' }]}>
                Picsum Engine API
              </Text>
            </View>
          </View>
        </View>

        {/* Download & Favorite Action Bar */}
        <View style={[styles.actionBar, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          <View style={styles.actionButtonsRow}>
            <PrimaryButton
              title="Download to Gallery"
              onPress={handleDownloadClick}
              loading={isDownloading}
              style={styles.downloadCta}
            />
            <TouchableOpacity
              style={[
                styles.favCta,
                {
                  backgroundColor: isFav
                    ? 'rgba(255, 75, 75, 0.25)'
                    : colors.glassHighlight,
                  borderColor: isFav ? colors.secondary : colors.glassBorder,
                },
              ]}
              onPress={() => toggleFavorite(image)}
              activeOpacity={0.8}
            >
              {isFav ? (
                <IoHeart size={22} color={colors.secondary} />
              ) : (
                <IoHeartOutline size={22} color={colors.onSurface} />
              )}
            </TouchableOpacity>
          </View>

          {/* Feedback Status */}
          {downloadSuccess && (
            <View style={[styles.statusBanner, { backgroundColor: colors.primaryContainer }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <IoCheckmarkCircle size={16} color={colors.onPrimaryContainer} />
                <Text style={[typography.labelMd, { color: colors.onPrimaryContainer, fontWeight: '700' }]}>
                  {downloadSuccess}
                </Text>
              </View>
            </View>
          )}

          {downloadError && (
            <View style={[styles.statusBanner, { backgroundColor: colors.errorContainer }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <IoAlertCircleOutline size={16} color={colors.onErrorContainer} />
                <Text style={[typography.bodySm, { color: colors.onErrorContainer }]}>
                  {downloadError}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Storage Permission Glass Popup */}
      <StoragePermissionModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onConfirm={handleConfirmedDownload}
      />

      {/* Full-Screen Zoom View Modal */}
      <Modal visible={isFullscreen} transparent animationType="fade" onRequestClose={() => setIsFullscreen(false)}>
        <View style={styles.fullscreenModal}>
          <TouchableOpacity
            style={styles.closeFullscreenBtn}
            onPress={() => setIsFullscreen(false)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <IoCloseOutline size={20} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.closeFullscreenText}>Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: highResUrl }} style={styles.modalImage} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.margin,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: spacing.space2xl,
  },
  viewportContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  hudTopRow: {
    position: 'absolute',
    top: spacing.spaceMd,
    left: spacing.spaceMd,
    right: spacing.spaceMd,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.spaceMd,
    paddingVertical: 4,
    borderRadius: spacing.borderRadiusFull,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  fullscreenBtn: {
    position: 'absolute',
    bottom: spacing.spaceMd,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.spaceLg,
    paddingVertical: spacing.spaceSm,
    borderRadius: spacing.borderRadiusFull,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  authorCard: {
    marginHorizontal: spacing.margin,
    marginTop: spacing.spaceLg,
    padding: spacing.spaceMd,
    borderRadius: spacing.borderRadiusLg,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.spaceMd,
  },
  authorTextGroup: {
    flex: 1,
  },
  authorVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specsSection: {
    marginHorizontal: spacing.margin,
    marginTop: spacing.spaceLg,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
  },
  specCapsule: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: spacing.spaceMd,
    borderRadius: spacing.borderRadiusMd,
    gap: 4,
  },
  actionBar: {
    marginHorizontal: spacing.margin,
    marginTop: spacing.spaceLg,
    padding: spacing.spaceMd,
    borderRadius: spacing.borderRadiusXl,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.spaceSm,
  },
  downloadCta: {
    flex: 1,
  },
  favCta: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    marginTop: spacing.spaceSm,
    padding: spacing.spaceSm,
    borderRadius: spacing.borderRadiusMd,
    alignItems: 'center',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullscreenBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 24,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: spacing.borderRadiusFull,
  },
  closeFullscreenText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalImage: {
    width: '100%',
    height: '90%',
  },
});
