import React, { useState, useCallback } from "react";
import { BackHandler, View, StatusBar, TouchableOpacity, StyleSheet, Text, ImageBackground, Platform } from "react-native";
import { Colors, Fonts, Sizes, } from "../constants/styles";
import { CircleFade } from 'react-native-animated-spinkit';
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const WelcomeScreen = () => {

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
        updateState({ backClickCount: 1 });
        setTimeout(() => {
            updateState({ backClickCount: 0 })
        }, 1000)
    }

    const [state, setState] = useState({
        showLoading: false,
        backClickCount: 0,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        showLoading,
        backClickCount
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />
            <ImageBackground
                source={require('../assets/images/bg.png')}
                style={{ flex: 1, }}
            >
                <View style={styles.pageWrapStyle}>
                    <Text style={{ textAlign: 'center', ...Fonts.whiteColor30BoldItalic }}>
                        CITY TRUCK
                    </Text>
                    {welcomeInfo()}
                </View>
            </ImageBackground>
            {
                backClickCount == 1
                    ?
                    <View style={styles.animatedView}>
                        <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                            Press Back Once Again to Exit
                        </Text>
                    </View>
                    :
                    null
            }
        </View>
    )

    function welcomeInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                {welcomeDivider()}
                <Text style={styles.welcomeDescriptionTextStyle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulllam
                </Text>
                {signinButton()}
                {signupButton()}
                {
                    showLoading
                        ?
                        <CircleFade
                            size={50}
                            color={Colors.whiteColor}
                            style={styles.loaderStyle}
                        />
                        :
                        null
                }
            </View>
        )
    }

    function welcomeDivider() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View style={{ backgroundColor: Colors.whiteColor, height: 1.0, flex: 1, }} />
                <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.whiteColor24Bold }}>
                    Welcome
                </Text>
                <View style={{ backgroundColor: Colors.whiteColor, height: 1.0, flex: 1, }} />
            </View>
        )
    }

    function signupButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    updateState({ showLoading: true })
                    setTimeout(() => {
                        updateState({ showLoading: false })
                        navigation.push('auth/signupScreen')
                    }, 1000);
                }}
                style={styles.signinSignupButtonStyle}
            >
                <Text style={{ ...Fonts.primaryColor18Bold }}>
                    Sign Up
                </Text>
            </TouchableOpacity>
        )
    }

    function signinButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    updateState({ showLoading: true })
                    setTimeout(() => {
                        updateState({ showLoading: false })
                        navigation.push('auth/signinScreen')
                    }, 1000);
                }}
                style={styles.signinSignupButtonStyle}
            >
                <Text style={{ ...Fonts.primaryColor18Bold }}>
                    Sign In
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
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
    pageWrapStyle: {
        flex: 1,
        backgroundColor: 'rgba(201, 31, 85, 0.4)',
        paddingTop: Platform.OS == 'ios' ? Sizes.fixPadding * 8.0 : StatusBar.currentHeight + Sizes.fixPadding * 3.0,
        paddingBottom: Sizes.fixPadding * 10.0,
        justifyContent: 'space-between'
    },
    welcomeDescriptionTextStyle: {
        marginBottom: Sizes.fixPadding * 3.0,
        marginTop: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 4.0,
        textAlign: 'center',
        ...Fonts.whiteColor12Regular
    },
    signinSignupButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
    },
    loaderStyle: {
        position: 'absolute',
        marginTop: Sizes.fixPadding,
        alignSelf: 'center',
        bottom: -70.0,
    }
});

export default WelcomeScreen;