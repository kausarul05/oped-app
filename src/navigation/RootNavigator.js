import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import FPVerification from '../screens/Auth/FPVerification';
import Login from '../screens/Auth/Login';
import NewPassword from '../screens/Auth/NewPassword';
import SignUp from '../screens/Auth/SignUp';
import Verification from '../screens/Auth/Verification';
import SliderStory from '../screens/Home/SliderStory/SliderStory';
import SplashScreen from '../screens/Splash/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import WriterNavigator from './WriterNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { colors } = useTheme();
    const { userRole, isLoading } = useRole();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // If user is logged in, navigate to role-based screen
    if (userRole) {
        return userRole === 'reader' ? <BottomTabNavigator /> : <WriterNavigator />;
    }
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.header,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontFamily: 'CoFo Raffine',
                    fontSize: 18,
                },
                contentStyle: {
                    backgroundColor: colors.background,
                },
                headerShown: false,
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FPVerification"
                component={FPVerification}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NewPassword"
                component={NewPassword}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="Home" component={SliderStory} />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
}
