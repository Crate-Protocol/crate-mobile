import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

export interface SampleItem {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  priceXlm: number;
  salesCount: number;
  uploader: string;
  active: boolean;
}

interface SampleCardProps {
  sample: SampleItem;
  onBuy?: (sample: SampleItem) => void;
  onPress?: (sample: SampleItem) => void;
  buying?: boolean;
}

export default function SampleCard({
  sample,
  onBuy,
  onPress,
  buying = false,
}: SampleCardProps) {
  const shortAddr = `${sample.uploader.slice(0, 8)}...${sample.uploader.slice(-4)}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(sample)}
      activeOpacity={0.8}
    >
      {/* Beat art */}
      <View style={styles.artContainer}>
        {/* Waveform bars decorative */}
        <View style={styles.waveform}>
          {[20, 35, 15, 45, 30, 50, 25, 40, 20, 35].map((h, i) => (
            <View
              key={i}
              style={[styles.waveBar, { height: h }]}
            />
          ))}
        </View>
        {/* Genre badge */}
        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{sample.genre}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {sample.title}
            </Text>
            <Text style={styles.address}>{shortAddr}</Text>
          </View>
          <Text style={styles.price}>{sample.priceXlm} XLM</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{sample.bpm} BPM</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{sample.salesCount} sales</Text>
        </View>

        <TouchableOpacity
          style={[styles.buyButton, (!sample.active || buying) && styles.buyButtonDisabled]}
          onPress={() => onBuy?.(sample)}
          disabled={!sample.active || buying}
          activeOpacity={0.8}
        >
          {buying ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buyButtonText}>
              {sample.active ? "Buy" : "Unavailable"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  artContainer: {
    height: 100,
    backgroundColor: colors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    opacity: 0.35,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  genreBadge: {
    position: "absolute",
    top: 8,
    left: 10,
    backgroundColor: "rgba(250, 204, 21, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.3)",
  },
  genreText: {
    color: colors.accent,
    fontSize: typography.fontSizeXS,
    fontWeight: typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeMD,
    fontWeight: typography.fontWeightSemibold,
    marginBottom: 2,
  },
  address: {
    color: colors.textMuted,
    fontSize: typography.fontSizeXS,
    fontFamily: "monospace",
  },
  price: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: typography.fontWeightBold,
    marginLeft: spacing.sm,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: typography.fontSizeXS,
  },
  metaDot: {
    color: colors.textMuted,
    fontSize: typography.fontSizeXS,
  },
  buyButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
  },
  buyButtonDisabled: {
    opacity: 0.4,
  },
  buyButtonText: {
    color: "#000",
    fontWeight: typography.fontWeightBold,
    fontSize: typography.fontSizeSM,
  },
});
