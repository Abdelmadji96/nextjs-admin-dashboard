import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import type { LoginResponse } from "@/types/auth";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "hirini-secret-key-2025";

/**
 * Encrypt data before saving to cookies
 */
export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

/**
 * Decrypt data from cookies
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

/**
 * Save auth data to encrypted cookies
 */
export const saveAuthData = (data: LoginResponse): void => {
  const { user, access_token, refresh_token } = data;

  // Encrypt and save tokens
  Cookies.set("access_token", encryptData(access_token), {
    secure: true,
    sameSite: "strict",
    expires: 7, // 7 days
  });

  Cookies.set("refresh_token", encryptData(refresh_token), {
    secure: true,
    sameSite: "strict",
    expires: 30, // 30 days
  });

  // Encrypt and save user data
  Cookies.set("user", encryptData(user), {
    secure: true,
    sameSite: "strict",
    expires: 7,
  });
};

/**
 * Clear all auth data from cookies
 */
export const clearAuthData = (): void => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user");
};

/**
 * Get decrypted access token
 */
export const getAccessToken = (): string | null => {
  const encryptedToken = Cookies.get("access_token");
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

/**
 * Get decrypted refresh token
 */
export const getRefreshToken = (): string | null => {
  const encryptedToken = Cookies.get("refresh_token");
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

/**
 * Get decrypted user data
 */
export const getUser = (): any | null => {
  const encryptedUser = Cookies.get("user");
  if (!encryptedUser) return null;
  return decryptData(encryptedUser);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Update access token
 */
export const updateAccessToken = (token: string): void => {
  Cookies.set("access_token", encryptData(token), {
    secure: true,
    sameSite: "strict",
    expires: 7,
  });
};

