import React, {  useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity, BackHandler, StyleSheet, Image, Modal } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from "react-native-maps";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../../components/myStatusBar";
import { Dimensions } from "react-native";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

const trucksList = [
    {
        id: '1',
        truckImage: require('../../../assets/images/trucks/truck8.png'),
        truckNumber: 'KUP 1598',
        truckModel: 'Scania R125',
        task: 'Chemical Delivery',
        departedDate: '20 Mar',
        departedTime: '02:30pm',
        location: '786 Maynard Rd,Calgary,Canada',
    },
    {
        id: '2',
        truckImage: require('../../../assets/images/trucks/truck6.png'),
        truckNumber: 'GPT 1579',
        truckModel: 'Tata Motors D128',
        task: 'Machinery Delivery',
        departedDate: '22 Mar',
        departedTime: '03:00pm',
        location: '930 Stoney Creek,Grayson,Canada',
    },
    {
        id: '3',
        truckImage: require('../../../assets/images/trucks/truck7.png'),
        truckNumber: 'HTP 1278',
        truckModel: 'Force Motors T157',
        task: 'Chemical Delivery',
        departedDate: '25 Mar',
        departedTime: '04:00pm',
        location: '1310 Harvest Moon DragEvent,Unionville',
    },
];

const placesList = [
    {
        id: '1',
        coordinate: {
            latitude: 22.6293867,
            longitude: 88.4354486,
        },
    },
    {
        id: '2',
        coordinate: {
            latitude: 22.6345648,
            longitude: 88.4377279,
        },
    },
    {
        id: '3',
        coordinate: {
            latitude: 22.6281662,
            longitude: 88.4410113,
        },
    },
    {
        id: '4',
        coordinate: {
            latitude: 22.6341137,
            longitude: 88.4497463,
        },
    },
];

const HomeScreen = () => {

    const navigation = useNavigation();

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    };

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => {
                backHandler.remove();
            };
        }, [backAction])
    );

    function _spring() {
        updateState({ backClickCount: 1 });
        setTimeout(() => {
            updateState({ backClickCount: 0 })
        }, 1000)
    }

    const [state, setState] = useState({
        backClickCount: 0,
        currentTabIndex: 0,
        transist: null,
        from: null,
        to: null,
        selectedTruckStatus: null,
        showTruckStatusOptions: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        backClickCount,
        currentTabIndex,
        transist,
        from,
        to,
        selectedTruckStatus,
        showTruckStatusOptions,
    } = state;

    const [showMap, setShowMap] = useState(false);
    const [showmMarkerDesSheet, setShowmMarkerDesSheet] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 1000);
        return () => { clearTimeout(timer) }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                {
                    currentTabIndex == 0
                        ?
                        <View
                            style={{ marginTop: -40.0, flex: 1 }}>
                            {
                                currentTabIndex == 0
                                    ?
                                    trucksInfo()
                                    :
                                    null
                            }
                        </View>
                        :
                        mapView()
                }
            </View>
            {addBotton()}
            {markerDescriptionSheet()}
            {exitInfo()}
        </View>
    )

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={styles.animatedView}>
                    <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                        press back again to exit the app
                    </Text>
                </View>
                :
                null
        )
    }

    function markerDescriptionSheet() {
        return (           
            <Modal
                animationType="slide"
                transparent={true}
                visible={showmMarkerDesSheet}
                onRequestClose={() => { setShowmMarkerDesSheet(false); }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { setShowmMarkerDesSheet(false); }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ backgroundColor: Colors.whiteColor }}
                        >
                            <View>
                                <View style={styles.bottomSheetTruckImageModelAndNumberStyle}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                        <Image
                                            source={require('../../../assets/images/trucks/truck8.png')}
                                            style={{ width: 40.0, height: 40.0, borderRadius: 25.0, }}
                                        />
                                        <View style={{ marginLeft: Sizes.fixPadding, flex: 1, }}>
                                            <Text style={{ ...Fonts.blackColor14SemiBold }}>
                                                KUP 1598
                                            </Text>
                                            <Text style={{ ...Fonts.grayColor12Medium }}>
                                                Scania R125
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ ...Fonts.redColor14Bold }}>
                                        In Transist
                                    </Text>
                                </View>

                                <View style={{ paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding + 10.0, }}>
                                    <>
                                        <Text style={{ ...Fonts.grayColor12Medium }}>
                                            Task
                                        </Text>
                                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                            Chemical Delivery
                                        </Text>
                                    </>
                                    <View style={{ marginVertical: Sizes.fixPadding }}>
                                        <Text style={{ ...Fonts.grayColor12Medium }}>
                                            Departed
                                        </Text>
                                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                            20 Mar, 02:30pm
                                        </Text>
                                    </View>
                                    <>
                                        <Text style={{ ...Fonts.grayColor12Medium }}>
                                            Start location
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Image
                                                source={require('../../../assets/images/icons/marker_icon2.png')}
                                                style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                                            />
                                            <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor13SemiBold }}>
                                                786 Maynard Rd,Calgary,Canada
                                            </Text>
                                        </View>
                                    </>
                                    <View style={{ marginVertical: Sizes.fixPadding }}>
                                        <Text style={{ ...Fonts.grayColor12Medium }}>
                                            Current location
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <MaterialIcons name="location-on" color='#FF6090' size={15} style={{ width: 12.0 }} />
                                            <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor13SemiBold }}>
                                                Central Pkwy,Calgary,Canada
                                            </Text>
                                        </View>
                                    </View>
                                    <>
                                        <Text style={{ ...Fonts.grayColor12Medium }}>
                                            Trip End location
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Image
                                                source={require('../../../assets/images/icons/marker_icon1.png')}
                                                style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                                            />
                                            <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor13SemiBold }}>
                                                Stoney Creek,Calgary,Canada
                                            </Text>
                                        </View>
                                    </>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        setShowmMarkerDesSheet(false);
                                        navigation.push('track/trackScreen')
                                    }}
                                    style={{
                                        margin: Sizes.fixPadding * 2.0,
                                        borderRadius: Sizes.fixPadding - 5.0,
                                        marginTop: Sizes.fixPadding - 7.0,
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#FD5D8D', '#BF124A',]}
                                        style={styles.bottomSheetTrackButtonStyle}>
                                        <MaterialIcons
                                            name="location-on"
                                            color={Colors.whiteColor}
                                            size={20}
                                        />
                                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor14SemiBold }}>
                                            TRACK
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function addBotton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('truckTrip/truckTripScreen')}
                style={{ position: 'absolute', bottom: 40.0, right: 20.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.addIconWrapStyle}
                >
                    <MaterialIcons
                        name="add"
                        color={Colors.whiteColor}
                        size={30}
                    />
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function searchInfo() {
        return (
            <View style={styles.searchInfoWrapStyle}>
                <View style={{ marginHorizontal: Sizes.fixPadding, }}>
                    {inTransistSearchInfo()}
                    <View style={{ marginVertical: Sizes.fixPadding - 4.0, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
                    {fromLocationSearchInfo()}
                    <View style={{ marginVertical: Sizes.fixPadding - 4.0, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
                    {toLocationSearchInfo()}
                    <View style={{ marginVertical: Sizes.fixPadding - 4.0, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
                    {truckStatusSearchInfo()}
                </View>
                {searchButton()}
            </View>
        )
    }

    function searchButton() {
        return (
            <LinearGradient
                colors={['#FD5D8D', '#BF124A',]}
                style={styles.searchButtonWrapStyle}
            >
                <Text style={{ ...Fonts.whiteColor14SemiBold }}>
                    Search
                </Text>
                <MaterialIcons
                    name="search"
                    color={Colors.whiteColor}
                    size={20}
                />
            </LinearGradient>
        )
    }

    function inTransistSearchInfo() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                    placeholder="In Transist"
                    placeholderTextColor={Colors.blackColor}
                    value={transist}
                    onChangeText={(value) => updateState({ transist: value })}
                    style={{ flex: 1, ...Fonts.blackColor14SemiBold }}
                    selectionColor={Colors.primaryColor}
                />
                <MaterialIcons name="gesture" size={20} color="black" />
            </View>
        )
    }

    function fromLocationSearchInfo() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                    placeholder="From"
                    placeholderTextColor={Colors.blackColor}
                    value={from}
                    onChangeText={(value) => updateState({ from: value })}
                    style={{ flex: 1, ...Fonts.blackColor14SemiBold }}
                    selectionColor={Colors.primaryColor}
                />
                <MaterialIcons name="location-on" size={20} color="black" />
            </View>
        )
    }

    function toLocationSearchInfo() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                    placeholder="To"
                    placeholderTextColor={Colors.blackColor}
                    value={to}
                    onChangeText={(value) => updateState({ to: value })}
                    style={{ flex: 1, ...Fonts.blackColor14SemiBold }}
                    selectionColor={Colors.primaryColor}
                />
                <MaterialIcons name="location-on" size={20} color="black" />
            </View>
        )
    }

    function truckStatusSearchInfo() {
        return (
            <Menu
                visible={showTruckStatusOptions}
                anchor={
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ showTruckStatusOptions: true })}
                        style={{ marginTop: Sizes.fixPadding - 5.0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Text style={{ flex: 1, ...Fonts.blackColor14SemiBold }}>
                            {selectedTruckStatus ? selectedTruckStatus : 'Truck Status'}
                        </Text>
                        <MaterialCommunityIcons name="text-search" size={20} color="black" />
                    </TouchableOpacity>
                }
                onRequestClose={() => updateState({ showTruckStatusOptions: false })}
            >
                <View style={{ width: width - 70 }}>
                    <MenuItem
                        textStyle={{ ...Fonts.blackColor14SemiBold }}
                        onPress={() => updateState({ selectedTruckStatus: 'Parked', showTruckStatusOptions: false })}
                    >
                        Parked
                    </MenuItem>
                    <MenuItem
                        textStyle={{ ...Fonts.blackColor14SemiBold }}
                        onPress={() => updateState({ selectedTruckStatus: 'Running', showTruckStatusOptions: false })}
                    >
                        Running
                    </MenuItem>
                </View>
            </Menu>
        )
    }

    function trucksInfo() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0 }}>
                {searchInfo()}
                {trucksList.map((item) => (
                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => navigation.push('trackTruck/trackTruckScreen')}
                        key={`${item.id}`}
                        style={styles.truckInfoWrapStyle}
                    >
                        <View style={styles.truckModelNoAndImageInfoWrapStyle}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <Image
                                    source={item.truckImage}
                                    style={{ width: 40.0, height: 40.0, borderRadius: 25.0, }}
                                />
                                <View style={{ marginLeft: Sizes.fixPadding, flex: 1, }}>
                                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                                        {item.truckNumber}
                                    </Text>
                                    <Text style={{ ...Fonts.grayColor12Medium }}>
                                        {item.truckModel}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ ...Fonts.redColor14Bold }}>
                                In Transist
                            </Text>
                        </View>
                        <View style={{ padding: Sizes.fixPadding, }}>
                            <>
                                <Text style={{ ...Fonts.grayColor12Medium }}>
                                    Task
                                </Text>
                                <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                    {item.task}
                                </Text>
                            </>
                            <View style={{ marginVertical: Sizes.fixPadding }}>
                                <Text style={{ ...Fonts.grayColor12Medium }}>
                                    Departed
                                </Text>
                                <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                    {item.departedDate}, {item.departedTime}
                                </Text>
                            </View>
                            <>
                                <Text style={{ ...Fonts.grayColor12Medium }}>
                                    location
                                </Text>
                                <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                    {item.location}
                                </Text>
                            </>
                            <Image
                                source={require('../../../assets/images/flag.png')}
                                style={{ alignSelf: 'flex-end', width: 28.0, height: 28.0, resizeMode: 'contain' }}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
    }

    function mapView() {
        return (
            showMap && <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 22.6292757,
                    longitude: 88.444781,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
                loadingEnabled
                loadingIndicatorColor={Colors.primaryColor}
            >
                {
                    placesList.map((item) => (
                        showMap && <Marker
                            key={`${item.id}`}
                            coordinate={item.coordinate}
                            onPress={() => setShowmMarkerDesSheet(true)}
                        >
                            <Image
                                source={require('../../../assets/images/icons/marker_icon3.png')}
                                style={{ width: 30.0, height: 30.0, resizeMode: 'contain' }}
                            />
                        </Marker>
                    ))
                }
            </MapView>
        )
    }

    function header() {
        return (
            <View style={{
                backgroundColor: Colors.primaryColor,
                borderBottomLeftRadius: Sizes.fixPadding * 5.0,
                borderBottomRightRadius: Sizes.fixPadding * 5.0,
            }}>
                <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="menu"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                        City Truck
                    </Text>
                </View>
                {tabView()}
            </View>
        )
    }

    function tabView() {
        return (
            <View style={{ marginTop: Sizes.fixPadding - 5.0, marginBottom: Sizes.fixPadding * 5.0, }}>
                <View style={styles.tabBarWrapStyle}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ currentTabIndex: 0 })}
                        style={{ alignItems: 'center', flex: 1, }}
                    >
                        <Text style={currentTabIndex == 0 ? { ...Fonts.whiteColor12Bold } : { ...Fonts.whiteColor12Regular }}>
                            List View
                        </Text>
                        <View style={{ marginTop: Sizes.fixPadding + 2.0, width: 50.0, backgroundColor: currentTabIndex == 0 ? Colors.whiteColor : 'transparent', height: 2.0, }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ currentTabIndex: 1 })}
                        style={{ alignItems: 'center', flex: 1, }}
                    >
                        <Text style={currentTabIndex == 1 ? { ...Fonts.whiteColor12Bold } : { ...Fonts.whiteColor12Regular }}>
                            Map View
                        </Text>
                        <View style={{ marginTop: Sizes.fixPadding + 2.0, width: 50.0, backgroundColor: currentTabIndex == 1 ? Colors.whiteColor : 'transparent', height: 2.0, }} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1.0, backgroundColor: '#D9678B', }} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100
    },
    tabBarWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    searchButtonWrapStyle: {
        marginTop: Sizes.fixPadding + 2.0,
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    searchInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding,
        ...CommonStyles.shadow,
    },
    truckModelNoAndImageInfoWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        padding: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0,
    },
    truckInfoWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
        ...CommonStyles.shadow
    },
    addIconWrapStyle: {
        width: 55.0,
        height: 55.0,
        borderRadius: 27.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomSheetTrackButtonStyle: {
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomSheetTruckImageModelAndNumberStyle: {
        backgroundColor: Colors.lightGrayColor,
        paddingHorizontal: Sizes.fixPadding + 10.0,
        paddingVertical: Sizes.fixPadding,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

export default HomeScreen;