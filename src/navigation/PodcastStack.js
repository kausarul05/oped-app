import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import PodcastDetail from '../screens/Podcast/PodcastDetail';
import PodcastHome from '../screens/Reader/Podcast/PodcastHome';
// import PodcastPlayer from '../screens/Podcast/PodcastPlayer';

const Stack = createNativeStackNavigator();

export default function PodcastStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PodcastHome" component={PodcastHome} />
            {/* <Stack.Screen name="PodcastDetail" component={PodcastDetail} />
            <Stack.Screen name="PodcastPlayer" component={PodcastPlayer} /> */}
        </Stack.Navigator>
    );
}