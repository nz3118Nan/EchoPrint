import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "../../components/calendar";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const AddTruckScreen = () => {

    const navigation = useNavigation();

    const dateObj = new Date();
    const todayDate = `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}/${dateObj.getUTCFullYear()}`;

    const [state, setState] = useState({
        truckModel: 'Scania E145',
        plateNumber: 'FTU 1456',
        showCalender: false,
        insuredDate: null,
        loadCapacity: '16.2 Tonnes',
        year: '2019',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        truckModel,
        plateNumber,
        showCalender,
        insuredDate,
        loadCapacity,
        year,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                        {addTruckInfo()}
                    </ScrollView>
                </View>
            </View>
            {saveButton()}
        </View>
    )

    function saveButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={{ margin: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.saveButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Save
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function calender() {
        return (
            <Calendar
                showCalender={showCalender}
                changeDate={(date) => updateState({ insuredDate: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`, showCalender: false })}
            />
        )
    }

    function addTruckInfo() {
        return (
            <View style={styles.addTruckInfoWrapStyle}>
                {truckModelInfo()}
                {divider()}
                {plateNumberInfo()}
                {divider()}
                {loadCapacityInfo()}
                {divider()}
                {yearInfo()}
                {divider()}
                {insuredDateInfo()}
                {calender()}
                {divider()}
            </View>
        )
    }

    function yearInfo() {
        return (
            <View >
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Year
                </Text>
                <TextInput
                    value={year}
                    onChangeText={(value) => updateState({ year: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                    numberOfLines={1}
                />
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

    function plateNumberInfo() {
        return (
            <View >
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Plate Number
                </Text>
                <TextInput
                    value={plateNumber}
                    onChangeText={(value) => updateState({ plateNumber: value })}
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
                    Truck Model
                </Text>
                <TextInput
                    value={truckModel}
                    onChangeText={(value) => updateState({ truckModel: value })}
                    style={{padding:0, height: 20.0, ...Fonts.blackColor14Medium }}
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
                    Add Truck
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
    addTruckInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 3.0,
        padding: Sizes.fixPadding * 2.0,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    saveButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
});

export default AddTruckScreen;
