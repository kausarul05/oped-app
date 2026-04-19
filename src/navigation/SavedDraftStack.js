import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedDrafts from '../screens/Writer/SaveDrafts/SavedDrafts';
import WriterStoreDetail from '../screens/Writer/WriterHome/WriterStoreDetail';

const Stack = createNativeStackNavigator();

export default function SavedDraftStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SavedDraftsMain" component={SavedDrafts} />
            <Stack.Screen name="WriterStoreDetail" component={WriterStoreDetail} />
            {/* <Stack.Screen name="DraftDetail" component={DraftDetail} />
            <Stack.Screen name="PublishedArticles" component={PublishedArticles} />
            <Stack.Screen name="Archived" component={Archived} /> */}
        </Stack.Navigator>
    );
}