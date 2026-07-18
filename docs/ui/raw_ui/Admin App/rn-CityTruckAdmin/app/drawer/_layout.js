import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '../../components/drawerContent';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawer {...props}/>}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'front'
                }}
            >
                <Drawer.Screen name="home/homeScreen" />
            </Drawer>
        </GestureHandlerRootView>
    );
}