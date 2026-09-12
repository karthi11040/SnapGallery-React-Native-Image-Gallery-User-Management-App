import { RegisterFormData, LoginFormData } from '../types/auth';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DIGITS_ONLY_REGEX = /^\d+$/;

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email address is mandatory.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validateMobileNumber(mobile: string): string | null {
  if (!mobile || !mobile.trim()) {
    return 'Mobile number is mandatory.';
  }
  const cleanNumber = mobile.replace(/\D/g, '');
  if (cleanNumber.length !== 10) {
    return 'Mobile number must be exactly 10 digits.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is mandatory.';
  }
  if (password.length < 6) {
    return 'Password must contain at least 6 characters.';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full Name is mandatory.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (!data.gender) {
    errors.gender = 'Please select a gender option.';
  }

  const mobileErr = validateMobileNumber(data.mobileNumber);
  if (mobileErr) errors.mobileNumber = mobileErr;

  if (!data.address || !data.address.trim()) {
    errors.address = 'Street address is mandatory.';
  }

  if (!data.city || !data.city.trim()) {
    errors.city = 'Please select a city.';
  }

  const pwdErr = validatePassword(data.password);
  if (pwdErr) errors.password = pwdErr;

  const confirmErr = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (!data.password) {
    errors.password = 'Password is mandatory.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';
} {
  if (!password) return { score: 0, label: 'WEAK' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'WEAK' };
  if (score === 2) return { score: 2, label: 'FAIR' };
  if (score === 3) return { score: 3, label: 'GOOD' };
  return { score: 4, label: 'STRONG' };
}
