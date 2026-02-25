import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedDrafts from '../screens/Writer/SaveDrafts/SavedDrafts';

const Stack = createNativeStackNavigator();

export default function SavedDraftStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SavedDraftsMain" component={SavedDrafts} />
            {/* <Stack.Screen name="DraftDetail" component={DraftDetail} />
            <Stack.Screen name="PublishedArticles" component={PublishedArticles} />
            <Stack.Screen name="Archived" component={Archived} /> */}
        </Stack.Navigator>
    );
}