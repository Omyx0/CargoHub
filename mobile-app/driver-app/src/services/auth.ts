import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export const sendOTP = async (phoneNumber: string) => {
  // We use our custom backend API instead of Firebase Auth
  const response = await api.post('/auth/send-otp', {
    phone: phoneNumber,
  });

  if (!response.data?.success) {
    throw new Error('Failed to send OTP via Backend');
  }

  // Return the phone number as confirmation so we can pass it to verify
  return { phone: phoneNumber };
};

export const verifyOTP = async (confirmation: any, code: string) => {
  // Call custom backend API
  const response = await api.post('/auth/verify-otp', {
    phone: confirmation.phone,
    code: code
  });

  if (!response.data?.success) {
    throw new Error('Invalid OTP');
  }

  const data = response.data.data;

  // Save the custom JWT token
  if (data.token) {
    await AsyncStorage.setItem('@cargohub_driver_token', data.token);
  }

  return {
    uid: data.uid,
    isNewUser: data.isNewUser || false,
    token: data.token
  };
};

export const logout = async () => {
  await AsyncStorage.removeItem('@cargohub_driver_token');
  await AsyncStorage.removeItem('@cargohub_mock_uid');
};

