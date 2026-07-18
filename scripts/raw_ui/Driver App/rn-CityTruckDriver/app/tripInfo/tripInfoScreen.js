import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from "react-native-maps";
import { Key } from "../../constants/key";
import MapViewDirections from 'react-native-maps-directions';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const TripInfoScreen = () => {

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

    const [currentInfoIndex, setCurrentInfoIndex] = useState(1);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {mapView()}
                {backArrow()}
                {tripAndVehicalInfo()}
            </View>
        </View>
    )

    function tripAndVehicalInfo() {
        return (
            <View style={{ position: 'absolute', bottom: 20.0, right: 20.0, left: 20.0, }}>
                <View style={styles.truckInfoWrapStyle}>
                    <View style={styles.truckModelNoAndImageInfoWrapStyle}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <Image
                                    source={require('../../assets/images/trucks/truck1.png')}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {tripAndVehicleInfoOptions({ option: 'About Trip', index: 1, })}
                            {tripAndVehicleInfoOptions({ option: 'Vehicle Info', index: 2, })}
                        </View>
                    </View>
                    {
                        currentInfoIndex == 1
                            ?
                            tripInfo()
                            :
                            vehicleInfo()
                    }

                </View>
            </View>
        )
    }

    function vehicleInfo() {
        return (
            <View style={{ paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            Vehicle Model
                        </Text>
                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                            Scania R125
                        </Text>
                    </View>
                    <View>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            Vehicle Number
                        </Text>
                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                            KUP 1598
                        </Text>
                    </View>
                </View>
                <View style={{ marginVertical: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ minWidth: 125, ...Fonts.grayColor12Medium }}>
                        Max. Load Capacity: { }
                    </Text>
                    <Text style={{ ...Fonts.blackColor13SemiBold }}>
                        16.2 Tonnes
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ minWidth: 125, ...Fonts.grayColor12Medium }}>
                        Insured Due Date: { }
                    </Text>
                    <Text style={{ ...Fonts.blackColor13SemiBold }}>
                        03/02/2020
                    </Text>
                </View>
                <View style={{ marginVertical: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            Driver: { }
                        </Text>
                        <View>
                            <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                Enrique West
                            </Text>
                            <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                (+91 1234567890)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.phoneIconWrapStyle}>
                        <MaterialIcons
                            name="phone"
                            color={Colors.whiteColor}
                            size={10}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            Helper: { }
                        </Text>
                        <View>
                            <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                Tonny Cantrell
                            </Text>
                            <Text style={{ ...Fonts.blackColor13SemiBold }}>
                                (+91 1234567890)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.phoneIconWrapStyle}>
                        <MaterialIcons
                            name="phone"
                            color={Colors.whiteColor}
                            size={10}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function tripInfo() {
        return (
            <View style={{ paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding + 5.0, }}>
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
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={require('../../assets/images/icons/marker_icon2.png')}
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
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
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
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={require('../../assets/images/icons/marker_icon1.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                        <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor13SemiBold }}>
                            Stoney Creek,Calgary,Canada
                        </Text>
                    </View>
                </>
            </View>
        )
    }

    function tripAndVehicleInfoOptions({ option, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.99}
                onPress={() => setCurrentInfoIndex(index)}
                style={{ marginHorizontal: Sizes.fixPadding, }}
            >
                <Text style={currentInfoIndex == index ? { ...Fonts.blackColor12SemiBold } : { ...Fonts.grayColor12Medium }}>
                    {option}
                </Text>
                <View style={{
                    marginTop: Sizes.fixPadding - 7.0,
                    height: 2.0,
                    backgroundColor: currentInfoIndex == index ? Colors.primaryColor : 'transparent'
                }} />
            </TouchableOpacity>
        )
    }

    function backArrow() {
        return (
            <MaterialIcons
                name="arrow-back-ios"
                color={Colors.blackColor}
                size={22}
                onPress={() => navigation.pop()}
                style={{ position: 'absolute', top: 20.0, left: 20.0, }}
            />
        )
    }

    function mapView() {
        return (
            showMap && <MapView
                style={{ flex: 1, }}
                initialRegion={{
                    latitude: 22.6292757,
                    longitude: 88.444781,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
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
                        style={{ width: 50.0, height: 50.0, resizeMode: 'contain' }}
                    />
                </Marker>}
                {
                    Platform.OS =='ios'
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
}

const styles = StyleSheet.create({
    truckModelNoAndImageInfoWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0,
    },
    truckInfoWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        ...CommonStyles.shadow
    },
    phoneIconWrapStyle: {
        width: 17.0,
        height: 17.0,
        borderRadius: 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blackColor
    }
});

export default TripInfoScreen;