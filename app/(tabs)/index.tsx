import { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SampleCard } from "../../src/components/SampleCard";

const GENRES = ["All", "Trap", "R&B", "Drill", "Afrobeats", "Lo-Fi"];

const DEMO = [
  { id: "1", title: "Midnight Waves", producer: "GBBD…LA5", genre: "Trap",      bpm: 140, leasePrice: 25  },
  { id: "2", title: "Lagos Summer",   producer: "GCYZ…SCU", genre: "Afrobeats", bpm: 105, leasePrice: 30  },
  { id: "3", title: "Soft Hours",     producer: "GAKW…GE",  genre: "R&B",       bpm: 88,  leasePrice: 20  },
  { id: "4", title: "Block Pressure", producer: "GBBD…LA5", genre: "Drill",     bpm: 148, leasePrice: 35  },
  { id: "5", title: "Cloud Study",    producer: "GCYZ…SCU", genre: "Lo-Fi",     bpm: 72,  leasePrice: 15  },
];

export default function Discover() {
  const [genre,  setGenre]  = useState("All");
  const [search, setSearch] = useState("");

  const filtered = DEMO.filter(s =>
    (genre === "All" || s.genre === genre) &&
    (!search || s.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search beats…"
        placeholderTextColor="#525252"
        style={styles.searchInput}
      />

      {/* Genre chips */}
      <View style={styles.chips}>
        {GENRES.map(g => (
          <TouchableOpacity key={g} onPress={() => setGenre(g)}
            style={[styles.chip, genre === g && styles.chipActive]}>
            <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SampleCard {...item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  heading:         { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 16, letterSpacing: -0.5 },
  searchInput:     { backgroundColor: "#111", borderRadius: 12, padding: 12, color: "#fff", fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: "#1a1a1a" },
  chips:           { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  chip:            { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: "#111", borderWidth: 1, borderColor: "#1a1a1a" },
  chipActive:      { backgroundColor: "#facc15", borderColor: "#facc15" },
  chipText:        { fontSize: 12, fontWeight: "700", color: "#525252" },
  chipTextActive:  { color: "#000" },
});
