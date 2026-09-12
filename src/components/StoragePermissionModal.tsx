import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PrimaryButton } from './PrimaryButton';
import { IoFolderOpenOutline, IoCheckmarkCircle } from '../icons';

interface StoragePermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StoragePermissionModal: React.FC<StoragePermissionModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors.surfaceContainer,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              {/* Glowing Icon Badge */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.glassHighlight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <IoFolderOpenOutline size={36} color={colors.primary} />
              </View>

              {/* Title & Description */}
              <Text
                style={[
                  styles.title,
                  typography.headlineSm,
                  { color: colors.onSurface, fontWeight: '800' },
                ]}
              >
                Allow Storage Access
              </Text>
              <Text
                style={[
                  styles.description,
                  typography.bodyMd,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                SnapGallery needs permission to save high-resolution photos directly to your device gallery.
              </Text>

              {/* Bullet Highlights */}
              <View
                style={[
                  styles.featureBox,
                  {
                    backgroundColor: colors.glassBackground,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <View style={styles.featureItem}>
                  <IoCheckmarkCircle size={18} color={colors.tertiary} />
                  <Text
                    style={[
                      typography.bodySm,
                      { color: colors.onSurface, flex: 1, marginLeft: 8, fontWeight: '600' },
                    ]}
                  >
                    Save full-resolution RAW & JPEG images
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <IoCheckmarkCircle size={18} color={colors.tertiary} />
                  <Text
                    style={[
                      typography.bodySm,
                      { color: colors.onSurface, flex: 1, marginLeft: 8, fontWeight: '600' },
                    ]}
                  >
                    Organize into your SnapGallery album
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <PrimaryButton
                  title="Allow Storage Access"
                  onPress={() => {
                    onClose();
                    onConfirm();
                  }}
                  style={styles.confirmBtn}
                />
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.outlineVariant }]}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      typography.labelMd,
                      { color: colors.onSurfaceVariant, fontWeight: '600' },
                    ]}
                  >
                    Not Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.margin,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: spacing.borderRadiusXl,
    borderWidth: 1.5,
    padding: spacing.spaceLg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: spacing.spaceMd,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.spaceMd,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  featureBox: {
    width: '100%',
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    padding: spacing.spaceMd,
    marginBottom: spacing.spaceLg,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    width: '100%',
    gap: 10,
  },
  confirmBtn: {
    width: '100%',
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
  },
});
