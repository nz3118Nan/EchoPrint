import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const termsOfUseList = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
];

const TermsAndConditionsScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {termsOfUseInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function termsOfUseInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View style={{ marginVertical: Sizes.fixPadding * 2.0, }}>
                    <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor15SemiBold }}>
                        Terms of use
                    </Text>
                    <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.grayColor12Medium }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Text>
                </View>
                {
                    termsOfUseList.map((item, index) => (
                        <View key={`${index}`}
                            style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding + 5.0, }}
                        >
                            <View style={{ marginTop: Sizes.fixPadding - 5.0, backgroundColor: Colors.primaryColor, height: 10.0, width: 10.0, borderRadius: 5.0, }} />
                            <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor12Medium }}>
                                {item}
                            </Text>
                        </View>
                    ))
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
                    Terms & Conditions
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
});

export default TermsAndConditionsScreen;
