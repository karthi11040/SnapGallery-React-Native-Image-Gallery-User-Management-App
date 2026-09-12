import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { AuthStackParamList } from '../../navigation/types';
import { storageService } from '../../services/storageService';

const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=90';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();
  const insets = useSafeAreaInsets();

  const { login, tempLogin } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    // Load saved remembered credentials if present
    const loadRememberedCreds = async () => {
      const creds = await storageService.getRememberedCredentials();
      if (creds && creds.email) {
        setEmail(creds.email);
        if (creds.password) {
          setPassword(creds.password);
        }
        setRememberMe(true);
      }
    };
    loadRememberedCreds();
  }, []);

  useEffect(() => {
    if (email) {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordError('');
    }
  }, [password]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#C0C1FF" />
      </View>
    );
  }

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validate = () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError('Email address is required');
      valid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await login({
        email: email.trim().toLowerCase(),
        password,
        rememberSession: rememberMe,
      });

      if (!result.success) {
        throw new Error(result.error || 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error
          ? error.message
          : 'Invalid email or password.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTempLogin = async () => {
    try {
      setIsSubmitting(true);
      const result = await tempLogin();
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign in as guest');
      }
    } catch (error) {
      Alert.alert(
        'Temp Login Failed',
        error instanceof Error ? error.message : 'Could not initialize guest session.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password recovery will be sent to your registered email address.',
    );
  };

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGE }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark cinematic overlay */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 20, Platform.OS === 'android' ? 45 : 30),
              paddingBottom: Math.max(insets.bottom + 20, 30),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          

          {/* Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#6E4BFF', '#B14CFF', '#FF62D0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={42}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </View>

            <Text style={styles.brandText}>
              <Text style={styles.brandSnap}>Snap</Text>
              <Text style={styles.brandGallery}>Gallery</Text>
            </Text>

            <Text style={styles.tagline}>
              C A P T U R E　 E X P L O R E　 S A V E
            </Text>

            <Text style={styles.subtitle}>
              Your world in beautiful photos
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.cardTitle}>Sign in to continue</Text>

            <Text style={styles.cardSubtitle}>
              Access your gallery and explore amazing photos
            </Text>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  emailError ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#BFC5E8"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#8990B0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  style={styles.input}
                  returnKeyType="next"
                />

                {email.length > 0 && !emailError && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#7BD0FF"
                  />
                )}
              </View>

              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#BFC5E8"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#8990B0"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={21}
                    color="#BFC5E8"
                  />
                </Pressable>
              </View>

              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Remember + Forgot */}
            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberContainer}
                onPress={() => setRememberMe((prev) => !prev)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color="#FFFFFF"
                    />
                  )}
                </View>

                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable
                onPress={handleForgotPassword}
                hitSlop={8}
              >
                <Text style={styles.forgotText}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign In */}
            <Pressable
              onPress={handleLogin}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
            >
              <LinearGradient
                colors={['#A53DFF', '#7257FF', '#4B8BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Text style={styles.signInText}>
                      Sign In
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={22}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Quick Temp / Demo Login */}
            <Pressable
              onPress={handleTempLogin}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.tempLoginButton,
                pressed && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
            >
              <Ionicons name="flash-outline" size={18} color="#7E4BFF" />
              <Text style={styles.tempLoginText}>Quick Temp Login</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>
                OR CONTINUE WITH
              </Text>
              <View style={styles.divider} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialPressed,
                ]}
                onPress={() =>
                  Alert.alert(
                    'Google Sign In',
                    'Google authentication can be connected later.',
                  )
                }
              >
                <View style={styles.googleIcon}>
                  <Text style={styles.googleG}>G</Text>
                </View>

                <Text style={styles.socialText}>
                  Google
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialPressed,
                ]}
                onPress={() =>
                  Alert.alert(
                    'Apple Sign In',
                    'Apple authentication can be connected later.',
                  )
                }
              >
                <Ionicons
                  name="logo-apple"
                  size={22}
                  color="#1E2038"
                />

                <Text style={styles.socialText}>
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>
                Don’t have an account?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate('Register')
                }
                hitSlop={8}
              >
                <Text style={styles.signUpText}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>
              “Good photos tell great stories.”
            </Text>

            <View style={styles.quoteLine} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: '#FAF9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  background: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 249, 254, 0.93)',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  /* Header */

  header: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },

  welcomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeText: {
    color: '#4E5478',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  wave: {
    fontSize: 14,
    marginLeft: 4,
  },

  /* Brand */

  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    padding: 3,
    marginBottom: 12,
    shadowColor: '#7E4BFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },

  logoGradient: {
    flex: 1,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  brandText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    letterSpacing: -1.4,
  },

  brandSnap: {
    color: '#1E2038',
  },

  brandGallery: {
    color: '#7E4BFF',
  },

  tagline: {
    color: '#6C7293',
    fontFamily: 'Inter_500Medium',
    fontSize: 8.5,
    letterSpacing: 2,
    marginTop: 4,
  },

  subtitle: {
    color: '#4E5478',
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    marginTop: 12,
  },

  /* Card */

  loginCard: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: 'rgba(180, 185, 215, 0.35)',

    borderRadius: 24,

    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,

    shadowColor: '#1E2038',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },

  cardTitle: {
    color: '#1E2038',
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    letterSpacing: -0.4,
  },

  cardSubtitle: {
    color: '#6C7293',
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 18,
  },

  /* Input */

  fieldContainer: {
    marginBottom: 12,
  },

  inputWrapper: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#DCE0F0',

    borderRadius: 16,

    backgroundColor: '#F5F6FC',

    paddingHorizontal: 16,
  },

  inputError: {
    borderColor: '#FF5252',
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: '#1E2038',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    height: '100%',
  },

  errorText: {
    color: '#FF5252',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },

  /* Options */

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,

    borderWidth: 1,
    borderColor: '#A4AABF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,
  },

  checkboxActive: {
    borderColor: '#7E4BFF',
    backgroundColor: '#7E4BFF',
  },

  rememberText: {
    color: '#4E5478',
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
  },

  forgotText: {
    color: '#7E4BFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 12.5,
  },

  /* Sign in button */

  signInButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',

    shadowColor: '#7E4BFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  signInText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15.5,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  /* Temp Login Button */
  tempLoginButton: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7E4BFF',
    backgroundColor: 'rgba(126, 75, 255, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },

  tempLoginText: {
    color: '#7E4BFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14.5,
  },

  /* Divider */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E3F0',
  },

  orText: {
    color: '#7E85A8',
    fontFamily: 'Inter_500Medium',
    fontSize: 8.5,
    letterSpacing: 1,
    marginHorizontal: 10,
  },

  /* Social */

  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },

  socialButton: {
    flex: 1,
    height: 48,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#DCE0F0',
    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    gap: 8,
  },

  socialPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },

  socialText: {
    color: '#1E2038',
    fontFamily: 'Inter_500Medium',
    fontSize: 13.5,
  },

  googleIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleG: {
    color: '#7E4BFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },

  /* Register */

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 5,
  },

  registerText: {
    color: '#6C7293',
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
  },

  signUpText: {
    color: '#7E4BFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12.5,
  },

  /* Quote */

  quoteContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  quote: {
    color: '#5E6488',
    fontFamily: 'Inter_400Regular',
    fontSize: 11.5,
    fontStyle: 'italic',
  },

  quoteLine: {
    width: 40,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#7E4BFF',
    marginTop: 8,
  },
});
