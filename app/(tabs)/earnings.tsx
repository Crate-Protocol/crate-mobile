import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { useWallet } from "../../src/hooks/useWallet";

interface Transaction {
  id: string;
  type: "sale" | "withdraw";
  amount: string;
  beat: string;
  date: string;
}

const MOCK_HISTORY: Transaction[] = [
  { id: "tx1", type: "sale",     amount: "+22.5 XLM", beat: "Midnight Waves", date: "May 10" },
  { id: "tx2", type: "sale",     amount: "+18.0 XLM", beat: "Block Pressure", date: "May 8"  },
  { id: "tx3", type: "withdraw", amount: "-40.5 XLM", beat: "Withdrawal",     date: "May 8"  },
  { id: "tx4", type: "sale",     amount: "+27.0 XLM", beat: "Lagos Summer",   date: "May 3"  },
];

function groupByDate(txs: Transaction[]): { date: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    if (!map.has(tx.date)) map.set(tx.date, []);
    map.get(tx.date)!.push(tx);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

export default function Earnings() {
  const { address, balance, refreshBalance } = useWallet();
  const [withdrawing, setWithdrawing]   = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [refreshing, setRefreshing]     = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [refreshBalance]);

  async function handleWithdraw() {
    if (!address) return;
    if (parseFloat(balance) <= 0) {
      Alert.alert("Nothing to Withdraw", "Your balance is 0 XLM.");
      return;
    }
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      await refreshBalance();
      Alert.alert("Withdrawal Submitted", "Your withdrawal transaction has been sent.");
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  }

  const groups = groupByDate(MOCK_HISTORY);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#facc15"
        />
      }
    >
      <Text style={styles.heading}>Earnings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Available to withdraw</Text>
        {address ? (
          <Text style={styles.balance}>{balance} XLM</Text>
        ) : (
          <Text style={[styles.balance, { color: "#525252" }]}>—</Text>
        )}
        {withdrawError && (
          <Text style={styles.errorText}>{withdrawError}</Text>
        )}
        <TouchableOpacity
          style={[styles.btn, (withdrawing || !address) && styles.btnDisabled]}
          onPress={handleWithdraw}
          disabled={withdrawing || !address}
        >
          {withdrawing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.btnText}>Withdraw All</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Transaction history</Text>
      {groups.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryText}>No transactions yet</Text>
        </View>
      ) : (
        groups.map(group => (
          <View key={group.date}>
            <Text style={styles.dateHeader}>{group.date}</Text>
            {group.items.map(tx => (
              <View key={tx.id} style={styles.row}>
                <View style={styles.rowIcon}>
                  <Text style={styles.rowIconText}>{tx.type === "sale" ? "↗" : "↙"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowBeat} numberOfLines={1}>{tx.beat}</Text>
                  <Text style={styles.rowType}>{tx.type === "sale" ? "Sale" : "Withdrawal"}</Text>
                </View>
                <Text style={[styles.rowAmount, tx.type === "sale" ? styles.sale : styles.withdraw]}>
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  heading:          { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 20, letterSpacing: -0.5 },
  card:             { backgroundColor: "#111", borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: "#1a1a1a" },
  label:            { fontSize: 12, fontWeight: "700", color: "#525252", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  balance:          { fontSize: 36, fontWeight: "900", color: "#facc15", marginBottom: 20 },
  errorText:        { fontSize: 12, color: "#ef4444", marginBottom: 12 },
  btn:              { backgroundColor: "#facc15", borderRadius: 12, padding: 14, alignItems: "center" },
  btnDisabled:      { opacity: 0.4 },
  btnText:          { fontSize: 15, fontWeight: "700", color: "#000" },
  sectionTitle:     { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 12 },
  dateHeader:       { fontSize: 11, fontWeight: "700", color: "#525252", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 12, marginBottom: 6 },
  row:              { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, backgroundColor: "#111", borderRadius: 12, marginBottom: 8 },
  rowIcon:          { width: 32, height: 32, borderRadius: 8, backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center", marginRight: 10 },
  rowIconText:      { fontSize: 14, color: "#a3a3a3" },
  rowBeat:          { fontSize: 14, fontWeight: "600", color: "#fff" },
  rowType:          { fontSize: 12, color: "#525252", marginTop: 2 },
  rowAmount:        { fontSize: 14, fontWeight: "700" },
  sale:             { color: "#facc15" },
  withdraw:         { color: "#737373" },
  emptyHistory:     { padding: 24, alignItems: "center" },
  emptyHistoryText: { color: "#525252", fontSize: 14 },
});
