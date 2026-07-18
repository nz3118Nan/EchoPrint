import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from "react-native-maps";
import { Key } from "../../constants/key";
import MapViewDirections from 'react-native-maps-directions';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";

const TruckInfoScreen = () => {

    const navigation = useNavigation();

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 1000);
        return () => { clearTimeout(timer) }
    }, [])

    const fromLocation = {
        latitude: 22.640102,
        longitude: 88.439598,
    };

    const toLocation = {
        latitude: 22.630194,
        longitude: 88.447383,
    }

    const currentLocation = {
        latitude: 22.636190,
        longitude: 88.457199,
    }

    var { item } = useLocalSearchParams();
    item = JSON.parse(item);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {mapView()}
                {header()}
                {truckInfo()}
                {tripInfo()}
            </View>
        </View>
    )

    function tripInfo() {
        return (
            <View style={styles.tripInfoWrapStyle}>
                <View style={styles.fastestRouteInfoWrapStyle}>
                    <Text style={{ ...Fonts.grayColor14Medium }}>
                        Fastest Route
                    </Text>
                    <Text style={{ ...Fonts.redColor16SemiBold }}>
                        20 hr (429km)
                    </Text>
                </View>
                {startTripButton()}
            </View>
        )
    }

    function startTripButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('tripInfo/tripInfoScreen')}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.startTripButtonWrapStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Start Trip
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function truckInfo() {
        return (
            <View style={styles.truckInfoPositionStyle}>
                <View style={styles.truckInfoWrapStyle}>
                    <View style={styles.truckModelNoAndImageInfoWrapStyle}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Image
                                source={require('../../assets/images/trucks/truck1.png')}
                                style={{ width: 40.0, height: 40.0, borderRadius: 25.0, }}
                            />
                            <View style={{ marginLeft: Sizes.fixPadding, flex: 1, }}>
                                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                                    KUP 1598
                                </Text>
                                <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                                    Scania R125
                                </Text>
                            </View>
                        </View>
                        <Text style={{ ...Fonts.redColor14Bold }}>
                            Calgary(121km)
                        </Text>
                    </View>
                    <View style={{ padding: Sizes.fixPadding, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, }}>
                                <Text style={{ ...Fonts.grayColor12Medium }}>
                                    Task
                                </Text>
                                <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                    {item.task}
                                </Text>
                            </View>
                            <LinearGradient
                                colors={['#FD5D8D', '#BF124A',]}
                                style={styles.destinationTotalTaskWrapStyle}
                            >
                                <Text style={{ ...Fonts.whiteColor14SemiBold }}>
                                    {item.destinationTotalTask}
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={{ marginVertical: Sizes.fixPadding }}>
                            <Text style={{ ...Fonts.grayColor12Medium }}>
                                Departed
                            </Text>
                            <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                20 Mar, 02:30pm
                            </Text>
                        </View>
                        <>
                            <Text style={{ ...Fonts.grayColor12Medium }}>
                                location
                            </Text>
                            <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                786 Maynard Rd,Calgary,Canada
                            </Text>
                        </>
                        <Image
                            source={require('../../assets/images/flag.png')}
                            style={{ alignSelf: 'flex-end', width: 28.0, height: 28.0, resizeMode: 'contain' }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function mapView() {
        return (
            showMap && <MapView
                style={{ flex: 1, }}
                initialRegion={{
                    latitude: 22.6292757,
                    longitude: 88.444781,
                    latitudeDelta: 0.045,
                    longitudeDelta: 0.045,
                }}
                loadingEnabled
                loadingIndicatorColor={Colors.primaryColor}
            >
                {showMap && <Marker coordinate={toLocation}>
                    <Image
                        source={require('../../assets/images/icons/marker_icon1.png')}
                        style={{ width: 15.0, height: 15.0, marginTop: Sizes.fixPadding, }}
                    />
                </Marker>}
                {showMap && <Marker coordinate={fromLocation}>
                    <Image
                        source={require('../../assets/images/icons/marker_icon2.png')}
                        style={{ width: 15.0, height: 15.0, }}
                    />
                </Marker>}
                {showMap && <Marker coordinate={currentLocation}>
                    <Image
                        source={require('../../assets/images/icons/marker_icon3.png')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </Marker>}
                {
                    Platform.OS == 'ios'
                        ?
                        <Polyline
                            coordinates={[fromLocation, toLocation]}
                            strokeColor={Colors.primaryColor}
                            strokeWidth={3}
                        />
                        :
                        <MapViewDirections
                            origin={fromLocation}
                            destination={toLocation}
                            apikey={Key.apiKey}
                            lineDashPattern={[1]}
                            lineCap="square"
                            strokeColor={Colors.primaryColor}
                            strokeWidth={3}
                        />
                }
            </MapView>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.whiteColor}
                    size={22}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.whiteColor18SemiBold }}>
                    {item.task}
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        position: 'absolute',
        top: 0.0,
        left: 0.0,
        right: 0.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 6.0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding * 5.0,
        borderBottomRightRadius: Sizes.fixPadding * 5.0,
    },
    truckModelNoAndImageInfoWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
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
    truckInfoPositionStyle: {
        position: 'absolute',
        left: 0.0,
        right: 0.0,
        top: Sizes.fixPadding * 6.5,
    },
    destinationTotalTaskWrapStyle: {
        backgroundColor: Colors.primaryColor,
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startTripButtonWrapStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    tripInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        position: 'absolute',
        bottom: 10.0,
        left: 20.0, right: 20.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding + 5.0,
    },
    fastestRouteInfoWrapStyle: {
        marginBottom: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default TruckInfoScreen;
