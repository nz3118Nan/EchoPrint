import React, { useState, useCallback } from "react";
import { BackHandler, Image, View, TouchableOpacity, StyleSheet, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const LogoutScreen = () => {

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
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0);
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {logoutInfo()}
            </View>
            {loginBackButon()}
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView]}>
                        <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                            press back again to exit the app
                        </Text>
                    </View>
                    :
                    null
            }
        </View>
    )

    function loginBackButon() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('index')}
                style={{ margin: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.loginBackButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Login Back
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function logoutInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 5.0, marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/logOut.png')}
                    style={{ width: 95.0, height: 95.0, resizeMode: 'contain' }}
                />
                <Text style={{ marginTop: Sizes.fixPadding + 5.0, ...Fonts.blackColor17Bold }}>
                    YOU'RE LOGGED OUT NOW!
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor13Medium }}>
                    {`You're logout now. To see your account\nplease login back.`}
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
                    onPress={() => Platform.OS == 'ios' ? navigation.push('index') : backAction()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.whiteColor18SemiBold }}>
                    Logout
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
    loginBackButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
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
});

export default LogoutScreen;
