import { Platform } from 'react-native';

if (typeof process !== 'undefined' && process.env && !process.env.EXPO_OS) {
  process.env.EXPO_OS = Platform.OS;
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

