import * as MediaLibrary from 'expo-media-library/legacy';
import * as FileSystem from 'expo-file-system/legacy';

export interface DownloadResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export const downloadService = {
  async downloadAndSaveImage(imageUrl: string, imageId: string): Promise<DownloadResult> {
    try {
      // 1. Check/request permission with graceful fallback (Expo Go on Android 13+ restricts granular permissions)
      try {
        const permissionResponse = await MediaLibrary.getPermissionsAsync(true);
        if (!permissionResponse.granted) {
          await MediaLibrary.requestPermissionsAsync(true);
        }
      } catch (permErr) {
        // Log warning but continue; scoped storage allows creating assets directly
        console.warn('[downloadService] Permission request warning:', permErr);
      }

      // 2. Prepare file destination in cache
      const fileUri = `${FileSystem.cacheDirectory}snapgallery_${imageId}_${Date.now()}.jpg`;

      // 3. Download image file
      const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri);
      if (downloadRes.status !== 200) {
        return {
          success: false,
          error: `Download failed with HTTP ${downloadRes.status}`,
        };
      }

      // 4. Save to device gallery
      try {
        const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
        try {
          const album = await MediaLibrary.getAlbumAsync('SnapGallery');
          if (album === null) {
            await MediaLibrary.createAlbumAsync('SnapGallery', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
        } catch {
          // In sandboxed environments or Expo Go, album creation may be ignored, but asset is saved
        }

        return {
          success: true,
          uri: asset?.uri || downloadRes.uri,
        };
      } catch {
        // Fallback: save directly to library
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        return {
          success: true,
          uri: downloadRes.uri,
        };
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error saving image to device gallery.';
      return {
        success: false,
        error: message,
      };
    }
  },
};
