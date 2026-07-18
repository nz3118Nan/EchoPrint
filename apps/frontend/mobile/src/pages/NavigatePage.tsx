import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type EchoMode = "idle" | "record" | "photo" | "text";
type TimelineItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: "photo" | "voice" | "note";
};

const mapSource = require("../../../../../docs/ui/raw_ui/Driver App/rn-CityTruckDriver/assets/images/map_bg1.png");
const firstTimeline: TimelineItem[] = [
  { id: "started", time: "Now", title: "Trace started", detail: "Location is being remembered.", type: "note" },
];

export function NavigatePage() {
  const [started, setStarted] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>(firstTimeline);
  const [mode, setMode] = useState<EchoMode>("idle");
  const [duration, setDuration] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const pulse = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const modeRef = useRef<EchoMode>("idle");
  const startedAt = useRef(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    if (!started) animation.start();
    return () => animation.stop();
  }, [pulse, started]);

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

  function addTimeline(type: TimelineItem["type"], title: string, detail: string) {
    setTimeline((items) => [
      { id: `${type}-${Date.now()}`, time: "Now", title, detail, type },
      ...items,
    ]);
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
        },
        onPanResponderMove: (_, gesture) => {
          dragY.setValue(Math.max(-58, Math.min(58, gesture.dy)));
          const nextMode: EchoMode = gesture.dy < -38 ? "photo" : gesture.dy > 38 ? "text" : "record";
          if (modeRef.current !== nextMode) {
            modeRef.current = nextMode;
            setMode(nextMode);
          }
        },
        onPanResponderRelease: () => {
          const action = modeRef.current;
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
          if (action === "record") {
            addTimeline("voice", "Voice echo", `${Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000))} sec recording`);
          }
          if (action === "photo") addTimeline("photo", "Photo echo", "A moment saved to this trace.");
          if (action === "text") setComposerOpen(true);
          modeRef.current = "idle";
          setMode("idle");
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
          modeRef.current = "idle";
          setMode("idle");
        },
      }),
    [dragY],
  );

  function submitNote() {
    if (!draft.trim()) return;
    addTimeline("note", "Written echo", draft.trim());
    setDraft("");
    setComposerOpen(false);
  }

  if (!started) return <StartTrace onStart={() => setStarted(true)} pulse={pulse} />;

  const prompt =
    mode === "record"
      ? `Recording · ${formatDuration(duration)}`
      : mode === "photo"
        ? "Release to save a photo"
        : mode === "text"
          ? "Release to write a note"
          : "Hold to record · drag up or down";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ACTIVE OUTDOOR SESSION</Text>
          <Text style={styles.title}>Today’s trace</Text>
        </View>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <ImageBackground imageStyle={styles.mapImage} source={mapSource} style={styles.map}>
        <View style={styles.mapWash} />
        <View style={styles.mapLine} />
        <View style={styles.mapPoint}><View style={styles.mapPointInner} /></View>
        <View style={styles.mapCaption}>
          <Feather color="#E3F0D3" name="navigation" size={13} />
          <Text style={styles.mapCaptionText}>0.6 KM · 14 MIN</Text>
        </View>
      </ImageBackground>
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
          <Pressable accessibilityLabel="Save text echo" onPress={submitNote} style={styles.send}>
            <Feather color="#F3F5E9" name="arrow-up" size={18} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.echoDock}>
        <Text style={[styles.echoHint, mode !== "idle" && styles.activeHint]}>{prompt}</Text>
        <View style={styles.echoTrack}>
          <Text style={styles.upHint}>↑ PHOTO</Text>
          <Animated.View
            {...responder.panHandlers}
            accessibilityLabel="Echo Point. Hold to record, drag up for photo, drag down for text."
            style={[
              styles.echoPoint,
              mode === "record" && styles.recordingPoint,
              mode === "photo" && styles.photoPoint,
              mode === "text" && styles.textPoint,
              { transform: [{ translateY: dragY }] },
            ]}
          >
            <Feather color={mode === "idle" ? "#173F32" : "#F5F4EB"} name={mode === "photo" ? "camera" : mode === "text" ? "edit-3" : mode === "record" ? "mic" : "navigation"} size={23} />
            <Text style={[styles.echoPointLabel, mode === "idle" && styles.idleEchoPointLabel]}>{mode === "idle" ? "ECHO POINT" : "ECHO"}</Text>
          </Animated.View>
          <Text style={styles.downHint}>↓ WRITE</Text>
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
            <Feather color="#173F32" name="navigation" size={26} />
            <Text style={styles.startPointText}>ECHO POINT</Text>
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
  map: { height: 145, marginHorizontal: 20, marginTop: 16, overflow: "hidden", position: "relative" },
  mapImage: { resizeMode: "cover" },
  mapWash: { ...StyleSheet.absoluteFillObject, backgroundColor: "#D8E3D5", opacity: 0.25 },
  mapLine: { backgroundColor: "#174B3A", borderRadius: 4, height: 5, left: "24%", position: "absolute", top: "60%", transform: [{ rotate: "-26deg" }], width: "50%" },
  mapPoint: { alignItems: "center", backgroundColor: "rgba(232,245,207,0.62)", borderRadius: 18, height: 36, justifyContent: "center", left: "70%", position: "absolute", top: "28%", width: 36 },
  mapPointInner: { backgroundColor: "#E9F5C8", borderColor: "#174B3A", borderRadius: 8, borderWidth: 3, height: 16, width: 16 },
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
  echoTrack: { alignItems: "center", height: 110, justifyContent: "center", position: "relative" },
  upHint: { color: "#668572", fontSize: 9, fontWeight: "800", letterSpacing: 0.8, position: "absolute", top: 1 },
  downHint: { bottom: 1, color: "#668572", fontSize: 9, fontWeight: "800", letterSpacing: 0.8, position: "absolute" },
  echoPoint: { alignItems: "center", backgroundColor: "#E7F2CC", borderColor: "#173F32", borderRadius: 34, borderWidth: 1.5, height: 68, justifyContent: "center", width: 130, zIndex: 2 },
  recordingPoint: { backgroundColor: "#B34E47", borderColor: "#F5CEC4" },
  photoPoint: { backgroundColor: "#7F8660" },
  textPoint: { backgroundColor: "#54768B" },
  echoPointLabel: { color: "#F4F4EA", fontSize: 9, fontWeight: "800", letterSpacing: 1, marginTop: 2 },
  idleEchoPointLabel: { color: "#173F32" },
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
  startPointText: { color: "#173F32", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginTop: 2 },
  startSubhint: { color: "#B8CEBB", fontSize: 10, marginTop: 11 },
});
