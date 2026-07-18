import React, { useState } from "react";
import { Dimensions, ScrollView, View, TextInput, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get('window');

const helpersList = [
    {
        id: '1',
        helperImage: require('../../assets/images/users/user8.png'),
        helperName: 'Caron Turrell',
        helperMoNumber: '(+91) 1234567890',
    },
    {
        id: '2',
        helperImage: require('../../assets/images/users/user8.png'),
        helperName: 'Ling Ellingsworth',
        helperMoNumber: '(+91) 1234567890',
    },
    {
        id: '3',
        helperImage: require('../../assets/images/users/user8.png'),
        helperName: 'Angelic Achorn',
        helperMoNumber: '(+91) 1234567890',
    },
    {
        id: '4',
        helperImage: require('../../assets/images/users/user8.png'),
        helperName: 'Tiara Pressly',
        helperMoNumber: '(+91) 1234567890',
    }
];

const DriverInfoScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        currentTabIndex: 0,
        totalTrip: '50+',
        drivingExperience: '5-6 years',
        totalCompletedTask: '40',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        currentTabIndex,
        totalTrip,
        drivingExperience,
        totalCompletedTask,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {driverImageWithName()}
                    {driverAndHelpersInfoTab()}
                    <View style={styles.truckAndDriverInfoWrapStyle}>
                        {
                            currentTabIndex == 0
                                ?
                                driverHistoryInfo()
                                :
                                helpersInfo()
                        }
                    </View>
                    {
                        currentTabIndex == 0
                            ?
                            updateDriverInfoButton()
                            :
                            addHelpersButton()
                    }
                </ScrollView>
            </View>
        </View >
    )

    function updateDriverInfoButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={{ marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}
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

    function addHelpersButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('addHelpers/addHelpersScreen')}
                style={{ marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.updateInfoButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Add Helpers
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function helpersInfo() {
        return (
            <View>
                {
                    helpersList.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={item.helperImage}
                                    style={{ width: 40.0, height: 40.0, borderRadius: 25.0, }}
                                />
                                <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ minWidth: 85, ...Fonts.grayColor13Medium }}>
                                            Name:
                                        </Text>
                                        <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
                                            {item.helperName}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: Sizes.fixPadding - 7.0, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ minWidth: 85, ...Fonts.grayColor13Medium }}>
                                            M. number:
                                        </Text>
                                        <Text style={{ ...Fonts.blackColor14SemiBold }}>
                                            {item.helperMoNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {divider()}
                        </View>
                    ))
                }
                <Text style={{ textAlign: 'right', ...Fonts.primaryColor10SemiBold }}>
                    View All
                </Text>
            </View>
        )
    }

    function driverHistoryInfo() {
        return (
            <View>
                {totalTripInfo()}
                {divider()}
                {drivingExperienceInfo()}
                {divider()}
                {totalCompletedTaskInfo()}
                {divider()}
            </View>
        )
    }

    function totalCompletedTaskInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Total Completed Tasks
                </Text>
                <TextInput
                    value={totalCompletedTask}
                    onChangeText={(value) => updateState({ totalCompletedTask: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    keyboardType="number-pad"
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

    function divider() {
        return (
            <View
                style={{ height: 1.0, backgroundColor: Colors.lightGrayColor, marginVertical: Sizes.fixPadding }}
            />
        )
    }

    function totalTripInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Total Trip
                </Text>
                <TextInput
                    value={totalTrip}
                    onChangeText={(value) => updateState({ totalTrip: value })}
                    style={{padding:0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function driverAndHelpersInfoTab() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {tabBarOptionSort({ option: 'Driver Trip History', index: 0 })}
                {tabBarOptionSort({ option: 'Helpers', index: 1 })}
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

                <View style={{
                    marginTop: Sizes.fixPadding - 5.0,
                    backgroundColor: currentTabIndex == index ? Colors.primaryColor : 'transparent', height: 1.5,
                }} />

            </TouchableOpacity>
        )
    }

    function driverImageWithName() {
        return (
            <View style={{ alignItems: 'center', margin: Sizes.fixPadding * 2.0, }}>
                <Image
                    source={require('../../assets/images/users/user7.png')}
                    style={{ width: width * 0.35, height: height * 0.18, borderRadius: Sizes.fixPadding - 5.0, }}
                />
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                    Kylan Gain
                </Text >
            </View >
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
                    Driver Info
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

export default DriverInfoScreen;
