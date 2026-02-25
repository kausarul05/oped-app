import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import WriterDashboard from '../screens/Writer/WriterDashboard';
import Notifications from '../screens/Writer/WriterHome/Notifications';
import WriterHome from '../screens/Writer/WriterHome/WriterHome';
import WriterStoreDetail from '../screens/Writer/WriterHome/WriterStoreDetail';
// Import other writer screens

const Stack = createNativeStackNavigator();

export default function WriterNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="WriterHome" component={WriterHome} />
            <Stack.Screen name="WriterStoreDetail" component={WriterStoreDetail} />
            <Stack.Screen name="Notifications" component={Notifications} />
            {/* <Stack.Screen name="WriterDashboard" component={WriterDashboard} /> */}
            {/* Add more writer screens */}
        </Stack.Navigator>
    );
}