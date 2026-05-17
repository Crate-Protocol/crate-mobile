/**
 * useWallet.ts (mobile)
 * ──────────────────────
 * Stellar wallet state management for React Native.
 *
 * On mobile, Freighter isn't available as a browser extension.
 * This hook uses SecureStore to persist a generated or imported keypair
 * for testnet purposes. In production, integrate Lobstr or WalletConnect.
 */

import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { Keypair } from "@stellar/stellar-sdk";

const STORAGE_KEY = "sampled_wallet_secret";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  generateWallet: () => Promise<{ address: string; secretKey: string }>;
  importWallet: (secretKey: string) => Promise<string>;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Try to load an existing stored wallet.
   */
  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) {
        const kp = Keypair.fromSecret(stored);
        setAddress(kp.publicKey());
      }
    } catch (err) {
      console.error("[useWallet] connect error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setAddress(null);
  }, []);

  /**
   * Generate a new Stellar keypair and persist the secret.
   * Returns the public key and secret (show secret to user once).
   */
  const generateWallet = useCallback(async () => {
    const kp = Keypair.random();
    await SecureStore.setItemAsync(STORAGE_KEY, kp.secret());
    setAddress(kp.publicKey());
    return { address: kp.publicKey(), secretKey: kp.secret() };
  }, []);

  /**
   * Import an existing Stellar secret key.
   */
  const importWallet = useCallback(async (secretKey: string): Promise<string> => {
    const kp = Keypair.fromSecret(secretKey.trim());
    await SecureStore.setItemAsync(STORAGE_KEY, kp.secret());
    setAddress(kp.publicKey());
    return kp.publicKey();
  }, []);

  return {
    address,
    isConnected: !!address,
    isLoading,
    connect,
    disconnect,
    generateWallet,
    importWallet,
  };
}
