import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ChatDetail from '../screens/Inbox/ChatDetail';
import InboxAuthProfile from '../screens/Reader/Inbox/InboxAuthProfile';
import InboxHome from '../screens/Reader/Inbox/InboxHome';
import Newsletter from '../screens/Reader/Inbox/Newsletter';
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
             <Stack.Screen name="Newsletter" component={Newsletter} />
             <Stack.Screen name="InboxAuthProfile" component={InboxAuthProfile} />
            {/* <Stack.Screen name="ChatDetail" component={ChatDetail} />
            <Stack.Screen name="Notifications" component={Notifications} /> */}
        </Stack.Navigator>
    );
}