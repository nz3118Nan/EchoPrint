import React, { useState, useEffect } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from "react-native-maps";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const TruckTripScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        startLocation: '786 Maynard Rd,Calgary,Canada',
        endLocation: 'Stoney Creek,Calgary,Canada'
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        startLocation,
        endLocation,
    } = state;

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 1000);
        return () => { clearTimeout(timer) }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {mapView()}
                {headerWithLocationInfo()}
            </View>
            {continueButton()}
        </View>
    )

    function mapView() {
        return (
            showMap && <MapView
                style={{ flex: 1, }}
                initialRegion={{
                    latitude: 22.6292757,
                    longitude: 88.444781,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                loadingEnabled
                loadingIndicatorColor={Colors.primaryColor}
            >
                {showMap && <Marker
                    coordinate={{
                        latitude: 22.6281662,
                        longitude: 88.4410113,
                    }}
                >
                    <Image
                        source={require('../../assets/images/icons/marker_icon3.png')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </Marker>}
            </MapView>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.99}
                onPress={() => navigation.push('createTrip/createTripScreen')}
                style={styles.continueButtonWrapStyle}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.continueButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Continue
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function locationInfo() {
        return (
            <View style={styles.locationInfoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/icons/marker_icon2.png')}
                        style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                    />
                    <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                        <Text style={{ ...Fonts.grayColor12Regular }}>
                            Start Location
                        </Text>
                        <TextInput
                            value={startLocation}
                            onChangeText={(value) => updateState({ startLocation: value })}
                            style={{ padding: 0, height: 22.0, ...Fonts.blackColor14SemiBold }}
                            cursorColor={Colors.primaryColor}
                            selectionColor={Colors.primaryColor}
                            numberOfLines={1}
                        />
                    </View>
                </View>
                <View style={{ width: 12.0, alignItems: 'center' }}>
                    <View style={styles.startToEndLocationIndicatorStyle} />
                    <View style={styles.startToEndLocationIndicatorStyle} />
                    <View style={styles.startToEndLocationIndicatorStyle} />
                    <View style={styles.startToEndLocationIndicatorStyle} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/icons/marker_icon1.png')}
                        style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                    />
                    <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                        <Text style={{ ...Fonts.grayColor12Regular }}>
                            Trip End Location
                        </Text>
                        <TextInput
                            value={endLocation}
                            onChangeText={(value) => updateState({ endLocation: value })}
                            style={{ padding: 0, height: 22.0, ...Fonts.blackColor14SemiBold }}
                            cursorColor={Colors.primaryColor}
                            selectionColor={Colors.primaryColor}
                            numberOfLines={1}
                        />
                    </View>
                </View>
            </View >
        )
    }

    function headerWithLocationInfo() {
        return (
            <View style={{ position: 'absolute', top: 0.0, left: 0.0, right: 0.0, }}>
                {header()}
                {locationInfo()}
            </View>
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
                    Truck Trip
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 6.0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding * 5.0,
        borderBottomRightRadius: Sizes.fixPadding * 5.0,
    },
    continueButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    startToEndLocationIndicatorStyle: {
        marginVertical: Sizes.fixPadding - 8.0,
        backgroundColor: Colors.grayColor,
        width: 4.0,
        height: 4.0,
        borderRadius: 3.4,
    },
    locationInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        elevation: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding,
        marginTop: -Sizes.fixPadding * 4.0,
        ...CommonStyles.shadow
    },
    continueButtonWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
    }
});

export default TruckTripScreen;