import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddLiveNews from '../screens/Writer/CreateArticle/AddLiveNews';
import AddStory from '../screens/Writer/CreateArticle/AddStore';
import CreateArticle from '../screens/Writer/CreateArticle/CreateArticle';

const Stack = createNativeStackNavigator();

export default function WriteStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="CreateArticle" component={CreateArticle} />
            <Stack.Screen name="AddStory" component={AddStory} />
            <Stack.Screen name="AddLiveNews" component={AddLiveNews} />
            {/* <Stack.Screen name="CreatePodcast" component={CreatePodcast} />
            <Stack.Screen name="EditDraft" component={EditDraft} />
            <Stack.Screen name="PublishSettings" component={PublishSettings} /> */}
        </Stack.Navigator>
    );
}