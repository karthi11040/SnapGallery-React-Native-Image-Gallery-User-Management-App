import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface IconProps {
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

// React Icons (io / io5 - Ionicons)
export const IoHeart: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="heart" size={size} color={color} style={style} />
);

export const IoHeartOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="heart-outline" size={size} color={color} style={style} />
);

export const IoArrowBack: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="arrow-back" size={size} color={color} style={style} />
);

export const IoShareSocialOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="share-social-outline" size={size} color={color} style={style} />
);

export const IoScanOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="scan-outline" size={size} color={color} style={style} />
);

export const IoCheckmarkCircle: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="checkmark-circle" size={size} color={color} style={style} />
);

export const IoAlertCircle: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="alert-circle" size={size} color={color} style={style} />
);

export const IoAlertCircleOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="alert-circle-outline" size={size} color={color} style={style} />
);

export const IoInformationCircle: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="information-circle" size={size} color={color} style={style} />
);

export const IoInformationCircleOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="information-circle-outline" size={size} color={color} style={style} />
);

export const IoCropOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="crop-outline" size={size} color={color} style={style} />
);

export const IoPricetagOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="pricetag-outline" size={size} color={color} style={style} />
);

export const IoFileTrayFullOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="file-tray-full-outline" size={size} color={color} style={style} />
);

export const IoServerOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="server-outline" size={size} color={color} style={style} />
);

export const IoCloseOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="close-outline" size={size} color={color} style={style} />
);

export const IoCloseCircle: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="close-circle" size={size} color={color} style={style} />
);

export const IoTrashOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="trash-outline" size={size} color={color} style={style} />
);

export const IoCloudOfflineOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="cloud-offline-outline" size={size} color={color} style={style} />
);

export const IoSearchOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="search-outline" size={size} color={color} style={style} />
);

export const IoFilterOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="filter-outline" size={size} color={color} style={style} />
);

export const IoPersonOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="person-outline" size={size} color={color} style={style} />
);

export const IoMailOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="mail-outline" size={size} color={color} style={style} />
);

export const IoCallOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="call-outline" size={size} color={color} style={style} />
);

export const IoLocationOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="location-outline" size={size} color={color} style={style} />
);

export const IoHomeOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="home-outline" size={size} color={color} style={style} />
);

export const IoBusinessOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="business-outline" size={size} color={color} style={style} />
);

export const IoLockClosedOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />
);

export const IoEyeOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="eye-outline" size={size} color={color} style={style} />
);

export const IoEyeOffOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="eye-off-outline" size={size} color={color} style={style} />
);

export const IoRefreshOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="refresh-outline" size={size} color={color} style={style} />
);

export const IoShieldCheckmarkOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="shield-checkmark-outline" size={size} color={color} style={style} />
);

export const IoFolderOpenOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="folder-open-outline" size={size} color={color} style={style} />
);

export const IoSunnyOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="sunny-outline" size={size} color={color} style={style} />
);

export const IoMoonOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="moon-outline" size={size} color={color} style={style} />
);

export const IoPhonePortraitOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="phone-portrait-outline" size={size} color={color} style={style} />
);

export const IoChevronDown: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="chevron-down" size={size} color={color} style={style} />
);

export const IoImagesOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="images-outline" size={size} color={color} style={style} />
);

export const IoAperture: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="aperture" size={size} color={color} style={style} />
);

export const IoDownload: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="download" size={size} color={color} style={style} />
);

export const IoDownloadOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="download-outline" size={size} color={color} style={style} />
);

export const IoSparklesOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="sparkles-outline" size={size} color={color} style={style} />
);

export const IoCreateOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="create-outline" size={size} color={color} style={style} />
);

export const IoSaveOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="save-outline" size={size} color={color} style={style} />
);

export const IoCameraOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="camera-outline" size={size} color={color} style={style} />
);

export const IoLogoApple: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="logo-apple" size={size} color={color} style={style} />
);

export const IoLogoGoogle: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="logo-google" size={size} color={color} style={style} />
);

export const IoCompassOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="compass-outline" size={size} color={color} style={style} />
);

export const IoRadioButtonOn: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="radio-button-on" size={size} color={color} style={style} />
);

export const IoRadioButtonOff: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="radio-button-off" size={size} color={color} style={style} />
);

export const IoImages: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="images" size={size} color={color} style={style} />
);

export const IoPerson: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="person" size={size} color={color} style={style} />
);

export const IoNotificationsOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="notifications-outline" size={size} color={color} style={style} />
);

export const IoGridOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="grid-outline" size={size} color={color} style={style} />
);

export const IoLeafOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="leaf-outline" size={size} color={color} style={style} />
);

export const IoPeopleOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="people-outline" size={size} color={color} style={style} />
);

export const IoChevronForward: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="chevron-forward" size={size} color={color} style={style} />
);

export const IoSettingsOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="settings-outline" size={size} color={color} style={style} />
);

export const IoLogOutOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="log-out-outline" size={size} color={color} style={style} />
);

export const IoColorPaletteOutline: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="color-palette-outline" size={size} color={color} style={style} />
);

export const IoCamera: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="camera" size={size} color={color} style={style} />
);

export const IoFlame: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="flame" size={size} color={color} style={style} />
);
