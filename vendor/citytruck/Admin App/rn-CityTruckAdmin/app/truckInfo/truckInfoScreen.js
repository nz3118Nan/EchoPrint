import React, { useState } from "react";
import { ScrollView, Dimensions, View, TextInput, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "../../components/calendar";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get('window');

const TruckInfoScreen = () => {

    const navigation = useNavigation();

    const dateObj = new Date();
    const todayDate = `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}/${dateObj.getUTCFullYear()}`;

    const [state, setState] = useState({
        currentTabIndex: 0,
        truckModel: 'Force Motors D128',
        currentStatus: 'In Transist',
        truckNumber: 'KTP 1478',
        loadCapacity: '16.2 Tonnes',
        insuredDate: null,
        showCalender: false,
        driverName: 'Thomas Crane',
        drivingExperience: '5-6 years',
        noOfTrip: '50+',
        phoneNumber: '(+91)1234567890'
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        currentTabIndex,
        truckModel,
        currentStatus,
        truckNumber,
        loadCapacity,
        insuredDate,
        showCalender,
        driverName,
        drivingExperience,
        noOfTrip,
        phoneNumber,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {truckImageWithModel()}
                    {truckAndDriverInfoTab()}
                    <View style={styles.truckAndDriverInfoWrapStyle}>
                        {
                            currentTabIndex == 0
                                ?
                                truckInfo()
                                :
                                driverInfo()
                        }
                    </View>
                </ScrollView>
                {
                    currentTabIndex == 0
                        ?
                        updateTruckInfoButton()
                        :
                        updateDriverInfoButton()
                }
            </View>
        </View>
    )

    function updateTruckInfoButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={{ marginVertical: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.updateInfoButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Update Truck Info
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function updateDriverInfoButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={{ marginVertical: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.updateInfoButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Update Driver Info
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function calender() {
        return (
            showCalender && <Calendar
                showCalender={showCalender}
                changeDate={(date) => updateState({ insuredDate: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`, showCalender: false })}
            />
        )
    }

    function driverInfo() {
        return (
            <View>
                {driverNameInfo()}
                {divider()}
                {drivingExperienceInfo()}
                {divider()}
                {numberOfTripsInfo()}
                {divider()}
                {phoneNumberInfo()}
                {divider()}
            </View>
        )
    }

    function phoneNumberInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Phone Number
                </Text>
                <TextInput
                    value={phoneNumber}
                    onChangeText={(value) => updateState({ phoneNumber: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    keyboardType="phone-pad"
                    numberOfLines={1}
                />
            </View>
        )
    }

    function numberOfTripsInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Number of Trips
                </Text>
                <TextInput
                    value={noOfTrip}
                    onChangeText={(value) => updateState({ noOfTrip: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function drivingExperienceInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Driving Experience
                </Text>
                <TextInput
                    value={drivingExperience}
                    onChangeText={(value) => updateState({ drivingExperience: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function driverNameInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Driver Name
                </Text>
                <TextInput
                    value={driverName}
                    onChangeText={(value) => updateState({ driverName: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function truckInfo() {
        return (
            <View>
                {truckModelInfo()}
                {divider()}
                {currentStatusInfo()}
                {divider()}
                {truckNumberInfo()}
                {divider()}
                {loadCapacityInfo()}
                {divider()}
                {insuredDateInfo()}
                {calender()}
                {divider()}
            </View>
        )
    }

    function insuredDateInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Insured. Due Date
                </Text>
                <Text
                    onPress={() => updateState({ showCalender: true })}
                    style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor14SemiBold }}
                >
                    {insuredDate ? insuredDate : todayDate}
                </Text>
            </View>
        )
    }

    function loadCapacityInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Max. Load Capacity
                </Text>
                <TextInput
                    value={loadCapacity}
                    onChangeText={(value) => updateState({ loadCapacity: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function truckNumberInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Truck Number
                </Text>
                <TextInput
                    value={truckNumber}
                    onChangeText={(value) => updateState({ truckNumber: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function currentStatusInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Current Status
                </Text>
                <TextInput
                    value={currentStatus}
                    onChangeText={(value) => updateState({ currentStatus: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function divider() {
        return (
            <View
                style={{ height: 1.0, backgroundColor: Colors.lightGrayColor, marginVertical: Sizes.fixPadding }}
            />
        )
    }

    function truckModelInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Model
                </Text>
                <TextInput
                    value={truckModel}
                    onChangeText={(value) => updateState({ truckModel: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function truckAndDriverInfoTab() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {tabBarOptionSort({ option: 'Truck Info', index: 0 })}
                {tabBarOptionSort({ option: 'About Driver', index: 1 })}
            </View>
        )
    }

    function tabBarOptionSort({ option, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ currentTabIndex: index })}
                style={{ marginHorizontal: Sizes.fixPadding, }}
            >
                <Text style={currentTabIndex == index ? { ...Fonts.blackColor14SemiBold } : { ...Fonts.grayColor14SemiBold }}>
                    {option}
                </Text>
                <View
                    style={{
                        marginTop: Sizes.fixPadding - 5.0,
                        backgroundColor: currentTabIndex == index ? Colors.primaryColor : 'transparent', height: 1.5,
                    }}
                />
            </TouchableOpacity>
        )
    }

    function truckImageWithModel() {
        return (
            <View style={{ alignItems: 'center', margin: Sizes.fixPadding * 2.0, }}>
                <Image
                    source={require('../../assets/images/trucks/truck3.png')}
                    style={{ width: width * 0.35, height: height * 0.18, borderRadius: Sizes.fixPadding - 5.0, }}
                />
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                    Force Motors D128
                </Text>
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
                    Truck Info
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={styles.deleteIconWrapStyle}
                >
                    <MaterialIcons
                        name="delete"
                        color={Colors.whiteColor}
                        size={20}
                    />
                </TouchableOpacity>
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
    deleteIconWrapStyle: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        width: 30.0,
        height: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        position: 'absolute',
        bottom: 20.0,
        right: 40.0,
    },
    updateInfoButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    truckAndDriverInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    }
});

export default TruckInfoScreen;
