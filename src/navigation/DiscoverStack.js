import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Subscription from '../screens/Reader/Inbox/Settings/Subscription';
import AuthorProfile from '../screens/Reader/ReaderHome/AuthorProfile';
import CategoryStories from '../screens/Reader/ReaderHome/CategoryStories';
import DiscoverQuickLink from '../screens/Reader/ReaderHome/DiscoverQuickLink';
import LiveNews from '../screens/Reader/ReaderHome/LiveNews';
import ReaderHome from '../screens/Reader/ReaderHome/ReaderHome';
import StoryDetail from '../screens/Reader/ReaderHome/StoreDetail';
import Notifications from '../screens/Writer/WriterHome/Notifications';

const Stack = createNativeStackNavigator();

export default function DiscoverStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ReaderHome" component={ReaderHome} />
            <Stack.Screen name="StoryDetail" component={StoryDetail} />
            <Stack.Screen name="AuthorProfile" component={AuthorProfile} />
            <Stack.Screen name="DiscoverQuickLink" component={DiscoverQuickLink} />
            <Stack.Screen name="CategoryStories" component={CategoryStories} />
            <Stack.Screen name="LiveNews" component={LiveNews} />
            <Stack.Screen
                name="Subscription"
                component={Subscription}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
            />
        </Stack.Navigator>
    );
}