import React from "react";
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const trucksList = [
    {
        id: '1',
        truckImage: require('../../assets/images/trucks/truck1.png'),
        truckModel: 'Kenworth T800',
        truckNumber: 'KYP 1578',
        year: 2015,
    },
    {
        id: '2',
        truckImage: require('../../assets/images/trucks/truck2.png'),
        truckModel: 'Tata Motors D128',
        truckNumber: 'GRP 1567',
        year: 2014,
    },
    {
        id: '3',
        truckImage: require('../../assets/images/trucks/truck3.png'),
        truckModel: 'Force Motors D128',
        truckNumber: 'KTP 1478',
        year: 2014,
    },
    {
        id: '4',
        truckImage: require('../../assets/images/trucks/truck4.png'),
        truckModel: 'Tata Motors R157',
        truckNumber: 'RTP 1436',
        year: 2018,
    },
    {
        id: '5',
        truckImage: require('../../assets/images/trucks/truck5.png'),
        truckModel: 'Scania T148',
        truckNumber: 'TAS 1456',
        year: 2018,
    },
];

const TrucksScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {trucks()}
            </View>
            {addTruckButton()}
        </View>
    )

    function addTruckButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('addTruck/addTruckScreen')}
                style={{ position: 'absolute', bottom: 20.0, left: 20.0, right: 20.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.addTruckButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Add Truck
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function trucks() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('truckInfo/truckInfoScreen')}
                style={styles.truckInfoWrapStyle}
            >
                <Image
                    source={item.truckImage}
                    style={{ width: 85.0, height: 85.0, borderRadius: Sizes.fixPadding - 5.0, }}
                />
                <View style={{ marginLeft: Sizes.fixPadding + 10.0, flex: 1, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.truckModel}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: Sizes.fixPadding - 8.0, }}>
                        <Text numberOfLines={1} style={{ minWidth: 60.0, ...Fonts.grayColor12Medium }}>
                            Number:
                        </Text>
                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                            {item.truckNumber}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                            Year:  { }
                        </Text>
                        <Text style={{ ...Fonts.blackColor13SemiBold }}>
                            {item.year}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={trucksList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0, paddingTop: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
            />
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
                    My Trucks
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
    addTruckButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    truckInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default TrucksScreen;