import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { Keypair, Horizon } from "@stellar/stellar-sdk";

const STORAGE_KEY = "crate_wallet_secret";
const HORIZON_URL =
  (process.env.EXPO_PUBLIC_HORIZON_URL as string | undefined) ??
  "https://horizon-testnet.stellar.org";

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  generateWallet: () => Promise<{ address: string; secretKey: string }>;
  importWallet: (secretKey: string) => Promise<string>;
  refreshBalance: () => Promise<void>;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      const server = new Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(addr);
      const native = account.balances.find((b) => b.asset_type === "native");
      setBalance(native ? parseFloat(native.balance).toFixed(2) : "0.00");
    } catch {
      setBalance("0.00");
    }
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored && /^S[A-Z2-7]{55}$/.test(stored)) {
        try {
          const kp = Keypair.fromSecret(stored);
          const pub = kp.publicKey();
          setAddress(pub);
          await fetchBalance(pub);
        } catch {
          await SecureStore.deleteItemAsync(STORAGE_KEY);
        }
      } else if (stored) {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
      }
    } catch {
      // secure store unavailable
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setAddress(null);
    setBalance("0.00");
  }, []);

  const generateWallet = useCallback(async () => {
    const kp = Keypair.random();
    await SecureStore.setItemAsync(STORAGE_KEY, kp.secret());
    const pub = kp.publicKey();
    setAddress(pub);
    await fetchBalance(pub);
    return { address: pub, secretKey: kp.secret() };
  }, [fetchBalance]);

  const importWallet = useCallback(async (secretKey: string): Promise<string> => {
    const trimmed = secretKey.trim();
    if (!/^S[A-Z2-7]{55}$/.test(trimmed)) {
      throw new Error("Invalid Stellar secret key");
    }
    const kp = Keypair.fromSecret(trimmed);
    await SecureStore.setItemAsync(STORAGE_KEY, kp.secret());
    const pub = kp.publicKey();
    setAddress(pub);
    await fetchBalance(pub);
    return pub;
  }, [fetchBalance]);

  const refreshBalance = useCallback(async () => {
    if (address) await fetchBalance(address);
  }, [address, fetchBalance]);

  return {
    address,
    balance,
    isConnected: !!address,
    isLoading,
    connect,
    disconnect,
    generateWallet,
    importWallet,
    refreshBalance,
  };
}
