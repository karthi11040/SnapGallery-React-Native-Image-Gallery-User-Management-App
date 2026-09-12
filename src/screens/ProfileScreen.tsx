import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useDownloadStore } from '../store/downloadStore';
import { useTheme } from '../hooks/useTheme';
import { getAuthorInitials } from '../utils/filters';
import { User } from '../types/auth';
import { ThemeMode } from '../types/theme';
import {
  IoPerson,
  IoColorPaletteOutline,
  IoServerOutline,
  IoDownloadOutline,
  IoShieldCheckmarkOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoChevronForward,
  IoCreateOutline,
  IoSaveOutline,
  IoCamera,
  IoCloseOutline,
  IoCameraOutline,
  IoImagesOutline,
  IoSparklesOutline,
  IoCheckmarkCircle,
} from '../icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_AVATAR_IMAGE =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
];

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { totalFavorites } = useFavorites();
  const downloadsCount = useDownloadStore((state) => state.downloadedImages.length);
  const { colors, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || DEFAULT_AVATAR_IMAGE);

  const [fullName, setFullName] = useState(user?.fullName || 'Karthi');
  const [email, setEmail] = useState(user?.email || 'karthi@snapgallery.art');
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '5550192834');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [address, setAddress] = useState(user?.address || '100 Gallery Plaza');
  const [city, setCity] = useState(user?.city || 'San Francisco, CA');
  const [bio, setBio] = useState('Exploring the world through photos 💜');

  const [cacheCleared, setCacheCleared] = useState(false);

  const usernameHandle = `@${(user?.fullName || fullName).toLowerCase().replace(/\s+/g, '')}11040`;

  const handleSaveProfile = async () => {
    const updated: Partial<User> = {
      fullName,
      email,
      mobileNumber,
      gender,
      address,
      city,
      avatarUrl,
    };
    await updateProfile(updated);
    setShowPersonalInfoModal(false);
    Alert.alert('Profile Updated', 'Your profile details have been saved.');
  };

  const handlePickFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Gallery access is required to pick a profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        setAvatarUrl(selectedUri);
        await updateProfile({ avatarUrl: selectedUri });
        setShowAvatarModal(false);
        Alert.alert('Profile Photo Updated', 'Your new profile picture has been saved!');
      }
    } catch {
      Alert.alert('Error', 'Could not open photo library.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera access is required to take a profile photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        setAvatarUrl(selectedUri);
        await updateProfile({ avatarUrl: selectedUri });
        setShowAvatarModal(false);
        Alert.alert('Profile Photo Updated', 'Your camera photo has been set as profile picture!');
      }
    } catch {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  const handleSelectPresetAvatar = async (presetUri: string) => {
    setAvatarUrl(presetUri);
    await updateProfile({ avatarUrl: presetUri });
    setShowAvatarModal(false);
    Alert.alert('Profile Photo Updated', 'Avatar preset applied!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of SnapGallery?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Storage & Cache',
      'Clear local cache (12.4 MB)? Offline favorites & downloads remain saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCacheCleared(true);
            setTimeout(() => setCacheCleared(false), 2500);
          },
        },
      ]
    );
  };

  const handleToggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark';
    setThemeMode(nextMode);
  };

  const formattedThemeLabel = themeMode === 'dark' ? 'Dark' : themeMode === 'light' ? 'Light' : 'System';
  const activeAvatar = user?.avatarUrl || avatarUrl || DEFAULT_AVATAR_IMAGE;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.brandText}>
              <Text style={[styles.brandSnap, { color: colors.onSurface }]}>Snap</Text>
              <Text style={styles.brandGallery}>Gallery</Text>
            </Text>
            <Text style={[styles.tagline, { color: colors.onSurfaceVariant }]}>
              C A P T U R E　 E X P L O R E　 S A V E
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}
            onPress={() => Alert.alert('Settings', 'App Settings & Notifications.')}
            activeOpacity={0.8}
          >
            <IoSettingsOutline size={20} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Main User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          <View style={styles.userCardHeader}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setShowAvatarModal(true)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: activeAvatar }} style={styles.avatarImage} />
              <View style={styles.cameraBadge}>
                <IoCamera size={13} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.userInfoGroup}>
              <Text style={[styles.userName, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                {user?.fullName || fullName}
              </Text>
              <Text style={[styles.userHandle, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                {usernameHandle}
              </Text>
              <Text style={[styles.userBio, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                {bio}
              </Text>
            </View>
          </View>

          {/* Edit Actions Bar */}
          <View style={styles.userActionsBar}>
            <TouchableOpacity
              style={[styles.userActionPill, { backgroundColor: 'rgba(126, 75, 255, 0.12)', borderColor: 'rgba(126, 75, 255, 0.3)' }]}
              onPress={() => setShowAvatarModal(true)}
              activeOpacity={0.8}
            >
              <IoCameraOutline size={14} color="#7E4BFF" />
              <Text style={[styles.userActionText, { color: '#7E4BFF' }]}>Change Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.userActionPill, { backgroundColor: 'rgba(166, 92, 255, 0.12)', borderColor: 'rgba(166, 92, 255, 0.3)' }]}
              onPress={() => setShowPersonalInfoModal(true)}
              activeOpacity={0.8}
            >
              <IoCreateOutline size={14} color="#C49BFF" />
              <Text style={[styles.userActionText, { color: '#C49BFF' }]}>Edit Details</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Bar Inside Card */}
          <View style={[styles.statsRow, { borderTopColor: colors.glassBorder }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>248</Text>
              <Text style={[styles.statTitle, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>Photos Viewed</Text>
            </View>
            <View style={[styles.statLine, { backgroundColor: colors.glassBorder }]} />
            <TouchableOpacity
              style={styles.statCol}
              onPress={() => navigation.navigate('Main', { screen: 'Favorites' })}
            >
              <Text style={[styles.statNum, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{totalFavorites}</Text>
              <Text style={[styles.statTitle, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>Favorites</Text>
            </TouchableOpacity>
            <View style={[styles.statLine, { backgroundColor: colors.glassBorder }]} />
            <TouchableOpacity
              style={styles.statCol}
              onPress={() => navigation.navigate('Main', { screen: 'Downloads' })}
            >
              <Text style={[styles.statNum, { color: colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{downloadsCount}</Text>
              <Text style={[styles.statTitle, { color: colors.onSurfaceVariant }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>Downloads</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options Container Card */}
        <View style={[styles.menuCard, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          {/* Personal Information */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowPersonalInfoModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(126, 75, 255, 0.15)' }]}>
                <IoPerson size={18} color="#9A6BFF" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>Personal Information</Text>
                <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>View and edit your details</Text>
              </View>
            </View>
            <IoChevronForward size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.glassBorder }]} />

          {/* App Theme */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleToggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(123, 208, 255, 0.15)' }]}>
                <IoColorPaletteOutline size={18} color="#7BD0FF" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>App Theme</Text>
                <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>Choose your preferred theme</Text>
              </View>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={[styles.menuRightValue, { color: colors.onSurfaceVariant }]}>{formattedThemeLabel}</Text>
              <IoChevronForward size={18} color={colors.onSurfaceVariant} />
            </View>
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.glassBorder }]} />

          {/* Storage & Cache */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(255, 179, 0, 0.15)' }]}>
                <IoServerOutline size={18} color="#FFB300" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>Storage & Cache</Text>
                <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>Manage app data</Text>
              </View>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={[styles.menuRightValue, { color: colors.onSurfaceVariant }]}>
                {cacheCleared ? 'Cleared' : '12.4 MB'}
              </Text>
              <IoChevronForward size={18} color={colors.onSurfaceVariant} />
            </View>
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.glassBorder }]} />

          {/* Downloads */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Main', { screen: 'Downloads' })}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(126, 75, 255, 0.15)' }]}>
                <IoDownloadOutline size={18} color="#9A6BFF" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>Downloads</Text>
                <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>View your downloaded photos</Text>
              </View>
            </View>
            <IoChevronForward size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.glassBorder }]} />

          {/* Privacy & Security */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Privacy & Security', 'Your account is secured with end-to-end local encryption.')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: 'rgba(76, 217, 100, 0.15)' }]}>
                <IoShieldCheckmarkOutline size={18} color="#4CD964" />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>Privacy & Security</Text>
                <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>Manage your account security</Text>
              </View>
            </View>
            <IoChevronForward size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutPillBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <IoLogOutOutline size={20} color="#FF6E6E" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Quote Footer Card */}
        <View style={[styles.quoteCard, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={[styles.quoteText, { color: colors.onSurfaceVariant }]}>
            “Good photos tell great stories.”
          </Text>
          <Text style={[styles.quoteAuthor, { color: colors.onSurfaceVariant }]}>
            — SnapGallery
          </Text>
        </View>
      </ScrollView>

      {/* Change Profile Picture Modal */}
      <Modal visible={showAvatarModal} transparent animationType="slide" onRequestClose={() => setShowAvatarModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Change Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} hitSlop={10}>
                <IoCloseOutline size={22} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Current Active Preview */}
            <View style={styles.activePreviewContainer}>
              <Image source={{ uri: activeAvatar }} style={styles.activePreviewImage} />
              <Text style={[styles.activePreviewText, { color: colors.onSurfaceVariant }]}>
                Current Avatar
              </Text>
            </View>

            {/* Source Buttons */}
            <TouchableOpacity style={styles.avatarOptionBtn} onPress={handleTakePhoto} activeOpacity={0.8}>
              <View style={[styles.avatarOptionIcon, { backgroundColor: 'rgba(126, 75, 255, 0.15)' }]}>
                <IoCameraOutline size={20} color="#7E4BFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.avatarOptionTitle, { color: colors.onSurface }]}>Take Photo with Camera</Text>
                <Text style={[styles.avatarOptionSub, { color: colors.onSurfaceVariant }]}>Use device camera to snap picture</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarOptionBtn} onPress={handlePickFromLibrary} activeOpacity={0.8}>
              <View style={[styles.avatarOptionIcon, { backgroundColor: 'rgba(123, 208, 255, 0.15)' }]}>
                <IoImagesOutline size={20} color="#009BD1" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.avatarOptionTitle, { color: colors.onSurface }]}>Choose from Gallery</Text>
                <Text style={[styles.avatarOptionSub, { color: colors.onSurfaceVariant }]}>Select photo from device library</Text>
              </View>
            </TouchableOpacity>

            {/* Curated Presets */}
            <View style={styles.presetSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <IoSparklesOutline size={16} color="#7E4BFF" />
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>CURATED AVATAR PRESETS</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isSelected = activeAvatar === preset;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectPresetAvatar(preset)}
                      style={[
                        styles.presetItem,
                        isSelected && { borderColor: '#7E4BFF', borderWidth: 2 },
                      ]}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: preset }} style={styles.presetImage} />
                      {isSelected && (
                        <View style={styles.presetCheck}>
                          <IoCheckmarkCircle size={16} color="#7E4BFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Personal Information Edit Modal */}
      <Modal visible={showPersonalInfoModal} transparent animationType="slide" onRequestClose={() => setShowPersonalInfoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.glassCard, borderColor: colors.glassBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Personal Information</Text>
              <TouchableOpacity onPress={() => setShowPersonalInfoModal(false)} hitSlop={10}>
                <IoCloseOutline size={22} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Profile Photo Edit Card */}
              <View style={[styles.fieldContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 12, borderRadius: 16, marginBottom: 14 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Image source={{ uri: activeAvatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.onSurface, marginBottom: 0 }]}>PROFILE PHOTO</Text>
                    <Text style={{ fontSize: 11, color: colors.onSurfaceVariant, fontFamily: 'Inter_400Regular' }}>Tap to update photo</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: '#7E4BFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  onPress={() => {
                    setShowPersonalInfoModal(false);
                    setTimeout(() => setShowAvatarModal(true), 300);
                  }}
                  activeOpacity={0.8}
                >
                  <IoCameraOutline size={14} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>FULL NAME</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>EMAIL ADDRESS</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>MOBILE NUMBER</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>CITY / LOCATION</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>STATUS BIO</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface, borderColor: colors.glassBorder, backgroundColor: colors.background }]}
                  value={bio}
                  onChangeText={setBio}
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.8}>
              <IoSaveOutline size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Profile Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  /* Top Header */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 26,
    letterSpacing: -1,
  },
  brandSnap: {
    fontWeight: '800',
  },
  brandGallery: {
    color: '#A65CFF',
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 7.5,
    letterSpacing: 2,
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* User Card */
  userCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7E4BFF',
    borderWidth: 2,
    borderColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoGroup: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: -0.3,
  },
  userHandle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    marginTop: 1,
  },
  userBio: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  userActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 14,
  },
  userActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  userActionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
  },

  /* Stats inside card */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 14,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
  },
  statTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 2,
  },
  statLine: {
    width: 1,
    height: 28,
  },

  /* Menu Card */
  menuCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14.5,
  },
  menuSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuRightValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
  },
  menuDivider: {
    height: 1,
    width: '100%',
  },
  logoutPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.4)',
    backgroundColor: 'rgba(255, 77, 77, 0.08)',
    marginTop: 14,
    marginBottom: 6,
    gap: 8,
  },
  logoutText: {
    color: '#FF6E6E',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },

  /* Quote Card */
  quoteCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  quoteMark: {
    fontSize: 22,
    color: '#A65CFF',
    marginBottom: -8,
  },
  quoteText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAuthor: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginTop: 4,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  activePreviewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  activePreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#7E4BFF',
  },
  activePreviewText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 6,
  },
  avatarOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
    gap: 12,
  },
  avatarOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  avatarOptionSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    marginTop: 1,
  },
  presetSection: {
    marginTop: 10,
  },
  presetScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  presetItem: {
    position: 'relative',
    borderRadius: 25,
    overflow: 'hidden',
  },
  presetImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  presetCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
  },
  saveBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7E4BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14.5,
  },
});
