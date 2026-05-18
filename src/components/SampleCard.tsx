import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  id: string;
  title: string;
  producer: string;
  genre: string;
  bpm: number;
  leasePrice: number;
  onBuy?: (id: string) => void;
}

export function SampleCard({ id, title, producer, genre, bpm, leasePrice, onBuy }: Props) {
  const BARS = [35, 60, 45, 75, 40, 65, 50, 70, 38, 62, 48, 72];

  return (
    <View style={styles.card}>
      {/* Waveform */}
      <View style={styles.wave}>
        {BARS.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h * 0.5 }]} />
        ))}
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.producer}>{producer}</Text>
          </View>
          <View style={styles.badges}>
            <View style={styles.badge}><Text style={styles.badgeText}>{genre}</Text></View>
            <View style={[styles.badge, { backgroundColor: "#1a1a1a" }]}>
              <Text style={[styles.badgeText, { color: "#525252" }]}>{bpm} BPM</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => onBuy?.(id)}>
          <Text style={styles.btnText}>Lease — {leasePrice} XLM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: "#111", borderRadius: 20, overflow: "hidden", marginBottom: 12, borderWidth: 1, borderColor: "#1a1a1a" },
  wave:       { backgroundColor: "#0a0a0a", height: 64, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, paddingHorizontal: 16 },
  bar:        { width: 3, backgroundColor: "#facc15", borderRadius: 2, opacity: 0.8 },
  body:       { padding: 14 },
  row:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  title:      { fontSize: 15, fontWeight: "700", color: "#fff" },
  producer:   { fontSize: 11, color: "#525252", fontFamily: "monospace", marginTop: 3 },
  badges:     { flexDirection: "row", gap: 6 },
  badge:      { backgroundColor: "rgba(250,204,21,0.1)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:  { fontSize: 10, fontWeight: "700", color: "#facc15" },
  btn:        { backgroundColor: "#facc15", borderRadius: 12, padding: 12, alignItems: "center" },
  btnText:    { fontSize: 14, fontWeight: "700", color: "#000" },
});
