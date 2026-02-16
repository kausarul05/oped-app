import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import Verification from '../screens/Auth/Verification';
import SliderStory from '../screens/Home/SliderStory/SliderStory';
import SplashScreen from '../screens/Splash/SplashScreen';

// Import your screens


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { colors } = useTheme();
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
            
            <Stack.Screen name="Home" component={SliderStory} />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
}
