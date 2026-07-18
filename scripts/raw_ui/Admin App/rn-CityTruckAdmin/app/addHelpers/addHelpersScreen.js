import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const AddHelpersScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        name: 'Caron Turrelln',
        mobileNumber: '(+91) 1234567890',
        email: 'caronturrell@gmail.com',
        address: '786 Maynard Rd,Calgary,Canada',
        totalYearAsHelper: '2 Years',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        name,
        mobileNumber,
        email,
        address,
        totalYearAsHelper,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                        {addHelperInfo()}
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

    function addHelperInfo() {
        return (
            <View style={styles.addHelperInfoWrapStyle}>
                {nameInfo()}
                {divider()}
                {mobileNumberInfo()}
                {divider()}
                {emailInfo()}
                {divider()}
                {addressInfo()}
                {divider()}
                {totalYearAsHelperInfo()}
                {divider()}
            </View>
        )
    }

    function totalYearAsHelperInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Total Years as a Helper
                </Text>
                <TextInput
                    value={totalYearAsHelper}
                    onChangeText={(value) => updateState({ totalYearAsHelper: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function addressInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Address
                </Text>
                <TextInput
                    value={address}
                    onChangeText={(value) => updateState({ address: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    numberOfLines={1}
                />
            </View>
        )
    }

    function emailInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Email Address
                </Text>
                <TextInput
                    value={email}
                    onChangeText={(value) => updateState({ email: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    keyboardType="email-address"
                    numberOfLines={1}
                />
            </View>
        )
    }

    function mobileNumberInfo() {
        return (
            <View >
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Mobile Number
                </Text>
                <TextInput
                    value={mobileNumber}
                    onChangeText={(value) => updateState({ mobileNumber: value })}
                    style={{ padding: 0, height: 20.0, ...Fonts.blackColor14Medium }}
                    selectionColor={Colors.primaryColor}
                    keyboardType="phone-pad"
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

    function nameInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Name
                </Text>
                <TextInput
                    value={name}
                    onChangeText={(value) => updateState({ name: value })}
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
                    Add Helpers
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
    addHelperInfoWrapStyle: {
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

export default AddHelpersScreen;