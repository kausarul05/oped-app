import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import WriterDashboard from '../screens/Writer/WriterDashboard';
import WriterHome from '../screens/Writer/WriterHome/WriterHome';
// Import other writer screens

const Stack = createNativeStackNavigator();

export default function WriterNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="WriterHome" component={WriterHome} />
            {/* <Stack.Screen name="WriterDashboard" component={WriterDashboard} /> */}
            {/* Add more writer screens */}
        </Stack.Navigator>
    );
}