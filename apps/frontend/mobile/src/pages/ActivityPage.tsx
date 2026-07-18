import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ImageBackground, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { trackEvent } from "../events/track-event";

type ViewMode = "cards" | "grid";
type Category = "All" | "Photo" | "Voice" | "Note";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const categories: Category[] = ["All", "Photo", "Voice", "Note"];
const traces = [
  { id: "river-walk", title: "River walk", time: "Yesterday · 17:20", echoes: "3 echoes", distance: "1.8 km", height: 174, category: "Photo", month: 7 },
  { id: "morning-loop", title: "Morning loop", time: "Tue · 08:12", echoes: "2 echoes", distance: "2.4 km", height: 148, category: "Voice", month: 7 },
  { id: "hill-view", title: "Hill view", time: "Sun · 15:42", echoes: "5 echoes", distance: "4.2 km", height: 190, category: "Photo", month: 7 },
  { id: "east-trail", title: "East trail", time: "Jul 12 · 11:08", echoes: "1 echo", distance: "3.1 km", height: 156, category: "Note", month: 7 },
  { id: "after-rain", title: "After rain", time: "Jul 09 · 18:33", echoes: "4 echoes", distance: "2.0 km", height: 182, category: "Photo", month: 7 },
  { id: "park-loop", title: "Park loop", time: "Jul 06 · 09:20", echoes: "2 echoes", distance: "2.7 km", height: 145, category: "Voice", month: 7 },
  { id: "quiet-street", title: "Quiet street", time: "Jul 03 · 19:04", echoes: "1 echo", distance: "1.4 km", height: 170, category: "Note", month: 7 },
  { id: "sunrise", title: "Sunrise", time: "Jun 30 · 06:48", echoes: "3 echoes", distance: "3.8 km", height: 151, category: "Photo", month: 6 },
  { id: "lunch-walk", title: "Lunch walk", time: "Jun 27 · 12:19", echoes: "2 echoes", distance: "1.2 km", height: 185, category: "Voice", month: 6 },
  { id: "field-notes", title: "Field notes", time: "Jun 21 · 16:10", echoes: "6 echoes", distance: "5.1 km", height: 158, category: "Note", month: 6 },
  { id: "lakeside", title: "Lakeside", time: "Jun 18 · 14:25", echoes: "2 echoes", distance: "2.2 km", height: 176, category: "Photo", month: 6 },
  { id: "homeward", title: "Homeward", time: "Jun 14 · 20:02", echoes: "1 echo", distance: "1.0 km", height: 149, category: "Photo", month: 6 },
] as const;
type Trace = (typeof traces)[number];

const mapSource = require("../../../../../docs/ui/raw_ui/Driver App/rn-CityTruckDriver/assets/images/map_bg1.png");
const photoSources = [
  require("../../assets/memories/hiking-trail.png"),
  require("../../assets/memories/city-walk.png"),
  require("../../assets/memories/lakeside-picnic.png"),
  require("../../assets/memories/riverside-cycle.png"),
];

export function ActivityPage({ onOpen }: { onOpen: (id: string) => void }) {
  const [mode, setMode] = useState<ViewMode>("cards");
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState<Category>("All");
  const [monthTarget, setMonthTarget] = useState<"start" | "end">("start");
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const visibleTraces = useMemo(() => traces.filter((trace) => trace.month >= startMonth + 1 && trace.month <= endMonth + 1 && (category === "All" || trace.category === category)), [category, endMonth, startMonth]);
  const columns = useMemo(() => [0, 1].map((column) => visibleTraces.filter((_, index) => index % 2 === column)), [visibleTraces]);

  function openTrace(id: string) {
    trackEvent("event_opened", { eventId: id, view: mode });
    onOpen(id);
  }

  function chooseMonth(index: number) {
    if (monthTarget === "start") setStartMonth(Math.min(index, endMonth));
    else setEndMonth(Math.max(index, startMonth));
  }

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <View><Text style={styles.eyebrow}>YOUR MEMORY MAP</Text><Text style={styles.title}>Activity</Text></View>
      <View style={styles.controls}>
        <Pressable accessibilityLabel="Filter activity" onPress={() => setShowFilter(true)} style={styles.filterButton}><Feather color="#174B3A" name="sliders" size={16} /></Pressable>
        <View style={styles.viewSwitch}>
          <Pressable accessibilityLabel="Card view" onPress={() => setMode("cards")} style={[styles.switchButton, mode === "cards" && styles.activeSwitch]}><Feather color={mode === "cards" ? "#F4F2EA" : "#648071"} name="credit-card" size={16} /></Pressable>
          <Pressable accessibilityLabel="Grid view" onPress={() => setMode("grid")} style={[styles.switchButton, mode === "grid" && styles.activeSwitch]}><Feather color={mode === "grid" ? "#F4F2EA" : "#648071"} name="grid" size={16} /></Pressable>
        </View>
      </View>
    </View>
    <View style={styles.subheader}><Text style={styles.subheaderText}>{mode === "cards" ? "Swipe through a trace at a time" : "Photo memories · newest first"}</Text><Text style={styles.count}>{visibleTraces.length} TRACES</Text></View>

    {visibleTraces.length === 0 ? <View style={styles.empty}><Feather color="#7B9788" name="search" size={22} /><Text style={styles.emptyTitle}>No traces here yet.</Text><Text style={styles.emptyCopy}>Try a wider month range or another category.</Text></View> : mode === "cards" ? <ScrollView contentContainerStyle={styles.cardScroller} decelerationRate="fast" horizontal pagingEnabled showsHorizontalScrollIndicator={false} snapToInterval={cardWidth + 12}>
      {visibleTraces.slice(0, 5).map((trace) => <TraceCard cardWidth={cardWidth} key={trace.id} onOpen={openTrace} trace={trace} />)}
    </ScrollView> : <ScrollView contentContainerStyle={styles.gridScroller} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>{columns.map((column, columnIndex) => <View key={columnIndex} style={styles.column}>{column.map((trace) => <TraceTile key={trace.id} onOpen={openTrace} photoIndex={traces.findIndex((item) => item.id === trace.id)} trace={trace} />)}</View>)}</View>
    </ScrollView>}

    <FilterSheet category={category} endMonth={endMonth} monthTarget={monthTarget} onClose={() => setShowFilter(false)} onMonthTarget={setMonthTarget} onSelectCategory={setCategory} onSelectMonth={chooseMonth} onSelectYear={setYear} startMonth={startMonth} visible={showFilter} year={year} />
  </SafeAreaView>;
}

function TraceCard({ cardWidth, onOpen, trace }: { cardWidth: number; onOpen: (id: string) => void; trace: Trace }) {
  return <Pressable onPress={() => onOpen(trace.id)} style={[styles.card, { width: cardWidth }]}>
    <ImageBackground imageStyle={styles.mapImage} source={mapSource} style={styles.cardMap}><View style={styles.mapTint} /><View style={styles.traceLine} /><View style={styles.marker}><Feather color="#F4F2EA" name="map-pin" size={17} /></View><View style={styles.mapTag}><Feather color="#D8E9C2" name="navigation" size={12} /><Text style={styles.mapTagText}>TRACE</Text></View></ImageBackground>
    <View style={styles.cardBody}><Text style={styles.cardDate}>{trace.time.toUpperCase()}</Text><Text style={styles.cardTitle}>{trace.title}</Text><View style={styles.cardFooter}><Text style={styles.cardMeta}>{trace.echoes} · {trace.distance}</Text><View style={styles.open}><Text style={styles.openText}>OPEN</Text><Feather color="#174B3A" name="arrow-up-right" size={14} /></View></View></View>
  </Pressable>;
}

function TraceTile({ onOpen, photoIndex, trace }: { onOpen: (id: string) => void; photoIndex: number; trace: Trace }) {
  return <Pressable onPress={() => onOpen(trace.id)} style={[styles.tile, { height: trace.height }]}>
    <ImageBackground imageStyle={styles.photo} source={photoSources[photoIndex % photoSources.length]} style={styles.tileImage}><View style={styles.tileTint} /><View style={styles.tileType}><Feather color="#F5F3EA" name={trace.category === "Photo" ? "image" : trace.category === "Voice" ? "mic" : "edit-3"} size={13} /></View><View style={styles.tileInfo}><Text numberOfLines={2} style={styles.tileTitle}>{trace.title}</Text><Text style={styles.tileMeta}>{trace.echoes}</Text></View></ImageBackground>
  </Pressable>;
}

function FilterSheet({ category, endMonth, monthTarget, onClose, onMonthTarget, onSelectCategory, onSelectMonth, onSelectYear, startMonth, visible, year }: { category: Category; endMonth: number; monthTarget: "start" | "end"; onClose: () => void; onMonthTarget: (target: "start" | "end") => void; onSelectCategory: (category: Category) => void; onSelectMonth: (month: number) => void; onSelectYear: (year: number) => void; startMonth: number; visible: boolean; year: number }) {
  const years = [year, year - 1, year - 2];
  return <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}><Pressable onPress={onClose} style={styles.sheetBackdrop}><Pressable onPress={() => undefined} style={styles.sheet}>
    <View style={styles.sheetHandle} /><View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Filter traces</Text><Pressable onPress={onClose}><Feather color="#174B3A" name="x" size={20} /></Pressable></View>
    <Text style={styles.filterLabel}>CATEGORY</Text><View style={styles.chips}>{categories.map((item) => <Pressable key={item} onPress={() => onSelectCategory(item)} style={[styles.chip, category === item && styles.activeChip]}><Text style={[styles.chipText, category === item && styles.activeChipText]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.filterLabel}>MONTH RANGE</Text><View style={styles.rangeSelect}><Pressable onPress={() => onMonthTarget("start")} style={[styles.rangeSelectItem, monthTarget === "start" && styles.activeRangeSelect]}><Text style={styles.rangeCaption}>FROM</Text><Text style={styles.rangeValue}>{months[startMonth]}</Text></Pressable><Feather color="#86A090" name="arrow-right" size={16} /><Pressable onPress={() => onMonthTarget("end")} style={[styles.rangeSelectItem, monthTarget === "end" && styles.activeRangeSelect]}><Text style={styles.rangeCaption}>TO</Text><Text style={styles.rangeValue}>{months[endMonth]}</Text></Pressable></View>
    <View style={styles.months}>{months.map((month, index) => <Pressable key={month} onPress={() => onSelectMonth(index)} style={[styles.month, (monthTarget === "start" ? startMonth : endMonth) === index && styles.activeMonth]}><Text style={[styles.monthText, (monthTarget === "start" ? startMonth : endMonth) === index && styles.activeMonthText]}>{month}</Text></Pressable>)}</View>
    <Text style={styles.filterLabel}>YEAR</Text><View style={styles.chips}>{years.map((item) => <Pressable key={item} onPress={() => onSelectYear(item)} style={[styles.chip, item === year && styles.activeChip]}><Text style={[styles.chipText, item === year && styles.activeChipText]}>{item}</Text></Pressable>)}</View>
    <Pressable onPress={onClose} style={styles.apply}><Text style={styles.applyText}>Show traces</Text></Pressable>
  </Pressable></Pressable></Modal>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F6F4ED", flex: 1 }, header: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16 }, eyebrow: { color: "#63806E", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 }, title: { color: "#173A2F", fontSize: 34, fontWeight: "700", letterSpacing: -1, marginTop: 5 }, controls: { alignItems: "center", flexDirection: "row", gap: 8 }, filterButton: { alignItems: "center", backgroundColor: "#E4E9DF", borderRadius: 13, height: 37, justifyContent: "center", width: 37 }, viewSwitch: { backgroundColor: "#E4E9DF", borderRadius: 13, flexDirection: "row", gap: 3, padding: 3 }, switchButton: { alignItems: "center", borderRadius: 10, height: 31, justifyContent: "center", width: 35 }, activeSwitch: { backgroundColor: "#174B3A" }, subheader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16 }, subheaderText: { color: "#718279", fontSize: 12, fontWeight: "600" }, count: { color: "#789180", fontSize: 10, fontWeight: "800", letterSpacing: 1 }, cardScroller: { gap: 12, paddingHorizontal: 20, paddingRight: 32 }, card: { backgroundColor: "#FFFFFF", borderColor: "#E2E5DD", borderRadius: 22, borderWidth: 1, overflow: "hidden" }, cardMap: { height: 278, overflow: "hidden", position: "relative" }, mapImage: { resizeMode: "cover" }, mapTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "#E1EADC", opacity: 0.22 }, traceLine: { backgroundColor: "#174B3A", borderRadius: 3, height: 6, left: "24%", position: "absolute", top: "58%", transform: [{ rotate: "-30deg" }], width: "47%" }, marker: { alignItems: "center", backgroundColor: "#174B3A", borderColor: "#E5F0CD", borderRadius: 20, borderWidth: 2, height: 40, justifyContent: "center", left: "68%", marginLeft: -20, marginTop: -20, position: "absolute", top: "41%", width: 40 }, mapTag: { alignItems: "center", backgroundColor: "rgba(23, 63, 50, 0.92)", borderRadius: 12, flexDirection: "row", gap: 5, left: 13, paddingHorizontal: 9, paddingVertical: 7, position: "absolute", top: 13 }, mapTagText: { color: "#D8E9C2", fontSize: 9, fontWeight: "800", letterSpacing: 1 }, cardBody: { padding: 18 }, cardDate: { color: "#759082", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 }, cardTitle: { color: "#173A2F", fontSize: 24, fontWeight: "700", letterSpacing: -0.5, marginTop: 5 }, cardFooter: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }, cardMeta: { color: "#687A70", fontSize: 12, fontWeight: "600" }, open: { alignItems: "center", flexDirection: "row", gap: 3 }, openText: { color: "#174B3A", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }, gridScroller: { paddingBottom: 22, paddingHorizontal: 14 }, grid: { alignItems: "flex-start", flexDirection: "row", gap: 8 }, column: { flex: 1, gap: 8 }, tile: { borderRadius: 14, overflow: "hidden", width: "100%" }, tileImage: { flex: 1, position: "relative" }, photo: { resizeMode: "cover" }, tileTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "#12382D", opacity: 0.23 }, tileType: { alignItems: "center", backgroundColor: "rgba(20, 65, 49, 0.86)", borderRadius: 12, height: 25, justifyContent: "center", position: "absolute", right: 8, top: 8, width: 25 }, tileInfo: { bottom: 0, left: 0, padding: 9, position: "absolute", right: 0 }, tileTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "800", lineHeight: 16, textShadowColor: "rgba(0,0,0,0.40)", textShadowRadius: 3 }, tileMeta: { color: "#E4EEDC", fontSize: 10, fontWeight: "700", marginTop: 3 }, empty: { alignItems: "center", flex: 1, justifyContent: "center", padding: 30 }, emptyTitle: { color: "#204937", fontSize: 17, fontWeight: "700", marginTop: 11 }, emptyCopy: { color: "#72877A", fontSize: 12, marginTop: 5 }, sheetBackdrop: { backgroundColor: "rgba(8, 27, 20, 0.42)", flex: 1, justifyContent: "flex-end" }, sheet: { backgroundColor: "#F6F4ED", borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20 }, sheetHandle: { alignSelf: "center", backgroundColor: "#C9D3C6", borderRadius: 2, height: 4, width: 38 }, sheetHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 15 }, sheetTitle: { color: "#173A2F", fontSize: 20, fontWeight: "700" }, filterLabel: { color: "#729080", fontSize: 10, fontWeight: "800", letterSpacing: 1.2, marginTop: 20 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 9 }, chip: { borderColor: "#D2DDD1", borderRadius: 13, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 }, activeChip: { backgroundColor: "#174B3A", borderColor: "#174B3A" }, chipText: { color: "#668073", fontSize: 12, fontWeight: "700" }, activeChipText: { color: "#F2F3E9" }, rangeSelect: { alignItems: "center", flexDirection: "row", gap: 10, marginTop: 9 }, rangeSelectItem: { backgroundColor: "#E8EDE4", borderColor: "transparent", borderRadius: 13, borderWidth: 1, flex: 1, padding: 10 }, activeRangeSelect: { borderColor: "#174B3A" }, rangeCaption: { color: "#7C9184", fontSize: 9, fontWeight: "800", letterSpacing: 1 }, rangeValue: { color: "#173A2F", fontSize: 15, fontWeight: "700", marginTop: 3 }, months: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 11 }, month: { alignItems: "center", borderColor: "#D5DED2", borderRadius: 10, borderWidth: 1, paddingVertical: 7, width: "15%" }, activeMonth: { backgroundColor: "#D9E9C2", borderColor: "#A9C795" }, monthText: { color: "#6A8173", fontSize: 10, fontWeight: "700" }, activeMonthText: { color: "#174B3A" }, apply: { alignItems: "center", backgroundColor: "#174B3A", borderRadius: 15, marginTop: 22, paddingVertical: 15 }, applyText: { color: "#F2F3E9", fontSize: 15, fontWeight: "700" },
});
