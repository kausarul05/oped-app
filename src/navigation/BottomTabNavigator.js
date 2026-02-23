import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoverStack from './DiscoverStack';
import InboxStack from './InboxStack';
import PodcastStack from './PodcastStack';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Discover') {
                        iconName = focused ? 'compass' : 'compass-outline';
                    } else if (route.name === 'Podcast') {
                        iconName = focused ? 'headset' : 'headset-outline';
                    } else if (route.name === 'Inbox') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4B59B3',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'CoFoRaffineMedium',
                },
            })}
        >
            <Tab.Screen 
                name="Discover" 
                component={DiscoverStack} 
                options={{
                    tabBarLabel: 'Discover',
                }}
            />
            <Tab.Screen 
                name="Podcast" 
                component={PodcastStack} 
                options={{
                    tabBarLabel: 'Podcast',
                }}
            />
            <Tab.Screen 
                name="Inbox" 
                component={InboxStack} 
                options={{
                    tabBarLabel: 'Inbox',
                }}
            />
        </Tab.Navigator>
    );
}