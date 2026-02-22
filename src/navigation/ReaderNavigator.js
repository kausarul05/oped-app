import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import AuthorProfile from '../screens/Reader/ReaderHome/AuthorProfile';
import ReaderHome from '../screens/Reader/ReaderHome/ReaderHome';
import SearchResults from '../screens/Reader/ReaderHome/SearchResults';
import StoryDetail from '../screens/Reader/ReaderHome/StoreDetail';
// import ReaderProfile from '../screens/Reader/ReaderProfile';
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
            {/* <Stack.Screen name="ReaderProfile" component={ReaderProfile} /> */}
            {/* Add more reader screens */}
        </Stack.Navigator>
    );
}