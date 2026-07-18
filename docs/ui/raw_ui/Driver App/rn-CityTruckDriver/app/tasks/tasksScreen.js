import React from "react";
import { View, ScrollView, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const tasksList = [
    {
        id: '1',
        truckImage: require('../../assets/images/trucks/truck1.png'),
        truckNumber: 'KUP 1598',
        truckModel: 'Scania R125',
        locationCity: 'Calgary',
        cityDistance: '121km',
        task: 'Chemical Delivery',
        departedDate: '20 Mar',
        departedTime: '02:30pm',
        location: '786 Maynard Rd,Calgary,Canada',
    },
    {
        id: '2',
        truckImage: require('../../assets/images/trucks/truck2.png'),
        truckNumber: 'GPT 1579',
        truckModel: 'Tata Motors D128',
        locationCity: 'Grayson',
        cityDistance: '171km',
        task: 'Machinery Delivery',
        departedDate: '22 Mar',
        departedTime: '03:00pm',
        location: '930 Stoney Creek,Grayson,Canada',
    },
    {
        id: '3',
        truckImage: require('../../assets/images/trucks/truck3.png'),
        truckNumber: 'HTP 1278',
        truckModel: 'Force Motors T157',
        locationCity: 'Ontario',
        cityDistance: '217km',
        task: 'Chemical Delivery',
        departedDate: '25 Mar',
        departedTime: '04:00pm',
        location: '1310 Harvest Moon DragEvent,Unionville',
    },
];

const TasksScreen = () => {

    const navigation = useNavigation();
    
    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    {tasks()}
                </View>
            </View>
        </View>
    )

    function tasks() {
        return (
            <ScrollView
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
            >
                {tasksList.map((item) => (
                    <View
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
                                    <Text style={{ ...Fonts.grayColor12Medium }}>
                                        {item.truckModel}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ ...Fonts.redColor14Bold }}>
                                {item.locationCity}({item.cityDistance})
                            </Text>
                        </View>
                        <View style={{ padding: Sizes.fixPadding, }}>
                            <>
                                <Text style={{ ...Fonts.grayColor12Medium }}>
                                    Task
                                </Text>
                                <Text style={{ ...Fonts.blackColor12SemiBold }}>
                                    {item.task}
                                </Text>
                            </>
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
                                source={require('../../assets/images/flag.png')}
                                style={{ alignSelf: 'flex-end', width: 28.0, height: 28.0, resizeMode: 'contain' }}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
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
                    My Tasks List
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
    truckModelNoAndImageInfoWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        padding: Sizes.fixPadding - 5.0,
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
});

export default TasksScreen;
