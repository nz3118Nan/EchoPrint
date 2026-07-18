import { Feather } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createMessage, createTraceSession, uploadPhoto, uploadVoice } from "../api/backend";
import { TraceMap } from "../components/TraceMap";
import { startTraceLocation, type TrackPoint } from "../location/gps";

type EchoMode = "idle" | "record" | "photo" | "text";
type TimelineItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: "photo" | "voice" | "note";
  imageUri?: string;
};

const firstTimeline: TimelineItem[] = [
  { id: "started", time: "Now", title: "Trace started", detail: "Location is being remembered.", type: "note" },
];
const MAX_ECHO_DRAG = 122;
const LOCK_THRESHOLD = 84;
const UNLOCK_THRESHOLD = 60;

export function NavigatePage({ onSessionStarted, sessionId }: { onSessionStarted: (sessionId: string) => void; sessionId?: string }) {
  const hasActiveSession = Boolean(sessionId);
  const [timeline, setTimeline] = useState<TimelineItem[]>(firstTimeline);
  const [mode, setMode] = useState<EchoMode>("idle");
  const [duration, setDuration] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState("");
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const stopLocation = useRef<(() => Promise<void>) | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const modeRef = useRef<EchoMode>("idle");
  const startedAt = useRef(0);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recordingStart = useRef<Promise<boolean> | null>(null);

  async function startTrace() {
    try {
      const session = await createTraceSession();
      stopLocation.current = await startTraceLocation(session.id, (point) => {
        setTrackPoints((points) => [...points, point]);
      });
      onSessionStarted(session.id);
    } catch (error) {
      Alert.alert("Could not start", error instanceof Error ? error.message : "Try again.");
    }
  }

  useEffect(() => () => {
    void stopLocation.current?.().catch(console.error);
  }, []);

  async function beginRecording() {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Microphone permission needed", "Enable microphone access to save voice echoes.");
      return false;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  }

  async function finishRecording(action: EchoMode) {
    try {
      const ready = await recordingStart.current;
      if (!ready) return;
      await recorder.stop();
      if (action !== "record" || !recorder.uri || !sessionId) return;
      const durationMs = Math.max(1, Date.now() - startedAt.current);
      setUploading(true);
      const saved = await uploadVoice(sessionId, recorder.uri, durationMs);
      addTimeline(
        "voice",
        "Voice echo",
        saved.transcript || `${Math.ceil(durationMs / 1000)} sec recording`,
      );
    } catch (error) {
      Alert.alert("Voice echo not saved", error instanceof Error ? error.message : "Try again.");
    } finally {
      recordingStart.current = null;
      setUploading(false);
      await setAudioModeAsync({ allowsRecording: false });
    }
  }

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    if (!hasActiveSession) animation.start();
    return () => animation.stop();
  }, [hasActiveSession, pulse]);

  useEffect(() => {
    if (mode !== "record") {
      setDuration(0);
      return;
    }
    const timer = setInterval(
      () => setDuration(Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000))),
      250,
    );
    return () => clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== "record") {
      recordingPulse.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(recordingPulse, { toValue: 0.2, duration: 520, useNativeDriver: true }),
        Animated.timing(recordingPulse, { toValue: 1, duration: 520, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [mode, recordingPulse]);

  function addTimeline(type: TimelineItem["type"], title: string, detail: string, imageUri?: string) {
    setTimeline((items) => [
      { id: `${type}-${Date.now()}`, time: "Now", title, detail, type, imageUri },
      ...items,
    ]);
  }

  async function selectPhoto(source: "camera" | "file") {
    if (!sessionId) return;
    try {
      const permission = source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Photo permission needed", "Enable photo access to save a photo echo.");
        return;
      }
      const result = source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 1 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 1 });
      if (result.canceled) return;
      setUploading(true);
      const asset = result.assets[0];
      const saved = await uploadPhoto(sessionId, asset, source);
      addTimeline("photo", "Photo echo", `${Math.ceil(saved.size / 1024)} KB · saved`, asset.uri);
    } catch (error) {
      Alert.alert("Photo not saved", error instanceof Error ? error.message : "Try again.");
    } finally {
      setUploading(false);
    }
  }

  function openPhotoMenu() {
    Alert.alert("Add a photo echo", "Choose where the photo comes from.", [
      { text: "Take photo", onPress: () => void selectPhoto("camera") },
      { text: "Choose from library", onPress: () => void selectPhoto("file") },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function handleRelease(action: EchoMode) {
    await finishRecording(action);
    if (action === "photo") openPhotoMenu();
    if (action === "text") setComposerOpen(true);
  }

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startedAt.current = Date.now();
          modeRef.current = "record";
          setMode("record");
          recordingStart.current = beginRecording();
        },
        onPanResponderMove: (_, gesture) => {
          dragX.setValue(Math.max(-MAX_ECHO_DRAG, Math.min(MAX_ECHO_DRAG, gesture.dx)));
          const leftThreshold = modeRef.current === "photo" ? -UNLOCK_THRESHOLD : -LOCK_THRESHOLD;
          const rightThreshold = modeRef.current === "text" ? UNLOCK_THRESHOLD : LOCK_THRESHOLD;
          const nextMode: EchoMode = gesture.dx < leftThreshold ? "photo" : gesture.dx > rightThreshold ? "text" : "record";
          if (modeRef.current !== nextMode) {
            modeRef.current = nextMode;
            setMode(nextMode);
          }
        },
        onPanResponderRelease: () => {
          const action = modeRef.current;
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
          void handleRelease(action);
          modeRef.current = "idle";
          setMode("idle");
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
          modeRef.current = "idle";
          setMode("idle");
          void finishRecording("idle");
        },
      }),
    [dragX, sessionId],
  );

  async function submitNote() {
    const content = draft.trim();
    if (!content || !sessionId) return;
    try {
      setUploading(true);
      const saved = await createMessage(sessionId, content);
      addTimeline("note", "Written echo", saved.content);
      setDraft("");
      setComposerOpen(false);
    } catch (error) {
      Alert.alert("Text echo not saved", error instanceof Error ? error.message : "Try again.");
    } finally {
      setUploading(false);
    }
  }

  if (!hasActiveSession) return <StartTrace onStart={() => void startTrace()} pulse={pulse} />;

  const prompt =
    mode === "record"
      ? `Recording · ${formatDuration(duration)}`
      : mode === "photo"
        ? "Release for photo"
        : mode === "text"
          ? "Release to write"
          : uploading
            ? "Saving and transcribing voice…"
            : "Hold to record · slide left or right";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ACTIVE LOCAL SESSION</Text>
          <Text style={styles.title}>Your live trace</Text>
        </View>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <View style={styles.map}>
        <TraceMap points={trackPoints} />
        <View style={styles.mapCaption}>
          <Feather color="#E3F0D3" name="navigation" size={13} />
          <Text style={styles.mapCaptionText}>LOCAL · {trackPoints.length} GPS POINTS</Text>
        </View>
      </View>
      <View style={styles.timelineHeading}>
        <Text style={styles.timelineTitle}>Today’s echoes</Text>
        <Text style={styles.timelineCount}>{timeline.length} ITEMS</Text>
      </View>
      <ScrollView contentContainerStyle={styles.timeline} showsVerticalScrollIndicator={false}>
        {timeline.map((item, index) => <TimelineRow index={index} item={item} key={item.id} />)}
      </ScrollView>
      {composerOpen ? (
        <View style={styles.composer}>
          <TextInput
            autoFocus
            multiline
            onChangeText={setDraft}
            placeholder="What are you noticing?"
            placeholderTextColor="#789081"
            style={styles.input}
            value={draft}
          />
          <Pressable accessibilityLabel="Save text echo" onPress={() => void submitNote()} style={styles.send}>
            <Feather color="#F3F5E9" name="arrow-up" size={18} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.echoDock}>
        <Text style={[styles.echoHint, mode !== "idle" && styles.activeHint]}>{prompt}</Text>
        <View style={styles.echoTrack}>
          <View pointerEvents="none" style={[styles.ghostAction, styles.leftAction]}>
            <Feather color="#174B3A" name="camera" size={24} />
            <Text style={styles.ghostLabel}>PHOTO</Text>
          </View>
          <Animated.View
            {...responder.panHandlers}
            accessibilityLabel="Echo Point. Hold to record, slide left for photo, slide right for text."
            style={[
              styles.echoPoint,
              mode !== "idle" && styles.activeEchoPoint,
              (mode === "photo" || mode === "text") && styles.lockedEchoPoint,
              { transform: [{ translateX: dragX }, { scale: mode === "photo" || mode === "text" ? 1.06 : 1 }] },
            ]}
          >
            {mode === "record" ? <Animated.View style={[styles.recordingDot, { opacity: recordingPulse }]} /> : null}
            {mode === "idle" ? <Image source={require("../../assets/brand/logo-mark.png")} style={styles.echoLogo} /> : <Feather color="#F5F4EB" name={mode === "photo" ? "camera" : mode === "text" ? "edit-3" : "mic"} size={23} />}
            {mode !== "idle" ? <Text style={styles.echoPointLabel}>{mode === "record" ? "RECORDING" : "LOCKED"}</Text> : null}
          </Animated.View>
          <View pointerEvents="none" style={[styles.ghostAction, styles.rightAction]}>
            <Feather color="#174B3A" name="edit-3" size={24} />
            <Text style={styles.ghostLabel}>WRITE</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StartTrace({ onStart, pulse }: { onStart: () => void; pulse: Animated.Value }) {
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  return (
    <SafeAreaView style={styles.startSafeArea}>
      <View style={styles.startContent}>
        <Text style={styles.startEyebrow}>OUTDOOR MEMORY JOURNAL</Text>
        <Text style={styles.startTitle}>Enjoy your{`\n`}trace today.</Text>
        <Text style={styles.startCopy}>Start a hike, a walk, or any moment worth returning to. EchoPoint will keep the trail with you.</Text>
        <View style={styles.startTerrain}><View style={styles.startHillOne} /><View style={styles.startHillTwo} /><View style={styles.startRoute} /></View>
      </View>
      <View style={styles.startDock}>
        <Text style={styles.startHint}>START A HIKE OR OUTDOOR ACTIVITY</Text>
        <View style={styles.startPointWrap}>
          <Animated.View style={[styles.pulse, { opacity, transform: [{ scale }] }]} />
          <Pressable accessibilityLabel="Start your trace with Echo Point" onPress={onStart} style={styles.echoPoint}>
            <Image source={require("../../assets/brand/logo-mark.png")} style={styles.echoLogo} />
          </Pressable>
        </View>
        <Text style={styles.startSubhint}>Tap to begin · hold once your trace is live</Text>
      </View>
    </SafeAreaView>
  );
}

function TimelineRow({ index, item }: { index: number; item: TimelineItem }) {
  const icon = item.type === "photo" ? "camera" : item.type === "voice" ? "mic" : "edit-3";
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, index === 0 && styles.latestDot]} />
        {index < 12 ? <View style={styles.timelineLine} /> : null}
      </View>
      <View style={styles.timelineTime}><Text style={styles.timeText}>{item.time}</Text></View>
      <View style={styles.timelineCard}>
        {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.timelinePhoto} /> : null}
        <View style={styles.timelineIcon}><Feather color="#174B3A" name={icon} size={15} /></View>
        <View style={styles.timelineText}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.itemDetail}>{item.detail}</Text>
        </View>
      </View>
    </View>
  );
}

function formatDuration(seconds: number) {
  return `0:${String(seconds).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F6F4ED", flex: 1 },
  header: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 15 },
  eyebrow: { color: "#668572", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: "#173A2F", fontSize: 29, fontWeight: "700", letterSpacing: -0.8, marginTop: 5 },
  live: { alignItems: "center", backgroundColor: "#E1EDD0", borderRadius: 12, flexDirection: "row", gap: 5, paddingHorizontal: 9, paddingVertical: 7 },
  liveDot: { backgroundColor: "#3D865F", borderRadius: 4, height: 7, width: 7 },
  liveText: { color: "#276344", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  map: { height: 280, marginHorizontal: 20, marginTop: 16, overflow: "hidden", position: "relative" },
  mapCaption: { alignItems: "center", backgroundColor: "rgba(23,63,50,0.90)", bottom: 9, flexDirection: "row", gap: 5, left: 9, paddingHorizontal: 8, paddingVertical: 6, position: "absolute" },
  mapCaptionText: { color: "#E3F0D3", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  timelineHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 18 },
  timelineTitle: { color: "#173A2F", fontSize: 17, fontWeight: "700" },
  timelineCount: { color: "#779080", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  timeline: { paddingBottom: 264, paddingHorizontal: 20, paddingTop: 13 },
  timelineRow: { flexDirection: "row", minHeight: 67 },
  timelineRail: { alignItems: "center", width: 17 },
  timelineDot: { backgroundColor: "#C2D4BF", borderRadius: 5, height: 10, width: 10 },
  latestDot: { backgroundColor: "#174B3A", borderColor: "#D9E9C2", borderWidth: 2, height: 14, width: 14 },
  timelineLine: { backgroundColor: "#D6E0D4", flex: 1, marginVertical: 3, width: 1 },
  timelineTime: { paddingLeft: 8, paddingTop: 8, width: 45 },
  timeText: { color: "#789080", fontSize: 10, fontWeight: "700" },
  timelineCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E0E6DD", borderRadius: 14, borderWidth: 1, flex: 1, flexDirection: "row", marginBottom: 9, padding: 10 },
  timelinePhoto: { borderRadius: 10, height: 46, marginRight: 9, width: 46 },
  timelineIcon: { alignItems: "center", backgroundColor: "#E5EEDF", borderRadius: 11, height: 30, justifyContent: "center", width: 30 },
  timelineText: { flex: 1, marginLeft: 9 },
  itemTitle: { color: "#254836", fontSize: 12, fontWeight: "800" },
  itemDetail: { color: "#718277", fontSize: 11, lineHeight: 15, marginTop: 2 },
  composer: { alignItems: "flex-end", backgroundColor: "#F6F4ED", bottom: 207, flexDirection: "row", gap: 8, left: 14, padding: 9, position: "absolute", right: 14, shadowColor: "#163F30", shadowOpacity: 0.13, shadowRadius: 12 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#DDE5D9", borderRadius: 15, borderWidth: 1, color: "#173A2F", flex: 1, fontSize: 13, maxHeight: 76, minHeight: 44, paddingHorizontal: 12, paddingTop: 11 },
  send: { alignItems: "center", backgroundColor: "#174B3A", borderRadius: 15, height: 44, justifyContent: "center", width: 44 },
  echoDock: { backgroundColor: "#F6F4ED", bottom: 96, left: 0, paddingBottom: 13, paddingTop: 10, position: "absolute", right: 0 },
  echoHint: { color: "#6A8475", fontSize: 11, fontWeight: "700", paddingBottom: 7, textAlign: "center" },
  activeHint: { color: "#174B3A" },
  echoTrack: { alignItems: "center", height: 82, justifyContent: "center", position: "relative" },
  ghostAction: { alignItems: "center", justifyContent: "center", opacity: 0.25, paddingVertical: 6, position: "absolute", top: 8, width: 66, zIndex: 3 },
  leftAction: { left: 18 },
  rightAction: { right: 18 },
  ghostLabel: { color: "#174B3A", fontSize: 8, fontWeight: "800", letterSpacing: 0.8, marginTop: 4 },
  echoPoint: { alignItems: "center", backgroundColor: "#E7F2CC", borderColor: "#173F32", borderRadius: 34, borderWidth: 1.5, height: 68, justifyContent: "center", width: 130, zIndex: 2 },
  activeEchoPoint: { backgroundColor: "#174B3A", borderColor: "#AFCB9B" },
  lockedEchoPoint: { borderColor: "#E4F4C9", borderWidth: 3, shadowColor: "#174B3A", shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.32, shadowRadius: 7 },
  recordingDot: { backgroundColor: "#E24D44", borderColor: "#FFD6D1", borderRadius: 5, borderWidth: 1, height: 10, position: "absolute", right: 17, top: 10, width: 10 },
  echoPointLabel: { color: "#F4F4EA", fontSize: 9, fontWeight: "800", letterSpacing: 1, marginTop: 2 },
  echoLogo: { height: 60, resizeMode: "contain", width: 60 },
  startSafeArea: { backgroundColor: "#12382D", flex: 1 },
  startContent: { flex: 1, overflow: "hidden", paddingHorizontal: 24, paddingTop: 35 },
  startEyebrow: { color: "#BFD8A6", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  startTitle: { color: "#F4F2EA", fontSize: 39, fontWeight: "700", letterSpacing: -1.2, lineHeight: 43, marginTop: 13 },
  startCopy: { color: "#CBDACD", fontSize: 15, lineHeight: 22, marginTop: 15, maxWidth: 310 },
  startTerrain: { bottom: -52, height: 230, left: 0, position: "absolute", right: 0 },
  startHillOne: { backgroundColor: "#1E4B3B", borderRadius: 160, height: 260, left: -55, position: "absolute", top: 52, transform: [{ rotate: "-14deg" }], width: 300 },
  startHillTwo: { backgroundColor: "#0C2B22", borderRadius: 170, height: 280, position: "absolute", right: -85, top: 72, transform: [{ rotate: "13deg" }], width: 350 },
  startRoute: { backgroundColor: "#BCD99D", height: 142, left: "54%", position: "absolute", top: 38, transform: [{ rotate: "-25deg" }], width: 2 },
  startDock: { alignItems: "center", backgroundColor: "#12382D", paddingBottom: 112, paddingTop: 15 },
  startHint: { color: "#BFD8A6", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  startPointWrap: { alignItems: "center", justifyContent: "center", marginTop: 14 },
  pulse: { backgroundColor: "#C9E1AE", borderRadius: 41, height: 82, position: "absolute", width: 82 },
  startSubhint: { color: "#B8CEBB", fontSize: 10, marginTop: 11 },
});
