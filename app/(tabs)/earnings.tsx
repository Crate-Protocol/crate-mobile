import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useWallet } from "../../src/hooks/useWallet";

const MOCK_HISTORY = [
  { id: "tx1", type: "sale",     amount: "+22.5 XLM", beat: "Midnight Waves", date: "May 10" },
  { id: "tx2", type: "sale",     amount: "+18.0 XLM", beat: "Block Pressure", date: "May 8"  },
  { id: "tx3", type: "withdraw", amount: "-40.5 XLM", beat: "Withdrawal",     date: "May 7"  },
  { id: "tx4", type: "sale",     amount: "+27.0 XLM", beat: "Lagos Summer",   date: "May 3"  },
];

export default function Earnings() {
  const { address, balance } = useWallet();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Earnings</Text>

      {/* Balance card */}
      <View style={styles.card}>
        <Text style={styles.label}>Available to withdraw</Text>
        <Text style={styles.balance}>{address ? `${balance} XLM` : "—"}</Text>
        <TouchableOpacity style={styles.btn} disabled={!address}>
          <Text style={styles.btnText}>Withdraw All</Text>
        </TouchableOpacity>
      </View>

      {/* History */}
      <Text style={styles.sectionTitle}>Transaction history</Text>
      {MOCK_HISTORY.map(tx => (
        <View key={tx.id} style={styles.row}>
          <View>
            <Text style={styles.rowBeat}>{tx.beat}</Text>
            <Text style={styles.rowDate}>{tx.date}</Text>
          </View>
          <Text style={[styles.rowAmount, tx.type === "sale" ? styles.sale : styles.withdraw]}>
            {tx.amount}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  heading:      { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 20, letterSpacing: -0.5 },
  card:         { backgroundColor: "#111", borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: "#1a1a1a" },
  label:        { fontSize: 12, fontWeight: "700", color: "#525252", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  balance:      { fontSize: 36, fontWeight: "900", color: "#facc15", marginBottom: 20 },
  btn:          { backgroundColor: "#facc15", borderRadius: 12, padding: 14, alignItems: "center" },
  btnText:      { fontSize: 15, fontWeight: "700", color: "#000" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 12 },
  row:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, backgroundColor: "#111", borderRadius: 12, marginBottom: 8 },
  rowBeat:      { fontSize: 14, fontWeight: "600", color: "#fff" },
  rowDate:      { fontSize: 12, color: "#525252", marginTop: 2 },
  rowAmount:    { fontSize: 14, fontWeight: "700" },
  sale:         { color: "#facc15" },
  withdraw:     { color: "#737373" },
});
