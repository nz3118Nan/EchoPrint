import React, { useState, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity, BackHandler, StyleSheet, Image, ImageBackground } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../../constants/styles";
import { MaterialIcons, } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../../components/myStatusBar";
import { useNavigation } from "expo-router";

const trucksList = [
    {
        id: '1',
        truckImage: require('../../../assets/images/trucks/truck1.png'),
        truckNumber: 'KUP 1598',
        truckModel: 'Scania R125',
        locationCity: 'Calgary',
        cityDistance: '121km',
        task: 'Chemical Delivery',
        destinationTotalTask: 1,
        departedDate: '20 Mar',
        departedTime: '02:30pm',
        location: '786 Maynard Rd,Calgary,Canada',
    },
    {
        id: '2',
        truckImage: require('../../../assets/images/trucks/truck2.png'),
        truckNumber: 'GPT 1579',
        truckModel: 'Tata Motors D128',
        locationCity: 'Grayson',
        cityDistance: '171km',
        task: 'Machinery Delivery',
        destinationTotalTask: 2,
        departedDate: '22 Mar',
        departedTime: '03:00pm',
        location: '930 Stoney Creek,Grayson,Canada',
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
        setbackClickCount(1);
        setTimeout(() => {
            setbackClickCount(0);
        }, 1000)
    }

    const [backClickCount, setbackClickCount] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../../assets/images/map_bg1.png')}
                    style={{ flex: 1, }}
                >
                    {header()}
                    <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                        {trucksInfo()}
                        {viewUpcomingTaskBotton()}
                    </View>
                </ImageBackground>
            </View>
            {
                backClickCount == 1
                    ?
                    <View style={styles.animatedView}>
                        <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                            press back again to exit the app
                        </Text>
                    </View>
                    :
                    null
            }
        </View>
    )

    function viewUpcomingTaskBotton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('upcomingTasks/upcomingTasksScreen')}
                style={{ position: 'absolute', bottom: 40.0, right: 20.0, left: 20.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.viewUpcomingTaskButtonWrapStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        View Upcoming Tasks
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function trucksInfo() {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 18.0, }}>
                {trucksList.map((item) => (
                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => navigation.push('truckInfo/truckInfoScreen', { item: JSON.stringify(item) })}
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
                                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                                        {item.truckModel}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ ...Fonts.redColor14Bold }}>
                                {item.locationCity}({item.cityDistance})
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
                                    style={styles.destinationTotalTaskWrapStyle}>
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

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="menu"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                        Today's Tasks
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding * 5.0,
        borderBottomRightRadius: Sizes.fixPadding * 5.0,
        paddingBottom: Sizes.fixPadding * 6.0,
        paddingTop: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
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
    viewUpcomingTaskButtonWrapStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
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
    },
    destinationTotalTaskWrapStyle: {
        backgroundColor: Colors.primaryColor,
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeScreen;