import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import Subscription from '../screens/Reader/Inbox/Settings/Subscription';
import AuthorProfile from '../screens/Reader/ReaderHome/AuthorProfile';
import CategoryStories from '../screens/Reader/ReaderHome/CategoryStories';
import DiscoverQuickLink from '../screens/Reader/ReaderHome/DiscoverQuickLink';
import LiveNewsDetail from '../screens/Reader/ReaderHome/LiveNewsDetail';
import ReaderHome from '../screens/Reader/ReaderHome/ReaderHome';
import SearchResults from '../screens/Reader/ReaderHome/SearchResults';
import StoryDetail from '../screens/Reader/ReaderHome/StoreDetail';
// Import other reader screens

const Stack = createNativeStackNavigator();

export default function ReaderNavigator() {
    const { colors } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.header,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontFamily: 'CoFoRaffine',
                    fontSize: 18,
                },
                contentStyle: {
                    backgroundColor: colors.background,
                },
                headerShown: false,
            }}>
            <Stack.Screen name="ReaderHome" component={ReaderHome} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen
                name="StoryDetail"
                component={StoryDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AuthorProfile"
                component={AuthorProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DiscoverQuickLink"
                component={DiscoverQuickLink}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryStories"
                component={CategoryStories}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LiveNews"
                component={LiveNews}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LiveNewsDetail"
                component={LiveNewsDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Subscription"
                component={Subscription}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}