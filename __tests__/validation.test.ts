import {
  validateRegisterForm,
  validateLoginForm,
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateConfirmPassword,
  calculatePasswordStrength,
} from '../src/utils/validation';

describe('Validation Utilities', () => {
  describe('Email validation', () => {
    it('accepts valid email formats', () => {
      expect(validateEmail('sarah.miller@lumina.art')).toBeNull();
      expect(validateEmail('user@test.co.uk')).toBeNull();
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('')).not.toBeNull();
      expect(validateEmail('invalid-email')).not.toBeNull();
      expect(validateEmail('user@domain')).not.toBeNull();
    });
  });

  describe('Mobile number validation', () => {
    it('accepts valid 10-digit numbers', () => {
      expect(validateMobileNumber('5550192834')).toBeNull();
      expect(validateMobileNumber('(555) 019-2834')).toBeNull();
    });

    it('rejects numbers not having exactly 10 digits', () => {
      expect(validateMobileNumber('')).not.toBeNull();
      expect(validateMobileNumber('12345')).not.toBeNull();
      expect(validateMobileNumber('123456789012')).not.toBeNull();
    });
  });

  describe('Password validation', () => {
    it('accepts passwords with >= 6 characters', () => {
      expect(validatePassword('123456')).toBeNull();
      expect(validatePassword('lumina2025')).toBeNull();
    });

    it('rejects passwords shorter than 6 characters', () => {
      expect(validatePassword('')).not.toBeNull();
      expect(validatePassword('12345')).not.toBeNull();
    });

    it('validates password matching', () => {
      expect(validateConfirmPassword('lumina2025', 'lumina2025')).toBeNull();
      expect(validateConfirmPassword('lumina2025', 'different')).not.toBeNull();
    });
  });

  describe('Full Registration Form validation', () => {
    const validForm = {
      fullName: 'Sarah Miller',
      email: 'sarah.miller@lumina.art',
      gender: 'female',
      mobileNumber: '5550192834',
      address: '742 Evergreen Terrace',
      city: 'San Francisco, CA',
      password: 'lumina2025',
      confirmPassword: 'lumina2025',
    };

    it('validates a complete valid form successfully', () => {
      const res = validateRegisterForm(validForm);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it('rejects form when mandatory fields are missing', () => {
      const res = validateRegisterForm({
        ...validForm,
        fullName: '',
        address: '',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.fullName).toBeDefined();
      expect(res.errors.address).toBeDefined();
    });

    it('rejects form when passwords do not match', () => {
      const res = validateRegisterForm({
        ...validForm,
        confirmPassword: 'wrongpassword',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.confirmPassword).toBeDefined();
    });
  });

  describe('Login Form validation', () => {
    it('accepts valid login credentials format', () => {
      const res = validateLoginForm({ email: 'sarah@lumina.art', password: 'password123' });
      expect(res.isValid).toBe(true);
    });

    it('rejects missing password', () => {
      const res = validateLoginForm({ email: 'sarah@lumina.art', password: '' });
      expect(res.isValid).toBe(false);
      expect(res.errors.password).toBeDefined();
    });
  });

  describe('calculatePasswordStrength', () => {
    it('correctly rates password complexity', () => {
      expect(calculatePasswordStrength('123').label).toBe('WEAK');
      expect(calculatePasswordStrength('123456').score).toBeGreaterThanOrEqual(1);
      expect(calculatePasswordStrength('Lumina#2025').label).toBe('STRONG');
    });
  });
});
