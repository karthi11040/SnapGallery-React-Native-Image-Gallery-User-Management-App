# 📸 SnapGallery — React Native Image Gallery & User Management App

[![React Native](https://img.shields.io/badge/React_Native-v0.79.0-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000000?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Jest Pass Rate](https://img.shields.io/badge/Tests-38%2F38_Passed-44CC11?logo=jest&logoColor=white)](#-testing--quality-assurance)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Download APK](https://img.shields.io/badge/Download_APK-v1.0.0-3DDC84?logo=android&logoColor=white)](https://github.com/karthi11040/SnapGallery-React-Native-Image-Gallery-User-Management-App/releases/tag/v1.0.0)

A premium, modern cross-platform React Native mobile application built with Expo SDK 57, TypeScript, and state-of-the-art glassmorphic UI aesthetics. **SnapGallery** provides high-resolution photo discovery, dynamic search, category recommendations, persistent user authentication, offline downloads management, favorites curation, and full profile editing with custom avatar pickers.

---

## ✨ Features & Capabilities

### 🔑 1. User Authentication & Guest Mode
- **Secure Login & Registration**: Input validation with real-time feedback and persistent credential storage (`@snapgallery/auth_user`).
- **Temporary Guest Mode**: Single-tap **Demo Guest** login with full access to gallery browsing and bookmarking.
- **Session Auto-Restoration**: Automatically restores authenticated sessions on app restart using `AsyncStorage`.

### 🎨 2. Modern Glassmorphic UI & Dynamic Theme System
- **Theme Modes**: Supports **Light**, **Dark**, and **System Default** theme preferences.
- **Glassmorphism Styling**: Sleek translucent cards, custom gradient overlays, vibrant accent colors, and smooth micro-interactions.
- **Dynamic Layout Adaptability**: Automatically fits varying device screen widths with fluid font scaling (`adjustsFontSizeToFit`) to eliminate text clipping or awkward line wraps.

### 🔍 3. Real-Time Gallery Search & Category Filtering
- **Multi-Field Search**: Real-time filtering across photo titles, categories, author names, tags, and IDs.
- **Category Pills & Recommendation Cards**: One-tap category switching (*All*, *Nature*, *Cities*, *People*, *Architecture*) paired with high-contrast visual recommendation cards.
- **Hero Carousel Banner**: Dynamic feature carousel highlighting top creators and photography feeds.

### 📥 4. Offline Downloads & Favorites Management
- **Dedicated Downloads Tab**: Track downloaded high-resolution images offline with full file details, single-item deletion, and clear-all utilities (`@snapgallery/downloads`).
- **Favorites Collection**: Quick heart toggle on any image to save items locally in your personal favorites library (`@snapgallery/favorites`).
- **Interactive Details View**: High-resolution image viewer with metadata display (author, dimensions, category tags) and download triggers.

### 📸 5. Interactive Profile & Custom Avatar Editor
- **Dynamic Profile Header**: Custom handle (`@username`), user bio, status stats (*Photos Viewed*, *Favorites*, *Downloads*), and quick navigation actions.
- **Profile Photo Editor**: Change your profile picture anytime via:
  - 📷 **Device Camera**: Capture instant profile photos using native camera integration.
  - 🖼️ **Photo Library**: Select existing photos directly from your device gallery.
  - 🌟 **Curated Avatar Presets**: Pick from 6 high-resolution curated avatar options.
- **Personal Details Form**: View and edit full name, email, mobile number, city, bio, and avatar seamlessly.

---

## 🛠️ Tech Stack & Libraries

- **Core**: [React Native 0.79](https://reactnative.dev) + [Expo SDK 57](https://expo.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org) (Strict mode enabled)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [React Navigation v7](https://reactnavigation.org) (Bottom Tabs + Native Stack)
- **Media & Native Modules**: `expo-image-picker`, `expo-file-system`, `expo-media-library`, `@react-native-async-storage/async-storage`
- **Testing**: [Jest](https://jestjs.io) + `react-test-renderer`

---

## 📁 Project Directory Structure

```text
SnapGallery/
├── src/
│   ├── components/         # Reusable UI components (Icons, Buttons, Cards)
│   ├── hooks/              # Custom React hooks (useAuth, useFavorites, useTheme)
│   ├── navigation/         # React Navigation setup (AppNavigator, RootNavigator)
│   ├── screens/            # Screen components
│   │   ├── auth/           # LoginScreen, RegisterScreen
│   │   ├── HomeScreen.tsx           # Gallery feed & search
│   │   ├── ImageDetailsScreen.tsx   # Photo viewer & metadata
│   │   ├── FavoritesScreen.tsx      # Saved favorites
│   │   ├── DownloadsScreen.tsx      # Offline downloads manager
│   │   └── ProfileScreen.tsx        # Profile & Avatar editor
│   ├── store/              # Zustand global state stores (authStore, downloadStore, themeStore)
│   ├── types/              # TypeScript type definitions (auth, image, theme)
│   └── utils/              # Helper utilities (filters, storage, validation)
├── __tests__/              # Unit and integration test suites
├── assets/                 # App icons, splash screens, and images
├── App.tsx                 # Root application wrapper & providers
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm/yarn installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/karthi11040/SnapGallery-React-Native-Image-Gallery-User-Management-App.git
   cd SnapGallery-React-Native-Image-Gallery-User-Management-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro Bundler**:
   ```bash
   npm start
   ```

4. **Run on iOS / Android**:
   ```bash
   # Run on Android Emulator / Connected Device
   npm run android

   # Run on iOS Simulator (macOS only)
   npm run ios
   ```

---

## 📦 Building Android APK (.apk)

To compile and build an standalone Android APK binary locally:

### Option A: Local Gradle Build (Recommended)
```bash
# Navigate to android folder
cd android

# Build Debug APK (Windows PowerShell / CMD)
.\gradlew.bat assembleDebug

# Build Debug APK (macOS / Linux / Bash)
./gradlew assembleDebug

# Build Production Release APK
.\gradlew.bat assembleRelease
```
📌 **Output Location**:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

### Option B: Expo Cloud Build (EAS)
```bash
npx eas-cli build --platform android --profile preview
```

---

## 🧪 Testing & Quality Assurance

SnapGallery includes unit and integration tests covering state stores, validation rules, search filters, and application rendering.

- **Run Unit Tests**:
  ```bash
  npm test
  ```

- **Run TypeScript Type Check**:
  ```bash
  npm run typecheck
  ```

### Test Results Summary
```text
PASS __tests__/authStore.test.ts
PASS __tests__/galleryFilters.test.ts
PASS __tests__/imageStore.test.ts
PASS __tests__/validation.test.ts
PASS __tests__/App.test.tsx

Test Suites: 5 passed, 5 total
Tests:       38 passed, 38 total
Snapshots:   0 total
Time:        4.779 s
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
