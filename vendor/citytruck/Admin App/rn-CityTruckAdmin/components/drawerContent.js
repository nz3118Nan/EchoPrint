import { DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/styles';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MyStatusBar from './myStatusBar';
import { useNavigation } from 'expo-router';

const CustomDrawer = (props) => {

    const navigation = useNavigation();

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <MyStatusBar />
            <DrawerContentScrollView
                contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.whiteColor, }}
                showsVerticalScrollIndicator={false}
            >
                {drawerContent()}
            </DrawerContentScrollView>
        </View>
    );

    function drawerContent() {
        return (
            <View style={styles.drawerStyle}>
                <View style={{
                    marginTop: Sizes.fixPadding + 10.0,
                    marginBottom: Sizes.fixPadding * 3.0
                }}>
                    <View style={{ margin: Sizes.fixPadding * 2.0, alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/users/user1.png')}
                            style={{
                                width: 100.0,
                                height: 100.0,
                                borderRadius: 50.0,
                            }}
                        />
                        <Text style={{ ...Fonts.blackColor14SemiBold, marginTop: Sizes.fixPadding, }}>
                            Damien Braun
                        </Text>
                        <Text style={{ ...Fonts.grayColor12Regular }}>
                            Seven Star Transportaions
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => props.navigation.closeDrawer()}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialIcons name="home" color={Colors.blackColor} size={22} />,
                            option: 'Home'
                        })}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => {
                            navigation.push('trucks/trucksScreen');
                            props.navigation.closeDrawer();
                        }}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialCommunityIcons name="truck" size={22} color={Colors.blackColor} />,
                            option: 'My Trucks'
                        })}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => {
                            navigation.push('drivers/driversScreen');
                            props.navigation.closeDrawer();
                        }}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialIcons name="person-pin" color={Colors.blackColor} size={22} />,
                            option: 'My Drivers'
                        })}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => {
                            navigation.push('termsAndConditions/termsAndConditionsScreen');
                            props.navigation.closeDrawer();
                        }}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialIcons name="sticky-note-2" color={Colors.blackColor} size={22} />,
                            option: 'Terms & Conditions'
                        })}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.99}
                        onPress={() => {
                            navigation.push('contactUs/contactUsScreen');
                            props.navigation.closeDrawer();
                        }}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialIcons name="perm-phone-msg" color={Colors.blackColor} size={22} />,
                            option: 'Contact Us'
                        })}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setShowLogoutDialog(true)}
                    >
                        {drawerOptionsSort({
                            icon: <MaterialIcons name="logout" color={Colors.blackColor} size={22} />,
                            option: 'Logout'
                        })}
                    </TouchableOpacity>
                </View>
                {logOutDialog()}
            </View>
        );
    };

    function drawerOptionsSort({ icon, option }) {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 10.0, marginHorizontal: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                {icon}
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor13SemiBold }}>
                    {option}
                </Text>
            </View>
        )
    }

    function logOutDialog() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showLogoutDialog}
                onRequestClose={() => { setShowLogoutDialog(false) }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        setShowLogoutDialog(false);
                    }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ width: '80%', alignSelf: 'center' }}
                        >
                            <View style={styles.dialogStyle}>
                                <Text style={{ ...Fonts.blackColor16SemiBold, paddingBottom: Sizes.fixPadding }}>
                                    You want to Logout
                                </Text>
                                <View style={styles.cancelAndLogoutButtonWrapStyle}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => setShowLogoutDialog(false)}
                                        style={styles.cancelButtonStyle}
                                    >
                                        <Text style={{ ...Fonts.blackColor14SemiBold }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setShowLogoutDialog(false);
                                            navigation.push('logout/logoutScreen');
                                            props.navigation.closeDrawer();
                                        }}
                                        style={{ flex: 1, marginLeft: Sizes.fixPadding, borderRadius: Sizes.fixPadding - 5.0, }}
                                    >
                                        <LinearGradient
                                            colors={['#FD5D8D', '#BF124A',]}
                                            style={styles.logOutButtonStyle}
                                        >
                                            <Text style={{ ...Fonts.whiteColor14SemiBold }}>Logout</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

};

const styles = StyleSheet.create({
    drawerStyle: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        paddingTop: Sizes.fixPadding * 10.0,
        margin: -12
    },
    dialogStyle: {
        padding: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
    },
    cancelButtonStyle: {
        flex: 1,
        backgroundColor: '#E2E2E2',
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        marginRight: Sizes.fixPadding,
    },
    logOutButtonStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelAndLogoutButtonWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
    },
})

export default CustomDrawer;