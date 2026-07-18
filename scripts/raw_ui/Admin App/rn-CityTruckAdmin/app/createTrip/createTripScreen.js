import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "../../components/calendar";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sup', 'Oct', 'Nov', 'Des'];

const trucksList = [
    'KUP 1598(Scania R125)',
    'GPT 1579(Tata Motors D128)',
    'HTP 1278(Force Motors D157)',
    'UOP 1258(Tata T407)',
    'TPO 1578(Scania T147)',
];

const driversList = [
    'Tonny West(+91 1234569870)',
    'Steven Goti(+91 1234569870)',
    'Madden John(+91 1234569870)',
    'Kylan Gain(+91 1234569870)',
    'Felix Gain(+91 1234569870)'
];

const fromLocationsList = [
    '930 Stoney Creek, Canada',
    '1966 Central Pkwy, Canada',
    '786 Maynard Rd, Canada',
    '1310 Harvest Moon Dr,Unionville',
];

const toLocationsList = [
    '1310 Harvest Moon Dr,Unionville',
    '786 Maynard Rd, Canada',
    '1966 Central Pkwy, Canada',
    '930 Stoney Creek, Canada',
];

const CreateTripScreen = () => {

    const navigation = useNavigation();

    const dateObj = new Date();
    const todayDate = `${monthsList[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}, ${dateObj.getUTCFullYear()}`;

    const [state, setState] = useState({
        tripTask: 'Chemical Delivery',
        load: '16.2 tonnes',
        showCalender: false,
        date: null,
        selectedTruck: trucksList[0],
        showTruckOptions: false,
        selectedDriver: driversList[0],
        showDriverOptions: false,
        selectedFromLocation: fromLocationsList[0],
        showFromLocationsOptions: false,
        selectedToLocation: toLocationsList[0],
        showToLocationsOptions: false,
        kiloMeters: '3500km',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        tripTask,
        load,
        showCalender,
        date,
        selectedTruck,
        showTruckOptions,
        selectedDriver,
        showDriverOptions,
        selectedFromLocation,
        showFromLocationsOptions,
        selectedToLocation,
        showToLocationsOptions,
        kiloMeters,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                        {createTripInfo()}
                    </ScrollView>
                </View>
            </View>
            {createTripButton()}
        </View>
    )

    function createTripButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={{ margin: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.createTripButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Create Trip
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function calender() {
        return (
           showCalender&& <Calendar
                showCalender={showCalender}
                changeDate={(date) => updateState({ date: `${monthsList[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`, showCalender: false })}
            />
        )
    }

    function createTripInfo() {
        return (
            <View style={styles.createrTripInfoWrapStyle}>
                {tripTaskInfo()}
                {divider()}
                {loadInfo()}
                {divider()}
                {dateAndTimeInfo()}
                {calender()}
                {divider()}
                {truckInfo()}
                {divider()}
                {driverInfo()}
                {divider()}
                {fromLocationInfo()}
                {divider()}
                {toLocationInfo()}
                {divider()}
                {kilometersInfo()}
                {divider()}
            </View>
        )
    }

    function kilometersInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Total Kilometers
                </Text>
                <TextInput
                    value={kiloMeters}
                    onChangeText={(value) => updateState({ kiloMeters: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function toLocationInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    To Location
                </Text>
                <Menu
                    visible={showToLocationsOptions}
                    anchor={
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showToLocationsOptions: true })}
                            style={styles.selectedOptionWrapStyle}
                        >
                            <Text style={{ flex: 1, ...Fonts.blackColor14SemiBold }}>
                                {selectedToLocation}
                            </Text>
                            <AntDesign name="caretdown" size={11} color={Colors.grayColor} />
                        </TouchableOpacity>
                    }
                    onRequestClose={() => updateState({ showToLocationsOptions: false })}
                >
                    {
                        fromLocationsList.map((item, index) => (
                            <MenuItem
                                key={`${index}`}
                                textStyle={{ ...Fonts.blackColor14SemiBold }}
                                onPress={() => updateState({ selectedToLocation: item, showToLocationsOptions: false })}
                            >
                                {item}
                            </MenuItem>
                        ))
                    }
                </Menu >
            </View>
        )
    }

    function fromLocationInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    From Location
                </Text>
                <Menu
                    visible={showFromLocationsOptions}
                    anchor={
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showFromLocationsOptions: true })}
                            style={styles.selectedOptionWrapStyle}
                        >
                            <Text style={{ flex: 1, ...Fonts.blackColor14SemiBold }}>
                                {selectedFromLocation}
                            </Text>
                            <AntDesign name="caretdown" size={11} color={Colors.grayColor} />
                        </TouchableOpacity>
                    }
                    onRequestClose={() => updateState({ showFromLocationsOptions: false })}
                >
                    {
                        fromLocationsList.map((item, index) => (
                            <MenuItem
                                key={`${index}`}
                                textStyle={{ ...Fonts.blackColor14SemiBold }}
                                onPress={() => updateState({ selectedFromLocation: item, showFromLocationsOptions: false })}
                            >
                                {item}
                            </MenuItem>
                        ))
                    }
                </Menu >
            </View>
        )
    }

    function driverInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Asign Driver
                </Text>
                <Menu
                    visible={showDriverOptions}
                    anchor={
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showDriverOptions: true })}
                            style={styles.selectedOptionWrapStyle}
                        >
                            <Text style={{ flex: 1, ...Fonts.blackColor14SemiBold }}>
                                {selectedDriver}
                            </Text>
                            <AntDesign name="caretdown" size={11} color={Colors.grayColor} />
                        </TouchableOpacity>
                    }
                    onRequestClose={() => updateState({ showDriverOptions: false })}
                >
                    {
                        driversList.map((item, index) => (
                            <MenuItem
                                key={`${index}`}
                                textStyle={{ ...Fonts.blackColor14SemiBold }}
                                onPress={() => updateState({ selectedDriver: item, showDriverOptions: false })}
                            >
                                {item}
                            </MenuItem>
                        ))
                    }
                </Menu >
            </View >
        )
    }

    function truckInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Asign Truck
                </Text>
                <Menu
                    visible={showTruckOptions}
                    anchor={
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showTruckOptions: true })}
                            style={styles.selectedOptionWrapStyle}
                        >
                            <Text style={{ flex: 1, ...Fonts.blackColor14SemiBold }}>
                                {selectedTruck}
                            </Text>
                            <AntDesign name="caretdown" size={11} color={Colors.grayColor} />
                        </TouchableOpacity>
                    }
                    onRequestClose={() => updateState({ showTruckOptions: false })}
                >
                    {
                        trucksList.map((item, index) => (
                            <MenuItem
                                key={`${index}`}
                                textStyle={{ ...Fonts.blackColor14SemiBold }}
                                onPress={() => updateState({ selectedTruck: item, showTruckOptions: false })}
                            >
                                {item}
                            </MenuItem>
                        ))
                    }
                </Menu >
            </View >
        )
    }

    function dateAndTimeInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Select Date & Time
                </Text>
                <Text
                    onPress={() => updateState({ showCalender: true })}
                    style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor14SemiBold }}
                >
                    {date ? date : todayDate} ,11:45
                </Text>
            </View>
        )
    }

    function loadInfo() {
        return (
            <View >
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Enter Load Carring(optional)
                </Text>
                <TextInput
                    value={load}
                    onChangeText={(value) => updateState({ load: value })}
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

    function tripTaskInfo() {
        return (
            <View >
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Trip Task
                </Text>
                <TextInput
                    value={tripTask}
                    onChangeText={(value) => updateState({ tripTask: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
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
                    Create Trip
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
    selectedOptionWrapStyle: {
        marginTop: Sizes.fixPadding - 8.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    createrTripInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding * 2.0,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    createTripButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
});

export default CreateTripScreen;
