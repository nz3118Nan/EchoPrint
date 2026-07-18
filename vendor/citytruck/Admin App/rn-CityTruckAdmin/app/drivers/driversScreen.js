import React from "react";
import { View, TouchableOpacity, FlatList, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const driversList = [
    {
        id: '1',
        driverImage: require('../../assets/images/users/user2.png'),
        driverName: 'Steven Goti',
        mobileNumber: '(+91) 1234567890',
        rating: 5.0,
    },
    {
        id: '2',
        driverImage: require('../../assets/images/users/user3.png'),
        driverName: 'Madden John',
        mobileNumber: '(+91) 1234567890',
        rating: 3.0,
    },
    {
        id: '3',
        driverImage: require('../../assets/images/users/user4.png'),
        driverName: 'Kylan Gain',
        mobileNumber: '(+91) 1234567890',
        rating: 2.0,
    },
    {
        id: '4',
        driverImage: require('../../assets/images/users/user5.png'),
        driverName: 'Felix Gain',
        mobileNumber: '(+91) 1234567890',
        rating: 4.0,
    },
    {
        id: '5',
        driverImage: require('../../assets/images/users/user6.png'),
        driverName: 'Payton Goti',
        mobileNumber: '(+91) 1234567890',
        rating: 1.0,
    }
];

const DriversScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {drivers()}
            </View>
            {addDriverButton()}
        </View>
    )

    function addDriverButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('addDriver/addDriverScreen')}
                style={{ position: 'absolute', bottom: 20.0, left: 20.0, right: 20.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.addDriverButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Add Driver
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function drivers() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('driverInfo/driverInfoScreen')}
                style={styles.driverInfoWrapStyle}
            >
                <Image
                    source={item.driverImage}
                    style={{ width: 85.0, height: 85.0, borderRadius: Sizes.fixPadding - 5.0, }}
                />
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 10.0 }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.driverName}
                    </Text>
                    <View style={{ marginVertical: Sizes.fixPadding - 8.0, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ minWidth: 85.0, ...Fonts.grayColor13Medium }}>
                            M.number:
                        </Text>
                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                            {item.mobileNumber}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ minWidth: 85.0, ...Fonts.grayColor13Medium }}>
                            Rating
                        </Text>
                        {showRating({ number: item.rating })}
                    </View>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={driversList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, paddingBottom: Sizes.fixPadding * 7.0, }}
            />
        )
    }

    function showRating({ number }) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                    (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0 || number == 1.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={Colors.yellowColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={'#E8E8E8'}
                        />
                }
                {
                    (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={Colors.yellowColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={'#E8E8E8'}
                        />
                }
                {
                    (number == 5.0 || number == 4.0 || number == 3.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={Colors.yellowColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={'#E8E8E8'}
                        />
                }
                {
                    (number == 5.0 || number == 4.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={Colors.yellowColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={'#E8E8E8'}
                        />
                }
                {
                    (number == 5.0) ?
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={Colors.yellowColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={18}
                            color={'#E8E8E8'}
                        />
                }
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
                    My Driver
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
    addDriverButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    driverInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    }
});

export default DriversScreen;
