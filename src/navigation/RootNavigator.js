import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import SliderStory from '../screens/Home/SliderStory/SliderStory';
import SplashScreen from '../screens/Splash/SplashScreen';

// Import your screens


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    paddingTop: 30,
                },
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="Home" component={SliderStory} />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
}
