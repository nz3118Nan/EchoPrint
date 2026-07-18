import React from "react";
import { View, ImageBackground, ScrollView, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const ContactUsScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/map_bg2.png')}
                style={{ flex: 1, }}
            >
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {addressInfo()}
                        {callingInfo()}
                        {mailInfo()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function mailInfo() {
        return (
            <View style={styles.infoWrapStyle}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor14SemiBold }}>
                    Mail Us
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor13Medium }}>
                        info@citytrucks.com
                    </Text>
                    <MaterialIcons
                        name="mail"
                        size={18}
                        color={Colors.grayColor}
                    />
                </View>
            </View>
        )
    }

    function callingInfo() {
        return (
            <View style={{ ...styles.infoWrapStyle, marginVertical: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor14SemiBold }}>
                    Call Us
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor13Medium }}>
                        (+91) 1234567890
                    </Text>
                    <MaterialIcons
                        name="phone"
                        size={18}
                        color={Colors.grayColor}
                    />
                </View>
            </View>
        )
    }

    function addressInfo() {
        return (
            <View style={styles.infoWrapStyle}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor14SemiBold }}>
                    Write Here
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor13Medium }}>
                        {`786 Maynard Rd,Calgary,Canada\nGolden tower,Canada`}
                    </Text>
                    <FontAwesome
                        name="location-arrow"
                        size={18}
                        color={Colors.grayColor}
                        style={{ alignSelf: 'flex-end' }}
                    />
                </View>
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
                    Contact Us
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
    infoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding + 5.0,
    }
});

export default ContactUsScreen;
