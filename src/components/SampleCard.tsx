import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  id: string;
  title: string;
  producer: string;
  genre: string;
  bpm: number;
  leasePrice: number;
  premiumPrice?: number;
  exclusivePrice?: number;
  onBuy?: (id: string, tier: "lease" | "premium" | "exclusive") => void;
}

const BARS = [35, 60, 45, 75, 40, 65, 50, 70, 38, 62, 48, 72];

export function SampleCard({
  id, title, producer, genre, bpm,
  leasePrice, premiumPrice, exclusivePrice,
  onBuy,
}: Props) {
  const [selectedTier, setSelectedTier] = useState<"lease" | "premium" | "exclusive">("lease");

  const tiers = [
    { key: "lease"     as const, label: "Lease",     price: leasePrice,                  desc: "Non-exclusive" },
    ...(premiumPrice   != null ? [{ key: "premium"   as const, label: "Premium",   price: premiumPrice,   desc: "Commercial"    }] : []),
    ...(exclusivePrice != null ? [{ key: "exclusive" as const, label: "Exclusive", price: exclusivePrice, desc: "Full rights"    }] : []),
  ];

  const selected = tiers.find(t => t.key === selectedTier) ?? tiers[0];

  return (
    <View style={styles.card}>
      <View style={styles.wave}>
        {BARS.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h * 0.5 }]} />
        ))}
      </View>

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.producer}>{producer}</Text>
          </View>
          <View style={styles.badges}>
            <View style={styles.badge}><Text style={styles.badgeText}>{genre}</Text></View>
            <View style={[styles.badge, { backgroundColor: "#1a1a1a" }]}>
              <Text style={[styles.badgeText, { color: "#525252" }]}>{bpm} BPM</Text>
            </View>
          </View>
        </View>

        {tiers.length > 1 && (
          <View style={styles.tierRow}>
            {tiers.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tierBtn, selectedTier === t.key && styles.tierBtnActive]}
                onPress={() => setSelectedTier(t.key)}
                accessibilityRole="button"
                accessibilityLabel={`${t.label} license — ${t.price} XLM`}
                accessibilityState={{ selected: selectedTier === t.key }}
              >
                <Text style={[styles.tierLabel, selectedTier === t.key && styles.tierLabelActive]}>
                  {t.label}
                </Text>
                <Text style={styles.tierPrice}>{t.price} XLM</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => onBuy?.(id, selected.key)}
          accessibilityRole="button"
          accessibilityLabel={`Buy ${selected.label} license for ${title} — ${selected.price} XLM`}
        >
          <Text style={styles.btnText}>
            {selected.label} — {selected.price} XLM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:           { backgroundColor: "#111", borderRadius: 20, overflow: "hidden", marginBottom: 12, borderWidth: 1, borderColor: "#1a1a1a" },
  wave:           { backgroundColor: "#0a0a0a", height: 64, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, paddingHorizontal: 16 },
  bar:            { width: 3, backgroundColor: "#facc15", borderRadius: 2, opacity: 0.8 },
  body:           { padding: 14 },
  header:         { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  title:          { fontSize: 15, fontWeight: "700", color: "#fff" },
  producer:       { fontSize: 11, color: "#525252", fontFamily: "monospace", marginTop: 3 },
  badges:         { flexDirection: "row", gap: 6 },
  badge:          { backgroundColor: "rgba(250,204,21,0.1)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:      { fontSize: 10, fontWeight: "700", color: "#facc15" },
  tierRow:        { flexDirection: "row", gap: 6, marginBottom: 10 },
  tierBtn:        { flex: 1, backgroundColor: "#0a0a0a", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 4, alignItems: "center", borderWidth: 1, borderColor: "#1a1a1a" },
  tierBtnActive:  { borderColor: "rgba(250,204,21,0.5)", backgroundColor: "rgba(250,204,21,0.08)" },
  tierLabel:      { fontSize: 10, fontWeight: "700", color: "#525252", textTransform: "uppercase", letterSpacing: 0.5 },
  tierLabelActive:{ color: "#facc15" },
  tierPrice:      { fontSize: 12, fontWeight: "800", color: "#fff", marginTop: 2 },
  btn:            { backgroundColor: "#facc15", borderRadius: 12, padding: 12, alignItems: "center" },
  btnText:        { fontSize: 14, fontWeight: "700", color: "#000" },
});
