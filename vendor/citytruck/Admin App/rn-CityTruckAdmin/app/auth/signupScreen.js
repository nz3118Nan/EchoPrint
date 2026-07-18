import React, { useState, createRef } from "react";
import { TextInput, View, Dimensions, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        name: null,
        email: null,
        mobileNumber: null,
        password: null,
        passwordSecure: true,
        confirmPassword: null,
        confirmPasswordSecure: true,
        backClickCount: 0,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        name,
        email,
        mobileNumber,
        password,
        passwordSecure,
        confirmPassword,
        confirmPasswordSecure,
        backClickCount,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
            <View style={{ flex: 1 }}>
                {topImage()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {signupInfo()}
                    {nameTextField()}
                    {emailTextField()}
                    {mobileNumberTextField()}
                    {passwordTextField()}
                    {confirmPasswordTextField()}
                    {signupButton()}
                    {alreadyAccountInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function alreadyAccountInfo() {
        return (
            <View style={styles.alreadyAccountInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor13SemiBold }}>
                    Already have an account?
                </Text>
                <Text
                    onPress={() => navigation.push('auth/signinScreen')}
                    style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.primaryColor13Bold }}
                >
                    Sign in!
                </Text>
            </View>
        )
    }

    function signupButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('auth/verificationScreen')}
                style={{ marginBottom: Sizes.fixPadding + 5.0, marginTop: Sizes.fixPadding * 3.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A']}
                    style={styles.signupButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Sign Up
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function confirmPasswordTextField() {
        const input = createRef();
        return (
            <View style={{ ...styles.textFieldWrapStyle }}>
                <MaterialIcons
                    name="lock-open"
                    color={Colors.blackColor}
                    size={16}
                    onPress={() => { input.current.focus() }}
                />
                <TextInput
                    ref={input}
                    value={confirmPassword}
                    onChangeText={(text) => updateState({ confirmPassword: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Confirm Password'
                    placeholderTextColor={Colors.blackColor}
                    secureTextEntry={confirmPasswordSecure}
                    textContentType="oneTimeCode"
                    style={{ ...Fonts.blackColor13Medium, marginHorizontal: Sizes.fixPadding - 2.0, flex: 1 }}
                />
                <MaterialCommunityIcons
                    name={confirmPasswordSecure ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    color={Colors.blackColor}
                    onPress={() => { updateState({ confirmPasswordSecure: !confirmPasswordSecure }) }}
                />
            </View>
        )
    }

    function passwordTextField() {
        const input = createRef();
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 2.0, ...styles.textFieldWrapStyle }}>
                <MaterialIcons
                    name="lock-open"
                    color={Colors.blackColor}
                    size={16}
                    onPress={() => { input.current.focus() }}
                />
                <TextInput
                    ref={input}
                    value={password}
                    onChangeText={(text) => updateState({ password: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Password'
                    placeholderTextColor={Colors.blackColor}
                    secureTextEntry={passwordSecure}
                    textContentType="oneTimeCode"
                    style={{ ...Fonts.blackColor13Medium, marginHorizontal: Sizes.fixPadding - 2.0, flex: 1 }}
                />
                <MaterialCommunityIcons
                    name={passwordSecure ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    color={Colors.blackColor}
                    onPress={() => { updateState({ passwordSecure: !passwordSecure }) }}
                />
            </View>
        )
    }

    function mobileNumberTextField() {
        const input = createRef();
        return (
            <View style={{
                marginBottom: Sizes.fixPadding * 2.0,
                ...styles.textFieldWrapStyle,
            }}>
                <MaterialIcons
                    name="phone-android"
                    color={Colors.blackColor}
                    size={16}
                    onPress={() => { input.current.focus() }}
                />
                <TextInput
                    ref={input}
                    value={mobileNumber}
                    onChangeText={(text) => updateState({ mobileNumber: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Mobile Number'
                    placeholderTextColor={Colors.blackColor}
                    keyboardType="numeric"
                    style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding - 2.0, flex: 1 }}
                />
            </View>
        )
    }

    function emailTextField() {
        const input = createRef();
        return (
            <View style={{
                marginBottom: Sizes.fixPadding * 2.0,
                ...styles.textFieldWrapStyle,
            }}>
                <MaterialIcons
                    name="email"
                    color={Colors.blackColor}
                    size={16}
                    onPress={() => { input.current.focus() }}
                />
                <TextInput
                    ref={input}
                    value={email}
                    onChangeText={(text) => updateState({ email: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Email'
                    placeholderTextColor={Colors.blackColor}
                    keyboardType="email-address"
                    style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding - 2.0, flex: 1 }}
                />
            </View>
        )
    }

    function nameTextField() {
        const input = createRef();
        return (
            <View style={{
                marginBottom: Sizes.fixPadding * 2.0,
                ...styles.textFieldWrapStyle,
            }}>
                <MaterialIcons
                    name="person"
                    color={Colors.blackColor}
                    size={16}
                    onPress={() => { input.current.focus() }}
                />
                <TextInput
                    ref={input}
                    value={name}
                    onChangeText={(text) => updateState({ name: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Name'
                    placeholderTextColor={Colors.blackColor}
                    style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding - 2.0, flex: 1 }}
                />
            </View>
        )
    }

    function signupInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 3.0, alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/signIn_icon.png')}
                    style={{ width: 70.0, height: 70.0, resizeMode: 'contain' }}
                />
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.primaryColor22Bold }}>
                    Sign Up
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.blackColor17SemiBold }}>
                    Create new account
                </Text>
            </View>
        )
    }

    function topImage() {
        return (
            <View style={{ width: '100%', height: height / 3.7, }}>
                <Image
                    source={require('../../assets/images/top_image.png')}
                    style={{ width: '100%', height: height / 3.7, resizeMode: 'stretch' }}
                />
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.whiteColor}
                    size={22}
                    onPress={() => navigation.pop()}
                    style={{
                        position: 'absolute',
                        left: 20.0,
                        top: Platform.OS == 'ios' ? Sizes.fixPadding * 7.0 : 20.0 + StatusBar.currentHeight,
                    }}
                />
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
    textFieldStyle: {
        height: 40.0,
        width: width - 25.0,
        alignSelf: 'center',
    },
    textFieldWrapStyle: {
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: Colors.primaryColor,
        borderWidth: 2.0,
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        height: 50.0,
    },
    forgetPasswordTextStyle: {
        textAlign: 'right',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding + 5.0,
        ...Fonts.blackColor10SemiBold
    },
    signupButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    alreadyAccountInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 0,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SignupScreen;
