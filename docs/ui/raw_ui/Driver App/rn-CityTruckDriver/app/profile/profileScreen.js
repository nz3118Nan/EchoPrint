import React, { useState, createRef } from "react";
import { View, ScrollView, Modal, TouchableOpacity, Image, StyleSheet, Text, TextInput } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const ProfileScreen = () => {

    const navigation = useNavigation();

    const dateObj = new Date();
    const todayDate = `${dateObj.getUTCMonth() + 2}/${dateObj.getUTCFullYear() + 2}`;

    const [state, setState] = useState({
        name: 'Damien Braun',
        mobileNumber: '(+91) 12345467890',
        email: 'damienbraun@gmail.com',
        drivingExperience: '5-6 Years',
        lincenseValidity: null,
        showCalender: false,
        showBottomSheet: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        name,
        mobileNumber,
        email,
        drivingExperience,
        lincenseValidity,
        showCalender,
        showBottomSheet
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <View style={{ flex: 1, marginTop: -Sizes.fixPadding * 4.0, }}>
                    {profilePic()}
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                        {profileInfo()}
                    </ScrollView>
                </View>
            </View>
            {changeProfilePicOptionsSheet()}
        </View>
    )

    function changeProfilePicOptionsSheet() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBottomSheet}
                onRequestClose={() => {
                    updateState({ showBottomSheet: false });
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        updateState({ showBottomSheet: false });;
                    }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{}}
                        >
                            <View style={{ backgroundColor: Colors.whiteColor, paddingBottom: Sizes.fixPadding + 5.0, paddingTop: Sizes.fixPadding * 2.0, }}>
                                <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: 'center' }}>
                                    Choose Option
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => { updateState({ showBottomSheet: false }) }}
                                    style={{ marginVertical: Sizes.fixPadding + 10.0, flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding * 2.0 }}
                                >
                                    <MaterialIcons name="photo-camera" size={18} color={Colors.blackColor} />
                                    <Text style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding }}>
                                        Take picture
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => { updateState({ showBottomSheet: false }) }}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding * 2.0 }}
                                >
                                    <MaterialIcons name="photo-library" size={18} color={Colors.blackColor} />
                                    <Text style={{ ...Fonts.blackColor13Medium, marginLeft: Sizes.fixPadding }}>
                                        Select from gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function calender() {
        const handleConfirm = (e, date) => {
            updateState({ lincenseValidity: `${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`, showCalender: false })
        };

        return (
            showCalender && <DateTimePicker
                value={new Date()}
                mode="date"
                onChange={handleConfirm}
                minimumDate={new Date()}
                accentColor={Colors.primaryColor}
                style={{marginVertical:Sizes.fixPadding*2.0}}
            />
        )
    }

    function profileInfo() {
        return (
            <View style={styles.profileInfoWrapStyle}>
                {nameInfo()}
                {divider()}
                {mobileNumberInfo()}
                {divider()}
                {emailInfo()}
                {divider()}
                {drivingExperienceInfo()}
                {divider()}
                {linceValidityInfo()}
                {calender()}
                {divider()}
            </View>
        )
    }

    function linceValidityInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.grayColor13Medium }}>
                    License Validity
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                        onPress={() => updateState({ showCalender: true })}
                        style={{ flex: 1, marginTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor13Medium }}
                    >
                        Up to {lincenseValidity ? lincenseValidity : todayDate}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { updateState({ showCalender: true }) }}
                        style={{marginLeft:Sizes.fixPadding}}
                    >
                        <Image
                            source={require('../../assets/images/icons/edit_icon.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function drivingExperienceInfo() {
        const input = createRef();
        return (
            <View>
                <Text style={{ ...Fonts.grayColor13Medium }}>
                    Driving Experience
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        ref={input}
                        value={drivingExperience}
                        onChangeText={(text) => updateState({ drivingExperience: text })}
                        selectionColor={Colors.primaryColor}
                        style={{ padding: 0, ...Fonts.blackColor13Medium, flex: 1 }}
                        numberOfLines={1}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { input.current.focus() }}
                        style={{marginLeft:Sizes.fixPadding}}
                    >
                        <Image
                            source={require('../../assets/images/icons/edit_icon.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function emailInfo() {
        const input = createRef();
        return (
            <View>
                <Text style={{ ...Fonts.grayColor13Medium }}>
                    Email Address
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        ref={input}
                        value={email}
                        onChangeText={(text) => updateState({ email: text })}
                        selectionColor={Colors.primaryColor}
                        style={{padding:0, ...Fonts.blackColor13Medium, flex: 1 }}
                        keyboardType="email-address"
                        numberOfLines={1}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { input.current.focus() }}
                        style={{marginLeft:Sizes.fixPadding}}
                    >
                        <Image
                            source={require('../../assets/images/icons/edit_icon.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function mobileNumberInfo() {
        const input = createRef();
        return (
            <View>
                <Text style={{ ...Fonts.grayColor13Medium }}>
                    Mobile Number
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        ref={input}
                        value={mobileNumber}
                        onChangeText={(text) => updateState({ mobileNumber: text })}
                        selectionColor={Colors.primaryColor}
                        keyboardType="phone-pad"
                        style={{padding:0, ...Fonts.blackColor13Medium, flex: 1 }}
                        numberOfLines={1}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { input.current.focus() }}
                        style={{marginLeft:Sizes.fixPadding}}
                    >
                        <Image
                            source={require('../../assets/images/icons/edit_icon.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
        )
    }

    function nameInfo() {
        const input = createRef();
        return (
            <View>
                <Text style={{ ...Fonts.grayColor13Medium }}>
                    Name
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        ref={input}
                        value={name}
                        onChangeText={(text) => updateState({ name: text })}
                        selectionColor={Colors.primaryColor}
                        style={{padding:0, ...Fonts.blackColor13Medium, flex: 1 }}
                        numberOfLines={1}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { input.current.focus() }}
                        style={{marginLeft:Sizes.fixPadding}}
                    >
                        <Image
                            source={require('../../assets/images/icons/edit_icon.png')}
                            style={{ width: 12.0, height: 12.0, resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function profilePic() {
        return (
            <View style={{ alignSelf: 'center', alignItems: 'center', }}>
                <Image
                    source={require('../../assets/images/users/user1.png')}
                    style={{ width: 90.0, height: 90.0, borderRadius: 45.0, }}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { updateState({ showBottomSheet: true }) }}
                    style={styles.cameraIconWrapStyle}
                >
                    <MaterialIcons
                        name="camera-alt"
                        color={Colors.blackColor}
                        size={12}
                    />
                </TouchableOpacity>
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
                    Damien Braun
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
    cameraIconWrapStyle: {
        position: 'absolute',
        bottom: 3.0,
        right: 10.0,
        backgroundColor: Colors.lightGrayColor,
        width: 27.0,
        height: 27.0,
        borderRadius: 15.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textFieldWrapStyle: {
        marginLeft: -Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        borderBottomColor: Colors.whiteColor,
        borderBottomWidth: 1.0,
        height: 22.0,
    },
    profileInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 1.0,
        borderColor: '#ececec',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding + 10.0,
        marginHorizontal: Sizes.fixPadding * 3.0,
        marginVertical: Sizes.fixPadding * 3.0,
        ...CommonStyles.shadow
    }
});

export default ProfileScreen;