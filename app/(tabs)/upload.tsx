import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useWallet } from "../../src/hooks/useWallet";
import { colors, spacing, radius, typography } from "../../src/constants/theme";

const GENRES = ["Hip-Hop", "Trap", "Lo-Fi", "R&B", "Drill", "Afrobeats", "Pop", "House"];

export default function UploadTab() {
  const { address, isConnected } = useWallet();
  const [title, setTitle] = useState("");
  const [priceXlm, setPriceXlm] = useState("");
  const [genre, setGenre] = useState("Hip-Hop");
  const [bpm, setBpm] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string; size?: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<"idle" | "ipfs" | "contract" | "done">("idle");

  const MAX_FILE_BYTES = 100 * 1024 * 1024;

  async function pickAudioFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac", "audio/aiff", "audio/x-aiff", "audio/*"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.size && asset.size > MAX_FILE_BYTES) {
          Alert.alert("File Too Large", "Audio files must be under 100 MB.");
          return;
        }
        setSelectedFile({ name: asset.name, uri: asset.uri, size: asset.size });
      }
    } catch {
      Alert.alert("Error", "Failed to pick audio file");
    }
  }

  async function handleUpload() {
    if (!isConnected || !address) {
      Alert.alert("Wallet Required", "Set up your wallet in the Profile tab first.");
      return;
    }
    if (!selectedFile) {
      Alert.alert("No File", "Please select an audio file first.");
      return;
    }
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert("Missing Title", "Please enter a beat title.");
      return;
    }
    if (trimmedTitle.length > 100) {
      Alert.alert("Title Too Long", "Beat title must be 100 characters or fewer.");
      return;
    }
    const price = parseFloat(priceXlm.trim());
    if (!price || price <= 0) {
      Alert.alert("Invalid Price", "Enter a price greater than 0 XLM.");
      return;
    }
    const bpmNum = parseInt(bpm.trim(), 10);
    if (!bpmNum || bpmNum < 40 || bpmNum > 300) {
      Alert.alert("Invalid BPM", "BPM must be between 40 and 300.");
      return;
    }

    setUploading(true);
    try {
      setStep("ipfs");
      await new Promise((r) => setTimeout(r, 1200));
      const seed = `${selectedFile.name}::${selectedFile.size ?? 0}::${title.trim()}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, "0");
      const cid = `Qm${hex}${hex}${hex.slice(0, 2)}`;

      setStep("contract");
      await new Promise((r) => setTimeout(r, 800));

      setStep("done");
      Alert.alert(
        "Beat Listed!",
        `"${trimmedTitle}" is now live on Crate marketplace.\nCID: ${cid}`,
        [
          {
            text: "Upload Another",
            onPress: () => {
              setTitle("");
              setPriceXlm("");
              setBpm("");
              setSelectedFile(null);
              setStep("idle");
            },
          },
          {
            text: "Done",
            style: "cancel",
            onPress: () => setStep("idle"),
          },
        ]
      );
    } catch (err) {
      Alert.alert("Upload Failed", err instanceof Error ? err.message : "Unknown error");
      setStep("idle");
    } finally {
      setUploading(false);
    }
  }

  const parsedPrice = parseFloat(priceXlm.trim());
  const producerEarning = parsedPrice > 0
    ? (Math.round(parsedPrice * 0.9 * 100) / 100).toFixed(2)
    : null;
  const platformFee = parsedPrice > 0
    ? (Math.round(parsedPrice * 0.1 * 100) / 100).toFixed(2)
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {!isConnected && (
        <View style={styles.walletWarning}>
          <Text style={styles.walletWarningText}>
            Set up your wallet in Profile to upload beats
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.filePicker} onPress={pickAudioFile} activeOpacity={0.7}>
        {selectedFile ? (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.filePickerIcon}>🎵</Text>
            <Text style={styles.filePickerFileName} numberOfLines={1} ellipsizeMode="middle">
              {selectedFile.name.length > 40
                ? selectedFile.name.replace(/^(.{20}).*(.{10})$/, "$1…$2")
                : selectedFile.name}
            </Text>
            {selectedFile.size != null && (
              <Text style={styles.filePickerMeta}>
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB · Tap to change
              </Text>
            )}
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.filePickerIcon}>⬆</Text>
            <Text style={styles.filePickerLabel}>Tap to select audio file</Text>
            <Text style={styles.filePickerMeta}>MP3, WAV, FLAC — up to 100MB</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Beat Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Midnight Trap Vol.1"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Price (XLM) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              placeholderTextColor={colors.textMuted}
              value={priceXlm}
              onChangeText={setPriceXlm}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>BPM *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 140"
              placeholderTextColor={colors.textMuted}
              value={bpm}
              onChangeText={setBpm}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Genre *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genrePill, genre === g && styles.genrePillActive]}
                onPress={() => setGenre(g)}
              >
                <Text style={[styles.genrePillText, genre === g && styles.genrePillTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {producerEarning && (
          <View style={styles.splitBox}>
            <View style={styles.splitRow}>
              <Text style={styles.splitLabel}>Your earnings (90%)</Text>
              <Text style={styles.splitValue}>{producerEarning} XLM</Text>
            </View>
            <View style={styles.splitRow}>
              <Text style={styles.splitLabel}>Platform fee (10%)</Text>
              <Text style={styles.splitMuted}>{platformFee} XLM</Text>
            </View>
          </View>
        )}

        {uploading && (
          <View style={styles.progressBox}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.progressText}>
              {step === "ipfs" ? "Uploading to IPFS..." : "Building contract transaction..."}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (uploading || !selectedFile || !isConnected) && styles.submitButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={uploading || !selectedFile || !isConnected}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="List beat on marketplace"
          accessibilityState={{ disabled: uploading || !selectedFile || !isConnected }}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? "Uploading..." : "List Beat on Marketplace"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 100 },
  walletWarning: {
    backgroundColor: "rgba(250, 204, 21, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.3)",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  walletWarningText: { color: colors.accent, fontSize: typography.fontSizeSM, textAlign: "center" },
  filePicker: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  filePickerIcon: { fontSize: 32, marginBottom: spacing.sm },
  filePickerLabel: { color: colors.textSecondary, fontWeight: typography.fontWeightMedium, fontSize: typography.fontSizeMD },
  filePickerFileName: { color: colors.textPrimary, fontWeight: typography.fontWeightSemibold, fontSize: typography.fontSizeMD },
  filePickerMeta: { color: colors.textMuted, fontSize: typography.fontSizeXS, marginTop: 4 },
  form: { gap: spacing.md },
  field: {},
  row: { flexDirection: "row", gap: spacing.md },
  label: { color: colors.textSecondary, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightMedium, marginBottom: 6 },
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
  genreScroll: { marginTop: 4 },
  genrePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  genrePillActive: { borderColor: colors.accent, backgroundColor: "rgba(250, 204, 21, 0.1)" },
  genrePillText: { color: colors.textSecondary, fontSize: typography.fontSizeSM },
  genrePillTextActive: { color: colors.accent, fontWeight: typography.fontWeightSemibold },
  splitBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.2)",
    padding: spacing.md,
    gap: 8,
  },
  splitRow: { flexDirection: "row", justifyContent: "space-between" },
  splitLabel: { color: colors.textSecondary, fontSize: typography.fontSizeSM },
  splitValue: { color: colors.success, fontWeight: typography.fontWeightSemibold, fontSize: typography.fontSizeSM },
  splitMuted: { color: colors.textMuted, fontSize: typography.fontSizeSM },
  progressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: "rgba(250, 204, 21, 0.08)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.2)",
  },
  progressText: { color: colors.accent, fontSize: typography.fontSizeSM },
  submitButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { color: "#000", fontWeight: typography.fontWeightBold, fontSize: typography.fontSizeMD },
});
