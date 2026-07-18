import React, { useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View, Modal, Image, StatusBar, StyleSheet, Text, Platform, } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { CircleFade } from 'react-native-animated-spinkit';
import { OtpInput } from 'react-native-otp-entry';
import { useNavigation } from "expo-router";

const { height, width } = Dimensions.get('window');

const VerificationScreen = () => {

    const navigation = useNavigation();

    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
            <View style={{ flex: 1 }}>
                {topImage()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {verificationTitle()}
                    {verifyInfo()}
                    {otpFields()}
                    {submitButton()}
                </ScrollView>
                {loadingDialog()}
            </View>
        </View>
    )

    function loadingDialog() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isLoading}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ width: '80%', alignSelf: 'center' }}
                        >
                            <View style={styles.dialogWrapStyle}>
                                <CircleFade size={56} color={Colors.primaryColor} />
                                <Text style={{ ...Fonts.grayColor13Medium, marginTop: Sizes.fixPadding * 2.0 }}>
                                    Please wait...
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    function submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setisLoading(true)
                    setTimeout(() => {
                        setisLoading(false)
                        navigation.push('drawer')
                    }, 2000);
                }}
                style={{ marginBottom: Sizes.fixPadding + 5.0, marginTop: Sizes.fixPadding * 4.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <LinearGradient
                    colors={['#FD5D8D', '#BF124A',]}
                    style={styles.submitButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Submit
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function otpFields() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 4.0, marginTop: Sizes.fixPadding * 4.0, }}>
                <OtpInput
                    numberOfDigits={4}
                    focusColor={Colors.primaryColor}
                    onTextChange={text => {
                        if (text.length == 4) {
                            setotpInput(text)
                            setisLoading(true);
                            setTimeout(() => {
                                setisLoading(false);
                                navigation.push('drawer');
                            }, 2000);
                        }
                    }}
                    theme={{
                        inputsContainerStyle: {
                            justifyContent: 'center',
                        },
                        pinCodeContainerStyle: { ...styles.textFieldStyle },
                        pinCodeTextStyle: { ...Fonts.blackColor20Medium },
                        focusedPinCodeContainerStyle: { borderWidth: 1.5 }
                    }}
                />
            </View>
        )
    }

    function verifyInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 3.0, alignItems: 'center' }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor17SemiBold }}>
                    Verify Code
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor13Medium }}>
                    {`Please check your message and\nenter verification code we just send you\n(+91) 1234567890`}
                </Text>
            </View>
        )
    }

    function verificationTitle() {
        return (
            <Text style={{ textAlign: 'center', marginTop: Sizes.fixPadding, ...Fonts.primaryColor22Bold }}>
                Phone Verification
            </Text>
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
        marginHorizontal: Sizes.fixPadding,
        width: width / 8.5,
        height: width / 8.5,
        backgroundColor: '#DE98AF',
        borderRadius: Sizes.fixPadding - 5.0,
        borderWidth: 0,
    },
    submitButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        padding: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
    },
});

export default VerificationScreen;