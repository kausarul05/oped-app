import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePassword from '../screens/Reader/Inbox/Settings/ChangePassword';
import EditProfile from '../screens/Reader/Inbox/Settings/EditProfile';
import Profile from '../screens/Reader/Inbox/Settings/Profile';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ProfileMain" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
             <Stack.Screen name="ChangePassword" component={ChangePassword} />
           {/* <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Premium" component={Premium} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="AboutUs" component={AboutUs} /> */}
        </Stack.Navigator>
    );
}