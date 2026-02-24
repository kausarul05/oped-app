import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutUs from '../screens/Reader/Inbox/Settings/AboutUs';
import ChangePassword from '../screens/Reader/Inbox/Settings/ChangePassword';
import EditProfile from '../screens/Reader/Inbox/Settings/EditProfile';
import PrivacyPolicy from '../screens/Reader/Inbox/Settings/PrivacyPolicy';
import Profile from '../screens/Reader/Inbox/Settings/Profile';
import Subscription from '../screens/Reader/Inbox/Settings/Subscription';
import TermsConditions from '../screens/Reader/Inbox/Settings/TermsConditions';

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
             <Stack.Screen name="Premium" component={Subscription} />
             <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
             <Stack.Screen name="TermsConditions" component={TermsConditions} />
             <Stack.Screen name="AboutUs" component={AboutUs} />
           {/* <Stack.Screen name="Notifications" component={Notifications} />
            
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="AboutUs" component={AboutUs} /> */}
        </Stack.Navigator>
    );
}