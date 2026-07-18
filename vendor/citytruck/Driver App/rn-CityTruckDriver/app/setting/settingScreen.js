import React, { useState } from "react";
import { ScrollView, View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const notificationsSettingsList = [
    {
        id: '1',
        checked: true,
        notificationAbout: 'When admin send task'
    },
    {
        id: '2',
        checked: true,
        notificationAbout: 'When someone view my trip'
    },
    {
        id: '3',
        checked: true,
        notificationAbout: 'When i accept task'
    }
];

const SettingScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        password: null,
        newPassword: null,
        confirmPassword: null,
        notificationSettings: notificationsSettingsList,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        password,
        newPassword,
        confirmPassword,
        notificationSettings,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                        {changePasswordInfo()}
                        {notificationsInfo()}
                    </ScrollView>
                </View>
                {saveButton()}
            </View>
        </View>
    )

    function saveButton() {
        return (<TouchableOpacity
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

    function updateNotificationsSettings({ id }) {
        const newList = notificationSettings.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, checked: !item.checked };
                return updatedItem;
            }
            return item;
        });
        updateState({ notificationSettings: newList })
    }

    function notificationsInfo() {
        return (
            <View style={styles.notificationInfoWrapStyle}>
                <View style={styles.infoHeaderWrapStyle}>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                        Notifications
                    </Text>
                </View>
                <View style={{ paddingTop: Sizes.fixPadding + 5.0, paddingHorizontal: Sizes.fixPadding * 2.0, }}>
                    {
                        notificationSettings.map((item) => (
                            <View key={`${item.id}`}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => updateNotificationsSettings({ id: item.id })}
                                        style={{
                                            ...styles.checkBoxStyle,
                                            backgroundColor: item.checked ? Colors.lightGrayColor : Colors.whiteColor,
                                        }}
                                    >
                                        {item.checked
                                            ?
                                            <MaterialIcons
                                                name="check"
                                                color={Colors.blackColor}
                                                size={16}
                                            />
                                            :
                                            null
                                        }
                                    </TouchableOpacity>
                                    <Text style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.grayColor13Medium }}>
                                        {item.notificationAbout}
                                    </Text>
                                </View>
                                {divider()}
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    function changePasswordInfo() {
        return (
            <View style={styles.changePasswordInfoWrapStyle}>
                <View style={styles.infoHeaderWrapStyle}>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor14SemiBold }}>
                        Change Password
                    </Text>
                </View>
                <View style={{ paddingHorizontal: Sizes.fixPadding * 2.0, paddingTop: Sizes.fixPadding + 2.0, }}>
                    <TextInput
                        placeholder="Current Password"
                        placeholderTextColor={Colors.grayColor}
                        style={{ padding: 0, height: 20.0, ...Fonts.blackColor13Medium }}
                        selectionColor={Colors.primaryColor}
                        value={password}
                        onChangeText={(value) => updateState({ password: value })}
                        secureTextEntry
                        numberOfLines={1}
                    />
                    {divider()}
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor={Colors.grayColor}
                        style={{padding:0, height: 20.0, ...Fonts.blackColor13Medium }}
                        selectionColor={Colors.primaryColor}
                        value={newPassword}
                        onChangeText={(value) => updateState({ newPassword: value })}
                        secureTextEntry
                        numberOfLines={1}
                    />
                    {divider()}
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.grayColor}
                        style={{padding:0, height: 20.0, ...Fonts.blackColor13Medium }}
                        selectionColor={Colors.primaryColor}
                        value={confirmPassword}
                        onChangeText={(value) => updateState({ confirmPassword: value })}
                        secureTextEntry
                        numberOfLines={1}
                    />
                    {divider()}
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
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
                    Setting
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
    infoHeaderWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0,
        padding: Sizes.fixPadding,
    },
    changePasswordInfoWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    checkBoxStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: Sizes.fixPadding - 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
    },
    notificationInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        ...CommonStyles.shadow,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding * 2.0,
    },
    saveButtonStyle: {
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
    },
});

export default SettingScreen;
