import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useWallet } from "../../src/hooks/useWallet";
import { colors, spacing, radius, typography } from "../../src/constants/theme";

interface EarningsData {
  pendingXlm: number;
  totalEarnedXlm: number;
  salesCount: number;
  recentSales: Array<{
    id: string;
    sampleTitle: string;
    buyer: string;
    amountXlm: number;
    date: string;
  }>;
}

const DEMO_EARNINGS: EarningsData = {
  pendingXlm: 45.9,
  totalEarnedXlm: 234.0,
  salesCount: 26,
  recentSales: [
    { id: "s1", sampleTitle: "Midnight Trap Vol.1", buyer: "GBVK...WKLD", amountXlm: 10.8, date: "2026-05-18" },
    { id: "s2", sampleTitle: "Lo-Fi Study Session", buyer: "GBLQ...ZQBT", amountXlm: 7.2, date: "2026-05-17" },
    { id: "s3", sampleTitle: "808 Summer", buyer: "GCLN...WKLD", amountXlm: 13.5, date: "2026-05-16" },
  ],
};

export default function EarningsTab() {
  const { address, isConnected } = useWallet();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadEarnings();
    }
  }, [isConnected, address]);

  async function loadEarnings() {
    setLoading(true);
    try {
      // In production: call getEarnings(address, address) from the contract
      await new Promise((r) => setTimeout(r, 600));
      setData(DEMO_EARNINGS);
    } catch {
      Alert.alert("Error", "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!data || data.pendingXlm <= 0) {
      Alert.alert("No Earnings", "You have no pending earnings to withdraw.");
      return;
    }
    Alert.alert(
      "Withdraw Earnings",
      `Withdraw ${data.pendingXlm.toFixed(2)} XLM to your wallet?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          onPress: async () => {
            setWithdrawing(true);
            try {
              // In production: call withdrawEarnings(address) + signTransaction + submitTransaction
              await new Promise((r) => setTimeout(r, 1500));
              setData((prev) => prev ? { ...prev, pendingXlm: 0 } : prev);
              Alert.alert("Success", "Earnings withdrawn to your wallet!");
            } catch {
              Alert.alert("Error", "Withdrawal failed. Try again.");
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ]
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💰</Text>
        <Text style={styles.emptyTitle}>Connect Wallet</Text>
        <Text style={styles.emptyDesc}>
          Set up your wallet in the Profile tab to track and withdraw earnings.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { flex: 1 }]}>
          <Text style={styles.statLabel}>Pending Earnings</Text>
          <Text style={[styles.statValue, { color: data?.pendingXlm ? colors.accent : colors.textMuted }]}>
            {data?.pendingXlm.toFixed(2) ?? "0.00"}
          </Text>
          <Text style={styles.statUnit}>XLM</Text>
        </View>
        <View style={[styles.statCard, { flex: 1 }]}>
          <Text style={styles.statLabel}>Total Earned</Text>
          <Text style={styles.statValue}>{data?.totalEarnedXlm.toFixed(2) ?? "0.00"}</Text>
          <Text style={styles.statUnit}>XLM lifetime</Text>
        </View>
      </View>

      <View style={styles.statCardWide}>
        <Text style={styles.statLabel}>Total Sales</Text>
        <Text style={[styles.statValue, { color: colors.success }]}>{data?.salesCount ?? 0}</Text>
        <Text style={styles.statUnit}>units sold</Text>
      </View>

      {/* Withdraw */}
      <TouchableOpacity
        style={[
          styles.withdrawButton,
          (!data?.pendingXlm || withdrawing) && styles.withdrawButtonDisabled,
        ]}
        onPress={handleWithdraw}
        disabled={!data?.pendingXlm || withdrawing}
        activeOpacity={0.8}
      >
        {withdrawing ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.withdrawButtonText}>
            Withdraw {data?.pendingXlm.toFixed(2) ?? "0.00"} XLM
          </Text>
        )}
      </TouchableOpacity>

      {/* Recent sales */}
      {data?.recentSales && data.recentSales.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          {data.recentSales.map((sale) => (
            <View key={sale.id} style={styles.saleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.saleTitle}>{sale.sampleTitle}</Text>
                <Text style={styles.saleMeta}>{sale.buyer} · {sale.date}</Text>
              </View>
              <Text style={styles.saleAmount}>+{sale.amountXlm.toFixed(1)} XLM</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.note}>
        Revenue split: 90% to you, 10% platform fee — enforced on-chain
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 100 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { color: colors.textPrimary, fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, marginBottom: spacing.sm },
  emptyDesc: { color: colors.textSecondary, fontSize: typography.fontSizeSM, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  statCardWide: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statLabel: { color: colors.textMuted, fontSize: typography.fontSizeXS, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  statValue: { color: colors.textPrimary, fontSize: 28, fontWeight: typography.fontWeightExtrabold, letterSpacing: -0.5 },
  statUnit: { color: colors.textSecondary, fontSize: typography.fontSizeXS, marginTop: 2 },
  withdrawButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  withdrawButtonDisabled: { opacity: 0.35 },
  withdrawButtonText: { color: "#000", fontWeight: typography.fontWeightBold, fontSize: typography.fontSizeMD },
  sectionTitle: { color: colors.textSecondary, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemibold, marginBottom: spacing.md, textTransform: "uppercase", letterSpacing: 0.5 },
  saleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  saleTitle: { color: colors.textPrimary, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium },
  saleMeta: { color: colors.textMuted, fontSize: typography.fontSizeXS, marginTop: 2 },
  saleAmount: { color: colors.success, fontWeight: typography.fontWeightSemibold, fontSize: typography.fontSizeSM },
  note: { color: colors.textMuted, fontSize: typography.fontSizeXS, textAlign: "center", marginTop: spacing.xl, lineHeight: 18 },
});
