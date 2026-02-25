import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutUs from '../screens/Writer/WriterSettings/AboutUs';
import ChangePassword from '../screens/Writer/WriterSettings/ChangePassword';
import EditProfile from '../screens/Writer/WriterSettings/EditProfile';
import PrivacyPolicy from '../screens/Writer/WriterSettings/PrivacyPolicy';
import WriterSettings from '../screens/Writer/WriterSettings/Settings';
import TermsConditions from '../screens/Writer/WriterSettings/TermsConditions';

const Stack = createNativeStackNavigator();

export default function WriterSettingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="WriterSettingsMain" component={WriterSettings} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            {/* <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="AboutUs" component={AboutUs} /> */}
        </Stack.Navigator>
    );
}