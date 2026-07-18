import React, { useState, createRef } from "react";
import { View, Dimensions, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet, Text, TextInput } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get('window');

const SigninScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        emailOrMoNumber: null,
        password: null,
        passwordSecure: true,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        emailOrMoNumber,
        password,
        passwordSecure,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
            <View style={{ flex: 1 }}>
                {topImage()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {signinInfo()}
                    {emailOrMobileNoTextField()}
                    {passwordTextField()}
                    {forgetPasswordText()}
                    {signinButton()}
                    {orConnectText()}
                    {googleAndFacebookOption()}
                    {dontAccountInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function dontAccountInfo() {
        return (
            <View style={styles.dontAccountInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor13SemiBold }}>
                    Dont' have an account?
                </Text>
                <Text
                    onPress={() => navigation.push('auth/signupScreen')}
                    style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.primaryColor13Bold }}
                >
                    Sign up now!
                </Text>
            </View>
        )
    }

    function googleAndFacebookOption() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#4267B2', ...styles.googleAndFacebookIconWrapStyle, }}>
                    <Image
                        source={require('../../assets/images/icons/facebook-icon.png')}
                        style={{ width: 20.0, height: 20.0, resizeMode: 'contain' }}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor14SemiBold }}>
                        Facebook
                    </Text>
                </View>
                <View style={{ backgroundColor: '#EA4335', ...styles.googleAndFacebookIconWrapStyle }}>
                    <Image
                        source={require('../../assets/images/icons/google-icon.png')}
                        style={{ width: 25.0, height: 20.0, resizeMode: 'contain' }}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor14SemiBold }}>
                        Google+
                    </Text>
                </View>
            </View>
        )
    }

    function orConnectText() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding, alignItems: 'center' }}>
                <Text style={{ ...Fonts.primaryColor15Bold }}>
                    OR
                </Text>
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                    Connect with
                </Text>
            </View>
        )
    }

    function signinButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('auth/signupScreen')}
                style={{ marginVertical: Sizes.fixPadding * 3.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A']}
                    style={styles.signinButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Sign In
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function forgetPasswordText() {
        return (
            <Text style={styles.forgetPasswordTextStyle}>
                Forget your Password?
            </Text>
        )
    }

    function passwordTextField() {
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
                    value={password}
                    onChangeText={(text) => updateState({ password: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Password'
                    placeholderTextColor={Colors.blackColor}
                    secureTextEntry={passwordSecure}
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

    function emailOrMobileNoTextField() {
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
                    value={emailOrMoNumber}
                    onChangeText={(text) => updateState({ emailOrMoNumber: text })}
                    selectionColor={Colors.primaryColor}
                    placeholder='Email or Mobile Number'
                    placeholderTextColor={Colors.blackColor}
                    keyboardType="email-address"
                    style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding - 2.0, flex: 1 }}
                />
            </View>
        )
    }

    function signinInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 3.0, alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/signIn_icon.png')}
                    style={{ width: 70.0, height: 70.0, resizeMode: 'contain' }}
                />
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.primaryColor22Bold }}>
                    Sign In
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.blackColor17SemiBold }}>
                    Sign in to your account
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
    signinButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    googleAndFacebookIconWrapStyle: {
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dontAccountInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 3.0,
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

export default SigninScreen;
