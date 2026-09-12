import { NavigatorScreenParams } from '@react-navigation/native';
import { ImageItem } from '../types/image';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Gallery: undefined;
  Favorites: undefined;
  Downloads: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<AppTabParamList>;
  ImageDetails: { image: ImageItem };
};
