import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ChatDetail from '../screens/Inbox/ChatDetail';
import InboxHome from '../screens/Reader/Inbox/InboxHome';
import StoryDetail from '../screens/Reader/ReaderHome/StoreDetail';
// import Notifications from '../screens/Inbox/Notifications';

const Stack = createNativeStackNavigator();

export default function InboxStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="InboxHome" component={InboxHome} />
            <Stack.Screen name="StoryDetail" component={StoryDetail} />
            {/* <Stack.Screen name="ChatDetail" component={ChatDetail} />
            <Stack.Screen name="Notifications" component={Notifications} /> */}
        </Stack.Navigator>
    );
}