import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useWallet } from "../../src/hooks/useWallet";
import { colors, spacing, radius, typography } from "../../src/constants/theme";

export default function ProfileTab() {
  const {
    address,
    isConnected,
    isLoading,
    connect,
    disconnect,
    generateWallet,
    importWallet,
  } = useWallet();

  const [importSecret, setImportSecret] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newWalletSecret, setNewWalletSecret] = useState<string | null>(null);

  useEffect(() => {
    connect();
  }, []);

  async function handleGenerate() {
    Alert.alert(
      "Generate New Wallet",
      "This creates a new Stellar keypair. Save the secret key — it cannot be recovered. For testnet use only.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            setGenerating(true);
            try {
              const result = await generateWallet();
              setNewWalletSecret(result.secretKey);
              Alert.alert(
                "Wallet Created",
                `Address: ${result.address}\n\nSave your secret key (shown below). This is your only chance.`
              );
            } catch {
              Alert.alert("Error", "Failed to generate wallet");
            } finally {
              setGenerating(false);
            }
          },
        },
      ]
    );
  }

  async function handleImport() {
    if (!importSecret.trim()) {
      Alert.alert("Error", "Enter a Stellar secret key (starts with S)");
      return;
    }
    setImporting(true);
    try {
      const addr = await importWallet(importSecret.trim());
      setImportSecret("");
      setShowImport(false);
      Alert.alert("Wallet Imported", `Connected: ${addr.slice(0, 12)}...`);
    } catch (err) {
      Alert.alert("Invalid Key", "That is not a valid Stellar secret key");
    } finally {
      setImporting(false);
    }
  }

  async function copyAddress() {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDisconnect() {
    Alert.alert(
      "Disconnect Wallet",
      "This will remove your keypair from secure storage. Make sure you have your secret key backed up.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: disconnect,
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isConnected) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.logoSection}>
          <Text style={styles.logo}>◈ Crate</Text>
          <Text style={styles.logoSub}>Peer-to-peer beat marketplace on Stellar</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGenerate}
          disabled={generating}
          activeOpacity={0.8}
        >
          {generating ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.primaryButtonText}>Generate New Wallet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowImport(!showImport)}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Import Existing Key</Text>
        </TouchableOpacity>

        {showImport && (
          <View style={styles.importBox}>
            <Text style={styles.importLabel}>Enter your Stellar secret key (S...)</Text>
            <TextInput
              style={[styles.input, styles.secretInput]}
              placeholder="SXXXXXX..."
              placeholderTextColor={colors.textMuted}
              value={importSecret}
              onChangeText={setImportSecret}
              secureTextEntry
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 12 }]}
              onPress={handleImport}
              disabled={importing}
              activeOpacity={0.8}
            >
              {importing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.primaryButtonText}>Import Wallet</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.disclaimer}>
          For testnet use only. Never use real funds on testnet.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Address card */}
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View style={styles.connectedDot} />
          <Text style={styles.connectedLabel}>Connected</Text>
          <Text style={styles.networkBadge}>Testnet</Text>
        </View>
        <Text style={styles.address}>{address}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
          <Text style={styles.copyButtonText}>{copied ? "Copied!" : "Copy Address"}</Text>
        </TouchableOpacity>
      </View>

      {/* Show new wallet secret once */}
      {newWalletSecret && (
        <View style={styles.secretBox}>
          <Text style={styles.secretWarning}>Save this secret key — it won't be shown again</Text>
          <Text style={styles.secretKey}>{newWalletSecret}</Text>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(newWalletSecret);
              Alert.alert("Copied", "Secret key copied to clipboard");
            }}
          >
            <Text style={styles.copySecretLink}>Copy Secret Key</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNewWalletSecret(null)}>
            <Text style={styles.dismissLink}>I've saved it — dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contract info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>CONTRACT</Text>
        <Text style={styles.infoValue}>CA7DGEWW...DTLG</Text>
        <View style={styles.infoDivider} />
        <Text style={styles.infoLabel}>REVENUE SPLIT</Text>
        <Text style={[styles.infoValue, { color: colors.accent }]}>90% Producers · 10% Platform</Text>
        <View style={styles.infoDivider} />
        <Text style={styles.infoLabel}>SETTLEMENT</Text>
        <Text style={[styles.infoValue, { color: colors.success }]}>Under 5 seconds</Text>
      </View>

      {/* Fund testnet wallet */}
      <TouchableOpacity
        style={styles.friendbotButton}
        onPress={() => {
          Alert.alert(
            "Fund Testnet Wallet",
            `Visit Stellar Friendbot to fund this address:\n\nhttps://friendbot.stellar.org/?addr=${address}`,
            [{ text: "OK" }]
          );
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.friendbotText}>Fund with Testnet XLM</Text>
      </TouchableOpacity>

      {/* Disconnect */}
      <TouchableOpacity
        style={styles.disconnectButton}
        onPress={handleDisconnect}
        activeOpacity={0.8}
      >
        <Text style={styles.disconnectText}>Disconnect Wallet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 100 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoSection: { alignItems: "center", paddingVertical: spacing.xxl },
  logo: { color: colors.textPrimary, fontSize: 28, fontWeight: typography.fontWeightExtrabold, letterSpacing: -0.5 },
  logoSub: { color: colors.textSecondary, fontSize: typography.fontSizeSM, marginTop: 6, textAlign: "center" },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  primaryButtonText: { color: "#000", fontWeight: typography.fontWeightBold, fontSize: typography.fontSizeMD },
  secondaryButton: {
    backgroundColor: colors.surface2,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  secondaryButtonText: { color: colors.textPrimary, fontWeight: typography.fontWeightMedium, fontSize: typography.fontSizeMD },
  importBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  importLabel: { color: colors.textSecondary, fontSize: typography.fontSizeSM, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: typography.fontSizeSM,
  },
  secretInput: { fontFamily: "monospace" },
  disclaimer: { color: colors.textMuted, fontSize: typography.fontSizeXS, textAlign: "center", marginTop: spacing.xl, lineHeight: 18 },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  addressHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  connectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  connectedLabel: { color: colors.success, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium, flex: 1 },
  networkBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: colors.success,
    fontSize: typography.fontSizeXS,
    fontWeight: typography.fontWeightBold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
    overflow: "hidden",
  },
  address: { color: colors.textPrimary, fontSize: 11, fontFamily: "monospace", marginBottom: spacing.md, lineHeight: 16 },
  copyButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  copyButtonText: { color: colors.textSecondary, fontSize: typography.fontSizeSM },
  secretBox: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  secretWarning: { color: colors.error, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemibold, marginBottom: spacing.sm },
  secretKey: { color: colors.textPrimary, fontFamily: "monospace", fontSize: 10, lineHeight: 16, marginBottom: spacing.sm },
  copySecretLink: { color: colors.accent, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium, marginBottom: spacing.sm },
  dismissLink: { color: colors.textMuted, fontSize: typography.fontSizeSM },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoLabel: { color: colors.textMuted, fontSize: typography.fontSizeXS, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  infoValue: { color: colors.textPrimary, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium },
  infoDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  friendbotButton: {
    backgroundColor: colors.surface2,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  friendbotText: { color: colors.textSecondary, fontSize: typography.fontSizeSM },
  disconnectButton: {
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  disconnectText: { color: colors.error, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium },
});
