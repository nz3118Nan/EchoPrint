import React from "react";
import { View, ScrollView, TouchableOpacity, Image, ImageBackground, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const TrackTruckScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/map_bg1.png')}
                style={{ flex: 1 }}
            >
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {truckInfo()}
                        {summaryInfo()}
                        {trackButton()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function trackButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('track/trackScreen')}
                style={styles.trackButtonWrapStyle}
            >
                <MaterialIcons name="location-on" size={22} color={Colors.primaryColor} />
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor17SemiBold }}>
                    Track
                </Text>
            </TouchableOpacity>
        )
    }

    function summaryInfo() {
        return (
            <View>
                <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor15SemiBold }}>
                    Summary
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.summaryInfoWrapStyle}>
                        <Image
                            source={require('../../assets/images/icons/distance_icon.png')}
                            style={{ width: '100%', resizeMode: 'contain', height: 45 }}
                        />
                        <Text style={{ marginVertical: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor12SemiBold }}>
                            Total Distance
                        </Text>
                        <Text style={{ ...Fonts.blackColor17SemiBold }}>
                            250 Kms
                        </Text>
                    </View>
                    <View style={styles.summaryInfoWrapStyle}>
                        <MaterialCommunityIcons name="truck" size={45} color={Colors.primaryColor} />
                        <Text style={{ marginVertical: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor12SemiBold }}>
                            Total Running
                        </Text>
                        <Text style={{ ...Fonts.blackColor17SemiBold }}>
                            1h :20m
                        </Text>
                    </View>
                    <View style={styles.summaryInfoWrapStyle}>
                        <Image
                            source={require('../../assets/images/icons/parking_icon.png')}
                            style={{ width: '100%', resizeMode: 'contain', height: 45 }}
                        />
                        <Text style={{ marginVertical: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor12SemiBold }}>
                            Total Parked
                        </Text>
                        <Text style={{ ...Fonts.blackColor17SemiBold }}>
                            1h :11m
                        </Text>
                    </View>
                </View>
            </View >
        )
    }

    function truckInfo() {
        return (
            <View style={styles.truckInfoWrapStyle}>
                <Image
                    source={require('../../assets/images/trucks/truck12.png')}
                    style={{ width: 100.0, height: 100.0, borderRadius: Sizes.fixPadding - 5.0, }}
                />
                <View style={{ marginLeft: Sizes.fixPadding, flex: 1, }}>
                    <Text style={{ ...Fonts.blackColor15SemiBold }}>
                        Currently Parked
                    </Text>
                    <Text style={{ marginVertical: Sizes.fixPadding - 8.0, }}>
                        <Text style={{ ...Fonts.grayColor13Medium }}>
                            Since: { }
                        </Text>
                        <Text style={{ ...Fonts.blackColor13Medium }}>
                            1h : 11min
                        </Text>
                    </Text>
                    <Text numberOfLines={1}>
                        <Text style={{ ...Fonts.grayColor13Medium }}>
                            Location: { }
                        </Text>
                        <Text style={{ ...Fonts.blackColor13Medium }}>
                            786 Maynard Rd, Canada
                        </Text>
                    </Text>
                </View>
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
                    Track Your Truck
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
    summaryInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        flex: 1,
        alignItems: 'center',
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    truckInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    trackButtonWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 3.0,
        paddingVertical: Sizes.fixPadding + 2.0,
    }
});

export default TrackTruckScreen;
