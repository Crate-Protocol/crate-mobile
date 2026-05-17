import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import SampleCard, { type SampleItem } from "../../src/components/SampleCard";
import { useWallet } from "../../src/hooks/useWallet";
import { colors, spacing, radius, typography } from "../../src/constants/theme";

const GENRES = ["All", "Hip-Hop", "Trap", "Lo-Fi", "R&B", "Drill", "Afrobeats"];

const DEMO_SAMPLES: SampleItem[] = [
  { id: "1", title: "Midnight Trap Vol.1", genre: "Trap", bpm: 140, priceXlm: 12, salesCount: 42, uploader: "GBVKN4YTR3BFNCBQ5KWZOXJGTYUOOVKV7HBQPFZ5N7M5YZQE6RPDWKL", active: true },
  { id: "2", title: "Lo-Fi Study Session", genre: "Lo-Fi", bpm: 85, priceXlm: 8, salesCount: 128, uploader: "GBLQ7VN5LXQVX5QQFPWSF7BZJFKBM5KXQJXMCZN3JFPFDJQMKBHZQBT", active: true },
  { id: "3", title: "808 Summer", genre: "Hip-Hop", bpm: 92, priceXlm: 15, salesCount: 67, uploader: "GBLQ7VN5LXQVX5QQFPWSF7BZJFKBM5KXQJXMCZN3JFPFDJQMKBHZQBT", active: true },
  { id: "4", title: "Afroswing Nights", genre: "Afrobeats", bpm: 95, priceXlm: 10, salesCount: 23, uploader: "GCLN4YTR3BFNCBQ5KWZOXJGTYUOOVKV7HBQPFZ5N7M5YZQE6RPDWKL", active: true },
  { id: "5", title: "Drill Season", genre: "Drill", bpm: 135, priceXlm: 20, salesCount: 15, uploader: "GBVKN4YTR3BFNCBQ5KWZOXJGTYUOOVKV7HBQPFZ5N7M5YZQE6RPDWKL", active: true },
  { id: "6", title: "R&B Frequencies", genre: "R&B", bpm: 78, priceXlm: 9, salesCount: 91, uploader: "GCLN4YTR3BFNCBQ5KWZOXJGTYUOOVKV7HBQPFZ5N7M5YZQE6RPDWKL", active: true },
];

export default function DiscoverTab() {
  const { address } = useWallet();
  const [samples, setSamples] = useState<SampleItem[]>(DEMO_SAMPLES);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const filtered = samples.filter((s) => {
    const matchSearch =
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.genre.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenre === "All" || s.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  async function handleBuy(sample: SampleItem) {
    if (!address) {
      Alert.alert(
        "Wallet Required",
        "Go to the Profile tab to set up your Stellar wallet before buying.",
        [{ text: "OK" }]
      );
      return;
    }
    setBuyingId(sample.id);
    try {
      // In production: call contract purchaseSample
      await new Promise((r) => setTimeout(r, 1500));
      Alert.alert("Purchase Complete", `You bought "${sample.title}" for ${sample.priceXlm} XLM`);
    } catch {
      Alert.alert("Error", "Purchase failed. Please try again.");
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search beats, genres..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Genre pills */}
      <FlatList
        horizontal
        data={GENRES}
        keyExtractor={(g) => g}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genrePills}
        renderItem={({ item: genre }) => (
          <TouchableOpacity
            style={[
              styles.genrePill,
              selectedGenre === genre && styles.genrePillActive,
            ]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text
              style={[
                styles.genrePillText,
                selectedGenre === genre && styles.genrePillTextActive,
              ]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.genreList}
      />

      {/* Sample list */}
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SampleCard
            sample={item}
            onBuy={handleBuy}
            onPress={(s) => router.push(`/sample/${s.id}`)}
            buying={buyingId === item.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No beats found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: typography.fontSizeSM,
  },
  genreList: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  genrePills: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  genrePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genrePillActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(250, 204, 21, 0.1)",
  },
  genrePillText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizeSM,
    fontWeight: typography.fontWeightMedium,
  },
  genrePillTextActive: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.fontSizeMD,
  },
});
