import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
import { AuthStackParamList } from '../../navigation/types';
import { CITIES, GENDERS } from '../../utils/constants';

const MOUNTAIN_HERO_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=90';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Register'>>();
  const insets = useSafeAreaInsets();

  const { register, clearError } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [city, setCity] = useState<string>(CITIES[0] || 'San Francisco, CA');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.terms = 'You must agree to the Terms of Service';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      clearError();

      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const result = await register({
        fullName,
        email: email.trim().toLowerCase(),
        gender,
        mobileNumber: phone.trim(),
        address: username.trim() ? `@${username.trim()}` : 'Main Street',
        city,
        password,
        confirmPassword,
      });

      if (!result.success) {
        throw new Error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Could not create account.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 16, Platform.OS === 'android' ? 40 : 30),
              paddingBottom: Math.max(insets.bottom + 20, 30),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              hitSlop={10}
            >
              <Ionicons name="arrow-back" size={24} color="#1E2038" />
            </Pressable>
          </View>

          {/* Top Brand */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>
              <Text style={styles.brandSnap}>Snap</Text>
              <Text style={styles.brandGallery}>Gallery</Text>
            </Text>
            <Text style={styles.tagline}>C A P T U R E　 E X P L O R E　 S A V E</Text>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join us and start your photo journey today!
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* First & Last Name Row */}
            <View style={styles.nameRow}>
              <View style={[styles.fieldContainer, styles.halfField]}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.firstName ? styles.inputError : undefined,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#8A8FA9"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={firstName}
                    onChangeText={(val) => {
                      setFirstName(val);
                      if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                    }}
                    placeholder="First Name"
                    placeholderTextColor="#A0A5C0"
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
                {errors.firstName ? (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                ) : null}
              </View>

              <View style={[styles.fieldContainer, styles.halfField]}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.lastName ? styles.inputError : undefined,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#8A8FA9"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={lastName}
                    onChangeText={(val) => {
                      setLastName(val);
                      if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                    }}
                    placeholder="Last Name"
                    placeholderTextColor="#A0A5C0"
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
                {errors.lastName ? (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                ) : null}
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="Email Address"
                  placeholderTextColor="#A0A5C0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Phone Number */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.phone ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="Phone Number"
                  placeholderTextColor="#A0A5C0"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Username */}
            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="at-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#A0A5C0"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Password"
                  placeholderTextColor="#A0A5C0"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#8A8FA9"
                  />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword ? styles.inputError : undefined,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  placeholder="Confirm Password"
                  placeholderTextColor="#A0A5C0"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#8A8FA9"
                  />
                </Pressable>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={dob}
                  onChangeText={setDob}
                  placeholder="Date of Birth"
                  placeholderTextColor="#A0A5C0"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Gender Picker */}
            <View style={styles.fieldContainer}>
              <Pressable
                style={styles.inputWrapper}
                onPress={() => setCityModalVisible(true)}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#8A8FA9"
                  style={styles.inputIcon}
                />
                <Text style={[styles.input, styles.pickerText]}>
                  Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)} ({city})
                </Text>
                <Ionicons name="chevron-down" size={18} color="#8A8FA9" />
              </Pressable>
            </View>

            {/* Terms Checkbox */}
            <View style={styles.termsContainer}>
              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgreeTerms((prev) => !prev)}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                  {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </Pressable>
              {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}
            </View>

            {/* Create Account Button */}
            <Pressable
              onPress={handleRegister}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.pressed,
                isSubmitting && styles.disabled,
              ]}
            >
              <LinearGradient
                colors={['#7E4BFF', '#5A77FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.createButtonText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Sign In Link */}
            <View style={styles.signInRow}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>

          {/* Decorative Side / Footer Photography Vignette */}
          <View style={styles.vignetteContainer}>
            <Image
              source={{ uri: MOUNTAIN_HERO_IMAGE }}
              style={styles.vignetteImage}
              resizeMode="cover"
            />
            <View style={styles.vignetteOverlay} />
            <Text style={styles.vignetteQuote}>“Collect moments, not things.”</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* City/Gender Selection Modal */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCityModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender & Region</Text>
            {GENDERS.map((g) => (
              <Pressable
                key={g.value}
                style={[
                  styles.modalOption,
                  gender === g.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setGender(g.value);
                  setCityModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    gender === g.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {g.label}
                </Text>
                {gender === g.value && (
                  <Ionicons name="checkmark" size={18} color="#7E4BFF" />
                )}
              </Pressable>
            ))}

            <View style={styles.modalDivider} />

            <Text style={styles.modalSubtitle}>Select City</Text>
            {CITIES.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.modalOption,
                  city === c && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setCity(c);
                  setCityModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    city === c && styles.modalOptionTextSelected,
                  ]}
                >
                  {c}
                </Text>
                {city === c && <Ionicons name="checkmark" size={18} color="#7E4BFF" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default RegisterScreen;

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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 40,
  },
  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinText: {
    color: '#4A4E69',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  sparkleIcon: {
    fontSize: 14,
  },
  /* Top Brand */
  brandContainer: {
    marginBottom: 16,
  },
  brandText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    letterSpacing: -1,
  },
  brandSnap: {
    color: '#1E2038',
  },
  brandGallery: {
    color: '#9E4BFF',
  },
  tagline: {
    color: '#7D84A6',
    fontFamily: 'Inter_500Medium',
    fontSize: 8.5,
    letterSpacing: 2,
    marginTop: 4,
  },
  /* Title Section */
  titleSection: {
    marginBottom: 22,
  },
  title: {
    color: '#1E2038',
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#6C7293',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 4,
  },
  /* Form */
  formContainer: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  inputWrapper: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(180, 185, 215, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
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
  pickerText: {
    lineHeight: 54,
  },
  errorText: {
    color: '#FF5252',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  /* Terms */
  termsContainer: {
    marginVertical: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A0A5C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    borderColor: '#7E4BFF',
    backgroundColor: '#7E4BFF',
  },
  termsText: {
    flex: 1,
    color: '#5C6280',
    fontFamily: 'Inter_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
  },
  termsLink: {
    color: '#7E4BFF',
    fontFamily: 'Inter_600SemiBold',
  },
  /* Create Button */
  createButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 18,
    shadowColor: '#7E4BFF',
    shadowOffset: { width: 0, height: 6 },
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
  createButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  /* Sign In Link */
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  signInText: {
    color: '#6C7293',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  signInLink: {
    color: '#7E4BFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  /* Vignette / Footer preview */
  vignetteContainer: {
    height: 90,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vignetteImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 32, 56, 0.65)',
  },
  vignetteQuote: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    color: '#1E2038',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  modalSubtitle: {
    color: '#1E2038',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalOptionSelected: {
    backgroundColor: '#F3EEFF',
  },
  modalOptionText: {
    color: '#4A4E69',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  modalOptionTextSelected: {
    color: '#7E4BFF',
    fontFamily: 'Inter_600SemiBold',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EAECEF',
    marginVertical: 10,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});
